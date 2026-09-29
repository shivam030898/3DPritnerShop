import * as THREE from "three";

const SIZE = 512;

/**
 * The product photos in public/media/products are full studio shots (up to
 * 2000×2500px) — decoding one at full size just to composite it into a
 * 512px canvas wastes real time (the sphere's cap sat blank/white for that
 * window before texture.needsUpdate landed, which is what made it look
 * broken). Routing through Next's built-in image optimizer at a size it
 * already serves (384px is in the default imageSizes list — verified: a
 * request for 400 gets rejected with 400, 384 returns 200) cuts that decode
 * cost drastically. Same-origin, so no CORS/canvas-tainting concern.
 */
function decodeSourceUrl(imageUrl: string) {
  return `/_next/image?url=${encodeURIComponent(imageUrl)}&w=384&q=75`;
}

/**
 * The plain ivory marble base texture (no product baked in) — shared by
 * every sphere's main geometry. See createProductCapTexture for where the
 * product photo actually goes.
 */
export function createMarbleBaseTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (ctx) paintMarbleBase(ctx, SIZE);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * A simple cover-fit, feather-edged crop of the product photo — no marble
 * compositing here. This is meant for a small spherical CAP geometry (see
 * OrbitSpheres' capGeometry), not the main sphere: three.js's default
 * sphere UV is equirectangular, where one UV unit of longitude covers 2x
 * the physical distance of one UV unit of latitude at the equator (u
 * sweeps the full 2π circumference, v only sweeps π pole-to-pole). Wrapping
 * a plain square photo across that full UV range stretches it visibly. A
 * cap geometry with an equal phi/theta span sidesteps the problem instead
 * of fighting it — its own u and v cover the same angular range, so this
 * ordinary square crop reads undistorted once mapped onto it. The feathered
 * alpha edge lets the main sphere's marble show through at the rim, so the
 * cap blends into the surface instead of reading as a sticker.
 */
export function createProductCapTexture(imageUrl: string): Promise<THREE.CanvasTexture> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("2D canvas context unavailable"));
      return;
    }

    const img = new Image();
    img.onload = () => {
      paintProductCap(ctx, SIZE, img);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
      resolve(texture);
    };
    // Reject rather than resolving a blank texture: the caller keeps the
    // cap hidden on failure instead of rendering an empty/white patch that
    // looks just as broken as the bug this is meant to fix.
    img.onerror = () => reject(new Error(`Failed to load product image: ${imageUrl}`));
    img.src = decodeSourceUrl(imageUrl);
  });
}

function paintMarbleBase(ctx: CanvasRenderingContext2D, size: number) {
  const base = ctx.createRadialGradient(
    size * 0.4,
    size * 0.35,
    size * 0.04,
    size * 0.5,
    size * 0.5,
    size * 0.74
  );
  base.addColorStop(0, "#fbf8f1");
  base.addColorStop(0.55, "#f2ece0");
  base.addColorStop(1, "#dfd7c7");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Faint, blurred vein strokes — kept low-opacity so the marble reads as
  // subtle rather than heavily veined.
  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.strokeStyle = "#9c9686";
  ctx.lineWidth = size * 0.004;
  ctx.filter = `blur(${size * 0.004}px)`;
  const veins: [number, number][][] = [
    [
      [0.02, 0.18],
      [0.32, 0.08],
      [0.48, 0.38],
      [0.28, 0.68],
    ],
    [
      [0.92, 0.02],
      [0.68, 0.28],
      [0.86, 0.58],
      [0.58, 0.86],
    ],
    [
      [0.08, 0.94],
      [0.38, 0.76],
      [0.6, 0.96],
      [0.98, 0.82],
    ],
  ];
  veins.forEach((pts) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0] * size, pts[0][1] * size);
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = ((pts[i][0] + pts[i + 1][0]) / 2) * size;
      const yc = ((pts[i][1] + pts[i + 1][1]) / 2) * size;
      ctx.quadraticCurveTo(pts[i][0] * size, pts[i][1] * size, xc, yc);
    }
    ctx.stroke();
  });
  ctx.restore();
}

function paintProductCap(ctx: CanvasRenderingContext2D, size: number, img: HTMLImageElement) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.48;

  const mask = document.createElement("canvas");
  mask.width = size;
  mask.height = size;
  const mctx = mask.getContext("2d");
  if (!mctx) return;
  const feather = mctx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r);
  feather.addColorStop(0, "rgba(255,255,255,1)");
  feather.addColorStop(1, "rgba(255,255,255,0)");
  mctx.fillStyle = feather;
  mctx.beginPath();
  mctx.arc(cx, cy, r, 0, Math.PI * 2);
  mctx.fill();

  // Plain "cover" crop, aspect-ratio preserved — the cap geometry's own
  // balanced UV means this doesn't need any correction.
  const side = r * 2;
  const scale = Math.max(side / img.width, side / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const temp = document.createElement("canvas");
  temp.width = size;
  temp.height = size;
  const tctx = temp.getContext("2d");
  if (!tctx) return;
  tctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
  tctx.globalCompositeOperation = "destination-in";
  tctx.drawImage(mask, 0, 0);

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(temp, 0, 0);
}
