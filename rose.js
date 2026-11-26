(() => {
'use strict';
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
const layer=document.createElement('canvas');layer.width=780;layer.height=900;
const g=layer.getContext('2d',{willReadFrequently:true});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let W=0,H=0,dpr=1,last=0,elapsed=0,pointer=0,presses=0,flash=0;
const message=document.querySelector('.message'),sparks=[];
const particles=[],dust=Array.from({length:48},()=>({x:Math.random(),y:Math.random(),z:Math.random(),phase:Math.random()*6.28}));
const glyphs=' .,:;+=*ox%#@';
function layout(){const scale=Math.min(W/820,H/960);return {scale,ox:(W-780*scale)/2,oy:(H-900*scale)/2}}
function resize(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);const {scale,oy}=layout();message.style.top=`${Math.min(H-100,oy+845*scale)}px`}
addEventListener('resize',resize);resize();
function petal(x,y,w,h,angle,light){
 g.save();g.translate(x,y);g.rotate(angle);
 const fill=g.createLinearGradient(-w*.35,-h,w*.4,h*.15);
 fill.addColorStop(0,`rgb(255,${Math.round(125+light*70)},${Math.round(180+light*50)})`);
 fill.addColorStop(.26,`rgb(244,${Math.round(57+light*55)},${Math.round(132+light*55)})`);
 fill.addColorStop(.68,'#a81c61');fill.addColorStop(1,'#3a0a2b');
 g.fillStyle=fill;g.beginPath();g.moveTo(0,h*.55);
 g.bezierCurveTo(-w*.2,h*.3,-w*.72,-h*.26,-w*.47,-h*.65);
 g.bezierCurveTo(-w*.32,-h*.98,-w*.05,-h*.72,w*.13,-h*.85);
 g.bezierCurveTo(w*.53,-h*1.04,w*.7,-h*.42,w*.43,-h*.05);
 g.bezierCurveTo(w*.29,h*.19,w*.08,h*.37,0,h*.55);g.fill();
 g.strokeStyle=`rgba(255,173,211,${.35+light*.25})`;g.lineWidth=1.8;g.stroke();g.restore();
}
function leaf(x,y,a,s){g.save();g.translate(x,y);g.rotate(a);g.scale(s,s);const fill=g.createLinearGradient(0,0,110,-55);fill.addColorStop(0,'#153f38');fill.addColorStop(.5,'#5a9a78');fill.addColorStop(1,'#1c493e');g.fillStyle=fill;g.beginPath();g.moveTo(0,0);g.bezierCurveTo(25,-68,93,-66,137,-53);g.bezierCurveTo(96,-5,47,24,0,0);g.fill();g.strokeStyle='#7faf8e';g.lineWidth=2;g.beginPath();g.moveTo(0,0);g.lineTo(126,-51);g.stroke();for(let i=1;i<6;i++){g.globalAlpha=.4;g.beginPath();g.moveTo(i*20,-i*8);g.lineTo(i*20+4,-i*8-22);g.stroke()}g.restore()}
function drawRose(t){
 g.clearRect(0,0,780,900);g.save();g.translate(Math.sin(t*.45)*5+pointer*4,Math.sin(t*.65)*3);
 // The stem, sepals and leaves are rasterized into the same character field.
 g.strokeStyle='#578b70';g.lineWidth=7;g.beginPath();g.moveTo(392,400);g.bezierCurveTo(425,560,357,665,390,811);g.stroke();
 g.strokeStyle='#9db69b';g.lineWidth=1.5;g.stroke();
 leaf(393,621,-.22,1);leaf(390,710,3.25,.79);
 g.fillStyle='#3f7556';g.beginPath();g.moveTo(396,465);g.lineTo(332,399);g.lineTo(387,422);g.lineTo(432,390);g.lineTo(414,448);g.closePath();g.fill();
 // Broad outer petals make a full, open rose; smaller nested petals form its spiral heart.
 petal(313,346,142,117,-.84,.38);petal(464,341,145,119,.85,.25);
 petal(386,286,150,102,-.12,.64);
 petal(299,320,130,100,-1.04,.52);petal(482,310,124,104,.95,.54);
 petal(332,380,145,114,-.51,.45);petal(455,382,142,113,.55,.32);
 petal(394,404,175,91,.02,.56);
 petal(347,300,102,88,-.5,.72);petal(436,297,100,88,.56,.55);
 petal(375,332,113,95,-.35,.44);petal(429,346,110,88,.73,.8);
 petal(364,361,111,84,-.64,.72);petal(402,379,120,74,.12,.52);
 petal(385,294,70,64,-.4,.83);petal(418,309,69,62,.8,.6);
 petal(386,330,73,60,-.8,.9);petal(408,342,77,55,.35,.58);
 petal(396,311,42,40,-.15,.86);petal(410,320,36,37,.8,.53);petal(396,327,38,29,-.8,.82);
 g.restore();
 for(const p of particles){g.save();g.globalAlpha=Math.min(1,p.life/2);petal(p.x,p.y,p.size*Math.max(.15,Math.abs(Math.cos(p.rot))),p.size*.8,Math.sin(p.rot*.7)*1.8,.5);g.restore()}
}
function spawn(burst=false){particles.push({x:300+Math.random()*190,y:330+Math.random()*70,size:19+Math.random()*15,vx:(Math.random()-.5)*28,vy:18+Math.random()*20,rot:Math.random()*6,spin:(Math.random()-.5)*1.5,life:15});if(burst)for(let i=0;i<4;i++)spawn()}
function shower(count){
 for(let i=0;i<count;i++){spawn();const p=particles[particles.length-1];p.x=280+Math.random()*220;p.y=250+Math.random()*155;p.vx=(Math.random()-.5)*100;p.vy=-12+Math.random()*42;p.spin=(Math.random()-.5)*3;p.size=12+Math.random()*21;p.life=8+Math.random()*5}
 if(particles.length>110)particles.splice(0,particles.length-110);
 for(let i=0;i<count*2;i++){const a=Math.random()*Math.PI*2,v=25+Math.random()*85;sparks.push({x:390,y:330,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1+Math.random()*1.5})}
 if(sparks.length>180)sparks.splice(0,sparks.length-180);
}
function pressRose(){
 presses++;canvas.setAttribute('aria-label',`Розовая роза. Нажатий: ${presses}`);
 if(!reduced){flash=1;shower(presses===10?36:16)}
 if(presses===10){message.hidden=false;message.classList.add('revealed')}
}
canvas.addEventListener('pointerdown',e=>{
 if(!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0))return;
 const {scale,ox,oy}=layout(),x=(e.clientX-ox)/scale,y=(e.clientY-oy)/scale;
 if(((x-390)/205)**2+((y-330)/145)**2<=1)pressRose();
});
canvas.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();pressRose()}});
canvas.addEventListener('pointermove',e=>pointer=(e.clientX/W-.5)*2);
let nextPetal=1.7;
function frame(ms){
 const dt=reduced?0:Math.min((ms-last)/1000,.05);last=ms;elapsed+=dt;flash=Math.max(0,flash-dt*.9);
 if(elapsed>nextPetal){spawn();nextPetal=elapsed+2.1+Math.random()*2.4}
 for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.rot+=p.spin*dt;p.x+=(p.vx+Math.sin(elapsed*1.5+p.y*.009)*20)*dt;p.y+=p.vy*dt;p.vy+=1.4*dt;if(p.life<0||p.y>920)particles.splice(i,1)}
 drawRose(elapsed);
 ctx.clearRect(0,0,W,H);
 const {scale,ox,oy}=layout();
 const halo=ctx.createRadialGradient(W/2,oy+330*scale,0,W/2,oy+350*scale,300*scale);halo.addColorStop(0,'#ff39810b');halo.addColorStop(1,'#ff398100');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
 if(flash>0){const glow=ctx.createRadialGradient(ox+390*scale,oy+330*scale,0,ox+390*scale,oy+330*scale,240*scale);glow.addColorStop(0,`rgba(255,110,177,${flash*.14})`);glow.addColorStop(1,'#ff73b100');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H)}
 ctx.font=`${10*scale}px monospace`;
 for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.life-=dt;if(s.life<=0){sparks.splice(i,1);continue}s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=10*dt;ctx.fillStyle=`rgba(255,191,222,${Math.min(1,s.life)*.8})`;ctx.fillText(i%3===0?'+':'.',ox+s.x*scale,oy+s.y*scale)}
 for(const p of dust){const x=p.x*W+Math.sin(elapsed*.13+p.phase)*12,y=((p.y*H-elapsed*(3+p.z*5))%H+H)%H;ctx.fillStyle=`rgba(221,130,172,${(.12+Math.sin(elapsed*.6+p.phase)*.1)*p.z})`;ctx.fillRect(x,y,1,1)}
 const data=g.getImageData(0,0,780,900).data;
 ctx.font=`${9.8*scale}px "Courier New", monospace`;ctx.textBaseline='top';
 ctx.shadowBlur=3.5*scale;ctx.shadowColor='#fa6ca666';
 for(let y=120;y<900;y+=10){for(let x=0;x<780;x+=6){const k=(y*780+x)*4,a=data[k+3]/255;if(a<.1)continue;const r=data[k],gg=data[k+1],b=data[k+2];const lum=(r*.3+gg*.59+b*.11)/255;const flicker=.94+.06*Math.sin(x*3.7+y*2.1+elapsed*1.8);ctx.fillStyle=`rgba(${r},${gg},${b},${a*flicker})`;const char=glyphs[Math.max(2,Math.min(glyphs.length-1,Math.floor(lum*(glyphs.length-1))))];ctx.fillText(char,ox+x*scale,oy+y*scale)}}
 ctx.shadowBlur=0;requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
