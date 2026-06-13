/**
 * Section 2: Step-by-step guide — calculators, accordions, checklist
 */
(function() {
  'use strict';

  // ═══ Accordion ═══
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      item.classList.toggle('open');
    });
  });

  // ═══ 冲稳保 Calculator ═══
  const rankInput = document.getElementById('calc-rank');
  const calcBtn = document.getElementById('calc-btn');
  const calcResult = document.getElementById('calc-result');

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const rank = parseInt(rankInput.value);
      if (!rank || rank < 1) { calcResult.innerHTML = '<p class="sm">请输入有效位次</p>'; return; }
      const chongHi = Math.round(rank * 0.88);
      const chongLo = Math.round(rank * 0.95);
      const wenHi = Math.round(rank * 0.98);
      const wenLo = Math.round(rank * 1.05);
      const baoHi = Math.round(rank * 1.08);
      const baoLo = Math.round(rank * 1.25);

      calcResult.innerHTML = `
        <div class="grid-3" style="margin-top:var(--md)">
          <div class="strat-card strat-card--chong">
            <div class="strat-card__icon">🚀</div>
            <div class="strat-card__title">冲刺</div>
            <div class="strat-card__desc">
              位次区间<br>
              <strong style="font-size:24px;color:var(--warn)">${chongHi.toLocaleString()} - ${chongLo.toLocaleString()}</strong><br>
              <span class="sm">占志愿总数 15%-30%</span>
            </div>
          </div>
          <div class="strat-card strat-card--wen">
            <div class="strat-card__icon">✅</div>
            <div class="strat-card__title">稳妥</div>
            <div class="strat-card__desc">
              位次区间<br>
              <strong style="font-size:24px;color:var(--ok)">${wenHi.toLocaleString()} - ${wenLo.toLocaleString()}</strong><br>
              <span class="sm">占志愿总数 40%-50%</span>
            </div>
          </div>
          <div class="strat-card strat-card--bao">
            <div class="strat-card__icon">🛡️</div>
            <div class="strat-card__title">保底</div>
            <div class="strat-card__desc">
              位次区间<br>
              <strong style="font-size:24px;color:var(--info)">${baoHi.toLocaleString()} - ${baoLo.toLocaleString()}</strong><br>
              <span class="sm">占志愿总数 20%-35%</span>
            </div>
          </div>
        </div>
      `;
    });
  }

  // ═══ Checklist ═══
  const checklistContainer = document.getElementById('pre-submit-checklist');
  if (checklistContainer) {
    const items = [
      '查阅目标院校《招生章程》，标注所有限制条件',
      '下载省考试院公布的一分一段表，确认自身位次',
      '对比目标院校近3年投档最低分位次，判断趋势',
      '确认志愿数量"冲稳保"梯度合理',
      '每个志愿核对身体条件、单科成绩、选科要求',
      '弄清本省是"院校专业组"还是"专业+院校"模式',
      '提前在官方系统模拟填报，熟悉操作流程',
      '保底志愿务必勾选"服从专业调剂"',
    ];

    // Load saved state
    const saved = JSON.parse(localStorage.getItem('checklist') || '[]');

    checklistContainer.innerHTML = items.map((item, i) => `
      <div class="checklist__item ${saved.includes(i) ? 'checked' : ''}" data-idx="${i}">
        <div class="checklist__box"></div>
        <span>${item}</span>
      </div>
    `).join('');

    checklistContainer.addEventListener('click', (e) => {
      const item = e.target.closest('.checklist__item');
      if (!item) return;
      const idx = parseInt(item.dataset.idx);
      item.classList.toggle('checked');
      let state = JSON.parse(localStorage.getItem('checklist') || '[]');
      if (item.classList.contains('checked')) {
        if (!state.includes(idx)) state.push(idx);
      } else {
        state = state.filter(i => i !== idx);
      }
      localStorage.setItem('checklist', JSON.stringify(state));
    });
  }

  // ═══ SVG Flow diagram connection line animation ═══
  document.querySelectorAll('.fx-line').forEach(line => {
    const len = line.getTotalLength ? line.getTotalLength() : 500;
    line.style.setProperty('--line-len', len);
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
  });
})();
