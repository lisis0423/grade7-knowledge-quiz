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
      }
    ]
  });
})();