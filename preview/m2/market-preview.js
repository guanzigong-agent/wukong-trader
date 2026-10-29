(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const dialog=$('market-dialog'),engine=window.WUKONG_TRADING;
  let current={stage:0,stop:0},controller=null,quantities={};
  const fmt=n=>n.toLocaleString('en-US');
  function feedback(text,error=false){$('trade-message').textContent=text;$('trade-message').classList.toggle('error',error);}
  function updateHint(id){
    const account=controller.getAccount(),quote=window.WUKONG_MARKET.quotes(current.stage,current.stop).find(row=>row.id===id),quantity=Number(quantities[id]),node=document.querySelector(`[data-good="${id}"] [data-order-summary]`);
    if(!node)return;
    if(!Number.isSafeInteger(quantity)||quantity<=0){node.textContent='请输入大于0的整数数量。';return;}
    const cost=engine.saleCost(account,id,quantity),gain=cost===null?null:quote.sell*quantity-cost;
    node.textContent=`买入需 ${fmt(quote.buy*quantity)} 文${gain===null?'':` · 卖出${gain>=0?'可赚':'将亏'} ${fmt(Math.abs(gain))} 文`}`;
  }
  function bind(next){controller=next;}
  function setStation(stageIndex,stopIndex) {
    if(current.stage!==stageIndex||current.stop!==stopIndex){quantities={};feedback('');}
    current={stage:stageIndex,stop:stopIndex};
    const stage=window.WUKONG_PROGRESSION.stages[stageIndex],stop=stage.stops[stopIndex];
    const rows=window.WUKONG_MARKET.quotes(stageIndex,stopIndex);
    const account=controller.getAccount(),used=engine.used(account);
    const kind=window.WUKONG_PROGRESSION.stopKinds[stop.kind].label;
    $('market-chapter').textContent=stage.name+' · '+kind;
    $('market-title').textContent=stop.name;
    $('market-count').textContent=rows.length+'种商品 · 供货充足';
    $('market-current-name').textContent=stop.name;
    $('market-summary').textContent=rows.map(good=>good.name).join('、')+' · '+rows.length+'种';
    $('market-cash').textContent=fmt(account.cash)+' 文';
    $('market-space').textContent=used+' / '+account.capacity;
    $('market-profit').textContent=fmt(account.profit)+' 文';
    $('market-rows').innerHTML=rows.map(good=>{
      const held=engine.position(account,good.id),max=engine.maxBuy(account,stopIndex,good.id);quantities[good.id]??=1;
      return `<article class="trade-good" data-good="${good.id}"><div class="trade-good-top"><div class="trade-product"><img src="../../assets/original/items/${good.image}" alt=""><div><h3>${good.name}</h3><p>持有 <b data-held>${held.quantity}</b> 件${held.quantity?` · 均成本 ${held.average.toFixed(2)} 文`:''}</p></div></div><div class="trade-quotes"><span>买入<strong data-price="buy">${good.buy}<small>文</small></strong></span><span>卖出<strong data-price="sell">${good.sell}<small>文</small></strong></span></div></div><div class="trade-controls"><div class="quantity-stepper"><button data-action="minus" aria-label="减少${good.name}数量">−</button><input type="number" inputmode="numeric" min="1" step="1" value="${quantities[good.id]}" aria-label="${good.name}数量"><button data-action="plus" aria-label="增加${good.name}数量">＋</button></div><button class="buy-action" data-action="buy" ${max===0?'disabled':''} aria-label="买入${good.name}">买入</button><button class="sell-action" data-action="sell" ${held.quantity===0?'disabled':''} aria-label="卖出${good.name}">卖出</button></div><div class="trade-shortcuts"><button data-action="max-buy" ${max===0?'disabled':''}>最多买 ${max}</button><button data-action="all-held" ${held.quantity===0?'disabled':''}>全部持有 ${held.quantity}</button><span data-order-summary></span></div></article>`;
    }).join('');
    rows.forEach(good=>updateHint(good.id));
    dialog.dataset.station=stage.id+':'+stopIndex;
  }
  function open() {
    setStation(current.stage,current.stop);
    feedback('');
    if(!dialog.open)dialog.showModal();
  }
  function close(){dialog.close();}
  $('market-rows').addEventListener('input',event=>{
    const row=event.target.closest('[data-good]');if(!row||event.target.tagName!=='INPUT')return;
    quantities[row.dataset.good]=event.target.value;updateHint(row.dataset.good);
  });
  $('market-rows').addEventListener('click',event=>{
    const button=event.target.closest('[data-action]'),row=button?.closest('[data-good]');if(!row)return;
    const id=row.dataset.good,action=button.dataset.action,account=controller.getAccount();
    if(action==='buy'||action==='sell'){
      const result=controller.trade({good:id,quantity:Number(quantities[id]),side:action});
      if(!result.ok){feedback(result.error,true);return;}
      feedback(action==='buy'?`已买入 ${result.name} ${result.quantity} 件，花费 ${fmt(result.total)} 文。`:`已卖出 ${result.name} ${result.quantity} 件，收回 ${fmt(result.total)} 文，本笔${result.profit>=0?'赚':'亏'} ${fmt(Math.abs(result.profit))} 文。`);
      return;
    }
    let quantity=Number(quantities[id])||1;
    if(action==='minus')quantity=Math.max(1,quantity-1);
    if(action==='plus')quantity=Math.min(Number.MAX_SAFE_INTEGER,quantity+1);
    if(action==='max-buy')quantity=engine.maxBuy(account,current.stop,id);
    if(action==='all-held')quantity=engine.position(account,id).quantity;
    quantities[id]=quantity;row.querySelector('input').value=quantity;updateHint(id);
  });
  $('market-open').addEventListener('click',open);
  $('market-return').addEventListener('click',close);
  window.WUKONG_MARKET_UI={setStation,open,close,bind};
})();
