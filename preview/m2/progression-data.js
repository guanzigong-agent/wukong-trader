/* M2 界面提案：收益为模拟输入，中间门槛、点位和行商故事尚待评审。 */
window.WUKONG_PROGRESSION = {
  stages: [
    { id:'blackwind', name:'黑风山', numeral:'壹', title:'山野初行', threshold:0, target:3000, gain:1000,
      image:'map-black-wind-mountain-01.jpg', width:1440, height:1197, color:'#648576',
      theme:'学会赚第一笔差价', goal:'累计收益达到 3,000 文，启程黄风岭。',
      story:'从山间货摊起步，替沿途行客备些药材。第一笔盘缠，从看准一份差价开始。',
      idea:'低价货物、小额周转，让开局两三趟就看见成长。', item:'item-licorice.png', itemName:'山野药材',
      stops:[{name:'山脚货摊',kind:'market',x:28,y:81},{name:'林间驿站',kind:'inn',x:28,y:50},{name:'古寺集市',kind:'market',x:72,y:20},{name:'溪畔药铺',kind:'specialty',x:28,y:20},{name:'竹林货栈',kind:'warehouse',x:72,y:50},{name:'山口关隘',kind:'gate',x:72,y:81}] },
    { id:'yellowwind', name:'黄风岭', numeral:'贰', title:'黄沙商途', threshold:3000, target:10000, gain:2000,
      image:'map-yellow-wind-ridge-01.jpg', width:1406, height:1299, color:'#ae8849',
      theme:'把零散买卖做成商路', goal:'累计收益达到 10,000 文，启程小西天。',
      story:'黄沙漫过旧路，行商带来镔铁与补给。看好一条往返路，才留得下过山钱。',
      idea:'尝试批量备货；为远处的高价留出行囊位置。', item:'item-refined-iron-sand.png', itemName:'镔铁砂',
      stops:[{name:'沙口货摊',kind:'market',x:28,y:81},{name:'石桥驿站',kind:'inn',x:28,y:50},{name:'岭上集市',kind:'market',x:72,y:20},{name:'荒村货栈',kind:'warehouse',x:28,y:20},{name:'镔铁商铺',kind:'specialty',x:72,y:50},{name:'风口关隘',kind:'gate',x:72,y:81}] },
    { id:'newwest', name:'小西天', numeral:'叁', title:'雪夜问价', threshold:10000, target:30000, gain:5000,
      image:'map-new-west-09.jpg', width:1490, height:1164, color:'#83999d',
      theme:'从消息里寻找商机', goal:'累计收益达到 30,000 文，启程盘丝岭。',
      story:'雪道尽头，传闻与开价未必相同。听过一则消息，还得亲自去问清行情。',
      idea:'比较消息与市价，体验一次有判断的交易。', item:'item-pinebrew.png', itemName:'御寒佳酿',
      stops:[{name:'雪道驿站',kind:'inn',x:28,y:81},{name:'山门货摊',kind:'market',x:28,y:50},{name:'高台集市',kind:'market',x:72,y:20},{name:'寒泉酒铺',kind:'specialty',x:28,y:20},{name:'雪岭货栈',kind:'warehouse',x:72,y:50},{name:'寺外委托',kind:'commission',x:72,y:81}] },
    { id:'webbed', name:'盘丝岭', numeral:'肆', title:'千丝周转', threshold:30000, target:60000, gain:10000,
      image:'map-webbed-hollow-04.jpg', width:1165, height:1246, color:'#937d9c',
      theme:'让本钱持续流动', goal:'累计收益达到 60,000 文，启程火焰山。',
      story:'丝路曲折，货物不能一直压在囊中。卖掉合适的一批，再接下一趟生意。',
      idea:'混合货物、分批卖出，体会库存和周转的取舍。', item:'item-silk.png', itemName:'上等蚕丝',
      stops:[{name:'岭口货摊',kind:'market',x:28,y:81},{name:'丝坊驿站',kind:'inn',x:28,y:50},{name:'旧庄集市',kind:'market',x:72,y:20},{name:'蚕丝商铺',kind:'specialty',x:28,y:20},{name:'山涧货栈',kind:'warehouse',x:72,y:50},{name:'庄外委托',kind:'commission',x:72,y:81}] },
    { id:'flaming', name:'火焰山', numeral:'伍', title:'烈焰大单', threshold:60000, target:100000, gain:20000,
      image:'map-flaming-mountains-01.jpg', width:1650, height:1388, color:'#bb7150',
      theme:'为归途攒够十万文', goal:'累计收益达到 100,000 文，进入花果山终极图。',
      story:'火光映着山路，最后一程的补给身价不低。做成这笔生意，就能把商路接回故乡。',
      idea:'高价值订单作为这一程的高潮；价格与风险数值后续确认。', item:'item-refined-iron-sand.png', itemName:'行路补给',
      stops:[{name:'山口驿站',kind:'inn',x:28,y:81},{name:'熔岩货摊',kind:'market',x:28,y:50},{name:'关前集市',kind:'market',x:72,y:20},{name:'赤土货栈',kind:'warehouse',x:28,y:20},{name:'清凉药铺',kind:'specialty',x:72,y:50},{name:'铁扇关隘',kind:'gate',x:72,y:81}] },
    { id:'huaguo', name:'花果山', numeral:'终', title:'大圣归途', threshold:100000, target:null, gain:0,
      image:'map-mount-huaguo-01.jpg', width:1226, height:1448, color:'#c4a65f',
      theme:'归乡终单', goal:'抵达水帘洞外，交付最后一程的归乡物资。',
      story:'十万文换来一条归途。再回花果山，将沿途备下的物资送到水帘洞外，为归来的人留一盏灯。',
      idea:'终极篇章收尾提案：抵达水帘洞外完成终单，呈现行商结局。', item:'item-pinebrew.png', itemName:'归乡物资',
      stops:[{name:'归乡渡口',kind:'inn',x:28,y:81},{name:'山间集市',kind:'market',x:28,y:50},{name:'水帘洞外',kind:'commission',final:true,x:72,y:20},{name:'花林果铺',kind:'specialty',x:28,y:20},{name:'山腰货栈',kind:'warehouse',x:72,y:50},{name:'归乡委托',kind:'commission',x:72,y:81}] }
  ],
  stopKinds: {
    market:{label:'集市',mark:'商'},inn:{label:'驿站',mark:'驿'},warehouse:{label:'货栈',mark:'栈'},
    specialty:{label:'特产摊',mark:'特'},commission:{label:'委托点',mark:'单'},gate:{label:'关隘',mark:'关'}
  },
  characters: [
    {id:'wukong',name:'孙悟空',image:'wukong-idle.png',position:'66% 34%'},
    {id:'bajie',name:'猪八戒',image:'still-bajie.jpg',position:'51% 45%'},
    {id:'erlang',name:'二郎神',image:'still-erlang.jpg',position:'31% 35%'},
    {id:'bull',name:'牛魔王',image:'still-bull.jpg',position:'51% 41%'}
  ],
  stageForProfit(profit) {
    return this.stages.reduce((index,stage,i) => profit >= stage.threshold ? i : index,0);
  }
};
