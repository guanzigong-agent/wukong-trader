/* 移动推进一轮行情，同轮报价固定；波动层级参考最强nba人贩子。 */
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
  create(){const factors=Object.fromEntries(this.goods.map(good=>[good.id,10000]));return {turn:0,factors,previous:{...factors}};},
  random(key){let n=2166136261;for(const c of key)n=Math.imul(n^c.charCodeAt(0),16777619);n^=n>>>16;n=Math.imul(n,0x7feb352d);n^=n>>>15;return(n>>>0)/4294967296;},
  advance(state){
    const turn=state.turn+1,factors={};
    for(const good of this.goods){
      const prefix=`wukong:${good.id}:${turn}`,tier=this.random(prefix+':tier'),size=this.random(prefix+':size');
      const change=tier<.72?.05+size*.10:tier<.95?.15+size*.10:.25+size*.15;
      const old=state.factors[good.id],downChance=old>19000?.6:old<5000?.4:.5;
      const direction=this.random(prefix+':direction')<downChance?-1:1;
      factors[good.id]=Math.max(3000,Math.min(25000,Math.round(old*(1+direction*change))));
    }
    return {turn,factors,previous:{...state.factors}};
  },
  quotes(stageIndex,stopIndex,market=null) {
    const stage=window.WUKONG_PROGRESSION.stages[stageIndex],stop=stage?.stops[stopIndex];
    if(!stop)throw new RangeError('Unknown market station');
    const rates=[...this.profiles[stop.kind]];
    if(stop.kind==='specialty')rates[[0,1,3,2,0,3][stageIndex]]=78;
    const offset=[0,4,8,-6,2,10][stopIndex];
    return this.goods.map((good,i)=>{
      const local=this.basePrices[stageIndex][i]*(rates[i]+offset)/100;
      const factor=market?.factors[good.id]??10000,previousFactor=market?.previous[good.id]??factor;
      const buy=Math.max(2,Math.round(local*factor/10000)),previousBuy=Math.max(2,Math.round(local*previousFactor/10000));
      return {...good,buy,sell:Math.max(1,Math.floor(buy*.88)),previousBuy,change:buy-previousBuy,changePercent:(buy-previousBuy)/previousBuy*100};
    });
  }
};
