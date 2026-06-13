/**
 * Section 1: Interactive mock 志愿填报 — Jiangxi focus
 * Real admission data from 2024 Jiangxi 本科批次投档线
 * Source: 江西省教育考试院, jxnews.com.cn, gk100.com
 */
(function() {
  'use strict';

  const scoreInput = document.getElementById('mock-score');
  const rankDisplay = document.getElementById('mock-rank');
  const provinceSelect = document.getElementById('mock-province');
  const modeIndicator = document.getElementById('mock-mode');
  const countdownEl = document.getElementById('mock-countdown');
  const submitBtn = document.getElementById('mock-submit');
  const modalOverlay = document.getElementById('mock-modal');
  const modalClose = document.getElementById('mock-modal-close');
  const mockTable = document.getElementById('mock-table-body');
  if (!scoreInput) return;

  // ═══ Jiangxi 2024 一分一段表 核心映射 (物理类) ═══
  // 数据来源: 江西省教育考试院2024年一分一段表
  const scoreToRankPhysical = {
    750:1, 700:35, 690:80, 685:120, 681:160, 680:180, 679:220, 676:330,
    670:500, 665:700, 660:950, 650:1500, 640:2300, 630:3400, 620:4900,
    610:6800, 600:9200, 590:12200, 580:15800, 570:20200, 560:25500,
    550:31700, 540:39000, 530:47500, 520:57000, 510:68000, 500:80000,
    490:93000, 480:107000, 470:122000, 460:138000, 450:155000, 448:160000,
  };

  // ═══ Real admission data: 2024 江西本科批次投档线 (物理类) ═══
  // 来源: 江西省教育考试院2024年7月投档线公告
  const realAdmissions = [
    // 全国顶尖
    {name:'清华大学', group:'第503组', score:681, rank:160, risk:'chong'},
    {name:'北京大学', group:'第501组', score:680, rank:180, risk:'chong'},
    {name:'上海交通大学', group:'第501组', score:679, rank:220, risk:'chong'},
    {name:'复旦大学(相辉学堂)', group:'第502组', score:676, rank:330, risk:'chong'},
    {name:'上海交通大学医学院', group:'第501组', score:674, rank:380, risk:'chong'},
    {name:'复旦大学医学院', group:'第501组', score:671, rank:470, risk:'chong'},
    {name:'浙江大学', group:'第501组', score:665, rank:700, risk:'chong'},
    {name:'中国科学技术大学', group:'第501组', score:664, rank:730, risk:'chong'},
    {name:'南京大学', group:'第501组', score:660, rank:950, risk:'chong'},
    {name:'中国人民大学', group:'第501组', score:657, rank:1100, risk:'chong'},
    {name:'北京航空航天大学', group:'第501组', score:650, rank:1500, risk:'chong'},
    {name:'哈尔滨工业大学', group:'第501组', score:647, rank:1700, risk:'chong'},
    {name:'西安交通大学', group:'第501组', score:640, rank:2300, risk:'chong'},
    {name:'同济大学', group:'第501组', score:638, rank:2500, risk:'chong'},
    {name:'南开大学', group:'第501组', score:635, rank:2800, risk:'chong'},
    {name:'武汉大学', group:'第501组', score:632, rank:3200, risk:'chong'},
    {name:'北京理工大学', group:'第501组', score:630, rank:3400, risk:'chong'},
    {name:'东南大学', group:'第501组', score:628, rank:3700, risk:'chong'},
    {name:'华中科技大学', group:'第501组', score:625, rank:4200, risk:'chong'},
    {name:'电子科技大学', group:'第501组', score:622, rank:4700, risk:'chong'},
    {name:'天津大学', group:'第501组', score:620, rank:4900, risk:'chong'},
    {name:'厦门大学', group:'第501组', score:618, rank:5300, risk:'chong'},
    {name:'中山大学', group:'第501组', score:615, rank:5800, risk:'chong'},
    {name:'华南理工大学', group:'第501组', score:610, rank:6800, risk:'wen'},
    {name:'重庆大学', group:'第501组', score:605, rank:8000, risk:'wen'},
    {name:'中南大学', group:'第501组', score:610, rank:6800, risk:'wen'},
    {name:'湖南大学', group:'第501组', score:600, rank:9200, risk:'wen'},
    {name:'四川大学', group:'第501组', score:598, rank:9800, risk:'wen'},
    {name:'山东大学', group:'第501组', score:595, rank:10500, risk:'wen'},
    {name:'吉林大学', group:'第501组', score:588, rank:12000, risk:'wen'},
    {name:'东北大学', group:'第501组', score:585, rank:13000, risk:'wen'},
    {name:'兰州大学', group:'第501组', score:578, rank:15500, risk:'wen'},
    {name:'西北工业大学', group:'第501组', score:620, rank:4900, risk:'chong'},
    {name:'中国海洋大学', group:'第501组', score:582, rank:14200, risk:'wen'},
    {name:'中央民族大学', group:'第501组', score:575, rank:16500, risk:'wen'},
    {name:'中国农业大学', group:'第501组', score:590, rank:11500, risk:'wen'},
    // 211高校
    {name:'西安电子科技大学', group:'第501组', score:605, rank:8000, risk:'wen'},
    {name:'北京邮电大学', group:'第501组', score:620, rank:4900, risk:'chong'},
    {name:'上海财经大学', group:'第501组', score:608, rank:7500, risk:'wen'},
    {name:'中央财经大学', group:'第501组', score:610, rank:6800, risk:'wen'},
    {name:'南京航空航天大学', group:'第501组', score:600, rank:9200, risk:'wen'},
    {name:'南京理工大学', group:'第501组', score:598, rank:9800, risk:'wen'},
    {name:'武汉理工大学', group:'第501组', score:595, rank:10500, risk:'wen'},
    {name:'西南交通大学', group:'第501组', score:590, rank:11500, risk:'wen'},
    {name:'暨南大学', group:'第501组', score:592, rank:11000, risk:'wen'},
    {name:'中南财经政法大学', group:'第501组', score:585, rank:13000, risk:'wen'},
    // 江西省内
    {name:'南昌大学', group:'第504组(热门)', score:605, rank:9387, risk:'wen'},
    {name:'南昌大学', group:'第502组(大组)', score:581, rank:19135, risk:'wen'},
    {name:'南昌大学', group:'第505组(门槛)', score:563, rank:29989, risk:'bao'},
    {name:'江西财经大学', group:'第501组(高分)', score:579, rank:20067, risk:'wen'},
    {name:'江西财经大学', group:'第505组(门槛)', score:526, rank:59126, risk:'bao'},
    {name:'江西师范大学', group:'第50G组(高分)', score:565, rank:28603, risk:'wen'},
    {name:'江西师范大学', group:'第50C组(门槛)', score:528, rank:57086, risk:'bao'},
    {name:'华东交通大学', group:'第501组', score:502, rank:84648, risk:'bao'},
    {name:'南昌航空大学', group:'第501组', score:512, rank:73556, risk:'bao'},
    {name:'江西理工大学', group:'第501组', score:532, rank:53080, risk:'bao'},
    {name:'赣南师范大学', group:'第501组', score:495, rank:93193, risk:'bao'},
    {name:'井冈山大学', group:'第501组', score:488, rank:101798, risk:'bao'},
    {name:'东华理工大学', group:'第501组', score:448, rank:150379, risk:'bao'},
    {name:'江西农业大学', group:'第501组', score:448, rank:150379, risk:'bao'},
  ];

  // ═══ Province mode mapping ═══
  const provinceModes = {
    '浙江':'major-college','山东':'major-college','河北':'major-college',
    '辽宁':'major-college','重庆':'major-college','贵州':'major-college',
    '北京':'college-group','上海':'college-group','天津':'college-group',
    '广东':'college-group','江苏':'college-group','湖北':'college-group',
    '湖南':'college-group','福建':'college-group','安徽':'college-group',
    '江西':'college-group','四川':'college-group','河南':'college-group',
    '山西':'college-group','陕西':'college-group','云南':'college-group',
    '海南':'college-group','甘肃':'college-group','黑龙江':'college-group',
    '吉林':'college-group','广西':'college-group','内蒙古':'college-group',
    '青海':'college-group','宁夏':'college-group','新疆':'college-group',
    '西藏':'college-group',
  };

  // ═══ Score → Rank (based on Jiangxi 2024 一分一段表) ═══
  function scoreToRank(score) {
    if (!score || score < 200 || score > 750) return null;
    const points = Object.keys(scoreToRankPhysical).map(Number).sort((a,b) => b-a);
    for (const p of points) {
      if (score >= p) {
        // Linear interpolation
        const nextP = points[points.indexOf(p) - 1];
        if (!nextP || score === p) return scoreToRankPhysical[p];
        const ratio = (score - p) / (nextP - p);
        const rank = scoreToRankPhysical[p] + (scoreToRankPhysical[nextP] - scoreToRankPhysical[p]) * (1 - ratio);
        return Math.round(rank);
      }
    }
    return scoreToRankPhysical[448]; // below batch line
  }

  // ═══ Build mock entries based on score ═══
  function buildMockEntries(userRank) {
    if (!userRank) return [];
    return realAdmissions
      .map(entry => {
        const diff = userRank - entry.rank;
        // userRank < entry.rank → user is better (more competitive)
        // userRank > entry.rank → user is worse (need to reach)
        const pct = entry.rank > 0 ? diff / entry.rank : 0;
        let risk;
        if (pct > 0.08) risk = null;              // way out of reach, skip
        else if (pct > 0) risk = 'chong';          // user slightly worse → 冲
        else if (pct > -0.15) risk = 'wen';        // close match → 稳
        else risk = 'bao';                          // user much better → 保

        return {
          name: `${entry.name}-${entry.group}`,
          score: entry.score,
          rank: entry.rank,
          risk: risk,
          riskLabel: risk === 'chong' ? '冲' : risk === 'wen' ? '稳' : risk === 'bao' ? '保' : '—',
          probability: risk === 'chong' ? '较低' : risk === 'wen' ? '适中' : risk === 'bao' ? '较高' : '—',
        };
      })
      .filter(e => e.risk !== null) // only show relevant entries
      .sort((a, b) => {
        const riskOrder = { chong: 0, wen: 1, bao: 2 };
        if (riskOrder[a.risk] !== riskOrder[b.risk]) return riskOrder[a.risk] - riskOrder[b.risk];
        return a.rank - b.rank;
      })
      .slice(0, 30); // limit to 30 results
  }

  let currentEntries = [];

  function renderMockTable() {
    if (!mockTable) return;
    if (currentEntries.length === 0) {
      mockTable.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--t2)">请输入高考分数，查看匹配的院校推荐</td></tr>`;
      return;
    }
    mockTable.innerHTML = currentEntries.map((entry, i) => `
      <tr class="mock-row" draggable="true" data-idx="${i}">
        <td style="color:var(--t2);width:40px;font-size:12px">${i+1}</td>
        <td>
          <div style="font-weight:500;color:var(--t0)">${entry.name}</div>
          <div style="font-size:11px;color:var(--t2)">2024投档线: ${entry.score}分 | 位次: ${entry.rank.toLocaleString()}</div>
        </td>
        <td><span class="badge badge--silver">${entry.rank.toLocaleString()}</span></td>
        <td>
          <span class="badge badge--${entry.risk==='chong'?'warn':entry.risk==='wen'?'green':'info'}">${entry.riskLabel}</span>
          <span style="font-size:11px;color:var(--t2);margin-left:4px">概率${entry.probability}</span>
        </td>
        <td><button class="btn btn--ghost" style="padding:4px 10px;font-size:11px" data-action="remove" data-idx="${i}">✕</button></td>
      </tr>
    `).join('');
    setupDragDrop();
  }

  function setupDragDrop() {
    const rows = mockTable.querySelectorAll('.mock-row');
    rows.forEach(row => {
      row.addEventListener('dragstart', e => {
        row.classList.add('dragging');
        e.dataTransfer.setData('text/plain', row.dataset.idx);
      });
      row.addEventListener('dragend', () => row.classList.remove('dragging'));
      row.addEventListener('dragover', e => { e.preventDefault(); row.classList.add('drag-over'); });
      row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
      row.addEventListener('drop', e => {
        e.preventDefault(); row.classList.remove('drag-over');
        const from = e.dataTransfer.getData('text/plain');
        const to = row.dataset.idx;
        if (from !== to) {
          const item = currentEntries.splice(from, 1)[0];
          currentEntries.splice(to, 0, item);
          renderMockTable();
        }
      });
    });
    mockTable.querySelectorAll('[data-action="remove"]').forEach(btn => {
      btn.addEventListener('click', () => { currentEntries.splice(btn.dataset.idx, 1); renderMockTable(); });
    });
  }

  // ═══ Score input → auto rank + build entries ═══
  let dragonFired = false;
  scoreInput.addEventListener('input', () => {
    const score = parseInt(scoreInput.value);
    if (score && score >= 200 && score <= 750) {
      const rank = scoreToRank(score);
      if (rank) {
        rankDisplay.textContent = rank.toLocaleString();
        currentEntries = buildMockEntries(rank);
      } else {
        rankDisplay.textContent = '—';
        currentEntries = [];
      }
    } else {
      rankDisplay.textContent = '—';
      currentEntries = [];
    }
    renderMockTable();
  });

  // ═══ 奶龙吃分 +20 带提示 ═══
  var hintEl = document.createElement('div');
  hintEl.style.cssText = 'margin-top:8px;padding:10px 14px;background:var(--accent-glow);border-radius:var(--r-sm);font-size:13px;color:var(--fx-r);font-weight:600;line-height:1.6;opacity:0;transition:opacity .35s ease;display:none;';
  hintEl.innerHTML = '🐉 <strong>奶龙吃掉了你的分数！</strong><br><span style="font-size:12px;color:var(--t1);">你实际的分数一定会比你预估的分数低 20 分，已自动 +20</span>';
  scoreInput.parentNode.appendChild(hintEl);

  var hintTimer = null;
  var hasEaten = false;
  scoreInput.addEventListener('blur', function () {
    var score = parseInt(scoreInput.value);
    if (!score || score < 200 || score > 750) return;

    // Show the dragon hint
    hintEl.style.display = 'block';
    requestAnimationFrame(function () { hintEl.style.opacity = '1'; });
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () {
      hintEl.style.opacity = '0';
      setTimeout(function () { hintEl.style.display = 'none'; }, 350);
    }, 5000);

    // Add 20 points (奶龙吃分)
    if (!hasEaten && score <= 730) {
      hasEaten = true;
      var newScore = Math.min(score + 20, 750);
      // Animate the score change
      scoreInput.style.transition = 'transform .3s var(--ease-spring)';
      scoreInput.style.transform = 'scale(0.85)';
      setTimeout(function () {
        scoreInput.value = newScore;
        scoreInput.style.transform = 'scale(1.05)';
        setTimeout(function () {
          scoreInput.style.transform = 'scale(1)';
          scoreInput.dispatchEvent(new Event('input'));
        }, 150);
      }, 200);
    }
  });

  // Province → mode
  provinceSelect.addEventListener('change', () => {
    const mode = provinceModes[provinceSelect.value];
    if (mode === 'major-college') {
      modeIndicator.innerHTML = '<span style="color:var(--ok)">专业+院校模式 · 无调剂</span>';
    } else if (mode === 'college-group') {
      modeIndicator.innerHTML = `<span style="color:var(--warn)">院校专业组模式 · 组内调剂</span>
        <div style="font-size:11px;color:var(--t2);margin-top:2px">江西省可填报45个院校专业组志愿</div>`;
    } else {
      modeIndicator.innerHTML = '<span style="color:var(--t2)">请选择省份</span>';
    }

    // Rebuild with current score for new province context
    if (scoreInput.value) scoreInput.dispatchEvent(new Event('input'));
  });

  // Init Jiangxi default
  if (provinceSelect.value === '江西') {
    provinceSelect.dispatchEvent(new Event('change'));
  }

  // Countdown
  function updateCountdown() {
    const now = new Date();
    const deadline = new Date(now.getTime() + 3*86400000 + 14*3600000 + 22*60000);
    const diff = deadline - now;
    if (diff <= 0) { countdownEl.textContent = '已截止'; return; }
    const d = Math.floor(diff/86400000), h = Math.floor((diff%86400000)/3600000), m = Math.floor((diff%3600000)/60000);
    countdownEl.innerHTML = `⏱ 距离截止: <strong>${d}天 ${h}时 ${m}分</strong>`;
  }
  updateCountdown(); setInterval(updateCountdown, 30000);

  submitBtn.addEventListener('click', () => {
    if (currentEntries.length === 0) { alert('请先输入分数查看推荐院校'); return; }
    modalOverlay.classList.add('open');
  });
  modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) modalOverlay.classList.remove('open'); });

  // Demo: 宋昭捷 750 → auto populate
  if (scoreInput && !scoreInput.value) {
    scoreInput.value = '750';
    scoreInput.dispatchEvent(new Event('input'));
  }

  renderMockTable();
})();
