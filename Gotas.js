import { GLTFLoader } from "./three/GLTFLoader.js";
import { MarchingCubes } from "./three/MarchingCubes.js";

export async function cargarGotas(objetoVacio) {
  //envMap: refractionCube, refractionRatio: 0.85
  // new THREE.TextureLoader().load("../hdr/fondoRedu.png", function (texture) {
  //   var texturaCielo = iluminador.fromEquirectangular(texture);
  //   //escena.background = texturaCielo.texture;
  //   escena.environment = texturaCielo.texture;
  //   texture.dispose();
  //   iluminador.dispose();
  // });
  // <video id="video1" autoplay playsinline style="display:none"></video>
  // let textureEquirec = new THREE.TextureLoader().load("../hdr/fondoRedu.png");

  // let video = document.getElementById("video1");
  const textureEquirec = await new THREE.TextureLoader().load("./hdr/reflejo.png");
  // textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  // textureEquirec.encoding = THREE.sRGBEncoding;
  const material = new THREE.MeshPhongMaterial({ opacity: 0.647, color: 0xffffff, transparent: true, specular: 0x111111, shininess: 1, map: textureEquirec });
  // const material = new THREE.MeshLambertMaterial({ opacity: 0.647, transparent: true, color: 0xffffff, envMap: textureEquirec, refractionRatio: 0.85 });
  console.log(material);
  let effect = new MarchingCubes(32, material, true, true, 100000);
  effect.position.set(0, 0, 0);
  effect.scale.set(12, 12, 12);

  effect.enableUvs = true;
  effect.enableColors = false;
  // effect.enableUvs

  objetoVacio.add(effect);
  return effect;
}
let maxX = 0;
let maxY = 0;
let maxZ = 0;
let blobsBasicos = [];
for (let i = 0; i < 50; i++) {
  blobsBasicos[i] = { x: 0.2 + Math.random() * 0.6, y: Math.random() * -1, z: 0.2 + Math.random() * 0.6, v: 0.5 + Math.random() * 0.5 };
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
  const subtract = 0.8;
  const strength = 0.65 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

  for (let i = 0; i < numblobs; i++) {
    // const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
    // const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
    // const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.27 + 0.5;
    let base = blobsBasicos[i];
    let ti = (1 + i / numblobs) * time * 0.025;
    if (i == 0) {
      console.log(base.y);
    }
    base.y = base.y < 0 ? 2 : base.y;
    base.y = ti * 47 * base.v;
    base.y = base.y % 2;
    const ballx = base.x; //mapRange(Math.abs(1 * Math.cos(80 * ti) - Math.cos(1 * ti) * Math.sin(2 * ti)), 0, 1.768, 0.2, 0.8); //(i / numblobs) * 0.9;
    const bally = 1 - base.y; //1 - mapRange((1 + i) / numblobs, 0, 1, 0.2, 0.8); //mapRange(Math.abs(Math.sin(0.72 * ti) - Math.sin(0.43 * ti)), 0, 2, 0.2, 0.8); //Math.sin(i); // dip into the floor
    const ballz = base.z; //mapRange(Math.abs(2 * Math.sin(1 * ti) - Math.sin(80 * ti)), 0, 2.999, 0.2, 0.8); //(Math.cos(i * 7.8526) / 2 + 0.5) * 0.3; //Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.27 + 0.5;
    const bally2 = bally + 0.1; //1 - mapRange((1 + i) / numblobs, 0, 1, 0.2, 0.8); //mapRange(Math.abs(Math.sin(0.72 * ti) - Math.sin(0.43 * ti)), 0, 2, 0.2, 0.8); //Math.sin(i); // dip into the floor
    // const ballz = 0.1;

    // let x = Math.abs(2 * Math.sin(1 * ti) - Math.sin(80 * ti));
    // if (maxX < x) {
    //   maxX = x;
    //   console.log("Max x", maxX);
    // }
    // if (maxY < bally) {
    //   maxY = bally;
    //   console.log("Max y", maxY);
    // }
    // if (maxZ < ballz) {
    //   maxZ = ballz;
    //   console.log("Max z", maxZ);
    // }
    // if (current_material === "multiColors") {
    // object.addBall(ballx, bally, ballz, strength, subtract, rainbow[i % 7]);
    // } else {
    object.addBall(ballx, bally2, ballz, strength * 0.4, subtract);
    object.addBall(ballx, bally, ballz, strength, subtract);
    // }
  }
  // object.addCirculoY(1, 12);
  if (floor) object.addPlaneY(2, 12);
  if (wallz) object.addPlaneZ(2, 12);
  if (wallx) object.addPlaneX(2, 12);

  object.update();
}

function mapRange(OldValue, OldMin, OldMax, NewMin, NewMax) {
  let OldRange = OldMax - OldMin;
  let NewRange = NewMax - NewMin;
  let NewValue = ((OldValue - OldMin) * NewRange) / OldRange + NewMin;

  return NewValue;
}
