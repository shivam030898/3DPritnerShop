"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createMarbleBaseTexture, createProductCapTexture } from "@/lib/marbleTexture";

/** The product photo lives on a small spherical CAP (own geometry, own
 *  material), not painted into the main sphere's texture — see
 *  lib/marbleTexture.ts for why: three.js's default sphere UV is
 *  equirectangular and stretches a decal 2:1 unless the patch carrying it
 *  has an equal phi/theta span. CAP_SPAN is that span, in radians.
 *  Centered on the same phi=π, theta=π/2 point FRONT_FACING_Y below rotates
 *  to face the camera. */
const CAP_SPAN = 1.3;
/** Radius the cap sits at, as a fraction of the outer glass shell's radius
 *  (1.0) — pulled well inward so the product reads as suspended INSIDE the
 *  transparent sphere rather than painted on its surface. */
const CAP_RADIUS = 0.72;

export type OrbitSphereEntry = {
  slug: string;
  imageUrl: string;
};

/** True once we know the visitor's OS-level reduced-motion preference —
 *  starts false (matches SSR) and updates after mount. Gates the sphere's
 *  own rotation only; the orbit's revolution is already handled by CSS,
 *  which the global reduced-motion rule in globals.css collapses on its
 *  own — this hook just keeps the 3D layer in sync with that. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** A sphere's own rotation is a bounded, independent-speed wobble rather
 *  than a full spin: continuous 3D motion, but the product must never turn
 *  away for long, and the brief now asks for this to read as "very subtle"
 *  rather than a visible rock. A small sine-driven wobble satisfies both. */
const WOBBLE_Y = 0.32; // radians, ~18°
const WOBBLE_X = 0.09;
/** The cap's texture sits at UV center (u=0.5, v=0.5). Per three.js's
 *  SphereGeometry vertex formula (x = -ringRadius·cos(phi),
 *  z = ringRadius·sin(phi), with phi = u·2π), that point sits at world
 *  +X when unrotated — not facing the camera at all. Rotating -90° about Y
 *  carries it to +Z, facing the camera (which sits at z > 0 looking at the
 *  origin). Verified against the installed three.js source, not guessed. */
const FRONT_FACING_Y = -Math.PI / 2;

function sphereTiming(index: number) {
  return {
    periodY: 9 + ((index * 2.3) % 6), // 9–15s
    periodX: 13 + ((index * 3.1) % 7), // 13–20s, slower/out of phase with Y
    phase: index * 1.7,
  };
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

/** Entrance: every sphere starts at the hero's exact center (world origin)
 *  and expands outward to its own orbit seat — a "burst" rather than an
 *  arrival from off-screen. Each sphere eases from (0,0) to its LIVE seat
 *  (not a frozen snapshot), which is what keeps the handoff into the
 *  continuous orbit seamless: at progress 1 the eased position equals the
 *  live orbit position exactly, and approaching 1 it approaches that same
 *  point continuously — no jump. A small per-index stagger keeps six
 *  spheres moving at once from reading as one mechanical pop. */
const ENTRANCE_STAGGER = 0.08; // seconds of extra start delay per index
const ENTRANCE_DURATION = 1.1; // seconds for one sphere's own center→seat ease

function CameraSync() {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera;
  const size = useThree((s) => s.size);
  useEffect(() => {
    /* eslint-disable react-hooks/immutability -- `camera` is a live three.js
       scene-graph object, not React-managed state; imperative mutation in an
       effect/useFrame is R3F's standard pattern, not a compiler violation. */
    camera.left = -size.width / 2;
    camera.right = size.width / 2;
    camera.top = size.height / 2;
    camera.bottom = -size.height / 2;
    camera.near = 0.1;
    camera.far = 2000;
    camera.position.set(0, 0, 600);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    /* eslint-enable react-hooks/immutability */
  }, [camera, size]);
  return null;
}

/** A soft, generated "room" reflection environment — no HDR file to fetch,
 *  just three.js's own PMREMGenerator baking a simple lit room into a
 *  cubemap once. Without this, transparent/clearcoat materials only catch
 *  direct light sources as pinpricks; with it, they catch soft ambient
 *  reflections the way real glass does, which is most of what sells the
 *  "premium glass" read. Shared via scene.environment — every sphere's
 *  material reflects the same one map, one generation cost total. */
function useGlassEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    /* eslint-disable react-hooks/immutability -- `scene` is a live three.js
       scene-graph object, not React-managed state; assigning its
       environment map imperatively is the standard three.js/R3F pattern. */
    const pmrem = new THREE.PMREMGenerator(gl);
    const envRenderTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRenderTarget.texture;
    return () => {
      scene.environment = null;
      envRenderTarget.dispose();
      pmrem.dispose();
    };
    /* eslint-enable react-hooks/immutability */
  }, [gl, scene]);
}

