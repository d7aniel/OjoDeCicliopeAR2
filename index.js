import * as THREE from "https://unpkg.com/three@0.122.0/build/three.module.js";
// import { lista } from "./lista.js";
import { texto } from "./texto.js";
import { cargarModelo, setTextura } from "./CargarModelo.js";
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

let tamPanuelo = 70;
console.log(texto);

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
let listaModelos = ["./modelo/cuadroVacio1.glb"];
let listaTexturas = ["./imagenes/img1.jpg", "./imagenes/img2.JPG", "./imagenes/img3.JPG", "./imagenes/img4.jpg"];
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
    { x: 0, y: Math.PI, z: 0 },
    { x: 0, y: -Math.PI * 0.5, z: 0 },
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
  // puerta.rotation.set(puerta.rotation.x, puerta.rotation.y + 90, puerta.rotation.z);

  let objeto = new THREE.Object3D();

  for (let i = 0; i < modelos.length; i++) {
    objeto.add(modelos[i]);
  }

  let lista = [
    { lt: -34.884448, lg: -58.004633 },
    { lt: -34.885768, lg: -58.006596 },
    { lt: -34.886895, lg: -58.006344 },
    { lt: -34.887775, lg: -58.004397 },
    { lt: -34.885989, lg: -58.002729 },
    // { lt: -34.910839, lg: -57.950701 },
    // { lt: -34.902403, lg: -57.969982 },
    // { lt: -34.9031455, lg: -57.9682734 },
    // { lt: -37.89719, lg: -58.278938 },
    // { lt: -34.860122, lg: -58.078047 },
    // { lt: -34.88683, lg: -58.006339 },
    // { lt: -34.88294313919044, lg: -58.00682050422973 },
  ];
  let distMin = -1;
  let indice = -1;
  for (let i = 0; i < lista.length; i++) {
    let distancia = Math.sqrt(Math.pow(lista[i].lt - latitude, 2) + Math.pow(lista[i].lg - longitude, 2));
    if (distMin < 0 || distancia < distMin) {
      distMin = distancia;
      indice = i;
    }
  }
  let offset = [
    { x: 0, y: oneDegAsRad * 0.15, z: 0 },
    { x: 0, y: oneDegAsRad * -0.15, z: 0 },
    { x: oneDegAsRad * 0.15, y: 0, z: 0 },
    { x: oneDegAsRad * 0.15, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
  ];
  // threex.add(objeto, lista[indice].lg + oneDegAsRad, lista[indice].lt);
  // threex.add(objeto, lista[indice].lg - oneDegAsRad, lista[indice].lt);
  for (let m = 0; m < modelos.length; m++) {
    //for (let i = 0; i < offset.length; i++) {
    // threex.add(modelos[i], lista[m].lg + offset[i].x, lista[m].lt + offset[i].y, offset[i].z);
    threex.add(modelos[m], lista[m].lg, lista[m].lt, offset[m].z);
    //}
  }
  // threex.add(objeto, lista[indice].lg, lista[indice].lt - oneDegAsRad);

  // threex.add(objeto, -57.969982, -34.902403); // slightly north
  // // },
  // threex.add(objeto, -58.278938, -37.89719); // slightly north
  // threex.add(objeto, -58.078047, -34.860122); // slightly north
  // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  // const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  // const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  // const material4 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // threex.add(new THREE.Mesh(geom, material), lista[indice].lg, lista[indice].lt); // slightly south
  // threex.add(new THREE.Mesh(geom, material3), -58.004916, -34.887014); // slightly west
  // threex.add(new THREE.Mesh(geom, material4), longitude + 0.001, latitude); // slightly east
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
