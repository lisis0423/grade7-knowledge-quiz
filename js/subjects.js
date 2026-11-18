/* ============================================================
   科目注册表
   ------------------------------------------------------------
   题库文件（data/*.js）只要调用：
     GameSubjects.register({ id:'geography', name:'地理', ... , levels:[...] })
   就能出现在首页。同一个 id 分多个文件注册时，关卡会按顺序合并。

   科目对象字段：
     id        必填，唯一英文标识
     name      显示名
     icon      一个 emoji
     color     主题色（用于卡片小装饰）
     desc      一句话介绍
     order     首页排序，小的在前
     available 是否可玩，false 显示为“待接入”占位卡
     levels    [{ id, title, subtitle, questions: [...] }]

   题目对象字段（type 决定作答方式）：
     choice  单选题：options:[...]  answer: 正确项下标
     judge   判断题：answer: true / false
     fill    填空题：accept: ['可接受答案', ...]，题干里用 ____ 占位
     match   连线题：left:[...] right:[...] answer: [左项 i 对应的右项下标, ...]
   通用字段：
     id（可省略，自动生成）、stem（题干）、explain（解析）、
     svg（可选，内联 SVG 示意图字符串）、caption（图的说明）、hint（可选提示）
   ============================================================ */
(function (global) {
  'use strict';

  var subjects = [];

  function get(id) {
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === id) return subjects[i];
    }
    return null;
  }

  function normalizeLevel(subject, level, index) {
    level.id = level.id || (subject.id + '-lv' + (index + 1));
    level.title = level.title || ('第 ' + (index + 1) + ' 关');
    level.subtitle = level.subtitle || '';
    level.questions = level.questions || [];

    level.questions.forEach(function (q, i) {
      q.id = q.id || (level.id + '-q' + (i + 1));
      q.subjectId = subject.id;
      q.levelId = level.id;
      if (!q.type) q.type = 'choice';
      if (q.type === 'choice' && q.answer === undefined && q.answers) q.answer = q.answers[0];
    });
    return level;
  }

  /**
   * 注册 / 追加一个科目。返回科目对象（可直接使用）。
   */
  function register(subject) {
    if (!subject || !subject.id) {
      throw new Error('[GameSubjects] 科目必须有 id');
    }
    var target = get(subject.id);
    if (!target) {
      target = {};
      Object.keys(subject).forEach(function (k) {
        if (k !== 'levels') target[k] = subject[k];
      });
      target.levels = [];
      target.id = subject.id;
      target.name = subject.name || subject.id;
      target.icon = subject.icon || '📘';
      target.desc = subject.desc || '';
      target.color = subject.color || '#1f6f5c';
      target.available = subject.available !== false;
      target.order = subject.order === undefined ? 99 : subject.order;
      subjects.push(target);
    }
    (subject.levels || []).forEach(function (level) {
      target.levels.push(normalizeLevel(target, level, target.levels.length));
    });
    return target;
  }

  function all() {
    return subjects.slice().sort(function (a, b) {
      return (a.order || 99) - (b.order || 99);
    });
  }

  function playable() {
    return all().filter(function (s) { return s.available !== false; });
  }

  function levels(subjectId) {
    var s = get(subjectId);
    return s ? s.levels : [];
  }

  function level(subjectId, levelId) {
    var list = levels(subjectId);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === levelId) return list[i];
    }
    return null;
  }

  function question(subjectId, levelId, questionId) {
    var lv = level(subjectId, levelId);
    if (!lv) return null;
    for (var i = 0; i < lv.questions.length; i++) {
      if (lv.questions[i].id === questionId) return lv.questions[i];
    }
    return null;
  }

  function countQuestions(subjectId) {
    return levels(subjectId).reduce(function (n, lv) { return n + lv.questions.length; }, 0);
  }

  global.GameSubjects = {
    register: register,
    all: all,
    playable: playable,
    get: get,
    levels: levels,
    level: level,
    question: question,
    countQuestions: countQuestions
  };
})(window);