import * as THREE from "three";

export type GeometryStats = {
  volumeCm3: number;
  dimensionsCm: { x: number; y: number; z: number };
  triangleCount: number;
};

const p1 = new THREE.Vector3();
const p2 = new THREE.Vector3();
const p3 = new THREE.Vector3();

/**
 * Accumulates signed tetrahedron volume (divergence theorem) for one mesh's
 * triangles, transformed into world space so multi-mesh objects (OBJ groups)
 * sum correctly regardless of per-child transforms.
 */
function accumulateVolumeMm3(
  geometry: THREE.BufferGeometry,
  matrixWorld: THREE.Matrix4
): { volume: number; triangles: number } {
  const position = geometry.getAttribute("position");
  if (!position) return { volume: 0, triangles: 0 };
  const index = geometry.getIndex();
  const triCount = index ? index.count / 3 : position.count / 3;

  let volume = 0;
  for (let i = 0; i < triCount; i++) {
    const a = index ? index.getX(i * 3) : i * 3;
    const b = index ? index.getX(i * 3 + 1) : i * 3 + 1;
    const c = index ? index.getX(i * 3 + 2) : i * 3 + 2;

    p1.fromBufferAttribute(position, a).applyMatrix4(matrixWorld);
    p2.fromBufferAttribute(position, b).applyMatrix4(matrixWorld);
    p3.fromBufferAttribute(position, c).applyMatrix4(matrixWorld);

    volume += p1.dot(p2.clone().cross(p3)) / 6;
  }
  return { volume, triangles: triCount };
}

function toDimensionsCm(box: THREE.Box3): GeometryStats["dimensionsCm"] {
  const size = new THREE.Vector3();
  box.getSize(size);
  return {
    x: Math.round((size.x / 10) * 10) / 10,
    y: Math.round((size.y / 10) * 10) / 10,
    z: Math.round((size.z / 10) * 10) / 10,
  };
}

/** Assumes the source file's units are millimeters (the STL/OBJ export convention). */
export function analyzeGeometry(geometry: THREE.BufferGeometry): GeometryStats {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox ?? new THREE.Box3();
  const { volume, triangles } = accumulateVolumeMm3(geometry, new THREE.Matrix4());

  return {
    volumeCm3: Math.max(Math.abs(volume) / 1000, 0.1),
    dimensionsCm: toDimensionsCm(box),
    triangleCount: triangles,
  };
}

/** For OBJ groups that may contain multiple child meshes with their own transforms. */
export function analyzeObject3D(object: THREE.Object3D): GeometryStats {
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);

  let volumeMm3 = 0;
  let triangleCount = 0;
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const result = accumulateVolumeMm3(child.geometry, child.matrixWorld);
    volumeMm3 += result.volume;
    triangleCount += result.triangles;
  });

  return {
    volumeCm3: Math.max(Math.abs(volumeMm3) / 1000, 0.1),
    dimensionsCm: toDimensionsCm(box),
    triangleCount,
  };
}
