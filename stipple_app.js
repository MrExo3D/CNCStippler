/* ==========================================================================
   UI TEXT — CENTRALIZED STRINGS
   --------------------------------------------------------------------------
   Adjust these to change headings, labels, buttons, and popup text.
   Great for localization or quick copy tweaks.
   ========================================================================== */
const UI = {
  headers: {
    title: "SVG Stipple Generator",
    subtitle: "1 SVG unit matches your selected output units (inches or millimeters). Uses your image’s native pixels for analysis. Voronoi (Lloyd) optimization, live updates."
  },
  sections: {
    basic: "Basic Sizing",
    appearance: "Appearance",
    advanced: "Advanced"
  },
  labels: {
    image: "Input image",
    width: "Canvas width",
    height: "Canvas height",
    unit: "Units",
    lock: "Lock aspect ratio",
    min: "Min dot size",
    range: "Dot size range",
    count: "Dots (count)",
    invert: "Invert image",
    bg: "Preview background",
    dot: "Dot color",
    shape: "Dot shape",
    seed: "Seed",
    gamma: "Gamma",
    boost: "Placement boost",
    overlap: "Prevent Dot Overlap",
    padding: "Padding between dots (%)",
    iter: "Iterations (Voronoi)",
    cell: "Cell sample step (px)"
  },
  buttons: {
    generate: "Generate",
    download: "Download SVG",
    clear: "Clear",
    swap: "SWAP colours"
  },
  popups: {
    processing: "Processing…",
    placing: "Placing dots…",
    optimizing: "Optimizing (Voronoi)…",
    needImage: "Please choose an input image.",
    done: (w,h,u)=>`✅ Done! Ready for download (${w} ${u} × ${h} ${u})`
  }
};

/* ==========================================================================
   RUNTIME STATE & DOM HOOKUP
   ========================================================================== */
const els={
  thumb:document.getElementById('thumbSrc'),
  btnLoad:document.getElementById("btnLoad"),
  // inputs
  file:document.getElementById('file'),
  outWidthIn:document.getElementById('outWidthIn'),
  outHeightIn:document.getElementById('outHeightIn'),
  unitSelect:document.getElementById('unitSelect'),
  lockAR:document.getElementById('lockAR'),
  count:document.getElementById('count'),
  seed:document.getElementById('seed'),
  minSizeIn:document.getElementById('minSizeIn'),
  rangeSizeIn:document.getElementById('rangeSizeIn'),
  gamma:document.getElementById('gamma'),
  boost:document.getElementById('boost'),
  invert:document.getElementById('invert'),
  preventOverlap:document.getElementById('preventOverlap'),
  paddingPct:document.getElementById('paddingPct'),
  optimIter:document.getElementById('optimIter'),
  cellStep:document.getElementById('cellStep'),
  // actions
  render:document.getElementById('render'),
  download:document.getElementById('download'),
  clear:document.getElementById('clear'),
  swapColors:document.getElementById('swapColors'),
  // preview & status
  canvasStage:document.getElementById('canvasStage'),
  status:document.getElementById('status'),
  stats:document.getElementById('stats'),
  previewBg:document.getElementById('previewBg'),
  previewDot:document.getElementById('previewDot'),
  dotShape:document.getElementById('dotShape'),
  imgInfo:document.getElementById('imgInfo'),
  hiddenCanvas:document.getElementById('hiddenCanvas'),
  overlay:document.getElementById('overlay'),
  overlayText:document.getElementById('overlayText'),
  barFill:document.getElementById('barFill'),
  barPct:document.getElementById('barPct'),
  fileRow:document.getElementById('fileRow'),
  // text targets
  tTitle:document.getElementById('ui-title'),
  tSubtitle:document.getElementById('ui-subtitle'),
  tSecBasic:document.getElementById('ui-sec-basic'),
  tSecAppearance:document.getElementById('ui-sec-appearance'),
  tSecAdvanced:document.getElementById('ui-sec-advanced'),
  tImage:document.getElementById('ui-label-image'),
  tWidth:document.getElementById('ui-label-width'),
  tHeight:document.getElementById('ui-label-height'),
  tUnit:document.getElementById('ui-label-unit'),
  tLock:document.getElementById('ui-label-lock'),
  tMin:document.getElementById('ui-label-min'),
  tRange:document.getElementById('ui-label-range'),
  tCount:document.getElementById('ui-label-count'),
  tInvert:document.getElementById('ui-label-invert'),
  tBg:document.getElementById('ui-label-bg'),
  tDot:document.getElementById('ui-label-dot'),
  tShape:document.getElementById('ui-label-shape'),
  tSeed:document.getElementById('ui-label-seed'),
  tGamma:document.getElementById('ui-label-gamma'),
  tBoost:document.getElementById('ui-label-boost'),
  tOverlap:document.getElementById('ui-label-overlap'),
  tPadding:document.getElementById('ui-label-padding'),
  tIter:document.getElementById('ui-label-iter'),
  tCell:document.getElementById('ui-label-cell'),
};

