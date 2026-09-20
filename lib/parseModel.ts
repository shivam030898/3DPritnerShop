import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";
import { analyzeGeometry, analyzeObject3D, type GeometryStats } from "./geometry";
import type { SupportedFileType } from "./fileType";

export async function parseModelFile(
  file: File,
  fileType: SupportedFileType
): Promise<GeometryStats> {
  const buffer = await file.arrayBuffer();

  if (fileType === "stl") {
    const geometry = new STLLoader().parse(buffer);
    return analyzeGeometry(geometry);
  }
  if (fileType === "obj") {
    const text = new TextDecoder().decode(buffer);
    const object = new OBJLoader().parse(text);
    return analyzeObject3D(object);
  }
  const object = new ThreeMFLoader().parse(buffer);
  return analyzeObject3D(object);
}
