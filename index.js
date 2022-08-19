import * as THREE from "https://unpkg.com/three@0.122.0/build/three.module.js";
// import { lista } from "./lista.js";
import { texto } from "./texto.js";
import { cargarModelo, setTextura } from "./CargarModelo.js";
import { cargarColibri } from "./Colibri.js";
import { cargarFlor } from "./Flor.js";
import { cargarGotas, actualizarGotas } from "./Gotas.js";
// import { Particula } from "./Particula.js";
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
let gotasCubes;
let tamPanuelo = 12;
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
      camera.rotation.y -= oneDegAsRad;
      if (camera.rotation.y < 0) {
        camera.rotation.y += 2 * Math.PI;
      }
    } else if (e.clientX > lastX) {
      camera.rotation.y += oneDegAsRad;
      if (camera.rotation.y > 2 * Math.PI) {
        camera.rotation.y -= 2 * Math.PI;
      }
    }
    lastX = e.clientX;
  });
}

function render(time) {
  // if (panuelo.children.length > 0) {
  //   for (let i = 0; i < particulas.length; i++) {
  //     if (particulas[i].sinModelo) {
  //       particulas[i].modelo.add(panuelo.clone());
  //       let escala = particulas[i].random(0.7, 1.2);
  //       particulas[i].modelo.scale.set(escala, escala, escala);
  //       particulas[i].sinModelo = false;
  //     }
  //   }
  // }
  // console.log(flores.objetos);
  if (flores.objetos != undefined) {
    for (let f = 0; f < flores.objetos.length; f++) {
      flores.objetos[f].rotarPetalos();
    }
  }
  if (gotasCubes != null && gotasCubes != undefined) {
    const delta = clock.getDelta();
    tiempo += delta * 0.5;
    actualizarGotas(gotasCubes, tiempo, 10, false, false, false);
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
let listaTexturas = ["./imagenes/img1.jpg", "./imagenes/img2.JPG", "./imagenes/img3.JPG", "./imagenes/img4.jpg", "./imagenes/img5.jpg"];
async function setupObjects(longitude, latitude) {
  // Use position of first GPS update (fake or real)
  if (first) {
    // let t = "";
    // t += "Longitud: " + longitude + "\n";
    // t += "Laditude: " + latitude + "\n";
    // texto.setSubtitulo(t);
    // texto.remove();
  }
  let rot = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: -Math.PI, z: 0 },
    { x: 0, y: Math.PI * 0.2, z: Math.PI * 0.4 },
    { x: 0, y: Math.PI * 0.5, z: 0 },
  ];

  let modeloBase = new THREE.Object3D();
  await cargarModelo(listaModelos[0], modeloBase).then((resultado) => {
    console.log(resultado);
    for (let i = 0; i < listaTexturas.length; i++) {
      modelos[i] = modeloBase.clone();
      setTextura(listaTexturas[i], modelos[i], rot[i].x, rot[i].y, rot[i].z);
      modelos[i].scale.set(tamPanuelo, tamPanuelo, tamPanuelo);
    }
  });
  let colibri = new THREE.Object3D();
  cargarColibri(colibri);
  let flor = new THREE.Object3D();
  cargarFlor(flor, flores);
  let gotas = new THREE.Object3D();
  gotasCubes = cargarGotas(gotas);
  // puerta.rotation.set(puerta.rotation.x, puerta.rotation.y + 90, puerta.rotation.z);

  let objeto = new THREE.Object3D();

  for (let i = 0; i < modelos.length; i++) {
    objeto.add(modelos[i]);
  }

  let lista = [
    { lt: -37.892693, lg: -58.273934 },
    { lt: -37.894304, lg: -58.275456 },
    { lt: -37.894473, lg: -58.273593 },
    { lt: -37.894269, lg: -58.271683 },
    { lt: -37.896414, lg: -58.275124 },
  ];
  let offset = [
    { x: 0, y: oneDegAsRad * 0.15, z: 25 },
    { x: 0, y: oneDegAsRad * -0.15, z: 25 },
    { x: oneDegAsRad * 0.15, y: 0, z: 40 },
    { x: oneDegAsRad * 0.15, y: 0, z: 50 },
    { x: 0, y: 0, z: 100 },
  ];
  for (let m = 0; m < modelos.length; m++) {
    threex.add(modelos[m], lista[m].lg, lista[m].lt, offset[m].z);
  }
  // threex.add(colibri, -57.968722, -34.903066, 0); //mi casa
  // threex.add(colibri, -58.078173, -34.860005, 0); //casa marcela
  // threex.add(flor, -58.006153, -34.886712, -20); //flor ciop
  // threex.add(flor, -58.077909, -34.860097 - 20); //flor casa marcela
  // threex.add(flor, -59.089383, -35.172388, -20); //flor casa lobos
  // threex.add(flor, -57.968123, -34.903145, -20); //flor mi casa
  threex.add(gotas, -58.0068, -34.886712, 0); //gotas ciop

  // threex.add(colibri, -58.006153, -34.886712, 0); //ciop
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
  let light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0.5, 0.5, 1);
  scene.add(light);

  let pointLight = new THREE.PointLight(0xff3300);
  pointLight.position.set(0, 0, 100);
  scene.add(pointLight);

  let ambientLight = new THREE.AmbientLight(0x080808);
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
