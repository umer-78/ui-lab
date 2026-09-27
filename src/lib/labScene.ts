import * as THREE from 'three';

/**
 * The header's 3D scene: six floating panels, one for each pattern on the page,
 * each drawing a small picture of it. The cluster leans toward the pointer on a
 * spring, one panel at a time lifts forward, and clicking a panel scrolls to
 * that demo. It pauses off screen and holds still for reduced motion.
 */
export interface LabScene {
  dispose(): void;
}

interface Palette { card: string; edge: string; soft: string; text: string; muted: string; accent: string; accent2: string }
const DARK: Palette = { card: '#18181b', edge: '#3f3f46', soft: '#27272a', text: '#f4f4f5', muted: '#a1a1aa', accent: '#8b5cf6', accent2: '#e879f9' };
const LIGHT: Palette = { card: '#ffffff', edge: '#d4d4d8', soft: '#f4f4f5', text: '#18181b', muted: '#71717a', accent: '#7c3aed', accent2: '#c026d3' };

const W = 320; // each panel's drawing, in CSS pixels (drawn at 2x)
const H = 200;
const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

function rounded(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function label(g: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, font: string, align: CanvasTextAlign = 'left') {
  g.font = font;
  g.textAlign = align;
  g.textBaseline = 'middle';
  g.fillStyle = color;
  g.fillText(text, x, y);
}

type Draw = (g: CanvasRenderingContext2D, p: Palette) => void;

// One small picture per demo, in the page's order.
const FACES: [string, Draw][] = [
  ['01  Shared layout tabs', (g, p) => {
    rounded(g, 24, 84, 272, 46, 23); g.fillStyle = p.soft; g.fill();
    rounded(g, 30, 90, 92, 34, 17); g.fillStyle = p.accent; g.fill();
    label(g, 'Layout', 76, 107, '#ffffff', `600 14px ${FONT}`, 'center');
    label(g, 'Springs', 166, 107, p.muted, `600 14px ${FONT}`, 'center');
    label(g, 'Presence', 246, 107, p.muted, `600 14px ${FONT}`, 'center');
  }],
  ['02  Enter and exit', (g, p) => {
    ['Write the README', 'Record the demo GIF', 'Tag v1.0'].forEach((t, i) => {
      g.globalAlpha = i === 2 ? 0.4 : 1; // the last one is on its way out
      rounded(g, 24, 58 + i * 42, 272, 34, 9); g.fillStyle = p.soft; g.fill();
      label(g, t, 38, 75 + i * 42, p.text, `500 13px ${FONT}`);
      label(g, '×', 276, 75 + i * 42, p.muted, `500 16px ${FONT}`, 'center');
    });
    g.globalAlpha = 1;
  }],
  ['03  Drag with a spring', (g, p) => {
    g.setLineDash([4, 6]); g.strokeStyle = p.muted; g.lineWidth = 2;
    g.beginPath(); g.moveTo(66, 150); g.bezierCurveTo(116, 176, 160, 70, 206, 96); g.stroke();
    g.setLineDash([]);
    g.beginPath(); g.arc(66, 150, 7, 0, Math.PI * 2); g.fillStyle = p.muted; g.fill();
    const grad = g.createLinearGradient(190, 58, 290, 140);
    grad.addColorStop(0, p.accent); grad.addColorStop(1, p.accent2);
    rounded(g, 190, 58, 98, 74, 14); g.fillStyle = grad; g.fill();
    label(g, 'drag me', 239, 95, '#ffffff', `600 13px ${FONT}`, 'center');
  }],
  ['04  Number ticker', (g, p) => {
    label(g, '1,284', 24, 112, p.text, `700 56px ${FONT}`);
    rounded(g, 212, 96, 74, 32, 16); g.fillStyle = p.accent; g.fill();
    label(g, '+12', 249, 112, '#ffffff', `700 14px ${FONT}`, 'center');
    label(g, 'visitors today', 26, 160, p.muted, `500 13px ${FONT}`);
  }],
  ['05  Expanding rows', (g, p) => {
    const row = (y: number, text: string, open: boolean) => {
      rounded(g, 24, y, 272, 30, 8); g.fillStyle = p.soft; g.fill();
      label(g, text, 38, y + 15, p.text, `600 13px ${FONT}`);
      label(g, open ? '−' : '+', 278, y + 15, open ? p.accent : p.muted, `700 16px ${FONT}`, 'center');
    };
    row(52, 'What does it do?', false);
    row(88, 'How is it built?', true);
    g.fillStyle = p.edge;
    rounded(g, 38, 126, 220, 7, 3.5); g.fill();
    rounded(g, 38, 140, 170, 7, 3.5); g.fill();
    row(156, 'Is it accessible?', false);
  }],
  ['06  Scroll progress', (g, p) => {
    rounded(g, 24, 56, 272, 8, 4); g.fillStyle = p.soft; g.fill();
    const grad = g.createLinearGradient(24, 0, 200, 0);
    grad.addColorStop(0, p.accent); grad.addColorStop(1, p.accent2);
    rounded(g, 24, 56, 176, 8, 4); g.fillStyle = grad; g.fill();
    [250, 220, 262, 190, 236].forEach((w, i) => { rounded(g, 24, 84 + i * 20, w, 8, 4); g.fillStyle = p.soft; g.fill(); });
    label(g, '65%', 296, 42, p.muted, `600 12px ${FONT}`, 'right');
  }],
];

function drawPanel(canvas: HTMLCanvasElement, index: number, p: Palette) {
  const g = canvas.getContext('2d');
  if (!g) return;
  g.setTransform(2, 0, 0, 2, 0, 0);
  g.clearRect(0, 0, W, H);
  rounded(g, 1, 1, W - 2, H - 2, 20);
  g.fillStyle = p.card; g.fill();
  g.lineWidth = 1.5; g.strokeStyle = p.edge; g.stroke();
  const [title, draw] = FACES[index];
  label(g, title, 22, 28, p.muted, `600 12px ui-monospace, "SF Mono", Menlo, monospace`);
  draw(g, p);
}

/** A soft round glow, tinted per use. */
function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.25)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface Spring { x: number; v: number }
/** One step of a damped spring: slightly under-damped, so things settle with a small overshoot. */
function spring(s: Spring, target: number, dt: number, k = 90, c = 14) {
  s.v += ((target - s.x) * k - s.v * c) * dt;
  s.x += s.v * dt;
}

