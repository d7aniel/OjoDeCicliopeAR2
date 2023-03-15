import * as THREE from "https://unpkg.com/three@0.122.0/build/three.module.js";
// import { lista } from "./lista.js";
import { texto } from "./texto.js";
import { cargarModelo, setTextura } from "./CargarModelo.js";
// import { cargarColibri } from "./Colibri.js";
// import { cargarFlor } from "./Flor.js";
// import { cargarGotas, actualizarGotas } from "./Gotas.js";
// import { Particula } from "./Particula.js";
console.log("v.3");
let es_iphone = window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === "function";
let d = 60;
// var poss = [
//   new THREE.Vector2(0, 0),
//   new THREE.Vector2(d, d),
//   new THREE.Vector2(-d, d),
//   new THREE.Vector2(d, -d),
//   new THREE.Vector2(-d, -d),
//   new THREE.Vector2(d, 0),
//   new THREE.Vector2(-d, 0),
//   new THREE.Vector2(0, -d),
//   new THREE.Vector2(0, d),
// ];

// let flores = {};
// let galeria = new THREE.Object3D();
// let gotasCubes;
let tamPanuelo = 3;
// let tiempo = 0;
console.log(texto);

const clock = new THREE.Clock();
function isMobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    return true;
  }
  return false;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 70);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas1"),
  preserveDrawingBuffer: true,
});
const geom = new THREE.BoxGeometry(1, 1, 1);
const threex = new THREEx.LocationBased(scene, camera);
// You can change the minimum GPS accuracy needed to register a position - by default 1000m
//const threex = new THREEx.LocationBased(scene, camera. { gpsMinAccuracy: 30 } );
const cam = new THREEx.WebcamRenderer(renderer, "#video1");

let raycaster;
var descCuadro = document.getElementById("descripcionCuadro");
var artistaCuadro = document.getElementById("artistaCuadro");
var nombreCuadro = document.getElementById("nombreCuadro");
var tamCuadro = document.getElementById("tamCuadro");
var tipoCuadro = document.getElementById("tipoCuadro");
const pointer = new THREE.Vector2();
raycaster = new THREE.Raycaster();
function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
document.addEventListener("mousemove", onPointerMove);
// document.addEventListener("click", (e) => {
//   raycaster.setFromCamera(pointer, camera);
//   const intersects = raycaster.intersectObjects(scene.children, true);
//   // console.log(scene.children);
//   // console.log(intersects);
//   const cuadros = intersects.filter((e) => e.object.parent.parent.name.split("_")[0] === "Cuadro");
//   if (cuadros.length > 0) {
//     let nombre = cuadros[0].object.parent.parent.name.split("_")[1];
//     let cuadro = listaCuadros.filter((e) => e.nombre == nombre)[0];

//     descCuadro.style.display = "flex";
//     artistaCuadro.innerText = cuadro.artista;
//     nombreCuadro.innerText = cuadro.nombre;
//     tamCuadro.innerText = cuadro.tam;
//     tipoCuadro.innerText = cuadro.tipo;
//     // artista: "Erbeta"
//     // nombre: "Puerta del abra"
//     // tam: "67x49"
//     // tipo: "óleo sobre tela"
//   }
// });

iluminarConFoto("./hdr/fondoRedu.png", false);

let orientationControls;
if (!es_iphone) {
  if (isMobile()) {
    orientationControls = new THREEx.DeviceOrientationControls(camera);
  }
  document.getElementById("botonPermisos").style.display = "none";
  document.getElementById("botones").style.display = "flex";
} else {
  document.getElementById("botPermiso").addEventListener("click", (e) => conectar());

  function conectar() {
    console.log("conectar orientacion");
    if (isMobile()) {
      orientationControls = new THREEx.DeviceOrientationControls(camera);
    }
    document.getElementById("botonPermisos").style.display = "none";
    document.getElementById("botones").style.display = "flex";
  }
  // document.getElementById("botonPermisos").style.display = "flex";
  // document.getElementById("botones").style.display = "flex";
}

const oneDegAsRad = THREE.MathUtils.degToRad(1);
// let fake = null;
let first = true;