/** Shared, unlit, always-behind shadow disc — one geometry/material/texture
 *  reused by every sphere (only the per-instance transform differs), so a
 *  handful of soft "contact" shadows costs one extra draw call worth of
 *  setup rather than five or six. */
function useShadowTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(10,10,8,0.5)");
    grad.addColorStop(0.6, "rgba(10,10,8,0.2)");
    grad.addColorStop(1, "rgba(10,10,8,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function Sphere({
  entry,
  index,
  getEl,
  hovered,
  geometry,
  capGeometry,
  marbleTexture,
  shadowGeometry,
  shadowMaterial,
  reducedMotion,
}: {
  entry: OrbitSphereEntry;
  index: number;
  getEl: (slug: string) => HTMLElement | null;
  hovered: boolean;
  geometry: THREE.SphereGeometry;
  capGeometry: THREE.SphereGeometry;
  marbleTexture: THREE.Texture;
  shadowGeometry: THREE.PlaneGeometry;
  shadowMaterial: THREE.Material;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const capMeshRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const wobbleTime = useRef(0);
  const scaleInitialized = useRef(false);
  // R3F's clock isn't guaranteed to read ~0 on this component's first frame
  // (it's shared canvas-wide, not per-mesh) — recorded on the first frame
  // this sphere actually runs, so entrance progress is always measured from
  // a true local zero regardless of what the shared clock already reads.
  const mountElapsed = useRef<number | null>(null);
  // Set once a live decoded texture actually lands on capMaterial — the cap
  // mesh stays invisible until then, so a slow/failed image load reads as
  // "not there yet" (or "no product art") rather than the flat white patch
  // a default, unmapped MeshPhysicalMaterial renders as.
  const capReady = useRef(false);
  const { periodY, periodX, phase } = useMemo(() => sphereTiming(index), [index]);
  const entranceDelay = index * ENTRANCE_STAGGER;

  // Translucent glass/marble shell — milky-white tint, glossy clearcoat,
  // alpha-blended (not physical `transmission`) so six of these stay cheap:
  // real transmission needs an extra full scene capture per object per
  // frame, alpha blending doesn't. The base is tinted a shade darker than
  // paper-white on purpose — a near-white specular highlight has almost no
  // contrast against a near-white base, so paper-white here would render
  // as flat with no visible gloss even under strong lighting.
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: marbleTexture,
        color: new THREE.Color("#cfd0c6"),
        transparent: true,
        opacity: 0.52,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        ior: 1.45,
        metalness: 0,
        depthWrite: false,
        envMapIntensity: 1.4,
        // Hover glow: a warm emissive lift, not just "more reflective" —
        // starts at 0 (no glow at rest) and eases up on hover below.
        emissive: new THREE.Color("#fff1d6"),
        emissiveIntensity: 0,
      }),
    [marbleTexture]
  );

  // The product photo, pulled inward onto its own small cap (see
  // CAP_RADIUS/CAP_SPAN) so it reads as suspended inside the glass rather
  // than printed on its surface. Renders before the shell (renderOrder)
  // so the shell's blending lands on top of it, not the other way round.
  const capMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transparent: true,
        depthWrite: false,
        roughness: 0.3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        metalness: 0,
        emissive: new THREE.Color("#fff1d6"),
        emissiveIntensity: 0,
      }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    capReady.current = false;
    createProductCapTexture(entry.imageUrl)
      .then((texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }
        capMaterial.map = texture;
        capMaterial.needsUpdate = true;
        capReady.current = true;
      })
      .catch((err) => {
        // Left hidden (capReady never flips) rather than shown blank —
        // still logged so a genuinely broken source is discoverable.
        console.error(err);
      });
    return () => {
      cancelled = true;
      capMaterial.map?.dispose();
      capMaterial.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.imageUrl]);

  useEffect(() => () => material.dispose(), [material]);

  /* eslint-disable react-hooks/immutability -- useFrame is R3F's per-frame
     imperative-update hook; mesh/material/shadow are live three.js
     scene-graph objects meant to be mutated here directly (not React state),
     which is the documented, standard R3F pattern. */
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const shadow = shadowRef.current;
    if (!mesh || !shadow) return;

    const el = getEl(entry.slug);
    const visible = !!el && getComputedStyle(el).display !== "none";
    mesh.visible = visible;
    shadow.visible = visible;
    if (!visible || !el) return;

    const canvasEl = state.gl.domElement;
    const canvasRect = canvasEl.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const localX = rect.left + rect.width / 2 - canvasRect.left - canvasRect.width / 2;
    const localY = rect.top + rect.height / 2 - canvasRect.top - canvasRect.height / 2;
    const radius = rect.width / 2;
    // World space is Y-up; screen space is Y-down.
    const targetX = localX;
    const targetY = -localY;

    // Entrance (see the block comment above ENTRANCE_STAGGER). Measured
    // from this sphere's own first-frame timestamp — like scaleInitialized,
    // set once and never reset, so it naturally plays only once per mount
    // with no extra state to manage.
    if (mountElapsed.current === null) mountElapsed.current = state.clock.elapsedTime;
    const localElapsed = state.clock.elapsedTime - mountElapsed.current;

    if (reducedMotion) {
      mesh.position.x = targetX;
      mesh.position.y = targetY;
    } else {
      const raw = Math.min(1, Math.max(0, (localElapsed - entranceDelay) / ENTRANCE_DURATION));
      const eased = easeOutCubic(raw);
      // Using the LIVE target (not a frozen snapshot) as the blend's
      // endpoint is what guarantees zero jump at handoff into the
      // continuous orbit: at progress 1 the blend equals the live orbit
      // position exactly, and approaching 1 it approaches that same point
      // continuously.
      mesh.position.x = THREE.MathUtils.lerp(0, targetX, eased);
      mesh.position.y = THREE.MathUtils.lerp(0, targetY, eased);
    }

    // 1.10–1.18 per the brief; mid-range default.
    const targetScale = radius * (hovered ? 1.14 : 1);
    if (!scaleInitialized.current) {
      // Snap on the very first live frame instead of lerping from three.js's
      // default scale of 1 — otherwise every sphere briefly pops in as a
      // pinprick before growing, fighting the DOM entrance it's tracking.
      mesh.scale.setScalar(targetScale);
      scaleInitialized.current = true;
    } else {
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, Math.min(1, delta * 9)));
    }

    // Hovering slows the wobble to near-stillness rather than a hard pause,
    // so it settles instead of snapping — easier to inspect, per the brief.
    wobbleTime.current += delta * (reducedMotion ? 0 : hovered ? 0.12 : 1);
    const t = wobbleTime.current;
    mesh.rotation.y = FRONT_FACING_Y + Math.sin(t * ((Math.PI * 2) / periodY) + phase) * WOBBLE_Y;
    mesh.rotation.x = Math.sin(t * ((Math.PI * 2) / periodX) + phase * 1.3) * WOBBLE_X;

    // Hover reads as "more alive": glossier, enough extra opacity to let
    // the product show through more clearly without going opaque, and a
    // warm emissive glow lifting off the surface (not just brighter
    // reflections — an actual soft light-from-within on top of them).
    const targetRough = hovered ? 0.16 : 0.3;
    const targetOpacity = hovered ? 0.62 : 0.52;
    const targetGlow = hovered ? 0.55 : 0;
    const lerpT = Math.min(1, delta * 8);
    material.roughness = THREE.MathUtils.lerp(material.roughness, targetRough, lerpT);
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, lerpT);
    material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetGlow, lerpT);
    capMaterial.roughness = material.roughness;
    capMaterial.emissiveIntensity = THREE.MathUtils.lerp(capMaterial.emissiveIntensity, targetGlow * 0.5, lerpT);

    // Follows the sphere's actual rendered position (including mid-entrance,
    // not just its final target), so the shadow travels with it instead of
    // sitting at the destination while the sphere is still arriving.
    shadow.position.set(mesh.position.x + radius * 0.12, mesh.position.y - radius * 0.4, -radius * 0.7);
    shadow.scale.setScalar(radius * (hovered ? 2.8 : 2.5));

    if (capMeshRef.current) capMeshRef.current.visible = capReady.current;
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <mesh ref={meshRef} geometry={geometry} material={material} renderOrder={2}>
        {/* Product cap — a child of the main sphere, so it automatically
            inherits the same per-frame position/rotation/scale above
            instead of needing its own tracking. Scaled down to CAP_RADIUS
            so it sits inside the glass shell rather than on its surface. */}
        <mesh ref={capMeshRef} geometry={capGeometry} material={capMaterial} scale={CAP_RADIUS} renderOrder={1} visible={false} />
      </mesh>
      <mesh ref={shadowRef} geometry={shadowGeometry} material={shadowMaterial} renderOrder={0} />
    </>
  );
}

