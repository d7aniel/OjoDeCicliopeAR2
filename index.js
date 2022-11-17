import * as THREE from "https://unpkg.com/three@0.122.0/build/three.module.js";
// import { lista } from "./lista.js";
import { texto } from "./texto.js";
import { cargarModelo, setTextura } from "./CargarModelo.js";
import { cargarColibri } from "./Colibri.js";
import { cargarFlor } from "./Flor.js";
import { cargarGotas, actualizarGotas } from "./Gotas.js";
// import { Particula } from "./Particula.js";
console.log("v.1");
let d = 60;
var poss = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(d, d),
  new THREE.Vector2(-d, d),
  new THREE.Vector2(d, -d),
  new THREE.Vector2(-d, -d),
  new THREE.Vector2(d, 0),
  new THREE.Vector2(-d, 0),
  new THREE.Vector2(0, -d),
  new THREE.Vector2(0, d),
];

let flores = {};
let galeria = new THREE.Object3D();
let gotasCubes;
let tamPanuelo = 3;
let tiempo = 0;
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
const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
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
if (isMobile()) {
  orientationControls = new THREEx.DeviceOrientationControls(camera);
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

let tamGaleriaAjustado = false;
function render(time) {
  if (galeria.children[0] && !tamGaleriaAjustado) {
    let capaTex = galeria.children.filter((e) => e.name.split("_")[0] === "Cuadro")[0].children[0].children.filter((e) => e.name.split("_")[0] === "capa1")[0];
    if (capaTex && capaTex.material) {
      if (capaTex.material.map) {
        tamGaleriaAjustado = true;
        let objetos = galeria.children.filter((e) => e.name.split("_")[0] === "Cuadro");
        let sum = 0;
        for (let i = 1; i < objetos.length; i++) {
          sum += objetos[i - 1].children[0].scale.x * 0.5 + objetos[i].children[0].scale.x * 0.5;
          objetos[i].children[0].position.set(3 * sum, 0, 0);
        }
      }
    }
  }
  // if (galeria.children[0])
  if (flores.objetos != undefined) {
    // modeloTmp.position.set(tamPanuelo * proporcion, 0, 0);
    // proporcion += prop * 2.5;
    // console.log(proporcion);

    for (let f = 0; f < flores.objetos.length; f++) {
      flores.objetos[f].rotarPetalos();
    }
  }
  if (gotasCubes != null && gotasCubes != undefined) {
    const delta = clock.getDelta();
    tiempo += delta * 0.5;
    actualizarGotas(gotasCubes, tiempo, 13, false, false, false);
  }
  resizeUpdate();
  if (orientationControls) orientationControls.update();
  cam.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
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

// let particulas = [];
let modelos = []; //new THREE.Object3D();
let cuenta = 0;
let listaModelos = ["./modelo/cuadroVacio2.glb"];
let listaCuadros = [
  { nombre: "Primavera en la sierra", tipo: "óleo sobre tela", tam: "80x59", artista: "Erbeta", archivo: "c1r.png", rotacion: 0 },
  { nombre: "Trigal", tipo: "óleo sobre tela", tam: "67x49", artista: "Erbeta", archivo: "c2r.png", rotacion: 0 },
  { nombre: "Puerta del abra", tipo: "óleo sobre tela", tam: "67x49", artista: "Erbeta", archivo: "c3r.png", rotacion: 0 },
  { nombre: "Campo don Francisco", tipo: "óleo sobre tela", tam: "35x45", artista: "Lobato", archivo: "c4r.png", rotacion: 0 },
  { nombre: "Sierra chata II", tipo: "óleo sobre tela", tam: "40x60", artista: "Lobato", archivo: "c5r.png", rotacion: 0 },
  { nombre: "Sierra del monte", tipo: "óleo sobre tela", tam: "40x60", artista: "Lobato", archivo: "c6r.png", rotacion: 0 },
  { nombre: "Laguna brava", tipo: "óleo sobre tela", tam: "80x59", artista: "Manzanares", archivo: "c7r.png", rotacion: 0 },
  { nombre: "Ranchito", tipo: "óleo sobre tela", tam: "80x59", artista: "Manzanares", archivo: "c8r.png", rotacion: 0 },
  { nombre: "Volver", tipo: "óleo sobre tela", tam: "80x59", artista: "Manzanares", archivo: "c9r.png", rotacion: 0 },
  { nombre: "Copia de Cerro el Paulino", tipo: "óleo sobre tela", tam: "1x1", artista: "Miquelarena", archivo: "c10r.jpg", rotacion: 0 },
  { nombre: "Copia de La Capilla del Cerro", tipo: "óleo sobre tela", tam: "1x1", artista: "Miquelarena", archivo: "c11r.jpg", rotacion: 0 },
  { nombre: "Copia de Laguna brava", tipo: "óleo sobre tela", tam: "1x1", artista: "Miquelarena", archivo: "c12r.jpg", rotacion: 0 },
  // { nombre: "Primavera en la sierra", tipo: "óleo sobre tela", tam: "80x59", artista: "Erbeta", archivo: "cuadro1.png", rotacion: 0 },
];
//---- POSICIONES REALES
// let listaDePosiciones = [
//   { lat: -37.89309, lon: -58.273678, rot: 0, alto: 0 },
//   { lat: -37.894784, lon: -58.275958, rot: 2.237, alto: 0 },
//   { lat: -37.895227, lon: -58.273308, rot: 5.982, alto: 0 },
//   { lat: -37.896478, lon: -58.275049, rot: 2.237, alto: 0 },
//   { lat: -37.898115, lon: -58.277343, rot: 2.237, alto: 0 },
//   { lat: -37.900977, lon: -58.2798, rot: 0, alto: 0 },
//   { lon: -58.27863, lat: -37.896355, rot: -2.237, alto: 0 },
// ];
// let posGaleria = { lon: -58.27863, lat: -37.896355, rot: -2.237 };
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
//   { lat: -34.860557, lon: -58.070826, rot: 0, alto: 0 },
//   { lat: -34.861402, lon: -58.072457, rot: 2.237, alto: 0 },
//   { lat: -37.862722, lon: -58.073874, rot: 5.982, alto: 0 },
//   { lat: -37.864746, lon: -58.075545, rot: 2.237, alto: 0 },
//   { lat: -34.866241, lon: -58.074888, rot: 2.237, alto: 0 },
//   { lat: -34.859884, lon: -58.070084, rot: 0, alto: 0 },
//   { lat: -34.86269, lon: -58.070715, rot: -2.237, alto: 0 },
// ];
// let posGaleria = { lat: -34.867738, lon: -58.078479, rot: -2.237 };
// let posGotas = { lat: -34.868863, lon: -58.076021, rot: 3.845 }; //claro
// let posFlor = { lat: -34.864848, lon: -58.074397, rot: 2.237 }; //punto
// let posColibri = { lat: -34.861081, lon: -58.071994, rot: 1.47 }; // mirador

//----- POSICIONES DEBUG CIRCUNVALACION
let listaDePosiciones = [
  // -34.895982, -57.964274
  // -34.896786, -57.965229
  // -34.897413, -57.965891
  // -34.897893, -57.966437
  // -34.898479, -57.967096
  // -34.899327, -57.968007
  // -34.899836, -57.968580
  // -34.901211, -57.970010
  // -34.901761, -57.970671
  // -34.904855, -57.974063
  // -34.905778, -57.975101

  // -34.903076, -57.968118
  { lat: -34.860557, lon: -58.070826, rot: 0, alto: 7 },
  { lat: -34.861402, lon: -58.072457, rot: 2.237, alto: 7 },
  { lat: -37.862722, lon: -58.073874, rot: 5.982, alto: 7 },
  { lat: -37.864746, lon: -58.075545, rot: 2.237, alto: 7 },
  { lat: -34.866241, lon: -58.074888, rot: 2.237, alto: 7 },
  { lat: -34.859884, lon: -58.070084, rot: 0, alto: 7 },
  { lat: -34.86269, lon: -58.070715, rot: -2.237, alto: 7 },
];

for (let l of listaDePosiciones) {
  l.lat = -34.903076;
  l.lon = -57.968118;
}
let posGaleria = { lat: -34.903076, lon: -57.968118, rot: -2.237, alto: 7 };
let posGotas = { lat: -34.903076, lon: -57.968118, rot: 3.845 }; //claro
let posFlor = { lat: -34.903076, lon: -57.968118, rot: 2.237 }; //punto
let posColibri = { lat: -34.903076, lon: -57.968118, rot: 1.47 }; // mirador

async function setupObjects(longitude, latitude) {
  if (first) {
    texto.remove();
  }

  //--- cuadros aislados
  let listaTexturasAisladas = [];
  let listaTexturasGaleria = [];
  for (let i = 0; i < listaCuadros.length; i++) {
    if (i < 5) {
      listaTexturasGaleria.push(listaCuadros[i]);
    } else {
      listaTexturasAisladas.push(listaCuadros[i]);
    }
  }
  let modeloBase = new THREE.Object3D();

  await cargarModelo(listaModelos[0], modeloBase).then((resultado) => {
    for (let i = 0; i < listaTexturasAisladas.length; i++) {
      modelos[i] = modeloBase.clone();
      modelos[i].name = `Cuadro_${listaTexturasAisladas[i].nombre}`;
      setTextura(listaTexturasAisladas[i], modelos[i], 0, listaDePosiciones[i].rot, 0);
      modelos[i].scale.set(tamPanuelo, tamPanuelo, tamPanuelo);
    }
    for (let i = 0; i < listaTexturasGaleria.length; i++) {
      let modeloTmp = modeloBase.clone();
      modeloTmp.name = `Cuadro_${listaTexturasGaleria[i].nombre}`;
      setTextura(listaTexturasGaleria[i], modeloTmp, 0, 0, 0, 0.1);
      modeloTmp.scale.set(tamPanuelo, tamPanuelo, tamPanuelo);
      galeria.add(modeloTmp);
    }
    // let indice = 0;
    // console.log(galeria.children.filter((e) => e.name.split("_")[0] === "Cuadro")[indice].children[0].children.filter((e) => e.name.split("_")[0] === "capa1")[0].material.map);
    // console.log(galeria.children[0].children[0].material);
  });
  let colibri = new THREE.Object3D();
  cargarColibri(colibri);
  let flor = new THREE.Object3D();
  cargarFlor(flor, flores);
  let gotas = new THREE.Object3D();
  gotasCubes = await cargarGotas(gotas);

  for (let m = 0; m < listaTexturasAisladas.length; m++) {
    threex.add(modelos[m], listaDePosiciones[m].lon, listaDePosiciones[m].lat, listaDePosiciones[m].alto);
  }
  threex.add(galeria, posGaleria.lon, posGaleria.lat, posGaleria.alto); //galeria mi casa
  threex.add(gotas, posGotas.lon, posGotas.lat, 15); //galeria mi casa
  threex.add(flor, posFlor.lon, posFlor.lat, -40); //galeria mi casa
  threex.add(colibri, posColibri.lon, posColibri.lat, posColibri.alto); //galeria mi casa

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
