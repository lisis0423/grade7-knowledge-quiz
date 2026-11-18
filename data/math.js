/* ============================================================
   数学 · 七年级上册（人教版）
   第一章 有理数 / 第二章 整式的加减
   第三章 一元一次方程 / 第四章 几何图形初步
   ============================================================ */
(function () {
  'use strict';

  GameSubjects.register({
    id: 'math',
    name: '数学',
    icon: '📐',
    color: '#3b6ea8',
    desc: '有理数 · 整式 · 一元一次方程 · 几何图形',
    order: 2,
    levels: [
      {
        id: 'math-7a-1',
        title: '第一章 有理数',
        subtitle: '正负数、数轴、相反数、绝对值与运算',
        questions: [
          {
            id: 'math7a1-q1',
            type: 'choice',
            stem: '−5 的相反数是（　）',
            options: ['5', '−5', '0', '五分之一'],
            answer: 0,
            explain: '只有符号不同的两个数互为相反数，所以 −5 的相反数是 5。'
          },
          {
            id: 'math7a1-q2',
            type: 'choice',
            stem: '|−3| 的值是（　）',
            options: ['3', '−3', '0', '三分之一'],
            answer: 0,
            explain: '绝对值表示一个数在数轴上到原点的距离，距离不能为负，所以 |−3| = 3。'
          },
          {
            id: 'math7a1-q3',
            type: 'choice',
            stem: '在数轴上，表示 −2 的点位于原点的（　）',
            options: ['左侧', '右侧', '上方', '无法确定'],
            answer: 0,
            explain: '数轴上规定向右为正，所以负数都在原点左侧，−2 在原点左边 2 个单位处。'
          },
          {
            id: 'math7a1-q4',
            type: 'judge',
            stem: '0 既不是正数，也不是负数。',
            answer: true,
            explain: '0 是正数与负数的分界，既不属于正数，也不属于负数。'
          },
          {
            id: 'math7a1-q5',
            type: 'choice',
            stem: '计算 (−3) + (−5) 的结果是（　）',
            options: ['−8', '8', '−2', '2'],
            answer: 0,
            explain: '同号两数相加，取相同的符号，并把绝对值相加：3 + 5 = 8，所以结果是 −8。'
          },
          {
            id: 'math7a1-q6',
            type: 'choice',
            stem: '计算 (−2) × 3 的结果是（　）',
            options: ['−6', '6', '−5', '5'],
            answer: 0,
            explain: '异号两数相乘得负，绝对值相乘得 6，所以结果是 −6。'
          },
          {
            id: 'math7a1-q7',
            type: 'fill',
            stem: '−7 的绝对值是 ____。',
            accept: ['7', '+7'],
            hint: '填一个数',
            explain: '绝对值是到原点的距离，−7 到原点的距离是 7，所以 |−7| = 7。'
          },
          {
            id: 'math7a1-q8',
            type: 'judge',
            stem: '两个负数比较大小，绝对值大的那个数反而小。',
            answer: true,
            explain: '例如 −7 与 −3，|−7| > |−3|，但 −7 < −3。负数在数轴上越往左越小。'
          },
          {
            id: 'math7a1-q9',
            type: 'choice',
            stem: '计算 (−12) ÷ (−4) 的结果是（　）',
            options: ['3', '−3', '4', '−4'],
            answer: 0,
            explain: '同号两数相除得正，12 ÷ 4 = 3，所以结果是 3。'
          }
        ]
      },
      {
        id: 'math-7a-2',
        title: '第二章 整式的加减',
        subtitle: '单项式、多项式、同类项、合并与去括号',
        questions: [
          {
            id: 'math7a2-q1',
            type: 'choice',
            stem: '单项式 −3x²y 的系数是（　）',
            options: ['−3', '3', '−3x²', '2'],
            answer: 0,
            explain: '单项式中的数字因数叫系数，−3x²y 的数字因数是 −3。'
          },
          {
            id: 'math7a2-q2',
            type: 'choice',
            stem: '单项式 2a²b 的次数是（　）',
            options: ['3', '2', '1', '4'],
            answer: 0,
            explain: '单项式的次数是所有字母指数的和：a 的指数是 2，b 的指数是 1，2 + 1 = 3。'
          },
          {
            id: 'math7a2-q3',
            type: 'judge',
            stem: '3a 与 3b 是同类项。',
            answer: false,
            explain: '同类项要求所含字母相同，并且相同字母的指数也相同。3a 与 3b 字母不同，不是同类项。'
          },
          {
            id: 'math7a2-q4',
            type: 'choice',
            stem: '合并同类项 2x + 3x 的结果是（　）',
            options: ['5x', '5x²', '6x', '5'],
            answer: 0,
            explain: '合并同类项时系数相加、字母和指数不变：2x + 3x = (2 + 3)x = 5x。'
          },
          {
            id: 'math7a2-q5',
            type: 'choice',
            stem: '去括号：−(a − b) 的结果是（　）',
            options: ['−a + b', '−a − b', 'a − b', 'a + b'],
            answer: 0,
            explain: '括号前是负号，去括号时括号内各项都要变号：−(a − b) = −a + b。'
          },
          {
            id: 'math7a2-q6',
            type: 'fill',
            stem: '多项式 x² + 2x − 1 的常数项是 ____。',
            accept: ['-1', '−1'],
            hint: '注意带上负号',
            explain: '不含字母的项叫常数项，x² + 2x − 1 中不含字母的项是 −1。'
          },
          {
            id: 'math7a2-q7',
            type: 'choice',
            stem: '下列式子中，属于多项式的是（　）',
            options: ['x² + 1', '3x', '五分之x', '2'],
            answer: 0,
            explain: '几个单项式的和叫多项式。x² + 1 是两个单项式 x² 与 1 的和，其余三项都是单项式。'
          },
          {
            id: 'math7a2-q8',
            type: 'judge',
            stem: '2(x + 1) = 2x + 2。',
            answer: true,
            explain: '根据乘法分配律，2 分别乘 x 和 1，得到 2x + 2。'
          }
        ]
      },
      {
        id: 'math-7a-3',
        title: '第三章 一元一次方程',
        subtitle: '方程、等式性质、解方程与实际问题',
        questions: [
          {
            id: 'math7a3-q1',
            type: 'choice',
            stem: '下列式子中，是一元一次方程的是（　）',
            options: ['2x + 1 = 5', 'x² = 4', 'x + y = 3', 'x分之1 = 2'],
            answer: 0,
            explain: '一元一次方程只含一个未知数，未知数的次数是 1，且是整式方程。2x + 1 = 5 符合。'
          },
          {
            id: 'math7a3-q2',
            type: 'choice',
            stem: '方程 x + 3 = 7 的解是（　）',
            options: ['x = 4', 'x = 10', 'x = −4', 'x = 3'],
            answer: 0,
            explain: '两边同时减去 3：x = 7 − 3 = 4。'
          },
          {
            id: 'math7a3-q3',
            type: 'choice',
            stem: '方程 2x − 4 = 0 的解是（　）',
            options: ['x = 2', 'x = −2', 'x = 4', 'x = 0'],
            answer: 0,
            explain: '移项得 2x = 4，两边同除以 2 得 x = 2。'
          },
          {
            id: 'math7a3-q4',
            type: 'judge',
            stem: '等式两边同时乘同一个数，所得结果仍是等式。',
            answer: true,
            explain: '这是等式的基本性质之一。注意同时除以一个数时，这个数不能为 0。'
          },
          {
            id: 'math7a3-q5',
            type: 'choice',
            stem: '解方程 3x = 2x + 5，得（　）',
            options: ['x = 5', 'x = −5', 'x = 1', 'x = 2'],
            answer: 0,
            explain: '移项：3x − 2x = 5，合并同类项得 x = 5。'
          },
          {
            id: 'math7a3-q6',
            type: 'fill',
            stem: '方程 5x = 20 的解是 x = ____。',
            accept: ['4'],
            hint: '两边同时除以 5',
            explain: '两边同时除以 5，得 x = 20 ÷ 5 = 4。'
          },
          {
            id: 'math7a3-q7',
            type: 'choice',
            stem: '方程 3(x − 1) = 6 的解是（　）',
            options: ['x = 3', 'x = 1', 'x = 2', 'x = 4'],
            answer: 0,
            explain: '两边同除以 3 得 x − 1 = 2，再移项得 x = 3。也可以先去括号：3x − 3 = 6，3x = 9。'
          },
          {
            id: 'math7a3-q8',
            type: 'choice',
            stem: '某数的 2 倍加 3 等于 11，这个数是（　）',
            options: ['4', '7', '5', '3'],
            answer: 0,
            explain: '设这个数为 x，列方程 2x + 3 = 11，解得 2x = 8，x = 4。'
          }
        ]
      },
      {
        id: 'math-7a-4',
        title: '第四章 几何图形初步',
        subtitle: '立体图形、直线射线线段、角与余角补角',
        questions: [
          {
            id: 'math7a4-q1',
            type: 'choice',
            stem: '下列立体图形中，所有面都是平面的是（　）',
            options: ['正方体', '球', '圆柱', '圆锥'],
            answer: 0,
            explain: '正方体的六个面都是正方形；球面是曲面；圆柱和圆锥都有曲面。'
          },
          {
            id: 'math7a4-q2',
            type: 'judge',
            stem: '两点之间，线段最短。',
            answer: true,
            explain: '这是线段的基本性质，也是“两点之间线段最短”的实际应用依据。'
          },
          {
            id: 'math7a4-q3',
            type: 'choice',
            stem: '1 个周角等于（　）',
            options: ['360°', '180°', '90°', '270°'],
            answer: 0,
            explain: '一条射线绕端点旋转一周所成的角叫周角，周角 = 360°。'
          },
          {
            id: 'math7a4-q4',
            type: 'choice',
            stem: '30° 角的余角是（　）',
            options: ['60°', '150°', '30°', '90°'],
            answer: 0,
            explain: '两个角的和是 90° 时互为余角，所以 30° 的余角是 90° − 30° = 60°。'
          },
          {
            id: 'math7a4-q5',
            type: 'fill',
            stem: '45° 角的补角是 ____°。',
            accept: ['135'],
            hint: '补角之和是 180°',
            explain: '两个角的和是 180° 时互为补角，所以 45° 的补角是 180° − 45° = 135°。'
          },
          {
            id: 'math7a4-q6',
            type: 'choice',
            stem: '关于直线、射线、线段，下列说法正确的是（　）',
            options: ['直线没有端点，射线有 1 个端点，线段有 2 个端点', '三者都有 2 个端点', '直线有 1 个端点', '射线可以向两端无限延伸'],
            answer: 0,
            explain: '直线向两方无限延伸、没有端点；射线向一方无限延伸、有 1 个端点；线段有两个端点。'
          },
          {
            id: 'math7a4-q7',
            type: 'judge',
            stem: '经过两点有一条直线，并且只有一条直线。',
            answer: true,
            explain: '这是直线的基本事实，常简称为“两点确定一条直线”。'
          },
          {
            id: 'math7a4-q8',
            type: 'choice',
            stem: '时钟显示 3 点整时，时针与分针的夹角是（　）',
            options: ['90°', '60°', '120°', '180°'],
            answer: 0,
            explain: '钟面被分成 12 大格，每格 30°。3 点整时相差 3 大格，3 × 30° = 90°。'
          }
        ]
      }
    ]
  });
})();