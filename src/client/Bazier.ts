import * as THREE from 'three';

import { scene } from './client';

function getBazierPoint(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  t: number,
  factor: number = 1
) {
  const x = (1 - t) * p0.x + t * p1.x;
  const y = (1 - t) * p0.y + t * p1.y;
  const z = (1 - t) * p0.z + t * p1.z;
  return new THREE.Vector3(x * factor, y * factor, z * factor);
}

export function getCourvePoints(
  pInput: [THREE.Vector3, THREE.Vector3, THREE.Vector3],
  option: { pCount?: number; res?: number } = {}
) {
  const [p0, cp, p1] = pInput;
  const reslolution = option.res ?? 1;
  const max = option.pCount ?? 100;
  const points = [];
  for (let i = 0; i <= max; i++) {
    const n = i / max;
    const b0 = getBazierPoint(p0, cp, n, reslolution);
    const b1 = getBazierPoint(cp, p1, n, reslolution);
    const tp = getBazierPoint(b0, b1, n, reslolution);
    points.push(tp);
  }
  return points;
}

export function getLineFromPoints(
  pInput: THREE.Vector3[],
  cp: THREE.Vector3,
  option: { pCount?: number; res?: number } = {}
) {
  let points: THREE.Vector3[] = [];
  let lastCp = cp;
  for (let index = 1; index < pInput.length; index++) {
    const pStart = pInput[index - 1];
    const pEnd = pInput[index];

    const sphGeometry = new THREE.SphereGeometry(0.05);
    const sphMaterial = new THREE.MeshBasicMaterial({ color: 0x44ee44 });
    const sphere = new THREE.Mesh(sphGeometry, sphMaterial);
    sphere.translateX(lastCp.x);
    sphere.translateY(lastCp.y);
    sphere.translateZ(lastCp.z);
    scene.add(sphere);

    points = [...points, ...getCourvePoints([pStart, lastCp, pEnd], option)];

    const x = pEnd.x - lastCp.x + pEnd.x;
    const y = pEnd.y - lastCp.y + pEnd.y;
    const z = pEnd.z - lastCp.z + pEnd.z;
    lastCp = new THREE.Vector3(x, y, z);
  }

  return points;
}
