import * as THREE from 'three';

export class Bazier {
  private inputPoints: THREE.Vector3[] = [];
  public inputPointsGroup: THREE.Group = new THREE.Group();

  public outputPoints: THREE.Vector3[] = [];
  public outputPointsGroup: THREE.Group = new THREE.Group();

  private controlPointBase: THREE.Vector3 = new THREE.Vector3();
  private controlPoints: THREE.Vector3[] = [];
  public controlPointsGroup: THREE.Group = new THREE.Group();

  public scale: number = 1;
  public sectionPCount: number = 150;

  private update: boolean = false;

  public static getInputPointMesh(): THREE.Mesh {
    return new THREE.Mesh(
      new THREE.SphereGeometry(0.07),
      new THREE.MeshBasicMaterial({ color: 0x99ee99 })
    );
  }

  public static getOutputPointMesh(): THREE.Mesh {
    return new THREE.Mesh(
      new THREE.SphereGeometry(0.05),
      new THREE.MeshBasicMaterial({ color: 0x9999ee })
    );
  }

  public static getControlPointBaseMesh(): THREE.Mesh {
    return new THREE.Mesh(
      new THREE.SphereGeometry(0.07),
      new THREE.MeshBasicMaterial({ color: 0xee6666 })
    );
  }
  public static getControlPointMesh(): THREE.Mesh {
    return new THREE.Mesh(
      new THREE.SphereGeometry(0.07),
      new THREE.MeshBasicMaterial({ color: 0xee9999 })
    );
  }

  public setControlPoint(vec: THREE.Vector3): void {
    this.controlPointBase.setX(vec.x);
    this.controlPointBase.setY(vec.y);
    this.controlPointBase.setZ(vec.z);
  }

  public addPoints(...points: THREE.Vector3[]): void {
    this.update = true;
    this.inputPoints = [...this.inputPoints, ...points];
  }

  public clear(full: boolean = true): void {
    this.update = !full;

    if (full) this.inputPoints = [];

    this.outputPoints = [];
    this.controlPoints = [];
    this.inputPointsGroup = new THREE.Group();
    this.controlPointsGroup = new THREE.Group();
    this.outputPointsGroup = new THREE.Group();
  }

  private static getBazierPoint(
    p0: THREE.Vector3,
    p1: THREE.Vector3,
    t: number,
    scale: number = 1
  ): THREE.Vector3 {
    const x = (1 - t) * p0.x + t * p1.x;
    const y = (1 - t) * p0.y + t * p1.y;
    const z = (1 - t) * p0.z + t * p1.z;
    return new THREE.Vector3(x * scale, y * scale, z * scale);
  }

  private getCourvePoints(
    pStart: THREE.Vector3,
    pEnd: THREE.Vector3,
    pCP: THREE.Vector3
  ): THREE.Vector3[] {
    const points = [];
    for (let i = 0; i <= this.sectionPCount; i++) {
      const n = i / this.sectionPCount;
      const b0 = Bazier.getBazierPoint(pStart, pCP, n, this.scale);
      const b1 = Bazier.getBazierPoint(pCP, pEnd, n, this.scale);
      const tp = Bazier.getBazierPoint(b0, b1, n, this.scale);
      points.push(tp);
    }
    return points;
  }

  public generate(): THREE.Vector3[] {
    if (this.update && this.inputPoints.length >= 2) {
      this.clear(false);
      let lastCp = this.controlPointBase;

      for (let index = 1; index < this.inputPoints.length; index++) {
        // get bezier start- & endpoint
        const pStart = this.inputPoints[index - 1];
        const pEnd = this.inputPoints[index];

        // add point to input point group
        const iPmesh = Bazier.getInputPointMesh();
        iPmesh.translateX(pEnd.x);
        iPmesh.translateY(pEnd.y);
        iPmesh.translateZ(pEnd.z);
        this.inputPointsGroup.add(iPmesh);

        // generate control point spheres to group
        const cPmesh = Bazier.getControlPointMesh();
        cPmesh.translateX(lastCp.x);
        cPmesh.translateY(lastCp.y);
        cPmesh.translateZ(lastCp.z);
        this.controlPointsGroup.add(cPmesh);
        this.controlPoints.push(lastCp);

        // add new courve to line
        const newPoints = this.getCourvePoints(pStart, pEnd, lastCp);

        this.outputPoints = [...this.outputPoints, ...newPoints];

        // add courve point spheres to group
        const meshGroup = newPoints.map((point) => {
          const oPmesh = Bazier.getOutputPointMesh();
          oPmesh.translateX(point.x);
          oPmesh.translateY(point.y);
          oPmesh.translateZ(point.z);
          return oPmesh;
        });
        this.outputPointsGroup.add(...meshGroup);

        // get next control point
        const x = pEnd.x - lastCp.x + pEnd.x;
        const y = pEnd.y - lastCp.y + pEnd.y;
        const z = pEnd.z - lastCp.z + pEnd.z;
        lastCp = new THREE.Vector3(x, y, z);
      }

      // add last input point to input point group
      const iPmesh = Bazier.getInputPointMesh();
      const p = this.inputPoints[this.inputPoints.length - 1];
      iPmesh.translateX(p.x);
      iPmesh.translateY(p.y);
      iPmesh.translateZ(p.z);
      this.inputPointsGroup.add(iPmesh);
    }
    return this.outputPoints;
  }
}
