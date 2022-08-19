import { GLTFLoader } from "./three/GLTFLoader.js";
import { MarchingCubes } from "./three/MarchingCubes.js";

export function cargarGotas(objetoVacio) {
  //envMap: refractionCube, refractionRatio: 0.85
  // new THREE.TextureLoader().load("../hdr/fondoRedu.png", function (texture) {
  //   var texturaCielo = iluminador.fromEquirectangular(texture);
  //   //escena.background = texturaCielo.texture;
  //   escena.environment = texturaCielo.texture;
  //   texture.dispose();
  //   iluminador.dispose();
  // });
  let textureEquirec = new THREE.TextureLoader().load("../hdr/fondoRedu.png");
  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  textureEquirec.encoding = THREE.sRGBEncoding;
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: textureEquirec, refractionRatio: 0.85 });
  let effect = new MarchingCubes(30, material, true, true, 100000);
  effect.position.set(0, 0, 0);
  effect.scale.set(300, 300, 300);

  effect.enableUvs = false;
  effect.enableColors = false;

  objetoVacio.add(effect);
  return effect;
}

export function actualizarGotas(object, time, numblobs, floor, wallx, wallz) {
  object.reset();

  // fill the field with some metaballs

  // const rainbow = [
  //   new THREE.Color(0xff0000),
  //   new THREE.Color(0xff7f00),
  //   new THREE.Color(0xffff00),
  //   new THREE.Color(0x00ff00),
  //   new THREE.Color(0x0000ff),
  //   new THREE.Color(0x4b0082),
  //   new THREE.Color(0x9400d3),
  // ];
  const subtract = 12;
  const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

  for (let i = 0; i < numblobs; i++) {
    const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
    const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
    const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.27 + 0.5;

    // if (current_material === "multiColors") {
    //   object.addBall(ballx, bally, ballz, strength, subtract, rainbow[i % 7]);
    // } else {
    object.addBall(ballx, bally, ballz, strength, subtract);
    // }
  }

  if (floor) object.addPlaneY(2, 12);
  if (wallz) object.addPlaneZ(2, 12);
  if (wallx) object.addPlaneX(2, 12);

  object.update();
}
