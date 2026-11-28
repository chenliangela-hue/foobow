import * as T from './vendor/three.webgpu.js';
import { cameraPosition, color, mix, mx_noise_float, positionGeometry, positionWorld, sin, smoothstep, uv, vec2, vec3 } from './vendor/three.webgpu.js';

function randomSource(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function createHabitat(scene, clock, submerged) {
  const random = randomSource(531041);
  const material = (color, options = {}) => new T.MeshStandardNodeMaterial({ color, roughness: .88, ...options });
  const floor = new T.PlaneGeometry(112, 112, 70, 70).rotateX(-Math.PI / 2);
  const height = (x, z) => -4.9 + .45 * Math.sin(x * .2) * Math.cos(z * .26) + .18 * Math.sin(z * .65 + x * .3);
  const coordinates = floor.attributes.position;
  for (let i = 0; i < coordinates.count; i++) coordinates.setY(i, height(coordinates.getX(i), coordinates.getZ(i)));
  floor.computeVertexNormals();

  const x = positionWorld.x, z = positionWorld.z;
  const shift = clock.mul(.31);
  const current = vec2(x, z).mul(.57);
  const distortion = mx_noise_float(current.mul(.46).add(shift), 2.3);
  const fold = mx_noise_float(current.add(vec2(distortion, shift.sub(distortion))), 1);
  const fold2 = mx_noise_float(current.mul(1.7).add(vec2(shift, distortion.mul(.8))), 1);
  const caustics = smoothstep(.015, .23, fold.add(fold2.mul(.29)).abs()).oneMinus()
    .mul(smoothstep(-.35, .33, fold2)).pow(2.4);
  const grain = mx_noise_float(positionWorld.mul(17), .13);
  const sediment = mx_noise_float(positionWorld.mul(.66), .7, .48);
  const mud = material(0x474b31);
  mud.colorNode = mix(color('#243630'), color('#62664a'), sediment).mul(grain.add(1));
  mud.emissiveNode = color('#9de6bf').mul(caustics.mul(.19));
  scene.add(new T.Mesh(floor, mud));

  const rock = new T.SphereGeometry(1, 26, 16);
  const pts = rock.attributes.position;
  for (let i = 0; i < pts.count; i++) {
    const x = pts.getX(i), y = pts.getY(i), z = pts.getZ(i);
    const distortion = 1 + .14 * Math.sin(x * 3 + y * 2) * Math.cos(z * 4 - y * 3) + .045 * Math.cos(x * 9 + z * 7);
    pts.setXYZ(i, x * distortion, y * distortion, z * distortion);
  }
  rock.computeVertexNormals();
  const rockMaterial = material(0xb1b699);
  const moss = smoothstep(.29, .66, sediment.add(grain.mul(.86)));
  rockMaterial.colorNode = mix(color('#253331'), color('#727545'), moss).mul(grain.add(.94));
  rockMaterial.emissiveNode = color('#84dfbc').mul(caustics.mul(.16));
  const stones = new T.InstancedMesh(rock, rockMaterial, 206);
  const transform = new T.Object3D();
  for (let i = 0; i < stones.count; i++) {
    const angle = random() * Math.PI * 2;
    const radius = i < 128 ? 9 + random() * 22 : 1.8 + random() * 14;
    const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
    const size = i < 61 ? .85 + random() * 2.05 : .08 + random() ** 2 * .92;
    transform.position.set(x, height(x, z) + size * .16, z);
    transform.rotation.set(random() * .45, angle, random() * .35);
    transform.scale.set(size * 1.55, size * .69, size);
    transform.updateMatrix();
    stones.setMatrixAt(i, transform.matrix);
  }
  scene.add(stones);

  const greenery = material(0x67924e, { side: T.DoubleSide });
  const p = positionGeometry;
  greenery.positionNode = vec3(p.x.add(sin(clock.mul(.9).add(p.y.mul(.6))).mul(p.y.mul(p.y)).mul(.055)), p.y, p.z);
  greenery.colorNode = mix(color('#173c36'), color('#95ad56'), smoothstep(0, 2.7, p.y));
  const grass = new T.PlaneGeometry(1, 1, 1, 9).translate(0, .5, 0);
  const blade = grass.attributes.position;
  for (let i = 0; i < blade.count; i++) {
    const y = blade.getY(i);
    blade.setXYZ(i, blade.getX(i) * Math.sin(Math.PI * (y * .98 + .015)) * .29 + y * y * .65, y * 2.8, y * y * .24);
  }
  grass.computeVertexNormals();
  const reeds = new T.InstancedMesh(grass, greenery, 560);
  for (let i = 0; i < reeds.count; i++) {
    const cluster = Math.floor(i / 14);
    const angle = cluster * 2.39996;
    const radius = 7.8 + (cluster % 9) * 1.64;
    const x = Math.cos(angle) * radius + random() * 2.5, z = Math.sin(angle) * radius + random() * 2.5;
    const size = .32 + random() * .85;
    transform.position.set(x, height(x, z), z);
    transform.rotation.set(0, random() * 6.28, random() * .32 - .16);
    transform.scale.set(size, size, size);
    transform.updateMatrix();
    reeds.setMatrixAt(i, transform.matrix);
  }
  scene.add(reeds);

  const leaf = new T.CircleGeometry(1, 58, .19, Math.PI * 2 - .42).rotateX(-Math.PI / 2);
  const lotusGreen = material(0x52824a, { side: T.DoubleSide });
  const leafUV = uv().sub(.5);
  const distanceFromStem = leafUV.length();
  const radialVeins = leafUV.y.atan(leafUV.x).mul(14).add(distanceFromStem.mul(5)).sin().abs().pow(17);
  lotusGreen.colorNode = mix(color('#28513a'), color('#7d9f4c'), mx_noise_float(uv().mul(8), .65, .57))
    .mul(radialVeins.mul(.18).add(.82)).mul(smoothstep(.43, .51, distanceFromStem).oneMinus().mul(.27).add(.73));
  const leaves = new T.InstancedMesh(leaf, lotusGreen, 48);
  const stemMaterial = material(0x415e39);
  const stemGeometry = new T.CylinderGeometry(.018, .044, 1, 7, 10);
  const stemPositions = stemGeometry.attributes.position;
  for (let i = 0; i < stemPositions.count; i++) {
    const t = stemPositions.getY(i) + .5;
    stemPositions.setX(i, stemPositions.getX(i) + Math.sin(Math.PI * t) * .32);
    stemPositions.setZ(i, stemPositions.getZ(i) + Math.sin(Math.PI * 2 * t) * .13);
  }
  stemGeometry.computeVertexNormals();
  const stems = new T.InstancedMesh(stemGeometry, stemMaterial, leaves.count);
  const petals = new T.InstancedMesh(new T.SphereGeometry(1, 12, 8), material(0xf8dfcc, { emissive: 0x55231a, emissiveIntensity: .25 }), 70);
  let petalIndex = 0;
  for (let i = 0; i < leaves.count; i++) {
    const angle = i * 2.39996;
    const radius = 5.8 + (i % 8) * 2.2;
    const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
    const size = .48 + random() * .72;
    transform.position.set(x, .052, z);
    transform.rotation.set(.035, angle, 0);
    transform.scale.set(size, 1, size * .81);
    transform.updateMatrix();
    leaves.setMatrixAt(i, transform.matrix);
    const ground = height(x, z);
    transform.position.set(x, ground / 2, z);
    transform.rotation.set(0, angle, 0);
    transform.scale.set(1, -ground, 1);
    transform.updateMatrix();
    stems.setMatrixAt(i, transform.matrix);
    if (i % 5 !== 0) continue;
    for (let j = 0; j < 7; j++) {
      const bearing = j * 6.28 / 7;
      transform.position.set(x + Math.cos(bearing) * .17, .14, z + Math.sin(bearing) * .17);
      transform.rotation.set(0, -bearing, .6);
      transform.scale.set(.21, .064, .105);
      transform.updateMatrix();
      petals.setMatrixAt(petalIndex++, transform.matrix);
    }
  }
  scene.add(leaves, stems, petals);

  const water = new T.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, side: T.DoubleSide, fog: false });
  const zenith = cameraPosition.sub(positionWorld).normalize().y.abs();
  const reflected = mx_noise_float(current.mul(.62).add(vec2(fold.mul(2.4), fold2.mul(.94))), .9, .49);
  const glints = caustics.mul(.28).add(smoothstep(.53, .73, reflected).mul(.49));
  const sunWindow = smoothstep(-.2, .9, mx_noise_float(current.mul(.17).add(vec2(2, 5)), 1, .31));
  const waterTone = mix(color('#123935'), color('#5d9a7d'), reflected);
  water.colorNode = mix(waterTone, color('#eff5ba'), glints.mul(sunWindow.mul(.74).add(.26)));
  const horizonFade = smoothstep(.009, .16, zenith);
  water.opacityNode = mix(glints.mul(.46).add(.063), glints.mul(.22).add(.52).mul(horizonFade), submerged);
  const surface = new T.Mesh(new T.PlaneGeometry(116, 116).rotateX(-Math.PI / 2), water);
  surface.renderOrder = 2;
  scene.add(surface);

  const beamMaterial = new T.MeshBasicNodeMaterial({
    transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending,
  });
  const beamUv = uv();
  beamMaterial.colorNode = color('#c3f6bb');
  beamMaterial.opacityNode = beamUv.x.sub(.5).abs().mul(2).oneMinus().pow(3)
    .mul(smoothstep(0, .75, beamUv.y)).mul(sin(clock.mul(.6).add(x)).mul(.04).add(.13)).mul(submerged);
  const beams = new T.InstancedMesh(new T.PlaneGeometry(1, 1), beamMaterial, 28);
  for (let i = 0; i < beams.count; i++) {
    const angle = i * 2.39996, radius = 2 + i % 9 * 2.3;
    transform.position.set(Math.cos(angle) * radius, -2.7, Math.sin(angle) * radius);
    transform.rotation.set(.13, random() * 6.28, -.44);
    transform.scale.set(.9 + random() * 2.4, 5.7, 1);
    transform.updateMatrix();
    beams.setMatrixAt(i, transform.matrix);
  }
  beams.renderOrder = 3;
  scene.add(beams);

  const motes = new T.BufferGeometry();
  const dust = [];
  for (let i = 0; i < 420; i++) dust.push((random() - .5) * 47, -.2 - random() * 4.2, (random() - .5) * 47);
  motes.setAttribute('position', new T.Float32BufferAttribute(dust, 3));
  const moteMaterial = new T.PointsNodeMaterial({ color: 0xbadbc3, size: 1.65, opacity: .48, transparent: true, depthWrite: false, sizeAttenuation: false });
  moteMaterial.positionNode = vec3(p.x.add(sin(clock.mul(.41).add(p.z)).mul(.24)), p.y.add(sin(clock.mul(.54).add(p.x)).mul(.15)), p.z);
  const suspended = new T.Points(motes, moteMaterial);
  suspended.renderOrder = 1;
  scene.add(suspended);
}