export function createLabScene(host: HTMLElement): LabScene | null {
  const wrap = host.parentElement;
  if (!wrap) return null;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }
  const dark = matchMedia('(prefers-color-scheme: dark)');
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 9);
  const root = new THREE.Group();
  const cluster = new THREE.Group();
  root.add(cluster);
  scene.add(root);

  const glowMap = glowTexture();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, transparent: true, depthWrite: false, opacity: 0 }));
  glow.scale.set(3.4, 2.6, 1);
  cluster.add(glow);

  const plane = new THREE.PlaneGeometry(1.6, 1.0);
  const anisotropy = renderer.capabilities.getMaxAnisotropy();
  const panels = FACES.map((_, i) => {
    const canvas = document.createElement('canvas');
    canvas.width = W * 2;
    canvas.height = H * 2;
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = anisotropy;
    const mesh = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map, transparent: true }));
    const col = i % 2;
    const row = Math.floor(i / 2);
    const home = new THREE.Vector3((col - 0.5) * 1.9, (1 - row) * 1.22, (col ? -0.3 : 0.25) + (row - 1) * 0.12);
    mesh.position.copy(home);
    cluster.add(mesh);
    return { mesh, canvas, map, home, lift: { x: 0, v: 0 }, phase: i * 1.3 };
  });

  const paint = () => {
    const p = dark.matches ? DARK : LIGHT;
    panels.forEach((panel, i) => { drawPanel(panel.canvas, i, p); panel.map.needsUpdate = true; });
    glow.material.color.set(p.accent);
    glow.material.blending = dark.matches ? THREE.AdditiveBlending : THREE.NormalBlending;
  };
  paint();

  // ── Layout: the free space right of the text, or a small corner on phones ──
  let pxPerUnit = 1;
  const layout = () => {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    pxPerUnit = h / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z);
    const text = wrap.querySelector('[data-hero-text]');
    const left = wrap.getBoundingClientRect().left;
    const textRight = text ? text.getBoundingClientRect().right - left + 24 : w / 2;
    const free = w - textRight;
    const wide = w >= 900 && free >= 300;
    let cx: number;
    let cy: number;
    let scale: number;
    if (wide) {
      cx = textRight + free / 2;
      cy = h / 2 + 16;
      scale = Math.min(1.4, (free - 16) / (4 * pxPerUnit), (h - 40) / (4.4 * pxPerUnit));
    } else {
      scale = Math.min(0.62, w / (7.5 * pxPerUnit));
      cx = w - (2.1 * scale * pxPerUnit);
      cy = 3 * scale * pxPerUnit;
    }
    host.classList.toggle('narrow', !wide);
    root.scale.setScalar(scale);
    root.position.set((cx - w / 2) / pxPerUnit, -(cy - h / 2) / pxPerUnit, 0);
    wake();
  };

  // ── Pointer: lean toward it; the panel under it lifts; a click opens that demo ──
  const pointer = { x: 0, y: 0 };
  const tiltX: Spring = { x: 0, v: 0 };
  const tiltY: Spring = { x: 0, v: 0 };
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered = -1;
  let active = 0;
  let nextSwap = 2.4;
  const pick = (e: PointerEvent | MouseEvent) => {
    const r = wrap.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(panels.map((p) => p.mesh))[0];
    return hit ? panels.findIndex((p) => p.mesh === hit.object) : -1;
  };
  const overLink = (t: EventTarget | null) => t instanceof Element && Boolean(t.closest('a, button, input'));
  const onMove = (e: PointerEvent) => {
    const r = wrap.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    hovered = overLink(e.target) ? -1 : pick(e);
    wrap.style.cursor = hovered >= 0 ? 'pointer' : '';
    wake();
  };
  const onLeave = () => { pointer.x = 0; pointer.y = 0; hovered = -1; wrap.style.cursor = ''; wake(); };
  const onClick = (e: MouseEvent) => {
    if (overLink(e.target)) return;
    const i = pick(e);
    if (i < 0) return;
    panels[i].lift.v += 6; // a little bounce before the page scrolls
    document.getElementById(`demo-${i + 1}`)?.scrollIntoView({ behavior: still.matches ? 'auto' : 'smooth', block: 'center' });
    wake();
  };
  wrap.addEventListener('pointermove', onMove);
  wrap.addEventListener('pointerleave', onLeave);
  wrap.addEventListener('click', onClick);

  // ── Frame ──
  let raf = 0;
  let last = 0;
  let time = 0;
  let visible = true;
  let shown = false;
  const frame = (now: number) => {
    raf = 0;
    if (!visible || document.hidden) return;
    const calm = still.matches;
    const dt = last ? Math.min(0.05, Math.max(0, (now - last) / 1000)) : 1 / 60;
    last = now;
    if (!calm) {
      time += dt;
      nextSwap -= dt;
      if (nextSwap <= 0) { active = (active + 1) % panels.length; nextSwap = 2.4; }
    }
    const focus = hovered >= 0 ? hovered : active;
    const settle = (s: Spring, target: number, k?: number, c?: number) => {
      if (calm) { s.x = target; s.v = 0; } else spring(s, target, dt, k, c);
    };
    settle(tiltY, -0.42 + pointer.x * 0.32, 40, 9);
    settle(tiltX, 0.1 + pointer.y * 0.18, 40, 9);
    cluster.rotation.set(tiltX.x, tiltY.x, 0);
    panels.forEach((p, i) => {
      settle(p.lift, i === focus ? 1 : 0);
      p.mesh.position.set(p.home.x, p.home.y + Math.sin(time * 0.9 + p.phase) * 0.05, p.home.z + p.lift.x * 0.5);
      p.mesh.scale.setScalar(1 + p.lift.x * 0.06);
    });
    const lead = panels[focus];
    glow.position.set(lead.home.x, lead.home.y, lead.home.z + lead.lift.x * 0.5 - 0.08);
    glow.material.opacity = Math.max(0, lead.lift.x) * (dark.matches ? 0.55 : 0.3);
    renderer.render(scene, camera);
    if (!shown) { shown = true; host.classList.add('on'); }
    if (!calm) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  function wake() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  const resize = new ResizeObserver(layout);
  resize.observe(wrap);
  const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; last = 0; if (visible) wake(); });
  seen.observe(wrap);
  const onVisibility = () => { last = 0; if (!document.hidden) wake(); };
  const onTheme = () => { paint(); wake(); };
  document.addEventListener('visibilitychange', onVisibility);
  dark.addEventListener('change', onTheme);
  still.addEventListener('change', wake);
  layout();

  return {
    dispose() {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      dark.removeEventListener('change', onTheme);
      still.removeEventListener('change', wake);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('click', onClick);
      wrap.style.cursor = '';
      panels.forEach((p) => { p.map.dispose(); p.mesh.material.dispose(); });
      plane.dispose();
      glowMap.dispose();
      glow.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
