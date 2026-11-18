/* ============================================================
   其他科目的占位卡
   ------------------------------------------------------------
   这些科目暂时没有题库，首页会显示“接口已预留”。
   要接入一个科目，只需：
     1. 新建 data/math.js（参考 geography-1.js 的结构）；
     2. 在 index.html 的题库区域加一行 <script src="data/math.js"></script>；
     3. 把下面对应的 available 去掉（或改成 true），并补上 levels。
   题型支持：choice 单选 / judge 判断 / fill 填空 / match 连线。
   ============================================================ */
(function () {
  'use strict';

  var placeholders = [
    { id: 'math', name: '数学', icon: '📐', desc: '有理数、整式、方程、几何图形初步', order: 2 },
    { id: 'chinese', name: '语文', icon: '📖', desc: '字词、古诗文、名著与阅读理解', order: 3 },
    { id: 'english', name: '英语', icon: '🔤', desc: '词汇、语法、情景交际', order: 4 },
    { id: 'biology', name: '生物', icon: '🌱', desc: '细胞、生物圈、人体的结构与功能', order: 5 },
    { id: 'history', name: '历史', icon: '🏺', desc: '中国古代史、近代史重要事件', order: 6 },
    { id: 'politics', name: '道德与法治', icon: '⚖️', desc: '成长中的我、交往与法治常识', order: 7 }
  ];

  placeholders.forEach(function (item) {
    GameSubjects.register({
      id: item.id,
      name: item.name,
      icon: item.icon,
      desc: item.desc,
      order: item.order,
      available: false,
      levels: []
    });
  });
})();