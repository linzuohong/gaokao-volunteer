(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(id) { return document.getElementById(id); }

  function resizeCanvas(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    return dpr;
  }

  function intro() {
    var portal = $('portal');
    var canvas = $('portalCanvas');
    if (!portal || !canvas || reduce) {
      if (portal) portal.classList.add('is-done');
      return;
    }
    var ctx = canvas.getContext('2d');
    var dpr = resizeCanvas(canvas);
    var particles = [];
    var count = Math.min(980, Math.floor(innerWidth * innerHeight / 1400));
    for (var i = 0; i < count; i++) {
      var edge = Math.floor(Math.random() * 4);
      var x = edge === 0 ? -80 : edge === 1 ? innerWidth + 80 : Math.random() * innerWidth;
      var y = edge === 2 ? -80 : edge === 3 ? innerHeight + 80 : Math.random() * innerHeight;
      particles.push({
        x: x, y: y,
        tx: innerWidth * (.22 + Math.random() * .56),
        ty: innerHeight * (.38 + Math.random() * .24),
        s: .5 + Math.random() * 1.8,
        off: Math.random() * 1.8
      });
    }
    var start = performance.now();
    function draw(now) {
      var t = Math.min(1, (now - start) / 2700);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      var g = ctx.createRadialGradient(innerWidth / 2, innerHeight / 2, 30, innerWidth / 2, innerHeight / 2, innerWidth * .62);
      g.addColorStop(0, 'rgba(255,255,255,.92)');
      g.addColorStop(.54, 'rgba(221,229,236,.82)');
      g.addColorStop(1, 'rgba(238,242,245,1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, innerWidth, innerHeight);

      var gather = t < .72 ? t / .72 : 1;
      var release = t < .72 ? 0 : (t - .72) / .28;
      var ease = 1 - Math.pow(1 - gather, 3);
      ctx.globalCompositeOperation = 'multiply';
      particles.forEach(function (p) {
        var wave = Math.sin((t * 8) + p.off) * 24 * (1 - gather);
        var x = p.x + (p.tx - p.x) * ease + wave;
        var y = p.y + (p.ty - p.y) * ease + Math.cos((t * 7) + p.off) * 16 * (1 - gather);
        if (release > 0) {
          x += (x - innerWidth / 2) * release * 1.8;
          y += (y - innerHeight / 2) * release * 1.2;
        }
        ctx.fillStyle = 'rgba(72,91,108,' + (.14 + .54 * gather * (1 - release)) + ')';
        ctx.beginPath();
        ctx.arc(x, y, p.s * (1 + gather * 1.6), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(70,90,110,' + (.22 * (1 - release)) + ')';
      ctx.lineWidth = 1;
      for (var j = 0; j < 16; j++) {
        var yy = innerHeight * (.35 + j * .018) + Math.sin(t * 5 + j) * 14;
        ctx.beginPath();
        for (var x2 = 0; x2 <= innerWidth; x2 += 24) {
          var y2 = yy + Math.sin(x2 * .012 + t * 7 + j) * 9 * (1 - release);
          if (x2 === 0) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2);
        }
        ctx.stroke();
      }
      ctx.restore();
      if (t < 1) requestAnimationFrame(draw);
      else portal.classList.add('is-done');
    }
    requestAnimationFrame(draw);
    window.addEventListener('resize', function () { dpr = resizeCanvas(canvas); }, { passive: true });
  }

  function ambientField() {
    var canvas = $('fieldCanvas');
    if (!canvas || reduce) return;
    var ctx = canvas.getContext('2d');
    var dpr = resizeCanvas(canvas);
    var dots = [];
    var pulses = [];
    var pointer = { x: innerWidth / 2, y: innerHeight / 2, live: false };
    var count = Math.min(160, Math.floor(innerWidth * innerHeight / 9000));
    for (var i = 0; i < count; i++) {
      dots.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .12, r: .6 + Math.random() * 1.5 });
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      for (var i = 0; i < dots.length; i++) {
        var a = dots[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = innerWidth + 20;
        if (a.x > innerWidth + 20) a.x = -20;
        if (a.y < -20) a.y = innerHeight + 20;
        if (a.y > innerHeight + 20) a.y = -20;
        ctx.fillStyle = 'rgba(80,96,112,.22)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var b = dots[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 118) {
            var near = pointer.live ? Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - pointer.x, (a.y + b.y) / 2 - pointer.y) / 280) : 0;
            ctx.strokeStyle = 'rgba(86,104,122,' + ((1 - dist / 118) * (.11 + near * .18)) + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var p = pulses.length - 1; p >= 0; p--) {
        var pulse = pulses[p];
        pulse.t += .018;
        if (pulse.t >= 1) { pulses.splice(p, 1); continue; }
        var r = 28 + pulse.t * 180;
        ctx.strokeStyle = 'rgba(64,82,100,' + ((1 - pulse.t) * .22) + ')';
        ctx.lineWidth = 1 + (1 - pulse.t) * 2;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('pointermove', function (e) { pointer.x = e.clientX; pointer.y = e.clientY; pointer.live = true; }, { passive: true });
    window.addEventListener('click', function (e) { pulses.push({ x: e.clientX, y: e.clientY, t: 0 }); }, { passive: true });
    window.addEventListener('resize', function () { dpr = resizeCanvas(canvas); }, { passive: true });
  }

  function reveal() {
    var items = document.querySelectorAll('.reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: .18 });
    items.forEach(function (el) { io.observe(el); });
  }

  function renderTimeline() {
    var host = $('timeline');
    if (!host) return;
    var rows = (((window.siteContent || {}).steps || {}).timeline || []).concat([
      { time: '提交前', text: '逐项检查选科、体检、单科、学费、校区、调剂范围，确认无误后提交并截图。' }
    ]);
    host.innerHTML = rows.map(function (row) {
      return '<article class="time-item reveal"><b>' + row.time + '</b><p>' + row.text + '</p></article>';
    }).join('');
  }

  function renderUniversities() {
    var grid = $('uniGrid');
    var count = $('uniCount');
    var search = $('uniSearch');
    var level = $('uniLevel');
    var type = $('uniType');
    var data = window.universityData || [];
    var heroCount = $('heroUniCount');
    if (heroCount) heroCount.textContent = data.length + '+';
    if (!grid) return;

    function draw() {
      var q = (search.value || '').trim().toLowerCase();
      var lv = level.value;
      var tp = type.value;
      var filtered = data.filter(function (u) {
        var hay = [u.name, u.type, u.location, u.tags, u.feats, (u.level || []).join(',')].join(' ').toLowerCase();
        return (!q || hay.indexOf(q) > -1) && (!lv || (u.level || []).indexOf(lv) > -1) && (!tp || u.type === tp);
      }).slice(0, 60);
      count.textContent = filtered.length + ' 所';
      grid.innerHTML = filtered.map(function (u) {
        var levels = (u.level || []).map(function (x) { return '<span>' + x + '</span>'; }).join('');
        var note = u.empNote || (u.tags + '。校园关键词：' + u.feats + '。');
        return '<article class="uni-card"><h3>' + u.name + '</h3><div class="uni-meta"><span>' + u.location + '</span><span>' + u.type + '</span>' + levels + '</div><p>' + note + '</p><div class="uni-stats"><span><b>' + (u.rankN || '-') + '</b><small>参考排名</small></span><span><b>' + (u.minRank || '-') + '</b><small>参考位次</small></span><span><b>' + (u.empRate || '-') + '%</b><small>就业率</small></span></div></article>';
      }).join('');
    }
    [search, level, type].forEach(function (el) { el.addEventListener('input', draw); el.addEventListener('change', draw); });
    draw();
  }

  function toast(text) {
    var el = $('toast');
    if (!el) return;
    el.textContent = text;
    el.classList.add('is-on');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove('is-on'); }, 2200);
  }

  function scoreToRank(score) {
    var anchors = [
      [750, 1], [700, 35], [680, 180], [660, 950], [640, 2300],
      [620, 4900], [600, 9200], [580, 15800], [560, 25500],
      [540, 39000], [520, 57000], [500, 80000], [480, 107000],
      [460, 138000], [448, 160000], [400, 185000], [300, 230000]
    ];
    score = Math.max(200, Math.min(750, Number(score) || 0));
    for (var i = 0; i < anchors.length - 1; i++) {
      var a = anchors[i], b = anchors[i + 1];
      if (score <= a[0] && score >= b[0]) {
        var t = (score - a[0]) / (b[0] - a[0]);
        return Math.round(a[1] + (b[1] - a[1]) * t);
      }
    }
    return anchors[anchors.length - 1][1];
  }

  function buildMockEntries(rank) {
    var data = window.universityData || [];
    return data
      .filter(function (u) { return parseInt(u.minRank, 10) > 0; })
      .map(function (u) {
        var need = parseInt(u.minRank, 10);
        var ratio = (rank - need) / need;
        var risk = ratio > .28 ? null : ratio > 0 ? 'rush' : ratio > -.2 ? 'steady' : 'safe';
        if (!risk) return null;
        return {
          name: u.name,
          group: u.type + ' · ' + (u.level || []).slice(0, 2).join('/'),
          rank: need,
          risk: risk,
          label: risk === 'rush' ? '冲' : risk === 'steady' ? '稳' : '保'
        };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        var order = { rush: 0, steady: 1, safe: 2 };
        return order[a.risk] - order[b.risk] || a.rank - b.rank;
      })
      .slice(0, 6);
  }

  function initMockSystem() {
    var score = $('mockScore');
    var rankEl = $('mockRank');
    var rows = $('mockRows');
    var submit = $('mockSubmit');
    var simulator = document.querySelector('.simulator');
    if (!score || !rankEl || !rows) return;

    function render() {
      var rank = scoreToRank(score.value);
      rankEl.value = rank.toLocaleString();
      var entries = buildMockEntries(rank);
      rows.innerHTML = entries.map(function (entry, i) {
        var order = String.fromCharCode(65 + i);
        return '<div class="trow is-new" draggable="true" data-rank="' + entry.rank + '"><span>' + order + '</span><span>' + entry.name + '</span><span>' + entry.group + '</span><span class="risk ' + entry.risk + '">' + entry.label + '</span></div>';
      }).join('');
      rows.querySelectorAll('.trow').forEach(function (row, i) {
        row.style.animationDelay = (i * 45) + 'ms';
      });
    }

    score.addEventListener('input', render);
    if (submit) {
      submit.addEventListener('click', function () {
        toast('模拟志愿已完成：请在正式系统提交前再次核验招生章程、代码和调剂范围。');
      });
    }
    rows.addEventListener('dragstart', function (e) {
      var row = e.target.closest('.trow');
      if (!row) return;
      row.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', row.dataset.rank || '');
    });
    rows.addEventListener('dragend', function (e) {
      var row = e.target.closest('.trow');
      if (row) row.classList.remove('is-dragging');
      Array.from(rows.children).forEach(function (child, i) {
        child.children[0].textContent = String.fromCharCode(65 + i);
      });
    });
    rows.addEventListener('dragover', function (e) {
      e.preventDefault();
      var dragging = rows.querySelector('.is-dragging');
      var target = e.target.closest('.trow');
      if (!dragging || !target || dragging === target) return;
      var rect = target.getBoundingClientRect();
      rows.insertBefore(dragging, e.clientY < rect.top + rect.height / 2 ? target : target.nextSibling);
    });

    if (simulator) {
      simulator.addEventListener('pointermove', function (e) {
        var r = simulator.getBoundingClientRect();
        simulator.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
        simulator.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
      }, { passive: true });
    }
    render();
  }

  function initStepTools() {
    var input = $('rankCalc');
    var btn = $('rankCalcBtn');
    var result = $('rangeResult');
    if (input && btn && result) {
      function calc() {
        var rank = parseInt(input.value, 10);
        if (!rank || rank < 1) { toast('先输入一个有效位次。'); return; }
        var ranges = [
          ['冲刺', Math.round(rank * .86), Math.round(rank * .96), '少量布局，必须确认调剂和退档风险。'],
          ['稳妥', Math.round(rank * .98), Math.round(rank * 1.08), '志愿主体，覆盖不同城市和院校层级。'],
          ['保底', Math.round(rank * 1.12), Math.round(rank * 1.32), '至少准备多所，优先招生稳定的院校。']
        ];
        result.innerHTML = ranges.map(function (r, i) {
          return '<div class="range-card" style="animation-delay:' + (i * 60) + 'ms"><b>' + r[0] + '</b><span>' + r[1].toLocaleString() + ' - ' + r[2].toLocaleString() + '</span><small>' + r[3] + '</small></div>';
        }).join('');
      }
      btn.addEventListener('click', calc);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') calc(); });
    }

    var checklist = $('checklist');
    if (checklist) {
      var items = [
        '查一分一段表，确认自己的全省位次。',
        '核对目标院校近三年投档位次，不只看分数。',
        '逐条阅读招生章程，标出身体、单科、语种限制。',
        '确认每个专业组内的专业都能接受，再勾选调剂。',
        '保存志愿草表、提交页面和最终确认截图。'
      ];
      var saved = JSON.parse(localStorage.getItem('gaokao-checklist') || '[]');
      checklist.innerHTML = items.map(function (item, i) {
        return '<div class="check-item ' + (saved.indexOf(i) > -1 ? 'is-on' : '') + '" data-i="' + i + '"><i class="check-box"></i><span>' + item + '</span></div>';
      }).join('');
      checklist.addEventListener('click', function (e) {
        var item = e.target.closest('.check-item');
        if (!item) return;
        var idx = parseInt(item.dataset.i, 10);
        item.classList.toggle('is-on');
        var state = Array.from(checklist.querySelectorAll('.check-item.is-on')).map(function (el) { return parseInt(el.dataset.i, 10); });
        localStorage.setItem('gaokao-checklist', JSON.stringify(state));
        if (item.classList.contains('is-on')) toast('已核验：' + items[idx]);
      });
    }
  }

  function initTiltCards() {
    if (matchMedia('(pointer: coarse)').matches || reduce) return;
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest('.uni-card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5;
      var py = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--ry', (px * 5).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-py * 4).toFixed(2) + 'deg');
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var card = e.target.closest('.uni-card');
      if (card) {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      }
    }, { passive: true });
  }

  intro();
  ambientField();
  renderTimeline();
  renderUniversities();
  initMockSystem();
  initStepTools();
  initTiltCards();
  reveal();
})();
