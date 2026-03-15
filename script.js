/* ====================================================
   VS SOUND TEAM — script.js
   Particles · Custom cursor · Scroll effects ·
   Counter animation · Glitch · Mobile nav
   ==================================================== */

(function () {
  'use strict';

  /* ─── CUSTOM CURSOR ─────────────────────────────── */
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    }
  });

  // Lazy trailing cursor
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    if (cursorTrail) {
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top  = trailY + 'px';
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Scale cursor on interactive elements
  document.querySelectorAll('a, button, .member-card, .about-card, .contact-card').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursor) {
        cursor.style.width  = '28px';
        cursor.style.height = '28px';
      }
      if (cursorTrail) {
        cursorTrail.style.width       = '56px';
        cursorTrail.style.height      = '56px';
        cursorTrail.style.borderColor = '#ff6fa8';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) {
        cursor.style.width  = '14px';
        cursor.style.height = '14px';
      }
      if (cursorTrail) {
        cursorTrail.style.width       = '36px';
        cursorTrail.style.height      = '36px';
        cursorTrail.style.borderColor = '';
      }
    });
  });

  // Hide on leave, show on enter
  document.addEventListener('mouseleave', () => {
    if (cursor)      cursor.style.opacity      = '0';
    if (cursorTrail) cursorTrail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursor)      cursor.style.opacity      = '1';
    if (cursorTrail) cursorTrail.style.opacity = '0.6';
  });

  /* ─── NAVBAR SCROLL ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
  }, { passive: true });

  /* ─── MOBILE NAV ────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
    });
  }

  // Close nav on link click
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
    });
  });

  /* ─── PARTICLE SYSTEM ───────────────────────────── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const PARTICLE_COUNT = Math.min(80, Math.floor((W * H) / 15000));
    const particles = [];

    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x    = Math.random() * W;
        this.y    = initial ? Math.random() * H : H + 10;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 0.6 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.6 + 0.1;
        this.hue  = Math.random() < 0.7 ? 335 : 310 + Math.random() * 50;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = '#ff2d78';
            ctx.lineWidth   = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach((p) => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    }, { passive: true });
  }

  /* ─── COUNTER ANIMATION ─────────────────────────── */
  function animateCounter(el, target, duration = 1600) {
    let start    = null;
    const suffix = el.dataset.suffix || '';
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ─── INTERSECTION OBSERVER ─────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Observe reveal elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach((el) => {
    revealObserver.observe(el);
  });

  // Mark sections for reveal
  function addRevealClasses() {
    document.querySelectorAll('.about-text p').forEach((el) => el.classList.add('reveal'));
    document.querySelectorAll('.about-card').forEach((el) => el.classList.add('reveal'));
    document.querySelectorAll('.member-card').forEach((el) => el.classList.add('reveal'));
    document.querySelectorAll('.legacy-block').forEach((el) => el.classList.add('reveal'));
    document.querySelectorAll('.contact-card').forEach((el) => el.classList.add('reveal'));
    document.querySelectorAll('.spotify-embed-wrapper').forEach((el) => el.classList.add('reveal-left'));
    document.querySelectorAll('.music-pitch').forEach((el) => el.classList.add('reveal-right'));
    document.querySelectorAll('.section-header').forEach((el) => el.classList.add('reveal'));
  }
  addRevealClasses();

  // Re-observe after adding classes
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
    revealObserver.observe(el);
  });

  // Counter observer
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.target, 10);
          if (!isNaN(target)) animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-num[data-target]').forEach((el) => {
    counterObserver.observe(el);
  });

  /* ─── ACTIVE NAV LINK HIGHLIGHT ─────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + id
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ─── TILT EFFECT ON CARDS ───────────────────────── */
  function applyTilt(cards) {
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const centerX = rect.width  / 2;
        const centerY = rect.height / 2;
        const rotateY =  ((x - centerX) / centerX) * 6;
        const rotateX = -((y - centerY) / centerY) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  applyTilt(document.querySelectorAll('.member-card, .about-card, .contact-card'));

  /* ─── SMOOTH ANCHOR SCROLL ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── RIPPLE ON BUTTONS ─────────────────────────── */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        width:10px; height:10px;
        background:rgba(255,255,255,0.4);
        left:${x - 5}px; top:${y - 5}px;
        pointer-events:none;
        animation:rippleAnim 0.6s ease forwards;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(30); opacity: 0; }
    }
    .nav-links a.active { color: #fff !important; }
    .nav-links a.active::after { width: 100% !important; }
  `;
  document.head.appendChild(style);

  /* ─── MARQUEE PAUSE ON HOVER ────────────────────── */
  const marquee = document.querySelector('.marquee');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  }

  /* ─── SPOTIFY EMBED FADE-IN ─────────────────────── */
  document.querySelectorAll('iframe').forEach((frame) => {
    frame.style.opacity = '0';
    frame.style.transition = 'opacity 0.8s ease';
    frame.addEventListener('load', () => {
      frame.style.opacity = '1';
    });
    // Fallback
    setTimeout(() => { frame.style.opacity = '1'; }, 2000);
  });

  /* ─── CONSOLE EASTER EGG ────────────────────────── */
  console.log(
    '%c🔥 VS SOUND TEAM 🔥',
    'background:linear-gradient(135deg,#ff2d78,#c0005a);color:#fff;font-size:20px;font-weight:900;padding:12px 24px;border-radius:8px;font-family:monospace;'
  );
  console.log(
    '%cMillx • Slash • GreenC • RatWithAFace • Ssammyk\nhttps://open.spotify.com/artist/38T7p9SJfo70oz05wOeBXH',
    'color:#ff6fa8;font-size:13px;font-family:monospace;'
  );

})();