/* Populate all static UI text from UI map */
function applyUIText(){
  els.tTitle.textContent = UI.headers.title;
  els.tSubtitle.textContent = UI.headers.subtitle;

  els.tSecBasic.textContent = UI.sections.basic;
  els.tSecAppearance.textContent = UI.sections.appearance;
  els.tSecAdvanced.textContent = UI.sections.advanced;

  els.tImage.textContent = UI.labels.image;
  els.tWidth.textContent = UI.labels.width;
  els.tHeight.textContent = UI.labels.height;
  if(els.tUnit) els.tUnit.textContent = UI.labels.unit;
  els.tLock.textContent = UI.labels.lock;
  els.tMin.textContent = UI.labels.min;
  els.tRange.textContent = UI.labels.range;
  els.tCount.textContent = UI.labels.count;
  els.tInvert.textContent = UI.labels.invert;
  els.tBg.textContent = UI.labels.bg;
  els.tDot.textContent = UI.labels.dot;
  els.tShape.textContent = UI.labels.shape;
  els.tSeed.textContent = UI.labels.seed;
  els.tGamma.textContent = UI.labels.gamma;
  els.tBoost.textContent = UI.labels.boost;
  els.tOverlap.textContent = UI.labels.overlap;
  els.tPadding.textContent = UI.labels.padding;
  els.tIter.textContent = UI.labels.iter;
  els.tCell.textContent = UI.labels.cell;

  els.render.textContent = UI.buttons.generate;
  els.download.textContent = UI.buttons.download;
  els.clear.textContent = UI.buttons.clear;
  els.swapColors.textContent = UI.buttons.swap;
}

const MM_PER_IN = 25.4;
const UNIT_SETTINGS = {
  in: {
    suffix: 'in',
    width: {min:1, max:200, step:0.01, decimals:2},
    height: {min:1, max:200, step:0.01, decimals:2},
    minSize: {min:0, step:0.0001, decimals:4},
    rangeSize: {min:0, step:0.0001, decimals:4}
  },
  mm: {
    suffix: 'mm',
    width: {min:25.4, max:5080, step:0.1, decimals:1},
    height: {min:25.4, max:5080, step:0.1, decimals:1},
    minSize: {min:0, step:0.01, decimals:2},
    rangeSize: {min:0, step:0.01, decimals:2}
  }
};

let currentUnits = 'in';

function formatNumberForUnit(value, unit, key){
  const cfg=UNIT_SETTINGS[unit][key];
  const decimals=cfg && cfg.decimals!=null ? cfg.decimals : (unit==='in'?3:1);
  if(!Number.isFinite(value)) return '';
  const fixed=value.toFixed(decimals);
  return decimals>0 ? fixed.replace(/\.0+$/,'').replace(/(\.\d*?)0+$/,'$1') : fixed;
}

