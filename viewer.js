// Mappa non infinita + zoom control nativo Leaflet
const map = L.map('map', {minZoom:2,maxZoom:8,worldCopyJump:false, zoomControl:true}).setView([20,0],2);
const bounds = L.latLngBounds(L.latLng(-85,-180), L.latLng(85,180));
map.setMaxBounds(bounds); map.options.maxBoundsViscosity = 1.0;
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:8, noWrap:true, continuousWorld:false}).addTo(map);

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCap = document.getElementById('lightbox-caption');
const btnClose = lb.querySelector('.close');
const btnPrev = lb.querySelector('.prev');
const btnNext = lb.querySelector('.next');
let current = { p:null, i:0 };

function openLB(p,i){
  if(!p.images || !p.images.length) return;
  current = { p, i };
  lbImg.src = p.images[i];
  lbCap.textContent = (p.title||'') + ' — ' + (i+1) + ' / ' + p.images.length;
  lb.classList.remove('hidden');
}
function closeLB(){ lb.classList.add('hidden'); }
btnClose.onclick = closeLB;
lb.onclick = (e)=>{ if(e.target===lb) closeLB(); };
btnPrev.onclick = ()=>{ if(!current.p) return; current.i=(current.i-1+current.p.images.length)%current.p.images.length; lbImg.src=current.p.images[current.i]; lbCap.textContent=(current.p.title||'')+` — ${current.i+1}/${current.p.images.length}`; };
btnNext.onclick = ()=>{ if(!current.p) return; current.i=(current.i+1)%current.p.images.length; lbImg.src=current.p.images[current.i]; lbCap.textContent=(current.p.title||'')+` — ${current.i+1}/${current.p.images.length}`; };

function popupHTML(p){
  const thumbs = (p.images||[]).map((src,i)=>`<img class="thumb" src="${src}" data-idx="${i}" alt="img ${i+1}">`).join('');
  return `<div class="popup">
    <b>${p.title||'Senza titolo'}</b>
    <div class="coords">(${p.lat.toFixed(2)}, ${p.lon.toFixed(2)})</div>
    <div class="thumbs">${thumbs||'<em>Nessuna immagine</em>'}</div>
  </div>`;
}

START_POINTS.forEach(p => {
  const m = L.circleMarker([p.lat,p.lon], {radius:4.8,color:'#4DA3FF',weight:2,fillOpacity:1,fillColor:'#4DA3FF'}).addTo(map);
  m.bindPopup(()=>popupHTML(p));
  m.on('popupopen', (e)=>{
    const node = e.popup.getElement();
    node.querySelectorAll('img.thumb').forEach((img,i)=> img.addEventListener('click', ()=>openLB(p,i)));
  });
});
