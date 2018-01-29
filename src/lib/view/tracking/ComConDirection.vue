<template>
    <div class="com-con-direction">
        <div id="com-con-direction-c"></div>
    </div>
</template>
<style scoped="">
    .com-con-direction {
        position: absolute;
        top: 0;
        right: 0;
        margin: 24px;
        display: block;
        width: 128px;
        height: 128px;
        background-color: transparent;
        pointer-events: all;

        /*border-style: dashed;*/
        /*border-radius: 24px;*/
        /*border-color: #337ab7;*/
        /*border-width: 1px;*/
    }

</style>
<script>

  const CUBE_WIDTH  = 32,
        TIME_SECOND = 1000;

  import em from '../../bus';
  import '../graph/js/controls/TrackballControls';
  import TWEEN from '@tweenjs/tween.js';

  let container, camera, controls, scene, renderer, mesh, isMoving = false, tMoving;

  function init () {
    camera            = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    camera.position.z = 100;
    camera.position.y = 100;
    camera.position.x = 100;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    controls                      = new THREE.TrackballControls(camera);
    controls.rotateSpeed          = 0;
    controls.zoomSpeed            = 1.2;
    controls.panSpeed             = 0.8;
    controls.noZoom               = true;
    controls.noPan                = true;
    controls.staticMoving         = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys                 = [65, 83, 68];
    controls.addEventListener('change', render);

    // world
    scene = new THREE.Scene();

    let loaderTexture = new THREE.TextureLoader(),
        textureCube   = loaderTexture.load(require('./ComConDirection/box.jpg')),
        geometry      = new THREE.BoxBufferGeometry(CUBE_WIDTH, CUBE_WIDTH, CUBE_WIDTH),
        material      = new THREE.MeshBasicMaterial({ color: 0xf1f1f1, map: textureCube }),
        axisHelper    = new THREE.AxisHelper(CUBE_WIDTH);

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    scene.add(axisHelper);

    // renderer
    renderer = new THREE.WebGLRenderer(
        {
          antialias            : false,
          alpha                : true,
          precision            : 'highp',
          preserveDrawingBuffer: true
        }
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(128, 128);
    container = document.getElementById('com-con-direction-c');
    container.appendChild(renderer.domElement);

    render();
  }

  function animate () {
    requestAnimationFrame(animate);
    controls.update();
  }

  function render () {
    if (isMoving) {
      renderer.render(scene, camera);
    }
  }

  export default {
    components: {},
    data () {
      return {};
    },
    stores    : {
      stateCurrentStatus : 'state.current.status',
      stateCurrentCamera : 'state.current.camera',
      stateSettingIsDebug: 'state.setting.isDebug'
    },
    methods   : {
      onCameraUpdate (c) {
        let lookAt   = c.getWorldDirection().clone(),
            position = c.position.clone(),
            direct   = position.sub(lookAt).normalize()
        ;
        if (isMoving) {
          tMoving.stop();
        }
        isMoving = true;
        tMoving  = (
            tMoving || new TWEEN.Tween(camera.position)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(
                    () => {
                      camera.up.x = 0;
                      camera.up.y = 1;
                      camera.up.z = 0;
                    }
                )
                .onComplete(() => {isMoving = false;})
        ).to({
               x: 100 * direct.x,
               y: 100 * direct.y,
               z: 100 * direct.z
             }, TIME_SECOND)
         .start();
      }
    },
    mounted   : function () {
      init();
      animate();
      em.on('scene/camera/update', this.onCameraUpdate);
    }
  };
</script>
