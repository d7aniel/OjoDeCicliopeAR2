import { GLTFLoader } from "./three/GLTFLoader.js";

export async function cargarModelo(archivo, objetoVacio) {
  var loader = new GLTFLoader();
  return new Promise((resolve) => {
    loader.load(archivo, function (gltf) {
      for (var i = objetoVacio.children.length - 1; i >= 0; i--) {
        let obj = objetoVacio.children[i];
        objetoVacio.remove(obj);
      }
      // const diffuseColor = new THREE.Color().setHSL(1, 0.5, 0.25);
      // new THREE.MeshBasicMaterial({ color: diffuseColor });
      // let capa1 = new THREE.MeshPhysicalMaterial({ color: diffuseColor });
      // const material = new THREE.MeshPhysicalMaterial( {
      //   color: diffuseColor,
      //   metalness: 0,
      //   roughness: 0.5,
      //   clearcoat: 1.0 - alpha,
      //   clearcoatRoughness: 1.0 - beta,
      //   reflectivity: 1.0 - gamma,
      //   envMap: ( index % 2 ) == 1 ? texture : null
      // } );

      // // instantiate a loader
      // const loader = new THREE.TextureLoader();
      // // let material = new THREE.MeshBasicMaterial({});
      // // // load a resource
      // loader.load(
      //   // resource URL
      //   texturaArchivo,
      //   // onLoad callback
      //   (texture) => {
      //     const proporcion = texture.image.naturalWidth / texture.image.naturalHeight;
      //     gltf.scene.scale.set(proporcion, 1, 1);
      //     gltf.scene.rotation.set(rotX, rotY, rotZ);
      //     let capa1 = new THREE.MeshBasicMaterial({
      //       map: texture,
      //     });
      //     for (let obj of gltf.scene.children) {
      //       if (obj.name === "capa1") {
      //         obj.material = capa1;
      //       }
      //     }
      //   },
      //   // onProgress callback currently not supported
      //   undefined,
      //   // onError callback
      //   function (err) {
      //     console.error("An error happened.");
      //   }
      // );
      objetoVacio.add(gltf.scene);
      resolve("listo");
      console.log("cargado");
    });
  });
}

export function setTextura(texturaArchivo, objeto, rotX, rotY, rotZ) {
  // // instantiate a loader
  const loader = new THREE.TextureLoader();
  // let material = new THREE.MeshBasicMaterial({});
  // // load a resource
  loader.load(
    // resource URL
    texturaArchivo,
    // onLoad callback
    (texture) => {
      const proporcion = texture.image.naturalWidth / texture.image.naturalHeight;
      objeto.children[0].scale.set(proporcion, 1, 1);
      objeto.children[0].rotation.set(rotX, rotY, rotZ);
      let capa1 = new THREE.MeshBasicMaterial({
        map: texture,
      });
      for (let obj of objeto.children[0].children) {
        let nombre = obj.name.split("_")[0];
        if (nombre === "capa1") {
          obj.material = capa1;
        }
      }
    },
    // onProgress callback currently not supported
    undefined,
    // onError callback
    function (err) {
      console.error("An error happened.");
    }
  );
}
