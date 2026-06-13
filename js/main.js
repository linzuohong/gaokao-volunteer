/**
 * App Entry — FX初始化 + Tab路由 + 进度指示器
 */
(function () {
  'use strict';

  // ═══ FX.init — 动效引擎 ═══
  FX.init();

  // ═══ 进度指示器 ═══
  var progressBar = document.createElement('div');
  progressBar.className = 'fx-progress';
  document.body.appendChild(progressBar);

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: function (self) {
      progressBar.style.transform = 'scaleX(' + self.progress + ')';
    }
  });

  // ═══ Tab 路由 ═══
  var tabs = document.querySelectorAll('.tab-nav__link');
  var sections = document.querySelectorAll('.section');
  var activeSection = 'interface';

  function switchTab(target) {
    if (target === activeSection) return;
    activeSection = target;

    // Update tab states
    tabs.forEach(function (t) {
      t.classList.toggle('tab-nav__link--active', t.dataset.tab === target);
    });

    // Fade swap sections
    var current = document.querySelector('.section.active');
    var next = document.getElementById('section-' + target);
    if (current === next) return;

    if (current) {
      current.style.opacity = '0';
      current.style.transform = 'translateY(12px)';
    }

    setTimeout(function () {
      if (current) {
        current.classList.remove('active');
        current.style.display = 'none';
      }
      if (next) {
        next.classList.add('active');
        next.style.display = 'block';
        next.style.opacity = '0';
        next.style.transform = 'translateY(12px)';

        requestAnimationFrame(function () {
          next.style.transition = 'opacity .4s var(--fx-ease), transform .4s var(--fx-ease)';
          next.style.opacity = '1';
          next.style.transform = 'translateY(0)';
        });

        // Stagger children
        next.querySelectorAll('.stagger-child').forEach(function (el, i) {
          el.style.animationDelay = (i * 50) + 'ms';
          el.classList.add('on');
        });

        // Init physics when switching to universities
        if (target === 'universities' && window.initUniSection) {
          setTimeout(function () { window.initUniSection(); }, 350);
        }
      }

      // Scroll to top
      if (FX.lenis) {
        FX.lenis.scrollTo(0, { duration: 0.6 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 200);

    // Update URL hash
    history.replaceState(null, null, '#' + target);
  }

  // Tab click + hover handlers
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      switchTab(tab.dataset.tab);
    });
    // Hover also switches
    tab.addEventListener('mouseenter', function () {
      switchTab(tab.dataset.tab);
    });
  });

  // ═══ Intro Sequence ═══
  var intro = new IntroSequence();

  document.getElementById('introSkip').addEventListener('click', function () {
    intro.skip();
  });

  // Init from URL hash or run intro
  var hash = window.location.hash.replace('#', '');

  FX.ready.then(function () {
    if (hash && document.getElementById('section-' + hash)) {
      // Direct entry: skip intro
      intro.skip();
      switchTab(hash);
    } else {
      // Default: run intro then show first section
      document.getElementById('section-interface').classList.add('active');
      document.getElementById('section-interface').style.display = 'block';
      intro.run();
    }
  });

  // ═══ Expose ═══
  window.switchTab = switchTab;
  window.getActiveSection = function () { return activeSection; };

})();
