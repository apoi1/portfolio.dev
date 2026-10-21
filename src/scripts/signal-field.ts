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
import { motionReduced } from './motion-pref';

interface Field {
  dispose: () => void;
  applyTheme: () => void;
}

let field: Field | null = null;
let themeBound = false;
let konamiBound = false;
let boost = 0; // konami 'signal boost' — decays over 8s

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;

function createField(canvas: HTMLCanvasElement): Field {
  const reduced = motionReduced();
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.autoClear = false; // two passes: phosphor backdrop + point wave

  // ── phosphor backdrop (shader-glsl skill: fullscreen quad + ShaderMaterial) ──
  const bgScene = new THREE.Scene();
  const bgCam = new THREE.Camera();
  const bgUniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_mouse: { value: new THREE.Vector2(0.5, 0.55) },
    u_click: { value: new THREE.Vector2(0.5, 0.55) },
    u_clickT: { value: -10.0 },
    u_flare: { value: 0 },
    u_colA: { value: new THREE.Color('#ffb000') },
    u_colB: { value: new THREE.Color('#34c77e') },
    u_glow: { value: 0.6 },
  };
  const bgMat = new THREE.ShaderMaterial({
    uniforms: bgUniforms,
    vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `
precision highp float;
uniform float u_time; uniform vec2 u_resolution; uniform vec2 u_mouse;
uniform vec2 u_click; uniform float u_clickT; uniform float u_flare;
uniform vec3 u_colA; uniform vec3 u_colB; uniform float u_glow;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = r * p * 2.0; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  vec2 g = abs(fract(uv * vec2(14.0, 8.0)) - 0.5);
  float line = smoothstep(0.035, 0.05, min(g.x, g.y));
  float grid = 1.0 - line;
  float n = smoothstep(0.25, 0.85, fbm(uv * 2.6 + vec2(u_time * 0.02, -u_time * 0.013)));
  float sweepPos = fract(u_time * 0.06) * 1.3 - 0.15;
  float sweep = exp(-abs(uv.y - sweepPos) * 16.0);
  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= u_resolution.x / u_resolution.y;
  float bloom = exp(-dot(p - m, p - m) * 3.2) * 0.9;
  // click ripple — touching the phosphor excites an expanding ring
  vec2 cp = u_click * 2.0 - 1.0;
  cp.x *= u_resolution.x / u_resolution.y;
  float dt = u_time - u_clickT;
  float ring = exp(-abs(length(p - cp) - dt * 0.9) * 14.0) * exp(-dt * 1.1);
  float vig = 1.0 - smoothstep(0.3, 1.35, length(p));
  float glowAmt = (n * 0.50 + bloom + sweep * 0.85 + ring * 0.75) * u_glow * vig * (1.0 + u_flare * 1.6);
  vec3 col = u_colA * glowAmt
           + u_colB * glowAmt * glowAmt * 1.6
           + (u_colA + u_colB) * 0.5 * grid * (0.11 + u_flare * 0.14) * vig;
  gl_FragColor = vec4(col, 1.0);
}`,
  });
  const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
  bgQuad.frustumCulled = false; // clip-space quad — never let culling eat it
  bgScene.add(bgQuad);

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
    colorA.set(cssVar('--sig-a', '#ffb000'));
    colorB.set(cssVar('--sig-b', '#34c77e'));
    const glow = Math.min(1, parseFloat(cssVar('--sig-glow', '0.6')));
    mat.opacity = glow;
    (bgUniforms.u_colA.value as THREE.Color).copy(colorA);
    (bgUniforms.u_colB.value as THREE.Color).copy(colorB);
    bgUniforms.u_glow.value = glow;
  };
  applyTheme();

  // pointer → world coordinates on the y=0 plane
  const pointer = new THREE.Vector2(999, 999);
  const ndcMouse = new THREE.Vector2(0.5, 0.55);
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
    ndcMouse.set(
      (e.clientX - rect.left) / Math.max(1, rect.width),
      1 - (e.clientY - rect.top) / Math.max(1, rect.height),
    );
  };
  const onPointerLeave = () => pointer.set(999, 999);
  const onClick = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    bgUniforms.u_click.value.set(
      (e.clientX - rect.left) / Math.max(1, rect.width),
      1 - (e.clientY - rect.top) / Math.max(1, rect.height),
    );
    bgUniforms.u_clickT.value = t;
  };
  listenRoot.addEventListener('pointermove', onPointer, { passive: true });
  listenRoot.addEventListener('pointerleave', onPointerLeave);
  listenRoot.addEventListener('pointerdown', onClick, { passive: true });

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    bgUniforms.u_resolution.value.set(
      w * renderer.getPixelRatio(),
      h * renderer.getPixelRatio(),
    );
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
      const y = (wave(x, z, time) + ripple) * (1 + boost * 1.6);
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
    bgUniforms.u_time.value = 2.4;
    renderer.clear();
    renderer.render(bgScene, bgCam);
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
        // scroll velocity feeds the wave speed — the page feels alive
        // while you scroll it (motion.ts writes __scrollVel from Lenis)
        const vel = Math.min(
          Math.abs((window as any).__scrollVel || 0),
          60,
        );
        (window as any).__scrollVel =
          ((window as any).__scrollVel || 0) * 0.92;
        t += 0.016 * (1 + (vel / 60) * 1.2);
        boost = Math.max(0, boost - 0.016 / 8);
        bgUniforms.u_time.value = t;
        bgUniforms.u_mouse.value.lerp(ndcMouse, 0.06);
        bgUniforms.u_flare.value = boost;
        renderer.clear();
        renderer.render(bgScene, bgCam);
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
      listenRoot.removeEventListener('pointerdown', onClick);
      geo.dispose();
      mat.dispose();
      bgQuad.geometry.dispose();
      bgMat.dispose();
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
  if (!konamiBound) {
    konamiBound = true;
    document.addEventListener('konami', () => {
      boost = 1;
    });
  }
};

document.addEventListener('astro:page-load', init);
