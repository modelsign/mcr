/**
 * @author mrdoob / http://mrdoob.com/
 */
THREE.PointerLockControls = function (camera, domElement) {
  var scope = this;
  camera.rotation.set(0, 0, 0);
  var pitchObject = new THREE.Object3D();
  pitchObject.add(camera);
  var yawObject        = new THREE.Object3D();
  yawObject.position.y = 10;
  yawObject.add(pitchObject);
  var PI_2 = Math.PI / 2;
  
  var onMouseMove = function (event) {
    // console.log('移动', scope.enabled);
    if (scope.enabled === false) {
      return;
    }
    // console.log(camera.rotation);
    var movementX          = event.movementX || event.mozMovementX
                             || event.webkitMovementX || 0;
    var movementY          = event.movementY || event.mozMovementY
                             || event.webkitMovementY || 0;
    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;
    pitchObject.rotation.x = Math.max(
        -PI_2, Math.min(PI_2, pitchObject.rotation.x));
  };
  
  function onMouseDown (event) {
    // console.log('按下');
    scope.enabled = true;
    domElement.addEventListener('mousemove', onMouseMove, false);
    domElement.addEventListener('mouseup', onMouseUp, false);
  }
  
  function onMouseUp (event) {
    // console.log('抬起');
    scope.enabled = false;
    domElement.removeEventListener('mousemove', onMouseMove, false);
    domElement.removeEventListener('mouseup', onMouseUp, false);
  }
  
  this.domElement = domElement;
  this.dispose    = function () {
    domElement.removeEventListener('mousedown', onMouseDown, false);
  };
  
  domElement.addEventListener('mousedown', onMouseDown, false);
  
  this.enabled      = false;
  this.getObject    = function () {
    return yawObject;
  };
  this.getDirection = function () {
    // assumes the camera itself is not rotated
    var direction = new THREE.Vector3(0, 0, -1);
    var rotation  = new THREE.Euler(0, 0, 0, 'YXZ');
    
    return function (v) {
      rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);
      v.copy(direction).applyEuler(rotation);
      return v;
    };
  }();
};
