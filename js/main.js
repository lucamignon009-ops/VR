/* ============================================================
   VIRTUALFINITY — Main JavaScript
   Interactions • Animations • Forms • Canvas
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Sticky Navigation ────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── 2. Active Nav Link ──────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── 3. Mobile Menu ──────────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── 4. Scroll Reveal ────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ── 5. Counter Animations ───────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 2000;
          const start  = performance.now();

          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const value = Math.floor(ease * target);
            el.textContent = prefix + value.toLocaleString('fr-CH') + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ── 6. FAQ Accordion ────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Open clicked (unless it was already open)
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 7. Reservation / Contact Form ──────────────────────── */
  const reservationForm = document.getElementById('reservation-form');
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(reservationForm)) return;

      const btn = reservationForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';

      // Simulate API call
      setTimeout(() => {
        reservationForm.style.display = 'none';
        const success = document.getElementById('reservation-success');
        if (success) {
          success.classList.add('show');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1200);
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;

      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';

      setTimeout(() => {
        contactForm.style.display = 'none';
        const success = document.getElementById('contact-success');
        if (success) {
          success.classList.add('show');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1200);
    });
  }

  /* ── 8. Form Validation ──────────────────────────────────── */
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = 'var(--magenta)';
        input.style.boxShadow   = '0 0 0 3px var(--mag-glow)';
        if (!group.querySelector('.form-error')) {
          const err = document.createElement('span');
          err.className = 'form-error';
          err.style.cssText = 'font-size:0.8rem;color:#ff007a;margin-top:4px;display:block;';
          err.textContent = 'Ce champ est obligatoire.';
          group.appendChild(err);
        }
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        valid = false;
        input.style.borderColor = 'var(--magenta)';
        input.style.boxShadow   = '0 0 0 3px var(--mag-glow)';
        if (!group.querySelector('.form-error')) {
          const err = document.createElement('span');
          err.className = 'form-error';
          err.style.cssText = 'font-size:0.8rem;color:#ff007a;margin-top:4px;display:block;';
          err.textContent = 'Adresse e-mail invalide.';
          group.appendChild(err);
        }
      } else {
        input.style.borderColor = '';
        input.style.boxShadow   = '';
        const err = group && group.querySelector('.form-error');
        if (err) err.remove();
      }
    });
    return valid;
  }

  // Reset error on input
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function() {
      this.style.borderColor = '';
      this.style.boxShadow   = '';
      const group = this.closest('.form-group');
      const err   = group && group.querySelector('.form-error');
      if (err) err.remove();
    });
  });

  /* ── 9. Hero Canvas Particles ────────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x   = Math.random() * W;
        this.y   = Math.random() * H;
        this.vx  = (Math.random() - 0.5) * 0.3;
        this.vy  = -Math.random() * 0.5 - 0.1;
        this.size = Math.random() * 1.8 + 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5
          ? `rgba(0,229,255,${this.alpha})`
          : `rgba(123,0,255,${this.alpha})`;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 150;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life > this.maxLife || this.y < -10) this.reset();
      }
      draw() {
        ctx.save();
        const fade = this.life < 30 ? this.life / 30
                   : this.life > this.maxLife - 30 ? (this.maxLife - this.life) / 30 : 1;
        ctx.globalAlpha = fade * this.alpha;
        ctx.fillStyle   = this.color;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create particles
    for (let i = 0; i < 80; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 100) * 0.08;
            ctx.strokeStyle = 'rgba(123,0,255,0.6)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  /* ── 10. Smooth Scroll Anchors ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id  = this.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 11. Typing animation (hero) ─────────────────────────── */
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const words = ['Laser Game VR', 'Anniversaires', 'Team Building', 'Aventure'];
    let wi = 0, ci = 0, deleting = false;
    const type = () => {
      const word = words[wi];
      if (!deleting) {
        typingEl.textContent = word.substring(0, ci + 1);
        ci++;
        if (ci === word.length) {
          deleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        typingEl.textContent = word.substring(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 60 : 110);
    };
    type();
  }

  /* ── 12. Parallax on Hero ────────────────────────────────── */
  const heroOrbs = document.querySelectorAll('.hero-glow-orb');
  if (heroOrbs.length) {
    window.addEventListener('mousemove', (e) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 20;
      const my = (e.clientY / window.innerHeight - 0.5) * 20;
      heroOrbs.forEach((orb, i) => {
        const factor = i === 0 ? 1 : -0.7;
        orb.style.transform = `translate(${mx * factor}px, ${my * factor}px)`;
      });
    }, { passive: true });
  }

  /* ── 13. Tarif card hover tilt ───────────────────────────── */
  document.querySelectorAll('.tarif-card, .salle-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  /* ── 14. Progress bar on scroll (top) ────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 2000;
    height: 3px;
    background: linear-gradient(90deg, #7b00ff, #00e5ff, #ff007a);
    width: 0%; transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(0,229,255,0.5);
  `;
  document.body.prepend(progressBar);
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ── 15. Date minimum on reservation ────────────────────── */
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

});
