/* ============================================================
   装备与道具
   ------------------------------------------------------------
   slot：tool 工具 / weapon 武器 / armor 防具 / wings 装扮 / food 消耗品
   rarity：1 普通 2 精良 3 稀有 4 传说
   effect：
     skip        每关可跳过 N 题
     hint        每关可排除 N 个干扰选项 / 查看提示
     retry       每关额外重答 N 次
     shield      每关抵挡 N 次扣分
     comboGuard  每关保护 N 次连击
     timeBonus   每题增加 N 秒
     scoreRate   得分加成（0.05 = +5%）
     coinRate    金币加成
     penaltyReduce 扣分减免比例
     exp / coins 消耗品使用后直接获得
   ============================================================ */
(function (global) {
  'use strict';

  var list = [
    {
      id: 'scanner', name: '测绘扫描仪', icon: '📡', slot: 'tool', rarity: 1,
      desc: '把地形扫成线框，帮你排除一个干扰选项。每关 1 次。',
      effect: { hint: 1 }
    },
    {
      id: 'hoverboard', name: '飞行滑板', icon: '🛹', slot: 'tool', rarity: 3,
      desc: '贴着走廊飞一圈。每关可以跳过 1 道题，跳过不加分。',
      effect: { skip: 1 }
    },
    {
      id: 'drone', name: '微型无人机', icon: '🛸', slot: 'tool', rarity: 2,
      desc: '飞回去重新看一眼。每关多 1 次重答机会。',
      effect: { retry: 1 }
    },
    {
      id: 'plasmapen', name: '等离子笔', icon: '🖊️', slot: 'weapon', rarity: 2,
      desc: '答错时护住连击一次，像什么都没发生。',
      effect: { comboGuard: 1 }
    },
    {
      id: 'pulsegun', name: '脉冲手炮', icon: '🔫', slot: 'weapon', rarity: 3,
      desc: '展开一次护盾，抵挡本关一次扣分。',
      effect: { shield: 1 }
    },
    {
      id: 'dagger', name: '数据匕首', icon: '🗡️', slot: 'weapon', rarity: 4,
      desc: '把每一分的效率再提高 8%。',
      effect: { scoreRate: 0.08 }
    },
    {
      id: 'armor', name: '侦查护甲', icon: '🦺', slot: 'armor', rarity: 1,
      desc: '被督察扣分时，损失减半。',
      effect: { penaltyReduce: 0.5 }
    },
    {
      id: 'shield', name: '能量护盾', icon: '🛡️', slot: 'armor', rarity: 3,
      desc: '每关抵挡 1 次扣分。',
      effect: { shield: 1 }
    },
    {
      id: 'cloak', name: '隐身斗篷', icon: '🧥', slot: 'armor', rarity: 4,
      desc: '每道题多 10 秒思考时间。',
      effect: { timeBonus: 10 }
    },
    {
      id: 'wings', name: '星空翅膀', icon: '🪽', slot: 'wings', rarity: 4,
      desc: '纯装饰，但得分效率 +5%，属于侦查员的浪漫。',
      effect: { scoreRate: 0.05 }
    },
    {
      id: 'tailwing', name: '机械尾翼', icon: '🛞', slot: 'wings', rarity: 2,
      desc: '装饰用，得分效率 +3%。',
      effect: { scoreRate: 0.03 }
    },
    {
      id: 'helmet', name: '霓虹头盔', icon: '🪖', slot: 'wings', rarity: 3,
      desc: '装饰用，金币收益 +10%。',
      effect: { coinRate: 0.1 }
    },
    {
      id: 'energybar', name: '能量棒', icon: '🍫', slot: 'food', rarity: 1,
      desc: '嚼一根，获得 30 经验。',
      effect: { exp: 30 }
    },
    {
      id: 'candy', name: '星际糖果', icon: '🍬', slot: 'food', rarity: 2,
      desc: '含在嘴里，获得 80 经验。',
      effect: { exp: 80 }
    },
    {
      id: 'ration', name: '压缩口粮', icon: '🍙', slot: 'food', rarity: 1,
      desc: '吃一份，获得 50 金币。',
      effect: { coins: 50 }
    },
    {
      id: 'cola', name: '星际汽水', icon: '🥤', slot: 'food', rarity: 2,
      desc: '喝一口，获得 20 金币和 50 经验。',
      effect: { coins: 20, exp: 50 }
    }
  ];

  var RARITY = {
    1: { name: '普通', color: '#8b95a0' },
    2: { name: '精良', color: '#2f9e6e' },
    3: { name: '稀有', color: '#3b7fd4' },
    4: { name: '传说', color: '#a45bd6' }
  };

  var SLOTS = {
    tool: { name: '工具', icon: '🧰' },
    weapon: { name: '武器', icon: '⚔️' },
    armor: { name: '防具', icon: '🛡️' },
    wings: { name: '装扮', icon: '✨' },
    food: { name: '补给', icon: '🍱' }
  };

  function get(id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function bySlot(slot) {
    return list.filter(function (item) { return item.slot === slot; });
  }

  global.GameItems = {
    list: list,
    rarity: RARITY,
    slots: SLOTS,
    get: get,
    bySlot: bySlot
  };
})(window);