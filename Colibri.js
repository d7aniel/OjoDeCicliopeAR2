import { GLTFLoader } from "./three/GLTFLoader.js";

export async function cargarColibri(objetoVacio) {
  var loader = new GLTFLoader();
  return new Promise((resolve) => {
    loader.load("./modelo/colibriExport.glb", function (gltf) {
      for (var i = objetoVacio.children.length - 1; i >= 0; i--) {
        let obj = objetoVacio.children[i];
        objetoVacio.remove(obj);
      }
      objetoVacio.add(gltf.scene);
      objetoVacio.scale.set(3, 3, 3);
      objetoVacio.rotation.set(0, Math.PI * 0.5, 0);
    });
  });
}
