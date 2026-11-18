import * as T from './vendor/three.webgpu.js';
import { color, mix, mx_noise_float, positionGeometry, sin, smoothstep, vec3 } from './vendor/three.webgpu.js';

// Forward is local +Z. Fin roots share the body's bend so the tail stays attached.
export function buildKoi(clock, phase = 0, amber = false) {
  const group = new T.Group();
  const skin = new T.MeshStandardNodeMaterial({ roughness: .33, metalness: .08 });
  const fin = new T.MeshStandardNodeMaterial({ color: amber ? 0xeca34d : 0xffd4ac, roughness: .6, side: T.DoubleSide });
  const eye = new T.MeshStandardNodeMaterial({ color: 0x111817, roughness: .2 });
  const p = positionGeometry;
  const tailWeight = smoothstep(.08, 1.48, p.z.negate());
  const bend = sin(clock.mul(7.5).add(p.z.mul(2.9)).add(phase)).mul(tailWeight.mul(.36).add(.035));
  for (const material of [skin, fin, eye]) material.positionNode = vec3(p.x.add(bend), p.y, p.z);

  const markings = mx_noise_float(p.mul(vec3(3.2, 3.8, 2.7)).add(vec3(phase, 1.4, 4.1)), 1.8);
  const patches = smoothstep(.06, .14, markings.add(p.y.mul(.85)).add(sin(p.z.mul(5).add(phase)).mul(.23)));
  const scales = sin(p.z.mul(83).add(sin(p.x.mul(69)).mul(1.8)).add(sin(p.y.mul(73)).mul(2))).mul(.055).add(.945);
  skin.colorNode = mix(color(amber ? '#edc984' : '#fff2de'), color(amber ? '#725339' : '#e3441d'), patches).mul(scales);

  const body = new T.SphereGeometry(1, 48, 28);
  const vertices = body.attributes.position;
  for (let i = 0; i < vertices.count; i++) {
    const z = vertices.getZ(i);
    const taper = .78 + .26 * z;
    vertices.setXYZ(i, vertices.getX(i) * .43 * taper, vertices.getY(i) * .4 * taper, z * 1.3);
  }
  body.computeVertexNormals();
  group.add(new T.Mesh(body, skin));

  function addFin(points, faces) {
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(points.flat(), 3));
    geometry.setIndex(faces);
    geometry.computeVertexNormals();
    group.add(new T.Mesh(geometry, fin));
  }
  addFin([[0, 0, -1.13], [0, .42, -1.86], [0, .46, -1.99], [0, .29, -1.95], [0, .12, -1.85], [0, 0, -1.69], [0, -.14, -1.81], [0, -.34, -1.93], [0, -.27, -1.76]], [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 7, 0, 7, 8]);
  addFin([[0, .23, .4], [0, .51, .12], [0, .47, -.26], [0, .21, -.75]], [0, 1, 2, 0, 2, 3]);
  for (const side of [-1, 1]) {
    addFin([[side * .26, -.09, .54], [side * .43, -.13, .39], [side * .63, -.17, .20], [side * .71, -.19, -.02], [side * .69, -.20, -.20], [side * .58, -.22, -.24], [side * .36, -.20, -.03]], [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6]);
    const pupil = new T.SphereGeometry(.053, 12, 8);
    pupil.translate(side * .272, .094, .855);
    group.add(new T.Mesh(pupil, eye));
  }
  return group;
}