function updateUnitLabels(){
  const suffix = currentUnits==='in' ? ' (in)' : ' (mm)';
  els.tWidth.textContent = UI.labels.width + suffix;
  els.tHeight.textContent = UI.labels.height + suffix;
  els.tMin.textContent = UI.labels.min + suffix;
  els.tRange.textContent = UI.labels.range + suffix;
  if(els.tUnit) els.tUnit.textContent = UI.labels.unit;
}

function setNumberInputAttributes(el, cfg){
  if(!el || !cfg) return;
  if(cfg.min!=null){ el.min = cfg.min; } else { el.removeAttribute('min'); }
  if(cfg.max!=null){ el.max = cfg.max; } else { el.removeAttribute('max'); }
  if(cfg.step!=null){ el.step = cfg.step; } else { el.removeAttribute('step'); }
}

function clampInches(value, key){
  const cfg = UNIT_SETTINGS.in[key];
  let v = Number.isFinite(value) ? value : 0;
  if(cfg && cfg.min!=null) v = Math.max(cfg.min, v);
  if(cfg && cfg.max!=null) v = Math.min(cfg.max, v);
  return v;
}

function readInputInches(el, key){
  if(!el) return 0;
  const raw = parseFloat(el.value);
  if(!Number.isFinite(raw)) return clampInches(0, key);
  const inches = currentUnits==='in'?raw:raw/MM_PER_IN;
  return clampInches(inches, key);
}

function setInputFromInches(el, key, inches){
  if(!el) return;
  const clamped = clampInches(inches, key);
  const value = currentUnits==='in'?clamped:clamped*MM_PER_IN;
  el.value = formatNumberForUnit(value, currentUnits, key);
}

function applyUnitToInputs(){
  const cfg = UNIT_SETTINGS[currentUnits];
  setNumberInputAttributes(els.outWidthIn, cfg.width);
  setNumberInputAttributes(els.outHeightIn, cfg.height);
  setNumberInputAttributes(els.minSizeIn, cfg.minSize);
  setNumberInputAttributes(els.rangeSizeIn, cfg.rangeSize);
  if(els.unitSelect) els.unitSelect.value = currentUnits;
}

function switchUnits(newUnit){
  if(newUnit===currentUnits || !UNIT_SETTINGS[newUnit]) return;
  const fields=[
    {el:els.outWidthIn,key:'width'},
    {el:els.outHeightIn,key:'height'},
    {el:els.minSizeIn,key:'minSize'},
    {el:els.rangeSizeIn,key:'rangeSize'}
  ];
  const valuesInches=fields.map(({el,key})=>readInputInches(el,key));
  currentUnits=newUnit;
  applyUnitToInputs();
  updateUnitLabels();
  fields.forEach(({el,key},idx)=>{
    const inches=valuesInches[idx];
    const converted=currentUnits==='in'?inches:inches*MM_PER_IN;
    el.value=formatNumberForUnit(converted, currentUnits, key);
  });
  resetProgress();
  startRenderDebounced();
}

function formatUnitDisplay(value, unit){
  const digits = unit==='in'?3:1;
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits:digits,
    minimumFractionDigits:0
  }).format(value);
}

/* ==========================================================================
   UTILITIES
   ========================================================================== */
function rng(seed){let t=seed>>>0;return function(){t+=0x6D2B79F5;let r=Math.imul(t^t>>>15,1|t);r^=r+Math.imul(r^r>>>7,61|r);return((r^r>>>14)>>>0)/4294967296;}}
function num(n){return new Intl.NumberFormat().format(n);}
function clamp01(x){return x<0?0:(x>1?1:x);}
function setProgress(p){ if(els.barFill&&els.barPct){ p=Math.max(0,Math.min(100,p|0)); els.barFill.style.width=p+'%'; els.barPct.textContent=p+'%'; } }
function resetProgress(){ setProgress(0); }
function showOverlay(on){els.overlay.classList.toggle('show',!!on);}
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);}}

