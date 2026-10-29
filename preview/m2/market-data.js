/* 本作固定试玩行情，不作为原作经济数据；买卖由trading.js结算。 */
window.WUKONG_MARKET = {
  goods: [
    {id:'herb',name:'甘草',image:'item-licorice.png'},
    {id:'ore',name:'镔铁砂',image:'item-refined-iron-sand.png'},
    {id:'silk',name:'蚕丝',image:'item-silk.png'},
    {id:'wine',name:'松醪',image:'item-pinebrew.png'}
  ],
  basePrices: [[36,92,135,68],[58,60,165,84],[80,108,110,54],[64,118,72,91],[66,74,125,95],[50,130,150,80]],
  profiles: {
    market:[100,100,100,100],inn:[112,108,115,90],warehouse:[104,88,92,108],
    specialty:[105,108,106,103],commission:[108,114,109,116],gate:[118,120,116,112]
  },
  quotes(stageIndex,stopIndex) {
    const stage=window.WUKONG_PROGRESSION.stages[stageIndex],stop=stage?.stops[stopIndex];
    if(!stop)throw new RangeError('Unknown market station');
    const rates=[...this.profiles[stop.kind]];
    if(stop.kind==='specialty')rates[[0,1,3,2,0,3][stageIndex]]=78;
    const offset=[0,4,8,-6,2,10][stopIndex];
    return this.goods.map((good,i)=>{
      const buy=Math.max(1,Math.round(this.basePrices[stageIndex][i]*(rates[i]+offset)/100));
      return {...good,buy,sell:Math.max(1,Math.floor(buy*.88))};
    });
  }
};