threex.on("gpsupdate", (pos) => {
  console.log("gpsupdate");
  if (first) {
    setupObjects(pos.coords.longitude, pos.coords.latitude);
    first = false;
  }
});

threex.on("gpserror", (code) => {
  alert(`GPS error: code ${code}`);
});

// Uncomment to use a fake GPS location
//fake = { lat: 51.05, lon : -0.72 };
// if (fake) {
//   threex.fakeGps(fake.lon, fake.lat);
// } else {
console.log("--iniciamos--");
threex.startGps();
// }

requestAnimationFrame(render);

let mousedown = false,
  lastX = 0;

// Mouse events for testing on desktop machine
if (!isMobile()) {
  window.addEventListener("mousedown", (e) => {
    mousedown = true;
  });

  window.addEventListener("mouseup", (e) => {
    mousedown = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!mousedown) return;
    if (e.clientX < lastX) {
      camera.rotation.y -= oneDegAsRad * 4;
      if (camera.rotation.y < 0) {
        camera.rotation.y += 2 * Math.PI;
      }
    } else if (e.clientX > lastX) {
      camera.rotation.y += oneDegAsRad * 4;
      if (camera.rotation.y > 2 * Math.PI) {
        camera.rotation.y -= 2 * Math.PI;
      }
    }
    lastX = e.clientX;
  });
}

// const setObjectQuaternion = function (quaternion, alpha, beta, gamma, orient) {
//   _euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

//   quaternion.setFromEuler(_euler); // orient the device

//   quaternion.multiply(_q1); // camera looks out the back of the device, not the top

//   quaternion.multiply(_q0.setFromAxisAngle(_zee, -orient)); // adjust for screen orientation
// };

// const _zee = new THREE.Vector3(0, 0, 1);
// const _euler = new THREE.Euler();
// const _q0 = new THREE.Quaternion();
// const _q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

function cambiaRotacion() {
  console.log("lalalalalala");
}