/* ==========================================================================
   IMAGE SOURCE & CANVAS
   ========================================================================== */
let source={img:null,w:0,h:0,data:null};
let currentSvg=null;
let isRendering=false;

function ensureCanvas(){
  let c=document.getElementById('previewCanvas');
  if(!c){
    c=document.createElement('canvas');
    c.id='previewCanvas';
    els.canvasStage.innerHTML='';
    els.canvasStage.appendChild(c);
  }
  return c;
}
function drawShapeOnCanvas(ctx, shape, cx, cy, rPx){
  if(shape==='circle'){
    ctx.beginPath();ctx.arc(cx,cy,rPx,0,Math.PI*2);ctx.fill();
  }else if(shape==='square'){
    const s=rPx*2;ctx.fillRect(cx-s/2,cy-s/2,s,s);
  }else if(shape==='triangle'){
    const s=rPx*2, h=s*Math.sqrt(3)/2;
    ctx.beginPath();ctx.moveTo(cx,cy-h/2);ctx.lineTo(cx-s/2,cy+h/2);ctx.lineTo(cx+s/2,cy+h/2);ctx.closePath();ctx.fill();
  }else if(shape==='star'){
    const outer=rPx, inner=rPx*0.5;
    ctx.beginPath();
    for(let i=0;i<10;i++){
      const ang=-Math.PI/2+i*Math.PI/5;
      const rad=(i%2===0)?outer:inner;
      const x=cx+Math.cos(ang)*rad;const y=cy+Math.sin(ang)*rad;
      i?ctx.lineTo(x,y):ctx.moveTo(x,y);
    }
    ctx.closePath();ctx.fill();
  }else{
    ctx.beginPath();ctx.arc(cx,cy,rPx,0,Math.PI*2);ctx.fill();
  }
}
function drawCanvas(points, opts){
  const c=ensureCanvas();const ctx=c.getContext('2d');
  c.width=source.w||640;c.height=source.h||640;
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle=opts.bgColor||'#fff';ctx.fillRect(0,0,c.width,c.height);
  if(points&&points.length){
    ctx.fillStyle=opts.fillColor||'#000';
    const pxPerInX=c.width/opts.outWIn;
    for(const p of points){
      const dScaled=Math.pow(p.d, opts.gamma);
      const sizeIn=Math.max(0, opts.minIn + opts.rangeIn * dScaled);
      const rPx=(sizeIn * pxPerInX)/2;
      drawShapeOnCanvas(ctx, opts.shape, p.x, p.y, rPx);
    }
  }
  c.style.width='100%';
}

/* ==========================================================================
   PIXEL SAMPLING (DARKNESS)
   ========================================================================== */
function getDarknessAt(x,y,invert){
  const w=source.w,h=source.h,d=source.data;
  if(x<0||y<0||x>=w||y>=h) return 0;
  const i=(y*w+x)*4; const r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255;
  const luma=0.2126*r+0.7152*g+0.0722*b; let dark=1-luma; if(invert) dark=luma;
  return clamp01(dark);
}

/* ==========================================================================
   PLACEMENT (REJECTION + SPATIAL GRID)
   ========================================================================== */
