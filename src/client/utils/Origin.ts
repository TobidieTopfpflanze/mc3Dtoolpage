import * as THREE from 'three';

export class Origin {
  private min: number;
  private max: number;
  public readonly origin: THREE.Group = new THREE.Group();
  private gridMaterial: THREE.Material;

  constructor(size: number, girdColor: THREE.ColorRepresentation = 0x555566) {
    this.max = size;
    this.min = size * -1;
    this.gridMaterial = new THREE.LineBasicMaterial({ color: girdColor });
    this.generate()
  }

  public generate(): void {
    this.buildArrows();
    this.buildGrid();
  }

  private buildGrid(): void {
    for (let x = this.min; x <= this.max; x++) {
      if (x === 0) continue;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, -10),
        new THREE.Vector3(x, 0, 10)
      ]);
      const line = new THREE.Line(geometry, this.gridMaterial);
      this.origin.add(line);
    }

    for (let z = -10; z <= 10; z++) {
      if (z === 0) continue;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-10, 0, z),
        new THREE.Vector3(10, 0, z)
      ]);
      const line = new THREE.Line(geometry, this.gridMaterial);
      this.origin.add(line);
    }
  }

  private buildArrows(): void {
    const xPAxis = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      this.max,
      0xff0000
    );

    const yPAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      this.max,
      0x00ff00
    );

    const zPAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      this.max,
      0x0000ff
    );

    const xNAxis = new THREE.ArrowHelper(
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      this.max,
      0xff0000
    );

    const yNAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 0),
      this.max,
      0x00ff00
    );

    const zNAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 0, 0),
      this.max,
      0x0000ff
    );

    this.origin.add(xPAxis, yPAxis, zPAxis, xNAxis, yNAxis, zNAxis);
  }
}