let tamGaleriaAjustado = false;
function render(time) {
  // if (galeria.children[0] && !tamGaleriaAjustado) {
  //   let capaTex = galeria.children.filter((e) => e.name.split("_")[0] === "Cuadro")[0].children[0].children.filter((e) => e.name.split("_")[0] === "capa1")[0];
  //   if (capaTex && capaTex.material) {
  //     if (capaTex.material.map) {
  //       tamGaleriaAjustado = true;
  //       let objetos = galeria.children.filter((e) => e.name.split("_")[0] === "Cuadro");
  //       let sum = 0;
  //       for (let i = 1; i < objetos.length; i++) {
  //         sum += objetos[i - 1].children[0].scale.x * 0.5 + objetos[i].children[0].scale.x * 0.5;
  //         objetos[i].children[0].position.set(3 * sum, 0, 0);
  //       }
  //     }
  //   }
  // }
  // if (galeria.children[0])
  // if (flores.objetos != undefined) {
  //   // modeloTmp.position.set(tamPanuelo * proporcion, 0, 0);
  //   // proporcion += prop * 2.5;
  //   // console.log(proporcion);

  //   for (let f = 0; f < flores.objetos.length; f++) {
  //     flores.objetos[f].rotarPetalos();
  //   }
  // }
  // if (gotasCubes != null && gotasCubes != undefined) {
  //   const delta = clock.getDelta();
  //   tiempo += delta * 0.5;
  //   actualizarGotas(gotasCubes, tiempo, 13, false, false, false);
  // }
  resizeUpdate();
  if (orientationControls) {
    orientationControls.update();
    // orientationControls.update();
    // orientationControls.addEventListener("change", cambiaRotacion);
    if (es_iphone) camera.rotation.set(camera.rotation.x, camera.rotation.y + Math.PI * 0.5, camera.rotation.z);

    // const orient = orientationControls.screenOrientation ? MathUtils.degToRad(orientationControls.screenOrientation) : 0; // O

    // let alpha = THREE.MathUtils.degToRad(orientationControls.deviceOrientation.alpha);
    // let beta = THREE.MathUtils.degToRad(orientationControls.deviceOrientation.beta);
    // let gamma = THREE.MathUtils.degToRad(orientationControls.deviceOrientation.gamma);

    // beta -= orientationControls.HALF_PI;
    // // console.log(orientationControls);
    // // console.log(orientationControls.setObjectQuaternion);
    // // console.log(orientationControls.object.quaternion);

    // setObjectQuaternion(
    //   orientationControls.object.quaternion,
    //   alpha,
    //   orientationControls.smoothingFactor < 1 ? beta - Math.PI : beta,
    //   orientationControls.smoothingFactor < 1 ? gamma - orientationControls.HALF_PI : gamma,
    //   orient
    // );

    // if (8 * (1 - lastQuaternion.dot(orientationControls.object.quaternion)) > EPS) {
    //   lastQuaternion.copy(orientationControls.object.quaternion);
    //   orientationControls.dispatchEvent(_changeEvent);
    // }
  }
  cam.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  // if (modelos && modelos.length > 0) {
  //   let a = "paisaje";
  //   let dMin = 99999999;
  //   const id = 0;
  //   for (let i = 0; i < modelos.length; i++) {
  //     if (modelos[i].position.distanceTo(camera.position) < dMin) {
  //       a = modelos[i].textoDescarga + "_" + modelos[i].textoDescarga_nom + "_" + modelos[i].textoDescarga_a + "_" + id;
  //       dMin = modelos[i].position.distanceTo(camera.position);
  //     }
  //   }
  //   texto.actualizar(a, dMin);
  // }
  // console.log(modelos, modelos.length);
  if (modelos && modelos.length > 0) {
    // texto.actualizar(`${camera.position.x.toFixed(1)}`);
    texto.actualizar(
      `${camera.rotation.x.toFixed(2)},${camera.rotation.y.toFixed(2)},${camera.rotation.z.toFixed(2)}`,
      `${(modelos[0].position.x - camera.position.x).toFixed(2)}, 
      ${(modelos[0].position.y - camera.position.y).toFixed(2)}, 
      ${(modelos[0].position.z - camera.position.z).toFixed(2)},
      ${modelos[0].position.distanceTo(camera.position).toFixed(2)}
      
      ${(modelos[1].position.x - camera.position.x).toFixed(2)}, 
      ${(modelos[1].position.y - camera.position.y).toFixed(2)}, 
      ${(modelos[1].position.z - camera.position.z).toFixed(2)},
      ${modelos[1].position.distanceTo(camera.position).toFixed(2)}`
    );
  }
}

// function mover() {
//   for (let i = 0; i < particulas.length; i++) {
//     let acc = particulas[i].alejar(poss[0], limiteInterno);
//     let acc2 = particulas[i].acercar(poss[0], limiteExterno);
//     particulas[i].vel.add(acc);
//     particulas[i].vel.add(acc2);
//     for (let j = 0; j < particulas.length; j++) {
//       if (i != j) {
//         let acc3 = particulas[i].alejar(particulas[j].pos, limiteColision);
//         particulas[i].vel.add(acc3);
//       }
//     }
//     /*for (let j=0; j<4; j++) {
//       let acc3 =  particulas[i].alejar(poss[j+1], radio*0.5);
//       particulas[i].vel.add(acc3);
//     }*/
//     particulas[i].vel.clampLength(-particulas[i].velMax, particulas[i].velMax);
//     particulas[i].irAlFrente();
//     particulas[i].pos.add(particulas[i].vel);
//     particulas[i].actualizar();
//   }
// }