function Scene({
  items,
  getEl,
  hoveredSlug,
  reducedMotion,
}: {
  items: OrbitSphereEntry[];
  getEl: (slug: string) => HTMLElement | null;
  hoveredSlug: string | null;
  reducedMotion: boolean;
}) {
  useGlassEnvironment();

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 48, 48), []);
  // Local-space cap geometry: full radius 1 (scaled down per-instance via
  // the child mesh's own `scale={CAP_RADIUS}` above), centered on the same
  // phi=π, theta=π/2 point FRONT_FACING_Y rotates to face the camera.
  const capGeometry = useMemo(
    () =>
      new THREE.SphereGeometry(
        1,
        24,
        24,
        Math.PI - CAP_SPAN / 2,
        CAP_SPAN,
        Math.PI / 2 - CAP_SPAN / 2,
        CAP_SPAN
      ),
    []
  );
  const marbleTexture = useMemo(() => createMarbleBaseTexture(), []);
  const shadowGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const shadowTexture = useShadowTexture();
  const shadowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    [shadowTexture]
  );

  useEffect(
    () => () => {
      geometry.dispose();
      capGeometry.dispose();
      marbleTexture.dispose();
      shadowGeometry.dispose();
      shadowMaterial.dispose();
      shadowTexture.dispose();
    },
    [geometry, capGeometry, marbleTexture, shadowGeometry, shadowMaterial, shadowTexture]
  );

  return (
    <>
      <CameraSync />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-120, 160, 220]} intensity={1.8} />
      {/* Rim/back light — the edge highlight that makes a transparent
          sphere read as genuinely spherical rather than a flat disc. */}
      <directionalLight position={[90, -40, -160]} intensity={1} />
      {items.map((entry, i) => (
        <Sphere
          key={entry.slug}
          entry={entry}
          index={i}
          getEl={getEl}
          hovered={hoveredSlug === entry.slug}
          geometry={geometry}
          capGeometry={capGeometry}
          marbleTexture={marbleTexture}
          shadowGeometry={shadowGeometry}
          shadowMaterial={shadowMaterial}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
}

export default function OrbitSpheres({
  items,
  getEl,
  hoveredSlug,
}: {
  items: OrbitSphereEntry[];
  getEl: (slug: string) => HTMLElement | null;
  hoveredSlug: string | null;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      orthographic
      dpr={[1, 2]}
      // R3F defaults to ACES filmic tone mapping, which is tuned for
      // photorealistic HDR scenes; on these small decorative spheres it
      // just compresses the glass highlight further into the already-tight
      // headroom above the milky base color. Not needed for a UI accent.
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
      className="!absolute !inset-0 !z-20"
      style={{ pointerEvents: "none" }}
      frameloop="always"
    >
      <Scene items={items} getEl={getEl} hoveredSlug={hoveredSlug} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
