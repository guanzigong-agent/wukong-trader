/* M1-R4：同一总图内移动人物，选角与镜头不改变钱货。 */
(() => {
  'use strict';
  const $=(id) => document.getElementById(id);
  const characters=window.WUKONG_CHARACTERS,map=window.WUKONG_WORLD;
  const viewport=$('map-viewport'),world=$('map-world'),art=$('world-art');
  const player=$('player-actor'),merchant=$('merchant-hotspot');
  const compactLayout=() => matchMedia('(max-height:560px) and (min-width:600px)').matches;
  const portraitLayout=() => !compactLayout()&&matchMedia('(max-width:760px), (max-aspect-ratio:1/1) and (max-width:1100px)').matches;
  let selected='wukong',pending=selected,entered=false;
  let currentRegion='blackwind',zoom=1,pointer=null,feedbackTimer=null,renderedLayout='';
  let position=[...map.regions[currentRegion].player];
  const character=(id) => characters.choices.find((item) => item.id===id);
  const figureHTML=(item) => `<span class="actor-figure"><img src="${item.image}" alt="${item.name}原作实机截图" style="object-position:${item.position}" draggable="false"></span>`;
  function feedback(message) {
    clearTimeout(feedbackTimer);$('scene-feedback').textContent=message;$('scene-feedback').classList.add('is-visible');
    feedbackTimer=setTimeout(() => $('scene-feedback').classList.remove('is-visible'),2400);
  }
  function placeActors() {
    const actorX=position[0]-(compactLayout()?.11:portraitLayout()?.04:0);
    player.style.left=`${actorX*100}%`;player.style.top=`${position[1]*100}%`;
    const spot=map.regions[currentRegion].merchant;
    merchant.style.left=`${spot[0]*100}%`;merchant.style.top=`${spot[1]*100}%`;
    merchant.setAttribute('aria-label',`打开${window.WUKONG_DEMO.stations[currentRegion].name}市集`);
  }
  function centerPlayer() {
    viewport.scrollTo({left:world.offsetLeft+position[0]*world.clientWidth-viewport.clientWidth*.5,
      top:world.offsetTop+position[1]*world.clientHeight-viewport.clientHeight*.65,behavior:'instant'});
  }
  function fitMap(center=false) {
    const small=portraitLayout();
    const width=small?1000:1600,height=small?1450:1000,layout=`${width}:${height}`;
    if(renderedLayout!==layout){art.setAttribute('viewBox',`0 0 ${width} ${height}`);art.innerHTML=map.render(width,height);renderedLayout=layout;}
    const scale=Math.min(viewport.clientWidth/width,viewport.clientHeight/height)*zoom;
    const w=Math.floor(width*scale),h=Math.floor(height*scale);
    world.style.width=`${w}px`;world.style.height=`${h}px`;
    world.style.marginLeft=`${Math.max(0,(viewport.clientWidth-w)/2)}px`;world.style.marginTop=`${Math.max(0,(viewport.clientHeight-h)/2)}px`;
    const actorHeight=Math.min(character(selected).sceneHeight*(small?.58:1),h*.14);
    player.style.setProperty('--actor-height',`${actorHeight*Math.sqrt(zoom)}px`);
    placeActors();
    if(zoom===1)viewport.scrollTo({left:0,top:0,behavior:'instant'});else if(center)centerPlayer();
    $('zoom-out').disabled=zoom<=1;$('zoom-in').disabled=zoom>=2.2;$('world-overview').classList.toggle('is-active',zoom===1);
  }
  function showRegion(id) {
    if(currentRegion===id)return;
    currentRegion=id;position=[...map.regions[id].player];$('game-scene').dataset.region=id;placeActors();
    if(zoom>1)centerPlayer();
    const ripple=$('landing-ripple');ripple.style.left=`${position[0]*100}%`;ripple.style.top=`${position[1]*100}%`;
    ripple.classList.remove('is-visible');requestAnimationFrame(() => ripple.classList.add('is-visible'));
    setTimeout(() => ripple.classList.remove('is-visible'),700);
  }
  function updateChoice() {
    document.querySelectorAll('[data-character]').forEach((b) => b.setAttribute('aria-pressed',String(b.dataset.character===pending)));
    $('confirm-character').textContent=entered?`换为${character(pending).name}`:`以${character(pending).name}启程`;
  }
  function applyCharacter() {
    const previous=selected;selected=pending;const item=character(selected);
    $('player-figure').innerHTML=figureHTML(item);$('player-name').textContent=item.name;$('current-character').textContent=item.name;
    $('hud-portrait').src=item.image;$('hud-portrait').style.objectPosition=item.position;$('hud-portrait').alt=item.name;
    player.dataset.characterId=selected;player.setAttribute('aria-label',`查看${item.name}的行囊`);
    fitMap(false);$('character-dialog').close();$('close-character').hidden=false;
    if(entered&&previous!==selected)feedback(`已换为${item.name}`);entered=true;
  }
  function openCharacters(){pending=selected;updateChoice();$('character-dialog').showModal();}
  function travelAt(clientX,clientY) {
    const rect=world.getBoundingClientRect(),x=(clientX-rect.left)/rect.width,y=(clientY-rect.top)/rect.height;
    if(x<0||x>1||y<0||y>1)return;
    window.WUKONG_TRAVEL(map.regionAt(x,y));
  }
  $('character-options').innerHTML=characters.choices.map((item) => `<button type="button" class="character-choice" data-character="${item.id}" aria-pressed="${item.id===pending}" aria-label="选择${item.name}"><span class="choice-photo"><img src="${item.image}" alt="${item.name}原作实机画面" style="object-position:${item.position}" draggable="false"></span><strong>${item.name}</strong><small>${item.caption}</small></button>`).join('');
  $('character-options').addEventListener('click',(e) => {const b=e.target.closest('[data-character]');if(b){pending=b.dataset.character;updateChoice();}});
  $('confirm-character').addEventListener('click',applyCharacter);$('character-button').addEventListener('click',openCharacters);
  $('character-dialog').addEventListener('cancel',(e) => {if(!entered)e.preventDefault();});
  $('zoom-in').addEventListener('click',() => {zoom=Math.min(2.2,Math.round((zoom+.3)*10)/10);fitMap(true);});
  $('zoom-out').addEventListener('click',() => {zoom=Math.max(1,Math.round((zoom-.3)*10)/10);fitMap(true);});
  $('world-overview').addEventListener('click',() => {zoom=1;fitMap();});$('locate-player').addEventListener('click',centerPlayer);
  $('journal-button').addEventListener('click',() => {$('scene-log').hidden=!$('scene-log').hidden;$('journal-button').setAttribute('aria-expanded',String(!$('scene-log').hidden));});
  viewport.addEventListener('pointerdown',(e) => {
    if(!entered||e.target.closest('button,a,dialog'))return;
    pointer={id:e.pointerId,x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop,moved:false,type:e.pointerType};
  });
  viewport.addEventListener('pointermove',(e) => {
    if(!pointer||e.pointerId!==pointer.id)return;
    const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(Math.hypot(dx,dy)>6)pointer.moved=true;
    if(pointer.moved&&pointer.type==='mouse'){viewport.classList.add('is-dragging');viewport.setPointerCapture(e.pointerId);viewport.scrollLeft=pointer.left-dx;viewport.scrollTop=pointer.top-dy;}
  });
  viewport.addEventListener('pointerup',(e) => {if(!pointer||e.pointerId!==pointer.id)return;if(!pointer.moved)travelAt(e.clientX,e.clientY);pointer=null;viewport.classList.remove('is-dragging');});
  viewport.addEventListener('pointercancel',() => {pointer=null;viewport.classList.remove('is-dragging');});
  new ResizeObserver(() => fitMap(zoom>1)).observe(viewport);
  window.WUKONG_SCENE={showRegion,resetPosition:() => {position=[...map.regions[currentRegion].player];zoom=1;fitMap();}};
  $('player-figure').innerHTML=figureHTML(character(selected));updateChoice();fitMap();$('character-dialog').showModal();
})();
