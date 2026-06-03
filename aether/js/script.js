/* ============================================
   AETHER STUDIO - Complete JavaScript
   ============================================ */

// ============================================
// 1. PARTICLE NETWORK SYSTEM
// ============================================
class ParticleNetwork {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 120 };
    this.animationFrame = null;
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 10000), 100);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    const style = getComputedStyle(document.documentElement);
    const particleColor = style.getPropertyValue('--particle-color').trim() || 'rgba(124, 92, 252, 0.3)';
    const lineColor = style.getPropertyValue('--particle-line').trim() || 'rgba(124, 92, 252, 0.1)';

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        const angle = Math.atan2(dy, dx);
        p.x -= Math.cos(angle) * force * 2;
        p.y -= Math.sin(angle) * force * 2;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particleColor;
      this.ctx.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx2 = p.x - p2.x;
        const dy2 = p.y - p2.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (dist2 < 150) {
          const alpha = (1 - dist2 / 150) * 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = lineColor;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// 2. CUSTOM CURSOR
// ============================================
class CustomCursor {
  constructor() {
    this.dot = document.querySelector('.cursor-dot');
    this.ring = document.querySelector('.cursor-ring');
    if (!this.dot || !this.ring) return;
    this.pos = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    document.querySelectorAll('a, button, .btn, .filter-btn, .portfolio-item, .faq-question, .pricing-card, .service-card, .service-detailed-card, .team-card, .mission-card, .glass-card').forEach(el => {
      el.addEventListener('mouseenter', () => this.ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => this.ring.classList.remove('hover'));
    });

    this.render();
  }

  render() {
    this.pos.x += (this.mouse.x - this.pos.x) * 0.12;
    this.pos.y += (this.mouse.y - this.pos.y) * 0.12;

    this.dot.style.left = `${this.mouse.x}px`;
    this.dot.style.top = `${this.mouse.y}px`;

    this.ring.style.left = `${this.pos.x}px`;
    this.ring.style.top = `${this.pos.y}px`;

    requestAnimationFrame(() => this.render());
  }
}

// ============================================
// 3. THEME MANAGEMENT
// ============================================
class ThemeManager {
  constructor() {
    this.toggle = document.querySelector('.theme-toggle');
    if (!this.toggle) return;
    this.init();
  }

  init() {
    const saved = localStorage.getItem('aether-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    this.updateIcon();
    this.toggle.addEventListener('click', () => this.toggleTheme());
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('aether-theme', next);
    this.updateIcon();
  }

  updateIcon() {
    const theme = document.documentElement.getAttribute('data-theme');
    this.toggle.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  }
}

// ============================================
// 4. NAVIGATION
// ============================================
class Navigation {
  constructor() {
    this.header = document.querySelector('.header');
    this.hamburger = document.querySelector('.hamburger');
    this.navLinks = document.querySelector('.nav-links');
    if (!this.header) return;
    this.init();
  }

  init() {
    this.handleScroll();
    this.handleMobile();
    this.setActiveLink();
  }

  handleScroll() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.header.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  handleMobile() {
    if (!this.hamburger) return;
    this.hamburger.addEventListener('click', () => {
      this.hamburger.classList.toggle('active');
      this.navLinks.classList.toggle('open');
      document.body.style.overflow = this.navLinks.classList.contains('open') ? 'hidden' : '';
    });

    this.navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.hamburger.classList.remove('active');
        this.navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    this.navLinks.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
    });
  }
}

// ============================================
// 5. SCROLL REVEAL ANIMATIONS
// ============================================
class ScrollReveal {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    this.init();
  }

  init() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      this.observer.observe(el);
    });
  }

  refresh() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale:not(.visible)').forEach(el => {
      this.observer.observe(el);
    });
  }
}

// ============================================
// 6. COUNTER ANIMATION
// ============================================
class CounterAnimation {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    this.init();
  }

  init() {
    document.querySelectorAll('[data-counter]').forEach(el => {
      this.observer.observe(el);
    });
  }

  animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const duration = Math.min(2000, target * 10);
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(tick);
  }
}

// ============================================
// 7. SKILLS PROGRESS BARS
// ============================================
class SkillsAnimation {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.skill-bar-fill');
          if (fill) {
            const width = fill.dataset.width || '0';
            fill.style.width = width + '%';
          }
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    this.init();
  }

  init() {
    document.querySelectorAll('.skill-bar').forEach(el => {
      this.observer.observe(el);
    });
  }
}

// ============================================
// 8. PORTFOLIO FILTERING
// ============================================
class PortfolioFilter {
  constructor() {
    this.buttons = document.querySelectorAll('.filter-btn');
    this.items = document.querySelectorAll('.portfolio-item');
    if (!this.buttons.length && !this.items.length) return;
    this.init();
  }

  init() {
    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        this.buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.items.forEach(item => {
          const category = item.dataset.category;

          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.style.opacity = '0';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => { item.style.display = 'none'; }, 400);
          }
        });
      });
    });
  }
}

// ============================================
// 9. PROJECT MODAL
// ============================================
class ProjectModal {
  constructor() {
    this.overlay = document.querySelector('.modal-overlay');
    if (!this.overlay) return;
    this.closeBtn = this.overlay.querySelector('.modal-close');
    this.init();
  }

