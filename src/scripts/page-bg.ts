/**
 * Page background — a fixed full-viewport phosphor shader behind every
 * section of the site (the hero keeps its richer own canvas).
 *
 * Cursor bloom follows the pointer across the whole page, the fbm field
 * breathes, and both the graticule and the field drift with scroll at
 * different rates — real parallax depth. Theme-aware via --sig-* and
 * --color-base (paper stays paper in light mode). Calibrated calm:
 * content reads first, the instrument hums underneath.
 */
import * as THREE from 'three';
import { motionReduced } from './motion-pref';

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;

let bg: { applyTheme: () => void; dispose: () => void } | null = null;
let themeBound = false;

function createBg(canvas: HTMLCanvasElement) {
  const reduced = motionReduced();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.autoClear = false;

  const scene = new THREE.Scene();
  const cam = new THREE.Camera();
  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_scroll: { value: 0 },
    u_base: { value: new THREE.Color('#0d0c0a') },
    u_colA: { value: new THREE.Color('#ffb000') },
    u_colB: { value: new THREE.Color('#34c77e') },
    u_glow: { value: 0.5 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `
uniform float u_time; uniform vec2 u_resolution; uniform vec2 u_mouse;
uniform float u_scroll; uniform vec3 u_base;
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
  for (int i = 0; i < 3; i++){ v += a * noise(p); p = r * p * 2.0; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  // parallax: the field drifts with scroll, the graticule slower
  vec2 drift = vec2(u_time * 0.012, u_scroll * 0.35);
  float n = smoothstep(0.25, 0.85, fbm(uv * 2.8 + drift));
  vec2 gp = (uv + vec2(0.0, u_scroll * 0.12)) * vec2(14.0, 8.0);
  vec2 g = abs(fract(gp) - 0.5);
  float grid = 1.0 - smoothstep(0.035, 0.05, min(g.x, g.y));
  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= u_resolution.x / u_resolution.y;
  float bloom = exp(-dot(p - m, p - m) * 2.6) * 0.8;
  float vig = 1.0 - smoothstep(0.25, 1.4, length(p));
  float glowAmt = (n * 0.32 + bloom) * u_glow * vig;
  vec3 col = u_base
           + u_colA * glowAmt
           + u_colB * glowAmt * glowAmt * 1.4
           + (u_colA + u_colB) * 0.035 * grid * vig;
  gl_FragColor = vec4(col, 1.0);
}`,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  quad.frustumCulled = false;
  scene.add(quad);

  const applyTheme = () => {
    (uniforms.u_base.value as THREE.Color).set(cssVar('--color-base', '#0d0c0a'));
    (uniforms.u_colA.value as THREE.Color).set(cssVar('--sig-a', '#ffb000'));
    (uniforms.u_colB.value as THREE.Color).set(cssVar('--sig-b', '#34c77e'));
    const g = parseFloat(cssVar('--sig-glow', '0.62'));
    uniforms.u_glow.value = Math.min(1, Number.isFinite(g) ? g * 0.8 : 0.5);
  };
  applyTheme();

  const mouseTarget = new THREE.Vector2(0.5, 0.5);
  const onMove = (e: PointerEvent) => {
    mouseTarget.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  const resize = () => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    renderer.setSize(w, h, false);
    uniforms.u_resolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(document.documentElement);

  let raf = 0;
  let t = 0;
  let scrollT = 0;
  const scrollTarget = () =>
    window.scrollY / Math.max(1, window.innerHeight);
  const onVis = () => {};
  document.addEventListener('visibilitychange', onVis);

  if (reduced) {
    uniforms.u_scroll.value = scrollTarget();
    renderer.clear();
    renderer.render(scene, cam);
  } else {
    const frame = () => {
      if (!document.hidden) {
        t += 0.016;
        uniforms.u_time.value = t;
        scrollT += (scrollTarget() - scrollT) * 0.05;
        uniforms.u_scroll.value = scrollT;
        uniforms.u_mouse.value.lerp(mouseTarget, 0.05);
        renderer.clear();
        renderer.render(scene, cam);
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
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      quad.geometry.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}

const init = () => {
  bg?.dispose();
  bg = null;
  const canvas = document.getElementById('page-bg') as HTMLCanvasElement | null;
  if (!canvas) return;
  try {
    bg = createBg(canvas);
  } catch {
    canvas.remove(); // no WebGL → the plain --color-base background remains
  }
  if (!themeBound) {
    themeBound = true;
    document.addEventListener('themechange', () => bg?.applyTheme());
  }
};

document.addEventListener('astro:page-load', init);
