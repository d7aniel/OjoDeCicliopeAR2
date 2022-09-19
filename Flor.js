import { GLTFLoader } from "./three/GLTFLoader.js";
import * as THREE from "https://unpkg.com/three@0.122.0/build/three.module.js";

export async function cargarFlor(objetoVacio, floresOut) {
  var loader = new GLTFLoader();
  let flores = [];
  return new Promise((resolve) => {
    loader.load("./modelo/flor.glb", function (gltf) {
      for (var i = objetoVacio.children.length - 1; i >= 0; i--) {
        let obj = objetoVacio.children[i];
        objetoVacio.remove(obj);
      }
      let posiciones = [
        { x: 3, y: 2 },
        { x: 8, y: 5 },
        { x: -4, y: -3 },
        { x: 7, y: -8 },
      ];

      for (let off = 0; off < posiciones.length; off++) {
        flores[off] = new Flor();
        for (let obj of gltf.scene.children) {
          let nombre = obj.name.split("_")[0];
          // console.log(nombre);
          if (nombre === "Caliz") {
            let calizClon = obj.clone();
            calizClon.scale.set(2, 2, 2);
            flores[off].obj.add(calizClon);
          } else if (nombre === "Petalo") {
            for (let i = 0; i < Math.PI * 2; i += (Math.PI * 2) / 16) {
              let petaloClon = obj.clone();
              petaloClon.rotation.set(0, i, 0);
              flores[off].asginarPetalo(petaloClon, i);
              flores[off].obj.add(petaloClon);
            }
          }
        }
        flores[off].obj.position.set(posiciones[off].x, 0, posiciones[off].y);
        objetoVacio.add(flores[off].obj);
      }
      floresOut["objetos"] = flores;
      objetoVacio.scale.set(3, 3, 3);
      objetoVacio.rotation.set(0, Math.PI * 0.5, 0);
    });
  });
}

class Flor {
  constructor() {
    this.avance = 0;
    this.diffAvance = 0.001 + Math.random() * 0.01;
    this.petalos = [];
    this.obj = new THREE.Object3D();
    this.spherical = new THREE.Spherical();
    this.rotationMatrix = new THREE.Matrix4();
    this.targetQuaternion = new THREE.Quaternion();
    this.targets = [];
  }

  asginarPetalo(obj, rot) {
    this.petalos.push(obj);
    let tmp = new THREE.Object3D();
    tmp.position.set(Math.cos(rot), 0, Math.sin(rot));
    this.targets.push(tmp);
  }

  rotarPetalos() {
    this.avance += this.diffAvance;
    let y = Math.sin(this.avance);
    for (let a = 0; a < this.petalos.length; a++) {
      let x = this.targets[a].position.x;
      let z = this.targets[a].position.z;
      this.targets[a].position.set(x, y * 4 - 4, z);

      this.rotationMatrix.lookAt(this.targets[a].position, this.petalos[a].position, this.petalos[a].up);
      this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix);
      this.petalos[a].quaternion.rotateTowards(this.targetQuaternion, 0.1);
    }
  }
}