function buildStipplePoints(opts,onProgress){
  const {count,seed,boost,invert,minIn,rangeIn,outWIn,gamma,preventOverlap,padPct} = opts;
  const rand=rng(seed); const pts=[]; const w=source.w,h=source.h;
  const pxPerIn = source.w / outWIn;

  const radiusPxAt = (d)=>{ const sizeIn = Math.max(0, minIn + rangeIn * Math.pow(d, gamma)); return (sizeIn * pxPerIn) / 2; };
  const maxRpx = radiusPxAt(1);
  const cell = Math.max(1, Math.ceil(maxRpx));
  const cols = Math.ceil(w/cell), rows = Math.ceil(h/cell);
  const grid = new Array(cols*rows).fill(null).map(()=>[]);
  function cellIndex(x,y){return Math.floor(y/cell)*cols + Math.floor(x/cell);}

  function canPlace(x,y,rpx){
    if(!preventOverlap) return true;
    const pad = rpx * padPct;
    const cx = Math.floor(x/cell), cy = Math.floor(y/cell);
    for(let gy=Math.max(0,cy-2); gy<=Math.min(rows-1,cy+2); gy++){
      for(let gx=Math.max(0,cx-2); gx<=Math.min(cols-1,cx+2); gx++){
        const bucket = grid[gy*cols+gx];
        for(const idx of bucket){
          const q = pts[idx];
          const dx=q.x-x, dy=q.y-y;
          const dist2 = dx*dx + dy*dy;
          const need = (rpx+pad) + (q.rpx + q.rpx*padPct);
          if(dist2 < need*need) return false;
        }
      }
    }
    return true;
  }

  let target = Math.max(1, Math.floor(opts.count||count));
  const hardTryMax = Math.max(50000, target*30);
  let tries = 0, lastPct = -1;

  while(pts.length < target && tries < hardTryMax){
    tries++;
    const x = Math.floor(rand()*w), y = Math.floor(rand()*h);
    const d = getDarknessAt(x,y,invert);
    const acceptP = Math.min(1, d + boost*0.25);
    if(rand() < acceptP){
      const rpx = radiusPxAt(d);
      if(rpx>0 && canPlace(x,y,rpx)){
        const idx = pts.push({x,y,d,rpx})-1;
        if(preventOverlap) grid[cellIndex(x,y)].push(idx);
      }
    }
    const pct = Math.floor((pts.length/target)*90);
    if(onProgress && pct!==lastPct){ lastPct=pct; onProgress(pct); }

    if(tries % (target*5 || 1000) === 0 && pts.length < target*0.35){
      target = Math.max(pts.length, Math.floor(target * 0.9));
    }
  }
  return {points:pts, tries};
}

/* ==========================================================================
   WEIGHTED LLOYD RELAXATION (D3-DELAUNAY)
   ========================================================================== */
async function ensureDelaunay(){
  if(window.__Delaunay) return window.__Delaunay;
  try{ const mod=await import('https://cdn.jsdelivr.net/npm/d3-delaunay@6/+esm'); window.__Delaunay=mod.Delaunay; return window.__Delaunay; }
  catch(e){ console.warn('d3-delaunay failed to load; optimization skipped.', e); return null; }
}
function pointInPolygon(poly,x,y){
  let inside=false; for(let i=0,j=poly.length-1;i<poly.length;j=i++){const xi=poly[i][0],yi=poly[i][1],xj=poly[j][0],yj=poly[j][1]; const inter=((yi>y)!=(yj>y)) && (x<(xj-xi)*(y-yi)/(yj-yi+1e-12)+xi); if(inter) inside=!inside;} return inside;
}
async function runWeightedLloyd(points,cfg,onProgress){
  const Delaunay=await ensureDelaunay(); if(!Delaunay){onProgress(100);return;}
  const {iter,step,gamma,invert}=cfg;
  for(let it=0; it<iter; it++){
    const dela=Delaunay.from(points,p=>p.x,p=>p.y); const vor=dela.voronoi([0,0,source.w,source.h]);
    for(let i=0;i<points.length;i++){
      const poly=vor.cellPolygon(i); if(!poly) continue;
      let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
      for(const [px,py] of poly){ if(px<minX)minX=px; if(py<minY)minY=py; if(px>maxX)maxX=px; if(py>maxY)maxY=py; }
      minX=Math.max(0,Math.floor(minX)); minY=Math.max(0,Math.floor(minY));
      maxX=Math.min(source.w-1,Math.ceil(maxX)); maxY=Math.min(source.h-1,Math.ceil(maxY));
      let xSum=0,ySum=0,wSum=0;
      for(let y=minY;y<=maxY;y+=step){
        for(let x=minX;x<=maxX;x+=step){
          if(pointInPolygon(poly,x+0.5,y+0.5)){
            const d=getDarknessAt(x,y,invert); const w=Math.pow(d,gamma);
            xSum+=(x+0.5)*w; ySum+=(y+0.5)*w; wSum+=w;
          }
        }
      }
      if(wSum>0){ points[i].x=xSum/wSum; points[i].y=ySum/wSum; }
    }
    const pct=Math.floor(80 + ((it+1)/iter)*20); onProgress(pct);
    await new Promise(r=>setTimeout(r,0));
  }
}

