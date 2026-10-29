/* M1-R4：六大区在同一总图内跑商；价格仍是演示配置。 */
window.WUKONG_DEMO = {
  startingCash: 1200,
  capacity: 20,
  goods: [
    { id: 'herb', name: '甘草', type: '山野药材', color: 'herb', image: 'assets/original/items/item-licorice.png' },
    { id: 'ore', name: '镔铁砂', type: '兵器通材', color: 'ore', image: 'assets/original/items/item-refined-iron-sand.png' },
    { id: 'silk', name: '蚕丝', type: '披挂材料', color: 'silk', image: 'assets/original/items/item-silk.png' },
    { id: 'wine', name: '松醪', type: '山间佳酿', color: 'wine', image: 'assets/original/items/item-pinebrew.png' }
  ],
  stations: {
    blackwind: {
      name: '黑风山', number: '壹', chapter: '第一回', subtitle: '山海商路 · 黑风山',
      description: '在黑风山市集备货，带着行囊前往下一处大区。',
      specialty: 'herb', prices: { herb: 36, ore: 92, silk: 135, wine: 68 }
    },
    redsand: {
      name: '黄风岭', number: '贰', chapter: '第二回', subtitle: '山海商路 · 黄风岭',
      description: '抵达黄风岭，看看这趟货物能换回多少盘缠。',
      specialty: 'ore', prices: { herb: 58, ore: 60, silk: 165, wine: 84 }
    },
    snowridge: {
      name: '小西天', number: '叁', chapter: '第三回', subtitle: '山海商路 · 小西天',
      description: '抵达小西天，当地行情已换，行囊中的货物照旧随身。',
      specialty: 'wine', prices: { herb: 80, ore: 108, silk: 110, wine: 54 }
    },
    pansi: {
      name: '盘丝岭', number: '肆', chapter: '第四回', subtitle: '山海商路 · 盘丝岭',
      description: '盘丝岭的买卖在此结算，挑好货物再动身。',
      specialty: 'silk', prices: { herb: 64, ore: 118, silk: 72, wine: 91 }
    },
    huoyan: {
      name: '火焰山', number: '伍', chapter: '第五回', subtitle: '山海商路 · 火焰山',
      description: '一站抵达火焰山，直接查看整个大区的市集。',
      specialty: 'ore', prices: { herb: 66, ore: 74, silk: 125, wine: 95 }
    },
    huaguo: {
      name: '花果山', number: '陆', chapter: '第六回', subtitle: '山海商路 · 花果山',
      description: '来到花果山，卖出带来的货物，也可继续往来跑商。',
      specialty: 'wine', prices: { herb: 58, ore: 120, silk: 160, wine: 44 }
    }
  }
};
