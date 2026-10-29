/* 本地交易规则：文与数量均为整数，卖出按先买先卖结转成本。 */
window.WUKONG_TRADING = {
  create(){return {cash:1200,capacity:20,profit:0,stage:0,transactions:0,lots:Object.fromEntries(window.WUKONG_MARKET.goods.map(good=>[good.id,[]]))};},
  position(account,id){const lots=account.lots[id]||[],quantity=lots.reduce((n,lot)=>n+lot.quantity,0),cost=lots.reduce((n,lot)=>n+lot.quantity*lot.unitCost,0);return {quantity,cost,average:quantity?cost/quantity:0};},
  used(account){return Object.keys(account.lots).reduce((n,id)=>n+this.position(account,id).quantity,0);},
  usedCost(account){return Object.keys(account.lots).reduce((n,id)=>n+this.position(account,id).cost,0);},
  quote(account,stop,id){return window.WUKONG_MARKET.quotes(account.stage,stop).find(good=>good.id===id);},
  maxBuy(account,stop,id){const quote=this.quote(account,stop,id);return quote?Math.max(0,Math.min(account.capacity-this.used(account),Math.floor(account.cash/quote.buy))):0;},
  saleCost(account,id,quantity){let remaining=quantity,cost=0;for(const lot of account.lots[id]||[]){const take=Math.min(remaining,lot.quantity);cost+=take*lot.unitCost;remaining-=take;if(!remaining)break;}return remaining?null:cost;},
  trade(account,{stop,good,quantity,side}){
    const fail=error=>({ok:false,error});
    if(!Number.isSafeInteger(quantity)||quantity<=0)return fail('请输入大于0的整数数量。');
    if(side!=='buy'&&side!=='sell')return fail('请选择买入或卖出。');
    if(!Number.isInteger(stop)||!window.WUKONG_PROGRESSION.stages[account.stage]?.stops[stop])return fail('当前站点不可交易。');
    const quote=this.quote(account,stop,good);if(!quote)return fail('找不到这件商品。');
    const held=this.position(account,good).quantity;
    if(side==='buy'){
      if(quantity>account.capacity-this.used(account))return fail(`行囊空间不足，还能装 ${account.capacity-this.used(account)} 件。`);
      if(quantity>Math.floor(account.cash/quote.buy))return fail(`银钱不足，最多可买 ${Math.floor(account.cash/quote.buy)} 件${quote.name}。`);
    }else if(quantity>held)return fail(held?`货物不足，当前持有 ${held} 件${quote.name}。`:`行囊中还没有${quote.name}，先买入再换站卖出。`);
    const next={...account,lots:Object.fromEntries(Object.entries(account.lots).map(([id,lots])=>[id,lots.map(lot=>({...lot}))]))};
    const unitPrice=side==='buy'?quote.buy:quote.sell,total=quantity*unitPrice;
    let cost=0,profit=0;
    if(side==='buy'){
      next.cash-=total;next.lots[good].push({quantity,unitCost:unitPrice});
    }else{
      let remaining=quantity;
      while(remaining){const lot=next.lots[good][0],take=Math.min(remaining,lot.quantity);cost+=take*lot.unitCost;lot.quantity-=take;remaining-=take;if(!lot.quantity)next.lots[good].shift();}
      profit=total-cost;next.cash+=total;next.profit+=profit;
      next.stage=Math.max(next.stage,window.WUKONG_PROGRESSION.stageForProfit(next.profit));
    }
    next.transactions++;
    return {ok:true,state:next,side,good,name:quote.name,quantity,unitPrice,total,cost,profit,advanced:next.stage>account.stage};
  }
};
