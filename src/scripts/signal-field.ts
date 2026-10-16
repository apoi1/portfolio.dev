/**
 * Signal field — interactive three.js point-wave canvas for the hero.
 *
 * A grid of additive-blended points undulates as layered radio waves;
 * the pointer injects a decaying ripple, like a WiFi CSI packet hitting
 * the receiver. Colors are read from the theme's CSS variables
 * (--sig-a / --sig-b / --sig-glow) and refresh on themechange.
 *
 * Graceful behavior: prefers-reduced-motion renders one static frame;
 * no WebGL → the canvas is removed and the CSS gradient remains;
 * the loop pauses when the tab is hidden or the hero is off-screen.
 */
import * as THREE from 'three';

interface Field {
  dispose: () => void;
  applyTheme: () => void;
}

let field: Field | null = null;
let themeBound = false;

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;

function createField(canvas: HTMLCanvasElement): Field {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 6.4, 8.6);
  camera.lookAt(0, -0.6, 0);

  const COLS = isMobile ? 96 : 140;
  const ROWS = isMobile ? 56 : 84;
  const COUNT = COLS * ROWS;
  const W = 17;
  const D = 11;

  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  let i = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      positions[i * 3] = (c / (COLS - 1) - 0.5) * W;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = (r / (ROWS - 1) - 0.5) * D;
      i++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: isMobile ? 0.06 : 0.048,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const colorA = new THREE.Color();
  const colorB = new THREE.Color();
  const tmp = new THREE.Color();
  const applyTheme = () => {
    colorA.set(cssVar('--sig-a', '#7c5cff'));
    colorB.set(cssVar('--sig-b', '#22d3ee'));
    mat.opacity = Math.min(1, parseFloat(cssVar('--sig-glow', '0.6')));
  };
  applyTheme();

  // pointer → world coordinates on the y=0 plane
  const pointer = new THREE.Vector2(999, 999);
  const raycaster = new THREE.Raycaster();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  const listenRoot = canvas.closest('section') ?? canvas.parentElement ?? canvas;

  const onPointer = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(groundPlane, hit)) {
      pointer.set(hit.x, hit.z);
    }
  };
  const onPointerLeave = () => pointer.set(999, 999);
  listenRoot.addEventListener('pointermove', onPointer, { passive: true });
  listenRoot.addEventListener('pointerleave', onPointerLeave);

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const wave = (x: number, z: number, time: number) =>
    0.34 * Math.sin(x * 0.55 + time * 0.9) +
    0.2 * Math.sin(z * 0.8 + time * 0.7) +
    0.16 * Math.sin((x + z) * 0.32 - time * 1.3);

  const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
  const colAttr = geo.getAttribute('color') as THREE.BufferAttribute;

  const update = (time: number) => {
    for (let j = 0; j < COUNT; j++) {
      const x = positions[j * 3];
      const z = positions[j * 3 + 2];
      const dx = x - pointer.x;
      const dz = z - pointer.y;
      const d2 = dx * dx + dz * dz;
      const ripple =
        Math.exp(-d2 / 1.4) * Math.cos(d2 * 1.8 - time * 3.2) * 0.55;
      const y = wave(x, z, time) + ripple;
      posAttr.setY(j, y);
      const hNorm = Math.min(1, Math.abs(y) / 0.9);
      const mix =
        (x / W + 0.5) * 0.45 + (z / D + 0.5) * 0.25 + hNorm * 0.3;
      tmp.copy(colorA).lerp(colorB, mix).multiplyScalar(0.35 + hNorm * 0.75);
      colAttr.setXYZ(j, tmp.r, tmp.g, tmp.b);
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  };

  let raf = 0;
  let visible = true;
  let inView = true;
  let t = 0;

  const onVis = () => {
    visible = !document.hidden;
  };

  let io: IntersectionObserver | null = null;

  if (reduced) {
    update(2.4);
    renderer.render(scene, camera);
  } else {
    io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 },
    );
    io.observe(canvas);
    document.addEventListener('visibilitychange', onVis);
    const frame = () => {
      if (visible && inView) {
        t += 0.016;
        update(t);
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }

  return {
    applyTheme,
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      listenRoot.removeEventListener('pointermove', onPointer);
      listenRoot.removeEventListener('pointerleave', onPointerLeave);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}

const init = () => {
  field?.dispose();
  field = null;
  const canvas = document.getElementById(
    'signal-field',
  ) as HTMLCanvasElement | null;
  if (!canvas) return;
  try {
    field = createField(canvas);
  } catch {
    // no WebGL / context lost → drop the canvas, CSS gradient remains
    canvas.remove();
  }
  if (!themeBound) {
    themeBound = true;
    document.addEventListener('themechange', () => field?.applyTheme());
  }
};

document.addEventListener('astro:page-load', init);
