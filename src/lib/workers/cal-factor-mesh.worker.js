self.addEventListener(
    'message',
    ({ data: faces = [] }) => {
      let positions = [],
          normals   = [],
          colors    = [],
          color     = new THREE.Color(0xf0f0f0),
          pA        = new THREE.Vector3(),
          pB        = new THREE.Vector3(),
          pC        = new THREE.Vector3(),
          cb        = new THREE.Vector3(),
          ab        = new THREE.Vector3(),
          nx, ny, nz;
      
      for (let i = 0, ilen = faces.length ; i < ilen ; i++) {
        let { x: ax, y: ay, z: az } = faces[i].vertices[0],
            { x: bx, y: by, z: bz } = faces[i].vertices[1],
            { x: cx, y: cy, z: cz } = faces[i].vertices[2];
        
        positions.push(ax, ay, az);
        positions.push(bx, by, bz);
        positions.push(cx, cy, cz);
        
        // flat face normals
        pA.set(ax, ay, az);
        pB.set(bx, by, bz);
        pC.set(cx, cy, cz);
        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);
        cb.normalize();
        
        nx = cb.x;
        ny = cb.y;
        nz = cb.z;
        
        normals.push(nx, ny, nz);
        normals.push(nx, ny, nz);
        normals.push(nx, ny, nz);
        
        // colors
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
      }
      postMessage({ positions, normals, colors });
      // self.close();
    }
);

export default {};
