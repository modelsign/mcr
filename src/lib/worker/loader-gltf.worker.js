import '../view/graph/js/loaders/GLTFLoader.js';

function _onLoadGltf (gltf, url) {
  em.emit('event/log/trace', { step: `下载完成` });
  setTimeout(() => {
    em.emit('event/ui/progress', new EventUIProgress(url, 1));
  }, 30000);
  
  let scene = gltf.scene;
  let meshs = gltf.scene.children;
  
  if (gltf) {
    return meshs;
  }
}

self.addEventListener(
    'message',
    ({ data: url = '' }) => {
      let loader = new THREE.GLTFLoader();
      
      loader.load(
          url,
          (gltf) => {
            /** ************************************
             * 并不能工作, 应为worker线程不能传对象.
             * 得想办法把gltf对象序列化.
             ***************************************/
            postMessage(
                {
                  url,
                  isComplate: true,
                  progress  : 1,
                  data      : gltf
                }
            );
            self.close();
          },
          (xhr) => {
            let progress = xhr.loaded / Math.max(xhr.total, 1);
            postMessage(
                {
                  url,
                  isComplate: false,
                  progress  : progress,
                  data      : null
                }
            );
          }
      );
    }
);

export default {};
