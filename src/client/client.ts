// import * as Bezier from './Bazier';
import {Bazier } from './utils/Bazier'
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Origin } from './utils/Origin';

const generateButton = <HTMLButtonElement>(
  document.getElementById('generateButton')
);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor('#202020');

const origin = new Origin(10)
const bazier = new Bazier();

export const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 100;
controls.target.set(0, 0, 0);
controls.update();

function getFacingPoint(): THREE.Vector3 {
  const fX = <HTMLInputElement>document.getElementById('cx');
  const fY = <HTMLInputElement>document.getElementById('cy');
  const fZ = <HTMLInputElement>document.getElementById('cz');
  const controlPoint = new THREE.Vector3(
    Number(fX?.value),
    Number(fY?.value),
    Number(fZ?.value)
  );
  return controlPoint;
}

function getControlPoint(): THREE.Vector3 {
  const cX = <HTMLInputElement>document.getElementById('cx');
  const cY = <HTMLInputElement>document.getElementById('cy');
  const cZ = <HTMLInputElement>document.getElementById('cz');

  const controlPoint = new THREE.Vector3(
    Number(cX?.value),
    Number(cY?.value),
    Number(cZ?.value)
  );
  return controlPoint;
}

function getDataPoints(): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const textinput =
    <HTMLTextAreaElement>document.getElementById('inputCords') ?? undefined;
  textinput?.value?.split('\n').map((line) => {
    const [x, y, z] = line.split(' ').map((n) => Number(n));
    points.push(new THREE.Vector3(x, y, z));
  });

  return points;
}

function drawBezier() {
  bazier.clear(true)
  bazier.addPoints(...getDataPoints())
  bazier.setControlPoint(getControlPoint())
  
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const geometry = new THREE.BufferGeometry().setFromPoints(bazier.generate());
  const line = new THREE.Line(geometry, material);

  scene.add(bazier.inputPointsGroup)
  scene.add(bazier.controlPointsGroup)
  scene.add(bazier.outputPointsGroup)
  scene.add(line);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function redraw() {
  scene.clear();
  drawBezier();
  scene.add(origin.origin)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.onresize = onWindowResize;
  generateButton?.addEventListener('click', redraw);

  redraw();
  renderer.render(scene, camera);
  animate();
}

init();