/* ==========================================================================
   SVG ASSEMBLY
   ========================================================================== */
function shapeToSVG(shape, cx, cy, r){
  if(shape==='circle'){
    return `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(4)}" />\n`;
  }else if(shape==='square'){
    const x=(cx-r).toFixed(4), y=(cy-r).toFixed(4), s=(2*r).toFixed(4);
    return `<rect x="${x}" y="${y}" width="${s}" height="${s}" />\n`;
  }else if(shape==='triangle'){
    const s=2*r, h=s*Math.sqrt(3)/2;
    const x1=cx.toFixed(4), y1=(cy-h/2).toFixed(4);
    const x2=(cx-s/2).toFixed(4), y2=(cy+h/2).toFixed(4);
    const x3=(cx+s/2).toFixed(4), y3=(cy+h/2).toFixed(4);
    return `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" />\n`;
  }else if(shape==='star'){
    const outer=r, inner=r*0.5; let pts=[];
    for(let i=0;i<10;i++){const ang=-Math.PI/2+i*Math.PI/5; const rad=(i%2===0)?outer:inner;
      const x=(cx+Math.cos(ang)*rad).toFixed(4); const y=(cy+Math.sin(ang)*rad).toFixed(4); pts.push(`${x},${y}`);
    }
    return `<polygon points="${pts.join(' ')}" />\n`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(4)}" />\n`;
}
function composeSVG(points, opts){
  const unit = opts.unit || 'in';
  const unitScale = unit==='in'?1:MM_PER_IN;
  const outW=opts.outWIn*unitScale, outH=opts.outHIn*unitScale;
  const sx=outW/source.w, sy=outH/source.h;
  const suffix = UNIT_SETTINGS[unit]?.suffix || unit;
  let parts=[];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${outW.toFixed(4)} ${outH.toFixed(4)}" width="${outW.toFixed(4)}${suffix}" height="${outH.toFixed(4)}${suffix}" shape-rendering="geometricPrecision">\n`);
  parts.push(`<rect width="100%" height="100%" fill="${opts.bgColor||'#ffffff'}"/>\n`);
  parts.push(`<g fill="${opts.fillColor||'#000000'}" stroke="none">\n`);
  for(const p of points){
    const dScaled=Math.pow(p.d, opts.gamma);
    const r = Math.max(0, (opts.minIn + opts.rangeIn * dScaled) * unitScale)/2;
    const cx=(p.x*sx), cy=(p.y*sy);
    parts.push(shapeToSVG(opts.shape, cx, cy, r));
  }
  parts.push(`</g>\n</svg>`);
  return parts.join('');
}

/* ==========================================================================
   RENDER PIPELINE
   ========================================================================== */
