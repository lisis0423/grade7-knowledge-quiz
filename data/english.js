/* ============================================================
   英语 · 七年级上册（人教版）
   问候 / 代词与名词 / 一般现在时 / 词汇与交际
   ============================================================ */
(function () {
  'use strict';

  GameSubjects.register({
    id: 'english',
    name: '英语',
    icon: '🔤',
    color: '#3f7fb0',
    desc: '问候 · 代词名词 · 一般现在时 · 情景交际',
    order: 4,
    levels: [
      {
        id: 'eng-7a-1',
        title: '第一章 问候与自我介绍',
        subtitle: 'Greetings, letters and introductions',
        questions: [
          {
            id: 'eng7a1-q1',
            type: 'choice',
            stem: '—Hello! —____',
            options: ['Hello!', 'Goodbye!', 'Thank you!', 'Sorry!'],
            answer: 0,
            explain: '别人说 Hello 时，通常也回 Hello，表示打招呼。'
          },
          {
            id: 'eng7a1-q2',
            type: 'choice',
            stem: '早上见面时，应该说（　）',
            options: ['Good morning!', 'Good night!', 'Good evening!', 'Goodbye!'],
            answer: 0,
            explain: '早上用 Good morning，下午用 Good afternoon，晚上用 Good evening，睡前用 Good night。'
          },
          {
            id: 'eng7a1-q3',
            type: 'choice',
            stem: '—How are you? —____',
            options: ["I'm fine, thank you.", 'My name is Tom.', 'I am a student.', 'Nice to meet you.'],
            answer: 0,
            explain: 'How are you? 询问身体状况，常用 I\'m fine, thank you. 回答，也可以说 I\'m OK。'
          },
          {
            id: 'eng7a1-q4',
            type: 'judge',
            stem: '“Nice to meet you.”的答语是“Nice to meet you, too.”',
            answer: true,
            explain: '初次见面说 Nice to meet you，对方通常回答 Nice to meet you, too。'
          },
          {
            id: 'eng7a1-q5',
            type: 'choice',
            stem: '字母 A 后面的字母是（　）',
            options: ['B', 'C', 'D', 'E'],
            answer: 0,
            explain: '英文字母表顺序是 A、B、C、D、E……，所以 A 后面是 B。'
          },
          {
            id: 'eng7a1-q6',
            type: 'fill',
            stem: '下午好：Good ____.',
            accept: ['afternoon'],
            hint: '填一个英文单词',
            explain: '下午好用 Good afternoon，早上用 Good morning。'
          },
          {
            id: 'eng7a1-q7',
            type: 'choice',
            stem: '自我介绍时，可以说（　）',
            options: ['My name is K-7.', 'How old are you?', 'Where is my pen?', 'Good night.'],
            answer: 0,
            explain: 'My name is... 用于介绍自己的名字；How old are you? 是询问年龄。'
          },
          {
            id: 'eng7a1-q8',
            type: 'judge',
            stem: '“What\'s your name?”是在询问姓名。',
            answer: true,
            explain: 'What\'s your name? 意思是“你叫什么名字？”，回答用 My name is... 或 I\'m...。'
          }
        ]
      },
      {
        id: 'eng-7a-2',
        title: '第二章 代词与名词',
        subtitle: 'this/that、物主代词与名词复数',
        questions: [
          {
            id: 'eng7a2-q1',
            type: 'choice',
            stem: 'This is ____ book.',
            options: ['my', 'I', 'me', 'mine book'],
            answer: 0,
            explain: 'book 前需要形容词性物主代词，my 表示“我的”；I 是主格，me 是宾格。'
          },
          {
            id: 'eng7a2-q2',
            type: 'choice',
            stem: '—Is this your pen? —Yes, ____ is.',
            options: ['it', 'this', 'that', 'he'],
            answer: 0,
            explain: '指代前文提到的单数物品 pen，用 it；回答 Yes, it is.。'
          },
          {
            id: 'eng7a2-q3',
            type: 'choice',
            stem: 'These are my ____.',
            options: ['books', 'book', 'a book', 'bookes'],
            answer: 0,
            explain: 'These 表示复数，后面的可数名词要用复数形式 books。'
          },
          {
            id: 'eng7a2-q4',
            type: 'judge',
            stem: '“those”是“that”的复数形式。',
            answer: true,
            explain: 'this 的复数是 these，that 的复数是 those。'
          },
          {
            id: 'eng7a2-q5',
            type: 'choice',
            stem: 'He is my friend. ____ name is Tom.',
            options: ['His', 'Her', 'My', 'Your'],
            answer: 0,
            explain: '前句主语是 He，所以后面用 His 表示“他的”。'
          },
          {
            id: 'eng7a2-q6',
            type: 'fill',
            stem: '这些是她的书：These are ____ books.',
            accept: ['her'],
            hint: '填一个物主代词',
            explain: '“她的”是 her，后面接名词 books。'
          },
          {
            id: 'eng7a2-q7',
            type: 'choice',
            stem: '下列单词中，属于不可数名词的是（　）',
            options: ['water', 'apple', 'book', 'pen'],
            answer: 0,
            explain: 'water 是不可数名词，不能直接加 -s；apple、book、pen 都是可数名词。'
          },
          {
            id: 'eng7a2-q8',
            type: 'judge',
            stem: '不定冠词 an 用在以元音音素开头的单词前。',
            answer: true,
            explain: 'an 用于元音音素开头的单词前，如 an apple、an hour；辅音音素前用 a。'
          }
        ]
      },
      {
        id: 'eng-7a-3',
        title: '第三章 一般现在时',
        subtitle: 'be 动词、实义动词与第三人称单数',
        questions: [
          {
            id: 'eng7a3-q1',
            type: 'choice',
            stem: 'She ____ to school every day.',
            options: ['goes', 'go', 'going', 'went'],
            answer: 0,
            explain: '一般现在时中，主语是第三人称单数 She，动词 go 要变为 goes。'
          },
          {
            id: 'eng7a3-q2',
            type: 'choice',
            stem: 'I ____ a student.',
            options: ['am', 'is', 'are', 'be'],
            answer: 0,
            explain: 'be 动词与主语搭配：I 用 am，he/she/it 用 is，you/we/they 用 are。'
          },
          {
            id: 'eng7a3-q3',
            type: 'choice',
            stem: 'They ____ in Beijing.',
            options: ['are', 'is', 'am', 'be'],
            answer: 0,
            explain: '主语 They 是复数，be 动词用 are。'
          },
          {
            id: 'eng7a3-q4',
            type: 'judge',
            stem: '一般现在时中，主语是第三人称单数时，实义动词要加 -s 或 -es。',
            answer: true,
            explain: '例如 play→plays，watch→watches，study→studies。'
          },
          {
            id: 'eng7a3-q5',
            type: 'choice',
            stem: 'He ____ TV every evening.',
            options: ['watches', 'watch', 'watching', 'watched'],
            answer: 0,
            explain: '主语 He 是第三人称单数，watch 以 ch 结尾，加 -es 变为 watches。'
          },
          {
            id: 'eng7a3-q6',
            type: 'fill',
            stem: 'My sister ____ music. (like)',
            accept: ['likes'],
            hint: '注意第三人称单数',
            explain: '主语 My sister 是第三人称单数，like 要加 -s，变为 likes。'
          },
          {
            id: 'eng7a3-q7',
            type: 'choice',
            stem: '—Do you like apples? —Yes, I ____.',
            options: ['do', 'does', 'am', 'is'],
            answer: 0,
            explain: 'Do 引导的一般疑问句，肯定回答用 Yes, I do.。'
          },
          {
            id: 'eng7a3-q8',
            type: 'judge',
            stem: '“Does he play football?”的肯定回答是“Yes, he does.”。',
            answer: true,
            explain: 'Does 引导的一般疑问句，肯定回答用 Yes, he does.，否定回答用 No, he doesn\'t.。'
          }
        ]
      },
      {
        id: 'eng-7a-4',
        title: '第四章 词汇与情景交际',
        subtitle: '颜色、数字、家庭与学校物品',
        questions: [
          {
            id: 'eng7a4-q1',
            type: 'choice',
            stem: '“红色”的英文是（　）',
            options: ['red', 'blue', 'green', 'yellow'],
            answer: 0,
            explain: 'red 红色，blue 蓝色，green 绿色，yellow 黄色。'
          },
          {
            id: 'eng7a4-q2',
            type: 'choice',
            stem: '数字 12 的英文是（　）',
            options: ['twelve', 'twenty', 'two', 'ten'],
            answer: 0,
            explain: '12 是 twelve，20 是 twenty，2 是 two，10 是 ten。'
          },
          {
            id: 'eng7a4-q3',
            type: 'choice',
            stem: '—What\'s this in English? —____',
            options: ["It's a ruler.", 'Yes, it is.', 'Thank you.', 'I\'m fine.'],
            answer: 0,
            explain: 'What\'s this in English? 询问某物用英语怎么说，回答用 It\'s a/an...。'
          },
          {
            id: 'eng7a4-q4',
            type: 'judge',
            stem: '别人说“Thank you.”时，可以回答“You\'re welcome.”。',
            answer: true,
            explain: 'You\'re welcome. 意为“不客气”，是对 Thank you 的常见回答。'
          },
          {
            id: 'eng7a4-q5',
            type: 'choice',
            stem: '“father”的意思是（　）',
            options: ['父亲', '母亲', '兄弟', '姐妹'],
            answer: 0,
            explain: 'father 父亲，mother 母亲，brother 兄弟，sister 姐妹。'
          },
          {
            id: 'eng7a4-q6',
            type: 'fill',
            stem: '“书包”的英文是 ____.',
            accept: ['schoolbag', 'school bag'],
            hint: '一个合成词',
            explain: 'schoolbag 由 school（学校）和 bag（包）组成，意为书包。'
          },
          {
            id: 'eng7a4-q7',
            type: 'choice',
            stem: '—Where is my pencil? —____',
            options: ["It's in the pencil box.", 'Yes, it is.', 'It\'s red.', 'I\'m fine.'],
            answer: 0,
            explain: 'Where 询问地点，回答用 It\'s in/on/under...。'
          },
          {
            id: 'eng7a4-q8',
            type: 'judge',
            stem: '“Excuse me”通常用于打扰别人或请求帮助之前。',
            answer: true,
            explain: 'Excuse me 意为“打扰一下”，用于引起注意、请求帮助或借过。'
          }
        ]
      },
      {
        id: 'eng-7b-1',
        title: '第五章 情态动词 can',
        subtitle: '能力、请求与许可',
        questions: [
          {
            id: 'eng7b1-q1',
            type: 'choice',
            stem: 'I can ____ the guitar.',
            options: ['play', 'plays', 'playing', 'played'],
            answer: 0,
            explain: '情态动词 can 后面接动词原形，所以用 play。'
          },
          {
            id: 'eng7b1-q2',
            type: 'choice',
            stem: '—Can you swim? —Yes, I ____.',
            options: ['can', 'do', 'am', 'is'],
            answer: 0,
            explain: 'Can 引导的一般疑问句，肯定回答用 Yes, I can.，否定回答用 No, I can’t.。'
          },
          {
            id: 'eng7b1-q3',
            type: 'choice',
            stem: 'She can ____ English.',
            options: ['speak', 'speaks', 'speaking', 'spoke'],
            answer: 0,
            explain: 'can 后接动词原形，speak English 表示“说英语”。'
          },
          {
            id: 'eng7b1-q4',
            type: 'judge',
            stem: '情态动词 can 后面要接动词原形。',
            answer: true,
            explain: 'can 没有人称和数的变化，后面一律接动词原形。'
          },
          {
            id: 'eng7b1-q5',
            type: 'choice',
            stem: '—What can you do? —____',
            options: ['I can dance.', 'I am dancing.', 'Yes, I can.', 'I like dancing.'],
            answer: 0,
            explain: 'What can you do? 询问能力，回答用 I can + 动词原形。'
          },
          {
            id: 'eng7b1-q6',
            type: 'fill',
            stem: 'He can ____ (play) chess.',
            accept: ['play'],
            hint: 'can 后面用动词原形',
            explain: 'can 后接动词原形，所以填 play。'
          },
          {
            id: 'eng7b1-q7',
            type: 'choice',
            stem: '想请别人帮忙，可以说（　）',
            options: ['Can you help me?', 'Can I help you?', 'What can you do?', 'You can help me.'],
            answer: 0,
            explain: 'Can you help me? 意为“你能帮我吗？”，用于请求帮助。'
          },
          {
            id: 'eng7b1-q8',
            type: 'judge',
            stem: 'Can 引导的一般疑问句，肯定回答用 Yes, I can.。',
            answer: true,
            explain: 'Can 问句用 can 回答，Yes, I can. / No, I can’t.。'
          }
        ]
      },
      {
        id: 'eng-7b-2',
        title: '第六章 频度副词与日常作息',
        subtitle: 'always / usually / sometimes / never 与时间表达',
        questions: [
          {
            id: 'eng7b2-q1',
            type: 'choice',
            stem: '—What time do you get up? —____',
            options: ['At six.', 'On Monday.', 'In the morning.', 'It’s six.'],
            answer: 0,
            explain: 'What time 询问具体时间，回答用 at + 时间点。'
          },
          {
            id: 'eng7b2-q2',
            type: 'choice',
            stem: 'always 的意思是（　）',
            options: ['总是', '通常', '有时', '从不'],
            answer: 0,
            explain: 'always 总是，usually 通常，sometimes 有时，never 从不。'
          },
          {
            id: 'eng7b2-q3',
            type: 'choice',
            stem: 'She usually ____ to school by bike.',
            options: ['goes', 'go', 'going', 'went'],
            answer: 0,
            explain: '一般现在时，主语 She 是第三人称单数，go 变为 goes。'
          },
          {
            id: 'eng7b2-q4',
            type: 'judge',
            stem: '频度副词通常放在实义动词之前。',
            answer: true,
            explain: '例如 I usually go to school by bus.，usually 放在实义动词 go 前。'
          },
          {
            id: 'eng7b2-q5',
            type: 'choice',
            stem: '“我从不迟到”用英语说是（　）',
            options: ['I am never late.', 'I never am late.', 'I am late never.', 'Never I am late.'],
            answer: 0,
            explain: '频度副词放在 be 动词之后，所以是 I am never late.。'
          },
          {
            id: 'eng7b2-q6',
            type: 'fill',
            stem: '他从不迟到：He is ____ late.',
            accept: ['never'],
            hint: '填一个频度副词',
            explain: '“从不”是 never，放在 be 动词 is 之后。'
          },
          {
            id: 'eng7b2-q7',
            type: 'choice',
            stem: '—What time does he go to bed? —____',
            options: ['At nine.', 'On Sunday.', 'In the evening.', 'It is nine.'],
            answer: 0,
            explain: 'What time does he...? 询问时间，回答用 at + 时间点。'
          },
          {
            id: 'eng7b2-q8',
            type: 'judge',
            stem: '“What time”用来询问时间。',
            answer: true,
            explain: 'What time 意为“几点”，用于询问具体时间。'
          }
        ]
      },
      {
        id: 'eng-7b-3',
        title: '第七章 现在进行时',
        subtitle: 'be + 动词-ing 表示正在发生',
        questions: [
          {
            id: 'eng7b3-q1',
            type: 'choice',
            stem: 'She is ____ TV now.',
            options: ['watching', 'watch', 'watches', 'watched'],
            answer: 0,
            explain: '现在进行时结构是 be + 动词-ing，She is watching TV now.。'
          },
          {
            id: 'eng7b3-q2',
            type: 'choice',
            stem: 'They are ____ football.',
            options: ['playing', 'play', 'plays', 'played'],
            answer: 0,
            explain: 'are 后面接动词-ing，play 变为 playing。'
          },
          {
            id: 'eng7b3-q3',
            type: 'judge',
            stem: '现在进行时的结构是“be + 动词-ing”。',
            answer: true,
            explain: '现在进行时由 be 动词（am/is/are）加动词的 -ing 形式构成。'
          },
          {
            id: 'eng7b3-q4',
            type: 'choice',
            stem: 'I am ____ a book.',
            options: ['reading', 'read', 'reads', 'readed'],
            answer: 0,
            explain: 'am 后面接动词-ing，read 变为 reading。'
          },
          {
            id: 'eng7b3-q5',
            type: 'choice',
            stem: '—What are you doing? —____',
            options: ['I’m doing my homework.', 'I do my homework.', 'I did my homework.', 'Yes, I am.'],
            answer: 0,
            explain: 'What are you doing? 询问正在做什么，用现在进行时回答。'
          },
          {
            id: 'eng7b3-q6',
            type: 'fill',
            stem: 'Look! The boy is ____ (run).',
            accept: ['running'],
            hint: '注意双写末尾字母',
            explain: 'run 是重读闭音节，双写 n 再加 -ing，变为 running。'
          },
          {
            id: 'eng7b3-q7',
            type: 'judge',
            stem: '现在进行时表示说话时正在进行的动作。',
            answer: true,
            explain: '现在进行时表示此刻正在发生或进行的动作。'
          },
          {
            id: 'eng7b3-q8',
            type: 'choice',
            stem: '动词 run 的 -ing 形式是（　）',
            options: ['running', 'runing', 'runnning', 'runs'],
            answer: 0,
            explain: 'run 末尾是重读闭音节，要双写 n 再加 -ing，所以是 running。'
          }
        ]
      },
      {
        id: 'eng-7b-4',
        title: '第八章 There be 与方位介词',
        subtitle: '存在句、就近原则与问路',
        questions: [
          {
            id: 'eng7b4-q1',
            type: 'choice',
            stem: 'There ____ a book on the desk.',
            options: ['is', 'are', 'am', 'be'],
            answer: 0,
            explain: 'There be 句型中，主语 a book 是单数，用 is。'
          },
          {
            id: 'eng7b4-q2',
            type: 'choice',
            stem: 'There ____ two apples in the box.',
            options: ['are', 'is', 'am', 'be'],
            answer: 0,
            explain: '主语 two apples 是复数，There be 用 are。'
          },
          {
            id: 'eng7b4-q3',
            type: 'judge',
            stem: 'There be 句型遵循“就近原则”，be 动词与最近的主语保持一致。',
            answer: true,
            explain: '例如 There is a pen and two books.，be 动词与最近的 a pen 一致。'
          },
          {
            id: 'eng7b4-q4',
            type: 'choice',
            stem: 'The bank is ____ the post office.',
            options: ['next to', 'next', 'near to', 'beside of'],
            answer: 0,
            explain: 'next to 表示“紧挨着、在……旁边”。'
          },
          {
            id: 'eng7b4-q5',
            type: 'choice',
            stem: '—Is there a park near here? —____',
            options: ['Yes, there is.', 'Yes, it is.', 'Yes, there are.', 'Yes, I am.'],
            answer: 0,
            explain: 'Is there...? 的肯定回答是 Yes, there is.，否定回答是 No, there isn’t.。'
          },
          {
            id: 'eng7b4-q6',
            type: 'fill',
            stem: '在……对面：____ from',
            accept: ['across'],
            hint: '填一个介词',
            explain: 'across from 表示“在……对面”，如 across from the bank。'
          },
          {
            id: 'eng7b4-q7',
            type: 'judge',
            stem: 'between 表示“在两者之间”。',
            answer: true,
            explain: 'between 通常用于两者之间，among 用于三者或三者以上之间。'
          },
          {
            id: 'eng7b4-q8',
            type: 'choice',
            stem: '向别人问路，可以说（　）',
            options: ['How can I get to the library?', 'Where is the library?', 'What is the library?', 'How is the library?'],
            answer: 0,
            explain: 'How can I get to...? 是问路的常用句型；Where is...? 也可以，但选项里 A 最完整。'
          }
        ]
      },
      {
        id: 'eng-7b-5',
        title: '第九章 一般过去时',
        subtitle: '规则与不规则动词的过去式',
        questions: [
          {
            id: 'eng7b5-q1',
            type: 'choice',
            stem: 'I ____ to the zoo yesterday.',
            options: ['went', 'go', 'goes', 'going'],
            answer: 0,
            explain: 'yesterday 表示过去，用一般过去时，go 的过去式是 went。'
          },
          {
            id: 'eng7b5-q2',
            type: 'choice',
            stem: 'She ____ her homework last night.',
            options: ['did', 'does', 'do', 'doing'],
            answer: 0,
            explain: 'last night 表示过去，do 的过去式是 did。'
          },
          {
            id: 'eng7b5-q3',
            type: 'judge',
            stem: '一般过去时表示过去某个时间发生的动作或存在的状态。',
            answer: true,
            explain: '一般过去时常与 yesterday、last night、two days ago 等时间状语连用。'
          },
          {
            id: 'eng7b5-q4',
            type: 'choice',
            stem: 'They ____ happy at the party.',
            options: ['were', 'was', 'are', 'is'],
            answer: 0,
            explain: '主语 They 是复数，be 动词的过去式用 were。'
          },
          {
            id: 'eng7b5-q5',
            type: 'choice',
            stem: 'He ____ basketball yesterday.',
            options: ['played', 'plays', 'play', 'playing'],
            answer: 0,
            explain: 'yesterday 表示过去，play 是规则动词，过去式加 -ed 变为 played。'
          },
          {
            id: 'eng7b5-q6',
            type: 'fill',
            stem: 'go 的过去式是 ____。',
            accept: ['went'],
            hint: '不规则动词',
            explain: 'go 是不规则动词，过去式是 went。'
          },
          {
            id: 'eng7b5-q7',
            type: 'choice',
            stem: '—Did you watch TV last night? —____',
            options: ['Yes, I did.', 'Yes, I do.', 'Yes, I was.', 'Yes, I am.'],
            answer: 0,
            explain: 'Did 引导的一般疑问句，肯定回答用 Yes, I did.，否定回答用 No, I didn’t.。'
          },
          {
            id: 'eng7b5-q8',
            type: 'judge',
            stem: '规则动词的过去式一般在词尾加 -ed。',
            answer: true,
            explain: '如 play→played，watch→watched；以 e 结尾加 -d，如 like→liked。'
          }
        ]
      },
      {
        id: 'eng-7b-6',
        title: '第十章 情景交际',
        subtitle: '天气、外貌、购物、问路与电话',
        questions: [
          {
            id: 'eng7b6-q1',
            type: 'choice',
            stem: '询问天气，可以说（　）',
            options: ['What’s the weather like?', 'What’s the time?', 'What’s your name?', 'How old are you?'],
            answer: 0,
            explain: 'What’s the weather like? 意为“天气怎么样？”，也可以说 How’s the weather?。'
          },
          {
            id: 'eng7b6-q2',
            type: 'choice',
            stem: '询问某人的外貌，可以说（　）',
            options: ['What does he look like?', 'What does he like?', 'How does he feel?', 'What is he doing?'],
            answer: 0,
            explain: 'What does he look like? 询问外貌；What does he like? 询问喜好。'
          },
          {
            id: 'eng7b6-q3',
            type: 'choice',
            stem: '购物时询问价格，可以说（　）',
            options: ['How much is it?', 'How many is it?', 'How old is it?', 'How is it?'],
            answer: 0,
            explain: 'How much 询问价格或不可数名词的数量；How many 询问可数名词数量。'
          },
          {
            id: 'eng7b6-q4',
            type: 'choice',
            stem: '给别人指路，可以说（　）',
            options: ['Go along this street.', 'How are you?', 'Nice to meet you.', 'What’s this?'],
            answer: 0,
            explain: 'Go along this street. 意为“沿着这条街走”，是常见的指路用语。'
          },
          {
            id: 'eng7b6-q5',
            type: 'judge',
            stem: '点餐时可以说“I’d like some noodles.”。',
            answer: true,
            explain: 'I’d like... 是“我想要……”的意思，常用于点餐或提出请求。'
          },
          {
            id: 'eng7b6-q6',
            type: 'fill',
            stem: '别人说 Thank you，你可以回答：You’re ____.',
            accept: ['welcome'],
            hint: '填一个单词',
            explain: 'You’re welcome. 意为“不客气”，是对感谢的常见回答。'
          },
          {
            id: 'eng7b6-q7',
            type: 'choice',
            stem: '邀请别人，可以说（　）',
            options: ['Would you like to come to my party?', 'Do you like my party?', 'Did you come to my party?', 'Are you my party?'],
            answer: 0,
            explain: 'Would you like to...? 用于礼貌地邀请别人。'
          },
          {
            id: 'eng7b6-q8',
            type: 'choice',
            stem: '接电话时介绍自己，可以说（　）',
            options: ['This is Tom speaking.', 'I am Tom speaking.', 'That is Tom.', 'Tom is speaking me.'],
            answer: 0,
            explain: '电话用语中常用 This is... speaking. 介绍自己。'
          }
        ]
      }
    ]
  });
})();