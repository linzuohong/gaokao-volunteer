/**
 * FX — 核心动效库
 * 树成林风格简化版：GSAP ScrollTrigger + Lenis + Text Reveal + Curtain
 */
(function () {
  'use strict';

  if (window.FX) return; // 幂等

  var FX = {};
  window.FX = FX;

  FX.EASE_CSS = 'cubic-bezier(.16,1,.3,1)';
  FX.COLORS = { k: '#0a0a0a', w: '#FFFFFF', g: '#8A8A8A', r: '#C41E3A' };

  var html = document.documentElement;
  FX.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var _initDone = false;
  FX.lenis = null;

  /**
   * FX.init — 注册GSAP插件 + Lenis平滑滚动
   */
  FX.init = function (opts) {
    if (_initDone) return FX;
    _initDone = true;
    opts = opts || {};

    gsap.registerPlugin(ScrollTrigger);

    html.classList.add(FX.reduced ? 'fx-reduced' : 'fx-motion');
    html.classList.add('fx-js');

    // Lenis smooth scroll
    if (!FX.reduced && !opts.noSmooth && window.Lenis) {
      FX.lenis = new Lenis({ lerp: 0.10 });
      FX.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { FX.lenis.raf(1000 * t); });
      gsap.ticker.lagSmoothing(0);
    }

    // Font ready → refresh ScrollTrigger
    FX.ready = (document.fonts && document.fonts.ready
      ? document.fonts.ready.then(function () { ScrollTrigger.refresh(); })
      : Promise.resolve()
    );

    return FX;
  };

  /**
   * FX.split — 把元素文字拆成 <span> 原子
   * 返回 { el, words, chars, lines, lineWraps, revert }
   */
  FX.split = function (el, opts) {
    el = resolveEl(el);
    opts = opts || {};
    var doLines = opts.lines !== false;
    var doChars = !!opts.chars;

    var originalHTML = el.innerHTML;
    var text = (el.textContent || '').replace(/\s+/g, ' ').trim();

    // Walk text nodes
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim()) textNodes.push(node);
    }

    var words = [];
    var chars = [];

    textNodes.forEach(function (tn) {
      var frag = document.createDocumentFragment();
      var parts = tn.nodeValue.match(/(\s+|[⺀-鿿豈-﫿＀-￯　-〿]|[^\s⺀-鿿豈-﫿＀-￯　-〿]+)/g) || [];

      parts.forEach(function (part) {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
        } else {
          var word = document.createElement('span');
          word.className = 'fx-word';
          word.setAttribute('aria-hidden', 'true');

          if (doChars) {
            Array.from(part).forEach(function (ch) {
              var charSpan = document.createElement('span');
              charSpan.className = 'fx-char';
              charSpan.textContent = ch;
              word.appendChild(charSpan);
              chars.push(charSpan);
            });
          } else {
            word.textContent = part;
          }
          frag.appendChild(word);
          words.push(word);
        }
      });

      tn.parentNode.replaceChild(frag, tn);
    });

    // Line grouping
    var lines = [];
    var lineWraps = [];
    if (doLines && words.length) {
      var buckets = [];
      var currentBucket = null;

      words.forEach(function (w) {
        var top = 4 * Math.round(w.offsetTop / 4);
        if (currentBucket && currentBucket.parent === w.parentNode && Math.abs(currentBucket.top - top) < 4) {
          currentBucket.items.push(w);
        } else {
          currentBucket = { parent: w.parentNode, top: top, items: [w] };
          buckets.push(currentBucket);
        }
      });

      buckets.forEach(function (bucket) {
        var line = document.createElement('span');
        line.className = 'fx-line';
        var lineIn = document.createElement('span');
        lineIn.className = 'fx-line__in';
        line.appendChild(lineIn);
        bucket.parent.insertBefore(line, bucket.items[0]);

        var start = bucket.items[0];
        var end = bucket.items[bucket.items.length - 1];
        var cur = start;
        while (cur) {
          var next = cur.nextSibling;
          lineIn.appendChild(cur);
          if (cur === end) break;
          cur = next;
        }
        lineWraps.push(line);
        lines.push(lineIn);
      });
    }

    // Screen reader fallback
    if (text) {
      var sr = document.createElement('span');
      sr.className = 'fx-sr';
      sr.textContent = text;
      el.insertBefore(sr, el.firstChild);
    }

    return {
      el: el,
      words: words,
      chars: chars,
      lines: lines,
      lineWraps: lineWraps,
      revert: function () { el.innerHTML = originalHTML; }
    };
  };

  /**
   * FX.revealText — 文字入场动画
   * mode: 'rise' (行上升) | 'drop' (字掉落) | 'roll' (字滚入)
   */
  FX.revealText = function (el, opts) {
    el = resolveEl(el);
    opts = opts || {};
    var mode = opts.mode || 'rise';

    el.classList.remove('fx-hide');

    if (FX.reduced || !el) {
      return gsap.timeline();
    }

    var split = FX.split(el, { lines: true, chars: mode !== 'rise' });
    var tl = gsap.timeline({
      paused: true,
      delay: opts.delay || 0,
      onComplete: function () {
        if (opts.keep) {
          gsap.set(mode === 'rise' ? split.lines : split.chars, { clearProps: 'transform' });
        } else {
          split.revert();
        }
      }
    });

    if (mode === 'rise') {
      tl.fromTo(split.lines, { yPercent: 101 }, {
        yPercent: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: opts.stagger != null ? opts.stagger : 0.08
      });
    } else if (mode === 'drop') {
      tl.fromTo(split.chars, {
        yPercent: -140,
        rotation: function () { return gsap.utils.random(-8, 8); },
        transformOrigin: '50% 100%'
      }, {
        yPercent: 0,
        rotation: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: opts.stagger != null ? opts.stagger : 0.035
      });
    } else if (mode === 'roll') {
      tl.fromTo(split.chars, { yPercent: 220 }, {
        keyframes: { yPercent: [220, 110, 0], easeEach: 'power1.out' },
        duration: 0.55,
        ease: 'power3.out',
        stagger: { each: opts.stagger != null ? opts.stagger : 0.02, from: 'random' }
      });
    }

    // Auto-play on scroll trigger
    if (opts.trigger !== 'manual') {
      ScrollTrigger.create({
        trigger: el,
        start: opts.start || 'top 88%',
        once: true,
        onEnter: function () { tl.play(); }
      });
    }

    return tl;
  };

  /**
   * FX.curtain — 幕帘转场
   */
  FX.curtain = {
    /**
     * hard — 整屏从上方擦除
     */
    hard: function (opts) {
      opts = opts || {};
      var theme = opts.theme || 'dark';
      var hold = opts.hold != null ? opts.hold : 0.55;

      if (FX.reduced) {
        if (opts.onCover) opts.onCover();
        return gsap.timeline();
      }

      var curtain = document.createElement('div');
      curtain.className = 'fx-curtain fx-curtain--hard fx-curtain--' + theme;

      var card = makeCurtainCard(opts.num || '01', opts.title || '');
      curtain.appendChild(card);
      document.body.appendChild(curtain);

      var tl = gsap.timeline({
        onComplete: function () { curtain.remove(); }
      });

      tl.set(curtain, { autoAlpha: 1 })
        .call(function () { if (opts.onCover) opts.onCover(); })
        .fromTo(card, { autoAlpha: 0, yPercent: 40 }, {
          autoAlpha: 1, yPercent: 0, duration: 0.35, ease: 'power3.out'
        }, 0.05)
        .to(curtain, { yPercent: -101, duration: 0.15, ease: 'none' }, 0.05 + hold);

      return tl;
    },

    /**
     * eyelid — 上下两半拉开 (红幕风格)
     */
    eyelid: function (opts) {
      opts = opts || {};
      var theme = opts.theme || 'dark';
      var color = opts.color || '#C41E3A';

      if (FX.reduced) {
        if (opts.onCover) opts.onCover();
        return gsap.timeline();
      }

      var curtain = document.createElement('div');
      curtain.className = 'fx-curtain fx-curtain--eyelid fx-curtain--' + theme;

      var lidTop = document.createElement('div');
      lidTop.className = 'fx-curtain__lid fx-curtain__lid--top';
      lidTop.style.background = color;

      var lidBot = document.createElement('div');
      lidBot.className = 'fx-curtain__lid fx-curtain__lid--bot';
      lidBot.style.background = color;

      curtain.appendChild(lidTop);
      curtain.appendChild(lidBot);

      document.body.appendChild(curtain);

      var tl = gsap.timeline({
        onComplete: function () { curtain.remove(); }
      });

      tl.set(curtain, { autoAlpha: 1 })
        .call(function () { if (opts.onCover) opts.onCover(); })
        .to({}, { duration: 0.25 })
        .to(lidTop, { yPercent: -101, duration: 1.0, ease: 'power3.inOut' }, 0.25)
        .to(lidBot, { yPercent: 101, duration: 1.0, ease: 'power3.inOut' }, 0.25);

      return tl;
    }
  };

  /**
   * FX.marquee — 无限滚动跑马灯
   */
  FX.marquee = function (el, opts) {
    el = resolveEl(el);
    opts = opts || {};
    el.classList.add('fx-marquee');

    var track = document.createElement('div');
    track.className = 'fx-marquee__track';
    track.setAttribute('aria-hidden', 'true');

    var chunk = document.createElement('div');
    chunk.className = 'fx-marquee__chunk';
    if (opts.gap) chunk.style.paddingRight = opts.gap;

    while (el.firstChild) chunk.appendChild(el.firstChild);
    track.appendChild(chunk);
    el.appendChild(track);

    // Screen reader text
    var sr = document.createElement('span');
    sr.className = 'fx-sr';
    sr.textContent = (chunk.textContent || '').replace(/\s+/g, ' ').trim();
    el.appendChild(sr);

    if (FX.reduced) {
      return { timeline: null, destroy: function () {} };
    }

    // Duplicate chunks to fill
    var chunkWidth = chunk.offsetWidth || 1;
    var needed = 2 * Math.max(1, Math.ceil(el.offsetWidth / chunkWidth));
    for (var i = 1; i < needed; i++) track.appendChild(chunk.cloneNode(true));

    var speed = opts.speed || 60;
    var tl = gsap.to(track, {
      xPercent: -50,
      duration: chunkWidth * needed / 2 / speed,
      ease: 'none',
      repeat: -1
    });

    return { timeline: tl, destroy: function () { tl.kill(); } };
  };

  /**
   * FX.stagger — 子元素交错入场
   */
  FX.stagger = function (container, opts) {
    container = resolveEl(container);
    opts = opts || {};

    var children = container.querySelectorAll(opts.selector || '.stagger-child');
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y: 30 });

    ScrollTrigger.create({
      trigger: container,
      start: opts.start || 'top 85%',
      once: opts.once !== false,
      onEnter: function () {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: opts.stagger || 0.06
        });
      }
    });
  };

  // ── Helpers ──

  function resolveEl(el) {
    return typeof el === 'string' ? document.querySelector(el) : el;
  }

  function makeCurtainCard(num, title) {
    var card = document.createElement('div');
    card.className = 'fx-curtain__card';
    card.innerHTML = '<span class="fx-curtain__num">' + num +
      '</span><span class="fx-curtain__dash">—</span>' +
      '<span class="fx-curtain__title">' + title + '</span>';
    return card;
  }

})();
