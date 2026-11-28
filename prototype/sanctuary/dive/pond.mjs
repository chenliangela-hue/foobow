import * as T from './vendor/three.webgpu.js';
import { uniform } from './vendor/three.webgpu.js';
import { buildKoi } from './koi.mjs';
import { createHabitat } from './habitat.mjs';

const TAU = Math.PI * 2;
const bank = 13.5;
const keyboardStep = 1.6;
const clamp = T.MathUtils.clamp;

async function makeRenderer(onLost) {
  for (const forceWebGL of navigator.gpu ? [false, true] : [true]) {
    const renderer = new T.WebGPURenderer({ antialias: true, forceWebGL });
    try {
      await renderer.init();
      renderer.onDeviceLost = onLost;
      renderer.domElement.addEventListener('webglcontextlost', onLost, { once: true });
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      return renderer;
    } catch (error) {
      renderer.dispose();
      if (forceWebGL) throw error;
    }
  }
}

export async function createPond(host, onLost) {
  const renderer = await makeRenderer(onLost);
  const scene = new T.Scene();
  scene.background = new T.Color('#154943');
  scene.fog = new T.FogExp2('#154943', .046);
  const clock = uniform(0), submerged = uniform(0);
  const camera = new T.PerspectiveCamera(46, 1, .06, 105);
  const eye = new T.Vector3(), look = new T.Vector3(), eyeTarget = new T.Vector3(), lookTarget = new T.Vector3();
  const sun = new T.DirectionalLight('#e7ffd0', 2.4);
  sun.position.set(-6, 15, 3);
  scene.add(sun, new T.HemisphereLight('#c4ffeb', '#33463e', 1.28));
  createHabitat(scene, clock, submerged);

  const koi = buildKoi(clock);
  koi.position.set(.35, -1, .8);
  koi.rotation.y = -.45;
  scene.add(koi);
  const school = Array.from({ length: 6 }, (_, index) => {
    const fish = buildKoi(clock, index * 1.53 + 1.8, index % 2 === 0);
    fish.scale.setScalar(.32 + index * .036);
    scene.add(fish);
    return fish;
  });
  const target = new T.Vector3();
  const ray = new T.Raycaster(), ndc = new T.Vector2();
  const steeringPlane = new T.Plane(new T.Vector3(0, 1, 0), 1);
  const rippleMaterial = new T.MeshBasicNodeMaterial({ color: 0xe5f8c3, side: T.DoubleSide, depthWrite: false, transparent: true });
  const ripple = new T.Mesh(new T.RingGeometry(.94, 1, 58).rotateX(-Math.PI / 2), rippleMaterial);
  ripple.visible = false;
  ripple.renderOrder = 4;
  scene.add(ripple);

  let mounted = false, stopped = true, view = 'surface', frame = 0, previous = 0;
  let aimExpires = 0, rippleAge = 1, course = 0;
  const observer = new ResizeObserver(resize);

  function moveFish(dt) {
    const t = clock.value;
    if (t >= aimExpires) {
      course += dt * .16;
      target.set(Math.sin(course) * 10, -1, Math.cos(course) * 10);
    }
    const dx = target.x - koi.position.x, dz = target.z - koi.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance > .16) {
      const bearing = Math.atan2(dx, dz);
      const turn = Math.atan2(Math.sin(bearing - koi.rotation.y), Math.cos(bearing - koi.rotation.y));
      koi.rotation.y += clamp(turn, -dt * 2.1, dt * 2.1);
      const speed = Math.min(distance * 1.9, 3.15) * Math.max(.12, Math.cos(turn));
      koi.position.x = clamp(koi.position.x + Math.sin(koi.rotation.y) * dt * speed, -bank, bank);
      koi.position.z = clamp(koi.position.z + Math.cos(koi.rotation.y) * dt * speed, -bank, bank);
    }
    koi.position.y = -1.18 + Math.sin(t * .95) * .14;

    for (const [index, fish] of school.entries()) {
      const angle = t * (.135 + index * .012) + index * TAU / school.length;
      const radius = 5.7 + index * .83;
      fish.position.set(Math.cos(angle) * radius, -1.1 - index * .34 + Math.sin(angle * 2) * .22, Math.sin(angle) * radius);
      fish.rotation.y = -angle;
    }
    rippleAge += dt;
    ripple.visible = view === 'surface' && rippleAge < .9;
    ripple.scale.setScalar(.31 + rippleAge * 1.32);
    rippleMaterial.opacity = Math.max(0, .65 - rippleAge * .72);
  }

  function draw(dt = 0, snap = false) {
    if (!mounted) return;
    if (view === 'koi') {
      const headingX = Math.sin(koi.rotation.y), headingZ = Math.cos(koi.rotation.y);
      eyeTarget.set(koi.position.x + headingX * 1.04, koi.position.y + .055, koi.position.z + headingZ * 1.04);
      lookTarget.set(eyeTarget.x + headingX * 6, eyeTarget.y + .21, eyeTarget.z + headingZ * 6);
      camera.fov = 71;
      scene.fog.density = .057;
    } else {
      const x = koi.position.x * .64, z = koi.position.z * .64;
      eyeTarget.set(x + 2.5, camera.aspect < 1 ? 16.8 : 14.7, z + 7.6);
      lookTarget.set(x, -1, z);
      camera.fov = 48;
      scene.fog.density = .024;
    }
    const blend = snap ? 1 : 1 - Math.exp(-dt * (view === 'koi' ? 5.5 : 2.5));
    eye.lerp(eyeTarget, blend);
    look.lerp(lookTarget, blend);
    camera.position.copy(eye);
    camera.lookAt(look);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    renderer.render(scene, camera);
  }

  function resize() {
    if (!mounted) return;
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6, Math.sqrt(1_250_000 / (width * height))));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    draw(0, true);
  }

  function tick(timestamp) {
    if (stopped) return;
    const dt = previous ? Math.min((timestamp - previous) / 1000, .06) : 0;
    previous = timestamp;
    clock.value += dt;
    moveFish(dt);
    draw(dt);
    frame = requestAnimationFrame(tick);
  }

  function guide(x, z, signal) {
    target.set(clamp(x, -bank, bank), -1, clamp(z, -bank, bank));
    aimExpires = clock.value + 4.3;
    if (signal) {
      ripple.position.set(target.x, .018, target.z);
      rippleAge = 0;
    }
    if (stopped) {
      const dx = target.x - koi.position.x, dz = target.z - koi.position.z;
      if (Math.hypot(dx, dz) > .08) koi.rotation.y = Math.atan2(dx, dz);
      koi.position.lerp(target, .64);
      moveFish(0);
      draw(0, true);
    }
  }

  return {
    mount() {
      mounted = true;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.append(renderer.domElement);
      observer.observe(host);
      moveFish(0);
      resize();
    },
    selectView(next) {
      view = next;
      submerged.value = Number(next === 'koi');
      koi.visible = next === 'surface';
      ripple.visible = false;
      draw(0, true);
    },
    pause(value) {
      if (stopped === value) return;
      stopped = value;
      previous = 0;
      cancelAnimationFrame(frame);
      if (!stopped) frame = requestAnimationFrame(tick);
    },
    pointer(event, signal) {
      const box = host.getBoundingClientRect();
      ndc.set((event.clientX - box.left) / box.width * 2 - 1, 1 - (event.clientY - box.top) / box.height * 2);
      ray.setFromCamera(ndc, camera);
      const intersection = ray.ray.intersectPlane(steeringPlane, new T.Vector3());
      if (!intersection) return false;
      guide(intersection.x, intersection.z, signal);
      return true;
    },
    keyboard(dx, dz) {
      guide(koi.position.x + dx * keyboardStep, koi.position.z + dz * keyboardStep, true);
    },
    dispose() {
      stopped = true;
      mounted = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.remove();
      const resources = new Set();
      scene.traverse(object => {
        if (object.geometry) resources.add(object.geometry);
        if (object.material) resources.add(object.material);
        if (object.isInstancedMesh) resources.add(object);
      });
      for (const resource of resources) resource.dispose();
      renderer.dispose();
    },
  };
}
