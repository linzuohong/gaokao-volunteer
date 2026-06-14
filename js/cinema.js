/**
 * CINEMA.JS — 电影感滚动叙事引擎
 * Lenis + GSAP ScrollTrigger + 红幕开幕 + 文字揭示
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════
  // 0. 常量 & 工具
  // ═══════════════════════════════════════════
  var EASE = 'cubic-bezier(.16,1,.3,1)';
  var lenis = null;
  var introDone = false;

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

  function wait(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  // ═══════════════════════════════════════════
  // 1. Lenis 平滑滚动
  // ═══════════════════════════════════════════
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.4,
      easing: function (t) { return 1 - Math.pow(1 - t, 3); },
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 锁滚动（开幕期间）
    lenis.stop();
    window.__lenis = lenis;
  }

  // ═══════════════════════════════════════════
  // 2. GSAP ScrollTrigger 注册
  // ═══════════════════════════════════════════
  function initScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    // 用 Lenis 的 scroll 作为 ScrollTrigger 的驱动
    ScrollTrigger.defaults({ scroller: window });
    // 修复 Lenis + ScrollTrigger 联动
    if (lenis) {
      ScrollTrigger.scrollerProxy(window, {
        scrollTop: function (value) {
          if (arguments.length) {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll || window.pageYOffset;
        },
        getBoundingClientRect: function () {
          return {
            top: 0, left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });
      lenis.on('scroll', function () { ScrollTrigger.update(); });
    }
  }

  // ═══════════════════════════════════════════
  // 3. 红幕开幕仪式
  // ═══════════════════════════════════════════
  function runIntro() {
    var intro   = qs('.m-intro');
    var lidTop  = qs('.m-intro__red-lid--top');
    var lidBot  = qs('.m-intro__red-lid--bot');
    var word    = qs('.m-intro__word');
    var countEl = qs('#introCount');
    var chromeEls = qsa('[data-fx-chrome]');

    if (!intro || !lidTop || !lidBot) return Promise.resolve();

    document.body.style.overflow = 'hidden';

    // 数字递增
    var startTime = performance.now();
    var countDuration = 900;
    function tickCount(now) {
      var p = Math.min((now - startTime) / countDuration, 1);
      var v = Math.floor(p * 100);
      if (countEl) countEl.textContent = String(v).padStart(3, '0');
      if (p < 1) requestAnimationFrame(tickCount);
    }
    requestAnimationFrame(tickCount);

    // 红幕拉开
    return new Promise(function (resolve) {
      setTimeout(function () {
        if (typeof gsap !== 'undefined') {
          gsap.to(lidTop, { yPercent: -101, duration: 0.9, ease: 'power3.inOut' });
          gsap.to(lidBot, { yPercent: 101, duration: 0.9, ease: 'power3.inOut',
            onComplete: function () {
              intro.style.display = 'none';
              document.body.style.overflow = '';
              // 显示 chrome
              chromeEls.forEach(function (el) { el.classList.add('is-on'); });
              // 启动滚动
              if (lenis) lenis.start();
              introDone = true;
              resolve();
            }
          });
        } else {
          // 无 GSAP 降级
          lidTop.style.transform = 'translateY(-101%)';
          lidBot.style.transform = 'translateY(101%)';
          setTimeout(function () {
            intro.style.display = 'none';
            document.body.style.overflow = '';
            chromeEls.forEach(function (el) { el.classList.add('is-on'); });
            if (lenis) lenis.start();
            introDone = true;
            resolve();
          }, 600);
        }
      }, 1200); // 红幕停留 1.2s 再拉开
    });
  }

  // ═══════════════════════════════════════════
  // 4. 品牌区大字动画
  // ═══════════════════════════════════════════
  function initBrandSection() {
    var brand = qs('.chap-brand');
    if (!brand) return;

    var chars = qsa('.chap-brand__ch', brand);
    var line  = qs('.chap-brand__line', brand);
    var sub   = qs('.chap-brand__sub', brand);
    var mono  = qs('.chap-brand__mono', brand);

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: brand,
        start: 'top 60%',
        end: 'bottom top',
        scrub: 0.6,
      }
    });

    // 逐字弹入
    if (chars.length) {
      tl.fromTo(chars,
        { y: 80, opacity: 0, rotateX: -20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.1, ease: EASE },
        0
      );
    }
    // 红线展开
    if (line) {
      tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: EASE }, 0.6);
    }
    // 副标题上浮
    if (sub) {
      tl.fromTo(sub, { y: '110%' }, { y: '0%', duration: 0.6, ease: EASE }, 0.7);
    }
    // mono 淡入
    if (mono) {
      tl.fromTo(mono, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: EASE }, 1.0);
    }
  }

  // ═══════════════════════════════════════════
  // 5. 滚动文字揭示（fx-hide → 可见）
  // ═══════════════════════════════════════════
  function initReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // 无 GSAP 降级：全部显示
      qsa('.fx-hide').forEach(function (el) { el.style.visibility = 'visible'; });
      return;
    }

    // 逐段扫描有 fx-hide 子元素的容器，分组做 stagger
    var sections = qsa('.chap-guide, .chap-slogan, .chap-caution, .chap-finale, .chap-estimate');
    sections.forEach(function (sec) {
      var hides = qsa('.fx-hide', sec);
      if (!hides.length) return;

      gsap.fromTo(hides,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7, stagger: 0.08, ease: EASE,
          scrollTrigger: {
            trigger: sec,
            start: 'top 75%',
            end: 'bottom top',
            toggleActions: 'play none none none',
          },
          onStart: function () {
            hides.forEach(function (el) { el.style.visibility = 'visible'; });
          }
        }
      );
    });
  }

  // ═══════════════════════════════════════════
  // 6. 跑马灯
  // ═══════════════════════════════════════════
  function initMarquee() {
    var track = qs('#marqueeTrack');
    if (!track) return;
    // CSS animation 方式：translateX 循环
    var chunk = qs('.chap-marquee__chunk', track);
    if (!chunk) return;
    var width = chunk.offsetWidth;
    var duration = width / 40; // 像素/秒

    track.style.animation = 'marqueeScroll ' + duration + 's linear infinite';

    // 注入 keyframes（如果不存在）
    if (!document.getElementById('marquee-keyframes')) {
      var style = document.createElement('style');
      style.id = 'marquee-keyframes';
      style.textContent = '@keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
      document.head.appendChild(style);
    }
  }

  // ═══════════════════════════════════════════
  // 7. 进度指示器
  // ═══════════════════════════════════════════
  function initProgress() {
    var el = qs('#progressNum');
    if (!el || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: function (self) {
        var v = Math.round(self.progress * 100);
        el.textContent = String(v).padStart(3, '0');
      }
    });
  }

  // ═══════════════════════════════════════════
  // 8. 启动
  // ═══════════════════════════════════════════
  function boot() {
    initLenis();
    initScrollTrigger();
    initBrandSection();
    initReveals();
    initMarquee();
    initProgress();

    // 开幕
    runIntro().then(function () {
      // ScrollTrigger 在开幕结束后刷新
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  }

  // DOM 就绪后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
