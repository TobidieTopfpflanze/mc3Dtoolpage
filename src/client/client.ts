import * as Bezier from './Bazier';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const generateButton = <HTMLButtonElement>(
  document.getElementById('generateButton')
);

const renderer = new THREE.WebGLRenderer();
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
  const xPAxis = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0xff0000
  );
  const yPAxis = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0x00ff00
  );
  const zPAxis = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0x0000ff
  );

  const xNAxis = new THREE.ArrowHelper(
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0xff0000
  );
  const yNAxis = new THREE.ArrowHelper(
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0x00ff00
  );
  const zNAxis = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(0, 0, 0),
    arrowLength,
    0x0000ff
  );

  scene.add(xPAxis, yPAxis, zPAxis, xNAxis, yNAxis, zNAxis);
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
  const pGroup = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const points = Bezier.getLineFromPoints(getDataPoints(), getControlPoint(), {
    pCount: 1000,
    res: 1
  });

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
  for (let x = -10; x <= 10; x++) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 0, -10),
      new THREE.Vector3(x, 0, 10)
    ]);
    const line = new THREE.Line(geometry, material);
    gridGroup.add(line);
  }

  for (let z = -10; z <= 10; z++) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10, 0, z),
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
  drawBezier();
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
