<template>
    <div style="height: 100%;width: 100%">
        <div id="mcr-graph-three">
            加载失败.
        </div>
        <resize-observer @notify="onContainerResize"/>
    </div>
</template>
<script>
  import { CameraController } from '../../../lib/controller/CameraController';

  const GROUND_WIDTH = 4000,
        TIME_SECONDS = 2000;

  import Vue from 'vue';
  import VueResize from 'vue-resize';

  Vue.use(VueResize);

  import 'three';
  import './js/controls/OrbitControls';
  import MouseControls from './js/controls/MouseControls.ts';

  import TWEEN from '@tweenjs/tween.js';
  /** ****************************************
   *    导入自定义类
   *******************************************/
  import Sandbox from '../../sandbox/Sandbox';
  import Loader from '../../loader/index';

  import { EventResetsize } from '../../bus/events/ui/resetsize';

  /** ****************************************
   *    导入自定义组件
   *******************************************/
  import em from '../../bus';

  const wkFBuffergeoCode = require('../../worker/cal-factor-mesh.worker');
  const wkFBuffergeo     = new wkFBuffergeoCode();

  const container = document.createElement('div');
  const scene     = new THREE.Scene();
  const camera    = new THREE.PerspectiveCamera(30, 1, 1, Math.min(GROUND_WIDTH * 10, 100000));
  const renderer  = new THREE.WebGLRenderer(
      {
        antialias            : true,
        alpha                : true,
        preserveDrawingBuffer: true
      }
  );

  //  const controls  = new THREE.OrbitControls(camera, renderer.domElement);
  let cursor     = new THREE.Vector3(0, 0, 0);
  let hits       = _comInst.state.current.hits;
