/**
 * ESTIMATE.JS — 分数预估填报引擎
 * 根据输入分数+省份+选科，匹配推荐院校
 * 数据来源：各省教育考试院公开数据、阳光高考网
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════
  // 数据：江西省 2024 本科院校录取参考位次
  // 按 物理类 最低投档位次 升序排列
  // ═══════════════════════════════════════════
  var JIANGXI_PHYSICS = [
    { name:'清华大学',         rank:80,   tier:'985', city:'北京' },
    { name:'北京大学',         rank:90,   tier:'985', city:'北京' },
    { name:'复旦大学',         rank:350,  tier:'985', city:'上海' },
    { name:'上海交通大学',     rank:380,  tier:'985', city:'上海' },
    { name:'浙江大学',         rank:550,  tier:'985', city:'杭州' },
    { name:'中国科学技术大学', rank:600,  tier:'985', city:'合肥' },
    { name:'南京大学',         rank:750,  tier:'985', city:'南京' },
    { name:'中国人民大学',     rank:900,  tier:'985', city:'北京' },
    { name:'北京航空航天大学', rank:1400, tier:'985', city:'北京' },
    { name:'同济大学',         rank:1800, tier:'985', city:'上海' },
    { name:'南开大学',         rank:2200, tier:'985', city:'天津' },
    { name:'哈尔滨工业大学',   rank:2400, tier:'985', city:'哈尔滨' },
    { name:'西安交通大学',     rank:2600, tier:'985', city:'西安' },
    { name:'武汉大学',         rank:2800, tier:'985', city:'武汉' },
    { name:'华中科技大学',     rank:3000, tier:'985', city:'武汉' },
    { name:'东南大学',         rank:3200, tier:'985', city:'南京' },
    { name:'北京理工大学',     rank:3500, tier:'985', city:'北京' },
    { name:'厦门大学',         rank:4200, tier:'985', city:'厦门' },
    { name:'中山大学',         rank:4500, tier:'985', city:'广州' },
    { name:'天津大学',         rank:4800, tier:'985', city:'天津' },
    { name:'电子科技大学',     rank:5200, tier:'985', city:'成都' },
    { name:'华南理工大学',     rank:5800, tier:'985', city:'广州' },
    { name:'西北工业大学',     rank:6200, tier:'985', city:'西安' },
    { name:'大连理工大学',     rank:6800, tier:'985', city:'大连' },
    { name:'山东大学',         rank:8000, tier:'985', city:'济南' },
    { name:'四川大学',         rank:8500, tier:'985', city:'成都' },
    { name:'中南大学',         rank:9000, tier:'985', city:'长沙' },
    { name:'湖南大学',         rank:9500, tier:'985', city:'长沙' },
    { name:'重庆大学',         rank:10000,tier:'985', city:'重庆' },
    { name:'东北大学',         rank:11500,tier:'985', city:'沈阳' },
    { name:'吉林大学',         rank:12000,tier:'985', city:'长春' },
    { name:'兰州大学',         rank:14000,tier:'985', city:'兰州' },
    { name:'中国海洋大学',     rank:15000,tier:'985', city:'青岛' },
    { name:'西北农林科技大学', rank:20000,tier:'985', city:'杨凌' },
    { name:'北京邮电大学',     rank:5500, tier:'211', city:'北京' },
    { name:'西安电子科技大学', rank:7500, tier:'211', city:'西安' },
    { name:'南京航空航天大学', rank:8500, tier:'211', city:'南京' },
    { name:'南京理工大学',     rank:9000, tier:'211', city:'南京' },
    { name:'上海财经大学',     rank:6000, tier:'211', city:'上海' },
    { name:'中央财经大学',     rank:7000, tier:'211', city:'北京' },
    { name:'对外经济贸易大学', rank:8000, tier:'211', city:'北京' },
    { name:'北京交通大学',     rank:9000, tier:'211', city:'北京' },
    { name:'中国政法大学',     rank:10000,tier:'211', city:'北京' },
    { name:'武汉理工大学',     rank:13000,tier:'211', city:'武汉' },
    { name:'西南交通大学',     rank:14000,tier:'211', city:'成都' },
    { name:'合肥工业大学',     rank:16000,tier:'211', city:'合肥' },
    { name:'河海大学',         rank:15000,tier:'211', city:'南京' },
    { name:'江南大学',         rank:17000,tier:'211', city:'无锡' },
    { name:'中国矿业大学',     rank:18000,tier:'211', city:'徐州' },
    { name:'中国地质大学(武汉)',rank:18500,tier:'211', city:'武汉' },
    { name:'华中师范大学',     rank:16000,tier:'211', city:'武汉' },
    { name:'西南大学',         rank:19000,tier:'211', city:'重庆' },
    { name:'暨南大学',         rank:12000,tier:'211', city:'广州' },
    { name:'华南师范大学',     rank:17000,tier:'211', city:'广州' },
    { name:'福州大学',         rank:16000,tier:'211', city:'福州' },
    { name:'郑州大学',         rank:18000,tier:'211', city:'郑州' },
    { name:'南昌大学',         rank:20000,tier:'211', city:'南昌' },
    { name:'安徽大学',         rank:21000,tier:'211', city:'合肥' },
    { name:'辽宁大学',         rank:23000,tier:'211', city:'沈阳' },
    { name:'太原理工大学',     rank:22000,tier:'211', city:'太原' },
    { name:'广西大学',         rank:26000,tier:'211', city:'南宁' },
    { name:'贵州大学',         rank:28000,tier:'211', city:'贵阳' },
    { name:'海南大学',         rank:30000,tier:'211', city:'海口' },
    { name:'新疆大学',         rank:32000,tier:'211', city:'乌鲁木齐' },
    { name:'石河子大学',       rank:38000,tier:'211', city:'石河子' },
    { name:'西藏大学',         rank:45000,tier:'211', city:'拉萨' },
    { name:'江西财经大学',     rank:32000,tier:'省重点', city:'南昌' },
    { name:'江西师范大学',     rank:40000,tier:'省重点', city:'南昌' },
    { name:'华东交通大学',     rank:37000,tier:'省重点', city:'南昌' },
    { name:'南昌航空大学',     rank:42000,tier:'省重点', city:'南昌' },
    { name:'江西理工大学',     rank:50000,tier:'省重点', city:'赣州' },
    { name:'东华理工大学',     rank:52000,tier:'省重点', city:'南昌' },
    { name:'江西农业大学',     rank:55000,tier:'省重点', city:'南昌' },
    { name:'井冈山大学',       rank:65000,tier:'公办', city:'吉安' },
    { name:'赣南师范大学',     rank:70000,tier:'公办', city:'赣州' },
    { name:'江西科技师范大学', rank:75000,tier:'公办', city:'南昌' },
  ];

  // 历史类数据（部分院校位次不同）
  var JIANGXI_HISTORY = [
    { name:'清华大学',         rank:25,   tier:'985', city:'北京' },
    { name:'北京大学',         rank:30,   tier:'985', city:'北京' },
    { name:'复旦大学',         rank:120,  tier:'985', city:'上海' },
    { name:'上海交通大学',     rank:150,  tier:'985', city:'上海' },
    { name:'中国人民大学',     rank:200,  tier:'985', city:'北京' },
    { name:'南京大学',         rank:280,  tier:'985', city:'南京' },
    { name:'浙江大学',         rank:350,  tier:'985', city:'杭州' },
    { name:'武汉大学',         rank:500,  tier:'985', city:'武汉' },
    { name:'南开大学',         rank:600,  tier:'985', city:'天津' },
    { name:'厦门大学',         rank:800,  tier:'985', city:'厦门' },
    { name:'中山大学',         rank:900,  tier:'985', city:'广州' },
    { name:'同济大学',         rank:1000, tier:'985', city:'上海' },
    { name:'北京师范大学',     rank:700,  tier:'985', city:'北京' },
    { name:'山东大学',         rank:1800, tier:'985', city:'济南' },
    { name:'四川大学',         rank:2000, tier:'985', city:'成都' },
    { name:'湖南大学',         rank:2200, tier:'985', city:'长沙' },
    { name:'中南大学',         rank:2400, tier:'985', city:'长沙' },
    { name:'吉林大学',         rank:3000, tier:'985', city:'长春' },
    { name:'兰州大学',         rank:4000, tier:'985', city:'兰州' },
    { name:'中国政法大学',     rank:1500, tier:'211', city:'北京' },
    { name:'上海财经大学',     rank:2000, tier:'211', city:'上海' },
    { name:'中央财经大学',     rank:2500, tier:'211', city:'北京' },
    { name:'对外经济贸易大学', rank:2800, tier:'211', city:'北京' },
    { name:'暨南大学',         rank:3500, tier:'211', city:'广州' },
    { name:'华中师范大学',     rank:3500, tier:'211', city:'武汉' },
    { name:'华南师范大学',     rank:4500, tier:'211', city:'广州' },
    { name:'南昌大学',         rank:5000, tier:'211', city:'南昌' },
    { name:'郑州大学',         rank:4500, tier:'211', city:'郑州' },
    { name:'福州大学',         rank:4200, tier:'211', city:'福州' },
    { name:'安徽大学',         rank:5500, tier:'211', city:'合肥' },
    { name:'广西大学',         rank:7000, tier:'211', city:'南宁' },
    { name:'贵州大学',         rank:8000, tier:'211', city:'贵阳' },
    { name:'海南大学',         rank:9000, tier:'211', city:'海口' },
    { name:'江西财经大学',     rank:8000, tier:'省重点', city:'南昌' },
    { name:'江西师范大学',     rank:10000,tier:'省重点', city:'南昌' },
  ];

  // ═══════════════════════════════════════════
  // 省份特招线/本科线参考 (2024 物理类)
  // ═══════════════════════════════════════════
  var PROVINCE_LINES = {
    '江西': { t1:518, t2:448, maxRank:180000 },
    '广东': { t1:532, t2:442, maxRank:350000 },
    '江苏': { t1:516, t2:462, maxRank:280000 },
    '湖北': { t1:520, t2:440, maxRank:250000 },
    '湖南': { t1:508, t2:434, maxRank:300000 },
    '四川': { t1:520, t2:443, maxRank:320000 },
    '河南': { t1:514, t2:440, maxRank:450000 },
    '山东': { t1:521, t2:444, maxRank:350000 },
    '浙江': { t1:594, t2:488, maxRank:280000 },
    '河北': { t1:510, t2:435, maxRank:320000 },
    '福建': { t1:518, t2:449, maxRank:200000 },
    '安徽': { t1:515, t2:445, maxRank:280000 },
  };

  // ═══════════════════════════════════════════
  // 分数 → 位次映射 (基于江西省2024一分一段表拟合)
  // ═══════════════════════════════════════════
  function scoreToRank(score, province) {
    var cfg = PROVINCE_LINES[province] || PROVINCE_LINES['江西'];
    if (score >= 700) return 30;
    if (score <= 200) return cfg.maxRank;
    // 使用指数模型拟合：score 越高，rank 越小
    // 基于江西2024数据的关键锚点拟合
    var anchors = [
      [700, 30], [680, 120], [660, 400], [640, 1200],
      [620, 3200], [600, 7500], [580, 14000], [560, 23000],
      [540, 33000], [520, 44000], [500, 58000], [480, 73000],
      [460, 90000], [448, 105000], [430, 120000], [400, 145000],
      [350, 170000], [300, 180000]
    ];
    // 二分查找最近锚点，线性插值
    for (var i = 0; i < anchors.length - 1; i++) {
      if (score >= anchors[i+1][0] && score <= anchors[i][0]) {
        var s1 = anchors[i][0], r1 = anchors[i][1];
        var s2 = anchors[i+1][0], r2 = anchors[i+1][1];
        var t = (score - s1) / (s2 - s1);
        return Math.round(r1 + (r2 - r1) * t);
      }
    }
    // 外推
    if (score > 700) return Math.max(1, Math.round(30 * Math.pow(700/score, 4)));
    return Math.round(180000 * Math.pow(300/score, 2));
  }

  // ═══════════════════════════════════════════
  // 获取院校数据
  // ═══════════════════════════════════════════
  function getSchoolData(province, subject) {
    if (province === '江西' && subject === '物理类') return JIANGXI_PHYSICS;
    if (province === '江西' && subject === '历史类') return JIANGXI_HISTORY;
    // 其他省份使用江西数据近似（标注"参考"）
    return subject === '物理类' ? JIANGXI_PHYSICS : JIANGXI_HISTORY;
  }

  // ═══════════════════════════════════════════
  // 匹配院校：冲(±20%位次)、稳(-20%~-40%)、保(>-40%)
  // ═══════════════════════════════════════════
  function matchSchools(userRank, schools) {
    var results = [];
    schools.forEach(function (s) {
      // 位次越小越好。schoolRank < userRank → 院校比你强(需要更靠前的排名)
      var ratio = (s.rank - userRank) / userRank;
      var risk;
      if (ratio < -0.20) {
        risk = 'chong';  // 冲刺：院校位次远高于你(需要更好排名)
      } else if (ratio < 0.25) {
        risk = 'wen';    // 稳妥：院校位次接近
      } else {
        risk = 'bao';    // 保底：院校位次低于你(你的排名远好于要求)
      }
      results.push({
        name: s.name,
        tier: s.tier,
        city: s.city,
        rank: s.rank,
        risk: risk,
        ratio: ratio,
      });
    });
    // 排序：冲刺在前(按位次)→稳妥→保底
    results.sort(function (a, b) {
      if (a.risk !== b.risk) {
        return a.risk === 'chong' ? -1 : a.risk === 'wen' ? 0 : 1;
      }
      return a.rank - b.rank;
    });
    // 取前20条
    return results.slice(0, 20);
  }

  // ═══════════════════════════════════════════
  // 渲染结果表格
  // ═══════════════════════════════════════════
  function renderResults(matches, userRank, score, province) {
    var tbody = document.getElementById('estTableBody');
    var summary = document.getElementById('estSummary');
    var rankEl = document.getElementById('estRank');
    var rankVal = document.getElementById('estRankVal');

    if (!tbody || !summary || !rankEl || !rankVal) return;

    // 显示位次
    rankEl.style.display = 'block';
    rankVal.textContent = userRank.toLocaleString();

    var chongCount = matches.filter(function (m) { return m.risk === 'chong'; }).length;
    var wenCount = matches.filter(function (m) { return m.risk === 'wen'; }).length;
    var baoCount = matches.filter(function (m) { return m.risk === 'bao'; }).length;

    var isOutProvince = province !== '江西';
    summary.textContent = score + '分 ≈ 全省第' + userRank.toLocaleString() + '名'
      + ' · 冲刺' + chongCount + ' 稳妥' + wenCount + ' 保底' + baoCount
      + (isOutProvince ? ' (参考江西数据)' : '');

    var html = '';
    matches.forEach(function (m, i) {
      var riskLabel = m.risk === 'chong' ? '冲刺' : m.risk === 'wen' ? '稳妥' : '保底';
      html += '<tr>';
      html += '<td class="chap-estimate__rank-cell">' + String(i + 1).padStart(2, '0') + '</td>';
      html += '<td><span class="chap-estimate__school-name">' + m.name + '</span>'
           + '<span class="chap-estimate__school-meta"> ' + m.tier + ' · ' + m.city + '</span></td>';
      html += '<td class="chap-estimate__rank-cell">' + m.rank.toLocaleString() + '</td>';
      html += '<td><span class="chap-estimate__risk chap-estimate__risk--' + m.risk + '">' + riskLabel + '</span></td>';
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  // ═══════════════════════════════════════════
  // 查询入口
  // ═══════════════════════════════════════════
  function doQuery() {
    var scoreEl = document.getElementById('estScore');
    var provinceEl = document.getElementById('estProvince');
    var subjectEl = document.getElementById('estSubject');
    var tbody = document.getElementById('estTableBody');

    var score = parseInt(scoreEl.value, 10);
    var province = provinceEl ? provinceEl.value : '江西';
    var subject = subjectEl ? subjectEl.value : '物理类';

    if (!score || score < 200 || score > 750) {
      if (tbody) tbody.innerHTML = '<tr class="chap-estimate__empty"><td colspan="4">请输入 200–750 之间的有效分数</td></tr>';
      return;
    }

    var userRank = scoreToRank(score, province);
    var schools = getSchoolData(province, subject);
    var matches = matchSchools(userRank, schools);
    renderResults(matches, userRank, score, province);
  }

  // ═══════════════════════════════════════════
  // 绑定事件
  // ═══════════════════════════════════════════
  function init() {
    var btn = document.getElementById('estBtn');
    var scoreEl = document.getElementById('estScore');

    if (!btn || !scoreEl) return;

    btn.addEventListener('click', doQuery);

    // Enter 键触发查询
    scoreEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doQuery();
    });
  }

  // DOM 就绪
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
