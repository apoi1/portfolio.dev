/**
 * Page background — the site-wide animated fondo.
 *
 * A domain-warped double-fbm aurora in the phosphor duotone (CH1 amber /
 * CH2 green): bold, unmistakably animated — the field visibly flows at
 * three speeds while the graticule drifts with scroll (parallax). The
 * cursor bends and lights the field; clicks excite expanding phosphor
 * rings anywhere on the page; the konami code flares the whole
 * instrument. The hero keeps only its point-wave layer on top — this
 * canvas IS the background everywhere.
 */
import * as THREE from 'three';
import { motionReduced } from './motion-pref';

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;

let bg: { applyTheme: () => void; dispose: () => void } | null = null;
let themeBound = false;
let konamiBound = false;
let flare = 0; // konami flare — decays over ~8s

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
    u_click: { value: new THREE.Vector2(0.5, 0.5) },
    u_clickT: { value: -10.0 },
    u_flare: { value: 0 },
    u_base: { value: new THREE.Color('#0d0c0a') },
    u_colA: { value: new THREE.Color('#ffb000') },
    u_colB: { value: new THREE.Color('#34c77e') },
    u_glow: { value: 0.62 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `
uniform float u_time; uniform vec2 u_resolution; uniform vec2 u_mouse;
uniform float u_scroll; uniform vec2 u_click; uniform float u_clickT;
uniform float u_flare; uniform vec3 u_base;
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
  float t = u_time;

  // graticule — slow parallax with scroll
  vec2 gp = (uv + vec2(0.0, u_scroll * 0.12)) * vec2(14.0, 8.0);
  vec2 g = abs(fract(gp) - 0.5);
  float grid = 1.0 - smoothstep(0.035, 0.05, min(g.x, g.y));

  // domain-warped aurora: noise of noise of noise, three flow speeds
  vec2 q = vec2(fbm(uv * 2.2 + vec2(t * 0.05, u_scroll * 0.55)),
                fbm(uv * 2.2 + vec2(4.7, 2.1) + vec2(-t * 0.04, t * 0.02)));
  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= u_resolution.x / u_resolution.y;
  vec2 pull = (p - m) * -0.12; // the cursor bends the field toward itself
  vec2 r2 = vec2(fbm(uv * 3.1 + 3.2 * q + vec2(1.7, 9.2) + t * 0.07 + pull),
                 fbm(uv * 3.1 + 3.6 * q + vec2(8.3, 2.8) - t * 0.05 + pull));
  float field = fbm(uv * 2.6 + 4.0 * r2 + vec2(t * 0.06, -u_scroll * 0.75));
  field = smoothstep(0.18, 0.92, field); // strong band contrast

  // palette mix — amber CH1 to green CH2 through gold
  float mixer = clamp(r2.x * 0.7 + field * 0.45, 0.0, 1.0);
  vec3 band = mix(u_colA, u_colB, mixer);
  // luminance shape: bands glow, troughs stay near base
  float lum = pow(field, 1.35) * (0.34 + u_flare * 0.42);

  // cursor bloom + click ring (page-wide phosphor excitation)
  float bloom = exp(-dot(p - m, p - m) * 2.4) * 0.55;
  vec2 cp = u_click * 2.0 - 1.0;
  cp.x *= u_resolution.x / u_resolution.y;
  float dt = t - u_clickT;
  float ring = exp(-abs(length(p - cp) - dt * 0.85) * 13.0) * exp(-dt * 1.05) * 0.8;

  // slow beam sweep
  float sweepPos = fract(t * 0.05) * 1.3 - 0.15;
  float sweep = exp(-abs(uv.y - sweepPos) * 15.0) * 0.35;

  float vig = 1.0 - smoothstep(0.35, 1.45, length(p));
  float amp = (lum + bloom + ring + sweep) * u_glow * vig * (1.0 + u_flare * 0.5);

  vec3 col = u_base
           + band * amp
           + band * amp * amp * 0.9
           + (u_colA + u_colB) * 0.5 * grid * (0.055 + u_flare * 0.12) * vig;
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
    uniforms.u_glow.value = Number.isFinite(g) ? Math.min(1, g) : 0.62;
  };
  applyTheme();

  const mouseTarget = new THREE.Vector2(0.5, 0.5);
  const onMove = (e: PointerEvent) => {
    mouseTarget.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
  };
  const onClick = (e: PointerEvent) => {
    uniforms.u_click.value.set(
      e.clientX / window.innerWidth,
      1 - e.clientY / window.innerHeight,
    );
    uniforms.u_clickT.value = t;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onClick, { passive: true });

  const resize = () => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    renderer.setSize(w, h, false);
    uniforms.u_resolution.value.set(
      w * renderer.getPixelRatio(),
      h * renderer.getPixelRatio(),
    );
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(document.documentElement);

  let raf = 0;
  let t = 0;
  let scrollT = 0;
  const scrollTarget = () => window.scrollY / Math.max(1, window.innerHeight);

  if (reduced) {
    uniforms.u_scroll.value = scrollTarget();
    renderer.clear();
    renderer.render(scene, cam);
  } else {
    const frame = () => {
      if (!document.hidden) {
        t += 0.016;
        flare = Math.max(0, flare - 0.016 / 8);
        uniforms.u_time.value = t;
        uniforms.u_flare.value = flare;
        scrollT += (scrollTarget() - scrollT) * 0.05;
        uniforms.u_scroll.value = scrollT;
        uniforms.u_mouse.value.lerp(mouseTarget, 0.06);
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
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onClick);
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
  if (!konamiBound) {
    konamiBound = true;
    document.addEventListener('konami', () => {
      flare = 1;
    });
  }
};

document.addEventListener('astro:page-load', init);