function resizeUpdate() {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth,
    height = canvas.clientHeight;
  if (width != canvas.width || height != canvas.height) {
    renderer.setSize(width, height, false);
  }
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

let getNombre = function () {
  let a = "paisaje";
  let dMin = 99999999;
  const id = Math.random().toString(16).slice(2);
  for (let i = 0; i < modelos.length; i++) {
    if (modelos[i].position.distanceTo(camera.position) < dMin) {
      a = modelos[i].textoDescarga + "_" + modelos[i].textoDescarga_nom + "_" + modelos[i].textoDescarga_a + "_" + id;
      dMin = modelos[i].position.distanceTo(camera.position);
    }
  }
  return a;
};

window.getNombre = getNombre;

// let particulas = [];
let modelos = []; //new THREE.Object3D();
let cuenta = 0;
let listaModelos = ["./modelo/cuadroVacio3.glb"];
let listaCuadros = [
  {
    tipo: "óleo sobre tela",
    tam: "80x59",
    artista: "Erbetta",
    archivo: "c1r.png",
    nombre: "Primavera en la sierra",
    anio: "1980",
  },
  {
    tipo: "óleo sobre tela",
    tam: "67x49",
    artista: "Erbetta",
    archivo: "c2r.png",
    nombre: "Trigal",
    anio: "1982",
  },
  {
    tipo: "óleo sobre tela",
    tam: "67x49",
    artista: "Erbetta",
    archivo: "c3r.png",
    nombre: "Puerta del abra",
    anio: "1983",
  },
  {
    tipo: "óleo sobre tela",
    tam: "35x45",
    artista: "Lobato",
    archivo: "c4r.png",
    nombre: "Campo Don Francisco",
    anio: "2007",
  },
  {
    tipo: "óleo sobre tela",
    tam: "60x40",
    artista: "Lobato",
    archivo: "c5r.png",
    nombre: "Sierra chata II",
    anio: "1997",
  },
  {
    tipo: "óleo sobre tela",
    tam: "60x40",
    artista: "Lobato",
    archivo: "c6r.png",
    nombre: "Sierra del monte",
    anio: "2000",
  },
  // { nombre: "Primavera en la sierra", tipo: "óleo sobre tela", tam: "80x59", artista: "Erbeta", archivo: "cuadro1.png", rotacion: 0 },
  {
    tipo: "óleo sobre tela",
    tam: "73x53",
    artista: "Manzanares",
    archivo: "c7r.png",
    nombre: "Laguna brava",
    anio: "1960",
  },
  {
    tipo: "óleo sobre tela",
    tam: "60x37",
    artista: "Manzanares",
    archivo: "c9r.png",
    nombre: "Volver",
    anio: "1981",
  },
  {
    tipo: "óleo sobre tela",
    tam: "50x40",
    artista: "Manzanares",
    archivo: "c8r.png",
    nombre: "Ranchito",
    anio: "1981",
  },
  {
    tipo: "óleo sobre tela",
    tam: "1x1", //"21x15",
    artista: "Miquelarena",
    archivo: "c12r.jpg",
    nombre: "Laguna brava",
    anio: "2002",
  },
  {
    tipo: "ótecnica mixta",
    tam: "1x1", //"17x13",
    artista: "Miquelarena",
    archivo: "c10r.jpg",
    nombre: "Cerro El Paulino",
    anio: "2002",
  },
  {
    tipo: "óleo sobre tela",
    tam: "1x1", //"23x18",
    artista: "Miquelarena",
    archivo: "c11r.jpg",
    nombre: "La Capilla del Cerro",
    anio: "2002",
  },
];

let lista = [
  [-58.27464, -37.8932134],
  [-58.2776, -37.8964], //trigal
  [-58.2754, -37.894],
  [-58.2766, -37.8957727],
  [-58.2783, -37.89676], //sierra chata desde descampado
  [-58.27599, -37.8949],

  [-58.27378, -37.89297],
  [-58.27365953785302, -37.89359786626062],
  [-58.27331, -37.89429304548791],
  [-58.273455, -37.8946],
  [-58.2727, -37.8945],
  [-58.2732, -37.8946],
];
let t = `{
  "type": "FeatureCollection",
  "features": [`;
for (let i = 0; i < lista.length; i++) {
  let l = lista[i];
  t += `{
  "type": "Feature",
  "properties": {
    "marker-color": "${i < 3 ? "#0000ff" : i < 6 ? "#ffbb11" : i < 9 ? "#ffbbFF" : "#00eeff"}",
    "marker-size": "${i < 3 ? "#0080ff" : "#ffbb11"}"
  },
  "geometry": {
    "coordinates": [
      ${l[0]},
      ${l[1]}
    ],
    "type": "Point"
  }
},`;
  t += "\n";
}
t += "]}";
console.log(t);
// ---- POSICIONES REALES
console.log("act. 10");
//suma a la izq
//resta a la der  2781
// -57.968722, -34.903066;
let listaDePosiciones = [
  { lat: -34.903066, lon: -57.968722, rot: 0 + Math.PI * 0.7, alto: 10 },
  // { lat: -37.8932134, lon: -58.27464, rot: 0 + Math.PI * 0.7, alto: 10 },//real
  // -34.90356440168241, -57.96781789655587
  { lat: -34.90356440168241, lon: -57.96781789655587, rot: 2.237 - Math.PI * 0.7, alto: 10 }, //trigal
  // { lat: -37.8964, lon: -58.27765, rot: 2.237 - Math.PI * 0.7, alto: 10 }, //trigal real
  { lat: -37.894, lon: -58.2754, rot: 5.982 + Math.PI * 0.5, alto: 10 },
  ///////////////////
  { lat: -37.8957727, lon: -58.2766, rot: 2.237 + Math.PI * 0.5, alto: 10 },
  { lat: -37.89676, lon: -58.2783, rot: 2.237 - Math.PI * 0.4, alto: 10 }, //el del final sierra chata desde descampado
  { lat: -37.8949, lon: -58.27599, rot: 2.237, alto: 10 },
  //////////////////
  { lat: -37.89329651172384, lon: -58.2736594246788, rot: Math.PI, alto: 11 },
  { lat: -37.8938238, lon: -58.2736164, rot: Math.PI * 0.95, alto: 11 }, //24
  { lon: -58.27363002290141, lat: -37.8944581574287, rot: Math.PI * 0.85, alto: 11 }, //11
  // { lat: -37.8938238, lon: -58.2736164, rot: Math.PI * 0.95, alto: 9 }, //9
  /////////////////////
  { lon: -58.27350726567757, lat: -37.89503621415675, rot: Math.PI * 0.95, alto: 10 },
  { lon: -58.27279249079763, lat: -37.89459799399449, rot: -2.237 + Math.PI * 0.25, alto: 11 },
  { lon: -58.27245835555467, lat: -37.89412725069708, rot: Math.PI * 2.0, alto: 10 },
];
// -58.27363002290141, -37.8944581574287;
// -58.27279249079763,
// -37.89459799399449
// -58.27332114570316,
// -37.8950264225422
// [-58.2736164, -37.8938238];
// //
// [-58.2735571, -37.8945416];
// //
// [-58.27278830972719, -37.89455180155952],
//   //
//   [-58.2732208, -37.8951584];

// [-58.27363022250347, -37.89329651172532],
//   //
//   [-58.27357687533127, -37.89390237733725],
//   //
//   [-58.27358147626033, -37.894423608807635],
//   //
//   [-58.272908029018126, -37.8946238801392],
//   //
//   [-58.2725519, -37.8943636],
// let posGaleria = { lon: -58.27863, lat: -37.896355, rot: -2.237, alto: 7 };
// let posGotas = { lat: -37.894275, lon: -58.271919, rot: 3.845 }; //claro
// let posFlor = { lat: -37.898779, lon: -58.278456, rot: 2.237 }; //punto
// let posColibri = { lat: -37.902247, lon: -58.278526, rot: 1.47 }; // mirador

// -34.859884, -58.070084 //entrada
// -34.861081, -58.071994 // cruce camino del encuentro
// -34.864848, -58.074397 //arbol grandotote
// -34.860557, -58.070826 //camino 1
// -34.861402, -58.072457 //camino 2
// -34.862722, -58.073874 //camino 3
// -34.864746, -58.075545 //camino 4
// -34.866241, -58.074888 //camino 5
// -34.862690, -58.070715 //camino encuentro bosque
// -34.868863, -58.076021 //cancha
// -34.864368, -58.071961 //medio de la nada
// -34.867738, -58.078479 //camino atras de la cancha
//----- POSICIONES DEBUG PARQUE ECOLOGICO
// let listaDePosiciones = [
//   { lat: -34.860557, lon: -58.070826, rot: 0, alto: 7 },
//   { lat: -34.86021, lon: -58.07792, rot: 0, alto: 7 }, // false
//   { lat: -34.903066, lon: -57.968722, rot: Math.PI * -0.5, alto: 7 }, // false
//   { lat: -34.861402, lon: -58.072457, rot: 2.237, alto: 7 },
//   { lat: -34.862722, lon: -58.073874, rot: 5.982, alto: 7 },
//   { lat: -34.859983, lon: -58.078134, rot: 2.237, alto: 7 }, //false casa marcela
//   { lat: -34.859844, lon: -58.077973, rot: 5.982, alto: 7 }, //false casa marcela
//   { lat: -37.864746, lon: -58.075545, rot: 2.237, alto: 7 },
//   { lat: -34.866241, lon: -58.074888, rot: 2.237, alto: 7 },
//   { lat: -34.859884, lon: -58.070084, rot: 0, alto: 7 },
//   { lat: -34.86269, lon: -58.070715, rot: -2.237, alto: 7 },
// ];
// let posGaleria = { lat: -34.867738, lon: -58.078479, rot: -2.237, alto: 7 };
// let posGotas = { lat: -34.868863, lon: -58.076021, rot: 3.845 }; //claro real
// let posFlor = { lat: -34.864848, lon: -58.074397, rot: 2.237 }; //punto real
// let posColibri = { lat: -34.861081, lon: -58.071994, rot: 1.47 }; // mirador real

// let posGotas = { lat: -34.860210, lon: -58.077920, rot: 3.845 }; //claro falso
// let posFlor = { lat: -34.859983, lon: -58.078134, rot: 2.237 }; //punto falso
// let posColibri = { lat: -34.859844, lon: -58.077973, rot: 1.47 }; // mirador false

//----- POSICIONES DEBUG CIRCUNVALACION
// let listaDePosiciones = [
//   { lat: -34.895982, lon: -57.964274, rot: Math.PI + 0, alto: 7 },
//   { lat: -34.897413, lon: -57.965891, rot: Math.PI + 2.237, alto: 7 },
//   { lat: -34.897893, lon: -57.966437, rot: Math.PI + 5.982, alto: 7 },
//   { lat: -34.899327, lon: -57.968007, rot: Math.PI + 2.237, alto: 7 },
//   { lat: -34.901211, lon: -57.97001, rot: Math.PI + 2.237, alto: 7 },
//   { lat: -34.904855, lon: -57.974063, rot: Math.PI + 0, alto: 7 },
//   { lat: -34.905778, lon: -57.975101, rot: Math.PI - 2.237, alto: 7 },
// ];

// let posGaleria = { lat: -34.896786, lon: -57.965229, rot: -2.237, alto: 7 };
// let posGotas = { lat: -34.898479, lon: -57.967096, rot: 3.845 }; //claro
// let posFlor = { lat: -34.899836, lon: -57.96858, rot: 2.237 }; //punto
// let posColibri = { lat: -34.901761, lon: -57.970671, rot: 1.47 }; // mirador

async function setupObjects(longitude, latitude) {
  if (first) {
    // texto.remove();
  }

  //--- cuadros aislados
  let listaTexturasAisladas = [];
  let listaTexturasGaleria = [];
  for (let i = 0; i < listaCuadros.length; i++) {
    // if (i < 5) {
    //   listaTexturasGaleria.push(listaCuadros[i]);
    // } else {
    listaTexturasAisladas.push(listaCuadros[i]);
    // }
  }
  let modeloBase = new THREE.Object3D();

  await cargarModelo(listaModelos[0], modeloBase).then((resultado) => {
    for (let i = 0; i < listaTexturasAisladas.length; i++) {
      modelos[i] = modeloBase.clone();
      modelos[i].name = `Cuadro_${listaTexturasAisladas[i].nombre}`;
      modelos[i].textoDescarga = `${listaTexturasAisladas[i].artista}`;
      modelos[i].textoDescarga_nom = `${listaTexturasAisladas[i].nombre}`;
      modelos[i].textoDescarga_a = `${listaTexturasAisladas[i].anio}`;
      setTextura(listaTexturasAisladas[i], modelos[i], 0, listaDePosiciones[i].rot, 0);
      modelos[i].scale.set(tamPanuelo, tamPanuelo, tamPanuelo);
    }
    // console.log("crear modelo");
    // for (let i = 0; i < listaTexturasGaleria.length; i++) {
    //   let modeloTmp = modeloBase.clone();
    //   modeloTmp.name = `Cuadro_${listaTexturasGaleria[i].nombre}`;
    //   setTextura(listaTexturasGaleria[i], modeloTmp, 0, 0, 0, 0.1);
    //   modeloTmp.scale.set(tamPanuelo, tamPanuelo, tamPanuelo);
    //   galeria.add(modeloTmp);
    // }
    // let indice = 0;
    // console.log(galeria.children.filter((e) => e.name.split("_")[0] === "Cuadro")[indice].children[0].children.filter((e) => e.name.split("_")[0] === "capa1")[0].material.map);
    // console.log(galeria.children[0].children[0].material);
  });
  // let colibri = new THREE.Object3D();
  // cargarColibri(colibri);
  // let flor = new THREE.Object3D();
  // cargarFlor(flor, flores);
  // let gotas = new THREE.Object3D();
  // gotasCubes = await cargarGotas(gotas);

  for (let m = 0; m < listaTexturasAisladas.length; m++) {
    threex.add(modelos[m], listaDePosiciones[m].lon, listaDePosiciones[m].lat, listaDePosiciones[m].alto);
  }
  // threex.add(galeria, posGaleria.lon, posGaleria.lat, posGaleria.alto); //galeria mi casa
  // threex.add(gotas, posGotas.lon, posGotas.lat, 15); //galeria mi casa
  // threex.add(flor, posFlor.lon, posFlor.lat, -40); //galeria mi casa
  // threex.add(colibri, posColibri.lon, posColibri.lat, posColibri.alto); //galeria mi casa

  // let lista = [
  //   { lt: -37.892693, lg: -58.273934 },
  //   { lt: -37.894304, lg: -58.275456 },
  //   { lt: -37.894473, lg: -58.273593 },
  //   { lt: -37.894269, lg: -58.271683 },
  //   { lt: -37.896414, lg: -58.275124 },
  // ];
  // let offset = [
  //   { x: 0, y: oneDegAsRad * 0.15, z: 25 },
  //   { x: 0, y: oneDegAsRad * -0.15, z: 25 },
  //   { x: oneDegAsRad * 0.15, y: 0, z: 40 },
  //   { x: oneDegAsRad * 0.15, y: 0, z: 50 },
  //   { x: 0, y: 0, z: 100 },
  // ];

  // const video = document.getElementById( 'video' );
  // 			video.play();
  // threex.add(colibri, -57.968722, -34.903066, 0); //mi casa
  // threex.add(colibri, -58.078173, -34.860005, 0); //casa marcela
  // threex.add(flor, -58.006153, -34.886712, -20); //flor ciop
  // threex.add(flor, -58.077909, -34.860097 - 20); //flor casa marcela
  // threex.add(flor, -59.089383, -35.172388, -20); //flor casa lobos
  // threex.add(flor, -57.968123, -34.903145, -20); //flor mi casa
  // threex.add(gotas, -58.0068, -34.886712, 0); //gotas ciop
  // console.log("distancia");
  // console.log(latitude - lat);
  // console.log(longitude - lon);
  // console.log(Math.sqrt(Math.pow(latitude - lat, 2), Math.pow(longitude - lon, 2)));
  // let lat = -34.90301;
  // let lon = -57.968123;
  // threex.add(gotas, lon, lat, 0); //gotas mi casa
  // -34.859931, -58.077947;
  // threex.add(gotas, -58.077947, -34.859931, 10); //gotas casa marcela
  // -54.813582, -68.323999
  // -54.813590, -68.324806
  // -54.813572, -68.325321
  // threex.add(gotas, -68.325321, -54.813572, 10); //gotas ushuaia

  // threex.add(gotas, -57.968023, -34.903245, 10); //gotas mi casa
  // threex.add(colibri, -58.006153, -34.886712, 0); //ciop

  // threex.add(modelos[0], -57.968023, -34.903245, 1); //galeria mi casa
  // if (i == 0) {
  //   threex.add(modelos[0], -57.968023, -34.903245, 1); //galeria mi casa
  // }
}

// var download = function () {
//   var link = document.createElement("a");
//   link.download = "filename.png";
//   link.href = document.getElementById("canvas").toDataURL();
//   link.click();
// };

function crearActualizacion() {
  // console.log("creandoooo");
  let a = document.createElement("a");
  a.style.position = "absolute";
  // a.style.top = "";
  a.style.display = "flex";
  a.style.justifyContent = "center";
  a.style.bottom = "160px";
  a.style.transform = "absolute";
  a.style.width = "100%";
  a.id = "download";
  let btn = document.createElement("button");
  btn.type = "button";
  btn.innerText = "Cambiar modelo";
  btn.addEventListener("click", cambiarModelo);

  let btn4 = document.createElement("button");
  btn4.type = "button";
  btn4.innerText = "Actualizar";
  btn4.addEventListener("click", actualizar);

  let btn2 = document.createElement("button");
  btn2.type = "button";
  btn2.innerText = "Aumentar";
  btn2.addEventListener("click", aumentarTam);

  let btn3 = document.createElement("button");
  btn3.type = "button";
  btn3.innerText = "Reducir";
  btn3.addEventListener("click", reducirTam);

  // .onClick = () => {
  //   console.log("asdasdasd");
  // };

  a.append(btn);
  // a.append(btn4);
  a.append(btn2);
  a.append(btn3);
  document.body.append(a);

  // <a
  //   style="position: absolute;position: absolute; top: 40;
  // display: flex; justify-content: center; bottom: 40px;
  //  width: 100%;"
  //   id="download"
  //   download="triangle.png"
  // >
  //   <button type="button" onClick="download()">
  //     Download
  //   </button>
  // </a>;
}

function iluminarConFoto(archivo) {
  let iluminador = new THREE.PMREMGenerator(renderer);
  iluminador.compileEquirectangularShader();
  let escena = scene;
  new THREE.TextureLoader().load(archivo, function (texture) {
    var texturaCielo = iluminador.fromEquirectangular(texture);
    //escena.background = texturaCielo.texture;
    escena.environment = texturaCielo.texture;
    texture.dispose();
    iluminador.dispose();
  });
  // let light = new THREE.DirectionalLight(0xffffff);
  // light.position.set(0.5, 0.5, -10);
  // scene.add(light);

  // let pointLight = new THREE.PointLight(0xffffff);
  // pointLight.position.set(0, 0, 100);
  // scene.add(pointLight);

  let ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);
}