  init() {
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.addEventListener('click', () => this.open(item));
    });

    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open(item) {
    const data = {
      title: item.dataset.title || 'Project Title',
      category: item.dataset.category || 'Design',
      description: item.dataset.description || 'A stunning project crafted with passion and precision.',
      client: item.dataset.client || 'Confidential',
      year: item.dataset.year || '2026',
      tech: item.dataset.tech || 'Various'
    };

    this.overlay.querySelector('.modal-category').textContent = data.category;
    this.overlay.querySelector('.modal-title').textContent = data.title;
    this.overlay.querySelector('.modal-description').textContent = data.description;
    this.overlay.querySelector('.modal-detail-client .modal-detail-value').textContent = data.client;
    this.overlay.querySelector('.modal-detail-year .modal-detail-value').textContent = data.year;
    this.overlay.querySelector('.modal-detail-tech .modal-detail-value').textContent = data.tech;

    const bg = item.querySelector('.portfolio-item-bg');
    const imageEl = this.overlay.querySelector('.modal-image');
    if (bg) {
      imageEl.style.background = bg.style.background;
    } else {
      const gradient = item.dataset.gradient || 'linear-gradient(135deg, #7c5cfc, #a78bfa)';
      imageEl.style.background = gradient;
    }

    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================================
// 10. CONTACT FORM VALIDATION
// ============================================
class ContactForm {
  constructor() {
    this.form = document.querySelector('.contact-form');
    if (!this.form) return;
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.submit();
      }
    });

    this.form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });

    const textarea = this.form.querySelector('.form-textarea');
    if (textarea) {
      const counter = this.form.querySelector('.char-counter');
      if (counter) {
        textarea.addEventListener('input', () => {
          counter.textContent = `${textarea.value.length} / 500`;
        });
      }
    }
  }

  validateField(input) {
    const error = input.parentElement.querySelector('.form-error');
    let valid = true;

    if (input.hasAttribute('required') && !input.value.trim()) {
      if (error) { error.textContent = 'This field is required'; error.classList.add('visible'); }
      input.classList.add('error');
      input.classList.remove('success');
      valid = false;
    } else if (input.type === 'email' && input.value.trim()) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(input.value.trim())) {
        if (error) { error.textContent = 'Please enter a valid email'; error.classList.add('visible'); }
        input.classList.add('error');
        input.classList.remove('success');
        valid = false;
      } else {
        if (error) error.classList.remove('visible');
        input.classList.remove('error');
        input.classList.add('success');
      }
    } else if (input.tagName === 'TEXTAREA' && input.value.trim().length > 500) {
      if (error) { error.textContent = 'Maximum 500 characters'; error.classList.add('visible'); }
      input.classList.add('error');
      input.classList.remove('success');
      valid = false;
    } else {
      if (error) error.classList.remove('visible');
      input.classList.remove('error');
      input.classList.add('success');
    }

    return valid;
  }

  validate() {
    let valid = true;
    this.form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      if (!this.validateField(input)) {
        valid = false;
      }
    });
    return valid;
  }

  submit() {
    const btn = this.form.querySelector('.btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = 'Message Sent!';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-success');
      btn.style.background = '#22c55e';

      this.form.querySelectorAll('.form-input, .form-textarea').forEach(i => {
        i.value = '';
        i.classList.remove('success');
      });

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.add('btn-primary');
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  }
}

// ============================================
// 11. FAQ ACCORDION
// ============================================
class FAQAccordion {
  constructor() {
    this.items = document.querySelectorAll('.faq-item');
    if (!this.items.length) return;
    this.init();
  }

  init() {
    this.items.forEach(item => {
      const question = item.querySelector('.faq-question');
      question?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        this.items.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }
}

// ============================================
// 12. PAGE TRANSITION
// ============================================
class PageTransition {
  constructor() {
    this.transition = document.querySelector('.page-transition');
    if (!this.transition) return;
    this.init();
  }

  init() {
    document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"])').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('//') && href !== '#') {
        link.addEventListener('click', (e) => {
          if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          const target = link.getAttribute('href');
          this.transition.classList.add('active');
          setTimeout(() => {
            window.location.href = target;
          }, 500);
        });
      }
    });
  }
}

// ============================================
// 13. SMOOTH SCROLL
// ============================================
class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

// ============================================
// 14. TESTIMONIALS CAROUSEL
// ============================================
class TestimonialsCarousel {
  constructor() {
    this.grid = document.querySelector('.testimonials-grid');
    if (!this.grid) return;
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  new ParticleNetwork();
  new CustomCursor();
  new ThemeManager();
  new Navigation();
  new ScrollReveal();
  new CounterAnimation();
  new SkillsAnimation();
  new PortfolioFilter();
  new ProjectModal();
  new ContactForm();
  new FAQAccordion();
  new PageTransition();
  new SmoothScroll();
  new TestimonialsCarousel();

  const loader = document.querySelector('.page-transition');
  if (loader) {
    setTimeout(() => {
      loader.classList.remove('active');
    }, 200);
  }
});
