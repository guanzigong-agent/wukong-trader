/* 六区共用一个场景。坐标为本作原型布局；原图只在 SVG 内裁切显示。 */
window.WUKONG_WORLD = {
  regions: {
    snowridge: { label: [.25,.09], player: [.19,.32], merchant: [.38,.31],
      box: [.00,-.02,.59,.43], crop: [620,20,790,700], sourceSize: [1490,1164],
      image: 'assets/original/maps/map-new-west-09.jpg', brightness: 1.16 },
    huoyan: { label: [.75,.09], player: [.69,.32], merchant: [.88,.31],
      box: [.47,-.02,.57,.44], crop: [560,260,650,730], sourceSize: [1650,1388],
      image: 'assets/original/maps/map-flaming-mountains-01.jpg', brightness: 1.36 },
    redsand: { label: [.25,.41], player: [.19,.64], merchant: [.38,.63],
      box: [-.06,.25,.63,.46], crop: [540,230,660,660], sourceSize: [1406,1299],
      image: 'assets/original/maps/map-yellow-wind-ridge-01.jpg', brightness: 1.12 },
    pansi: { label: [.75,.41], player: [.69,.64], merchant: [.88,.63],
      box: [.43,.26,.65,.47], crop: [320,290,650,650], sourceSize: [1165,1246],
      image: 'assets/original/maps/map-webbed-hollow-04.jpg', brightness: 1.15 },
    blackwind: { label: [.25,.73], player: [.19,.96], merchant: [.38,.95],
      box: [-.04,.58,.63,.47], crop: [600,440,550,550], sourceSize: [1440,1197],
      image: 'assets/original/maps/map-black-wind-mountain-01.jpg', brightness: 1.12 },
    huaguo: { label: [.75,.73], player: [.69,.96], merchant: [.88,.95],
      box: [.46,.59,.61,.46], crop: [200,180,750,750], sourceSize: [1226,1448],
      image: 'assets/original/maps/map-mount-huaguo-01.jpg', brightness: 1.08 }
  },
  regionAt(x,y) {
    const row = Math.min(2,Math.max(0,Math.floor(y*3)));
    return [['snowridge','huoyan'],['redsand','pansi'],['blackwind','huaguo']][row][x<.5?0:1];
  },
  render(width,height) {
    const terrain=Object.entries(this.regions).map(([id,r]) => {
      const [x,y,w,h]=r.box,[sw,sh]=r.sourceSize;
      const px=x*width,py=y*height,pw=w*width,ph=h*height;
      return `<defs><mask id="fade-${id}" maskUnits="userSpaceOnUse" x="${px}" y="${py}" width="${pw}" height="${ph}"><rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="url(#terrain-gradient)"/></mask><clipPath id="clip-${id}"><rect x="${px}" y="${py}" width="${pw}" height="${ph}"/></clipPath></defs><g mask="url(#fade-${id})" clip-path="url(#clip-${id})"><svg data-terrain="${id}" x="${px}" y="${py}" width="${pw}" height="${ph}" viewBox="${r.crop.join(' ')}" preserveAspectRatio="xMidYMid slice" style="overflow:hidden;filter:brightness(${r.brightness})"><image href="${r.image}" width="${sw}" height="${sh}"/></svg></g>`;
    }).join('');
    const pt=(x,y) => `${x*width},${y*height}`;
    return `<defs>
      <radialGradient id="terrain-gradient"><stop offset="0" stop-color="white"/><stop offset=".65" stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient>
      <mask id="terrain-fade" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#terrain-gradient)"/></mask>
      <radialGradient id="paper-wash"><stop stop-color="#dfd1a8"/><stop offset="1" stop-color="#b9a67b"/></radialGradient>
      <linearGradient id="river-wash" x2="1" y2="1"><stop stop-color="#71958b" stop-opacity=".25"/><stop offset="1" stop-color="#446b60" stop-opacity=".5"/></linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#paper-wash)"/>
    <path d="M${pt(.50,-.02)} C${pt(.44,.18)} ${pt(.60,.25)} ${pt(.50,.39)} S${pt(.40,.58)} ${pt(.51,.70)} S${pt(.62,.86)} ${pt(.50,1.05)}" fill="none" stroke="url(#river-wash)" stroke-width="${width*.045}"/>
    ${terrain}
    <g class="world-roads" fill="none" stroke="#735932" stroke-linecap="round" stroke-width="1.4" opacity=".55" stroke-dasharray="3 7">
      <path d="M${pt(.24,.25)} C${pt(.09,.31)} ${pt(.13,.44)} ${pt(.25,.56)} S${pt(.36,.77)} ${pt(.24,.9)}"/>
      <path d="M${pt(.76,.25)} C${pt(.91,.31)} ${pt(.87,.44)} ${pt(.75,.56)} S${pt(.64,.77)} ${pt(.76,.9)}"/>
      <path d="M${pt(.27,.28)} Q${pt(.50,.36)} ${pt(.73,.28)} M${pt(.27,.59)} Q${pt(.50,.69)} ${pt(.73,.59)} M${pt(.27,.91)} Q${pt(.50,.99)} ${pt(.73,.91)}"/>
    </g>`;
  }
};
