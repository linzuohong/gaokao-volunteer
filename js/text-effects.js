/**
 * Intersection Observer triggers for text effects
 */
(function() {
  'use strict';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');

        // Stagger children
        const children = entry.target.querySelectorAll('.stagger-child');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('on'), i * 60);
        });

        // Trigger SVG line animations
        const lines = entry.target.querySelectorAll('.fx-line');
        lines.forEach((line, i) => {
          const len = line.getTotalLength ? line.getTotalLength() : 500;
          line.style.setProperty('--line-len', len);
          line.style.strokeDasharray = len;
          line.style.strokeDashoffset = len;
          setTimeout(() => {
            line.style.animation = `strokeDraw 1.5s var(--ease-out) ${i * 0.2}s forwards`;
          }, 100);
        });

        // Trigger count-up animations
        const counters = entry.target.querySelectorAll('.fx-counter[data-target]');
        counters.forEach(c => animateCounter(c));

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Observe all stagger containers
  document.querySelectorAll('.stagger-container').forEach(el => observer.observe(el));

  // Observe reveal elements
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Counter animation
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const duration = 1500;
    const start = performance.now();
    const isFloat = el.dataset.target.includes('.');
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
})();
