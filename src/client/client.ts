import * as Bezier from './Bazier';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById("tpRender") ?? undefined 

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setClearColor('#202020');

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

function drawXYZ(scene: THREE.Scene): void {
  const arrowLength = 10;
  const xAxis = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0xff0000
  );
  const yAxis = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0x00ff00
  );
  const zAxis = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0x0000ff
  );

  scene.add(xAxis, yAxis, zAxis);
}

function drawTpCourve() {
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const points = Bezier.getLineFromPoints(
    [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(2, 0, 2),
      new THREE.Vector3(1, 1, 0)
    ],
    new THREE.Vector3(0, 1, 0.5),
    { pCount: 50, res: 1 }
  );
  const pGroup = new THREE.Group();
  points.forEach((p) => {
    const sphGeometry = new THREE.SphereGeometry(0.02);
    const sphMaterial = new THREE.MeshBasicMaterial({ color: 0x4444ee });
    const sphere = new THREE.Mesh(sphGeometry, sphMaterial);
    sphere.translateX(p.x);
    sphere.translateY(p.y);
    sphere.translateZ(p.z);
    pGroup.add(sphere);
  });
  scene.add(pGroup);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);

  scene.add(line);
}

function drawGrid() {
  const material = new THREE.LineBasicMaterial({ color: 0xaaaaff });
  const gridGroup = new THREE.Group();
  for (let x = 1; x <= 10; x++) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 0, 0),
      new THREE.Vector3(x, 0, 10)
    ]);
    const line = new THREE.Line(geometry, material);
    gridGroup.add(line);
  }

  for (let z = 1; z <= 10; z++) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, z),
      new THREE.Vector3(10, 0, z)
    ]);
    const line = new THREE.Line(geometry, material);
    gridGroup.add(line);
  }

  scene.add(gridGroup);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function redraw() {
  scene.clear();
  drawGrid();
  drawXYZ(scene);
  drawTpCourve();
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

  redraw();
  renderer.render(scene, camera);
  animate();
}

init();