//  const controls = new THREE.OrbitControls( camera, renderer.domElement);
  const controls = new MouseControls(scene, camera, renderer.domElement, cursor, hits);

  let axisHelper, helperGrid, helperGridBase, helperLights = [], helperBoxs = [];
  
  //  scene.background = new THREE.Color(0xf0f0f0);
  //  scene.fog = new THREE.Fog(0xfcfcfc, 500, 10000);

  /** ***********************
   * 初始化若干控制器
   **************************/
  let conCamera = new CameraController(camera);

  /** ***********************
   * 使用控制器操控对象初始化
   **************************/
  //  camera.position.set(2500, 2500, 2500);
  //  camera.position.set(100, 0, 0);
  conCamera.moveTo(new THREE.Vector3(2500, 2500, 2500), new THREE.Vector3(0, 0, 0), TIME_SECONDS);

  renderer.shadowMap.type              = THREE.PCFSoftShadowMap;
  renderer.shadowMapSoft               = true;
  renderer.shadowMap.renderSingleSided = false;
  renderer.shadowMap.enabled           = true;
  renderer.gammaInput                  = true;
  renderer.gammaOutput                 = true;
  renderer.sortObjects                 = true;
  
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.localClippingEnabled = true;
  container.appendChild(renderer.domElement);
  
  /** ******************************************************************************
   *
   *                                   灯光配置
   *
   *********************************************************************************/
  /** **************************
   * 环境光
   *****************************/
  let ambientLight  = new THREE.AmbientLight(0xffffff);
  ambientLight.name = 'h-light-ambient';
  scene.add(ambientLight);

  /** **************************
   * 点光源
   *****************************/
  //  let lightSpot = new THREE.SpotLight(0xffffff, 1.5);
  //  lightSpot.position.set(0, 1500, 200);
  //  lightSpot.castShadow            = true;
  //  lightSpot.shadow                = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 200, 2000));
  //  lightSpot.shadow.bias           = -0.000222;
  //  lightSpot.shadow.mapSize.width  = 1024;
  //  lightSpot.shadow.mapSize.height = 1024;
  //  lightSpot.name                  = 'h-light-spot';
  //  scene.add(lightSpot);

  /** **************************
   * 方向光
   *****************************/
  let directionalLight  = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.name = 'h-light-directional';
  directionalLight.position.set(0, GROUND_WIDTH / 2, 0); 			//default; light shining from top
  directionalLight.castShadow            = true;            // default false
  directionalLight.shadow.mapSize.width  = GROUND_WIDTH / 10;  // default
  directionalLight.shadow.mapSize.height = GROUND_WIDTH / 10; // default
  directionalLight.shadow.camera.left    = GROUND_WIDTH / -2;
  directionalLight.shadow.camera.right   = GROUND_WIDTH / 2;
  directionalLight.shadow.camera.top     = GROUND_WIDTH / 2;
  directionalLight.shadow.camera.bottom  = GROUND_WIDTH / -2;
  directionalLight.shadow.camera.far     = GROUND_WIDTH / 2 + 1;
  directionalLight.shadow.camera.near    = 0;
  scene.add(directionalLight);

  /** ****************************************
   * 鼠标指针跟踪点
   * 并不需要真正画进去, 记录点位即可
   *******************************************/
  let meshMouseTrackerGeo = new Geometry();
  meshMouseTrackerGeo.vertices.push(cursor);
  //  let meshMouseTrackerMtl = new THREE.PointsMaterial(
  //      {
  //        size           : 0,
  //        sizeAttenuation: false,
  //        color          : 0xffffff
  //      }
  //  );
  //  let meshMouseTracker    = new Points(meshMouseTrackerGeo, meshMouseTrackerMtl);
  //  meshMouseTracker.name   = 'h-tracker-mouse';
  //  scene.add(meshMouseTracker);
  _comInst.graph.cursor = cursor;
  /** **************************
   * 渲染器渲染函数, 可配置渲染模式
   * oprion.mode 为一个自然数.
   * 值越大, 渲染间隔越大
   *
   * 为 0 时, 使用requestAnimationFrame() 函数, 以期望达到60Hz
   * 非 i 时, 渲染间隔为 50 * i 毫秒
   *****************************/
  const render          = (time) => {
    TWEEN.update(time);
    /** ******************************
     * 根据配置的模式控制刷新频率
     *********************************/
    if (option.mode < 1) {
      requestAnimationFrame(render);
    } else {
      let frequency = 50 * Math.ceil(option.mode);
      setTimeout(render, frequency);
    }
    /** **************************
     * 如果此时出于afk状态, 跳过渲染
     *****************************/
    if (option.afk) {
      return;
    }

    renderer.render(scene, camera);
    if (controls && typeof controls.update === 'function') {
      let cameraLastPosition = JSON.parse(JSON.stringify(camera.position));
      controls.update();
      if (
          cameraLastPosition.x !== camera.position.x ||
          cameraLastPosition.y !== camera.position.y ||
          cameraLastPosition.z !== camera.position.z
      ) {
        em.emit(
            'event/log/trace',
            { step: '相机位置更新', c: camera.position, fov: camera.fov, dir: camera.getWorldDirection() }
        );
        em.emit('scene/camera/update', camera);
      }
    }

    /** ********************************************************
     *
     *                  更新一系列附加的东西
     *
     ***********************************************************/

    /** *********************************************************
     * 地面
     *
     * 地面包含三层可见元素
     * 1. 大网格
     * 2. 小网格
     * 3. 阴影投射面
     ************************************************************/
    helperGridBase.position.x = Math.floor(controls.target.x / GROUND_WIDTH + 0.5) * GROUND_WIDTH;
    helperGridBase.position.z = Math.floor(controls.target.z / GROUND_WIDTH + 0.5) * GROUND_WIDTH;
    if(controls.cursor){
      let pGrid0                = helperGrid.position,
          pGrid1                = {
            x: Math.floor(controls.cursor.x / GROUND_WIDTH * 2 + 0.5) * GROUND_WIDTH / 2,
            z: Math.floor(controls.cursor.z / GROUND_WIDTH * 2 + 0.5) * GROUND_WIDTH / 2
          };
      tGrid || (
          tGrid = new TWEEN.Tween(pGrid0)
      );
      tGrid.stop();
      tGrid.easing(TWEEN.Easing.Linear.None)
           .to(pGrid1, 50)
           .onUpdate(() => {
             groundPlane.position.x = pGrid0.x;
             groundPlane.position.z = pGrid0.z;
           })
           .onComplete(() => {
             groundPlaneBase.position.x = pGrid1.x;
             groundPlaneBase.position.z = pGrid1.z;
           })
           .start();
    }
  };
  const resetRenderSize = () => {
    let container = document.getElementById('mcr-graph-three');

    /** *******************************
     * 改变渲染器尺寸 以及相机横纵比
     **********************************/
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    em.emit('ui/resetsize', new EventResetsize(container.clientWidth, container.clientHeight));
  };
  const init            = () => {
    document.getElementById('mcr-graph-three').innerHTML = '';
    document.getElementById('mcr-graph-three').appendChild(container);
    resetRenderSize();
    render();
  };
  
  const planeGeometry     = new THREE.PlaneGeometry(GROUND_WIDTH, GROUND_WIDTH),
        planeGeometryBase = new THREE.PlaneGeometry(GROUND_WIDTH * 10, GROUND_WIDTH * 10),
        planeMaterial     = new THREE.ShadowMaterial({ opacity: 0.2 }),
        groundPlane       = new THREE.Mesh(planeGeometry, planeMaterial),
        groundPlaneBase   = new THREE.Mesh(planeGeometryBase, new THREE.ShadowMaterial({}));
  planeGeometry.rotateX(-Math.PI / 2);
  planeGeometry.translate(0, 0, 0);
  groundPlane.position.y = 0;
  planeGeometryBase.rotateX(-Math.PI / 2);
  planeGeometryBase.translate(0, 0, 0);
  groundPlaneBase.position.y = -5;
  //  groundPlane.position.x    = GROUND_WIDTH / -2;
  //  groundPlane.position.z    = GROUND_WIDTH / -2;
  groundPlane.receiveShadow = true;
  groundPlane.name          = 'h-mesh-plan';
  groundPlaneBase.name      = 'h-mesh-plan-base';
  scene.add(groundPlane);
  scene.add(groundPlaneBase);

  /** ******************************************************************************
   *
   *                                载入各类Helper
   *
   *********************************************************************************/
  /** **************
   * 世界坐标
   *****************/
  //  axisHelper = new THREE.AxisHelper(GROUND_WIDTH);
  //  scene.add(axisHelper);
  /** **************
   * 地面网格
   *****************/
  helperGrid = new THREE.GridHelper(GROUND_WIDTH, 50);
  helperGrid.position.y           = -2;
  helperGrid.material.opacity     = 0.75;
  helperGrid.material.transparent = true;
  helperGrid.name                 = 'h-helper-grid';
  scene.add(helperGrid);

  helperGridBase                      = new THREE.GridHelper(GROUND_WIDTH * 10, 100);
  helperGridBase.position.y           = -4;
  helperGridBase.material.opacity     = 0.5;
  helperGridBase.material.transparent = true;
  helperGridBase.name                 = 'h-helper-grid-base';
  scene.add(helperGridBase);

  /** **************
   * 灯光
   *****************/
  //  helperLights.push(new THREE.SpotLightHelper(lightSpot, new THREE.Color(0, 128, 0)));
  //  helperLights.push(new THREE.CameraHelper(directionalLight.shadow.camera));
  helperLights.forEach((light) => {scene.add(light);});

  /** ******************************************************************************
   *
   *                                   交互控制器
   *
   *********************************************************************************/
  if (controls) {
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.25;
    controls.enableZoom = true;
  }

  /** ************************************************************
   *
   *
   ***************************************************************/
  let sandbox               = Sandbox;
  let lastSandboxUpdateTime = 0;

  /** ************************************************************
   *
   *              提交一部分涉及到三维组件的全局实例引用
   *
   *  注意确认好该段代码执行时候目标对象已准备就绪.
   *
   *  需要初始化的对象有
   *
   *    camera, scene, renderer
   *    sandbox
   *
   ***************************************************************/
  import _comInst from '../../../lib/_common/instance';
  import { ToolController } from '../../../lib/controller/ToolController.ts';
  import { Geometry, Points } from '../../../../vender/three';

  _comInst.graph.camera   = camera;
  _comInst.graph.scene    = scene;
  _comInst.graph.renderer = renderer;
  _comInst.graph.control  = controls;
  _comInst.sandbox        = sandbox;

  let option = _comInst.option;
  let tGrid  = null;

  export default {
    data () {
      return {
        scene,
        editor: {},
        sandbox,
        option
      };
    },
    stores  : {
      stateCurrentIsProcessing: 'state.current.isProcessing'
    },
    watch   : {
      option: {
        handler (curVal, oldVal) {
          let { mode }               = curVal;
          renderer.shadowMap.enabled = (
              mode <= 2
          );
        },
        deep: true
      }
    },
    computer: {},
    methods : {
      onContainerResize (e) {
        em.emit('event/log/trace', { step: '窗体改变大小' });
        resetRenderSize();
      },
      async sceneRefush (names = [], type = '') {
        let currt = Date.now();
        //        console.log('sceneRefush-0', Date.now() - currt);

        /** *****************************************************
         *
         *        刷新画布. 全擦掉, 从沙盘中读取数据重新画
         *
         *        如果传入参数names为空则全清空, 否则仅更新names
         *
         *
         *
         ********************************************************/
        const { lines, faces, models } = this.sandbox;
        //        console.log('sceneRefush-1', Date.now() - currt);

        /** **********************************
         *               清空画布
         *     所有name以'h-'打头的对象会保留
         *************************************/
        //        scene.children = scene.children.filter(({ name }) => {
        //          return name.indexOf('h-') === 0 &&
        //                 names.indexOf(name) < 0;
        //        });
        /** **********************************
         *               画线条
         *************************************/
        if (type === 'line') {
          lines.forEach(({ title, vertices }) => {
            //            console.log(title);
            this.createLine(vertices, { name: title });
          });
        }
        /** **********************************
         *               画三角面
         *************************************/
        //        faces.forEach(({ title, vertices }) => {
        //          this.createLine(vertices, { isClose: true });
        //        });

        //        console.log('sceneRefush-2', Date.now() - currt);
        if (type === 'face') {
          this.updateFaceBuffer(faces);
        }
        //        console.log('sceneRefush-3', Date.now() - currt);

        /** **********************************
         *               载入模型
         *
         *  1. 提取待载入模型列表
         *  2. 识别模型资源类型
         *  3. 调用对应的加载器, 等待加载器异步返回(buffer)geometry
         *  4. 根据geometry生成mesh置入场景
         *************************************/
        if (type === 'model') {
          await this.updareModels(models, []);
        }
      },
      async add2Scene (mesh, name = '', isHitable = false) {
        mesh.castShadow = true;
        //        mesh.receiveShadow = true;
        mesh.name       = `${name}${ isHitable ? '-hitable' : ''}`;
        let meshInScene = scene.children.find(({ name: _name }) => {
          return _name === name;
        });
        if (meshInScene) {
          meshInScene.geometry = mesh.geometry;
        } else {
          //          let meshBox  = new THREE.BoxHelper(mesh);
          //          meshBox.name = mesh.name + '_box';

          /** ***********************************
           * 模型需要添加载入的动画效果 使之更加美观
           * 这里起草一个对其位置进行操作的动画
           **************************************/
          let p           = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z };
          mesh.position.x = (
                                0.5 - Math.random()
                            ) * 5000;
          mesh.position.y = Math.random() * 1000;
          mesh.position.z = (
                                0.5 - Math.random()
                            ) * 5000;

          let tMesh = new TWEEN.Tween(mesh.position);
          tMesh.easing(TWEEN.Easing.Quartic.Out)
               .to(p, 1200)
               .onUpdate(() => {})
               .onComplete(() => {
                 em.emit('request/camera', { action: 'reset', arg: {} });
               })
               .start();

          scene.add(mesh);
          //          scene.add(meshBox);
        }
      },
      async createPoint () {

      },
      async createLine (
          vertices  = [
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 }
          ], option = {
            name   : '',
            isClose: false
          }) {

        if (option.isClose) {
          vertices.push(vertices[0]);
        }

        let materialLine = new THREE.LineDashedMaterial({ color: 0x000000, dashSize: 3, gapSize: 1, linewidth: 20 });
        let geometryLine = new THREE.Geometry();
        vertices.forEach((p) => {
          geometryLine.vertices.push(p);
        });

        let line = new THREE.Line(geometryLine, materialLine);

        this.add2Scene(line, option.name);
      },
      updateLineBuffer (lines = []) {

      },
      updateFaceBuffer (faces = []) {
        wkFBuffergeo.addEventListener('message', ({ data: { positions, normals, colors } }) => {
          /** 该函数用于释放数组 */
          function disposeArray () { this.array = null; }

          let geometry = new THREE.BufferGeometry();
          let currt    = Date.now();
          geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray));
          geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3).onUpload(disposeArray));
          geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3).onUpload(disposeArray));
          geometry.computeBoundingSphere();
          let material = new THREE.MeshToonMaterial(
              {
                color       : 0x50b7c1,
                specular    : 0xffffff,
                shininess   : 250,
                side        : THREE.DoubleSide,
                vertexColors: THREE.VertexColors
              }
          );

          let mesh = new THREE.Mesh(geometry, material);
          this.add2Scene(mesh, 'faces');
        });
        wkFBuffergeo.postMessage(faces);

      },
      async updareModels (addModels = []) {

        /** *************************************
         * 删除场景中有, 但是沙盒中已经没有的模型.
         ****************************************/
        scene.children = scene.children.filter(({ name }) => {
          return name.indexOf('model') !== 0;
        });

        addModels.forEach(async ({ type, urlGltf, option }) => {
          let meshs = [];
          switch (type) {
            case 'gltf':
              /**
               * 从网络下载gltf文档
               * @type {Promise<any>}
               */
              meshs = await Loader.loadModelGltf(urlGltf);
              /**
               * 设置文档中模型的偏移量
               */
              let { position } = option;
              meshs.forEach((mesh) => {
                mesh.position.x = position.x;
                mesh.position.y = position.y;
                mesh.position.z = position.z;
              });
              break;
            default:
              //              console.log('模型加载, 类型没找到', type);
              em.emit('event/log/trace', { step: '模型加载, 类型没找到', type });
          }
          if (meshs.length) {
            this.stateCurrentIsProcessing = false;
            em.emit('event/log/trace', { step: '模型加载完毕' });
            //            console.log('模型加载完毕', meshs);
            await meshs.forEach(async (mesh) => {
              //              mesh.material=new THREE.MeshPhongMaterial({color:0xf1f1f1})
              let name = mesh.name || mesh.id || mesh.uuid || Math.random();
              await this.add2Scene(mesh, 'model_' + name, true);
            });
          }
        });

      },
      createArcBuffer (arcs = [], option = {}) {

      },
      createCube (
          {
            x = 0, y = 0, z = 0,
            wx = 10, wy = 10, wz = 10,
            rx = 0, ry = 0, rz = 0
          } = {}
      ) {
        let cube = new THREE.Mesh(
            new THREE.CubeGeometry(wx, wy, wz),
            new THREE.MeshPhongMaterial(
                {
                  color: new THREE.Color()
                      .setHSL(0.5, 0.5, 0.5)
                      .multiplyScalar(0.8)
                }
            )
        );
        this.add2Scene(cube);
      }
    },
    mounted : function () {
      init();

      sandbox.refush = this.sceneRefush;
      this.$watch(
          'sandbox.isGroundVisible', function (curVal, oldVal) {
            if (curVal) {
              scene.add(helperGrid);
              scene.add(groundPlane);
            } else {
              scene.remove(helperGrid);
              scene.remove(groundPlane);
            }
          }
      );
      this.$watch(
          'sandbox.isHelperVisible', function (curVal, oldVal) {
            if (curVal) {
              helperLights.forEach((light) => {scene.add(light);});
              helperBoxs.forEach((box) => {scene.add(box);});
            } else {
              helperLights.forEach((light) => {scene.remove(light);});
              helperBoxs.forEach((box) => {scene.remove(box);});
            }
          }
      );
      this.$watch(
          'sandbox.lines', function (curVal, oldVal) {
            let currentTime = Date.now();
            if (currentTime - lastSandboxUpdateTime > 1000) {
              this.sceneRefush([], 'line');
              lastSandboxUpdateTime = currentTime;
            }
          }
      );
      this.$watch(
          'sandbox.faces', function (curVal, oldVal) {
            //            console.log({ curVal, oldVal });
            //            sandbox._faces=curVal;
            let currentTime = Date.now();
            if (currentTime - lastSandboxUpdateTime > 1000) {
              this.sceneRefush([], 'face');
              lastSandboxUpdateTime = currentTime;
            }
          }
      );
      this.$watch(
          'sandbox.models', async function (curVal, oldVal) {
            await  this.sceneRefush([], 'model');
          }
      );

      /** **********************************
       * 这是一个处理`请求消息`的代码
       * 工程中随处可以发出某些想要控制场景的请求,
       * 比如说设置 option 的成员值
       *************************************/
      em.on('request/scene', ({ action, arg }) => {
        if (action === 'set') {
          for (let key in arg) {
            option[key] = arg[key];
          }
        }
      });
    }
  };

</script>
<style scoped="">
    #mcr-graph-three {
        height: 100%;
        width: 100%;
    }
</style>
