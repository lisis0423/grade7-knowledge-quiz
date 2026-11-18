/* ============================================================
   音效：用 WebAudio 现场合成，不需要任何音频文件
   ============================================================ */
(function (global) {
  'use strict';

  var ctx = null;
  var enabled = true;

  var PATTERNS = {
    click:   [{ f: 420, at: 0, dur: 0.04, type: 'sine', vol: 0.05 }],
    correct: [{ f: 660, at: 0, dur: 0.07, type: 'sine', vol: 0.07 },
              { f: 880, at: 0.075, dur: 0.10, type: 'sine', vol: 0.07 }],
    wrong:   [{ f: 240, at: 0, dur: 0.12, type: 'triangle', vol: 0.06 },
              { f: 178, at: 0.11, dur: 0.18, type: 'triangle', vol: 0.06 }],
    combo:   [{ f: 880, at: 0, dur: 0.05, type: 'sine', vol: 0.06 },
              { f: 1100, at: 0.055, dur: 0.05, type: 'sine', vol: 0.06 },
              { f: 1320, at: 0.11, dur: 0.10, type: 'sine', vol: 0.06 }],
    finish:  [{ f: 523, at: 0, dur: 0.09, type: 'sine', vol: 0.07 },
              { f: 659, at: 0.1, dur: 0.09, type: 'sine', vol: 0.07 },
              { f: 784, at: 0.2, dur: 0.10, type: 'sine', vol: 0.07 },
              { f: 1046, at: 0.31, dur: 0.22, type: 'sine', vol: 0.07 }]
  };

  function ensureContext() {
    if (!enabled) return null;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      try { ctx = new AC(); } catch (e) { return null; }
    }
    if (ctx.state === 'suspended' && ctx.resume) {
      try { ctx.resume(); } catch (e) { /* ignore */ }
    }
    return ctx;
  }

  function play(name) {
    var pattern = PATTERNS[name];
    var c = ensureContext();
    if (!pattern || !c) return;
    var now = c.currentTime;
    pattern.forEach(function (note) {
      var osc = c.createOscillator();
      var gain = c.createGain();
      osc.type = note.type || 'sine';
      osc.frequency.value = note.f;
      var start = now + note.at;
      var end = start + note.dur;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(note.vol, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(start);
      osc.stop(end + 0.02);
    });
  }

  function setEnabled(value) {
    enabled = !!value;
  }

  function isEnabled() {
    return enabled;
  }

  global.GameAudio = {
    play: play,
    setEnabled: setEnabled,
    isEnabled: isEnabled
  };
})(window);