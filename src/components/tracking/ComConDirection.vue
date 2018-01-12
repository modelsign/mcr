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

        /*border-style: dashed;*/
        /*border-radius: 24px;*/
        /*border-color: #337ab7;*/
        /*border-width: 1px;*/

        pointer-events: all;
    }

</style>
<script>
  import em from '../../lib/bus';
  import '../graph/js/controls/TrackballControls';
  import TWEEN from '@tweenjs/tween.js';

  var container, stats;
  var camera, controls, scene, renderer, mesh;
  var cross;
  var isMoving = false, tMoving;

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

    let loaderTexture = new THREE.TextureLoader();

    var textureCube = loaderTexture
        .load(require('./ComConDirection/box.jpg'));

    var geometry = new THREE.BoxBufferGeometry(32, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xf1f1f1, map: textureCube });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, precision: 'highp' });
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
      stateCurrentPoint  : 'state.current.point',
      stateSettingIsDebug: 'state.setting.isDebug'
    },
    methods   : {
      onCameraUpdate (c) {
        //        console.log('direction', this.stateCurrentCamera.direction);
        let lookAt   = c.getWorldDirection().clone(),
            position = c.position.clone(),
            direct   = position.sub(lookAt).normalize()
        ;
        if (isMoving) {
          tMoving.stop();
        }
        isMoving = true;
        tMoving = (
            tMoving || new TWEEN.Tween(camera.position)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {

                  camera.up.x = 0;
                  camera.up.y = 1;
                  camera.up.z = 0;
                })
                .onComplete(() => {
                  isMoving = false;
                })
        ).to({
               x: 100 * direct.x,
               y: 100 * direct.y,
               z: 100 * direct.z
             }, 1000)
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