async function renderAll(){
  if(isRendering) return;
  if(!source.data){
    els.download.disabled=true;
    if(els.fileRow) els.fileRow.classList.add('highlight');
    els.status.textContent=UI.popups.needImage;
    setProgress(0);
    return;
  } else { if(els.fileRow) els.fileRow.classList.remove('highlight'); }

  isRendering=true; showOverlay(true); resetProgress();
  els.overlayText.textContent=UI.popups.placing; els.status.textContent='Processing…';
  els.render.disabled=true; els.download.disabled=true;

  const t0=performance.now();
  const minIn = Math.max(0, readInputInches(els.minSizeIn, 'minSize'));
  const rangeIn = Math.max(0, readInputInches(els.rangeSizeIn, 'rangeSize'));
  const outWIn = readInputInches(els.outWidthIn, 'width');
  const outHIn = readInputInches(els.outHeightIn, 'height');

  setInputFromInches(els.minSizeIn, 'minSize', minIn);
  setInputFromInches(els.rangeSizeIn, 'rangeSize', rangeIn);
  setInputFromInches(els.outWidthIn, 'width', outWIn);
  setInputFromInches(els.outHeightIn, 'height', outHIn);

  const unitConfig = UNIT_SETTINGS[currentUnits] || UNIT_SETTINGS.in;
  const unitSuffix = unitConfig.suffix;
  const unitScale = currentUnits==='mm'?MM_PER_IN:1;
  const outWDisplay = outWIn * unitScale;
  const outHDisplay = outHIn * unitScale;

  const base={
    count:Math.max(100, Math.min(100000, +els.count.value||15000)),
    seed:(+els.seed.value||0)>>>0,
    gamma:Math.max(.1, +els.gamma.value||1),
    boost:Math.max(0, Math.min(1, +els.boost.value||0)),
    invert:!!els.invert.checked,
    minIn,
    rangeIn,
    outWIn,
    outHIn,
    unit:currentUnits,
    fillColor:els.previewDot.value||'#000000',
    bgColor:els.previewBg.value||'#ffffff',
    shape:(els.dotShape && els.dotShape.value) || 'circle'
  };

  const {points}=buildStipplePoints({
    ...base,
    padPct:Math.max(0, (+els.paddingPct.value||0)/100),
    preventOverlap:!!els.preventOverlap.checked,
  }, (pct)=>setProgress(pct));

  els.overlayText.textContent = UI.popups.optimizing;
  await runWeightedLloyd(points, {
    iter: Math.max(1, +els.optimIter.value||20),
    step: Math.max(1, +els.cellStep.value||2),
    gamma: base.gamma, invert: base.invert
  }, (pct)=>setProgress(pct));

  drawCanvas(points, base);
  const svg = composeSVG(points, base);
  currentSvg = `<?xml version="1.0" encoding="UTF-8"?>\n` + svg;
  const t1=performance.now();
  els.stats.textContent=`Points: ${num(points.length)} • ${(t1-t0).toFixed(0)} ms`;
  const formattedW = formatUnitDisplay(outWDisplay, currentUnits);
  const formattedH = formatUnitDisplay(outHDisplay, currentUnits);
  els.status.textContent=UI.popups.done(formattedW, formattedH, unitSuffix);
  els.render.disabled=false; els.download.disabled=false;
  showOverlay(false); isRendering=false;
}

/* ==========================================================================
   EVENT BINDINGS
   ========================================================================== */
const startRenderDebounced=debounce(renderAll,200);

if(els.btnLoad){ els.btnLoad.addEventListener("click", ()=> els.file && els.file.click()); }

function handleLoadedImage(img, filename){
  source.img=img;
  const hc=els.hiddenCanvas, ctx=hc.getContext('2d',{willReadFrequently:true});
  let sw=img.naturalWidth, sh=img.naturalHeight;
  const maxSide=8000; if(sw>maxSide||sh>maxSide){const k=Math.min(maxSide/sw,maxSide/sh); sw=Math.max(1,Math.floor(sw*k)); sh=Math.max(1,Math.floor(sh*k));}
  hc.width=sw; hc.height=sh;
  ctx.clearRect(0,0,sw,sh); ctx.drawImage(img,0,0,sw,sh);
  const imageData=ctx.getImageData(0,0,sw,sh);
  source.w=sw; source.h=sh; source.data=imageData.data;
  if(els.imgInfo) els.imgInfo.textContent = (filename||'Image')+` — ${sw}×${sh} px`;
  if(els.thumb){ els.thumb.src = img.src; els.thumb.width = Math.min(200, sw); }
  const widthInches = readInputInches(els.outWidthIn, 'width');
  const ratio=sh/sw;
  if(els.lockAR && els.lockAR.checked){
    const heightInches = clampInches(widthInches * ratio, 'height');
    setInputFromInches(els.outHeightIn, 'height', heightInches);
  }
  onChange();
}
function loadImageFromURL(url, filename){
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = ()=> handleLoadedImage(img, filename);
  img.onerror = ()=> { if(els.status) els.status.textContent='Failed to load default image.'; };
  img.src = url;
}
els.file.addEventListener('change', (e)=>{ const file=e.target.files[0]; if(!file) return; const url=URL.createObjectURL(file); const img=new Image(); img.onload=()=> handleLoadedImage(img, file.name || 'image'); img.src=url; });

