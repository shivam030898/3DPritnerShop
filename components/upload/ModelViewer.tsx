"use client";

import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";
import { RotateCcw, Box } from "lucide-react";
import type { SupportedFileType } from "@/lib/fileType";
import { cn } from "@/lib/utils";

type ModelViewerProps = {
  fileURL: string;
  fileType: SupportedFileType;
  color: string;
  maxDimensionMm: number;
  className?: string;
};

function tintObject(object: THREE.Object3D, color: string) {
  const clone = object.clone();
  clone.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.55,
        metalness: 0.05,
      });
    }
  });
  return clone;
}

function StlMesh({ url, color }: { url: string; color: string }) {
  const geometry = useLoader(STLLoader, url);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
    </mesh>
  );
}

function ObjMesh({ url, color }: { url: string; color: string }) {
  const object = useLoader(OBJLoader, url);
  const tinted = useMemo(() => tintObject(object, color), [object, color]);
  return <primitive object={tinted} />;
}

function ThreeMfMesh({ url, color }: { url: string; color: string }) {
  const object = useLoader(ThreeMFLoader, url);
  const tinted = useMemo(() => tintObject(object, color), [object, color]);
  return <primitive object={tinted} />;
}

class ViewerErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-text-faint">
          <Box size={28} strokeWidth={1.5} />
          <p className="text-xs">Preview unavailable for this file</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoadingFallback() {
  return null;
}

export default function ModelViewer({
  fileURL,
  fileType,
  color,
  maxDimensionMm,
  className,
}: ModelViewerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const distance = Math.max(maxDimensionMm * 2.3, 60);
  const cameraPosition: [number, number, number] = [
    distance * 0.7,
    distance * 0.55,
    distance * 0.8,
  ];

  return (
    <div className={cn("relative", className)}>
      <Canvas
        camera={{ position: cameraPosition, fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[distance, distance, distance]} intensity={1.1} />
        <directionalLight position={[-distance, -distance * 0.5, -distance]} intensity={0.35} />
        <ViewerErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Center>
              {fileType === "stl" && <StlMesh url={fileURL} color={color} />}
              {fileType === "obj" && <ObjMesh url={fileURL} color={color} />}
              {fileType === "3mf" && <ThreeMfMesh url={fileURL} color={color} />}
            </Center>
          </Suspense>
        </ViewerErrorBoundary>
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          minDistance={distance * 0.4}
          maxDistance={distance * 2.5}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs text-text-dim shadow-sm">
        Drag to rotate · Scroll to zoom
      </div>
      <button
        type="button"
        onClick={() => controlsRef.current?.reset()}
        aria-label="Reset view"
        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/90 text-text-dim shadow-sm transition-colors hover:text-text"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
