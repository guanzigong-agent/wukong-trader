(() => {
  'use strict';
  const data=window.WUKONG_PROGRESSION;
  const $=id=>document.getElementById(id);
  const fmt=n=>n.toLocaleString('en-US');
  const assets='../../assets/original/';
  const engine=window.WUKONG_TRADING;
  let state={...engine.create(),stop:0,character:0,complete:false,zoom:1};
  const chapterNames=['第一程','第二程','第三程','第四程','第五程','终极篇章'];
  let feedbackTimer;

  function notify(message) {
    $('feedback').textContent=message;
    $('feedback').classList.add('visible');
    clearTimeout(feedbackTimer);
    feedbackTimer=setTimeout(()=>$('feedback').classList.remove('visible'),3200);
  }
  function fitMap() {
    const stage=data.stages[state.stage], viewport=$('map-viewport');
    const height=innerWidth<=760?`${Math.min(520,(viewport.clientWidth-24)*stage.height/stage.width+24)}px`:'';
    if(viewport.style.height!==height)viewport.style.height=height;
    const width=Math.min(viewport.clientWidth-24,(viewport.clientHeight-24)*stage.width/stage.height);
    $('map-world').style.width=`${Math.max(100,width)*state.zoom}px`;
    $('map-world').style.height=`${Math.max(100,width)*stage.height/stage.width*state.zoom}px`;
    positionActor();
  }
  function positionActor() {
    const stop=data.stages[state.stage].stops[state.stop],width=$('map-world').clientWidth;
    const radius=$('actor').offsetWidth/2;
    const x=width*stop.x/100+(stop.x<50?-1:1)*(radius+42);
    $('actor').style.left=`${Math.max(radius,Math.min(width-radius,x))}px`;
    $('actor').style.top=`${Math.min(90,stop.y+8)}%`;
  }
  function renderActor() {
    const character=data.characters[state.character];
    for(const id of ['actor-image','current-character']) {
      $(id).src=assets+'characters/'+character.image;
      $(id).alt=character.name+'原作实机形象';
      $(id).style.objectPosition=character.position;
    }
    $('actor-name').textContent=character.name;
    $('character-name').textContent=character.name;
    positionActor();
    document.querySelectorAll('[data-character]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.character)===state.character)));
  }
  function renderStop() {
    const stage=data.stages[state.stage], stop=stage.stops[state.stop];
    $('location').textContent=stop.name;
    $('trade-location').textContent=stop.name+' · '+data.stopKinds[stop.kind].label;
    $('mobile-location').textContent=stop.name;
    window.WUKONG_MARKET_UI.setStation(state.stage,state.stop);
    document.querySelectorAll('[data-stop]').forEach(button=>{
      const current=Number(button.dataset.stop)===state.stop;
      button.classList.toggle('current',current);
      button.setAttribute('aria-pressed',String(current));
    });
    const ultimate=state.stage===5;
    $('trade-button').hidden=!ultimate;
    $('trade-button').disabled=state.complete || (ultimate && !stop.final);
    $('trade-button').textContent=state.complete ? '归乡终单已交付' : '交付归乡终单';
    $('trade-hint').textContent=ultimate ? state.complete ? '归乡终单已完成，仍可在地图上买卖。' : '点地图上的“水帘洞外”交付归乡终单。' : '选择数量买入，再前往高价站点卖出，利润计入升级目标。';
    $('cash').textContent=fmt(state.cash);
    $('bag-summary').textContent=`行囊 ${engine.used(state)} / ${state.capacity} · 持货成本 ${fmt(engine.usedCost(state))} 文`;
    $('mobile-cargo').textContent=`行囊 ${engine.used(state)} / ${state.capacity}`;
    $('market-clock').textContent=`已行商 ${state.market.turn} 程 · 换站刷新行情`;
    renderActor();
  }
  function renderProgress() {
    const stage=data.stages[state.stage],ultimate=state.stage===5;
    const percent=ultimate ? (state.complete?100:0) : Math.max(0,Math.min(100,Math.floor((state.profit-stage.threshold)/(stage.target-stage.threshold)*100)));
    $('profit').textContent=fmt(state.profit);
    $('remaining').textContent=ultimate ? '十万文已达成 · 终极图已开启' : `距下一张地图还差 ${fmt(stage.target-state.profit)} 文`;
    $('progress-label').textContent=ultimate ? (state.complete?'归乡终单已交付':'抵达水帘洞外，交付终单') : `本程 ${fmt(state.profit-stage.threshold)} / ${fmt(stage.target-stage.threshold)} 文`;
    $('progress-percent').textContent=percent+'%';
    $('progress-fill').style.width=percent+'%';
    $('progress-track').setAttribute('aria-valuenow',String(percent));
    $('next-label').textContent=ultimate?'本程收尾提案':'达标即换图';
    $('next-name').textContent=ultimate?(state.complete?'山海商途 · 归乡':'水帘洞外 · 归乡终单'):data.stages[state.stage+1].name;
  }
  function renderRoute() {
    $('route-list').innerHTML=data.stages.map((stage,i)=>`<li class="${i===state.stage?'active':i<state.stage?'passed':''}"><span class="route-number">${i<state.stage?'✓':stage.numeral}</span><div><strong>${stage.name}<small>${stage.title}</small></strong><p>${stage.theme}</p><span>${stage.target===null?'100,000 文进入 · 归乡终单收尾（提案）':`累计 ${fmt(stage.target)} 文 → ${data.stages[i+1].name}`} ${i===4?'<b class="fixed">已确定门槛</b>':i<4?'<em>提案</em>':''}</span></div></li>`).join('');
  }
  function renderStage() {
    const stage=data.stages[state.stage];
    document.body.dataset.stage=stage.id;
    document.body.classList.toggle('ultimate',state.stage===5);
    document.documentElement.style.setProperty('--accent',stage.color);
    $('chapter-number').textContent=chapterNames[state.stage];
    $('stage-name').textContent=stage.name;
    $('stage-title').textContent=stage.title;
    $('stage-brief').textContent=state.stage===5?'十万文已达 · 抵达水帘洞外完成终单（提案）':`本程目标：累计收益 ${fmt(stage.target)} 文`;
    $('mission-title').textContent=stage.theme;
    $('mission-goal').textContent=stage.goal;
    $('story-text').textContent=stage.story;
    $('stage-idea').textContent=stage.idea;
    $('map-status').textContent=stage.numeral+' · '+stage.name+' · '+stage.stops.length+'站';
    $('map-seal').textContent=stage.numeral;
    $('terrain').src=assets+'maps/'+stage.image;
    $('terrain').alt=stage.name+'行旅图参考画面';
    $('map-world').dataset.map=stage.id;
    $('cargo-icon').src=assets+'items/'+stage.item;
    $('cargo-icon').alt=stage.itemName;
    $('cargo-name').textContent=stage.itemName;
    $('mobile-cargo').textContent=stage.itemName;
    $('map-stops').innerHTML=stage.stops.map((stop,i)=>`<button class="map-stop" data-stop="${i}" data-kind="${stop.kind}" style="left:${stop.x}%;top:${stop.y}%" aria-label="${stop.name} · ${data.stopKinds[stop.kind].label}" aria-pressed="false"><span class="stall" aria-hidden="true"><i></i><b>${data.stopKinds[stop.kind].mark}</b></span><span>${stop.name}</span></button>`).join('');
    const route=[...stage.stops].sort((a,b)=>b.y-a.y || a.x-b.x);
    $('map-route').setAttribute('d',route.map((stop,i)=>`${i?'L':'M'}${stop.x} ${stop.y}`).join(' '));
    renderStop();renderProgress();renderRoute();fitMap();
    // 仅提前缓存下一程素材；不在首屏下载全部地图。
    if(data.stages[state.stage+1]) { const image=new Image();image.src=assets+'maps/'+data.stages[state.stage+1].image; }
  }
  function transact(order) {
    const result=engine.trade(state,{stop:state.stop,...order});
    if(!result.ok)return result;
    state=result.state;
    if(result.advanced) {
      window.WUKONG_MARKET_UI.close();
      state.stop=0;state.zoom=1;renderStage();
      const stage=data.stages[state.stage];
      $('arrival-symbol').textContent=stage.numeral;
      $('arrival-eyebrow').textContent=state.stage===5?'100,000 文达成 · 终极篇章':'收益达标 · 全新地图已开启';
      $('arrival-title').textContent=stage.name+' · '+stage.title;
      $('arrival-description').textContent=state.stage===5?'你通过商品买卖赚够了十万文，归途接回花果山。可继续买卖，或抵达水帘洞外交付归乡终单。':`累计净收益 ${fmt(state.profit)} 文，银钱与行囊随身带入新图。本程目标：${stage.goal}`;
      $('arrival-continue').textContent=state.stage===5?'回到花果山':'踏上新程';
      $('arrival-dialog').showModal();
    } else {renderStop();renderProgress();}
    return result;
  }
  $('map-stops').addEventListener('click',event=>{
    const button=event.target.closest('[data-stop]');if(!button)return;
    const result=engine.move(state,Number(button.dataset.stop));
    if(!result.ok){notify(result.error);return;}
    state=result.state;renderStop();
    window.WUKONG_MARKET_UI.open();
  });
  $('trade-button').addEventListener('click',()=>{
    if(state.stage!==5){window.WUKONG_MARKET_UI.open();return;}
    if(!data.stages[state.stage].stops[state.stop].final || state.complete)return;
    state.complete=true;renderStop();renderProgress();
    $('arrival-symbol').textContent='归';
    $('arrival-eyebrow').textContent='归乡终单 · 行商结局';
    $('arrival-title').textContent='山海走过，归途有灯';
    $('arrival-description').textContent='你将归乡物资交到水帘洞外。沿途赚取的银钱和留下的货物，是这一程行商的收获。';
    $('arrival-continue').textContent='留在花果山';
    $('arrival-dialog').showModal();
  });
  $('mobile-trade').addEventListener('click',()=>window.WUKONG_MARKET_UI.open());
  $('reset').addEventListener('click',()=>{
    state={...engine.create(),stop:0,character:state.character,complete:false,zoom:1};
    renderStage();window.WUKONG_MARKET_UI.open();notify('已重新开局：1,200文，20格行囊。');
  });
  $('route-open').addEventListener('click',()=>{$('route-dialog').showModal();});
  $('character-open').addEventListener('click',()=>{$('character-dialog').showModal();});
  $('character-list').innerHTML=data.characters.map((character,i)=>`<button data-character="${i}" aria-pressed="${i===0}"><img src="${assets}characters/${character.image}" alt="${character.name}原作实机截图" style="object-position:${character.position}" loading="lazy"><strong>${character.name}</strong><small>原作实机形象</small></button>`).join('');
  $('character-list').addEventListener('click',event=>{
    const button=event.target.closest('[data-character]');if(!button)return;
    state.character=Number(button.dataset.character);renderActor();$('character-dialog').close();
    notify('已换为'+data.characters[state.character].name+'，收益和所在地点保持不变。');
  });
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
  $('arrival-continue').addEventListener('click',()=>{$('arrival-dialog').close();if(!state.complete)window.WUKONG_MARKET_UI.open();});
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));
  $('zoom-in').addEventListener('click',()=>{state.zoom=Math.min(1.6,state.zoom+.2);fitMap();});
  $('zoom-out').addEventListener('click',()=>{state.zoom=Math.max(1,state.zoom-.2);fitMap();});
  $('map-fit').addEventListener('click',()=>{state.zoom=1;fitMap();});
  new ResizeObserver(fitMap).observe($('map-viewport'));
  window.WUKONG_MARKET_UI.bind({getAccount:()=>state,trade:transact});
  renderStage();
  window.WUKONG_MARKET_UI.open();
})();