function onChange(){ resetProgress(); startRenderDebounced(); }
function clampCount(){ let v=+els.count.value||0; if(v>100000){els.count.value=100000;} }

els.lockAR.addEventListener('change', ()=>{
  if(els.lockAR.checked){
    const ratio = source.h && source.w ? source.h/source.w : 1;
    const widthInches = readInputInches(els.outWidthIn, 'width');
    const heightInches = clampInches(widthInches * ratio, 'height');
    setInputFromInches(els.outHeightIn, 'height', heightInches);
  }
  onChange();
});
els.outWidthIn.addEventListener('change', ()=>{
  if(els.lockAR.checked){
    const ratio = source.h && source.w ? source.h/source.w : 1;
    const widthInches = readInputInches(els.outWidthIn, 'width');
    const heightInches = clampInches(widthInches * ratio, 'height');
    setInputFromInches(els.outHeightIn, 'height', heightInches);
  }
  onChange();
});
els.outHeightIn.addEventListener('change', ()=>{
  if(els.lockAR.checked){
    const ratio = source.h && source.w ? source.h/source.w : 1;
    if(ratio>0){
      const heightInches = readInputInches(els.outHeightIn, 'height');
      const widthInches = clampInches(heightInches/ratio, 'width');
      setInputFromInches(els.outWidthIn, 'width', widthInches);
    }
  }
  onChange();
});
els.count.addEventListener('change', ()=>{ clampCount(); onChange(); });
['seed','minSizeIn','rangeSizeIn','gamma','boost','invert','preventOverlap','paddingPct','optimIter','cellStep','previewBg','previewDot','dotShape'].forEach(id=>{
  const el=document.getElementById(id); if(!el) return; const ev=(el.tagName==='INPUT' && el.type==='range')?'input':'change'; el.addEventListener(ev, onChange);
});
els.swapColors.addEventListener('click', ()=>{ const a=els.previewBg.value; els.previewBg.value=els.previewDot.value; els.previewDot.value=a; onChange(); });

if(els.unitSelect){
  els.unitSelect.addEventListener('change', (e)=>{
    switchUnits(e.target.value);
  });
}

els.render.addEventListener('click', ()=>renderAll());
els.download.addEventListener('click', ()=>{
  if(!currentSvg || !currentSvg.trim().startsWith('<?xml')){ return; }
  const blob=new Blob([currentSvg], {type:'image/svg+xml;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const suffix = UNIT_SETTINGS[currentUnits]?.suffix || 'in';
  const filename = `stipple_output_${suffix}.svg`;
  const a=document.createElement('a'); a.href=url; a.download=filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
});
els.clear.addEventListener('click', ()=>{
  source={img:null,w:0,h:0,data:null}; els.imgInfo.textContent='No image';
  els.status.textContent='Cleared. Load an image to begin.'; currentSvg=null; resetProgress();
  const c=document.getElementById('previewCanvas'); if(c){const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);}
});

/* Boot */
applyUIText();
updateUnitLabels();
applyUnitToInputs();

const DEFAULT_IMAGE = '';
