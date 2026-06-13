/**
 * Scroll effects — physics drop, parallax, sticky sections
 */
(function() {
  'use strict';

  // ═══ Physics drop on scroll for cards ═══
  const dropObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.dropDelay || 0);
        setTimeout(() => {
          el.style.animation = `cardDropIn .8s cubic-bezier(.22,.54,.26,1.1) forwards`;
          el.style.opacity = '1';
        }, delay);
        dropObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.uni-card, .strat-card, .card.stagger-child').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(60px)';
    el.dataset.dropDelay = (i % 6) * 50;
    dropObserver.observe(el);
  });

  // ═══ Parallax on scroll ═══
  const parallaxEls = document.querySelectorAll('.parallax');
  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed || 0.15);
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height/2;
      const viewCenter = window.innerHeight/2;
      const offset = (center - viewCenter) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  // ═══ Sticky scroll snap feel ═══
  // Add slight resistance when scrolling through sections
  let lastScrollY = 0;
  let ticking = false;
  const stickySections = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        // Progress bar for each section
        stickySections.forEach(section => {
          const rect = section.getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, 1 - rect.bottom / (window.innerHeight + rect.height)));
          section.style.setProperty('--scroll-progress', progress);
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ═══ Smooth scroll to anchors ═══
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ═══ Add physics drop keyframe ═══
  if (!document.getElementById('drop-keyframes')) {
    const style = document.createElement('style');
    style.id = 'drop-keyframes';
    style.textContent = `
      @keyframes cardDropIn {
        0% { opacity:0; transform:translateY(60px) scale(.92); }
        50% { opacity:.7; transform:translateY(-8px) scale(1.02); }
        70% { transform:translateY(3px) scale(.99); }
        100% { opacity:1; transform:translateY(0) scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
})();