function aumentarTam() {
  tamPanuelo += 5;
  puerta.scale.set(tamPanuelo, tamPanuelo, tamPanuelo);
}
function reducirTam() {
  tamPanuelo -= 5;
  puerta.scale.set(tamPanuelo, tamPanuelo, tamPanuelo);
}
function actualizar() {
  window.location.reload(true);
}
function cambiarModelo() {
  // console.log("funciona");
  // console.log(document.getElementById("download"));
  // var download = document.getElementById("download");
  // var image = document.getElementById("canvas1").toDataURL("image/png").replace("image/png", "image/octet-stream");
  // download.setAttribute("href", image);
  cuenta++;
  if (cuenta >= listaModelos.length) {
    cuenta = 0;
  }
  cargarModelo(listaModelos[cuenta], puerta);
  // window.location.reload(true);
}

function fullScreen() {
  var goFS = document.getElementById("goFS");
  goFS.addEventListener(
    "click",
    function () {
      document.body.requestFullscreen();
    },
    false
  );
}
//download.setAttribute("download","archive.png");
// crearActualizacion();

// function tomarFoto() {
//   const screenshotTarget = document.body;
//   html2canvas(screenshotTarget).then((canvas) => {
//     const base64image = canvas.toDataURL("image/png");
//     window.location.href = base64image;
//   });
// }
