/* UTILITY FUNCTIONS */
function _each (object, callback, thisObj) {
  if (!object) {
    return Promise.resolve();
  }
  var results;
  var fns = [];
  if (Object.prototype.toString.call(object) === '[object Array]') {
    results    = [];
    var length = object.length;
    for (var idx = 0 ; idx < length ; idx++) {
      var value = callback.call(thisObj || this, object[idx], idx);
      if (value) {
        if (value instanceof Promise) {
          value = value.then(function (key, value) {
            results[key] = value;
          }.bind(this, idx));
        } else {
          results[idx] = value;
        }
        fns.push(value);
      }
    }
  } else {
    results = {};
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        var value = callback.call(thisObj || this, object[key], key);
        if (value) {
          if (value instanceof Promise) {
            value = value.then(function (key, value) {
              results[key] = value;
            }.bind(this, key));
          } else {
            results[key] = value;
          }
          fns.push(value);
        }
      }
    }
  }
  return Promise.all(fns).then(function () {
    return results;
  });
}

function resolveURL (url, path) {
  // Invalid URL
  if (typeof url !== 'string' || url === '') {
    return '';
  }
  // Absolute URL http://,https://,//
  if (/^(https?:)?\/\//i.test(url)) {
    return url;
  }
  // Data URI
  if (/^data:.*,.*$/i.test(url)) {
    return url;
  }
  // Blob URL
  if (/^blob:.*$/i.test(url)) {
    return url;
  }
  // Relative URL
  return path + url;
}

function convertUint8ArrayToString (array) {
  if (window.TextDecoder !== undefined) {
    return new TextDecoder().decode(array);
  }
  // Avoid the String.fromCharCode.apply(null, array) shortcut, which
  // throws a "maximum call stack size exceeded" error for large arrays.
  var s = '';
  for (var i = 0, il = array.length ; i < il ; i++) {
    s += String.fromCharCode(array[i]);
  }
  return s;
}

/**
 * Specification:
 * https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
 */
function createDefaultMaterial () {
  return new THREE.MeshStandardMaterial({
                                          color      : 0xFFFFFF,
                                          emissive   : 0x000000,
                                          metalness  : 1,
                                          roughness  : 1,
                                          transparent: false,
                                          depthTest  : true,
                                          side       : THREE.FrontSide
                                        });
}

/**
 * Specification:
 * https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
 *
 * TODO: Implement support for morph targets on TANGENT attribute.
 *
 * @param {THREE.Mesh} mesh
 * @param {GLTF.Mesh} meshDef
 * @param {GLTF.Primitive} primitiveDef
 * @param {Object} dependencies
 */
function addMorphTargets (mesh, meshDef, primitiveDef, dependencies) {
  var geometry             = mesh.geometry;
  var material             = mesh.material;
  var targets              = primitiveDef.targets;
  var morphAttributes      = geometry.morphAttributes;
  morphAttributes.position = [];
  morphAttributes.normal   = [];
  material.morphTargets    = true;
  for (var i = 0, il = targets.length ; i < il ; i++) {
    var target        = targets[i];
    var attributeName = 'morphTarget' + i;
    var positionAttribute, normalAttribute;
    if (target.POSITION !== undefined) {
      // Three.js morph formula is
      //   position
      //     + weight0 * ( morphTarget0 - position )
      //     + weight1 * ( morphTarget1 - position )
      //     ...
      // while the glTF one is
      //   position
      //     + weight0 * morphTarget0
      //     + weight1 * morphTarget1
      //     ...
      // then adding position to morphTarget.
      // So morphTarget value will depend on mesh's position, then
      // cloning attribute for the case if attribute is shared among two
      // or more meshes.
      positionAttribute = dependencies.accessors[target.POSITION].clone();
      var position      = geometry.attributes.position;
      for (var j = 0, jl = positionAttribute.count ; j < jl ; j++) {
        positionAttribute.setXYZ(
            j,
            positionAttribute.getX(j) + position.getX(j),
            positionAttribute.getY(j) + position.getY(j),
            positionAttribute.getZ(j) + position.getZ(j)
        );
      }
    } else if (geometry.attributes.position) {
      // Copying the original position not to affect the final position.
      // See the formula above.
      positionAttribute = geometry.attributes.position.clone();
    }
    if (positionAttribute !== undefined) {
      positionAttribute.name = attributeName;
      morphAttributes.position.push(positionAttribute);
    }
    if (target.NORMAL !== undefined) {
      material.morphNormals = true;
      // see target.POSITION's comment
      normalAttribute       = dependencies.accessors[target.NORMAL].clone();
      var normal            = geometry.attributes.normal;
      for (var j = 0, jl = normalAttribute.count ; j < jl ; j++) {
        normalAttribute.setXYZ(
            j,
            normalAttribute.getX(j) + normal.getX(j),
            normalAttribute.getY(j) + normal.getY(j),
            normalAttribute.getZ(j) + normal.getZ(j)
        );
      }
    } else if (geometry.attributes.normal !== undefined) {
      normalAttribute = geometry.attributes.normal.clone();
    }
    if (normalAttribute !== undefined) {
      normalAttribute.name = attributeName;
      morphAttributes.normal.push(normalAttribute);
    }
  }
  mesh.updateMorphTargets();
  if (meshDef.weights !== undefined) {
    for (var i = 0, il = meshDef.weights.length ; i < il ; i++) {
      mesh.morphTargetInfluences[i] = meshDef.weights[i];
    }
  }
}

