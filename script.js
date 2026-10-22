// ===== CUSTOM CURSOR =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
document.addEventListener('mousemove', e => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
  cursorOutline.style.left = e.clientX + 'px';
  cursorOutline.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(2)');
document.addEventListener('mouseup', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(1)');
document.querySelectorAll('a, button, .proj-card, .a-card, .stat-box').forEach(el => {
  el.addEventListener('mouseenter', () => cursorOutline.style.transform = 'translate(-50%,-50%) scale(1.8)');
  el.addEventListener('mouseleave', () => cursorOutline.style.transform = 'translate(-50%,-50%) scale(1)');
});

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.6 ? '#7c3aed' : '#06b6d4';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== TYPED TEXT =====
const typedEl = document.querySelector('.typed-name');
const words = ['Dinila Navishan', 'a Software Engineer', 'a Web Developer', 'a Mobile Developer'];
let wIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  if (!typedEl) return;
  const current = words[wIdx];
  if (!deleting && cIdx <= current.length) {
    typedEl.textContent = current.slice(0, cIdx++);
    setTimeout(typeLoop, 90);
  } else if (!deleting && cIdx > current.length) {
    deleting = true;
    setTimeout(typeLoop, 2000);
  } else if (deleting && cIdx > 0) {
    typedEl.textContent = current.slice(0, cIdx--);
    setTimeout(typeLoop, 45);
  } else {
    deleting = false;
    wIdx = (wIdx + 1) % words.length;
    setTimeout(typeLoop, 400);
  }
}
window.addEventListener('DOMContentLoaded', () => setTimeout(typeLoop, 600));

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

// ===== ACTIVE NAV LINK =====
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector('.nav-link[href="#' + id + '"]');
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

// ===== SCROLL REVEAL =====
function addRevealClasses() {
  const targets = document.querySelectorAll(
    '.section-header, .about-image-col, .about-content, .skills-col, .proj-card, .edu-item, .contact-info-col, .contact-form-col'
  );
  targets.forEach(el => el.classList.add('reveal'));
}
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
window.addEventListener('DOMContentLoaded', () => {
  addRevealClasses();
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

// ===== SKILL BARS ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
    }
  });
}, { threshold: 0.2 });
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skills-col').forEach(col => skillObserver.observe(col));
});

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
          else el.textContent = Math.floor(current) + '+';
        }, 40);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
window.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) counterObserver.observe(aboutSection);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
