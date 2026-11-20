/* ============================================================
   装扮与装备立绘（内联 SVG，无外部图片）
   ------------------------------------------------------------
   GameAvatar.art(item, size)      单件物品图标
   GameAvatar.figure(profile, size) 角色立绘：人物 + 已穿戴的装扮
   ============================================================ */
(function (global) {
  'use strict';

  var SKIN = '#9fe6c9';
  var DARK = '#1b3049';
  var METAL = '#5c86a8';

  /* ---- 单件图标：统一 48×48 画布 ---- */
  var ART = {
    scanner:
      '<circle cx="24" cy="26" r="14" fill="#16344a" stroke="#6fe3c0" stroke-width="2"/>' +
      '<circle cx="24" cy="26" r="8" fill="none" stroke="#6fe3c0" stroke-width="1.2" opacity=".65"/>' +
      '<path d="M24 26 L34 17" stroke="#6fe3c0" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="24" cy="26" r="2.6" fill="#b6ffe9"/>' +
      '<rect x="19" y="4" width="10" height="5" rx="2.5" fill="#2a4a63"/>',

    hoverboard:
      '<ellipse cx="24" cy="36" rx="16" ry="4" fill="#6fe3c0" opacity=".2"/>' +
      '<path d="M7 27 q7 -6 17 -6 t17 6 q-5 5 -17 5 t-17 -5z" fill="#22405c" stroke="#6fe3c0" stroke-width="1.6"/>' +
      '<path d="M12 35 q12 3 24 0" stroke="#6fe3c0" stroke-width="1.4" opacity=".6" fill="none"/>' +
      '<path d="M15 23 q9 -3 18 0" stroke="#b6ffe9" stroke-width="1.6" fill="none" stroke-linecap="round"/>',

    drone:
      '<circle cx="9" cy="14" r="5" fill="none" stroke="#8fd6ff" stroke-width="1.5"/>' +
      '<circle cx="39" cy="14" r="5" fill="none" stroke="#8fd6ff" stroke-width="1.5"/>' +
      '<circle cx="9" cy="34" r="5" fill="none" stroke="#8fd6ff" stroke-width="1.5"/>' +
      '<circle cx="39" cy="34" r="5" fill="none" stroke="#8fd6ff" stroke-width="1.5"/>' +
      '<path d="M14 16 L34 32 M34 16 L14 32" stroke="#3f6d92" stroke-width="2"/>' +
      '<rect x="16" y="18" width="16" height="12" rx="5" fill="#22405c" stroke="#8fd6ff" stroke-width="1.6"/>' +
      '<circle cx="24" cy="24" r="3" fill="#b9e8ff"/>',

    plasmapen:
      '<path d="M31 8 l9 9 -19 18 -8 2 2 -8z" fill="#3a2b5c" stroke="#c9a6ff" stroke-width="1.6"/>' +
      '<path d="M31 8 l9 9" stroke="#e6d3ff" stroke-width="1.6"/>' +
      '<circle cx="14" cy="34" r="3.2" fill="#e6d3ff"/>' +
      '<path d="M8 18 v-4 M6 16 h4" stroke="#c9a6ff" stroke-width="1.4" stroke-linecap="round"/>',

    pulsegun:
      '<path d="M11 17 h20 l9 6 -9 3 v4 h-9 l-2 8 h-6 l2 -8 h-5z" fill="#2a3a56" stroke="#ffd166" stroke-width="1.6"/>' +
      '<rect x="17" y="21" width="11" height="3" rx="1.5" fill="#ffd166"/>' +
      '<circle cx="40" cy="23" r="2" fill="#fff3c4"/>',

    dagger:
      '<path d="M27 6 l7 7 -17 17 -5 -5z" fill="#cfe3ff" stroke="#9fd0ff" stroke-width="1.4"/>' +
      '<path d="M13 29 l6 6" stroke="#f0a03c" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="10" cy="36" r="2.4" fill="#f0a03c"/>',

    armor:
      '<path d="M16 9 h16 l6 9 -4 20 -10 5 -10 -5 -4 -20z" fill="#2a4560" stroke="#9fd0ff" stroke-width="1.7"/>' +
      '<path d="M24 11 v22" stroke="#9fd0ff" stroke-width="1.2" opacity=".55"/>' +
      '<circle cx="24" cy="20" r="3.4" fill="#9fd0ff" opacity=".7"/>' +
      '<path d="M17 33 h14" stroke="#9fd0ff" stroke-width="1.2" opacity=".5"/>',

    shield:
      '<path d="M24 5 l14 6 v12 q0 12 -14 18 q-14 -6 -14 -18 v-12z" fill="#173a4c" stroke="#6fe3c0" stroke-width="2"/>' +
      '<path d="M24 13 l8 3 v7 q0 7 -8 12 q-8 -5 -8 -12 v-7z" fill="#6fe3c0" opacity=".28"/>' +
      '<path d="M24 20 v10" stroke="#b6ffe9" stroke-width="1.6" stroke-linecap="round"/>',

    cloak:
      '<path d="M24 5 q11 0 13 11 l4 27 h-34 l4 -27 q2 -11 13 -11z" fill="#2b2350" stroke="#c9a6ff" stroke-width="1.6"/>' +
      '<path d="M24 9 v30" stroke="#c9a6ff" stroke-width="1.2" opacity=".4"/>' +
      '<path d="M15 12 q-7 12 -9 29" fill="none" stroke="#c9a6ff" stroke-width="1.2" opacity=".4"/>' +
      '<path d="M33 12 q7 12 9 29" fill="none" stroke="#c9a6ff" stroke-width="1.2" opacity=".4"/>',

    wings:
      '<path d="M23 26 q-9 -12 -18 -9 q5 11 14 15 q-11 0 -15 7 q11 4 19 -3 z" fill="#3a2b6b" stroke="#c9a6ff" stroke-width="1.5"/>' +
      '<path d="M25 26 q9 -12 18 -9 q-5 11 -14 15 q11 0 15 7 q-11 4 -19 -3 z" fill="#3a2b6b" stroke="#c9a6ff" stroke-width="1.5"/>' +
      '<circle cx="24" cy="22" r="3" fill="#e6d3ff"/>',

    tailwing:
      '<path d="M9 34 l11 -14 v9 l11 -11 -5 15 12 2 -20 6z" fill="#22405c" stroke="#8fd6ff" stroke-width="1.6"/>' +
      '<path d="M39 14 l-8 6" stroke="#8fd6ff" stroke-width="1.4" opacity=".6"/>',

    helmet:
      '<path d="M10 27 q0 -17 14 -17 t14 17 v3 h-6 v-5 q-8 -5 -16 0 v5 h-6z" fill="#243a55" stroke="#ff7ad9" stroke-width="1.7"/>' +
      '<path d="M14 22 q10 -5 20 0" stroke="#ff7ad9" stroke-width="2" fill="none"/>' +
      '<path d="M18 30 h12" stroke="#ff7ad9" stroke-width="1.4" opacity=".7"/>',

    energybar:
      '<rect x="12" y="14" width="24" height="20" rx="4" fill="#3a2b1f" stroke="#f0a03c" stroke-width="1.6"/>' +
      '<path d="M12 21 h24 M12 27 h24" stroke="#f0a03c" stroke-width="1.2" opacity=".6"/>' +
      '<path d="M24 18 l-4 6 h4 l-2 5 6 -7 h-4z" fill="#ffd166"/>',

    candy:
      '<circle cx="24" cy="24" r="10" fill="#ff9ec7" stroke="#ffe0ee" stroke-width="1.6"/>' +
      '<path d="M14 24 l-6 -6 v12z M34 24 l6 -6 v12z" fill="#ffe0ee"/>' +
      '<path d="M20 20 q4 4 0 8" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7"/>',

    ration:
      '<path d="M14 16 q10 -6 20 0 v16 q-10 5 -20 0z" fill="#2a4560" stroke="#9fd0ff" stroke-width="1.6"/>' +
      '<path d="M14 20 q10 -4 20 0" stroke="#9fd0ff" stroke-width="1.4" opacity=".6"/>' +
      '<rect x="20" y="25" width="8" height="4" rx="1.5" fill="#9fd0ff" opacity=".7"/>',

    cola:
      '<path d="M18 12 h12 l-2 6 v18 a6 6 0 0 1 -8 0 v-18z" fill="#2a4560" stroke="#8fd6ff" stroke-width="1.6"/>' +
      '<path d="M18 22 h12" stroke="#8fd6ff" stroke-width="1.2" opacity=".6"/>' +
      '<path d="M22 30 q4 -5 8 0" stroke="#b6ffe9" stroke-width="1.4" fill="none"/>'
  };

  var FALLBACK =
    '<rect x="9" y="9" width="30" height="30" rx="8" fill="#22405c" stroke="#8fd6ff" stroke-width="1.6"/>' +
    '<text x="24" y="30" text-anchor="middle" font-size="15" fill="#8fd6ff">?</text>';

  function art(itemOrId, size) {
    var id = typeof itemOrId === 'string' ? itemOrId : (itemOrId && itemOrId.id);
    var px = size || 28;
    return '<svg class="av-art" viewBox="0 0 48 48" width="' + px + '" height="' + px +
      '" aria-hidden="true" focusable="false">' + (ART[id] || FALLBACK) + '</svg>';
  }

  function inner(item, x, y, size) {
    var id = item ? item.id : '';
    return '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 48 48" overflow="visible">' + (ART[id] || FALLBACK) + '</svg>';
  }

  function rarityColor(item) {
    var r = GameItems.rarity[item.rarity];
    return r ? r.color : METAL;
  }

  /* ---- 角色立绘 ---- */
  function figure(profile, size) {
    var p = profile || {};
    var eq = p.equipped || {};
    var tool = eq.tool ? GameItems.get(eq.tool) : null;
    var weapon = eq.weapon ? GameItems.get(eq.weapon) : null;
    var armor = eq.armor ? GameItems.get(eq.armor) : null;
    var wings = eq.wings ? GameItems.get(eq.wings) : null;

    var back = '';
    var wear = '';
    var head = '';

    // 身后：翅膀 / 尾翼 / 斗篷
    if (wings && wings.id === 'wings') {
      var wc = rarityColor(wings);
      back += '<path d="M52 74 q-20 -26 -38 -20 q10 22 34 30 q-22 2 -30 16 q22 6 38 -6z" fill="' + wc + '" opacity=".55"/>' +
        '<path d="M68 74 q20 -26 38 -20 q-10 22 -34 30 q22 2 30 16 q-22 6 -38 -6z" fill="' + wc + '" opacity=".55"/>';
    }
    if (wings && wings.id === 'tailwing') {
      var tc = rarityColor(wings);
      back += '<path d="M42 92 l-22 -16 4 14 -12 2 26 12z" fill="' + tc + '" opacity=".65"/>' +
        '<path d="M78 92 l22 -16 -4 14 12 2 -26 12z" fill="' + tc + '" opacity=".65"/>';
    }
    if (armor && armor.id === 'cloak') {
      var cc = rarityColor(armor);
      back += '<path d="M60 52 q26 4 30 26 l6 46 h-72 l6 -46 q4 -22 30 -26z" fill="' + cc + '" opacity=".5"/>';
    }

    // 头盔
    if (wings && wings.id === 'helmet') {
      var hc = rarityColor(wings);
      head += '<path d="M42 44 q0 -24 18 -24 t18 24 v4 h-7 v-7 q-11 -6 -22 0 v7 h-7z" fill="#243a55" stroke="' + hc + '" stroke-width="2"/>' +
        '<path d="M47 37 q13 -6 26 0" stroke="' + hc + '" stroke-width="2.4" fill="none"/>';
    }

    // 胸甲 / 盾
    if (armor && (armor.id === 'armor' || armor.id === 'shield')) {
      var ac = rarityColor(armor);
      wear += '<path d="M48 62 h24 l3 30 h-30z" fill="' + ac + '" opacity=".45" stroke="' + ac + '" stroke-width="1.6"/>' +
        '<circle cx="60" cy="72" r="4" fill="' + ac + '"/>';
    }
    if (armor && armor.id === 'shield') {
      var sc = rarityColor(armor);
      wear += '<path d="M34 78 l12 5 v10 q0 10 -12 15 q-12 -5 -12 -15 v-10z" fill="' + sc + '" opacity=".6" stroke="' + sc + '" stroke-width="1.6"/>';
    }

    var body =
      '<ellipse cx="60" cy="140" rx="26" ry="5" fill="#000" opacity=".28"/>' +
      '<path d="M50 92 v30 M70 92 v30" stroke="#2a4560" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M50 124 v10 M70 124 v10" stroke="#3b5d7d" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="M46 62 q14 -6 28 0 l4 34 h-36z" fill="#31536f"/>' +
      '<path d="M46 70 l-10 20 M74 70 l10 20" stroke="' + SKIN + '" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="60" cy="40" r="18" fill="' + SKIN + '"/>' +
      '<circle cx="53" cy="38" r="2.6" fill="' + DARK + '"/>' +
      '<circle cx="67" cy="38" r="2.6" fill="' + DARK + '"/>' +
      '<path d="M55 47 q5 4 10 0" stroke="' + DARK + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>';

    var hands = '';
    // 工具握在左手、武器握在右手（图标中心对齐手腕，避免看起来悬空）
    if (tool) {
      if (tool.id === 'hoverboard') {
        hands += inner(tool, 30, 118, 60);          // 滑板踩在脚下
      } else if (tool.id === 'drone') {
        hands += inner(tool, 78, 10, 34);           // 无人机悬在头顶右上方
      } else {
        hands += '<path d="M46 92 l-8 4" stroke="' + SKIN + '" stroke-width="6" stroke-linecap="round"/>';
        hands += inner(tool, 22, 76, 28);
      }
    }
    if (weapon) {
      hands += '<path d="M74 92 l8 4" stroke="' + SKIN + '" stroke-width="6" stroke-linecap="round"/>';
      hands += inner(weapon, 70, 76, 28);
    }

    var px = size || 120;
    return '<svg class="av-figure" viewBox="0 0 120 150" width="' + px + '" height="' + Math.round(px * 1.25) +
      '" aria-hidden="true" focusable="false">' + back + body + wear + head + hands + '</svg>';
  }

  global.GameAvatar = {
    art: art,
    figure: figure,
    has: function (id) { return !!ART[id]; }
  };
})(window);