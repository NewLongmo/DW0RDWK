<template>
  <div class="fluid-scene" :class="[`fluid-scene--${variant}`, { 'fluid-scene--fallback': fallback }]">
    <div ref="mountRef" class="fluid-scene__canvas" />
    <div v-if="fallback" class="fluid-scene__fallback" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as THREE from 'three';

const props = withDefaults(defineProps<{
  variant?: 'public' | 'panel';
  interactive?: boolean;
}>(), {
  variant: 'public',
  interactive: true,
});

const mountRef = ref<HTMLDivElement>();
const fallback = ref(false);

let renderer: THREE.WebGLRenderer | undefined;
let scene: THREE.Scene | undefined;
let camera: THREE.PerspectiveCamera | undefined;
let animationFrame = 0;
let particles: THREE.Points | undefined;
let surface: THREE.Mesh | undefined;
let pointerX = 0;
let pointerY = 0;
let targetX = 0;
let targetY = 0;
let startedAt = 0;
let lowFrameCount = 0;
let lastFrameAt = 0;
let resizeObserver: ResizeObserver | undefined;

function shouldFallback() {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(max-width: 720px)').matches
  );
}

function buildParticles() {
  const count = props.variant === 'panel' ? 900 : 1500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorA = new THREE.Color('#1677ff');
  const colorB = new THREE.Color('#3fb950');
  const colorC = new THREE.Color('#8b5cf6');

  for (let i = 0; i < count; i += 1) {
    const radius = 1.5 + Math.pow(Math.random(), 0.55) * 5.8;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 0.55;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2.8;

    const mix = Math.random();
    const color = mix < 0.45 ? colorA.clone().lerp(colorB, mix / 0.45) : colorB.clone().lerp(colorC, (mix - 0.45) / 0.55);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: props.variant === 'panel' ? 0.035 : 0.045,
    vertexColors: true,
    transparent: true,
    opacity: props.variant === 'panel' ? 0.48 : 0.58,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function buildSurface() {
  const geometry = new THREE.PlaneGeometry(12, 6.2, 72, 36);
  const material = new THREE.MeshBasicMaterial({
    color: '#1677ff',
    wireframe: true,
    transparent: true,
    opacity: props.variant === 'panel' ? 0.12 : 0.18,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -0.88;
  mesh.position.y = props.variant === 'panel' ? -1.45 : -1.75;
  mesh.position.z = -1.2;
  return mesh;
}

function resize() {
  if (!mountRef.value || !renderer || !camera) return;
  const rect = mountRef.value.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate(now: number) {
  if (!renderer || !scene || !camera || !particles || !surface) return;
  animationFrame = window.requestAnimationFrame(animate);

  if (!startedAt) {
    startedAt = now;
    lastFrameAt = now;
  }
  const delta = now - lastFrameAt;
  lastFrameAt = now;
  if (delta > 44 && now - startedAt > 1600) {
    lowFrameCount += 1;
  }
  if (lowFrameCount > 18) {
    fallback.value = true;
    dispose();
    return;
  }

  pointerX += (targetX - pointerX) * 0.045;
  pointerY += (targetY - pointerY) * 0.045;
  const time = now * 0.001;

  particles.rotation.z = time * 0.045 + pointerX * 0.18;
  particles.rotation.x = Math.sin(time * 0.31) * 0.12 + pointerY * 0.1;
  particles.rotation.y = Math.cos(time * 0.25) * 0.08;

  const particlePositions = particles.geometry.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < particlePositions.count; i += 1) {
    const x = particlePositions.getX(i);
    const y = particlePositions.getY(i);
    const wave = Math.sin(x * 1.25 + time * 1.4) * 0.005 + Math.cos(y * 1.7 - time * 1.1) * 0.004;
    particlePositions.setZ(i, particlePositions.getZ(i) + wave + pointerY * 0.0008);
  }
  particlePositions.needsUpdate = true;

  const surfacePositions = surface.geometry.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < surfacePositions.count; i += 1) {
    const x = surfacePositions.getX(i);
    const y = surfacePositions.getY(i);
    surfacePositions.setZ(i, Math.sin(x * 0.9 + time + pointerX) * 0.22 + Math.cos(y * 1.45 - time * 0.8 + pointerY) * 0.12);
  }
  surfacePositions.needsUpdate = true;

  renderer.render(scene, camera);
}

function onPointerMove(event: PointerEvent) {
  if (!props.interactive || !mountRef.value) return;
  const rect = mountRef.value.getBoundingClientRect();
  targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  targetY = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
}

function dispose() {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  mountRef.value?.removeEventListener('pointermove', onPointerMove);
  particles?.geometry.dispose();
  (particles?.material as THREE.Material | undefined)?.dispose();
  surface?.geometry.dispose();
  (surface?.material as THREE.Material | undefined)?.dispose();
  renderer?.dispose();
  renderer?.domElement.remove();
  renderer = undefined;
  scene = undefined;
  camera = undefined;
  particles = undefined;
  surface = undefined;
}

onMounted(() => {
  if (!mountRef.value || shouldFallback()) {
    fallback.value = true;
    return;
  }

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, props.variant === 'panel' ? 8.2 : 7.4);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    mountRef.value.appendChild(renderer.domElement);

    particles = buildParticles();
    surface = buildSurface();
    scene.add(particles);
    scene.add(surface);

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mountRef.value);
    mountRef.value.addEventListener('pointermove', onPointerMove, { passive: true });
    resize();
    animationFrame = window.requestAnimationFrame(animate);
  } catch {
    fallback.value = true;
    dispose();
  }
});

onBeforeUnmount(dispose);
</script>

<style scoped>
.fluid-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.fluid-scene__canvas,
.fluid-scene__canvas canvas {
  width: 100%;
  height: 100%;
}

.fluid-scene__canvas canvas {
  display: block;
}

.fluid-scene::before {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 16% 18%, rgb(22 119 255 / 22%), transparent 34%),
    radial-gradient(circle at 74% 36%, rgb(63 185 80 / 16%), transparent 30%),
    linear-gradient(120deg, rgb(14 16 20 / 0%), rgb(22 119 255 / 8%));
  content: "";
}

.fluid-scene--panel::before {
  opacity: 0.72;
}

.fluid-scene__fallback {
  position: absolute;
  inset: 0;
  filter: blur(0.2px);
}

.fluid-scene__fallback span {
  position: absolute;
  width: 48%;
  height: 48%;
  border: 1px solid rgb(22 119 255 / 20%);
  border-radius: 42% 58% 47% 53%;
  background: linear-gradient(135deg, rgb(22 119 255 / 14%), rgb(63 185 80 / 10%));
  animation: fluid-float 16s ease-in-out infinite alternate;
}

.fluid-scene__fallback span:nth-child(1) {
  top: 4%;
  left: 8%;
}

.fluid-scene__fallback span:nth-child(2) {
  right: 5%;
  bottom: 12%;
  animation-duration: 19s;
  animation-delay: -5s;
}

.fluid-scene__fallback span:nth-child(3) {
  top: 28%;
  right: 24%;
  width: 30%;
  height: 30%;
  animation-duration: 22s;
  animation-delay: -9s;
}

@keyframes fluid-float {
  0% {
    transform: translate3d(-2%, 2%, 0) rotate(0deg) scale(0.92);
  }

  100% {
    transform: translate3d(4%, -5%, 0) rotate(32deg) scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fluid-scene__fallback span {
    animation: none;
  }
}
</style>
