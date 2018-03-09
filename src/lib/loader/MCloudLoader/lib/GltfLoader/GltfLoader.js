class GLTFLoader {
  constructor(manager) {
    this.manager = (
                       manager !== undefined
                   ) ? manager : THREE.DefaultLoadingManager;
  }
  
  load(url, onLoad, onProgress, onError) {
    const scope  = this;
    const path   = this.path !== undefined
        ? this.path
        : THREE.Loader.prototype.extractUrlBase(url);
    const loader = new THREE.FileLoader(scope.manager);
    
    /** *********************************
     * 探知文件大小
     * Range: bytes=0-
     * 诱导服务器取消以chunk模式传输数据.
     ************************************/
    // loader.setRequestHeader({ Range: 'bytes=0-' });
    
    loader.setResponseType('arraybuffer');
    loader.load(url, data => {
      try {
        scope.parse(data, path, onLoad, onError);
      } catch (e) {
        if (onError !== undefined) {
          // For SyntaxError or TypeError, return a generic failure
          // message.
          onError(e.constructor === Error ? e : new Error(
              'THREE.GLTFLoader: Unable to parse model.'));
        }
      }
    }, onProgress, onError);
  }
  
  setCrossOrigin(value) {
    this.crossOrigin = value;
  }
  
  setPath(value) {
    this.path = value;
  }
  
  parse(data, path, onLoad, onError) {
    let content;
    const extensions = {};
    if (typeof data === 'string') {
      content = data;
    } else {
      const magic = convertUint8ArrayToString(new Uint8Array(data, 0, 4));
      if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
        extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(
            data);
        content                                = extensions[EXTENSIONS.KHR_BINARY_GLTF].content;
      } else {
        content = convertUint8ArrayToString(new Uint8Array(data));
      }
    }
    const json = JSON.parse(content);
    if (json.asset === undefined || json.asset.version[0] < 2) {
      onError(new Error(
          'THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.'));
      return;
    }
    if (json.extensionsUsed) {
      if (json.extensionsUsed.includes(EXTENSIONS.KHR_LIGHTS)) {
        extensions[EXTENSIONS.KHR_LIGHTS] = new GLTFLightsExtension(json);
      }
      if (json.extensionsUsed.includes(EXTENSIONS.KHR_MATERIALS_COMMON)) {
        extensions[EXTENSIONS.KHR_MATERIALS_COMMON] = new GLTFMaterialsCommonExtension(
            json);
      }
      if (json.extensionsUsed.includes(EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS)) {
        extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS] = new GLTFMaterialsPbrSpecularGlossinessExtension();
      }
    }
    // console.time('GLTFLoader');
    const parser = new GLTFParser(json, extensions, {
      path       : path || this.path || '',
      crossOrigin: this.crossOrigin,
      manager    : this.manager
    });
    parser.parse((scene, scenes, cameras, animations) => {
      // console.timeEnd('GLTFLoader');
      const glTF = {
        scene,
        scenes,
        cameras,
        animations
      };
      onLoad(glTF);
    }, onError);
  }
}
