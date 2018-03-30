/* GLTFREGISTRY */
class GLTFRegistry {
  constructor() {
    let objects = {};
    return {
      get(key) {
        return objects[key];
      },
      add(key, object) {
        objects[key] = object;
      },
      remove(key) {
        delete objects[key];
      },
      removeAll() {
        objects = {};
      }
    };
  }
  
}
