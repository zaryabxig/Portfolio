// ── LOADING SCREEN ──
const loader = document.getElementById('loader');
const pctEl = document.getElementById('load-pct');
let pct = 0;
const tick = setInterval(() => {
  pct = Math.min(pct + Math.random() * 8 + 2, 100);
  pctEl.textContent = Math.floor(pct) + '%';
  if (pct >= 100) {
    clearInterval(tick);
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.6s';
      setTimeout(() => loader.style.display = 'none', 600);
    }, 400);
  }
}, 60);

// ── CURSOR ──
const cur = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
function animTrail() {
  tx += (mx - tx) * 0.12; ty += (my - ty) * 0.12;
  trail.style.left = tx + 'px'; trail.style.top = ty + 'px';
  requestAnimationFrame(animTrail);
}
animTrail();
document.querySelectorAll('a,button,.skill-card,.project-card,.service-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width = '24px'; cur.style.height = '24px';
    trail.style.width = '56px'; trail.style.height = '56px';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width = '12px'; cur.style.height = '12px';
    trail.style.width = '36px'; trail.style.height = '36px';
  });
});

// ── PARTICLES ──
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.r = Math.random() * 1.5 + 0.5;
    this.red = Math.random() < 0.3;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.red ? `rgba(255,59,59,${this.alpha})` : `rgba(255,255,255,${this.alpha * 0.5})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

// Mouse light
let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Connect nearby particles
  particles.forEach((p, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const dx = p.x - p2.x, dy = p.y - p2.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255,59,59,${0.06 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
    p.update(); p.draw();
  });
  requestAnimationFrame(animParticles);
}
animParticles();

// ── TYPING ANIMATION ──
const roles = [
  'Full Stack Web Developer',
  'React.js Specialist',
  'UI/UX Designer',
  'Backend Engineer',
  'Freelance Developer'
];
let ri = 0, ci = 0, deleting = false;
const typingEl = document.getElementById('typing-text');
function typeNext() {
  const role = roles[ri];
  if (!deleting) {
    typingEl.textContent = role.slice(0, ci + 1);
    ci++;
    if (ci === role.length) { deleting = true; setTimeout(typeNext, 2000); return; }
  } else {
    typingEl.textContent = role.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeNext, deleting ? 40 : 80);
}
setTimeout(typeNext, 1500);

// ── SKILLS DATA ──
const skills = [
  { name: 'HTML5', icon: '🌐', pct: 100 },
  { name: 'CSS3', icon: '🎨', pct: 100 },
  { name: 'JavaScript', icon: '⚡', pct: 99 },
  { name: 'React.js', icon: '⚛️', pct: 94 },
  { name: 'PHP', icon: '🐘', pct: 98 },
  { name: 'MySQL', icon: '🛢️', pct: 99 },
  { name: 'Node.js', icon: '🟩', pct: 90 },
  { name: 'Tailwind', icon: '💨', pct: 85 },
  { name: 'UI Design', icon: '✏️', pct: 99 },
  { name: 'Git', icon: '📦', pct: 85 },
  { name: 'REST APIs', icon: '🔌', pct: 85 },
  { name: 'WordPress', icon: '🔵', pct: 87 }
];

const sg = document.getElementById('skills-grid');
skills.forEach((s, i) => {
  sg.innerHTML += `
  <div class="skill-card reveal" style="transition-delay:${i*0.05}s">
    <span class="skill-icon">${s.icon}</span>
    <div class="skill-name">${s.name}</div>
    <div class="skill-bar-bg"><div class="skill-bar" data-pct="${s.pct}"></div></div>
    <div class="skill-pct">${s.pct}%</div>
  </div>`;
});

// ── PROJECTS DATA ──
const projects = [
  {
    icon: '🛒', title: 'E-Commerce Platform',
    desc: 'Full-stack e-commerce solution with React frontend, Node.js backend, and Stripe payment integration.',
    tags: ['React', 'Node.js', 'MySQL', 'Stripe'],
    live: '#', github: '#'
  },
  {
    icon: '📊', title: 'Analytics Dashboard',
    desc: 'Real-time data visualization dashboard with interactive charts and live data updates via WebSockets.',
    tags: ['React', 'D3.js', 'WebSocket', 'Tailwind'],
    live: '#', github: '#'
  },
  {
    icon: '💬', title: 'Chat Application',
    desc: 'Real-time messaging app with end-to-end encryption, file sharing, and group channels.',
    tags: ['React', 'Socket.io', 'MongoDB', 'JWT'],
    live: '#', github: '#'
  },
  {
    icon: '🏨', title: 'Hotel Booking System',
    desc: 'Complete hotel management system with booking engine, admin panel, and payment processing.',
    tags: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
    live: '#', github: '#'
  },
  {
    icon: '📱', title: 'Portfolio Generator',
    desc: 'AI-powered portfolio website generator that creates stunning sites from user data in minutes.',
    tags: ['React', 'OpenAI API', 'Tailwind', 'Vercel'],
    live: '#', github: '#'
  },
  {
    icon: '🎯', title: 'Task Management App',
    desc: 'Kanban-style project management tool with drag-and-drop, team collaboration, and time tracking.',
    tags: ['React', 'Redux', 'Firebase', 'TypeScript'],
    live: '#', github: '#'
  }
];

const pg = document.getElementById('projects-grid');
projects.forEach((p, i) => {
  pg.innerHTML += `
  <div class="project-card reveal" style="transition-delay:${i*0.1}s">
    <div class="project-thumb">
      <div class="project-thumb-bg"></div>
      <div class="project-thumb-glow"></div>
      <span class="project-thumb-icon">${p.icon}</span>
    </div>
    <div class="project-body">
      <div class="project-tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.desc}</div>
      <div class="project-links">
        <a href="${p.live}" class="proj-btn filled">↗ Live Demo</a>
        <a href="${p.github}" class="proj-btn">⊙ GitHub</a>
      </div>
    </div>
  </div>`;
});

// ── SERVICES DATA ──
const servs = [
  { icon: '🌐', title: 'Website Development', desc: 'Custom websites built from scratch with modern tech and clean code.', num: '01' },
  { icon: '📱', title: 'Responsive Design', desc: 'Pixel-perfect layouts that look flawless on all devices and screen sizes.', num: '02' },
  { icon: '⚛️', title: 'React Applications', desc: 'Fast, interactive SPAs and web apps using the latest React features.', num: '03' },
  { icon: '🖥️', title: 'Backend Development', desc: 'Robust APIs and server-side logic with PHP, Node.js, and MySQL.', num: '04' },
  { icon: '🎨', title: 'UI/UX Design', desc: 'Beautiful, intuitive interfaces designed with Figma and user psychology.', num: '05' },
  { icon: '⚡', title: 'Performance Optimization', desc: 'Speed up your existing site with lazy loading, caching, and code splitting.', num: '06' },
];

const sGrid = document.getElementById('services-grid');
servs.forEach((s, i) => {
  sGrid.innerHTML += `
  <div class="service-card reveal" style="transition-delay:${i*0.1}s">
    <div class="service-num">${s.num}</div>
    <div class="service-icon">${s.icon}</div>
    <div class="service-title">${s.title}</div>
    <div class="service-desc">${s.desc}</div>
  </div>`;
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars
      const bar = e.target.querySelector('.skill-bar');
      if (bar) bar.style.width = bar.dataset.pct + '%';
      // Animate counters
      const num = e.target.querySelector('.stat-num');
      if (num && !num.classList.contains('counted')) {
        num.classList.add('counted');
        const target = parseInt(num.dataset.target);
        let c = 0;
        const step = target / 40;
        const t = setInterval(() => {
          c = Math.min(c + step, target);
          num.textContent = Math.floor(c) + '+';
          if (c >= target) clearInterval(t);
        }, 40);
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .stat-card').forEach(el => observer.observe(el));

// ── CONTACT FORM ──
function handleContact(e) {
  const btn = e.target;
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#00bb55';
  btn.style.boxShadow = '0 0 30px rgba(0,187,85,0.4)';
  setTimeout(() => {
    btn.textContent = 'Send Message ⚡';
    btn.style.background = '';
    btn.style.boxShadow = '';
  }, 3000);
}

// ── NAVBAR SCROLL ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(5,5,5,0.95)';
  } else {
    nav.style.background = 'rgba(5,5,5,0.7)';
  }
});

// ── MOUSE REACTIVE HERO LIGHTING ──
document.addEventListener('mousemove', e => {
  const heroBg = document.getElementById('hero-bg');
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  heroBg.style.background = `
    radial-gradient(ellipse 60% 50% at ${x}% ${y}%, rgba(255,59,59,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at ${100-x}% ${100-y}%, rgba(255,59,59,0.04) 0%, transparent 50%)
  `;
});

// ── TILT EFFECT ON CARDS ──
document.querySelectorAll('.project-card, .skill-card, .service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
// MOBILE MENU
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

// CLOSE MENU WHEN CLICKING LINKS
document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  });
});
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !subject || !message) {
    alert("Please fill all fields.");
    return;
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  const body =
`Name: ${name}

Email: ${email}

Message:
${message}`;

  window.location.href =
`mailto:zaryabxig@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const btn = document.getElementById("submitBtn");

  btn.textContent = "✓ Ready To Send!";
  btn.style.background = "#00bb55";

  setTimeout(() => {
    btn.textContent = "Send Message ⚡";
    btn.style.background = "";
  }, 3000);

  contactForm.reset();
});