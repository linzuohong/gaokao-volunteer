/**
 * Section 3: 高校信息 — 银河方块掉落
 * 搜索框 + 分类引导检索 + Matter.js 物理掉落 + hover渐变切换 + 点击详情
 */
(function () {
  'use strict';

  var data = window.universityData || [];
  var container = document.getElementById('section-universities');
  if (!container) return;

  // ═══ State ═══
  var state = { search: '', typeFilter: '全部', levelFilter: '全部' };
  var searchInput;
  var physicsActive = false;
  var engine, runner, animId, canvas, ctx;
  var W, H, dpr;
  var mx = -100, my = -100;
  var modalOverlay;
  var stageEl;
  var countEl;

  // ═══ Exported entry ═══
  function initUniSection() {
    if (container.dataset.initialized === 'true') {
      // Already built — ensure stage visible, then restart physics if needed
      if (stageEl) stageEl.style.display = '';
      if (!physicsActive) {
        startPhysics();
      } else {
        // Physics still running, just ensure canvas is in DOM
        ensureCanvasVisible();
      }
      return;
    }
    container.dataset.initialized = 'true';
    buildUI();
    startPhysics();
  }

  // 确保 Canvas 在 DOM 中可见（修复滚动/切换 tab 后消失的问题）
  function ensureCanvasVisible() {
    if (!canvas) return;
    if (!canvas.parentNode && stageEl) {
      stageEl.appendChild(canvas);
    }
    canvas.style.display = 'block';
    // 重新同步尺寸
    if (stageEl) {
      var rect = stageEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        W = Math.max(rect.width, 300);
        H = Math.max(rect.height, 200);
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        if (ctx) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale(dpr, dpr);
        }
      }
    }
  }

  // ═══════════════════════════════════════════
  //  BUILD UI
  // ═══════════════════════════════════════════
  function buildUI() {
    container.innerHTML = '';

    var inner = ce('div', 'container');
    inner.style.paddingTop = 'var(--xxl)';

    // ── 标题 ──
    var header = ce('div', 'section__header');
    header.innerHTML =
      '<div class="mono"><span class="fx-chapnum">SECTION 03</span></div>' +
      '<h2>高校信息库</h2>' +
      '<p>全国高校数据，如银河繁星般呈现</p>';
    inner.appendChild(header);

    // ── 搜索框（顶部，分类引导）──
    var searchBar = ce('div', 'uni-search-bar');
    searchBar.style.cssText = 'display:flex;align-items:center;gap:var(--md);flex-wrap:wrap;';

    // 搜索图标 + 输入框
    var searchWrap = ce('div', 'search-bar');
    searchWrap.style.cssText = 'flex:1;min-width:200px;position:relative;';

    var searchIcon = ce('span');
    searchIcon.innerHTML = '🔍';
    searchIcon.style.cssText = 'position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none;';
    searchWrap.appendChild(searchIcon);

    searchInput = ce('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索高校名称、地区、类型...';
    searchInput.style.cssText = 'width:100%;padding:12px 16px 12px 42px;border:1px solid var(--b-light);border-radius:var(--r-full);background:var(--s0);font-size:15px;color:var(--fx-k);transition:all .25s var(--fx-ease);outline:none;';
    searchInput.addEventListener('focus', function () { this.style.borderColor = 'var(--fx-r)'; this.style.boxShadow = '0 0 0 4px var(--accent-glow)'; });
    searchInput.addEventListener('blur', function () { this.style.borderColor = 'var(--b-light)'; this.style.boxShadow = 'none'; });
    searchInput.addEventListener('input', debounce(function () {
      state.search = searchInput.value.trim();
      restartPhysics();
    }, 300));
    searchWrap.appendChild(searchInput);
    searchBar.appendChild(searchWrap);

    // 搜索结果计数
    countEl = ce('span', 'mono');
    countEl.style.cssText = 'font-size:11px;color:var(--fx-g);white-space:nowrap;letter-spacing:0.05em;';
    countEl.textContent = '共 ' + data.length + ' 所高校';
    searchBar.appendChild(countEl);

    inner.appendChild(searchBar);

    // ── 分类筛选 Chips ──
    // Type filter row
    var typeRow = ce('div', 'chip-row');
    typeRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:var(--sm);margin-bottom:var(--sm);';
    var typeLabel = ce('span');
    typeLabel.style.cssText = 'font-family:var(--fx-mono);font-size:10px;letter-spacing:0.15em;color:var(--fx-g);display:flex;align-items:center;margin-right:var(--xs);text-transform:uppercase;';
    typeLabel.textContent = '类型';
    typeRow.appendChild(typeLabel);
    ['全部'].concat(getUnique('type')).forEach(function (t) {
      var chip = mkChip(t, 'type');
      typeRow.appendChild(chip);
    });
    inner.appendChild(typeRow);

    // Level filter row
    var levelRow = ce('div', 'chip-row');
    levelRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:var(--sm);margin-bottom:var(--xl);';
    var levelLabel = ce('span');
    levelLabel.style.cssText = 'font-family:var(--fx-mono);font-size:10px;letter-spacing:0.15em;color:var(--fx-g);display:flex;align-items:center;margin-right:var(--xs);text-transform:uppercase;';
    levelLabel.textContent = '层次';
    levelRow.appendChild(levelLabel);
    ['全部', '985', '211', '双一流', '省重点', '二本', '专科'].forEach(function (l) {
      var chip = mkChip(l, 'level');
      levelRow.appendChild(chip);
    });
    inner.appendChild(levelRow);

    // ── 银河掉落舞台 ──
    stageEl = ce('div', 'uni-physics-stage');
    stageEl.id = 'uniPhysicsStage';
    stageEl.style.cssText =
      'position:relative;height:62vh;min-height:420px;margin-bottom:var(--xxl);' +
      'border:1px solid var(--b-hair);border-radius:var(--r-lg);' +
      'background:linear-gradient(180deg, #e8e8ee 0%, #d8d8e4 40%, #c8c8d8 100%);' +
      'overflow:hidden;cursor:crosshair;';

    // 星星背景层
    var starsEl = ce('div');
    starsEl.id = 'uniStarBg';
    starsEl.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
    stageEl.appendChild(starsEl);

    // 地板线
    var floorEl = ce('div');
    floorEl.id = 'uniFloor';
    floorEl.style.cssText =
      'position:absolute;bottom:0;left:0;right:0;height:3px;z-index:5;pointer-events:none;' +
      'background:linear-gradient(90deg,transparent,rgba(180,180,195,0.8),rgba(140,140,160,0.5),rgba(180,180,195,0.8),transparent);' +
      'box-shadow:0 0 20px rgba(160,160,180,0.3), 0 0 60px rgba(140,140,160,0.1);';
    stageEl.appendChild(floorEl);

    // 提示文字
    var hint = ce('p', 'uni-physics-stage__hint');
    hint.style.cssText =
      'position:absolute;bottom:var(--md);left:50%;transform:translateX(-50%);z-index:10;' +
      'font-family:var(--fx-mono);font-size:10px;letter-spacing:0.15em;color:var(--fx-g);' +
      'text-transform:uppercase;pointer-events:none;';
    hint.textContent = '悬停查看信息 · 点击查看详情';
    stageEl.appendChild(hint);

    inner.appendChild(stageEl);

    // ── 详情弹窗 ──
    modalOverlay = ce('div', 'modal-overlay');
    modalOverlay.id = 'uniModal';
    modalOverlay.innerHTML =
      '<div class="modal" id="uniModalInner" style="max-width:720px;">' +
      '<button class="modal__close" id="uniModalClose">&times;</button>' +
      '<div id="uniModalContent"></div></div>';
    inner.appendChild(modalOverlay);

    container.appendChild(inner);

    // ── 事件绑定 ──
    document.getElementById('uniModalClose').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    // 生成星星背景
    generateStars();
  }

  // ═══════════════════════════════════════════
  //  AMBIENT PARTICLES (silver theme)
  // ═══════════════════════════════════════════
  function generateStars() {
    var starsEl = document.getElementById('uniStarBg');
    if (!starsEl) return;
    var count = 120;
    var html = '';
    for (var i = 0; i < count; i++) {
      var x = Math.random() * 100;
      var y = Math.random() * 100;
      var size = Math.random() * 2 + 0.5;
      var opacity = Math.random() * 0.25 + 0.08;
      var twinkle = Math.random() * 4 + 3;
      html += '<div style="position:absolute;left:' + x + '%;top:' + y +
        '%;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(120,120,140,' +
        opacity + ');animation:uniTwinkle ' + twinkle + 's ease-in-out infinite;animation-delay:' +
        (Math.random() * 5) + 's;"></div>';
    }
    starsEl.innerHTML = html;
  }

  // ═══════════════════════════════════════════
  //  PHYSICS ENGINE
  // ═══════════════════════════════════════════
  function startPhysics() {
    if (!stageEl || !window.Matter) return;

    // 如果舞台不可见（display:none 等），延迟重试
    var rect = stageEl.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) {
      physicsActive = false;
      return;
    }

    cleanupPhysics();

    var filtered = filterData();
    countEl.textContent = '共 ' + filtered.length + ' 所高校';

    if (filtered.length === 0) {
      stageEl.style.display = 'none';
      physicsActive = false;
      return;
    }
    stageEl.style.display = '';

    rect = stageEl.getBoundingClientRect();
    W = Math.max(rect.width, 300);
    H = Math.max(rect.height, 200);
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Canvas
    canvas = ce('canvas');
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:2;display:block;';
    stageEl.appendChild(canvas);
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // 物理引擎 — 轻柔重力模拟漂浮感
    var Engine = Matter.Engine, World = Matter.World;
    var Bodies = Matter.Bodies, Runner = Matter.Runner;
    var Body = Matter.Body;

    engine = Engine.create({ gravity: { x: 0, y: 1.8 } });

    // 墙壁 + 地板
    var wallOpts = { isStatic: true, restitution: 0.3, friction: 0.9 };
    World.add(engine.world, [
      Bodies.rectangle(W / 2, H + 40, W + 80, 80, wallOpts),   // 地板
      Bodies.rectangle(-40, H / 2, 80, H * 2, wallOpts),       // 左墙
      Bodies.rectangle(W + 40, H / 2, 80, H * 2, wallOpts)     // 右墙
    ]);

    // ── 生成小方块 — 银河般掉落（1.5x 尺寸升级）──
    var cardW = Math.min(W * 0.082, 105);
    var cardH = cardW * 0.82;

    filtered.forEach(function (uni, i) {
      // 螺旋起始位置模拟银河
      var angle = (i / filtered.length) * Math.PI * 6 + Math.random() * 0.5;
      var radius = W * 0.5 + Math.random() * W * 0.3;
      var x = W / 2 + Math.cos(angle) * radius;
      x = Math.max(cardW, Math.min(W - cardW, x));

      // 从屏幕上方更高处落下，更长的下落动画
      var minY = H * 0.3;
      var maxY = H * 2.5;
      var y = -(minY + Math.random() * maxY + (i % 7) * 100);

      var body = Bodies.rectangle(x, y, cardW, cardH, {
        restitution: 0.15,
        friction: 0.8,
        density: 0.0012,
        chamfer: { radius: 4 }
      });

      // 附加数据
      body.uniData = uni;
      body.cardW = cardW;
      body.cardH = cardH;
      body._hoverAlpha = 0;

      // 初始微旋转
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);

      World.add(engine.world, body);
    });

    // ── 鼠标追踪 ──
    function onMouseMove(e) {
      var r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) * (W / r.width);
      my = (e.clientY - r.top) * (H / r.height);
    }
    function onMouseLeave() { mx = -100; my = -100; }
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    // ── 点击检测 ──
    function onClick(e) {
      e.stopPropagation();
      var r = canvas.getBoundingClientRect();
      var cx = (e.clientX - r.left) * (W / r.width);
      var cy = (e.clientY - r.top) * (H / r.height);
      var bodies = Matter.Composite.allBodies(engine.world);
      for (var i = bodies.length - 1; i >= 0; i--) {
        var b = bodies[i];
        if (b.isStatic || !b.uniData) continue;
        if (Matter.Bounds.contains(b.bounds, { x: cx, y: cy })) {
          openDetail(b.uniData);
          return;
        }
      }
    }
    canvas.addEventListener('click', onClick);

    // ── 渲染循环 ──
    runner = Runner.create();
    Runner.run(runner, engine);

    function draw() {
      try {
        Matter.Engine.update(engine, 1000 / 60);
      } catch(e) { /* engine may have been cleared */ }
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // 绘制地板光晕
      var glowGrad = ctx.createLinearGradient(0, H - 40, 0, H);
      glowGrad.addColorStop(0, 'rgba(200,200,210,0)');
      glowGrad.addColorStop(0.7, 'rgba(190,190,205,0.5)');
      glowGrad.addColorStop(1, 'rgba(170,170,190,0.8)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, H - 40, W, 40);

      var bodies = Matter.Composite.allBodies(engine.world);
      var hovered = null;

      // 找 hover 目标
      for (var i2 = bodies.length - 1; i2 >= 0; i2--) {
        var b2 = bodies[i2];
        if (b2.isStatic || !b2.uniData) continue;
        if (Matter.Bounds.contains(b2.bounds, { x: mx, y: my })) {
          hovered = b2;
          break;
        }
      }

      // 更新 hoverAlpha（平滑渐变）
      for (var i3 = 0; i3 < bodies.length; i3++) {
        var b3 = bodies[i3];
        if (b3.isStatic || !b3.uniData) continue;
        var target = (b3 === hovered) ? 1 : 0;
        b3._hoverAlpha += (target - b3._hoverAlpha) * 0.16;
      }

      // 绘制所有方块
      for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        if (body.isStatic || !body.uniData) continue;
        drawBlock(body);
      }

      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    // Resize 处理（跳过不可见状态，防止 display:none 时尺寸归零）
    function onResize() {
      var r = stageEl.getBoundingClientRect();
      if (r.width < 10 || r.height < 10) return; // 舞台不可见，跳过
      W = Math.max(r.width, 300);
      H = Math.max(r.height, 200);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', onResize);

    // 保存清理引用
    stageEl._physicsCleanup = function () {
      cancelAnimationFrame(animId);
      Runner.stop(runner);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvas = null;
    };

    physicsActive = true;
  }

  // ═══════════════════════════════════════════
  //  DRAW SINGLE BLOCK
  // ═══════════════════════════════════════════
  function drawBlock(body) {
    var pos = body.position, angle = body.angle;
    var alpha = body._hoverAlpha || 0;
    var w = body.cardW, h = body.cardH;
    var hw = w / 2, hh = h / 2;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(angle);

    // ── 金属光泽银色背景 ──
    // 主体渐变：左上亮 → 右下稍暗，模拟金属反射
    var grad = ctx.createLinearGradient(-hw, -hh, hw, hh);
    var silverHi = 220 + alpha * 18;
    var silverMid = 195 + alpha * 18;
    var silverLo = 170 + alpha * 10;
    grad.addColorStop(0, 'rgb(' + Math.round(silverHi) + ',' + Math.round(silverHi) + ',' + Math.round(silverHi + 8) + ')');
    grad.addColorStop(0.35, 'rgb(' + Math.round(silverMid) + ',' + Math.round(silverMid) + ',' + Math.round(silverMid + 6) + ')');
    grad.addColorStop(0.65, 'rgb(' + Math.round(silverLo) + ',' + Math.round(silverLo + 2) + ',' + Math.round(silverLo + 10) + ')');
    grad.addColorStop(1, 'rgb(' + Math.round(silverMid + 5) + ',' + Math.round(silverMid + 5) + ',' + Math.round(silverMid + 12) + ')');
    ctx.fillStyle = grad;

    ctx.strokeStyle = alpha > 0.5
      ? 'rgba(120,120,140,0.65)'
      : 'rgba(160,160,180,0.45)';
    ctx.lineWidth = alpha > 0.5 ? 1.5 : 0.8;

    // 圆角矩形
    var rr = 4;
    ctx.beginPath();
    ctx.moveTo(-hw + rr, -hh);
    ctx.lineTo(hw - rr, -hh);
    ctx.quadraticCurveTo(hw, -hh, hw, -hh + rr);
    ctx.lineTo(hw, hh - rr);
    ctx.quadraticCurveTo(hw, hh, hw - rr, hh);
    ctx.lineTo(-hw + rr, hh);
    ctx.quadraticCurveTo(-hw, hh, -hw, hh - rr);
    ctx.lineTo(-hw, -hh + rr);
    ctx.quadraticCurveTo(-hw, -hh, -hw + rr, -hh);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // ── 金属高光条纹（模拟拉丝金属反光）──
    var hlAlpha = 0.12 + alpha * 0.06;
    var hlGrad = ctx.createLinearGradient(-hw * 0.6, -hh * 0.6, hw * 0.6, hh * 0.6);
    hlGrad.addColorStop(0, 'rgba(255,255,255,0)');
    hlGrad.addColorStop(0.4, 'rgba(255,255,255,' + hlAlpha + ')');
    hlGrad.addColorStop(0.5, 'rgba(255,255,255,' + (hlAlpha * 2.5) + ')');
    hlGrad.addColorStop(0.6, 'rgba(255,255,255,' + hlAlpha + ')');
    hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hlGrad;
    ctx.fill();

    // ── 细微暗角（加深边缘，增强立体感）──
    var edgeAlpha = 0.06;
    var edgeGrad = ctx.createLinearGradient(0, -hh, 0, hh);
    edgeGrad.addColorStop(0, 'rgba(0,0,0,' + edgeAlpha + ')');
    edgeGrad.addColorStop(0.5, 'rgba(0,0,0,0)');
    edgeGrad.addColorStop(1, 'rgba(0,0,0,' + (edgeAlpha * 1.5) + ')');
    ctx.fillStyle = edgeGrad;
    ctx.fill();

    // ── 顶部强调线 ──
    var lineAlpha = 0.4 + alpha * 0.5;
    ctx.fillStyle = alpha > 0.5
      ? 'rgba(196,30,58,' + lineAlpha + ')'
      : 'rgba(160,160,180,' + lineAlpha + ')';
    ctx.fillRect(-hw, -hh, w, alpha > 0.5 ? 2 : 1);

    // ── 光晕效果（hover时）──
    if (alpha > 0.3) {
      ctx.shadowColor = 'rgba(196,30,58,' + (alpha * 0.6) + ')';
      ctx.shadowBlur = alpha * 12;
    }

    // ═══ 文字层：名字 ←→ 信息（渐变切换）═══
    var nameAlpha = Math.max(0, 1 - alpha);
    var infoAlpha = alpha;

    // 大学名字（淡出）
    if (nameAlpha > 0.01) {
      ctx.globalAlpha = nameAlpha;
      ctx.fillStyle = '#2a2a36';
      ctx.font = 'bold ' + Math.max(7, w * 0.12) + 'px "PingFang SC","Noto Sans SC",sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 截断太长的名字
      var name = body.uniData.name;
      if (name.length > 6) name = name.slice(0, 6) + '…';
      ctx.fillText(name, 0, h * 0.02);
      ctx.globalAlpha = 1;
    }

    // 信息概括（淡入）
    if (infoAlpha > 0.01) {
      ctx.globalAlpha = infoAlpha;

      // 排名
      ctx.fillStyle = '#C41E3A';
      var rankStr = body.uniData.rankN > 0 ? '#' + body.uniData.rankN : '--';
      ctx.font = 'bold ' + Math.max(8, w * 0.17) + 'px "SF Mono","JetBrains Mono",monospace';
      ctx.fillText(rankStr, 0, -h * 0.22);

      // 地区
      ctx.fillStyle = '#555';
      ctx.font = Math.max(6.5, w * 0.075) + 'px "PingFang SC","Noto Sans SC",sans-serif';
      ctx.fillText(body.uniData.location, 0, h * 0.06);

      // 类型
      ctx.fillText(body.uniData.type, 0, h * 0.2);

      // 薪资
      if (body.uniData.avgSalary > 0) {
        ctx.fillStyle = '#777';
        ctx.font = Math.max(6.5, w * 0.072) + 'px "SF Mono",monospace';
        ctx.fillText('¥' + (body.uniData.avgSalary / 1000).toFixed(0) + 'k', 0, h * 0.35);
      }

      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  // ═══════════════════════════════════════════
  //  CLEANUP & RESTART
  // ═══════════════════════════════════════════
  function cleanupPhysics() {
    // _physicsCleanup 闭包已处理全部清理（runner/engine/canvas/事件）
    if (stageEl && stageEl._physicsCleanup) {
      stageEl._physicsCleanup();
      stageEl._physicsCleanup = null;
    }
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    runner = null;
    engine = null;
    physicsActive = false;
  }

  function restartPhysics() {
    cleanupPhysics();
    startPhysics();
  }

  // ═══════════════════════════════════════════
  //  FILTER / SEARCH
  // ═══════════════════════════════════════════
  function filterData() {
    return data.filter(function (uni) {
      if (state.search) {
        var q = state.search.toLowerCase();
        if (uni.name.toLowerCase().indexOf(q) === -1 &&
            uni.location.toLowerCase().indexOf(q) === -1 &&
            uni.type.toLowerCase().indexOf(q) === -1 &&
            !(uni.level || []).some(function (l) { return l.toLowerCase().indexOf(q) !== -1; })) {
          return false;
        }
      }
      if (state.typeFilter !== '全部' && uni.type !== state.typeFilter) return false;
      if (state.levelFilter !== '全部') {
        if (state.levelFilter === '二本' || state.levelFilter === '专科') {
          if (!uni.level || uni.level.indexOf(state.levelFilter) === -1) return false;
        } else if (!uni.level || uni.level.indexOf(state.levelFilter) === -1) return false;
      }
      return true;
    }).sort(function (a, b) { return (a.rankN || 999) - (b.rankN || 999); });
  }

  // ═══════════════════════════════════════════
  //  CHIP HELPERS
  // ═══════════════════════════════════════════
  function mkChip(text, filterKey) {
    var chip = ce('button', 'chip');
    chip.textContent = text;
    if ((filterKey === 'type' && state.typeFilter === text) ||
        (filterKey === 'level' && state.levelFilter === text)) {
      chip.classList.add('chip--active');
    }
    chip.addEventListener('click', function () {
      if (filterKey === 'type') {
        state.typeFilter = text;
      } else {
        state.levelFilter = text;
      }
      // 更新所有 chip 状态
      document.querySelectorAll('.chip-row .chip').forEach(function (ch) {
        var t = ch.textContent;
        ch.classList.toggle('chip--active',
          t === state.typeFilter || t === state.levelFilter);
      });
      restartPhysics();
    });
    return chip;
  }

  // ═══════════════════════════════════════════
  //  DETAIL MODAL
  // ═══════════════════════════════════════════
  function openDetail(uni) {
    var content = document.getElementById('uniModalContent');
    if (!content) return;

    var levelBadges = (uni.level || []).map(function (l) {
      var cls = 'badge';
      if (l === '985') cls += ' badge--red';
      else if (l === '211') cls += ' badge--warn';
      else if (l === '双一流') cls += ' badge--info';
      else if (l === '省重点') cls += ' badge--silver';
      else cls += ' badge--silver';
      return '<span class="' + cls + '">' + l + '</span>';
    }).join('');

    var tagBadges = (uni.tags || []).map(function (t) {
      return '<span class="badge badge--silver">' + t + '</span>';
    }).join('');

    content.innerHTML =
      // 标题行
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--md);margin-bottom:var(--md);flex-wrap:wrap;">' +
        '<div>' +
          '<h2 style="font-size:clamp(22px,4vw,34px);margin-bottom:var(--xs);color:var(--fx-k);">' + uni.name + '</h2>' +
          '<p style="font-family:var(--fx-mono);font-size:12px;color:var(--fx-g);">' + uni.location + ' · ' + uni.type + '</p>' +
        '</div>' +
        '<div style="display:flex;gap:var(--xs);flex-wrap:wrap;align-items:center;">' + levelBadges + '</div>' +
      '</div>' +

      // 标签
      '<div style="display:flex;gap:var(--xs);flex-wrap:wrap;margin-bottom:var(--lg);">' + tagBadges + '</div>' +

      // 数据面板
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--md);padding:var(--lg);background:var(--s1);border-radius:var(--r-md);margin-bottom:var(--lg);">' +
        '<div style="text-align:center;">' +
          '<div style="font-size:clamp(20px,4vw,32px);font-weight:900;color:var(--fx-r);font-family:var(--fx-mono);">' + (uni.rankN > 0 ? '#' + uni.rankN : '--') + '</div>' +
          '<div style="font-size:11px;color:var(--fx-g);margin-top:4px;">全国排名</div>' +
        '</div>' +
        '<div style="text-align:center;">' +
          '<div style="font-size:clamp(20px,4vw,32px);font-weight:900;color:var(--fx-r);font-family:var(--fx-mono);">' + fmtSalary(uni.avgSalary) + '</div>' +
          '<div style="font-size:11px;color:var(--fx-g);margin-top:4px;">平均月薪</div>' +
        '</div>' +
        '<div style="text-align:center;">' +
          '<div style="font-size:clamp(20px,4vw,32px);font-weight:900;color:var(--fx-r);font-family:var(--fx-mono);">' + uni.empRate + '%</div>' +
          '<div style="font-size:11px;color:var(--fx-g);margin-top:4px;">就业率</div>' +
        '</div>' +
        '<div style="text-align:center;">' +
          '<div style="font-size:clamp(20px,4vw,32px);font-weight:900;color:var(--fx-r);font-family:var(--fx-mono);">' + (uni.minRank || '--') + '</div>' +
          '<div style="font-size:11px;color:var(--fx-g);margin-top:4px;">最低位次</div>' +
        '</div>' +
      '</div>' +

      // 详情段落
      '<div style="display:grid;gap:var(--md);">' +
        '<div>' +
          '<h4 style="font-family:var(--fx-mono);font-size:10px;letter-spacing:0.15em;color:var(--fx-g);text-transform:uppercase;margin-bottom:var(--xs);">🏫 校园特色</h4>' +
          '<p style="font-size:14px;color:var(--t1);line-height:1.8;">' + (Array.isArray(uni.feats) ? uni.feats.join(' · ') : (uni.feats || '暂无')) + '</p>' +
        '</div>' +
        (uni.empNote ?
        '<div>' +
          '<h4 style="font-family:var(--fx-mono);font-size:10px;letter-spacing:0.15em;color:var(--fx-g);text-transform:uppercase;margin-bottom:var(--xs);">💼 就业说明</h4>' +
          '<p style="font-size:14px;color:var(--t1);line-height:1.8;">' + uni.empNote + '</p>' +
        '</div>' : '') +
        (uni.majors && uni.majors.length ?
        '<div>' +
          '<h4 style="font-family:var(--fx-mono);font-size:10px;letter-spacing:0.15em;color:var(--fx-g);text-transform:uppercase;margin-bottom:var(--sm);">📚 优势专业方向</h4>' +
          '<div style="display:flex;flex-wrap:wrap;gap:var(--xs);">' +
            uni.majors.map(function (m) {
              return '<span style="padding:4px 12px;border:1px solid var(--b-light);border-radius:var(--r-full);font-size:12px;color:var(--t1);background:var(--s0);">' + m.name + '</span>';
            }).join('') +
          '</div>' +
        '</div>' : '') +
      '</div>';

    openModal();
  }

  function openModal() {
    if (modalOverlay) { modalOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }
  function closeModal() {
    if (modalOverlay) { modalOverlay.classList.remove('open'); document.body.style.overflow = ''; }
  }

  // ═══════════════════════════════════════════
  //  UTILITIES
  // ═══════════════════════════════════════════
  function getUnique(key) {
    var set = {};
    data.forEach(function (u) { if (u[key]) set[u[key]] = true; });
    return Object.keys(set).sort();
  }

  function fmtSalary(v) { return (v && v > 0) ? '¥' + (v / 1000).toFixed(1) + 'k' : '--'; }

  function ce(tag, cls) { var el = document.createElement(tag); if (cls) el.className = cls; return el; }

  function debounce(fn, d) { var t; return function () { clearTimeout(t); t = setTimeout(fn, d); }; }

  // ═══ Export ═══
  window.initUniSection = initUniSection;

})();
