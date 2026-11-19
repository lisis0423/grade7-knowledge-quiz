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
      },
      {
        id: 'math-7b-1',
        title: '第五章 相交线与平行线',
        subtitle: '对顶角、邻补角、垂线与平行线判定',
        questions: [
          {
            id: 'math7b1-q1',
            type: 'choice',
            stem: '两条直线相交，对顶角的关系是（　）',
            options: ['相等', '互补', '互余', '无法确定'],
            answer: 0,
            explain: '对顶角是两个角的两边互为反向延长线，对顶角相等。'
          },
          {
            id: 'math7b1-q2',
            type: 'judge',
            stem: '邻补角的两角之和等于 180°。',
            answer: true,
            explain: '邻补角既相邻又互补，所以它们的和是 180°。'
          },
          {
            id: 'math7b1-q3',
            type: 'choice',
            stem: '从直线外一点到这条直线的所有线段中，最短的是（　）',
            options: ['垂线段', '斜线段', '最长的那条', '无法比较'],
            answer: 0,
            explain: '垂线段最短，这个长度就是点到直线的距离。'
          },
          {
            id: 'math7b1-q4',
            type: 'choice',
            stem: '两条直线被第三条直线所截，如果同位角相等，那么这两条直线（　）',
            options: ['平行', '垂直', '相交', '重合'],
            answer: 0,
            explain: '同位角相等，两直线平行，这是平行线的判定方法之一。'
          },
          {
            id: 'math7b1-q5',
            type: 'judge',
            stem: '两直线平行，内错角相等。',
            answer: true,
            explain: '这是平行线的性质：两直线平行，同位角相等、内错角相等、同旁内角互补。'
          },
          {
            id: 'math7b1-q6',
            type: 'choice',
            stem: '两条直线被第三条直线所截，同旁内角互补，则这两条直线（　）',
            options: ['平行', '垂直', '相交', '无法判断'],
            answer: 0,
            explain: '同旁内角互补，两直线平行，这是平行线的又一种判定方法。'
          },
          {
            id: 'math7b1-q7',
            type: 'judge',
            stem: '平移不改变图形的形状和大小。',
            answer: true,
            explain: '平移只改变图形的位置，不改变图形的形状和大小。'
          },
          {
            id: 'math7b1-q8',
            type: 'fill',
            stem: '两条平行线被第三条直线所截，同位角 ____。',
            accept: ['相等', '一样'],
            explain: '平行线的性质之一：两直线平行，同位角相等。'
          }
        ]
      },
      {
        id: 'math-7b-2',
        title: '第六章 实数',
        subtitle: '平方根、立方根、无理数与实数',
        questions: [
          {
            id: 'math7b2-q1',
            type: 'choice',
            stem: '9 的算术平方根是（　）',
            options: ['3', '−3', '9', '81'],
            answer: 0,
            explain: '算术平方根是非负的平方根，3² = 9，所以 9 的算术平方根是 3。'
          },
          {
            id: 'math7b2-q2',
            type: 'choice',
            stem: '√16 的值是（　）',
            options: ['4', '−4', '8', '2'],
            answer: 0,
            explain: '4² = 16，所以 √16 = 4。注意根号表示算术平方根，结果非负。'
          },
          {
            id: 'math7b2-q3',
            type: 'choice',
            stem: '8 的立方根是（　）',
            options: ['2', '−2', '4', '3'],
            answer: 0,
            explain: '2³ = 8，所以 8 的立方根是 2。'
          },
          {
            id: 'math7b2-q4',
            type: 'choice',
            stem: '下列各数中，是无理数的是（　）',
            options: ['π', '0.5', '七分之二十二', '0'],
            answer: 0,
            explain: '无理数是无限不循环小数，π 是典型的无理数；0.5、分数和 0 都是有理数。'
          },
          {
            id: 'math7b2-q5',
            type: 'judge',
            stem: '负数没有平方根。',
            answer: true,
            explain: '任何数的平方都非负，所以负数在实数范围内没有平方根。'
          },
          {
            id: 'math7b2-q6',
            type: 'fill',
            stem: '27 的立方根是 ____。',
            accept: ['3'],
            hint: '想一个数的三次方等于 27',
            explain: '3³ = 27，所以 27 的立方根是 3。'
          },
          {
            id: 'math7b2-q7',
            type: 'judge',
            stem: '实数与数轴上的点一一对应。',
            answer: true,
            explain: '每一个实数都可以用数轴上的一个点表示，数轴上的每一个点都表示一个实数。'
          },
          {
            id: 'math7b2-q8',
            type: 'choice',
            stem: '计算 √25 + ∛8 的结果是（　）',
            options: ['7', '5', '3', '13'],
            answer: 0,
            explain: '√25 = 5，∛8 = 2，所以 5 + 2 = 7。'
          }
        ]
      },
      {
        id: 'math-7b-3',
        title: '第七章 平面直角坐标系',
        subtitle: '点的坐标、象限与平移',
        questions: [
          {
            id: 'math7b3-q1',
            type: 'choice',
            stem: '点 (3, −2) 在（　）',
            options: ['第四象限', '第一象限', '第二象限', '第三象限'],
            answer: 0,
            explain: '横坐标为正、纵坐标为负的点在第四象限。'
          },
          {
            id: 'math7b3-q2',
            type: 'choice',
            stem: 'x 轴上的点的坐标特点是（　）',
            options: ['纵坐标为 0', '横坐标为 0', '横纵坐标都为 0', '横纵坐标相等'],
            answer: 0,
            explain: 'x 轴上的点纵坐标为 0，y 轴上的点横坐标为 0。'
          },
          {
            id: 'math7b3-q3',
            type: 'choice',
            stem: '点 (−1, 4) 在（　）',
            options: ['第二象限', '第一象限', '第三象限', '第四象限'],
            answer: 0,
            explain: '横坐标为负、纵坐标为正的点在第二象限。'
          },
          {
            id: 'math7b3-q4',
            type: 'judge',
            stem: '原点的坐标是 (0, 0)。',
            answer: true,
            explain: '原点是 x 轴与 y 轴的交点，横、纵坐标都是 0。'
          },
          {
            id: 'math7b3-q5',
            type: 'choice',
            stem: '把点 (2, 3) 向右平移 3 个单位长度，得到的点的坐标是（　）',
            options: ['(5, 3)', '(2, 6)', '(−1, 3)', '(5, 6)'],
            answer: 0,
            explain: '向右平移只改变横坐标，横坐标加 3、纵坐标不变，得到 (5, 3)。'
          },
          {
            id: 'math7b3-q6',
            type: 'fill',
            stem: '点 A(−2, 5) 的横坐标是 ____。',
            accept: ['-2', '−2'],
            explain: '点的坐标写作 (横坐标, 纵坐标)，所以 A(−2, 5) 的横坐标是 −2。'
          },
          {
            id: 'math7b3-q7',
            type: 'judge',
            stem: '平行于 y 轴的直线上的点，横坐标都相同。',
            answer: true,
            explain: '平行于 y 轴的直线是竖直的，所有点的横坐标相同，纵坐标不同。'
          },
          {
            id: 'math7b3-q8',
            type: 'choice',
            stem: '点 P(0, −3) 在（　）',
            options: ['y 轴上', 'x 轴上', '第一象限', '原点'],
            answer: 0,
            explain: '横坐标为 0 的点在 y 轴上，P(0, −3) 位于 y 轴负半轴。'
          }
        ]
      },
      {
        id: 'math-7b-4',
        title: '第八章 二元一次方程组',
        subtitle: '代入消元、加减消元与实际应用',
        questions: [
          {
            id: 'math7b4-q1',
            type: 'choice',
            stem: '下列式子中，是二元一次方程的是（　）',
            options: ['x + y = 5', 'x² + y = 1', 'x分之1 + y = 2', 'xy = 3'],
            answer: 0,
            explain: '二元一次方程含有两个未知数，且未知数的次数都是 1。x + y = 5 符合。'
          },
          {
            id: 'math7b4-q2',
            type: 'choice',
            stem: '方程组 x + y = 5，x − y = 1 的解是（　）',
            options: ['x = 3，y = 2', 'x = 2，y = 3', 'x = 4，y = 1', 'x = 5，y = 0'],
            answer: 0,
            explain: '两式相加得 2x = 6，x = 3；代入 x + y = 5 得 y = 2。'
          },
          {
            id: 'math7b4-q3',
            type: 'judge',
            stem: '解二元一次方程组可以用代入消元法。',
            answer: true,
            explain: '代入消元法和加减消元法都是解二元一次方程组的基本方法。'
          },
          {
            id: 'math7b4-q4',
            type: 'choice',
            stem: '方程组 2x + y = 7，x = y + 2 的解是（　）',
            options: ['x = 3，y = 1', 'x = 1，y = 3', 'x = 2，y = 2', 'x = 4，y = 1'],
            answer: 0,
            explain: '把 x = y + 2 代入 2x + y = 7，得 2(y + 2) + y = 7，解得 y = 1，x = 3。'
          },
          {
            id: 'math7b4-q5',
            type: 'fill',
            stem: '方程 x + y = 4 的一组正整数解是 x = 1，y = ____。',
            accept: ['3'],
            explain: '把 x = 1 代入 x + y = 4，得 y = 3。'
          },
          {
            id: 'math7b4-q6',
            type: 'choice',
            stem: '解方程组时，把两个方程相加或相减消去一个未知数，这种方法叫（　）',
            options: ['加减消元法', '代入消元法', '因式分解法', '配方法'],
            answer: 0,
            explain: '通过把两个方程相加或相减来消元的方法叫加减消元法。'
          },
          {
            id: 'math7b4-q7',
            type: 'choice',
            stem: '鸡兔同笼，共有 10 个头、28 只脚，鸡和兔各有（　）',
            options: ['鸡 6 只，兔 4 只', '鸡 4 只，兔 6 只', '鸡 5 只，兔 5 只', '鸡 7 只，兔 3 只'],
            answer: 0,
            explain: '设鸡 x 只、兔 y 只，x + y = 10，2x + 4y = 28，解得 x = 6，y = 4。'
          },
          {
            id: 'math7b4-q8',
            type: 'judge',
            stem: '一个二元一次方程有无数个解。',
            answer: true,
            explain: '二元一次方程对应一条直线，直线上的点有无数个，所以有无数个解。'
          }
        ]
      },
      {
        id: 'math-7b-5',
        title: '第九章 不等式与不等式组',
        subtitle: '不等式性质、解集与数轴表示',
        questions: [
          {
            id: 'math7b5-q1',
            type: 'choice',
            stem: '不等式两边同时乘以 −2，不等号的方向（　）',
            options: ['改变', '不变', '一定变成等号', '无法确定'],
            answer: 0,
            explain: '不等式两边乘（或除以）同一个负数，不等号方向要改变。'
          },
          {
            id: 'math7b5-q2',
            type: 'choice',
            stem: '不等式 2x > 6 的解集是（　）',
            options: ['x > 3', 'x < 3', 'x > 12', 'x < 12'],
            answer: 0,
            explain: '两边同除以 2（正数），不等号方向不变，得 x > 3。'
          },
          {
            id: 'math7b5-q3',
            type: 'choice',
            stem: '不等式 −3x < 6 的解集是（　）',
            options: ['x > −2', 'x < −2', 'x > 2', 'x < 2'],
            answer: 0,
            explain: '两边同除以 −3，不等号方向改变，得 x > −2。'
          },
          {
            id: 'math7b5-q4',
            type: 'judge',
            stem: '在数轴上表示 x ≥ 2 时，2 对应的点用实心圆点。',
            answer: true,
            explain: '含有等号（≥、≤）时用实心圆点，不含等号（>、<）时用空心圆圈。'
          },
          {
            id: 'math7b5-q5',
            type: 'choice',
            stem: '不等式组 x > 1，x < 4 的解集是（　）',
            options: ['1 < x < 4', 'x > 4', 'x < 1', '无解'],
            answer: 0,
            explain: '两个解集的公共部分是 1 < x < 4，即“大小小大中间找”。'
          },
          {
            id: 'math7b5-q6',
            type: 'fill',
            stem: '不等式 x − 3 < 5 的解集是 x < ____。',
            accept: ['8'],
            explain: '移项得 x < 5 + 3，即 x < 8。'
          },
          {
            id: 'math7b5-q7',
            type: 'choice',
            stem: '某数的 3 倍不小于 12，用不等式表示并求解，结果是（　）',
            options: ['x ≥ 4', 'x ≤ 4', 'x > 4', 'x < 4'],
            answer: 0,
            explain: '“不小于”即大于或等于，3x ≥ 12，两边除以 3 得 x ≥ 4。'
          },
          {
            id: 'math7b5-q8',
            type: 'judge',
            stem: '不等式两边同时加上同一个数，不等号的方向不变。',
            answer: true,
            explain: '不等式两边加（或减）同一个数，不等号方向不变；乘除负数才改变方向。'
          }
        ]
      },
      {
        id: 'math-7b-6',
        title: '第十章 数据的收集、整理与描述',
        subtitle: '全面调查、抽样调查与统计图',
        questions: [
          {
            id: 'math7b6-q1',
            type: 'choice',
            stem: '要了解全班同学的身高情况，最适合采用（　）',
            options: ['全面调查', '抽样调查', '只问几个好朋友', '估计一下'],
            answer: 0,
            explain: '班级人数少、范围小，适合全面调查，结果更准确。'
          },
          {
            id: 'math7b6-q2',
            type: 'choice',
            stem: '为了解全校 2000 名学生的视力，抽取 200 名学生进行调查，样本是（　）',
            options: ['抽取的 200 名学生的视力', '全校 2000 名学生', '每一名学生', '200'],
            answer: 0,
            explain: '总体是全校学生的视力，样本是抽取的 200 名学生的视力，个体是每名学生的视力。'
          },
          {
            id: 'math7b6-q3',
            type: 'choice',
            stem: '能清楚表示各部分占总体的百分比的统计图是（　）',
            options: ['扇形统计图', '条形统计图', '折线统计图', '频数分布直方图'],
            answer: 0,
            explain: '扇形统计图用扇形的大小表示各部分占总体的百分比。'
          },
          {
            id: 'math7b6-q4',
            type: 'choice',
            stem: '能直观反映数据变化趋势的统计图是（　）',
            options: ['折线统计图', '扇形统计图', '条形统计图', '直方图'],
            answer: 0,
            explain: '折线统计图能清楚反映数据的变化趋势。'
          },
          {
            id: 'math7b6-q5',
            type: 'judge',
            stem: '抽样调查时，样本要具有代表性。',
            answer: true,
            explain: '样本要有代表性、随机性，才能较好地反映总体情况。'
          },
          {
            id: 'math7b6-q6',
            type: 'fill',
            stem: '抽取 200 名学生进行调查，这次调查的样本容量是 ____。',
            accept: ['200'],
            explain: '样本容量是样本中个体的数目，这里是 200。'
          },
          {
            id: 'math7b6-q7',
            type: 'judge',
            stem: '条形统计图能清楚地表示出每个项目的具体数目。',
            answer: true,
            explain: '条形统计图用直条的高度表示数量，便于比较各项目的具体数目。'
          },
          {
            id: 'math7b6-q8',
            type: 'choice',
            stem: '把数据分组后，各组数据的频数用直方图表示，这种图叫（　）',
            options: ['频数分布直方图', '扇形统计图', '折线统计图', '条形统计图'],
            answer: 0,
            explain: '频数分布直方图用来表示分组数据的频数分布情况。'
          }
        ]
      }
    ]
  });
})();