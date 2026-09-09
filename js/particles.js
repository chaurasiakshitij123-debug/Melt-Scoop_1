/* Melt & Scoop™ - Particles & Confetti Engine */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.colors = ['#FF5E7E', '#E5A823', '#6E9E53', '#F59E0B', '#48271F', '#FFFFFF'];
    this.activeColor = '#FF5E7E';
    this.mouseX = -1000;
    this.mouseY = -1000;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.initHeroSprinkles();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.height = this.canvas.parentElement.clientHeight;
  }

  setFlavorColor(color) {
    this.activeColor = color;
    // Spawn a burst of flavor-colored sprinkles
    for (let i = 0; i < 20; i++) {
      this.particles.push(this.createSprinkle(this.width / 2 + (Math.random() - 0.5) * 200, this.height / 2 + (Math.random() - 0.5) * 200, color));
    }
  }

  createSprinkle(x, y, color = null) {
    const isRound = Math.random() > 0.5;
    return {
      x: x !== undefined ? x : Math.random() * this.width,
      y: y !== undefined ? y : Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: Math.random() * 0.6 + 0.2,
      size: isRound ? Math.random() * 5 + 3 : Math.random() * 10 + 6,
      height: isRound ? null : Math.random() * 4 + 2.5,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.03,
      color: color || this.colors[Math.floor(Math.random() * this.colors.length)],
      isRound: isRound,
      alpha: Math.random() * 0.5 + 0.4
    };
  }

  initHeroSprinkles() {
    this.particles = [];
    for (let i = 0; i < 45; i++) {
      this.particles.push(this.createSprinkle());
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.vAngle;

      // Gentle interactive mouse repulsion
      const dx = p.x - this.mouseX;
      const dy = p.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.x += (dx / dist) * 2.5;
        p.y += (dy / dist) * 2.5;
      }

      // Wrap around bounds
      if (p.y > this.height + 20) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;

      if (p.isRound) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Oblong sprinkle shape
        this.ctx.beginPath();
        const r = p.height / 2;
        this.ctx.roundRect(-p.size / 2, -r, p.size, p.height, r);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
  }
}

// Global Confetti Burst (for purchases, box completion, and celebrations)
function triggerConfetti(originX, originY) {
  const count = 70;
  const colors = ['#FF5E7E', '#FF8CA3', '#E5A823', '#6E9E53', '#F59E0B', '#3D231D', '#FFEBF0'];
  const confettiPieces = [];

  const startX = originX || window.innerWidth / 2;
  const startY = originY || window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.width = (Math.random() * 8 + 6) + 'px';
    el.style.height = (Math.random() * 12 + 8) + 'px';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > 0.4 ? '3px' : '50%';
    el.style.left = startX + 'px';
    el.style.top = startY + 'px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '10000';
    el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 14 + 6;
    confettiPieces.push({
      el: el,
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      rotX: Math.random() * 360,
      rotY: Math.random() * 360,
      vRotX: (Math.random() - 0.5) * 15,
      vRotY: (Math.random() - 0.5) * 15,
      opacity: 1
    });
  }

  let frames = 0;
  function updateConfetti() {
    frames++;
    for (let i = 0; i < confettiPieces.length; i++) {
      const p = confettiPieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // air drag
      p.rotX += p.vRotX;
      p.rotY += p.vRotY;
      if (frames > 40) p.opacity -= 0.02;

      p.el.style.transform = `translate3d(${p.x - startX}px, ${p.y - startY}px, 0) rotateX(${p.rotX}deg) rotateY(${p.rotY}deg)`;
      p.el.style.opacity = Math.max(0, p.opacity);
    }

    if (frames < 100) {
      requestAnimationFrame(updateConfetti);
    } else {
      confettiPieces.forEach(p => p.el.remove());
    }
  }

  requestAnimationFrame(updateConfetti);
}

window.ParticleEngine = ParticleEngine;
window.triggerConfetti = triggerConfetti;
