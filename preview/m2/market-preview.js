(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const dialog=$('market-dialog');
  let current={stage:0,stop:0};
  function setStation(stageIndex,stopIndex) {
    current={stage:stageIndex,stop:stopIndex};
    const stage=window.WUKONG_PROGRESSION.stages[stageIndex],stop=stage.stops[stopIndex];
    const rows=window.WUKONG_MARKET.quotes(stageIndex,stopIndex);
    const kind=window.WUKONG_PROGRESSION.stopKinds[stop.kind].label;
    $('market-chapter').textContent=stage.name+' · '+kind;
    $('market-title').textContent=stop.name;
    $('market-count').textContent=rows.length+'种在售商品';
    $('market-current-name').textContent=stop.name;
    $('market-summary').textContent=rows.map(good=>good.name).join('、')+' · '+rows.length+'种';
    $('market-rows').innerHTML=rows.map(good=>`<tr data-good="${good.id}"><th scope="row"><span class="quote-good"><img src="../../assets/original/items/${good.image}" alt=""><span>${good.name}</span></span></th><td class="buy-price" data-price="buy">${good.buy}<small>文</small></td><td data-price="sell">${good.sell}<small>文</small></td><td class="quote-stock">${good.stock}</td></tr>`).join('');
    dialog.dataset.station=stage.id+':'+stopIndex;
  }
  function open() {
    setStation(current.stage,current.stop);
    dialog.scrollTop=0;
    if(!dialog.open)dialog.showModal();
  }
  function close(){dialog.close();}
  $('market-open').addEventListener('click',open);
  $('market-return').addEventListener('click',close);
  window.WUKONG_MARKET_UI={setStation,open,close};
})();
