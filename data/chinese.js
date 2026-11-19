/* ============================================================
   语文 · 七年级上册（统编版）
   字词 / 古诗文 / 现代文 / 名著与文学常识
   ============================================================ */
(function () {
  'use strict';

  GameSubjects.register({
    id: 'chinese',
    name: '语文',
    icon: '📖',
    color: '#b25b4a',
    desc: '字词成语 · 古诗文 · 现代文 · 名著阅读',
    order: 3,
    levels: [
      {
        id: 'chn-7a-1',
        title: '第一章 字词与成语',
        subtitle: '读音、字形、词义与成语运用',
        questions: [
          {
            id: 'chn7a1-q1',
            type: 'choice',
            stem: '“酝酿”的“酿”读音是（　）',
            options: ['niàng', 'liàng', 'ráng', 'niǎng'],
            answer: 0,
            explain: '“酝酿”读 yùn niàng，本义是造酒，比喻做准备工作。'
          },
          {
            id: 'chn7a1-q2',
            type: 'choice',
            stem: '下列词语中没有错别字的是（　）',
            options: ['花团锦簇', '美不盛收', '人声顶沸', '混为一谈'],
            answer: 0,
            explain: '正确写法是“美不胜收”“人声鼎沸”；“花团锦簇”和“混为一谈”都正确。'
          },
          {
            id: 'chn7a1-q3',
            type: 'choice',
            stem: '“咄咄逼人”的意思是（　）',
            options: ['形容气势汹汹、盛气凌人', '形容说话声音很小', '形容风景优美', '形容做事认真'],
            answer: 0,
            explain: '“咄咄”表示惊诧或责备，咄咄逼人形容气势汹汹，使人难堪。'
          },
          {
            id: 'chn7a1-q4',
            type: 'judge',
            stem: '“恍然大悟”的“恍”表示忽然醒悟。',
            answer: true,
            explain: '恍然大悟指忽然明白过来，“恍”有忽然醒悟的意思。'
          },
          {
            id: 'chn7a1-q5',
            type: 'choice',
            stem: '下列句子中，成语使用恰当的是（　）',
            options: ['他说话咄咄逼人，让人很不舒服。', '春天到了，花园里人声鼎沸。', '这道题我美不胜收。', '他各得其所地跑向操场。'],
            answer: 0,
            explain: '“咄咄逼人”形容气势逼人，用在这里恰当；其余三句都属于对象或语境误用。'
          },
          {
            id: 'chn7a1-q6',
            type: 'choice',
            stem: '“静谧”的“谧”读音是（　）',
            options: ['mì', 'bì', 'nì', 'mī'],
            answer: 0,
            explain: '“静谧”读 jìng mì，意思是安静、寂静。'
          },
          {
            id: 'chn7a1-q7',
            type: 'choice',
            stem: '“分歧”一词的意思是（　）',
            options: ['意见不一致，有差别', '分岔的小路', '分别离开', '分配任务'],
            answer: 0,
            explain: '“分歧”指思想、意见、记载等不一致，有差别。'
          },
          {
            id: 'chn7a1-q8',
            type: 'judge',
            stem: '“各得其所”指每个人或事物都得到合适的安顿。',
            answer: true,
            explain: '“各得其所”原指各人都得到满足，后指每个人或事物都得到恰当的位置或安排。'
          }
        ]
      },
      {
        id: 'chn-7a-2',
        title: '第二章 古诗文',
        subtitle: '七上必背古诗与《论语》',
        questions: [
          {
            id: 'chn7a2-q1',
            type: 'choice',
            stem: '“东临碣石，以观沧海”出自（　）',
            options: ['曹操《观沧海》', '王湾《次北固山下》', '李白《闻王昌龄左迁龙标遥有此寄》', '马致远《天净沙·秋思》'],
            answer: 0,
            explain: '《观沧海》是曹操北征乌桓途经碣石山时所作，是我国现存最早的一首完整山水诗。'
          },
          {
            id: 'chn7a2-q2',
            type: 'choice',
            stem: '“海日生残夜，江春入旧年”出自（　）',
            options: ['王湾《次北固山下》', '曹操《观沧海》', '李商隐《夜雨寄北》', '刘禹锡《秋词》'],
            answer: 0,
            explain: '这两句出自王湾《次北固山下》，写昼夜交替、新旧更迭，蕴含哲理。'
          },
          {
            id: 'chn7a2-q3',
            type: 'choice',
            stem: '“夕阳西下，断肠人在天涯”出自（　）',
            options: ['马致远《天净沙·秋思》', '王湾《次北固山下》', '杜甫《江南逢李龟年》', '岑参《行军九日思长安故园》'],
            answer: 0,
            explain: '《天净沙·秋思》是马致远的散曲小令，被誉为“秋思之祖”。'
          },
          {
            id: 'chn7a2-q4',
            type: 'fill',
            stem: '“我寄愁心与明月，____。”',
            accept: ['随君直到夜郎西', '随风直到夜郎西'],
            hint: '出自李白《闻王昌龄左迁龙标遥有此寄》',
            explain: '原句是“我寄愁心与明月，随君直到夜郎西”，把明月当作使者，寄托对友人的牵挂。'
          },
          {
            id: 'chn7a2-q5',
            type: 'choice',
            stem: '“学而不思则罔，思而不学则殆”出自（　）',
            options: ['《论语》', '《世说新语》', '《诫子书》', '《狼》'],
            answer: 0,
            explain: '这两句出自《论语·为政》，强调学习与思考要结合。'
          },
          {
            id: 'chn7a2-q6',
            type: 'judge',
            stem: '“杨花落尽子规啼”中的“子规”指杜鹃鸟。',
            answer: true,
            explain: '子规即杜鹃鸟，叫声凄切，古诗中常用来渲染悲凉气氛。'
          },
          {
            id: 'chn7a2-q7',
            type: 'choice',
            stem: '“水何澹澹，山岛竦峙”描写的是（　）',
            options: ['大海', '长江', '西湖', '黄河'],
            answer: 0,
            explain: '这是《观沧海》中的名句，写海水荡漾、山岛高耸的壮阔景象。'
          },
          {
            id: 'chn7a2-q8',
            type: 'fill',
            stem: '“潮平两岸阔，____。”',
            accept: ['风正一帆悬'],
            hint: '出自王湾《次北固山下》',
            explain: '原句是“潮平两岸阔，风正一帆悬”，写江面开阔、船帆高悬的景象。'
          }
        ]
      },
      {
        id: 'chn-7a-3',
        title: '第三章 现代文阅读',
        subtitle: '《春》《济南的冬天》《从百草园到三味书屋》等',
        questions: [
          {
            id: 'chn7a3-q1',
            type: 'choice',
            stem: '《春》的作者是（　）',
            options: ['朱自清', '老舍', '鲁迅', '史铁生'],
            answer: 0,
            explain: '《春》是朱自清的写景散文，描绘了春回大地、生机勃勃的景象。'
          },
          {
            id: 'chn7a3-q2',
            type: 'choice',
            stem: '《济南的冬天》的作者是（　）',
            options: ['老舍', '朱自清', '刘湛秋', '莫怀戚'],
            answer: 0,
            explain: '《济南的冬天》是老舍的散文，抓住济南冬天“温晴”的特点来写。'
          },
          {
            id: 'chn7a3-q3',
            type: 'choice',
            stem: '《从百草园到三味书屋》收录在（　）',
            options: ['《朝花夕拾》', '《呐喊》', '《彷徨》', '《野草》'],
            answer: 0,
            explain: '《从百草园到三味书屋》是鲁迅回忆童年生活的散文，收入散文集《朝花夕拾》。'
          },
          {
            id: 'chn7a3-q4',
            type: 'judge',
            stem: '《散步》的作者是莫怀戚。',
            answer: true,
            explain: '《散步》是莫怀戚的散文，通过一家人散步的小事表现亲情与责任。'
          },
          {
            id: 'chn7a3-q5',
            type: 'choice',
            stem: '“小草偷偷地从土里钻出来”主要运用了（　）',
            options: ['拟人', '比喻', '夸张', '排比'],
            answer: 0,
            explain: '“偷偷地”“钻”把小草当作人来写，赋予小草人的动作和情态，属于拟人。'
          },
          {
            id: 'chn7a3-q6',
            type: 'fill',
            stem: '《济南的冬天》的作者是 ____。',
            accept: ['老舍', '舒庆春'],
            explain: '老舍原名舒庆春，字舍予，《济南的冬天》是他写济南的散文名篇。'
          },
          {
            id: 'chn7a3-q7',
            type: 'choice',
            stem: '“济南的冬天是响晴的”中“响晴”的意思是（　）',
            options: ['晴朗无云', '声音响亮', '天气寒冷', '阳光微弱'],
            answer: 0,
            explain: '“响晴”指晴朗无云，突出济南冬天温晴的特点。'
          },
          {
            id: 'chn7a3-q8',
            type: 'judge',
            stem: '《雨的四季》的作者是刘湛秋。',
            answer: true,
            explain: '《雨的四季》是刘湛秋的散文，按四季顺序描写雨的不同情态。'
          }
        ]
      },
      {
        id: 'chn-7a-4',
        title: '第四章 名著与文学常识',
        subtitle: '《朝花夕拾》《西游记》与作家作品',
        questions: [
          {
            id: 'chn7a4-q1',
            type: 'choice',
            stem: '《朝花夕拾》的作者是（　）',
            options: ['鲁迅', '老舍', '朱自清', '吴承恩'],
            answer: 0,
            explain: '《朝花夕拾》是鲁迅的散文集，原名《旧事重提》，记录童年和青年时期的生活。'
          },
          {
            id: 'chn7a4-q2',
            type: 'choice',
            stem: '《西游记》的作者是（　）',
            options: ['吴承恩', '罗贯中', '施耐庵', '曹雪芹'],
            answer: 0,
            explain: '《西游记》是明代吴承恩创作的长篇神魔小说，是我国古典四大名著之一。'
          },
          {
            id: 'chn7a4-q3',
            type: 'choice',
            stem: '《阿长与〈山海经〉》收录在（　）',
            options: ['《朝花夕拾》', '《西游记》', '《呐喊》', '《世说新语》'],
            answer: 0,
            explain: '《阿长与〈山海经〉》是《朝花夕拾》中的一篇，回忆童年保姆长妈妈。'
          },
          {
            id: 'chn7a4-q4',
            type: 'judge',
            stem: '《西游记》中孙悟空的第一位师父是菩提祖师。',
            answer: true,
            explain: '孙悟空在花果山称王后，漂洋过海到灵台方寸山，拜菩提祖师学艺，学会七十二变和筋斗云。'
          },
          {
            id: 'chn7a4-q5',
            type: 'choice',
            stem: '《论语》是记录（　）言行的著作',
            options: ['孔子及其弟子', '老子', '孟子', '庄子'],
            answer: 0,
            explain: '《论语》是儒家经典，由孔子的弟子及再传弟子编写，记录孔子及其弟子的言行。'
          },
          {
            id: 'chn7a4-q6',
            type: 'fill',
            stem: '《西游记》中，孙悟空的兵器是 ____。',
            accept: ['金箍棒', '如意金箍棒'],
            explain: '孙悟空的兵器是如意金箍棒，原为东海龙宫的定海神针。'
          },
          {
            id: 'chn7a4-q7',
            type: 'choice',
            stem: '“三味书屋”是（　）',
            options: ['鲁迅少年读书的地方', '鲁迅写作的书房', '绍兴的一座寺庙', '鲁迅家的客厅'],
            answer: 0,
            explain: '三味书屋是鲁迅少年时代读书的私塾，在《从百草园到三味书屋》中有详细描写。'
          },
          {
            id: 'chn7a4-q8',
            type: 'judge',
            stem: '《朝花夕拾》是一部散文集。',
            answer: true,
            explain: '《朝花夕拾》是鲁迅的回忆性散文集，共收录 10 篇文章。'
          }
        ]
      },
      {
        id: 'chn-7b-1',
        title: '第五章 七下字词与成语',
        subtitle: '邓稼先、说和做、黄河颂等课文词语',
        questions: [
          {
            id: 'chn7b1-q1',
            type: 'choice',
            stem: '“鞠躬尽瘁”的“瘁”读音是（　）',
            options: ['cuì', 'zuì', 'suì', 'chuì'],
            answer: 0,
            explain: '“鞠躬尽瘁”读 jū gōng jìn cuì，指恭敬谨慎、竭尽心力。'
          },
          {
            id: 'chn7b1-q2',
            type: 'choice',
            stem: '“锲而不舍”的“锲”读音是（　）',
            options: ['qiè', 'qì', 'xiè', 'jiè'],
            answer: 0,
            explain: '“锲而不舍”读 qiè ér bù shě，比喻有恒心、有毅力。'
          },
          {
            id: 'chn7b1-q3',
            type: 'choice',
            stem: '下列词语中没有错别字的是（　）',
            options: ['鞠躬尽瘁', '锋芒必露', '妇儒皆知', '当之无槐'],
            answer: 0,
            explain: '“锋芒毕露”的“毕”不能写成“必”；“妇孺皆知”的“孺”不能写成“儒”；“当之无愧”的“愧”不能写成“槐”。'
          },
          {
            id: 'chn7b1-q4',
            type: 'choice',
            stem: '“可歌可泣”的意思是（　）',
            options: ['值得歌颂，使人感动得流泪', '可以唱歌也可以哭泣', '又高兴又难过', '形容声音好听'],
            answer: 0,
            explain: '“可歌可泣”指值得歌颂、赞美，使人感动流泪，多形容英勇悲壮的事迹。'
          },
          {
            id: 'chn7b1-q5',
            type: 'judge',
            stem: '“气冲斗牛”形容气势或怒气很盛。',
            answer: true,
            explain: '“气冲斗牛”中的“斗牛”指北斗星和牵牛星，形容气势旺盛或怒气冲天。'
          },
          {
            id: 'chn7b1-q6',
            type: 'choice',
            stem: '“兀兀穷年”的意思是（　）',
            options: ['一年到头辛勤劳动', '整年无所事事', '孤独地度过一年', '突然变得贫穷'],
            answer: 0,
            explain: '“兀兀穷年”指用心劳苦地一年到头这样做。'
          },
          {
            id: 'chn7b1-q7',
            type: 'fill',
            stem: '“鞠躬尽瘁，____。”',
            accept: ['死而后已'],
            hint: '出自诸葛亮《后出师表》',
            explain: '原句是“鞠躬尽瘁，死而后已”，意为竭尽心力，到死为止。'
          },
          {
            id: 'chn7b1-q8',
            type: 'judge',
            stem: '“锲而不舍”比喻有恒心、有毅力。',
            answer: true,
            explain: '“锲而不舍”出自《荀子·劝学》，意思是不断地雕刻，比喻有恒心、有毅力。'
          }
        ]
      },
      {
        id: 'chn-7b-2',
        title: '第六章 七下古诗文',
        subtitle: '《木兰诗》《孙权劝学》《陋室铭》《爱莲说》等',
        questions: [
          {
            id: 'chn7b2-q1',
            type: 'choice',
            stem: '《木兰诗》选自（　）',
            options: ['《乐府诗集》', '《资治通鉴》', '《世说新语》', '《聊斋志异》'],
            answer: 0,
            explain: '《木兰诗》选自北宋郭茂倩编的《乐府诗集》，是南北朝时期北方的一首乐府民歌。'
          },
          {
            id: 'chn7b2-q2',
            type: 'choice',
            stem: '“万里赴戎机，关山度若飞”出自（　）',
            options: ['《木兰诗》', '《孙权劝学》', '《卖油翁》', '《陋室铭》'],
            answer: 0,
            explain: '这两句出自《木兰诗》，写木兰奔赴战场、像飞一样越过关塞山岭。'
          },
          {
            id: 'chn7b2-q3',
            type: 'choice',
            stem: '《孙权劝学》选自（　）',
            options: ['《资治通鉴》', '《乐府诗集》', '《论语》', '《世说新语》'],
            answer: 0,
            explain: '《孙权劝学》选自《资治通鉴》，由北宋司马光主持编纂。'
          },
          {
            id: 'chn7b2-q4',
            type: 'choice',
            stem: '“斯是陋室，惟吾德馨”出自（　）',
            options: ['刘禹锡《陋室铭》', '周敦颐《爱莲说》', '欧阳修《卖油翁》', '王安石《登飞来峰》'],
            answer: 0,
            explain: '《陋室铭》是唐代刘禹锡的作品，“斯是陋室，惟吾德馨”点明主旨。'
          },
          {
            id: 'chn7b2-q5',
            type: 'choice',
            stem: '“出淤泥而不染，濯清涟而不妖”出自（　）',
            options: ['周敦颐《爱莲说》', '刘禹锡《陋室铭》', '陶渊明《桃花源记》', '郦道元《三峡》'],
            answer: 0,
            explain: '这两句出自北宋周敦颐的《爱莲说》，赞美莲花高洁的品格。'
          },
          {
            id: 'chn7b2-q6',
            type: 'fill',
            stem: '“会当凌绝顶，____。”',
            accept: ['一览众山小'],
            hint: '出自杜甫《望岳》',
            explain: '原句是“会当凌绝顶，一览众山小”，表达登临绝顶、俯视一切的豪情。'
          },
          {
            id: 'chn7b2-q7',
            type: 'choice',
            stem: '“陈康肃公善射”出自（　）',
            options: ['《卖油翁》', '《孙权劝学》', '《陋室铭》', '《爱莲说》'],
            answer: 0,
            explain: '《卖油翁》是北宋欧阳修的作品，讲了陈尧咨善射、卖油翁酌油的故事。'
          },
          {
            id: 'chn7b2-q8',
            type: 'judge',
            stem: '《爱莲说》的作者是北宋的周敦颐。',
            answer: true,
            explain: '《爱莲说》是北宋哲学家周敦颐的散文，以莲喻君子。'
          }
        ]
      },
      {
        id: 'chn-7b-3',
        title: '第七章 七下现代文',
        subtitle: '《阿长与〈山海经〉》《老王》《紫藤萝瀑布》等',
        questions: [
          {
            id: 'chn7b3-q1',
            type: 'choice',
            stem: '《阿长与〈山海经〉》的作者是（　）',
            options: ['鲁迅', '杨绛', '宗璞', '贾平凹'],
            answer: 0,
            explain: '《阿长与〈山海经〉》是鲁迅的散文，收入《朝花夕拾》，回忆童年保姆长妈妈。'
          },
          {
            id: 'chn7b3-q2',
            type: 'choice',
            stem: '《老王》的作者是（　）',
            options: ['杨绛', '鲁迅', '彭荆风', '张中行'],
            answer: 0,
            explain: '《老王》是杨绛的散文，写普通劳动者老王善良、厚道的品格。'
          },
          {
            id: 'chn7b3-q3',
            type: 'choice',
            stem: '《紫藤萝瀑布》的作者是（　）',
            options: ['宗璞', '贾平凹', '杨绛', '茨威格'],
            answer: 0,
            explain: '《紫藤萝瀑布》是宗璞的散文，借紫藤萝花表达对生命的感悟。'
          },
          {
            id: 'chn7b3-q4',
            type: 'choice',
            stem: '《驿路梨花》的作者是（　）',
            options: ['彭荆风', '宗璞', '杨绛', '张中行'],
            answer: 0,
            explain: '《驿路梨花》是彭荆风的小说，围绕小茅屋表现助人为乐的雷锋精神。'
          },
          {
            id: 'chn7b3-q5',
            type: 'choice',
            stem: '《一棵小桃树》的作者是（　）',
            options: ['贾平凹', '宗璞', '杨绛', '鲁迅'],
            answer: 0,
            explain: '《一棵小桃树》是贾平凹的散文，借小桃树写自己的经历和追求。'
          },
          {
            id: 'chn7b3-q6',
            type: 'fill',
            stem: '《紫藤萝瀑布》的作者是 ____。',
            accept: ['宗璞'],
            explain: '宗璞，原名冯钟璞，代表作有《紫藤萝瀑布》《红豆》等。'
          },
          {
            id: 'chn7b3-q7',
            type: 'judge',
            stem: '《叶圣陶先生二三事》的作者是张中行。',
            answer: true,
            explain: '《叶圣陶先生二三事》是张中行回忆叶圣陶先生的散文。'
          },
          {
            id: 'chn7b3-q8',
            type: 'choice',
            stem: '《伟大的悲剧》的作者是（　）',
            options: ['茨威格', '凡尔纳', '老舍', '杨绛'],
            answer: 0,
            explain: '《伟大的悲剧》是奥地利作家茨威格的作品，写斯科特南极探险队的悲壮故事。'
          }
        ]
      },
      {
        id: 'chn-7b-4',
        title: '第八章 七下名著',
        subtitle: '《骆驼祥子》《海底两万里》',
        questions: [
          {
            id: 'chn7b4-q1',
            type: 'choice',
            stem: '《骆驼祥子》的作者是（　）',
            options: ['老舍', '鲁迅', '巴金', '曹雪芹'],
            answer: 0,
            explain: '《骆驼祥子》是老舍的长篇小说，讲述人力车夫祥子的故事。'
          },
          {
            id: 'chn7b4-q2',
            type: 'choice',
            stem: '《海底两万里》的作者是（　）',
            options: ['儒勒·凡尔纳', '茨威格', '海明威', '笛福'],
            answer: 0,
            explain: '《海底两万里》是法国作家儒勒·凡尔纳的科幻小说。'
          },
          {
            id: 'chn7b4-q3',
            type: 'choice',
            stem: '祥子的职业是（　）',
            options: ['人力车夫', '店铺伙计', '教师', '船工'],
            answer: 0,
            explain: '祥子是北平城里的人力车夫，最大的梦想是拥有一辆自己的车。'
          },
          {
            id: 'chn7b4-q4',
            type: 'choice',
            stem: '《骆驼祥子》中祥子的命运经历了（　）',
            options: ['三起三落', '一帆风顺', '先苦后甜', '从未受挫'],
            answer: 0,
            explain: '祥子买车经历了“三起三落”，最终在旧社会的压迫下走向堕落。'
          },
          {
            id: 'chn7b4-q5',
            type: 'choice',
            stem: '《海底两万里》中尼摩船长驾驶的潜艇叫（　）',
            options: ['诺第留斯号', '泰坦尼克号', '企业号', '无畏号'],
            answer: 0,
            explain: '尼摩船长驾驶的潜艇叫诺第留斯号（又译鹦鹉螺号）。'
          },
          {
            id: 'chn7b4-q6',
            type: 'fill',
            stem: '《骆驼祥子》的作者是 ____。',
            accept: ['老舍', '舒庆春'],
            explain: '老舍原名舒庆春，字舍予，《骆驼祥子》是他的代表作之一。'
          },
          {
            id: 'chn7b4-q7',
            type: 'judge',
            stem: '尼摩船长是《海底两万里》中的人物。',
            answer: true,
            explain: '尼摩船长是诺第留斯号的船长，性格神秘、反抗压迫。'
          },
          {
            id: 'chn7b4-q8',
            type: 'choice',
            stem: '《骆驼祥子》的主人公是（　）',
            options: ['祥子', '阿Q', '觉慧', '孔乙己'],
            answer: 0,
            explain: '《骆驼祥子》的主人公是人力车夫祥子。'
          }
        ]
      },
      {
        id: 'chn-7b-5',
        title: '第九章 文言文基础',
        subtitle: '《孙权劝学》《卖油翁》《陋室铭》实词与翻译',
        questions: [
          {
            id: 'chn7b5-q1',
            type: 'choice',
            stem: '“卿今当涂掌事”中“当涂”的意思是（　）',
            options: ['当道、当权', '在路上', '涂改', '担当'],
            answer: 0,
            explain: '“当涂”意为当道、当权，“当涂掌事”指当权管事。'
          },
          {
            id: 'chn7b5-q2',
            type: 'choice',
            stem: '“但当涉猎”中“但”的意思是（　）',
            options: ['只、只是', '但是', '应当', '尚且'],
            answer: 0,
            explain: '“但”在文言文中常表示“只、只是”，这里指只应当粗略地阅读。'
          },
          {
            id: 'chn7b5-q3',
            type: 'choice',
            stem: '“见往事耳”中“往事”的意思是（　）',
            options: ['历史', '过去的事', '往事回忆', '将来的事'],
            answer: 0,
            explain: '“往事”在这里指历史，“见往事耳”意为了解历史罢了。'
          },
          {
            id: 'chn7b5-q4',
            type: 'choice',
            stem: '“蒙乃始就学”中“乃”的意思是（　）',
            options: ['于是、就', '才', '竟然', '是'],
            answer: 0,
            explain: '“乃”表示顺承，意为“于是、就”。'
          },
          {
            id: 'chn7b5-q5',
            type: 'choice',
            stem: '“尔安敢轻吾射”中“安”的意思是（　）',
            options: ['怎么', '安全', '安放', '安静'],
            answer: 0,
            explain: '“安”在文言文中常作疑问代词，意为“怎么、哪里”。'
          },
          {
            id: 'chn7b5-q6',
            type: 'fill',
            stem: '“徐以杓酌油沥之”中“徐”的意思是 ____。',
            accept: ['慢慢地', '缓缓地'],
            explain: '“徐”意为慢慢地，写出卖油翁酌油时从容不迫的动作。'
          },
          {
            id: 'chn7b5-q7',
            type: 'judge',
            stem: '“自以为大有所益”中“益”的意思是“好处”。',
            answer: true,
            explain: '“益”意为好处、益处，“大有所益”指大有收获。'
          },
          {
            id: 'chn7b5-q8',
            type: 'choice',
            stem: '“斯是陋室”中“斯”的意思是（　）',
            options: ['这', '那', '于是', '斯文'],
            answer: 0,
            explain: '“斯”是代词，意为“这”，“斯是陋室”即“这是简陋的屋子”。'
          }
        ]
      },
      {
        id: 'chn-7b-6',
        title: '第十章 写作与语言运用',
        subtitle: '病句、修辞、标点与应用文',
        questions: [
          {
            id: 'chn7b6-q1',
            type: 'choice',
            stem: '“通过这次活动，使我明白了合作的重要性。”这句话的毛病是（　）',
            options: ['成分残缺，缺少主语', '搭配不当', '语序不当', '重复啰嗦'],
            answer: 0,
            explain: '“通过……使……”连用，导致句子缺少主语。删去“通过”或“使”即可。'
          },
          {
            id: 'chn7b6-q2',
            type: 'choice',
            stem: '“他的写作水平明显改进了。”这句话的毛病是（　）',
            options: ['搭配不当', '成分残缺', '语序不当', '前后矛盾'],
            answer: 0,
            explain: '“水平”应与“提高”搭配，“改进”应与“方法”“技术”搭配。'
          },
          {
            id: 'chn7b6-q3',
            type: 'choice',
            stem: '“春天像刚落地的娃娃，从头到脚都是新的。”这句话运用的修辞是（　）',
            options: ['比喻和拟人', '夸张和排比', '对偶和反问', '借代和设问'],
            answer: 0,
            explain: '把春天比作娃娃是比喻，“从头到脚”赋予春天人的特征，是拟人。'
          },
          {
            id: 'chn7b6-q4',
            type: 'judge',
            stem: '书名、篇名、报刊名等应该使用书名号。',
            answer: true,
            explain: '书名号用于标示书名、篇名、报纸名、刊物名等，如《朝花夕拾》。'
          },
          {
            id: 'chn7b6-q5',
            type: 'choice',
            stem: '写请假条时，一般不需要包含（　）',
            options: ['请假原因和起止时间', '请假人署名和日期', '称呼和正文', '详细的家庭收入'],
            answer: 3,
            explain: '请假条要写明称呼、请假原因、起止时间、署名和日期，不需要家庭收入。'
          },
          {
            id: 'chn7b6-q6',
            type: 'fill',
            stem: '“我们班的语文成绩不断提高”中，“不断”修饰的词语是 ____。',
            accept: ['提高'],
            explain: '“不断”作状语，修饰动词“提高”，表示程度或频率。'
          },
          {
            id: 'chn7b6-q7',
            type: 'judge',
            stem: '说明文的语言要求准确、简明。',
            answer: true,
            explain: '说明文以说明为主要表达方式，语言要准确、简明、周密。'
          },
          {
            id: 'chn7b6-q8',
            type: 'choice',
            stem: '下列句子中标点使用正确的是（　）',
            options: ['他问我：“你读过《朝花夕拾》吗？”', '他问我：“你读过《朝花夕拾》吗”？', '他问我“你读过《朝花夕拾》吗？”', '他问我：你读过《朝花夕拾》吗？'],
            answer: 0,
            explain: '直接引用时，冒号、引号、问号要放在合适位置，问号应在引号内。'
          }
        ]
      }
    ]
  });
})();