/* GLTF PARSER */
export class GLTFParser {
  constructor (json, extensions, options) {
    this.json          = json || {};
    this.extensions    = extensions || {};
    this.options       = options || {};
    // loader object cache
    this.cache         = new GLTFRegistry();
    this.textureLoader = new THREE.TextureLoader(this.options.manager);
    this.textureLoader.setCrossOrigin(this.options.crossOrigin);
    this.fileLoader = new THREE.FileLoader(this.options.manager);
    this.fileLoader.setResponseType('arraybuffer');
  }
  
  _withDependencies (dependencies) {
    const _dependencies = {};
    
    for (const dependency of dependencies) {
      const fnName = `load${dependency.charAt(0)
                                      .toUpperCase()}${dependency.slice(1)}`;
      const cached = this.cache.get(dependency);
      if (cached !== undefined) {
        _dependencies[dependency] = cached;
      } else if (this[fnName]) {
        const fn = this[fnName]();
        this.cache.add(dependency, fn);
        _dependencies[dependency] = fn;
      }
    }
    
    return _each(_dependencies, dependency => dependency);
  }
  
  parse (onLoad, onError) {
    const json   = this.json;
    const parser = this;
    // Clear the loader cache
    this.cache.removeAll();
    // Fire the callback on complete
    this._withDependencies([
                             'scenes',
                             'animations'
                           ]).then(dependencies => {
      const scenes     = dependencies.scenes || [];
      const scene      = scenes[json.scene || 0];
      const animations = dependencies.animations || [];
      parser.getDependencies('camera').then(cameras => {
        onLoad(scene, scenes, cameras, animations);
      }).catch(onError);
    }).catch(onError);
  }
  
  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object>}
   */
  getDependency (type, index) {
    const cacheKey = `${type}:${index}`;
    let dependency = this.cache.get(cacheKey);
    if (!dependency) {
      const fnName = `load${type.charAt(0).toUpperCase()}${type.slice(1)}`;
      dependency   = this[fnName](index);
      this.cache.add(cacheKey, dependency);
    }
    return dependency;
  }
  
  /**
   * Requests all dependencies of the specified type asynchronously, with
   * caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies (type) {
    const parser = this;
    const defs   = this.json[`${type}s`] || [];
    return Promise.all(
        defs.map((def, index) => parser.getDependency(type, index)));
  }
  
  /**
   * Specification:
   * https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer (bufferIndex) {
    const bufferDef = this.json.buffers[bufferIndex];
    const loader    = this.fileLoader;
    if (bufferDef.type && bufferDef.type !== 'arraybuffer') {
      throw new Error(
          `THREE.GLTFLoader: ${bufferDef.type} buffer type is not supported.`);
    }
    // If present, GLB container is required to be the first buffer.
    if (bufferDef.uri === undefined && bufferIndex === 0) {
      return Promise.resolve(
          this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
    }
    const options = this.options;
    return new Promise((resolve, reject) => {
      loader.load(
          resolveURL(bufferDef.uri, options.path), resolve, undefined,
          () => {
            reject(new Error(
                `THREE.GLTFLoader: Failed to load buffer "${bufferDef.uri}".`));
          }
      );
    });
  }
  
  /**
   * Specification:
   * https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView (bufferViewIndex) {
    const bufferViewDef = this.json.bufferViews[bufferViewIndex];
    return this.getDependency('buffer', bufferViewDef.buffer).then(
        buffer => {
          const byteLength = bufferViewDef.byteLength || 0;
          const byteOffset = bufferViewDef.byteOffset || 0;
          return buffer.slice(byteOffset, byteOffset + byteLength);
        });
  }
  
  loadAccessors () {
    const parser = this;
    const json   = this.json;
    return _each(
        json.accessors, accessor => parser.getDependency(
            'bufferView',
            accessor.bufferView
        ).then(
            bufferView => {
              const itemSize     = WEBGL_TYPE_SIZES[accessor.type];
              const TypedArray   = WEBGL_COMPONENT_TYPES[accessor.componentType];
              // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
              const elementBytes = TypedArray.BYTES_PER_ELEMENT;
              const itemBytes    = elementBytes * itemSize;
              const byteStride   = json.bufferViews[accessor.bufferView].byteStride;
              const normalized   = accessor.normalized === true;
              let array;
              // The buffer is not interleaved if the stride is the item size
              // in bytes.
              if (byteStride && byteStride !== itemBytes) {
                // Use the full buffer if it's interleaved.
                array = new TypedArray(bufferView);
                // Integer parameters to IB/IBA are in array elements, not
                // bytes.
                const ib = new THREE.InterleavedBuffer(array, byteStride
                                                              / elementBytes);
                return new THREE.InterleavedBufferAttribute(
                    ib, itemSize, accessor.byteOffset / elementBytes,
                    normalized
                );
              } else {
                array = new TypedArray(
                    bufferView, accessor.byteOffset, accessor.count
                                                     * itemSize);
                return new THREE.BufferAttribute(array, itemSize, normalized);
              }
            }));
  }
  
  /**
   * Specification:
   * https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture>}
   */
  loadTexture (textureIndex) {
    const parser        = this;
    const json          = this.json;
    const options       = this.options;
    const textureLoader = this.textureLoader;
    const URL           = window.URL || window.webkitURL;
    const textureDef    = json.textures[textureIndex];
    const source        = json.images[textureDef.source];
    let sourceURI       = source.uri;
    let isObjectURL     = false;
    if (source.bufferView !== undefined) {
      // Load binary image data from bufferView, if provided.
      sourceURI = parser.getDependency('bufferView', source.bufferView)
                        .then(bufferView => {
                          isObjectURL = true;
                          const blob  = new Blob(
                              [bufferView], { type: source.mimeType });
                          sourceURI   = URL.createObjectURL(blob);
                          return sourceURI;
                        });
    }
    return Promise.resolve(sourceURI).then(sourceURI => {
      // Load Texture resource.
      const loader = THREE.Loader.Handlers.get(sourceURI) || textureLoader;
      return new Promise((resolve, reject) => {
        loader.load(
            resolveURL(sourceURI, options.path), resolve, undefined,
            reject
        );
      });
    }).then(texture => {
      // Clean up resources and configure Texture.
      if (isObjectURL === true) {
        URL.revokeObjectURL(sourceURI);
      }
      texture.flipY = false;
      if (textureDef.name !== undefined) {
        texture.name = textureDef.name;
      }
      texture.format = textureDef.format !== undefined
          ? WEBGL_TEXTURE_FORMATS[textureDef.format]
          : THREE.RGBAFormat;
      if (textureDef.internalFormat !== undefined && texture.format
                                                     !== WEBGL_TEXTURE_FORMATS[textureDef.internalFormat]) {
        console.warn('THREE.GLTFLoader: Three.js does not support texture internalFormat which is different from texture format. '
                     +
                     'internalFormat will be forced to be the same value as format.');
      }
      texture.type      = textureDef.type !== undefined
          ? WEBGL_TEXTURE_DATATYPES[textureDef.type]
          : THREE.UnsignedByteType;
      const samplers    = json.samplers || {};
      const sampler     = samplers[textureDef.sampler] || {};
      texture.magFilter = WEBGL_FILTERS[sampler.magFilter]
                          || THREE.LinearFilter;
      texture.minFilter = WEBGL_FILTERS[sampler.minFilter]
                          || THREE.LinearMipMapLinearFilter;
      texture.wrapS     = WEBGL_WRAPPINGS[sampler.wrapS]
                          || THREE.RepeatWrapping;
      texture.wrapT     = WEBGL_WRAPPINGS[sampler.wrapT]
                          || THREE.RepeatWrapping;
      return texture;
    });
  }
  
  /**
   * Asynchronously assigns a texture to the given material parameters.
   * @param {Object} materialParams
   * @param {string} textureName
   * @param {number} textureIndex
   * @return {Promise}
   */
  assignTexture (materialParams, textureName, textureIndex) {
    return this.getDependency('texture', textureIndex).then(
        texture => {
          materialParams[textureName] = texture;
        });
  }
  
  /**
   * Specification:
   * https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   * @return {Promise<Array<THREE.Material>>}
   */
  loadMaterials () {
    const parser     = this;
    const json       = this.json;
    const extensions = this.extensions;
    return _each(json.materials, material => {
      let materialType;
      const materialParams     = {};
      const materialExtensions = material.extensions || {};
      const pending            = [];
      if (materialExtensions[EXTENSIONS.KHR_MATERIALS_COMMON]) {
        const khcExtension = extensions[EXTENSIONS.KHR_MATERIALS_COMMON];
        materialType       = khcExtension.getMaterialType(material);
        pending.push(
            khcExtension.extendParams(materialParams, material, parser));
      } else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
        const sgExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
        materialType      = sgExtension.getMaterialType(material);
        pending.push(
            sgExtension.extendParams(materialParams, material, parser));
      } else if (material.pbrMetallicRoughness !== undefined) {
        // Specification:
        // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material
        materialType            = THREE.MeshStandardMaterial;
        const metallicRoughness = material.pbrMetallicRoughness;
        materialParams.color    = new THREE.Color(1.0, 1.0, 1.0);
        materialParams.opacity  = 1.0;
        if (Array.isArray(metallicRoughness.baseColorFactor)) {
          const array = metallicRoughness.baseColorFactor;
          materialParams.color.fromArray(array);
          materialParams.opacity = array[3];
        }
        if (metallicRoughness.baseColorTexture !== undefined) {
          pending.push(parser.assignTexture(materialParams, 'map',
                                            metallicRoughness.baseColorTexture.index
          ));
        }
        materialParams.metalness = metallicRoughness.metallicFactor
                                   !== undefined
            ? metallicRoughness.metallicFactor
            : 1.0;
        materialParams.roughness = metallicRoughness.roughnessFactor
                                   !== undefined
            ? metallicRoughness.roughnessFactor
            : 1.0;
        if (metallicRoughness.metallicRoughnessTexture !== undefined) {
          const textureIndex = metallicRoughness.metallicRoughnessTexture.index;
          pending.push(parser.assignTexture(materialParams, 'metalnessMap',
                                            textureIndex
          ));
          pending.push(parser.assignTexture(materialParams, 'roughnessMap',
                                            textureIndex
          ));
        }
      } else {
        materialType = THREE.MeshPhongMaterial;
      }
      if (material.doubleSided === true) {
        materialParams.side = THREE.DoubleSide;
      }
      const alphaMode = material.alphaMode || ALPHA_MODES.OPAQUE;
      if (alphaMode !== ALPHA_MODES.OPAQUE) {
        materialParams.transparent = true;
        if (alphaMode === ALPHA_MODES.MASK) {
          materialParams.alphaTest = material.alphaCutoff || 0.5;
        }
      } else {
        materialParams.transparent = false;
      }
      if (material.normalTexture !== undefined) {
        pending.push(parser.assignTexture(materialParams, 'normalMap',
                                          material.normalTexture.index
        ));
        materialParams.normalScale = new THREE.Vector2(1, 1);
        if (material.normalTexture.scale !== undefined) {
          materialParams.normalScale.set(
              material.normalTexture.scale, material.normalTexture.scale);
        }
      }
      if (material.occlusionTexture !== undefined) {
        pending.push(parser.assignTexture(materialParams, 'aoMap',
                                          material.occlusionTexture.index
        ));
        if (material.occlusionTexture.strength !== undefined) {
          materialParams.aoMapIntensity = material.occlusionTexture.strength;
        }
      }
      if (material.emissiveFactor !== undefined) {
        if (materialType === THREE.MeshBasicMaterial) {
          materialParams.color = new THREE.Color().fromArray(
              material.emissiveFactor);
        } else {
          materialParams.emissive = new THREE.Color().fromArray(
              material.emissiveFactor);
        }
      }
      if (material.emissiveTexture !== undefined) {
        if (materialType === THREE.MeshBasicMaterial) {
          pending.push(parser.assignTexture(materialParams, 'map',
                                            material.emissiveTexture.index
          ));
        } else {
          pending.push(parser.assignTexture(materialParams, 'emissiveMap',
                                            material.emissiveTexture.index
          ));
        }
      }
      return Promise.all(pending).then(() => {
        let _material;
        if (materialType === THREE.ShaderMaterial) {
          _material = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].createMaterial(
              materialParams);
        } else {
          _material = new materialType(materialParams);
        }
        if (material.name !== undefined) {
          _material.name = material.name;
        }
        // Normal map textures use OpenGL conventions:
        // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#materialnormaltexture
        if (_material.normalScale) {
          _material.normalScale.x = -_material.normalScale.x;
        }
        // emissiveTexture and baseColorTexture use sRGB encoding.
        if (_material.map) {
          _material.map.encoding = THREE.sRGBEncoding;
        }
        if (_material.emissiveMap) {
          _material.emissiveMap.encoding = THREE.sRGBEncoding;
        }
        if (material.extras) {
          _material.userData = material.extras;
        }
        return _material;
      });
    });
  }
  
  loadGeometries (primitives) {
    return this._withDependencies([
                                    'accessors'
                                  ]).then(
        dependencies => _each(primitives, primitive => {
          const geometry   = new THREE.BufferGeometry();
          const attributes = primitive.attributes;
          for (const attributeId in attributes) {
            const attributeEntry = attributes[attributeId];
            if (attributeEntry === undefined) {
              return;
            }
            const bufferAttribute = dependencies.accessors[attributeEntry];
            switch (attributeId) {
              case 'POSITION':
                geometry.addAttribute('position', bufferAttribute);
                break;
              case 'NORMAL':
                geometry.addAttribute('normal', bufferAttribute);
                break;
              case 'TEXCOORD_0':
              case 'TEXCOORD0':
              case 'TEXCOORD':
                geometry.addAttribute('uv', bufferAttribute);
                break;
              case 'TEXCOORD_1':
                geometry.addAttribute('uv2', bufferAttribute);
                break;
              case 'COLOR_0':
              case 'COLOR0':
              case 'COLOR':
                geometry.addAttribute('color', bufferAttribute);
                break;
              case 'WEIGHTS_0':
              case 'WEIGHT': // WEIGHT semantic deprecated.
                geometry.addAttribute('skinWeight', bufferAttribute);
                break;
              case 'JOINTS_0':
              case 'JOINT': // JOINT semantic deprecated.
                geometry.addAttribute('skinIndex', bufferAttribute);
                break;
            }
          }
          if (primitive.indices !== undefined) {
            geometry.setIndex(dependencies.accessors[primitive.indices]);
          }
          return geometry;
        }));
  }
  
  /**
   * Specification:
   * https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   */
  loadMeshes () {
    const scope      = this;
    const json       = this.json;
    const extensions = this.extensions;
    return this._withDependencies([
                                    'accessors',
                                    'materials'
                                  ]).then(
        dependencies => _each(json.meshes, (meshDef, meshIndex) => {
          const group      = new THREE.Group();
          const primitives = meshDef.primitives || [];
          return scope.loadGeometries(primitives).then(geometries => {
            for (let i = 0 ; i < primitives.length ; i++) {
              const primitive = primitives[i];
              const geometry  = geometries[i];
              let material    = primitive.material === undefined
                  ? createDefaultMaterial()
                  : dependencies.materials[primitive.material];
              if (material.aoMap
                  && geometry.attributes.uv2 === undefined
                  && geometry.attributes.uv !== undefined) {
                console.log(
                    'THREE.GLTFLoader: Duplicating UVs to support aoMap.');
                geometry.addAttribute(
                    'uv2', new THREE.BufferAttribute(
                        geometry.attributes.uv.array, 2));
              }
              const useVertexColors = geometry.attributes.color !== undefined;
              const useFlatShading  = geometry.attributes.normal === undefined;
              if (useVertexColors || useFlatShading) {
                if (material.isGLTFSpecularGlossinessMaterial) {
                  const specGlossExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
                  material                 = specGlossExtension.cloneMaterial(
                      material);
                } else {
                  material = material.clone();
                }
              }
              if (useVertexColors) {
                material.vertexColors = THREE.VertexColors;
                material.needsUpdate  = true;
              }
              if (useFlatShading) {
                material.flatShading = true;
              }
              let mesh;
              if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES
                  || primitive.mode === undefined) {
                mesh = new THREE.Mesh(geometry, material);
              } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
                mesh          = new THREE.Mesh(geometry, material);
                mesh.drawMode = THREE.TriangleStripDrawMode;
              } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
                mesh          = new THREE.Mesh(geometry, material);
                mesh.drawMode = THREE.TriangleFanDrawMode;
              } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {
                mesh = new THREE.LineSegments(geometry, material);
              } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {
                mesh = new THREE.Line(geometry, material);
              } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
                mesh = new THREE.LineLoop(geometry, material);
              } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
                mesh = new THREE.Points(geometry, material);
              } else {
                throw new Error(
                    'THREE.GLTFLoader: Primitive mode unsupported: ',
                    primitive.mode
                );
              }
              mesh.name = meshDef.name || (
                  `mesh_${meshIndex}`
              );
              if (primitive.targets !== undefined) {
                addMorphTargets(mesh, meshDef, primitive, dependencies);
              }
              if (primitive.extras) {
                mesh.userData = primitive.extras;
              }
              if (primitives.length > 1) {
                mesh.name += `_${i}`;
                group.add(mesh);
              } else {
                return mesh;
              }
            }
            return group;
          });
        }));
  }
  
  /**
   * Specification:
   * https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   * @param {number} cameraIndex
   * @return {Promise<THREE.Camera>}
   */
  loadCamera (cameraIndex) {
    let camera;
    const cameraDef = this.json.cameras[cameraIndex];
    const params    = cameraDef[cameraDef.type];
    if (!params) {
      console.warn('THREE.GLTFLoader: Missing camera parameters.');
      return;
    }
    if (cameraDef.type === 'perspective') {
      const aspectRatio = params.aspectRatio || 1;
      const xfov        = params.yfov * aspectRatio;
      camera            = new THREE.PerspectiveCamera(
          THREE.Math.radToDeg(xfov), aspectRatio, params.znear
                                                  || 1, params.zfar || 2e6);
    } else if (cameraDef.type === 'orthographic') {
      camera = new THREE.OrthographicCamera(
          params.xmag / -2, params.xmag / 2, params.ymag / 2, params.ymag
                                                              / -2,
          params.znear, params.zfar
      );
    }
    if (cameraDef.name !== undefined) {
      camera.name = cameraDef.name;
    }
    if (cameraDef.extras) {
      camera.userData = cameraDef.extras;
    }
    return Promise.resolve(camera);
  }
  
  loadSkins () {
    const json = this.json;
    return this._withDependencies([
                                    'accessors'
                                  ]).then(
        dependencies => _each(json.skins, skin => {
          const _skin = {
            joints             : skin.joints,
            inverseBindMatrices: dependencies.accessors[skin.inverseBindMatrices]
          };
          return _skin;
        }));
  }
  
  loadAnimations () {
    const json = this.json;
    return this._withDependencies([
                                    'accessors',
                                    'nodes'
                                  ]).then(
        dependencies => _each(json.animations, (animation, animationId) => {
          const tracks = [];
          
          for (const channel of animation.channels) {
            const sampler = animation.samplers[channel.sampler];
            if (sampler) {
              const target         = channel.target;
              var name             = target.node !== undefined
                  ? target.node
                  : target.id; // NOTE: target.id is deprecated.
              const input          = animation.parameters !== undefined
                  ? animation.parameters[sampler.input]
                  : sampler.input;
              const output         = animation.parameters !== undefined
                  ? animation.parameters[sampler.output]
                  : sampler.output;
              const inputAccessor  = dependencies.accessors[input];
              const outputAccessor = dependencies.accessors[output];
              const node           = dependencies.nodes[name];
              if (node) {
                node.updateMatrix();
                node.matrixAutoUpdate = true;
                let TypedKeyframeTrack;
                switch (PATH_PROPERTIES[target.path]) {
                  case PATH_PROPERTIES.weights:
                    TypedKeyframeTrack = THREE.NumberKeyframeTrack;
                    break;
                  case PATH_PROPERTIES.rotation:
                    TypedKeyframeTrack = THREE.QuaternionKeyframeTrack;
                    break;
                  case PATH_PROPERTIES.position:
                  case PATH_PROPERTIES.scale:
                  default:
                    TypedKeyframeTrack = THREE.VectorKeyframeTrack;
                    break;
                }
                const targetName = node.name ? node.name : node.uuid;
                if (sampler.interpolation === 'CATMULLROMSPLINE') {
                  console.warn(
                      'THREE.GLTFLoader: CATMULLROMSPLINE interpolation is not supported. Using CUBICSPLINE instead.');
                }
                const interpolation = sampler.interpolation !== undefined
                    ? INTERPOLATION[sampler.interpolation]
                    : THREE.InterpolateLinear;
                const targetNames   = [];
                if (PATH_PROPERTIES[target.path]
                    === PATH_PROPERTIES.weights) {
                  // node should be THREE.Group here but
                  // PATH_PROPERTIES.weights(morphTargetInfluences) should be
                  // the property of a mesh object under node.
                  // So finding targets here.
                  node.traverse(object => {
                    if (object.isMesh === true && object.material.morphTargets
                                                  === true) {
                      targetNames.push(
                          object.name ? object.name : object.uuid);
                    }
                  });
                } else {
                  targetNames.push(targetName);
                }
                // KeyframeTrack.optimize() will modify given 'times' and
                // 'values' buffers before creating a truncated copy to keep.
                // Because buffers may be reused by other tracks, make copies
                // here.
                for (let j = 0, jl = targetNames.length ; j < jl ; j++) {
                  tracks.push(new TypedKeyframeTrack(
                      `${targetNames[j]}.${PATH_PROPERTIES[target.path]}`,
                      THREE.AnimationUtils.arraySlice(inputAccessor.array, 0),
                      THREE.AnimationUtils.arraySlice(
                          outputAccessor.array, 0),
                      interpolation
                  ));
                }
              }
            }
          }
          
          var name = animation.name !== undefined
              ? animation.name
              : `animation_${animationId}`;
          return new THREE.AnimationClip(name, undefined, tracks);
        }));
  }
  
  loadNodes () {
    const json           = this.json;
    const extensions     = this.extensions;
    const scope          = this;
    const nodes          = json.nodes || [];
    const skins          = json.skins || [];
    const meshReferences = {};
    const meshUses       = {};
    // Nothing in the node definition indicates whether it is a Bone or an
    // Object3D. Use the skins' joint references to mark bones.
    for (const skinIndex in skins) {
      const joints = skins[skinIndex].joints;
      for (let i = 0 ; i < joints.length ; ++i) {
        nodes[joints[i]].isBone = true;
      }
    }
    // Meshes can (and should) be reused by multiple nodes in a glTF asset.
    // To avoid having more than one THREE.Mesh with the same name, count
    // references and rename instances below.  Example: CesiumMilkTruck
    // sample model reuses "Wheel" meshes.
    for (const nodeIndex in nodes) {
      const nodeDef = nodes[nodeIndex];
      if (nodeDef.mesh !== undefined) {
        if (meshReferences[nodeDef.mesh] === undefined) {
          meshReferences[nodeDef.mesh] = meshUses[nodeDef.mesh] = 0;
        }
        meshReferences[nodeDef.mesh]++;
      }
    }
    return scope._withDependencies([
                                     'meshes',
                                     'skins',
                                     'cameras'
                                   ]).then(
        dependencies => _each(json.nodes, nodeDef => {
          if (nodeDef.isBone === true) {
            return new THREE.Bone();
          } else if (nodeDef.mesh !== undefined) {
            const mesh = dependencies.meshes[nodeDef.mesh].clone();
            if (meshReferences[nodeDef.mesh] > 1) {
              mesh.name += `_instance_${meshUses[nodeDef.mesh]++}`;
            }
            return mesh;
          } else if (nodeDef.camera !== undefined) {
            return scope.getDependency('camera', nodeDef.camera);
          } else if (nodeDef.extensions
                     && nodeDef.extensions[EXTENSIONS.KHR_LIGHTS]
                     && nodeDef.extensions[EXTENSIONS.KHR_LIGHTS].light
                        !== undefined) {
            const lights = extensions[EXTENSIONS.KHR_LIGHTS].lights;
            return lights[nodeDef.extensions[EXTENSIONS.KHR_LIGHTS].light];
          } else {
            return new THREE.Object3D();
          }
        }).then(__nodes => _each(__nodes, (node, nodeIndex) => {
          const nodeDef = json.nodes[nodeIndex];
          if (nodeDef.name !== undefined) {
            node.name = THREE.PropertyBinding.sanitizeNodeName(
                nodeDef.name);
          }
          if (nodeDef.extras) {
            node.userData = nodeDef.extras;
          }
          if (nodeDef.matrix !== undefined) {
            const matrix = new THREE.Matrix4();
            matrix.fromArray(nodeDef.matrix);
            node.applyMatrix(matrix);
          } else {
            if (nodeDef.translation !== undefined) {
              node.position.fromArray(nodeDef.translation);
            }
            if (nodeDef.rotation !== undefined) {
              node.quaternion.fromArray(nodeDef.rotation);
            }
            if (nodeDef.scale !== undefined) {
              node.scale.fromArray(nodeDef.scale);
            }
          }
          if (nodeDef.skin !== undefined) {
            const skinnedMeshes = [];
            const meshes        = node.children.length > 0
                ? node.children
                : [node];
            
            for (const mesh of meshes) {
              const skinEntry                   = dependencies.skins[nodeDef.skin];
              // Replace Mesh with SkinnedMesh.
              const geometry                    = mesh.geometry;
              const material                    = mesh.material;
              material.skinning                 = true;
              const skinnedMesh                 = new THREE.SkinnedMesh(
                  geometry, material);
              skinnedMesh.morphTargetInfluences = mesh.morphTargetInfluences;
              skinnedMesh.userData              = mesh.userData;
              skinnedMesh.name                  = mesh.name;
              const bones                       = [];
              const boneInverses                = [];
              for (let j = 0, l = skinEntry.joints.length ; j < l ; j++) {
                const jointId   = skinEntry.joints[j];
                const jointNode = __nodes[jointId];
                if (jointNode) {
                  bones.push(jointNode);
                  const m   = skinEntry.inverseBindMatrices.array;
                  const mat = new THREE.Matrix4().fromArray(m, j * 16);
                  boneInverses.push(mat);
                } else {
                  console.warn(
                      'THREE.GLTFLoader: Joint "%s" could not be found.',
                      jointId
                  );
                }
              }
              skinnedMesh.bind(
                  new THREE.Skeleton(bones, boneInverses),
                  skinnedMesh.matrixWorld
              );
              skinnedMeshes.push(skinnedMesh);
            }
            
            if (node.children.length > 0) {
              node.remove(... node.children);
              node.add(... skinnedMeshes);
            } else {
              node = skinnedMeshes[0];
            }
          }
          return node;
        })));
  }
  
  loadScenes () {
    const json       = this.json;
    const extensions = this.extensions;
    
    // scene node hierachy builder
    function buildNodeHierachy (nodeId, parentObject, allNodes) {
      const _node = allNodes[nodeId];
      parentObject.add(_node);
      const node = json.nodes[nodeId];
      if (node.children) {
        const children = node.children;
        for (let i = 0, l = children.length ; i < l ; i++) {
          const child = children[i];
          buildNodeHierachy(child, _node, allNodes);
        }
      }
    }
    
    return this._withDependencies([
                                    'nodes'
                                  ]).then(
        dependencies => _each(json.scenes, scene => {
          const _scene = new THREE.Scene();
          if (scene.name !== undefined) {
            _scene.name = scene.name;
          }
          if (scene.extras) {
            _scene.userData = scene.extras;
          }
          const nodes = scene.nodes || [];
          for (let i = 0, l = nodes.length ; i < l ; i++) {
            const nodeId = nodes[i];
            buildNodeHierachy(nodeId, _scene, dependencies.nodes);
          }
          _scene.traverse(child => {
            // for Specular-Glossiness.
            if (child.material
                && child.material.isGLTFSpecularGlossinessMaterial) {
              child.onBeforeRender = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].refreshUniforms;
            }
          });
          // Ambient lighting, if present, is always attached to the scene
          // root.
          if (scene.extensions
              && scene.extensions[EXTENSIONS.KHR_LIGHTS]
              && scene.extensions[EXTENSIONS.KHR_LIGHTS].light
                 !== undefined) {
            const lights = extensions[EXTENSIONS.KHR_LIGHTS].lights;
            _scene.add(lights[scene.extensions[EXTENSIONS.KHR_LIGHTS].light]);
          }
          return _scene;
        }));
  }
}
