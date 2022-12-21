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

export function setTextura(texturaArchivo, objeto, rotX, rotY, rotZ, randmSize = 0) {
  const loader = new THREE.TextureLoader();
  // `./imagenes/cuadros/${texturaArchivo.archivo}`;
  loader.load(
    `./imagenes/cuadros/${texturaArchivo.archivo}`,
    (texture) => {
      let modificacionRandom = 1.0 + Math.random(randmSize);
      let textoDimension = texturaArchivo.tam.split("x");
      let tx = parseInt(textoDimension[0]);
      let ty = parseInt(textoDimension[1]);
      const proporcion = (texture.image.naturalWidth * tx) / (texture.image.naturalHeight * ty);
      objeto.children[0].scale.set(proporcion * modificacionRandom, 1 * modificacionRandom, 1 * modificacionRandom);
      objeto.children[0].rotation.set(rotX, rotY, rotZ);
      let capa1 = new THREE.MeshBasicMaterial({
        map: texture,
      });
      for (let obj of objeto.children[0].children) {
        let nombre = obj.name.split("_")[0];
        let esFrente = obj.name.split("_")[1] == 1;
        // console.log(nombre);
        if (nombre === "capa1" && !esFrente) {
          obj.material = capa1;
        }
      }
    },
    undefined,
    function (err) {
      console.error("An error happened.");
    }
  );

  loader.load(
    `./imagenes/cuadros/${texturaArchivo.archivo.split(".")[0]}_c.png`,
    (texture) => {
      let modificacionRandom = 1.0 + Math.random(randmSize);
      let textoDimension = texturaArchivo.tam.split("x");
      let tx = parseInt(textoDimension[0]);
      let ty = parseInt(textoDimension[1]);
      const proporcion = (texture.image.naturalWidth * tx) / (texture.image.naturalHeight * ty);
      objeto.children[0].scale.set(proporcion * modificacionRandom, 1 * modificacionRandom, 1 * modificacionRandom);
      objeto.children[0].rotation.set(rotX, rotY, rotZ);
      let capa1 = new THREE.MeshBasicMaterial({
        map: texture,
      });
      for (let obj of objeto.children[0].children) {
        let nombre = obj.name.split("_")[0];
        let esFrente = obj.name.split("_")[1] == 1;
        // console.log(nombre);
        if (nombre === "capa1" && esFrente) {
          obj.material = capa1;
        }
      }
    },
    undefined,
    function (err) {
      console.error("An error happened.");
    }
  );
}
