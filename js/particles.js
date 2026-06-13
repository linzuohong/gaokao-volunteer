/**
 * 金属幻光银背景 — Premium metallic silver with extreme luster
 * Brushed-metal gradients, specular highlights, chrome-like reflections
 */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.shards = [];
    this.sparks = [];
    this.sweeps = [];
    this.mode = 'frozen';
    this.w = 0; this.h = 0;
    this.rAF = null;
    this.lastTime = 0;
    this.time = 0;
    this.resize();
    window.addEventListener('resize', () => this.debounceResize());
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth; this.h = window.innerHeight;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.canvas.style.width = this.w + 'px'; this.canvas.style.height = this.h + 'px';
    this.ctx.setTransform(1,0,0,1,0,0); this.ctx.scale(dpr, dpr);
    this.cx = this.w/2; this.cy = this.h/2;
  }

  debounceResize() {
    clearTimeout(this._rs); this._rs = setTimeout(() => this.resize(), 200);
  }

  init() {
    this.shards = []; this.sparks = []; this.sweeps = [];
    const s = this.w < 768 ? 0.5 : 1;

    const colors = [
      { fill:'rgba(210,210,222,A)', stroke:'rgba(245,245,252,A)', edge:'rgba(255,255,255,A)' },
      { fill:'rgba(195,195,212,A)', stroke:'rgba(235,235,245,A)', edge:'rgba(250,250,255,A)' },
      { fill:'rgba(225,225,238,A)', stroke:'rgba(252,252,255,A)', edge:'rgba(255,255,255,A)' },
      { fill:'rgba(180,185,205,A)', stroke:'rgba(220,225,240,A)', edge:'rgba(245,248,255,A)' },
    ];
    for (let i = 0; i < Math.floor(55 * s); i++) {
      const type = Math.random();
      let verts;
      if (type < 0.3) {
        const r = 8 + Math.random() * 32;
        verts = [];
        for (let j = 0; j < 6; j++) {
          const a = Math.PI/3 * j - Math.PI/6;
          verts.push({ x: Math.cos(a)*r, y: Math.sin(a)*r });
        }
      } else if (type < 0.55) {
        const w = 5 + Math.random() * 34, hh = 3 + Math.random() * 22;
        verts = [{x:0,y:-hh},{x:w,y:0},{x:0,y:hh},{x:-w,y:0}];
      } else if (type < 0.8) {
        const w = 12 + Math.random() * 120, hh = 1 + Math.random() * 6;
        verts = [{x:-w/2,y:-hh/2},{x:w/2,y:-hh/2},{x:w/2,y:hh/2},{x:-w/2,y:hh/2}];
      } else {
        const sz = 3 + Math.random() * 18;
        verts = [{x:-sz/2,y:-sz/2},{x:sz/2,y:-sz/2},{x:sz/2,y:sz/2},{x:-sz/2,y:sz/2}];
      }
      const c = colors[Math.floor(Math.random() * colors.length)];
      this.shards.push({
        verts, x: Math.random() * this.w, y: Math.random() * this.h,
        alpha: 0.05 + Math.random() * 0.15,
        vx: (Math.random() - 0.5) * 0.08, vy: (Math.random() - 0.5) * 0.06,
        rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.002,
        fill: c.fill, stroke: c.stroke, edge: c.edge,
        mirror: Math.random() < 0.18,
      });
    }

    for (let i = 0; i < Math.floor(50 * s); i++) {
      this.sparks.push({
        x: Math.random() * this.w, y: Math.random() * this.h,
        r: 0.3 + Math.random() * 2.8,
        baseA: 0.08 + Math.random() * 0.6,
        spd: 0.4 + Math.random() * 3.8, off: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.14,
      });
    }

    for (let i = 0; i < Math.floor(5 * s); i++) {
      this.sweeps.push({
        pos: Math.random(), dir: Math.random() < 0.55 ? 'h' : 'v',
        speed: 0.012 + Math.random() * 0.045,
        width: 25 + Math.random() * 90,
        alpha: 0.02 + Math.random() * 0.06,
      });
    }
  }

  setConvergence(a) { this.convergence = Math.max(0, Math.min(1, a)); }
  start() { this.mode = 'ambient'; this.init(); this.lastTime = performance.now(); this.loop(this.lastTime); }
  stop() { this.mode = 'frozen'; if (this.rAF) { cancelAnimationFrame(this.rAF); this.rAF = null; } }

  loop(now) {
    if (this.mode === 'frozen') return;
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now; this.time += dt;
    this.update(dt); this.draw();
    this.rAF = requestAnimationFrame(t => this.loop(t));
  }

  update(dt) {
    for (const p of this.shards) {
      p.x += p.vx * dt * 60; p.y += p.vy * dt * 60;
      p.rot += p.rotV * dt * 60;
      if (p.x < -100) p.x = this.w + 100; if (p.x > this.w + 100) p.x = -100;
      if (p.y < -100) p.y = this.h + 100; if (p.y > this.h + 100) p.y = -100;
    }
    for (const s of this.sparks) {
      s.x += s.vx * dt * 60; s.y += s.vy * dt * 60;
      if (s.x < -20) s.x = this.w + 20; if (s.x > this.w + 20) s.x = -20;
      if (s.y < -20) s.y = this.h + 20; if (s.y > this.h + 20) s.y = -20;
    }
    for (const sw of this.sweeps) {
      sw.pos += sw.speed * dt;
      if (sw.pos > 1.25) sw.pos = -0.25;
    }
  }

  draw() {
    const ctx = this.ctx;

    // Multi-stop brushed-metal silver gradient
    const bg = ctx.createLinearGradient(0, 0, this.w * 0.6, this.h * 0.7);
    bg.addColorStop(0, '#e2e2ee');
    bg.addColorStop(0.08, '#d8d8e6');
    bg.addColorStop(0.2, '#e8e8f2');
    bg.addColorStop(0.28, '#d0d0e0');
    bg.addColorStop(0.42, '#e4e4f0');
    bg.addColorStop(0.55, '#ccccdc');
    bg.addColorStop(0.65, '#dedeec');
    bg.addColorStop(0.78, '#d4d4e4');
    bg.addColorStop(0.9, '#e0e0ee');
    bg.addColorStop(1, '#c8c8da');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.w, this.h);

    // Large specular sheen zones
    for (let i = 0; i < 6; i++) {
      const sx = this.w * (0.08 + i * 0.18 + Math.sin(i * 1.7) * 0.06);
      const sy = this.h * (0.1 + (i % 3) * 0.32 + Math.cos(i * 2.1) * 0.08);
      const sr = 180 + Math.random() * 200;
      const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
      sg.addColorStop(0, 'rgba(255,255,255,0.09)');
      sg.addColorStop(0.3, 'rgba(252,252,255,0.04)');
      sg.addColorStop(0.7, 'rgba(240,240,248,0.012)');
      sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg;
      ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
    }

    // Shadow zones for contrast
    for (let i = 0; i < 4; i++) {
      const dx = this.w * (0.22 + i * 0.2);
      const dy = this.h * (0.15 + (i % 2) * 0.55);
      const dg = ctx.createRadialGradient(dx, dy, 30, dx, dy, 220);
      dg.addColorStop(0, 'rgba(150,155,170,0.03)');
      dg.addColorStop(1, 'transparent');
      ctx.fillStyle = dg;
      ctx.fillRect(dx - 240, dy - 240, 480, 480);
    }

    // Sweeping light bars
    for (const sw of this.sweeps) {
      ctx.save();
      if (sw.dir === 'h') {
        const sy = sw.pos * this.h;
        const grad = ctx.createLinearGradient(0, sy - sw.width/2, 0, sy + sw.width/2);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.3, `rgba(240,242,250,${sw.alpha * 0.2})`);
        grad.addColorStop(0.48, `rgba(255,255,255,${sw.alpha * 1.2})`);
        grad.addColorStop(0.52, `rgba(255,255,255,${sw.alpha * 1.2})`);
        grad.addColorStop(0.7, `rgba(235,238,248,${sw.alpha * 0.2})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, sy - sw.width/2, this.w, sw.width);
      } else {
        const sx = sw.pos * this.w;
        const grad = ctx.createLinearGradient(sx - sw.width/2, 0, sx + sw.width/2, 0);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.3, `rgba(240,242,250,${sw.alpha * 0.2})`);
        grad.addColorStop(0.48, `rgba(255,255,255,${sw.alpha * 1.2})`);
        grad.addColorStop(0.52, `rgba(255,255,255,${sw.alpha * 1.2})`);
        grad.addColorStop(0.7, `rgba(235,238,248,${sw.alpha * 0.2})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(sx - sw.width/2, 0, sw.width, this.h);
      }
      ctx.restore();
    }

    // Floating metallic shards
    for (const p of this.shards) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      let alpha = p.alpha;
      if (p.mirror) alpha = p.alpha * (0.5 + 0.5 * Math.sin(this.time * 0.6 + p.x * 0.008));
      ctx.beginPath();
      ctx.moveTo(p.verts[0].x, p.verts[0].y);
      for (let i = 1; i < p.verts.length; i++) ctx.lineTo(p.verts[i].x, p.verts[i].y);
      ctx.closePath();
      ctx.fillStyle = p.fill.replace('A', alpha);
      ctx.fill();
      ctx.strokeStyle = p.stroke.replace('A', alpha * 0.7);
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.strokeStyle = p.edge.replace('A', alpha * 1.3);
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(p.verts[0].x, p.verts[0].y);
      ctx.lineTo(p.verts[1].x, p.verts[1].y);
      ctx.stroke();
      ctx.restore();
    }

    // Sparkle dots
    for (const s of this.sparks) {
      const tw = 0.5 + 0.5 * Math.sin(this.time * s.spd + s.off);
      const a = s.baseA * (0.35 + 0.65 * tw);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248,250,255,${a})`;
      ctx.fill();
      if (s.baseA > 0.3) {
        const gl = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4.5);
        gl.addColorStop(0, `rgba(252,253,255,${a * 0.35})`);
        gl.addColorStop(1, 'transparent');
        ctx.fillStyle = gl;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2); ctx.fill();
      }
      if (s.baseA > 0.45) {
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.25})`;
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(s.x - s.r * 4, s.y); ctx.lineTo(s.x + s.r * 4, s.y);
        ctx.moveTo(s.x, s.y - s.r * 4); ctx.lineTo(s.x, s.y + s.r * 4);
        ctx.stroke();
      }
    }
  }
}
