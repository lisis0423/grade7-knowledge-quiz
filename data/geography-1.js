/* ============================================================
   地理 · 七年级上册（第一 ~ 三章）
   人教版教材顺序：地球 / 地图 / 陆地和海洋
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 示意图 ---------- */

  var SVG_LATLON = [
    '<svg viewBox="0 0 360 250" role="img" aria-label="经纬网示意图">',
    '<rect width="360" height="250" fill="#fbf8f1"/>',
    '<g stroke="#9bb7ad" stroke-width="1.1">',
    '<line x1="60" y1="30" x2="300" y2="30"/>',
    '<line x1="60" y1="75" x2="300" y2="75"/>',
    '<line x1="60" y1="120" x2="300" y2="120" stroke="#1f6f5c" stroke-width="1.8"/>',
    '<line x1="60" y1="165" x2="300" y2="165"/>',
    '<line x1="60" y1="210" x2="300" y2="210"/>',
    '<line x1="60" y1="30" x2="60" y2="210"/>',
    '<line x1="120" y1="30" x2="120" y2="210"/>',
    '<line x1="180" y1="30" x2="180" y2="210" stroke="#1f6f5c" stroke-width="1.8"/>',
    '<line x1="240" y1="30" x2="240" y2="210"/>',
    '<line x1="300" y1="30" x2="300" y2="210"/>',
    '</g>',
    '<g font-size="11" fill="#4d5a52" font-family="sans-serif">',
    '<text x="306" y="34">60°N</text>',
    '<text x="306" y="79">30°N</text>',
    '<text x="306" y="124">0°</text>',
    '<text x="306" y="169">30°S</text>',
    '<text x="306" y="214">60°S</text>',
    '<text x="60" y="228" text-anchor="middle">60°W</text>',
    '<text x="120" y="228" text-anchor="middle">30°W</text>',
    '<text x="180" y="228" text-anchor="middle">0°</text>',
    '<text x="240" y="228" text-anchor="middle">30°E</text>',
    '<text x="300" y="228" text-anchor="middle">60°E</text>',
    '</g>',
    '<circle cx="240" cy="75" r="5" fill="#c9453a"/>',
    '<text x="247" y="69" font-size="13" font-weight="bold" fill="#c9453a">A</text>',
    '</svg>'
  ].join('');

  var SVG_ZONES = [
    '<svg viewBox="0 0 360 240" role="img" aria-label="地球五带示意图">',
    '<rect width="360" height="240" fill="#fbf8f1"/>',
    '<rect x="90" y="15" width="200" height="26" fill="#dbeaf6"/>',
    '<rect x="90" y="41" width="200" height="49" fill="#e8f3d9"/>',
    '<rect x="90" y="90" width="200" height="60" fill="#fbe6c8"/>',
    '<rect x="90" y="150" width="200" height="49" fill="#e8f3d9"/>',
    '<rect x="90" y="199" width="200" height="26" fill="#dbeaf6"/>',
    '<g stroke="#78877f" stroke-width="1" stroke-dasharray="4 3">',
    '<line x1="90" y1="41" x2="290" y2="41"/>',
    '<line x1="90" y1="90" x2="290" y2="90"/>',
    '<line x1="90" y1="150" x2="290" y2="150"/>',
    '<line x1="90" y1="199" x2="290" y2="199"/>',
    '</g>',
    '<line x1="90" y1="120" x2="290" y2="120" stroke="#c9453a" stroke-width="1.6"/>',
    '<g font-size="11" fill="#4d5a52" font-family="sans-serif">',
    '<text x="296" y="32">北寒带</text>',
    '<text x="296" y="68">北温带</text>',
    '<text x="296" y="122">热带</text>',
    '<text x="296" y="178">南温带</text>',
    '<text x="296" y="217">南寒带</text>',
    '</g>',
    '<g font-size="10" fill="#78877f" font-family="sans-serif" text-anchor="end">',
    '<text x="84" y="45">66.5°N</text>',
    '<text x="84" y="94">23.5°N</text>',
    '<text x="84" y="124">0°</text>',
    '<text x="84" y="154">23.5°S</text>',
    '<text x="84" y="203">66.5°S</text>',
    '</g>',
    '</svg>'
  ].join('');

  var SVG_CONTOUR = [
    '<svg viewBox="0 0 360 250" role="img" aria-label="等高线地形示意图">',
    '<rect width="360" height="250" fill="#fbf8f1"/>',
    '<g fill="none" stroke="#b08050" stroke-width="1.3">',
    '<ellipse cx="130" cy="130" rx="72" ry="50"/>',
    '<ellipse cx="130" cy="130" rx="52" ry="36"/>',
    '<ellipse cx="130" cy="130" rx="32" ry="22"/>',
    '<ellipse cx="130" cy="130" rx="13" ry="9"/>',
    '<ellipse cx="250" cy="108" rx="58" ry="42"/>',
    '<ellipse cx="250" cy="108" rx="40" ry="29"/>',
    '<ellipse cx="250" cy="108" rx="23" ry="16"/>',
    '<ellipse cx="250" cy="108" rx="9" ry="6"/>',
    '</g>',
    '<circle cx="130" cy="130" r="4" fill="#c9453a"/>',
    '<text x="138" y="126" font-size="13" font-weight="bold" fill="#c9453a">甲</text>',
    '<circle cx="190" cy="118" r="4" fill="#1f6f5c"/>',
    '<text x="197" y="114" font-size="13" font-weight="bold" fill="#1f6f5c">乙</text>',
    '</svg>'
  ].join('');

  var SVG_CONTINENTS = [
    '<svg viewBox="0 0 380 220" role="img" aria-label="七大洲面积柱状图">',
    '<rect width="380" height="220" fill="#fbf8f1"/>',
    '<line x1="30" y1="180" x2="362" y2="180" stroke="#c9bfa9" stroke-width="1.2"/>',
    '<rect x="40" y="50" width="32" height="130" fill="#4f9c7a"/>',
    '<rect x="90" y="91" width="32" height="89" fill="#6aa98a"/>',
    '<rect x="140" y="109" width="32" height="71" fill="#7fb69c"/>',
    '<rect x="190" y="127" width="32" height="53" fill="#93c3ac"/>',
    '<rect x="240" y="139" width="32" height="41" fill="#a8cfbb"/>',
    '<rect x="290" y="150" width="32" height="30" fill="#bcdbc9"/>',
    '<rect x="340" y="153" width="20" height="27" fill="#cfe6d8"/>',
    '<g font-size="9.5" fill="#4d5a52" font-family="sans-serif" text-anchor="middle">',
    '<text x="56" y="194">亚洲</text>',
    '<text x="106" y="194">非洲</text>',
    '<text x="156" y="194">北美</text>',
    '<text x="206" y="194">南美</text>',
    '<text x="256" y="194">南极</text>',
    '<text x="306" y="194">欧洲</text>',
    '<text x="350" y="194">大洋</text>',
    '</g>',
    '<g font-size="9" fill="#6d7a72" font-family="sans-serif" text-anchor="middle">',
    '<text x="56" y="43">4400</text>',
    '<text x="106" y="84">3000</text>',
    '<text x="156" y="102">2400</text>',
    '<text x="206" y="120">1800</text>',
    '<text x="256" y="132">1400</text>',
    '<text x="306" y="143">1000</text>',
    '<text x="350" y="146">900</text>',
    '</g>',
    '<text x="30" y="212" font-size="9" fill="#8a8172" font-family="sans-serif">面积（万平方千米）</text>',
    '</svg>'
  ].join('');

  /* ---------- 题库 ---------- */

  GameSubjects.register({
    id: 'geography',
    name: '地理',
    icon: '🌏',
    color: '#2f7d5f',
    desc: '地球与地图 · 陆地与海洋 · 气候与居民',
    order: 1,
    levels: [
      {
        id: 'geo-7a-1',
        title: '第一章 地球',
        subtitle: '地球仪与经纬网、自转与公转、五带',
        questions: [
          {
            id: 'geo7a1-q1',
            type: 'choice',
            stem: '读图，图中 A 点的经纬度是（　）',
            svg: SVG_LATLON,
            caption: '经纬网示意图',
            options: ['30°N，30°E', '30°S，30°E', '30°N，30°W', '30°S，30°W'],
            answer: 0,
            explain: '图中加粗的横线是 0° 纬线（赤道），向上为北纬；加粗的竖线是 0° 经线，向东为东经。A 点在赤道以北、0° 经线以东，所以是 30°N、30°E。'
          },
          {
            id: 'geo7a1-q2',
            type: 'choice',
            stem: '关于地球的大小，下列说法正确的是（　）',
            options: ['平均半径约 6371 千米', '平均半径约 4 万千米', '表面积约 5.1 亿平方千米', '赤道周长约 6371 千米'],
            answer: 0,
            explain: '地球平均半径约 6371 千米，赤道周长约 4 万千米，表面积约 5.1 亿平方千米。三个数字不要记混。'
          },
          {
            id: 'geo7a1-q3',
            type: 'fill',
            stem: '地球的表面积约为 ____ 亿平方千米。',
            accept: ['5.1', '5.1亿', '5.1亿平方千米'],
            hint: '填数字即可，例如 5.1',
            explain: '地球表面积约 5.1 亿平方千米，相当于约 700 个中国陆地面积。'
          },
          {
            id: 'geo7a1-q4',
            type: 'choice',
            stem: '关于经线和纬线，下列说法正确的是（　）',
            options: ['纬线都是半圆', '经线的长度都相等', '纬线指示南北方向', '经线的长度不相等'],
            answer: 1,
            explain: '经线是连接南北两极的半圆，长度都相等；纬线是圆圈，长度不等（赤道最长），指示东西方向。'
          },
          {
            id: 'geo7a1-q5',
            type: 'choice',
            stem: '东、西半球的分界线是（　）',
            options: ['20°W 和 160°E 组成的经线圈', '0° 和 180° 组成的经线圈', '赤道', '本初子午线'],
            answer: 0,
            explain: '为了避免把欧洲、非洲的一些国家分在两个半球，国际上用 20°W 和 160°E 组成的经线圈作为东西半球的分界线。南北半球则以赤道为界。'
          },
          {
            id: 'geo7a1-q6',
            type: 'judge',
            stem: '以赤道为界，可以把地球分成东、西两个半球。',
            answer: false,
            explain: '赤道是南北半球的分界线；东西半球的分界线是 20°W 和 160°E 组成的经线圈。'
          },
          {
            id: 'geo7a1-q7',
            type: 'choice',
            stem: '地球自转的方向和周期分别是（　）',
            options: ['自西向东，约一天', '自东向西，约一天', '自西向东，约一年', '自东向西，约一年'],
            answer: 0,
            explain: '地球绕地轴自西向东自转，周期约 24 小时（一天），产生昼夜交替和时间差异。所以日月星辰总是东升西落。'
          },
          {
            id: 'geo7a1-q8',
            type: 'choice',
            stem: '下列现象由地球公转产生的是（　）',
            options: ['昼夜交替', '四季变化', '太阳东升西落', '不同经度的时间差异'],
            answer: 1,
            explain: '地球公转（绕太阳，周期一年）使各地获得的太阳热量随季节变化，形成四季变化和昼夜长短变化；其余三项都由自转产生。'
          },
          {
            id: 'geo7a1-q9',
            type: 'choice',
            stem: '读“地球五带示意图”，热带的纬度范围是（　）',
            svg: SVG_ZONES,
            caption: '地球五带示意图',
            options: ['23.5°N—23.5°S', '23.5°N—66.5°N', '66.5°N—90°N', '0°—66.5°S'],
            answer: 0,
            explain: '南北回归线之间（23.5°N—23.5°S）是热带，有阳光直射现象；南北极圈以内是寒带，有极昼极夜现象；两者之间是温带。'
          },
          {
            id: 'geo7a1-q10',
            type: 'judge',
            stem: '热带有阳光直射现象，寒带有极昼极夜现象。',
            answer: true,
            explain: '五带划分的依据就是各地获得太阳光热的多少：热带有直射，寒带有极昼极夜，温带既无直射也无极昼极夜，四季分明。'
          }
        ]
      },
      {
        id: 'geo-7a-2',
        title: '第二章 地图',
        subtitle: '比例尺、方向、图例、等高线地形图',
        questions: [
          {
            id: 'geo7a2-q1',
            type: 'choice',
            stem: '地图的“三要素”是（　）',
            options: ['比例尺、方向、图例', '经线、纬线、方向', '颜色、符号、文字', '海拔、相对高度、等高线'],
            answer: 0,
            explain: '比例尺、方向、图例（含注记）合称地图的三要素，缺一不可。'
          },
          {
            id: 'geo7a2-q2',
            type: 'judge',
            stem: '图幅大小相同时，比例尺越小，表示的范围越大，内容越简略。',
            answer: true,
            explain: '比例尺的分母越大，比例尺越小，图上 1 厘米代表的实地距离越长，因此范围越大、内容越简略。'
          },
          {
            id: 'geo7a2-q3',
            type: 'choice',
            stem: '在比例尺为 1:100000 的地图上，量得两地相距 3 厘米，两地实地距离是（　）',
            options: ['3 千米', '30 千米', '300 千米', '1 千米'],
            answer: 0,
            explain: '1:100000 表示图上 1 厘米代表实地 100000 厘米，即 1 千米。3 厘米就是 3 千米。'
          },
          {
            id: 'geo7a2-q4',
            type: 'choice',
            stem: '一幅地图没有指向标，也没有经纬网，按照“上北下南、左西右东”判断：学校在公园的正北方，那么公园在学校的（　）',
            options: ['正南方', '正北方', '正东方', '正西方'],
            answer: 0,
            explain: '两个地点的相对方向相反：学校在公园北面，公园就在学校南面。'
          },
          {
            id: 'geo7a2-q5',
            type: 'choice',
            stem: '读“等高线地形示意图”，甲、乙两地的地形部位分别是（　）',
            svg: SVG_CONTOUR,
            caption: '等高线地形示意图',
            options: ['山顶、鞍部', '鞍部、山顶', '山脊、山谷', '陡崖、盆地'],
            answer: 0,
            explain: '甲处等高线呈闭合状态且数值由外向内增大，是山顶；乙处位于两个山顶之间相对低洼的部位，是鞍部。'
          },
          {
            id: 'geo7a2-q6',
            type: 'judge',
            stem: '在等高线地形图上，等高线越密集，坡度越陡；等高线越稀疏，坡度越缓。',
            answer: true,
            explain: '等高线密集说明相同水平距离内高度变化大，坡度陡；稀疏则坡度缓。爬山时选等高线稀疏的缓坡更省力。'
          },
          {
            id: 'geo7a2-q7',
            type: 'choice',
            stem: '甲地海拔 1500 米，乙地海拔 500 米，两地的相对高度是（　）',
            options: ['1000 米', '2000 米', '1500 米', '500 米'],
            answer: 0,
            explain: '相对高度是两地海拔之差：1500 − 500 = 1000 米。海拔则是某地高出海平面的垂直距离。'
          },
          {
            id: 'geo7a2-q8',
            type: 'choice',
            stem: '下列不属于五种基本地形类型的是（　）',
            options: ['平原', '高原', '丘陵', '沙漠'],
            answer: 3,
            explain: '五种基本地形是平原、高原、山地、丘陵、盆地。沙漠是一种地表景观，不是地形类型。'
          },
          {
            id: 'geo7a2-q9',
            type: 'choice',
            stem: '在分层设色地形图上，绿色通常表示（　）',
            options: ['平原', '高原', '海洋', '山地'],
            answer: 0,
            explain: '分层设色地形图用颜色表示海拔高低：绿色表示平原，黄色、褐色表示高原和山地，蓝色表示海洋，白色表示雪线以上。'
          },
          {
            id: 'geo7a2-q10',
            type: 'choice',
            stem: '周末去动物园游览，最合适的地图是（　）',
            options: ['动物园导游图', '中国政区图', '世界地形图', '中国交通图'],
            answer: 0,
            explain: '选择地图要根据用途：游览看景点分布用导游图；了解国家位置用政区图；出行查路线用交通图。'
          }
        ]
      },
      {
        id: 'geo-7a-3',
        title: '第三章 陆地和海洋',
        subtitle: '大洲大洋、海陆变迁、板块运动',
        questions: [
          {
            id: 'geo7a3-q1',
            type: 'choice',
            stem: '地球表面海陆面积的比例大致是（　）',
            options: ['海洋约 71%，陆地约 29%', '海洋约 29%，陆地约 71%', '海洋和陆地各占一半', '海洋约 61%，陆地约 39%'],
            answer: 0,
            explain: '常说“七分海洋，三分陆地”：海洋约占 71%，陆地约占 29%，而且无论怎样划分，地球的任何两个半球都是海洋面积大于陆地面积。'
          },
          {
            id: 'geo7a3-q2',
            type: 'choice',
            stem: '七大洲按面积从大到小排列，正确的是（　）',
            options: ['亚洲、非洲、北美洲、南美洲、南极洲、欧洲、大洋洲', '亚洲、非洲、南美洲、北美洲、南极洲、欧洲、大洋洲', '非洲、亚洲、北美洲、南美洲、欧洲、南极洲、大洋洲', '亚洲、北美洲、非洲、南美洲、南极洲、大洋洲、欧洲'],
            answer: 0,
            explain: '口诀“亚非北南美，南极欧大洋”。亚洲面积最大，大洋洲面积最小。'
          },
          {
            id: 'geo7a3-q3',
            type: 'choice',
            stem: '读“七大洲面积柱状图”，面积最大的大洲和最小的大洲分别是（　）',
            svg: SVG_CONTINENTS,
            caption: '七大洲面积比较（单位：万平方千米）',
            options: ['亚洲、大洋洲', '非洲、欧洲', '亚洲、欧洲', '非洲、南极洲'],
            answer: 0,
            explain: '图中最高柱是亚洲（约 4400 万平方千米），最矮柱是大洋洲（约 900 万平方千米）。'
          },
          {
            id: 'geo7a3-q4',
            type: 'choice',
            stem: '四大洋中，面积最大、深度最深的是（　）',
            options: ['太平洋', '大西洋', '印度洋', '北冰洋'],
            answer: 0,
            explain: '四大洋按面积从大到小是太平洋、大西洋、印度洋、北冰洋。太平洋最大最深，北冰洋最小最浅。'
          },
          {
            id: 'geo7a3-q5',
            type: 'choice',
            stem: '亚洲与欧洲的分界线是（　）',
            options: ['乌拉尔山脉—乌拉尔河—里海—大高加索山脉—黑海—土耳其海峡', '苏伊士运河', '巴拿马运河', '白令海峡'],
            answer: 0,
            explain: '亚欧分界线自北向南为乌拉尔山脉、乌拉尔河、里海、大高加索山脉、黑海、土耳其海峡。苏伊士运河分亚非，巴拿马运河分南北美洲，白令海峡分亚洲和北美洲。'
          },
          {
            id: 'geo7a3-q6',
            type: 'choice',
            stem: '沟通地中海和红海、成为亚洲与非洲分界线的是（　）',
            options: ['苏伊士运河', '巴拿马运河', '土耳其海峡', '马六甲海峡'],
            answer: 0,
            explain: '苏伊士运河连接地中海与红海，是亚洲和非洲的分界线，也是重要的海上通道。'
          },
          {
            id: 'geo7a3-q7',
            type: 'judge',
            stem: '赤道穿过非洲、亚洲、大洋洲和南美洲。',
            answer: true,
            explain: '赤道自西向东穿过南美洲、非洲、亚洲（东南亚）和大洋洲，是判断大洲位置的重要“参照线”。'
          },
          {
            id: 'geo7a3-q8',
            type: 'choice',
            stem: '提出“大陆漂移假说”的科学家是（　）',
            options: ['魏格纳', '哥伦布', '麦哲伦', '哥白尼'],
            answer: 0,
            explain: '德国科学家魏格纳观察到非洲西岸与南美洲东岸轮廓相吻合，提出大陆漂移假说。后来板块构造学说进一步发展了这一认识。'
          },
          {
            id: 'geo7a3-q9',
            type: 'choice',
            stem: '关于板块运动，下列说法正确的是（　）',
            options: ['板块内部比较稳定，板块交界地带地壳活跃', '板块是静止不动的', '板块交界地带地壳最稳定', '火山地震只发生在海洋中'],
            answer: 0,
            explain: '全球大致划分为六大板块，板块在不断运动。板块内部地壳比较稳定，交界地带地壳活跃，多火山和地震。'
          },
          {
            id: 'geo7a3-q10',
            type: 'choice',
            stem: '喜马拉雅山脉的形成原因是（　）',
            options: ['印度洋板块与亚欧板块碰撞挤压', '太平洋板块与美洲板块张裂', '流水长期侵蚀', '人类活动堆积'],
            answer: 0,
            explain: '印度洋板块向北运动，与亚欧板块碰撞挤压，使地壳隆起抬升，形成喜马拉雅山脉，而且它至今仍在缓慢升高。'
          },
          {
            id: 'geo7a3-q11',
            type: 'choice',
            stem: '世界上的火山、地震主要分布在（　）',
            options: ['环太平洋地带和地中海—喜马拉雅地带', '大西洋中部和北冰洋沿岸', '非洲内陆和澳大利亚中部', '南极洲和格陵兰岛'],
            answer: 0,
            explain: '全球两大火山地震带是环太平洋火山地震带和地中海—喜马拉雅火山地震带，它们都位于板块交界处。'
          },
          {
            id: 'geo7a3-q12',
            type: 'fill',
            stem: '世界上面积最大的大洋是 ____。',
            accept: ['太平洋'],
            explain: '太平洋面积约 1.8 亿平方千米，是四大洋中面积最大、深度最深的；北冰洋面积最小、深度最浅。'
          }
        ]
      }
    ]
  });
})();