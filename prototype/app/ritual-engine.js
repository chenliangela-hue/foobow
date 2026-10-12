/**
 * Foobow Unified Ritual Engine (福宝微仪式微游戏引擎)
 * Provides tactile direct-manipulation gestures, organic Web Audio synthesis,
 * canvas smoke/particle simulation, inertia physics, presence combo state,
 * and the personal Kindness Garden.
 */
(function (global) {
  "use strict";

  // --- 1. Audio Engine (Organic synthesis with pitch & timbre micro-variations) ---
  let sharedAudioCtx = null;

  function getAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  }

  const audio = {
    getContext: getAudioContext,

    // Wooden fish "tok" with natural ±3-5% micro-pitch detuning
    playTok(options = {}) {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const timbre = options.timbre || "wood";
      // Micro-detune factor between 0.96 and 1.04
      const detune = options.detune ?? (1 + (Math.random() * 0.08 - 0.04));

      if (timbre === "bowl") {
        // Bronze singing bowl
        [520 * detune, 1040 * detune, 1560 * detune].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t);
          const initialGain = [0.4, 0.2, 0.07][idx];
          const decay = [1.7, 1.3, 0.8][idx];
          gain.gain.setValueAtTime(initialGain, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + decay + 0.05);
        });
        return;
      }

      if (timbre === "chime") {
        // Bodhi bell
        [880 * detune, 1760 * detune, 2640 * detune].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t);
          const initialGain = [0.32, 0.16, 0.05][idx];
          const decay = [1.9, 1.4, 0.9][idx];
          gain.gain.setValueAtTime(initialGain, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + decay + 0.05);
        });
        return;
      }

      // Classic Sandalwood Muyu
      // 1. Resonant hollow core
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(820 * detune, t);
      osc1.frequency.exponentialRampToValueAtTime(540 * detune, t + 0.08);
      gain1.gain.setValueAtTime(0.7, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.14);

      // 2. Warm low-mid wood body
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(360 * detune, t);
      osc2.frequency.exponentialRampToValueAtTime(270 * detune, t + 0.06);
      gain2.gain.setValueAtTime(0.38, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.11);

      // 3. Crisp mallet knock transient
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = "square";
      osc3.frequency.setValueAtTime(1600 * detune, t);
      osc3.frequency.exponentialRampToValueAtTime(450 * detune, t + 0.018);
      gain3.gain.setValueAtTime(0.28, t);
      gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(t);
      osc3.stop(t + 0.022);
    },

    // Gentle singing bowl chord for revolutions and milestones
    playSingingBowl(freq = 523.25, decay = 1.9) {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      [freq, freq * 2, freq * 3.01].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t);
        const amp = [0.28, 0.12, 0.04][idx];
        gain.gain.setValueAtTime(amp, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + decay + 0.05);
      });
    },

    // Gentle water ripple trickle
    playWaterRipple() {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.35);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    },

    // Soft ember spark ignition
    playEmberSpark() {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(2400, t + 0.08);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    },

    // Lantern lift soaring sound
    playLanternLift() {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      [329.63, 440, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + idx * 0.12);
        gain.gain.setValueAtTime(0.14, t + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.12 + 1.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.12);
        osc.stop(t + idx * 0.12 + 1.65);
      });
    }
  };

  // --- 2. Haptic Engine (Occasional & purposeful tactile feedback) ---
  const haptics = {
    tap() {
      try {
        if (navigator.vibrate) navigator.vibrate(12);
      } catch {}
    },
    strike() {
      try {
        if (navigator.vibrate) navigator.vibrate(22);
      } catch {}
    },
    milestone() {
      try {
        if (navigator.vibrate) navigator.vibrate([28, 45, 36]);
      } catch {}
    },
    holdTick() {
      try {
        if (navigator.vibrate) navigator.vibrate(8);
      } catch {}
    }
  };

  // --- 3. Particle System (Gold sparks, rising merit, and ripple waves) ---
  const particles = {
    spawnRisingGoldParticle(targetEl, text = "+1") {
      if (!targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      const p = document.createElement("div");
      p.className = "ritual-rising-particle";
      p.textContent = text;
      p.style.position = "fixed";
      p.style.left = `${rect.left + rect.width / 2 + (Math.random() * 24 - 12)}px`;
      p.style.top = `${rect.top + rect.height / 3}px`;
      p.style.pointerEvents = "none";
      p.style.zIndex = "9999";
      document.body.appendChild(p);

      window.requestAnimationFrame(() => {
        p.classList.add("animate");
      });
      setTimeout(() => p.remove(), 1200);
    },

    spawnGoldenSparks(x, y, count = 8) {
      for (let i = 0; i < count; i++) {
        const spark = document.createElement("span");
        spark.className = "ritual-spark";
        const angle = (i / count) * 2 * Math.PI + Math.random() * 0.4;
        const dist = 35 + Math.random() * 30;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        spark.style.setProperty("--tx", `${tx}px`);
        spark.style.setProperty("--ty", `${ty}px`);
        spark.style.position = "fixed";
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.pointerEvents = "none";
        spark.style.zIndex = "9999";
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 850);
      }
    },

    spawnWaterRipple(container, x, y) {
      if (!container) return;
      const ripple = document.createElement("span");
      ripple.className = "water-ripple-wave";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      container.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1100);
    }
  };

  // --- 4. Presence State & Non-Competitive Combo Tracker ---
  const presenceState = {
    tapTimestamps: [],
    consecutiveTaps: 0,
    currentLevel: "idle", // "idle" -> "settling" (5) -> "flowing" (15) -> "stillness" (30)

    recordTap() {
      const now = Date.now();
      // Keep taps within last 12 seconds to measure rhythm
      this.tapTimestamps = this.tapTimestamps.filter((t) => now - t < 12000);
      this.tapTimestamps.push(now);
      this.consecutiveTaps += 1;

      let newLevel = "idle";
      if (this.consecutiveTaps >= 30) {
        newLevel = "stillness";
      } else if (this.consecutiveTaps >= 15) {
        newLevel = "flowing";
      } else if (this.consecutiveTaps >= 5) {
        newLevel = "settling";
      }

      const leveledUp = newLevel !== this.currentLevel && newLevel !== "idle";
      this.currentLevel = newLevel;

      return {
        level: newLevel,
        taps: this.consecutiveTaps,
        leveledUp: leveledUp
      };
    },

    reset() {
      this.consecutiveTaps = 0;
      this.currentLevel = "idle";
      this.tapTimestamps = [];
    }
  };

  // --- 5. Kindness Garden (善行花园) Collection ---
  const garden = {
    getPlants() {
      try {
        const saved = JSON.parse(localStorage.getItem("foobow.kindnessGarden") || "[]");
        return Array.isArray(saved) ? saved : [];
      } catch {
        return [];
      }
    },

    addPlant(species) {
      const plants = this.getPlants();
      const newPlant = {
        id: `plant_${Date.now()}`,
        species: species || "lotus", // lotus, bamboo, pine, flower, tree
        grownAt: Date.now()
      };
      plants.unshift(newPlant);
      localStorage.setItem("foobow.kindnessGarden", JSON.stringify(plants.slice(0, 48)));
      return newPlant;
    }
  };

  // --- 6. Interactive Smoke Canvas Simulation ---
  class SmokeCanvas {
    constructor(canvasEl) {
      this.canvas = canvasEl;
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.particles = [];
      this.running = false;
      this.animId = null;
      this.intent = "peace"; // peace, clarity, gratitude, release
      this.pointerX = -999;
      this.pointerY = -999;
      this.pointerActive = false;

      this.resize();
      this.initEvents();
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.width = rect.width || 320;
      this.height = rect.height || 180;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      if (this.ctx) {
        this.ctx.scale(dpr, dpr);
      }
    }

    setIntent(intent) {
      this.intent = intent;
    }

    initEvents() {
      const updatePointer = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        this.pointerX = clientX - rect.left;
        this.pointerY = clientY - rect.top;
        this.pointerActive = true;
      };

      this.canvas.addEventListener("mousemove", updatePointer);
      this.canvas.addEventListener("touchmove", updatePointer, { passive: true });
      const clearPointer = () => {
        this.pointerActive = false;
        this.pointerX = -999;
        this.pointerY = -999;
      };
      this.canvas.addEventListener("mouseleave", clearPointer);
      this.canvas.addEventListener("touchend", clearPointer, { passive: true });
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.resize();
      this.loop();
    }

    stop() {
      this.running = false;
      if (this.animId) cancelAnimationFrame(this.animId);
      this.particles = [];
      if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    }

    spawn() {
      if (this.particles.length > 55) return;
      const midX = this.width / 2;
      const startY = this.height - 24;

      // Spawn properties adjusted by chosen intention
      let vx = (Math.random() - 0.5) * 0.4;
      let vy = -(0.7 + Math.random() * 0.6);
      let size = 6 + Math.random() * 6;
      let life = 1;
      let decay = 0.008 + Math.random() * 0.004;

      if (this.intent === "peace") {
        // Slow vertical soothing smoke
        vy = -(0.55 + Math.random() * 0.35);
        vx = (Math.random() - 0.5) * 0.25;
      } else if (this.intent === "clarity") {
        // Thin crisp stream
        size = 3.5 + Math.random() * 3.5;
        vx = (Math.random() - 0.5) * 0.15;
        vy = -(0.9 + Math.random() * 0.5);
      } else if (this.intent === "gratitude") {
        // Gentle expanding curves
        size = 7 + Math.random() * 7;
        vx = Math.sin(Date.now() * 0.003) * 0.6 + (Math.random() - 0.5) * 0.3;
      } else if (this.intent === "release") {
        // Horizontal drifting and dispersing
        vx = 0.8 + (Math.random() - 0.5) * 0.5;
        vy = -(0.4 + Math.random() * 0.3);
        decay = 0.014;
      }

      this.particles.push({
        x: midX + (Math.random() - 0.5) * 8,
        y: startY,
        vx,
        vy,
        size,
        life,
        decay,
        wiggleOffset: Math.random() * Math.PI * 2
      });
    }

    loop() {
      if (!this.running) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      if (Math.random() < 0.38) {
        this.spawn();
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        // Pointer deflection interaction: smoke follows and swerves around user gesture
        if (this.pointerActive) {
          const dx = p.x - this.pointerX;
          const dy = p.y - this.pointerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 45 && dist > 1) {
            const push = (45 - dist) / 45;
            p.vx += (dx / dist) * push * 0.65;
            p.vy += (dy / dist) * push * 0.65;
          }
        }

        // Natural wiggle
        p.x += p.vx + Math.sin(Date.now() * 0.002 + p.wiggleOffset) * 0.35;
        p.y += p.vy;
        p.size += 0.12;
        p.life -= p.decay;

        if (p.life <= 0 || p.y < -20 || p.x < -30 || p.x > this.width + 30) {
          this.particles.splice(i, 1);
          continue;
        }

        const alpha = Math.max(0, p.life * 0.35);
        this.ctx.beginPath();
        const radGrad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        radGrad.addColorStop(0, `rgba(235, 230, 218, ${alpha})`);
        radGrad.addColorStop(0.5, `rgba(200, 192, 175, ${alpha * 0.5})`);
        radGrad.addColorStop(1, "rgba(200, 192, 175, 0)");
        this.ctx.fillStyle = radGrad;
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.animId = requestAnimationFrame(() => this.loop());
    }
  }

  // --- Export Public Engine ---
  global.FOOBOW_RITUAL_ENGINE = {
    audio,
    haptics,
    particles,
    presence: presenceState,
    garden,
    SmokeCanvas
  };
})(window);
