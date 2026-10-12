/**
 * Foobow 3D Interactive Sanctuary Mini-Game Engine
 *
 * Implements real-time 3D perspective projection, dynamic water physics,
 * articulated multi-segment swimming koi kinematics, lighting, and interactive
 * good deed scenarios (East Lake Fish Release, Toronto Safe Crosswalk,
 * Amazon Sacred Tree Planting, and Kyoto Night River Lanterns).
 *
 * Zero external dependencies — 100% offline-ready, hardware-accelerated.
 */

(function () {
  "use strict";

  const SCENARIOS = {
    "east-lake": {
      id: "east-lake",
      icon: "🐟",
      name: "East Lake Sanctuary",
      nameZh: "武汉东湖 · 慈心放生池",
      coords: "30.5539° N, 114.3644° E",
      biosphere: "Freshwater aquatic wetland sanctuary",
      targetGoal: 5,
      goalLabel: "Release 5 fish into the lake",
      goalLabelZh: "放归 5 尾锦鲤入湖",
      actionName: "Release Koi",
      actionNameZh: "放归锦鲤 (+1)",
      feedActionName: "Feed Lotus Petals",
      feedActionNameZh: "投喂莲华 (+1)",
      defaultCam: { rotX: 0.44, rotY: 0, zoom: 1, dist: 280 }
    },
    "toronto-crosswalk": {
      id: "toronto-crosswalk",
      icon: "👵",
      name: "Toronto Crosswalk",
      nameZh: "多伦多 · 长者平安斑马线",
      coords: "43.6532° N, 79.3832° W",
      biosphere: "Mindful urban pedestrian corridor",
      targetGoal: 3,
      goalLabel: "Safely escort pedestrians across",
      goalLabelZh: "平安护送长者穿过马路",
      actionName: "Pedestrian Walk Chime",
      actionNameZh: "按通行信号灯",
      feedActionName: "Guide Elder Forward",
      feedActionNameZh: "温和护送前行",
      defaultCam: { rotX: 0.38, rotY: 0.2, zoom: 0.95, dist: 300 }
    },
    "amazon-grove": {
      id: "amazon-grove",
      icon: "🌱",
      name: "Amazon Rainforest Grove",
      nameZh: "亚马逊 · 共植圣树绿林",
      coords: "-3.4653° S, 62.2159° W",
      biosphere: "Tropical rainforest biosphere reserve",
      targetGoal: 4,
      goalLabel: "Plant & nourish 4 sacred trees",
      goalLabelZh: "播种培育 4 株参天圣树",
      actionName: "Plant Seed",
      actionNameZh: "播下菩提种",
      feedActionName: "Sprinkle Rain",
      feedActionNameZh: "细雨浇灌生机",
      defaultCam: { rotX: 0.46, rotY: -0.15, zoom: 1.05, dist: 290 }
    },
    "night-corridor": {
      id: "night-corridor",
      icon: "🏮",
      name: "Kyoto River Lanterns",
      nameZh: "京都 · 水灯祈福照归途",
      coords: "35.0116° N, 135.7681° E",
      biosphere: "Tranquil night river & bamboo sanctuary",
      targetGoal: 5,
      goalLabel: "Float 5 wish lanterns downriver",
      goalLabelZh: "放流 5 盏祈愿水灯",
      actionName: "Float Lantern",
      actionNameZh: "奉放莲花水灯",
      feedActionName: "Gentle Breeze",
      feedActionNameZh: "微风引渡水流",
      defaultCam: { rotX: 0.42, rotY: 0.1, zoom: 1, dist: 285 }
    }
  };

  // ---------------------------------------------------------------------------
  // Engine State
  // ---------------------------------------------------------------------------
  let canvas = null;
  let ctx = null;
  let animFrameId = null;
  let isRunning = false;
  let currentScenarioKey = "east-lake";
  let width = 640;
  let height = 480;
  let dpr = 1;

  // 3D Camera
  const camera = {
    rotX: 0.44,
    rotY: 0,
    zoom: 1,
    dist: 280,
    fov: 340,
    targetX: 0,
    targetY: 0,
    targetZ: 0
  };

  // Pointer dragging state
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  // Game Progress Counters
  const progressState = {
    "east-lake": { count: 0, score: 0, completed: false },
    "toronto-crosswalk": { count: 0, score: 0, completed: false },
    "amazon-grove": { count: 0, score: 0, completed: false },
    "night-corridor": { count: 0, score: 0, completed: false }
  };

  // Scenario 1: East Lake Entities
  let koiFishList = [];
  let lakeRipples = [];
  let foodCrumbs = [];
  let waterTime = 0;

  // Scenario 2: Toronto Crosswalk Entities
  let crosswalkCars = [];
  let elderPedestrian = { x: -140, z: 0, progress: 0, walking: false, frame: 0 };
  let trafficLight = { state: "red", timer: 0 }; // red, green, yellow
  let crosswalkShields = [];

  // Scenario 3: Amazon Rainforest Entities
  let sacredTrees = [];
  let rainDroplets = [];
  let butterflies = [];

  // Scenario 4: Kyoto Night River Entities
  let riverLanterns = [];
  let riverWaterOffset = 0;

  // Floating merit particles in 3D
  let meritParticles3D = [];

  // ---------------------------------------------------------------------------
  // 3D Math & Projection
  // ---------------------------------------------------------------------------
  function project(x, y, z) {
    // 1. Center relative to camera target
    const tx = x - camera.targetX;
    const ty = y - camera.targetY;
    const tz = z - camera.targetZ;

    // 2. Rotate around Y (yaw)
    const cosY = Math.cos(camera.rotY);
    const sinY = Math.sin(camera.rotY);
    const x1 = tx * cosY - tz * sinY;
    const z1 = tx * sinY + tz * cosY;

    // 3. Rotate around X (pitch)
    const cosX = Math.cos(camera.rotX);
    const sinX = Math.sin(camera.rotX);
    const y2 = ty * cosX - z1 * sinX;
    const z2 = ty * sinX + z1 * cosX;

    // 4. Camera distance offset along Z
    const camZ = z2 + camera.dist;

    if (camZ <= 10) {
      return { sx: 0, sy: 0, scale: 0, depth: -9999, visible: false };
    }

    const scale = (camera.fov * camera.zoom) / camZ;
    const sx = width / 2 + x1 * scale;
    const sy = height / 2 - y2 * scale;

    return {
      sx,
      sy,
      scale,
      depth: camZ,
      visible: sx >= -100 && sx <= width + 100 && sy >= -100 && sy <= height + 100
    };
  }

  // ---------------------------------------------------------------------------
  // Scenario 1: East Lake Wuhan (3D Koi & Water)
  // ---------------------------------------------------------------------------
  function initEastLake() {
    koiFishList = [];
    lakeRipples = [];
    foodCrumbs = [];

    // Pre-populate with 3 resident serene swimming koi
    spawnKoi(20, -10, 0, "kohaku", 1.1);
    spawnKoi(-40, 25, 2.2, "showa", 0.95);
    spawnKoi(50, -40, 3.8, "yamabuki", 1.25);
  }

  function spawnKoi(x, z, heading, pattern = "kohaku", size = 1.0, isReleased = false) {
    const spineSegments = [];
    for (let i = 0; i < 6; i++) {
      spineSegments.push({ x: x - i * 4 * Math.cos(heading), z: z - i * 4 * Math.sin(heading) });
    }

    koiFishList.push({
      x,
      y: 0,
      z,
      vx: Math.cos(heading) * 0.7,
      vz: Math.sin(heading) * 0.7,
      heading,
      speed: isReleased ? 1.6 : 0.85,
      targetSpeed: 0.9,
      size,
      pattern, // kohaku, showa, yamabuki
      phase: Math.random() * Math.PI * 2,
      targetX: (Math.random() - 0.5) * 160,
      targetZ: (Math.random() - 0.5) * 160,
      spine: spineSegments,
      isReleased,
      bornAt: Date.now()
    });
  }

  function addWaterRipple(x, z, maxR = 45, intensity = 1.0) {
    lakeRipples.push({
      x,
      z,
      r: 4,
      maxR,
      intensity,
      alpha: 0.85,
      speed: 1.2
    });
  }

  function updateEastLake(dt) {
    waterTime += dt;

    // Update ripples
    for (let i = lakeRipples.length - 1; i >= 0; i--) {
      const rip = lakeRipples[i];
      rip.r += rip.speed;
      rip.alpha = (1 - rip.r / rip.maxR) * rip.intensity;
      if (rip.r >= rip.maxR || rip.alpha <= 0.02) {
        lakeRipples.splice(i, 1);
      }
    }

    // Update food crumbs
    for (let i = foodCrumbs.length - 1; i >= 0; i--) {
      const crumb = foodCrumbs[i];
      crumb.y += 0.08; // sinks very gently
      crumb.life -= dt * 0.2;
      if (crumb.life <= 0) {
        foodCrumbs.splice(i, 1);
      }
    }

    // Update koi fish
    koiFishList.forEach((koi) => {
      koi.phase += dt * 6.5 * (koi.speed / 0.9);

      // Check for closest food
      let nearestFood = null;
      let minDist = 75;
      foodCrumbs.forEach((crumb) => {
        const dx = crumb.x - koi.x;
        const dz = crumb.z - koi.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < minDist) {
          minDist = dist;
          nearestFood = crumb;
        }
      });

      if (nearestFood) {
        koi.targetX = nearestFood.x;
        koi.targetZ = nearestFood.z;
        koi.speed = 1.6;
        if (minDist < 8) {
          // Eats food
          const idx = foodCrumbs.indexOf(nearestFood);
          if (idx !== -1) foodCrumbs.splice(idx, 1);
          addWaterRipple(koi.x, koi.z, 22, 0.7);
          spawnFloatingMerit3D(koi.x, 8, koi.z, "Harmony +5 · 悦纳");
          progressState["east-lake"].score += 5;
          updateHUD();
        }
      } else {
        // Normal wandering
        const dx = koi.targetX - koi.x;
        const dz = koi.targetZ - koi.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 12 || Math.random() < 0.005) {
          koi.targetX = (Math.random() - 0.5) * 180;
          koi.targetZ = (Math.random() - 0.5) * 180;
        }
        koi.speed += (koi.targetSpeed - koi.speed) * 0.05;
      }

      // Steer heading towards target
      const targetAngle = Math.atan2(koi.targetZ - koi.z, koi.targetX - koi.x);
      let angleDiff = targetAngle - koi.heading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      koi.heading += angleDiff * 0.065;

      // Forward motion
      koi.x += Math.cos(koi.heading) * koi.speed;
      koi.z += Math.sin(koi.heading) * koi.speed;

      // Keep in lake bounds
      const bound = 110;
      if (Math.abs(koi.x) > bound) {
        koi.x = Math.sign(koi.x) * bound;
        koi.targetX = -koi.x * 0.6;
      }
      if (Math.abs(koi.z) > bound) {
        koi.z = Math.sign(koi.z) * bound;
        koi.targetZ = -koi.z * 0.6;
      }

      // Update spine chain
      koi.spine[0].x = koi.x;
      koi.spine[0].z = koi.z;
      const segDist = 5.2 * koi.size;
      for (let s = 1; s < koi.spine.length; s++) {
        const prev = koi.spine[s - 1];
        const cur = koi.spine[s];
        const sDx = cur.x - prev.x;
        const sDz = cur.z - prev.z;
        const curDist = Math.sqrt(sDx * sDx + sDz * sDz) || 0.001;
        // Natural spinal sinusoidal wave
        const wiggleAngle = Math.sin(koi.phase - s * 0.65) * 0.28;
        const angle = Math.atan2(sDz, sDx) + wiggleAngle * 0.2;
        cur.x = prev.x + Math.cos(angle) * segDist;
        cur.z = prev.z + Math.sin(angle) * segDist;
      }
    });
  }

  function drawEastLake() {
    const isDark = document.body.classList.contains("dark");

    // 1. Draw 3D Water Grid Surface
    const gridSize = 14;
    const cellSize = 18;
    const half = (gridSize * cellSize) / 2;

    for (let gx = 0; gx < gridSize; gx++) {
      for (let gz = 0; gz < gridSize; gz++) {
        const x0 = -half + gx * cellSize;
        const z0 = -half + gz * cellSize;
        const x1 = x0 + cellSize;
        const z1 = z0 + cellSize;

        // Wave displacements
        const wave0 = Math.sin(x0 * 0.04 + waterTime * 1.8) * Math.cos(z0 * 0.04 + waterTime * 1.5) * 3;
        const wave1 = Math.sin(x1 * 0.04 + waterTime * 1.8) * Math.cos(z0 * 0.04 + waterTime * 1.5) * 3;
        const wave2 = Math.sin(x1 * 0.04 + waterTime * 1.8) * Math.cos(z1 * 0.04 + waterTime * 1.5) * 3;
        const wave3 = Math.sin(x0 * 0.04 + waterTime * 1.8) * Math.cos(z1 * 0.04 + waterTime * 1.5) * 3;

        const p0 = project(x0, wave0, z0);
        const p1 = project(x1, wave1, z0);
        const p2 = project(x1, wave2, z1);
        const p3 = project(x0, wave3, z1);

        if (!p0.visible && !p1.visible && !p2.visible && !p3.visible) continue;

        ctx.beginPath();
        ctx.moveTo(p0.sx, p0.sy);
        ctx.lineTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.lineTo(p3.sx, p3.sy);
        ctx.closePath();

        const specular = Math.sin((x0 + z0) * 0.06 + waterTime * 2.2);
        if (isDark) {
          ctx.fillStyle = specular > 0.65 ? "rgba(42, 140, 130, 0.45)" : "rgba(8, 48, 52, 0.45)";
          ctx.strokeStyle = "rgba(112, 214, 176, 0.12)";
        } else {
          ctx.fillStyle = specular > 0.65 ? "rgba(120, 205, 185, 0.55)" : "rgba(46, 125, 107, 0.38)";
          ctx.strokeStyle = "rgba(46, 125, 107, 0.16)";
        }
        ctx.lineWidth = 0.8;
        ctx.fill();
        ctx.stroke();
      }
    }

    // 2. Draw 3D Water Ripples
    lakeRipples.forEach((rip) => {
      const segs = 18;
      ctx.beginPath();
      for (let s = 0; s <= segs; s++) {
        const theta = (s / segs) * Math.PI * 2;
        const rx = rip.x + Math.cos(theta) * rip.r;
        const rz = rip.z + Math.sin(theta) * rip.r;
        const pt = project(rx, 1, rz);
        if (s === 0) ctx.moveTo(pt.sx, pt.sy);
        else ctx.lineTo(pt.sx, pt.sy);
      }
      ctx.strokeStyle = isDark
        ? `rgba(239, 201, 120, ${rip.alpha.toFixed(3)})`
        : `rgba(212, 175, 55, ${rip.alpha.toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    });

    // 3. Draw Floating Lotus Pads & Flowers
    const lotusPads = [
      { x: -55, z: -40, r: 18, flower: true },
      { x: 65, z: 30, r: 22, flower: true },
      { x: -20, z: 70, r: 16, flower: false },
      { x: 45, z: -60, r: 19, flower: false }
    ];

    lotusPads.forEach((pad) => {
      const center = project(pad.x, 2, pad.z);
      if (!center.visible) return;

      const padRadius = pad.r * center.scale;
      // Draw green lily pad with gentle notch
      ctx.beginPath();
      ctx.arc(center.sx, center.sy, padRadius, 0.25, Math.PI * 2 - 0.25);
      ctx.lineTo(center.sx, center.sy);
      ctx.closePath();
      ctx.fillStyle = isDark ? "#1b5e4c" : "#2d8a6e";
      ctx.strokeStyle = isDark ? "#28876c" : "#1e6852";
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Dew drop on pad
      ctx.beginPath();
      ctx.arc(center.sx + padRadius * 0.25, center.sy - padRadius * 0.2, padRadius * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.fill();

      // Blooming Lotus Flower
      if (pad.flower) {
        const flowerR = padRadius * 0.75;
        const petals = 8;
        for (let p = 0; p < petals; p++) {
          const pAngle = (p / petals) * Math.PI * 2;
          const px = center.sx + Math.cos(pAngle) * flowerR * 0.55;
          const py = center.sy + Math.sin(pAngle) * flowerR * 0.55;
          ctx.beginPath();
          ctx.arc(px, py, flowerR * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 182, 193, 0.92)";
          ctx.fill();
        }
        // Golden flower center
        ctx.beginPath();
        ctx.arc(center.sx, center.sy, flowerR * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd166";
        ctx.fill();
      }
    });

    // 4. Draw Food Crumbs
    foodCrumbs.forEach((crumb) => {
      const p = project(crumb.x, crumb.y, crumb.z);
      if (!p.visible) return;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, 3.5 * p.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd166";
      ctx.shadowColor = "#fca311";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 5. Draw 3D Articulated Swimming Koi Fish (sorted by depth)
    const sortedKoi = [...koiFishList].sort((a, b) => {
      const pa = project(a.x, 0, a.z);
      const pb = project(b.x, 0, b.z);
      return pb.depth - pa.depth;
    });

    sortedKoi.forEach((koi) => {
      draw3DKoi(koi);
    });

    // 6. Draw Shoreline Wooden Dock Planks
    drawWoodenDock();
  }

  function draw3DKoi(koi) {
    const headPt = project(koi.spine[0].x, 0, koi.spine[0].z);
    if (!headPt.visible) return;

    // Body segments width profile
    const widths = [6.8, 8.2, 7.5, 5.8, 3.8, 2.0];

    // Colors according to Nishikigoi pattern
    let bodyColor = "#fdf0d5";
    let markColor = "#e63946";
    let finColor = "rgba(255, 255, 255, 0.75)";

    if (koi.pattern === "yamabuki") {
      bodyColor = "#ffd166";
      markColor = "#f77f00";
      finColor = "rgba(255, 243, 176, 0.85)";
    } else if (koi.pattern === "showa") {
      bodyColor = "#ffffff";
      markColor = "#1a1410";
      finColor = "rgba(240, 240, 240, 0.7)";
    }

    // Connect segments to form smooth tapered fish body
    const leftPoints = [];
    const rightPoints = [];

    for (let i = 0; i < koi.spine.length; i++) {
      const cur = koi.spine[i];
      const next = koi.spine[Math.min(i + 1, koi.spine.length - 1)];
      const prev = koi.spine[Math.max(0, i - 1)];

      const angle = Math.atan2(next.z - prev.z, next.x - prev.x);
      const perp = angle + Math.PI / 2;
      const w = widths[i] * koi.size;

      const lx = cur.x + Math.cos(perp) * w;
      const lz = cur.z + Math.sin(perp) * w;
      const rx = cur.x - Math.cos(perp) * w;
      const rz = cur.z - Math.sin(perp) * w;

      leftPoints.push(project(lx, 0, lz));
      rightPoints.push(project(rx, 0, rz));
    }

    // Render Fish Body Polygon
    ctx.beginPath();
    ctx.moveTo(leftPoints[0].sx, leftPoints[0].sy);
    for (let i = 1; i < leftPoints.length; i++) {
      ctx.lineTo(leftPoints[i].sx, leftPoints[i].sy);
    }
    for (let i = rightPoints.length - 1; i >= 0; i--) {
      ctx.lineTo(rightPoints[i].sx, rightPoints[i].sy);
    }
    ctx.closePath();

    ctx.fillStyle = bodyColor;
    ctx.fill();

    // Red / Gold Pattern Marks on Back
    const markPt = project(koi.spine[1].x, 0.5, koi.spine[1].z);
    ctx.beginPath();
    ctx.arc(markPt.sx, markPt.sy, 5.2 * headPt.scale * koi.size, 0, Math.PI * 2);
    ctx.fillStyle = markColor;
    ctx.fill();

    // Round Fish Head Cap
    ctx.beginPath();
    ctx.arc(headPt.sx, headPt.sy, 6.2 * headPt.scale * koi.size, 0, Math.PI * 2);
    ctx.fillStyle = koi.pattern === "yamabuki" ? "#f6c445" : "#e63946";
    ctx.fill();

    // Tiny Eyes
    const eyeDist = 4.2 * koi.size;
    const perpHeading = koi.heading + Math.PI / 2;
    const eye1 = project(koi.x + Math.cos(perpHeading) * eyeDist, 1, koi.z + Math.sin(perpHeading) * eyeDist);
    const eye2 = project(koi.x - Math.cos(perpHeading) * eyeDist, 1, koi.z - Math.sin(perpHeading) * eyeDist);
    [eye1, eye2].forEach((ep) => {
      ctx.beginPath();
      ctx.arc(ep.sx, ep.sy, 1.4 * headPt.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#1b0805";
      ctx.fill();
    });

    // Pectoral Fins (Flapping on sides)
    const finAngle = Math.sin(koi.phase * 1.5) * 0.35;
    const fin1 = project(
      koi.spine[1].x + Math.cos(perpHeading + finAngle) * 11 * koi.size,
      0,
      koi.spine[1].z + Math.sin(perpHeading + finAngle) * 11 * koi.size
    );
    const fin2 = project(
      koi.spine[1].x - Math.cos(perpHeading - finAngle) * 11 * koi.size,
      0,
      koi.spine[1].z - Math.sin(perpHeading - finAngle) * 11 * koi.size
    );

    [fin1, fin2].forEach((fp) => {
      ctx.beginPath();
      ctx.arc(fp.sx, fp.sy, 4.5 * headPt.scale * koi.size, 0, Math.PI * 2);
      ctx.fillStyle = finColor;
      ctx.fill();
    });

    // Swaying Caudal Tail Fin
    const tailTip = koi.spine[koi.spine.length - 1];
    const tailPt = project(tailTip.x, 0, tailTip.z);
    const tailAngle = koi.heading + Math.sin(koi.phase - 3.8) * 0.6 + Math.PI;
    const finTip1 = project(
      tailTip.x + Math.cos(tailAngle - 0.45) * 12 * koi.size,
      0,
      tailTip.z + Math.sin(tailAngle - 0.45) * 12 * koi.size
    );
    const finTip2 = project(
      tailTip.x + Math.cos(tailAngle + 0.45) * 12 * koi.size,
      0,
      tailTip.z + Math.sin(tailAngle + 0.45) * 12 * koi.size
    );

    ctx.beginPath();
    ctx.moveTo(tailPt.sx, tailPt.sy);
    ctx.lineTo(finTip1.sx, finTip1.sy);
    ctx.lineTo(tailPt.sx, tailPt.sy);
    ctx.lineTo(finTip2.sx, finTip2.sy);
    ctx.strokeStyle = markColor;
    ctx.lineWidth = 2.8 * headPt.scale * koi.size;
    ctx.stroke();

    // Golden release aura for fish freed by player
    if (koi.isReleased && Date.now() - koi.bornAt < 6000) {
      ctx.beginPath();
      ctx.arc(headPt.sx, headPt.sy, 16 * headPt.scale, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 215, 0, 0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function drawWoodenDock() {
    const isDark = document.body.classList.contains("dark");
    const dockPlanks = 6;
    for (let p = 0; p < dockPlanks; p++) {
      const z = -120 + p * 12;
      const p0 = project(-70, 8, z);
      const p1 = project(70, 8, z);
      const p2 = project(70, 8, z + 10);
      const p3 = project(-70, 8, z + 10);

      if (!p0.visible && !p1.visible) continue;

      ctx.beginPath();
      ctx.moveTo(p0.sx, p0.sy);
      ctx.lineTo(p1.sx, p1.sy);
      ctx.lineTo(p2.sx, p2.sy);
      ctx.lineTo(p3.sx, p3.sy);
      ctx.closePath();

      ctx.fillStyle = isDark ? "#4a3520" : "#8b5e34";
      ctx.strokeStyle = isDark ? "#2e2014" : "#5c3d20";
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();
    }
  }

  // ---------------------------------------------------------------------------
  // Scenario 2: Toronto Crosswalk (3D Pedestrian Street)
  // ---------------------------------------------------------------------------
  function initTorontoCrosswalk() {
    trafficLight = { state: "red", timer: 0 };
    elderPedestrian = { x: -90, z: 0, progress: 0, walking: false, frame: 0 };
    crosswalkCars = [
      { x: -160, z: -55, vx: 2.2, color: "#d90429", stopped: false },
      { x: 140, z: 55, vx: -2.0, color: "#2b2d42", stopped: false }
    ];
    crosswalkShields = [
      { x: -45, z: 0, collected: false },
      { x: 0, z: 0, collected: false },
      { x: 45, z: 0, collected: false }
    ];
  }

  function updateTorontoCrosswalk(dt) {
    trafficLight.timer += dt;
    if (trafficLight.state === "red" && trafficLight.timer > 8) {
      trafficLight.state = "green";
      trafficLight.timer = 0;
    } else if (trafficLight.state === "green" && trafficLight.timer > 7) {
      trafficLight.state = "red";
      trafficLight.timer = 0;
    }

    // Car kinematics
    crosswalkCars.forEach((car) => {
      const distToStopLine = Math.abs(car.x);
      const shouldStop = trafficLight.state === "green" && distToStopLine < 70 && distToStopLine > 15;
      car.stopped = shouldStop;

      if (!car.stopped) {
        car.x += car.vx;
        if (car.vx > 0 && car.x > 180) car.x = -180;
        if (car.vx < 0 && car.x < -180) car.x = 180;
      }
    });

    // Pedestrian escort walking
    if (elderPedestrian.walking) {
      elderPedestrian.frame += dt * 5;
      elderPedestrian.x += 0.85;

      // Collect kindness shields
      crosswalkShields.forEach((shield) => {
        if (!shield.collected && Math.abs(elderPedestrian.x - shield.x) < 14) {
          shield.collected = true;
          spawnFloatingMerit3D(shield.x, 15, 0, "Kindness Shield · 善护念");
          progressState["toronto-crosswalk"].score += 10;
          updateHUD();
        }
      });

      if (elderPedestrian.x >= 90) {
        elderPedestrian.x = 90;
        elderPedestrian.walking = false;
        progressState["toronto-crosswalk"].count += 1;
        spawnFloatingMerit3D(90, 25, 0, "Safe Crossing Achieved · 功德圆满");
        awardKarma(10, "Escorted elder safely across crosswalk");
        updateHUD();
      }
    }
  }

  function drawTorontoCrosswalk() {
    const isDark = document.body.classList.contains("dark");

    // 1. Asphalt Road Plane
    const r0 = project(-150, 0, -80);
    const r1 = project(150, 0, -80);
    const r2 = project(150, 0, 80);
    const r3 = project(-150, 0, 80);

    ctx.beginPath();
    ctx.moveTo(r0.sx, r0.sy);
    ctx.lineTo(r1.sx, r1.sy);
    ctx.lineTo(r2.sx, r2.sy);
    ctx.lineTo(r3.sx, r3.sy);
    ctx.closePath();
    ctx.fillStyle = isDark ? "#1b2028" : "#343a40";
    ctx.fill();

    // 2. White Zebra Crossing Stripes
    for (let s = -70; s <= 70; s += 20) {
      const z0 = project(s - 5, 0.5, -35);
      const z1 = project(s + 5, 0.5, -35);
      const z2 = project(s + 5, 0.5, 35);
      const z3 = project(s - 5, 0.5, 35);

      ctx.beginPath();
      ctx.moveTo(z0.sx, z0.sy);
      ctx.lineTo(z1.sx, z1.sy);
      ctx.lineTo(z2.sx, z2.sy);
      ctx.lineTo(z3.sx, z3.sy);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    // 3. Sidewalk Curbs
    [-80, 80].forEach((sz) => {
      const c0 = project(-150, 5, sz - 15);
      const c1 = project(150, 5, sz - 15);
      const c2 = project(150, 5, sz + 15);
      const c3 = project(-150, 5, sz + 15);

      ctx.beginPath();
      ctx.moveTo(c0.sx, c0.sy);
      ctx.lineTo(c1.sx, c1.sy);
      ctx.lineTo(c2.sx, c2.sy);
      ctx.lineTo(c3.sx, c3.sy);
      ctx.closePath();
      ctx.fillStyle = isDark ? "#2c3440" : "#6c757d";
      ctx.fill();
    });

    // 4. Cars in 3D
    crosswalkCars.forEach((car) => {
      const cp = project(car.x, 6, car.z);
      if (!cp.visible) return;
      const carW = 28 * cp.scale;
      const carH = 14 * cp.scale;

      ctx.fillStyle = car.color;
      ctx.fillRect(cp.sx - carW / 2, cp.sy - carH, carW, carH);

      // Windows
      ctx.fillStyle = "#e0fbfc";
      ctx.fillRect(cp.sx - carW * 0.35, cp.sy - carH * 0.9, carW * 0.7, carH * 0.45);

      // Headlights / Brake lights
      ctx.fillStyle = car.stopped ? "#ff0054" : "#ffd166";
      ctx.beginPath();
      ctx.arc(car.vx > 0 ? cp.sx + carW * 0.45 : cp.sx - carW * 0.45, cp.sy - carH * 0.3, 3 * cp.scale, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Traffic Signal Post
    const lightPost = project(60, 45, -70);
    const postBase = project(60, 0, -70);
    ctx.beginPath();
    ctx.moveTo(postBase.sx, postBase.sy);
    ctx.lineTo(lightPost.sx, lightPost.sy);
    ctx.strokeStyle = "#495057";
    ctx.lineWidth = 4 * lightPost.scale;
    ctx.stroke();

    // Traffic Signal Box
    const boxW = 12 * lightPost.scale;
    const boxH = 26 * lightPost.scale;
    ctx.fillStyle = "#111";
    ctx.fillRect(lightPost.sx - boxW / 2, lightPost.sy - boxH / 2, boxW, boxH);

    // Active Lamp Glow
    ctx.beginPath();
    ctx.arc(lightPost.sx, lightPost.sy - 5 * lightPost.scale, 4 * lightPost.scale, 0, Math.PI * 2);
    ctx.fillStyle = trafficLight.state === "red" ? "#ff0054" : "#555";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(lightPost.sx, lightPost.sy + 5 * lightPost.scale, 4 * lightPost.scale, 0, Math.PI * 2);
    ctx.fillStyle = trafficLight.state === "green" ? "#06d6a0" : "#555";
    ctx.fill();

    // 6. Walking Pedestrian (Elder + Helper)
    const elderPt = project(elderPedestrian.x, 12, elderPedestrian.z);
    if (elderPt.visible) {
      const legSwing = Math.sin(elderPedestrian.frame) * 4 * elderPt.scale;

      // Elder (Warm lavender coat & walking cane)
      ctx.beginPath();
      ctx.arc(elderPt.sx - 6 * elderPt.scale, elderPt.sy - 16 * elderPt.scale, 4.5 * elderPt.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#fed9b7";
      ctx.fill();

      ctx.fillStyle = "#9d4edd";
      ctx.fillRect(elderPt.sx - 10 * elderPt.scale, elderPt.sy - 11 * elderPt.scale, 8 * elderPt.scale, 14 * elderPt.scale);

      // Walking stick
      ctx.beginPath();
      ctx.moveTo(elderPt.sx - 12 * elderPt.scale, elderPt.sy - 3 * elderPt.scale);
      ctx.lineTo(elderPt.sx - 15 * elderPt.scale, elderPt.sy + 8 * elderPt.scale);
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 2 * elderPt.scale;
      ctx.stroke();

      // Companion Helper (Kind jade coat, holding hand)
      ctx.beginPath();
      ctx.arc(elderPt.sx + 6 * elderPt.scale, elderPt.sy - 18 * elderPt.scale, 4.5 * elderPt.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#fed9b7";
      ctx.fill();

      ctx.fillStyle = "#2a9d8f";
      ctx.fillRect(elderPt.sx + 2 * elderPt.scale, elderPt.sy - 13 * elderPt.scale, 8 * elderPt.scale, 16 * elderPt.scale);

      // Holding hands connection
      ctx.beginPath();
      ctx.moveTo(elderPt.sx - 2 * elderPt.scale, elderPt.sy - 4 * elderPt.scale);
      ctx.lineTo(elderPt.sx + 2 * elderPt.scale, elderPt.sy - 4 * elderPt.scale);
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 7. Floating Kindness Shields along crosswalk
    crosswalkShields.forEach((shield) => {
      if (shield.collected) return;
      const sp = project(shield.x, 16 + Math.sin(waterTime * 3) * 3, shield.z);
      if (!sp.visible) return;

      ctx.beginPath();
      ctx.arc(sp.sx, sp.sy, 9 * sp.scale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 209, 102, 0.35)";
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 1.8;
      ctx.fill();
      ctx.stroke();

      ctx.font = `${Math.round(10 * sp.scale)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🛡️", sp.sx, sp.sy);
    });
  }

  // ---------------------------------------------------------------------------
  // Scenario 3: Amazon Rainforest (Sacred Tree Growth)
  // ---------------------------------------------------------------------------
  function initAmazonGrove() {
    sacredTrees = [
      { x: 0, z: 0, stage: 1, height: 18, targetHeight: 55, foliageR: 24, bloom: false }
    ];
    rainDroplets = [];
    butterflies = [
      { x: -20, y: 30, z: -10, angle: 0 },
      { x: 25, y: 35, z: 15, angle: 1.8 }
    ];
  }

  function updateAmazonGrove(dt) {
    // Tree growth interpolation
    sacredTrees.forEach((tree) => {
      if (tree.height < tree.targetHeight) {
        tree.height += dt * 4;
        tree.foliageR = Math.min(38, tree.height * 0.65);
        if (tree.height >= 50 && !tree.bloom) {
          tree.bloom = true;
          progressState["amazon-grove"].count += 1;
          spawnFloatingMerit3D(tree.x, tree.height + 15, tree.z, "Sacred Tree Flourishes · 万木春生");
          awardKarma(10, "Nourished sacred rainforest tree to full bloom");
          updateHUD();
        }
      }
    });

    // Rain droplets
    for (let i = rainDroplets.length - 1; i >= 0; i--) {
      const drop = rainDroplets[i];
      drop.y -= 3.5;
      if (drop.y <= 0) {
        rainDroplets.splice(i, 1);
        addWaterRipple(drop.x, drop.z, 14, 0.4);
      }
    }

    // Fluttering butterflies
    butterflies.forEach((b) => {
      b.angle += dt * 3;
      b.x += Math.cos(b.angle) * 0.8;
      b.z += Math.sin(b.angle) * 0.8;
      b.y = 28 + Math.sin(b.angle * 2) * 6;
    });
  }

  function drawAmazonGrove() {
    const isDark = document.body.classList.contains("dark");

    // 1. Lush Mossy Mound in 3D
    const moundRadius = 85;
    const center = project(0, -2, 0);
    ctx.beginPath();
    ctx.arc(center.sx, center.sy, moundRadius * center.scale, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? "#133c2a" : "#2d6a4f";
    ctx.fill();

    // 2. Sacred Bodhi Trees in 3D
    sacredTrees.forEach((tree) => {
      const base = project(tree.x, 0, tree.z);
      const top = project(tree.x, tree.height, tree.z);
      if (!base.visible && !top.visible) return;

      // Wooden Trunk with branch forks
      ctx.beginPath();
      ctx.moveTo(base.sx - 6 * base.scale, base.sy);
      ctx.lineTo(top.sx - 3 * top.scale, top.sy);
      ctx.lineTo(top.sx + 3 * top.scale, top.sy);
      ctx.lineTo(base.sx + 6 * base.scale, base.sy);
      ctx.closePath();
      ctx.fillStyle = isDark ? "#582f0e" : "#7f4f24";
      ctx.fill();

      // Canopy Foliage Spheres
      const folR = tree.foliageR * top.scale;
      const canopyClusters = [
        { ox: 0, oy: 0, r: folR },
        { ox: -folR * 0.45, oy: folR * 0.2, r: folR * 0.75 },
        { ox: folR * 0.45, oy: folR * 0.2, r: folR * 0.75 }
      ];

      canopyClusters.forEach((c) => {
        ctx.beginPath();
        ctx.arc(top.sx + c.ox, top.sy - c.oy, c.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(45, 106, 79, 0.88)" : "rgba(82, 183, 136, 0.9)";
        ctx.fill();
      });

      // Golden Bodhi Fruits / Blossom radiance
      if (tree.bloom) {
        for (let b = 0; b < 6; b++) {
          const bAngle = (b / 6) * Math.PI * 2;
          const bx = top.sx + Math.cos(bAngle) * folR * 0.65;
          const by = top.sy - folR * 0.2 + Math.sin(bAngle) * folR * 0.45;
          ctx.beginPath();
          ctx.arc(bx, by, 3.5 * top.scale, 0, Math.PI * 2);
          ctx.fillStyle = "#ffd166";
          ctx.shadowColor = "#ffb703";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    });

    // 3. Falling Rain Droplets
    ctx.strokeStyle = "rgba(162, 210, 255, 0.75)";
    ctx.lineWidth = 1.5;
    rainDroplets.forEach((drop) => {
      const p1 = project(drop.x, drop.y, drop.z);
      const p2 = project(drop.x, drop.y - 8, drop.z);
      if (p1.visible && p2.visible) {
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.stroke();
      }
    });

    // 4. Fluttering 3D Butterflies
    butterflies.forEach((b) => {
      const bp = project(b.x, b.y, b.z);
      if (bp.visible) {
        ctx.font = `${Math.round(14 * bp.scale)}px sans-serif`;
        ctx.fillText("🦋", bp.sx, bp.sy);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Scenario 4: Kyoto Night River (Floating Wish Lanterns)
  // ---------------------------------------------------------------------------
  function initKyotoLanterns() {
    riverLanterns = [];
    spawnRiverLantern(0, -60, "Peace · 平安");
    spawnRiverLantern(25, -20, "Health · 康宁");
  }

  function spawnRiverLantern(x, z, wish = "Peace · 平安") {
    riverLanterns.push({
      x,
      y: 0,
      z,
      vz: 0.55 + Math.random() * 0.35,
      driftX: (Math.random() - 0.5) * 0.2,
      flamePhase: Math.random() * Math.PI * 2,
      wish
    });
  }

  function updateKyotoLanterns(dt) {
    riverWaterOffset += dt * 0.8;

    riverLanterns.forEach((lantern) => {
      lantern.flamePhase += dt * 8;
      lantern.z += lantern.vz;
      lantern.x += Math.sin(lantern.z * 0.05) * 0.35;

      if (lantern.z > 140) {
        lantern.z = -120;
        lantern.x = (Math.random() - 0.5) * 40;
      }
    });
  }

  function drawKyotoLanterns() {
    const isDark = document.body.classList.contains("dark");

    // 1. Winding River Water Stream in 3D
    const riverLen = 16;
    for (let r = 0; r < riverLen; r++) {
      const z0 = -130 + r * 16;
      const z1 = z0 + 16;
      const curveX0 = Math.sin((z0 + riverWaterOffset * 20) * 0.03) * 20;
      const curveX1 = Math.sin((z1 + riverWaterOffset * 20) * 0.03) * 20;

      const p0 = project(-55 + curveX0, 0, z0);
      const p1 = project(55 + curveX0, 0, z0);
      const p2 = project(55 + curveX1, 0, z1);
      const p3 = project(-55 + curveX1, 0, z1);

      if (!p0.visible && !p1.visible) continue;

      ctx.beginPath();
      ctx.moveTo(p0.sx, p0.sy);
      ctx.lineTo(p1.sx, p1.sy);
      ctx.lineTo(p2.sx, p2.sy);
      ctx.lineTo(p3.sx, p3.sy);
      ctx.closePath();

      ctx.fillStyle = isDark ? "rgba(10, 37, 56, 0.75)" : "rgba(35, 78, 102, 0.65)";
      ctx.fill();
    }

    // 2. 3D Floating Lotus Lanterns (sorted by depth)
    const sortedLanterns = [...riverLanterns].sort((a, b) => {
      const pa = project(a.x, 0, a.z);
      const pb = project(b.x, 0, b.z);
      return pb.depth - pa.depth;
    });

    sortedLanterns.forEach((lantern) => {
      const lp = project(lantern.x, 3, lantern.z);
      if (!lp.visible) return;

      const lanternR = 14 * lp.scale;

      // Radial warm light reflection on water
      const glowGrad = ctx.createRadialGradient(lp.sx, lp.sy, 2, lp.sx, lp.sy, lanternR * 2.5);
      glowGrad.addColorStop(0, "rgba(255, 183, 3, 0.55)");
      glowGrad.addColorStop(1, "rgba(255, 183, 3, 0)");
      ctx.beginPath();
      ctx.arc(lp.sx, lp.sy, lanternR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Lotus Flower Base Petals
      for (let p = 0; p < 8; p++) {
        const theta = (p / 8) * Math.PI * 2;
        const px = lp.sx + Math.cos(theta) * lanternR * 0.85;
        const py = lp.sy + Math.sin(theta) * lanternR * 0.45;
        ctx.beginPath();
        ctx.arc(px, py, lanternR * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 117, 143, 0.95)";
        ctx.fill();
      }

      // Wooden candle box
      ctx.fillStyle = "#8b5e34";
      ctx.fillRect(lp.sx - lanternR * 0.35, lp.sy - lanternR * 0.45, lanternR * 0.7, lanternR * 0.5);

      // Flickering Candle Flame
      const flicker = Math.sin(lantern.flamePhase) * 1.5;
      ctx.beginPath();
      ctx.arc(lp.sx, lp.sy - lanternR * 0.6 + flicker, 4.5 * lp.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#ffb703";
      ctx.shadowColor = "#fb8500";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Wish tag label
      ctx.font = `${Math.round(8 * lp.scale)}px sans-serif`;
      ctx.fillStyle = "#fffaf0";
      ctx.textAlign = "center";
      ctx.fillText(lantern.wish, lp.sx, lp.sy + lanternR * 0.9);
    });
  }

  // ---------------------------------------------------------------------------
  // Floating Merit 3D Particle Text
  // ---------------------------------------------------------------------------
  function spawnFloatingMerit3D(x, y, z, text) {
    meritParticles3D.push({
      x,
      y,
      z,
      text,
      alpha: 1.0,
      vy: 0.65,
      life: 1.0
    });
  }

  function updateAndDrawMerit3D(dt) {
    for (let i = meritParticles3D.length - 1; i >= 0; i--) {
      const p = meritParticles3D[i];
      p.y += p.vy;
      p.life -= dt * 0.7;
      p.alpha = Math.max(0, p.life);

      const pt = project(p.x, p.y, p.z);
      if (pt.visible) {
        ctx.font = `bold ${Math.max(11, Math.round(14 * pt.scale))}px 'Noto Serif SC', serif`;
        ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha.toFixed(3)})`;
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 4;
        ctx.fillText(p.text, pt.sx, pt.sy);
        ctx.shadowBlur = 0;
      }

      if (p.life <= 0) {
        meritParticles3D.splice(i, 1);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Audio & Merit Helpers
  // ---------------------------------------------------------------------------
  function playSound(type) {
    if (type === "water" && typeof window.playWaterSplash === "function") {
      window.playWaterSplash();
    } else if (type === "chime" && typeof window.playZenChime === "function") {
      window.playZenChime();
    } else if (type === "muyu" && typeof window.playMuyuSound === "function") {
      window.playMuyuSound();
    }
  }

  function awardKarma(points, reason) {
    if (typeof window.updateKarma === "function") {
      const btn = document.getElementById("gamePrimaryActionBtn");
      window.updateKarma(points, btn);
    }
    if (typeof window.pushActivity === "function") {
      window.pushActivity(`${reason} (+${points} karma)`);
    }
    playSound("chime");
  }

  // ---------------------------------------------------------------------------
  // Main Render Loop
  // ---------------------------------------------------------------------------
  let lastTime = 0;

  function renderLoop(time) {
    if (!isRunning) return;

    const dt = Math.min(0.1, (time - lastTime) / 1000 || 0.016);
    lastTime = time;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Update and draw according to active scenario
    if (currentScenarioKey === "east-lake") {
      updateEastLake(dt);
      drawEastLake();
    } else if (currentScenarioKey === "toronto-crosswalk") {
      updateTorontoCrosswalk(dt);
      drawTorontoCrosswalk();
    } else if (currentScenarioKey === "amazon-grove") {
      updateAmazonGrove(dt);
      drawAmazonGrove();
    } else if (currentScenarioKey === "night-corridor") {
      updateKyotoLanterns(dt);
      drawKyotoLanterns();
    }

    // Draw 3D Floating Merit Particles
    updateAndDrawMerit3D(dt);

    animFrameId = requestAnimationFrame(renderLoop);
  }

  // ---------------------------------------------------------------------------
  // Resize Handler
  // ---------------------------------------------------------------------------
  function handleResize() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  // ---------------------------------------------------------------------------
  // Scenario Switching & HUD
  // ---------------------------------------------------------------------------
  function setScenario(key) {
    if (!SCENARIOS[key]) return;
    currentScenarioKey = key;

    const scen = SCENARIOS[key];
    camera.rotX = scen.defaultCam.rotX;
    camera.rotY = scen.defaultCam.rotY;
    camera.zoom = scen.defaultCam.zoom;
    camera.dist = scen.defaultCam.dist;

    // Init entities
    if (key === "east-lake") initEastLake();
    else if (key === "toronto-crosswalk") initTorontoCrosswalk();
    else if (key === "amazon-grove") initAmazonGrove();
    else if (key === "night-corridor") initKyotoLanterns();

    updateHUD();
  }

  function updateHUD() {
    const scen = SCENARIOS[currentScenarioKey];
    const isZh = document.documentElement.lang.startsWith("zh");

    // Title & Telemetry
    const titleEl = document.getElementById("gameScenarioTitle");
    if (titleEl) titleEl.textContent = isZh ? scen.nameZh : scen.name;

    const coordsEl = document.getElementById("gameScenarioCoords");
    if (coordsEl) coordsEl.textContent = `📍 ${scen.coords} · ${scen.biosphere}`;

    // Action button labels
    const primaryBtn = document.getElementById("gamePrimaryActionBtn");
    if (primaryBtn) {
      primaryBtn.textContent = `${scen.icon} ${isZh ? scen.actionNameZh : scen.actionName}`;
    }

    const secondaryBtn = document.getElementById("gameSecondaryActionBtn");
    if (secondaryBtn) {
      secondaryBtn.textContent = isZh ? scen.feedActionNameZh : scen.feedActionName;
    }

    // Progress counter
    const prog = progressState[currentScenarioKey];
    const goalEl = document.getElementById("gameGoalCounter");
    if (goalEl) {
      goalEl.textContent = `${isZh ? scen.goalLabelZh : scen.goalLabel}: ${prog.count}/${scen.targetGoal} · 功德 +${prog.score || 0}`;
    }

    // Active pill styling
    document.querySelectorAll(".game-scenario-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.scenario === currentScenarioKey);
    });
  }

  // ---------------------------------------------------------------------------
  // Interactive Gameplay Handlers
  // ---------------------------------------------------------------------------
  function performPrimaryAction() {
    const scen = SCENARIOS[currentScenarioKey];
    const prog = progressState[currentScenarioKey];

    if (currentScenarioKey === "east-lake") {
      // Release a fish into East Lake
      const rx = (Math.random() - 0.5) * 80;
      const rz = -60 + Math.random() * 40;
      spawnKoi(rx, rz, Math.random() * Math.PI * 2, "yamabuki", 1.15, true);
      addWaterRipple(rx, rz, 55, 1.2);
      playSound("water");
      spawnFloatingMerit3D(rx, 12, rz, "Liberation · 善念放生 (+1)");

      prog.count += 1;
      prog.score += 5;
      awardKarma(2, "Released digital koi into East Lake");

      if (prog.count >= scen.targetGoal && !prog.completed) {
        prog.completed = true;
        awardKarma(10, "Completed East Lake fish release sanctuary dedication");
        spawnFloatingMerit3D(0, 30, 0, "East Lake Sanctuary Dedicated · 功德圆满");
      }
      updateHUD();
    } else if (currentScenarioKey === "toronto-crosswalk") {
      // Press walk signal
      trafficLight.state = "green";
      trafficLight.timer = 0;
      elderPedestrian.walking = true;
      playSound("muyu");
      spawnFloatingMerit3D(elderPedestrian.x, 20, 0, "Walk Signal Activated · 慈心护行");
      updateHUD();
    } else if (currentScenarioKey === "amazon-grove") {
      // Plant seed / nurture tree
      const tree = sacredTrees[0];
      if (tree) {
        tree.targetHeight = Math.min(65, tree.targetHeight + 15);
        playSound("chime");
        spawnFloatingMerit3D(tree.x, tree.height + 10, tree.z, "Tree Nurtured · 繁荣生机");
      }
      updateHUD();
    } else if (currentScenarioKey === "night-corridor") {
      // Float new wish lantern
      spawnRiverLantern((Math.random() - 0.5) * 30, -110, "Wisdom · 般若光明");
      playSound("water");
      spawnFloatingMerit3D(0, 15, -110, "Lantern Floated · 善愿通天");
      prog.count += 1;
      prog.score += 5;
      awardKarma(2, "Sent gentle wish lantern down Kyoto river");
      updateHUD();
    }
  }

  function performSecondaryAction() {
    if (currentScenarioKey === "east-lake") {
      // Feed lotus petals
      for (let f = 0; f < 3; f++) {
        foodCrumbs.push({
          x: (Math.random() - 0.5) * 100,
          y: 0,
          z: (Math.random() - 0.5) * 100,
          life: 1.0
        });
      }
      playSound("water");
      spawnFloatingMerit3D(0, 10, 0, "Fed Lotus Petals · 欢喜结缘");
    } else if (currentScenarioKey === "toronto-crosswalk") {
      // Prompt elder forward
      elderPedestrian.walking = true;
      elderPedestrian.x += 12;
      playSound("muyu");
    } else if (currentScenarioKey === "amazon-grove") {
      // Sprinkle rain drops
      for (let r = 0; r < 20; r++) {
        rainDroplets.push({
          x: (Math.random() - 0.5) * 90,
          y: 40 + Math.random() * 20,
          z: (Math.random() - 0.5) * 90
        });
      }
      playSound("water");
    } else if (currentScenarioKey === "night-corridor") {
      // Gentle wind breeze
      riverLanterns.forEach((l) => (l.vz += 0.4));
      playSound("chime");
    }
  }

  // ---------------------------------------------------------------------------
  // Modal Lifecycle & Event Bindings
  // ---------------------------------------------------------------------------
  function openGame(scenarioKey = "east-lake") {
    const dialog = document.getElementById("sanctuary3DGameModal");
    canvas = document.getElementById("sanctuary3DCanvas");
    if (!dialog || !canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "true");
    }

    handleResize();
    setScenario(scenarioKey);

    isRunning = true;
    lastTime = performance.now();
    animFrameId = requestAnimationFrame(renderLoop);
  }

  function closeGame() {
    const dialog = document.getElementById("sanctuary3DGameModal");
    if (dialog && typeof dialog.close === "function") {
      dialog.close();
    } else if (dialog) {
      dialog.removeAttribute("open");
    }
    isRunning = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
  }

  function setupBindings() {
    // Buttons to launch game
    const mapLaunchBtn = document.getElementById("launch3DGameBtn");
    if (mapLaunchBtn) {
      mapLaunchBtn.addEventListener("click", () => {
        const spotId = (window.FOOBOW_DATA && window.FOOBOW_DATA.defaultState && window.FOOBOW_DATA.defaultState.selectedSpot) || "east-lake";
        const targetScen = SCENARIOS[spotId] ? spotId : "east-lake";
        openGame(targetScen);
      });
    }

    const deedLaunchBtn = document.getElementById("open3DDeedGameBtn");
    if (deedLaunchBtn) {
      deedLaunchBtn.addEventListener("click", () => openGame("east-lake"));
    }

    // Modal Close Buttons
    const closeTopBtn = document.getElementById("close3DGameTopBtn");
    const closeBottomBtn = document.getElementById("close3DGameBottomBtn");
    if (closeTopBtn) closeTopBtn.addEventListener("click", closeGame);
    if (closeBottomBtn) closeBottomBtn.addEventListener("click", closeGame);

    // Scenario Tabs
    document.querySelectorAll(".game-scenario-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        setScenario(tab.dataset.scenario || "east-lake");
      });
    });

    // Action Buttons
    const primaryBtn = document.getElementById("gamePrimaryActionBtn");
    if (primaryBtn) primaryBtn.addEventListener("click", performPrimaryAction);

    const secondaryBtn = document.getElementById("gameSecondaryActionBtn");
    if (secondaryBtn) secondaryBtn.addEventListener("click", performSecondaryAction);

    const resetCamBtn = document.getElementById("gameResetCamBtn");
    if (resetCamBtn) {
      resetCamBtn.addEventListener("click", () => {
        const scen = SCENARIOS[currentScenarioKey];
        camera.rotX = scen.defaultCam.rotX;
        camera.rotY = scen.defaultCam.rotY;
        camera.zoom = scen.defaultCam.zoom;
        camera.dist = scen.defaultCam.dist;
      });
    }

    // Canvas Pointer Interactions (Rotating Camera & Dropping Ripples)
    if (canvas) {
      canvas.addEventListener("pointerdown", (e) => {
        isDragging = true;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      });

      window.addEventListener("pointermove", (e) => {
        if (!isDragging || !isRunning) return;
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;

        camera.rotY += dx * 0.008;
        camera.rotX = Math.max(0.15, Math.min(1.2, camera.rotX - dy * 0.008));
      });

      window.addEventListener("pointerup", () => {
        isDragging = false;
      });

      // Tap / Click on Canvas to trigger aquatic ripples or drop petals
      canvas.addEventListener("click", (e) => {
        if (!isRunning) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left - width / 2;
        const clickY = e.clientY - rect.top - height / 2;

        // Approximate inverse projection onto water plane
        const worldX = (clickX / (camera.fov * camera.zoom)) * camera.dist;
        const worldZ = (clickY / (camera.fov * camera.zoom)) * camera.dist;

        if (currentScenarioKey === "east-lake") {
          addWaterRipple(worldX, worldZ, 45, 1.0);
          foodCrumbs.push({ x: worldX, y: 0, z: worldZ, life: 1.0 });
          playSound("water");
        }
      });

      // Mouse Wheel Zoom
      canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomDelta = e.deltaY * -0.001;
        camera.zoom = Math.max(0.7, Math.min(1.6, camera.zoom + zoomDelta));
      }, { passive: false });
    }

    window.addEventListener("resize", () => {
      if (isRunning) handleResize();
    });
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      canvas = document.getElementById("sanctuary3DCanvas");
      setupBindings();
    });
  } else {
    canvas = document.getElementById("sanctuary3DCanvas");
    setupBindings();
  }

  // Public API
  window.FoobowGame3D = {
    open: openGame,
    close: closeGame,
    setScenario,
    performPrimary: performPrimaryAction,
    performSecondary: performSecondaryAction
  };
})();
