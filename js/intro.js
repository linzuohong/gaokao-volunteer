/**
 * IntroSequence — 红幕开场仪式
 * 风格: 树成林 eyelid curtain
 * 流程: 红幕合拢 → 中心大字弹出 → 红幕拉开 → 内容显现
 */
class IntroSequence {
  constructor() {
    this.overlay   = document.querySelector('.intro');
    this.lidTop    = document.querySelector('.intro__lid--top');
    this.lidBot    = document.querySelector('.intro__lid--bot');
    this.word      = document.querySelector('.intro__word');
    this.tag       = document.querySelector('.intro__tag');
    this.count     = document.querySelector('.intro__count');
    this.sub       = document.querySelector('.intro__sub');
    this.skipBtn   = document.querySelector('.intro__skip');
    this.tabNav    = document.querySelector('.tab-nav');
    this.appContent = document.querySelector('.app__content');
  }

  async run() {
    document.body.classList.add('no-scroll');

    // Phase 1: Word slams in immediately (0-250ms)
    this.word.classList.add('intro__word--visible');
    this.spawnSparks(40);
    this.startCountUp();
    await this.wait(250);

    // Phase 2: Word fades out fast, lids open immediately (250-1200ms)
    this.word.style.transition = 'opacity .3s ease, transform .4s ease';
    this.word.style.opacity = '0';
    this.word.style.transform = 'scale(0.3)';

    var tl = gsap.timeline();
    tl.to(this.lidTop, { yPercent: -101, duration: 0.8, ease: 'power3.inOut' }, 0)
      .to(this.lidBot, { yPercent: 101, duration: 0.8, ease: 'power3.inOut' }, 0);

    await this.wait(800);

    // Phase 3: Content appears immediately
    this.overlay.classList.add('intro--done');
    this.tabNav.style.opacity = '1';
    this.appContent.style.opacity = '1';

    var activeSection = document.querySelector('.section.active');
    if (activeSection) activeSection.style.display = 'block';

    // Cleanup
    setTimeout(() => {
      this.overlay.style.display = 'none';
      document.body.classList.remove('no-scroll');
    }, 400);
  }

  skip() {
    gsap.to(this.lidTop, { yPercent: -101, duration: 0.5, ease: 'power3.in' });
    gsap.to(this.lidBot, { yPercent: 101, duration: 0.5, ease: 'power3.in' });
    this.word.classList.add('intro__word--visible');
    this.overlay.classList.add('intro--done');
    this.tabNav.style.opacity = '1';
    this.appContent.style.opacity = '1';

    var activeSection = document.querySelector('.section.active');
    if (activeSection) activeSection.style.display = 'block';

    setTimeout(() => {
      this.overlay.style.display = 'none';
      document.body.classList.remove('no-scroll');
    }, 400);
  }

  startCountUp() {
    if (!this.count) return;
    var self = this;
    var start = performance.now();
    var duration = 800;
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var v = Math.floor(p * 100);
      self.count.textContent = String(v).padStart(3, '0');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  spawnSparks(count) {
    var container = document.querySelector('.intro__sparks');
    if (!container) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var spark = document.createElement('div');
      spark.className = 'intro-spark';
      spark.style.left = (35 + Math.random() * 30) + '%';
      spark.style.top  = (35 + Math.random() * 20) + '%';
      spark.style.setProperty('--sx', (Math.random() - 0.5) * 700 + 'px');
      spark.style.setProperty('--sy', 180 + Math.random() * 500 + 'px');
      spark.style.animationDelay = Math.random() * 0.5 + 's';
      spark.style.animationDuration = (1 + Math.random() * 2) + 's';
      spark.style.width  = (1 + Math.random() * 3) + 'px';
      spark.style.height = spark.style.width;
      frag.appendChild(spark);
    }
    container.appendChild(frag);

    // Cleanup old sparks
    setTimeout(function () {
      var sparks = container.querySelectorAll('.intro-spark');
      if (sparks.length > 100) {
        for (var i = 0; i < 30; i++) sparks[i] && sparks[i].remove();
      }
    }, 2000);
  }

  wait(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }
}
