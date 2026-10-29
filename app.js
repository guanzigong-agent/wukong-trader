/* 仅供 M1 界面评审：固定行情、内存状态、刷新重置。 */
(() => {
  'use strict';
  const config = window.WUKONG_DEMO;
  const $ = (id) => document.getElementById(id);
  const format = (value) => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(value);
  const signed = (value) => `${value > 0 ? '+' : ''}${format(value)}`;
  const goodsIcon = (good) => `<img class="original-item ${good.color}" src="${good.image}" alt="${good.name}原作图标">`;
  const state = { station: 'blackwind', cash: config.startingCash, profit: 0, bag: {}, journal: [] };
  let activeTrade = null;
  let toastTimer = null;
  let activeTab = 'market';

  const station = () => config.stations[state.station];
  const held = (id) => state.bag[id]?.quantity || 0;
  const used = () => Object.values(state.bag).reduce((sum, item) => sum + item.quantity, 0);
  const price = (id) => station().prices[id];
  const averageCost = (id) => held(id) ? state.bag[id].cost / held(id) : 0;

  function toast(message) {
    window.clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').classList.add('is-visible');
    toastTimer = window.setTimeout(() => $('toast').classList.remove('is-visible'), 3300);
  }

  function log(message) {
    state.journal.unshift(message);
    state.journal = state.journal.slice(0, 3);
  }

  function switchTab(tab, focus = false) {
    activeTab = tab;
    for (const id of ['market', 'bag']) {
      const selected = id === tab;
      $(`${id}-tab`).classList.toggle('is-active', selected);
      $(`${id}-tab`).setAttribute('aria-selected', String(selected));
      $(`${id}-tab`).tabIndex = selected ? 0 : -1;
      $(`${id}-panel`).hidden = !selected;
    }
    $('market-title').textContent = tab === 'market' ? `${station().name}市集` : '随身行囊';
    $('market-eyebrow').textContent = tab === 'market' ? station().subtitle : `当前所在 · ${station().name}`;
    if (focus) $(`${tab}-tab`).focus();
  }

  function openMarket(tab) {
    switchTab(tab);
    $('scene-log').hidden = true;
    $('journal-button').setAttribute('aria-expanded', 'false');
    if (!$('market-dialog').open) $('market-dialog').showModal();
  }

  function render() {
    const current = station();
    $('cash-value').textContent = format(state.cash);
    $('bag-value').textContent = used();
    $('profit-value').textContent = signed(state.profit);
    $('profit-value').className = state.profit > 0 ? 'positive' : state.profit < 0 ? 'negative' : '';
    $('bag-tab-count').textContent = used();
    $('station-name').textContent = current.name;
    $('station-description').textContent = current.description;
    $('station-number').textContent = current.number;
    window.WUKONG_SCENE.showRegion(state.station, current);
    document.querySelectorAll('[data-station]').forEach((button) => {
      const selected = button.dataset.station === state.station;
      button.classList.toggle('is-current', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-label', `${config.stations[button.dataset.station].name}，${selected ? '当前站点' : '点击直接抵达'}`);
      button.querySelector('.stop-status').textContent = selected ? '所在' : '前往';
    });
    $('market-list').innerHTML = config.goods.map((good) => `
      <article class="goods-row">
        <div class="goods-icon ${good.color}">${goodsIcon(good)}</div>
        <div><div class="goods-name-line"><h3 class="goods-name">${good.name}</h3>${current.specialty === good.id ? '<span class="specialty-tag">当地好价</span>' : ''}</div><p class="goods-detail">${held(good.id) ? `已持有 ${held(good.id)} 份` : good.type}</p></div>
        <div class="goods-price"><strong>${price(good.id)}</strong><small>文 / 份</small></div>
        <button type="button" class="goods-action" data-trade="buy" data-good="${good.id}" aria-label="买入${good.name}">买入</button>
      </article>`).join('');
    const bagGoods = config.goods.filter((good) => held(good.id));
    $('bag-empty').hidden = bagGoods.length > 0;
    $('bag-list').innerHTML = bagGoods.map((good) => {
      const gain = price(good.id) - averageCost(good.id);
      return `<article class="goods-row bag-goods-row"><div class="goods-icon ${good.color}">${goodsIcon(good)}</div><div><h3 class="goods-name">${good.name}</h3><p class="goods-detail">持有 ${held(good.id)} 份</p><p class="goods-detail">均价 ${format(averageCost(good.id))} 文</p></div><div class="goods-price"><strong>${price(good.id)}</strong><small>当地售价 · 文</small><small class="${gain > 0 ? 'positive' : gain < 0 ? 'negative' : ''}">每份 ${signed(gain)} 文</small></div><button type="button" class="goods-action" data-trade="sell" data-good="${good.id}" aria-label="卖出${good.name}">卖出</button></article>`;
    }).join('');
    $('bag-note').textContent = bagGoods.length ? `行囊 ${used()} / ${config.capacity} 格 · 卖出前可查看本笔预计差价` : '换个站点，再来看看手中货物值多少。';
    $('journal-list').replaceChildren(...state.journal.map((message) => {
      const item = document.createElement('li');
      const dot = document.createElement('span');
      dot.className = 'journal-dot';
      item.append(dot, document.createTextNode(message));
      return item;
    }));
    switchTab(activeTab);
  }

  function travel(id) {
    if (id === state.station) { toast(`已经在${station().name}，可直接逛市集。`); return; }
    state.station = id;
    log(`抵达${station().name}，当地行情已更新。`);
    render();
    toast(`已抵达${station().name} · 货物随行囊一同带来`);
  }

  function quantity() { return Number($('trade-quantity').value); }
  function validQuantity(value) { return Number.isInteger(value) && value >= 1 && value <= 999; }
  function maximum() {
    return activeTrade.mode === 'buy'
      ? Math.min(Math.floor(state.cash / price(activeTrade.good.id)), config.capacity - used())
      : held(activeTrade.good.id);
  }

  function updateTrade() {
    const { mode, good } = activeTrade;
    const qty = quantity();
    const valid = validQuantity(qty);
    const total = valid ? qty * price(good.id) : 0;
    $('trade-total').textContent = valid ? `${format(total)} 文` : '—';
    const cashAfter = state.cash + (mode === 'buy' ? -total : total);
    $('trade-cash-after').textContent = valid ? `${format(cashAfter)} 文` : '—';
    $('trade-cash-after').classList.toggle('negative', valid && cashAfter < 0);
    const newUsed = used() + qty;
    $('trade-result').textContent = valid ? (mode === 'buy' ? `${newUsed} / ${config.capacity} 格` : `${signed(total - averageCost(good.id) * qty)} 文`) : '—';
    $('trade-result').className = valid && mode === 'sell' ? (total - averageCost(good.id) * qty >= 0 ? 'positive' : 'negative') : valid && newUsed > config.capacity ? 'negative' : '';
    $('quantity-minus').disabled = valid && qty === 1;
    $('quantity-plus').disabled = valid && qty === 999;
    $('trade-error').hidden = true;
    $('trade-quantity').removeAttribute('aria-invalid');
  }

  function openTrade(mode, id) {
    const good = config.goods.find((item) => item.id === id);
    if (!good) return;
    activeTrade = { mode, good };
    $('trade-location').textContent = `${station().name}市集`;
    $('trade-title').textContent = `${mode === 'buy' ? '买入' : '卖出'}${good.name}`;
    $('trade-price').textContent = `当地单价 ${price(id)} 文 / 份`;
    $('trade-goods-icon').className = `goods-icon ${good.color}`;
    $('trade-goods-icon').innerHTML = goodsIcon(good);
    $('trade-quantity').value = '1';
    $('trade-total-label').textContent = mode === 'buy' ? '合计支出' : '合计收入';
    $('trade-result-label').textContent = mode === 'buy' ? '交易后行囊' : '本笔预计差价';
    $('trade-submit').textContent = mode === 'buy' ? '确认买入' : '确认卖出';
    $('quantity-max-value').textContent = maximum();
    $('quantity-max').disabled = maximum() === 0;
    $('trade-quota').textContent = mode === 'buy'
      ? `剩余盘缠 ${format(state.cash)} 文 · 行囊剩余 ${config.capacity - used()} 格`
      : `持有 ${held(id)} 份 · 购入均价 ${format(averageCost(id))} 文 / 份`;
    updateTrade();
    $('trade-dialog').showModal();
  }

  function submitTrade(event) {
    event.preventDefault();
    const { mode, good } = activeTrade;
    const qty = quantity();
    const total = qty * price(good.id);
    let error = '';
    if (!validQuantity(qty)) error = '请输入 1 至 999 之间的整数数量。';
    else if (mode === 'sell' && qty > held(good.id)) error = `货物不足：行囊中只有 ${held(good.id)} 份${good.name}。`;
    else if (mode === 'buy' && total > state.cash) error = `盘缠不足：这笔买卖还差 ${format(total - state.cash)} 文。`;
    else if (mode === 'buy' && used() + qty > config.capacity) error = `行囊装不下：还剩 ${config.capacity - used()} 格，可先卖掉一些货物。`;
    if (error) {
      $('trade-error').textContent = error;
      $('trade-error').hidden = false;
      $('trade-quantity').setAttribute('aria-invalid', 'true');
      return;
    }
    let message;
    if (mode === 'buy') {
      const item = state.bag[good.id] || { quantity: 0, cost: 0 };
      item.quantity += qty;
      item.cost += total;
      state.bag[good.id] = item;
      state.cash -= total;
      message = `买入${good.name} ${qty} 份，支出 ${format(total)} 文。`;
    } else {
      const basis = averageCost(good.id) * qty;
      const gain = total - basis;
      state.bag[good.id].quantity -= qty;
      state.bag[good.id].cost -= basis;
      if (!held(good.id)) delete state.bag[good.id];
      state.cash += total;
      state.profit += gain;
      message = `卖出${good.name} ${qty} 份，差价 ${signed(gain)} 文。`;
    }
    log(message);
    $('trade-dialog').close();
    render();
    toast(message);
  }

  $('region-map').innerHTML = Object.entries(config.stations).map(([id, area]) => { const point = window.WUKONG_WORLD.regions[id].label; return `<button class="world-region" type="button" data-station="${id}" style="--region-x:${point[0]*100}%;--region-y:${point[1]*100}%" aria-pressed="false"><strong>${area.name}</strong><span class="stop-status">前往</span></button>`; }).join('');
  window.WUKONG_TRAVEL = travel;
  document.querySelectorAll('[data-station]').forEach((button) => button.addEventListener('click', () => travel(button.dataset.station)));
  document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => $(button.dataset.closeDialog).close()));
  document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    if (dialog.id === 'character-dialog' && $('close-character').hidden) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }));
  document.querySelector('.trading-panel').addEventListener('click', (event) => {
    const button = event.target.closest('[data-trade]');
    if (button) openTrade(button.dataset.trade, button.dataset.good);
  });
  for (const tab of ['market', 'bag']) {
    $(`${tab}-tab`).addEventListener('click', () => switchTab(tab));
    $(`${tab}-tab`).addEventListener('keydown', (event) => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        switchTab(event.key === 'Home' ? 'market' : event.key === 'End' ? 'bag' : tab === 'market' ? 'bag' : 'market', true);
      }
    });
  }
  $('merchant-hotspot').addEventListener('click', () => openMarket('market'));
  $('open-bag').addEventListener('click', () => openMarket('bag'));
  $('player-actor').addEventListener('click', () => openMarket('bag'));
  $('empty-to-market').addEventListener('click', () => switchTab('market', true));
  $('help-button').addEventListener('click', () => $('help-dialog').showModal());
  $('reset-button').addEventListener('click', () => $('reset-dialog').showModal());
  $('confirm-reset').addEventListener('click', () => {
    state.station = 'blackwind';
    state.cash = config.startingCash;
    state.profit = 0;
    state.bag = {};
    state.journal = [];
    log('重新从黑风山启程，盘缠和行囊已重置。');
    activeTab = 'market';
    $('reset-dialog').close();
    if ($('help-dialog').open) $('help-dialog').close();
    if ($('market-dialog').open) $('market-dialog').close();
    render();
    window.WUKONG_SCENE.resetPosition();
    toast('已重新启程 · 盘缠 1,200 文');
  });
  $('quantity-minus').addEventListener('click', () => { $('trade-quantity').value = String(Math.max(1, (Math.floor(quantity()) || 1) - 1)); updateTrade(); });
  $('quantity-plus').addEventListener('click', () => { $('trade-quantity').value = String(Math.min(999, (Math.floor(quantity()) || 0) + 1)); updateTrade(); });
  $('quantity-max').addEventListener('click', () => { $('trade-quantity').value = String(maximum()); updateTrade(); });
  $('trade-quantity').addEventListener('input', updateTrade);
  $('trade-form').addEventListener('submit', submitTrade);
  log('初到黑风山，先看看当地行情。');
  render();
})();
