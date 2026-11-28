import { CREATURES } from './rules.mjs';
import { WAYPOINTS, steerCreature, spine } from './journey.mjs';

// Renderer owns only visuals/input. Progress and rewards remain in the rules module.
export async function createWater(host, onGuide, onArrival=()=>{}) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const textures = new Map();
  const paintedKoi=await new Promise(resolve=>{
    const image=new Image(),timer=setTimeout(()=>resolve(null),5000);
    image.onload=()=>{clearTimeout(timer);resolve(image);};image.onerror=()=>{clearTimeout(timer);resolve(null);};
    image.src=new URL('./assets/koi-painted-v2.png',import.meta.url).href;
  });
  let app, fallback, paused = false, time = 0, target = {x:.57,y:.70}, fish = [], size = {w:host.clientWidth,h:host.clientHeight};
  let fallbackMode = false, surface, beaconLayer, petalLayer, mission=null, armed=false, charge=0, flourish=null, ripple={x:.57,y:.70,age:4};
  let petalViews=[];
  const flowerCanvas=document.createElement('canvas');flowerCanvas.width=128;flowerCanvas.height=128;
  const fc=flowerCanvas.getContext('2d');fc.translate(64,64);
  for(let i=0;i<10;i++){fc.save();fc.rotate(i*Math.PI/5);fc.fillStyle=i%2?'#f3dfb1':'#be9860';fc.beginPath();fc.moveTo(0,10);fc.bezierCurveTo(-19,-5,-18,-29,0,-47);fc.bezierCurveTo(18,-29,19,-5,0,10);fc.fill();fc.restore();}
  fc.fillStyle='#f9e7af';fc.beginPath();fc.arc(0,0,9,0,Math.PI*2);fc.fill();
  const drawCreature = (c, species) => {
    const def = CREATURES[species];c.save();c.translate(100,65);
    c.fillStyle = def.color;c.strokeStyle = '#e9efcf';c.lineWidth = 1;
    if (species === 'turtle') {
      for (const x of [-18,18]) for (const y of [-16,16]) {c.beginPath();c.ellipse(x,y,15,6,x*y>0?.6:-.6,0,Math.PI*2);c.fill();}
      c.beginPath();c.ellipse(40,0,13,9,0,0,Math.PI*2);c.fill();
      c.fillStyle='#50877b';c.beginPath();c.ellipse(0,0,33,25,0,0,Math.PI*2);c.fill();c.stroke();
      c.strokeStyle='#b3c88f';for (const x of [-17,0,17]){c.beginPath();c.ellipse(x,0,10,20,0,0,Math.PI*2);c.stroke();}
    } else if (species === 'ray') {
      c.beginPath();c.moveTo(38,0);c.bezierCurveTo(13,-10,-12,-44,-39,-43);c.quadraticCurveTo(-15,0,-39,43);c.bezierCurveTo(-12,44,13,10,38,0);c.fill();c.stroke();c.beginPath();c.moveTo(-17,0);c.quadraticCurveTo(-70,14,-90,0);c.stroke();
    } else {
      c.globalAlpha=.65;c.beginPath();c.moveTo(-32,0);c.bezierCurveTo(-62,-5,-67,-37,-93,-30);c.quadraticCurveTo(-72,0,-93,30);c.bezierCurveTo(-67,37,-62,5,-32,0);c.fill();
      c.globalAlpha=1;const skin=c.createLinearGradient(0,-22,0,22);skin.addColorStop(0,'#778b76');skin.addColorStop(.25,def.color);skin.addColorStop(.5,'#f7e9bb');skin.addColorStop(1,'#86794f');c.fillStyle=skin;c.beginPath();c.moveTo(53,0);c.bezierCurveTo(40,-26,-13,-22,-46,0);c.bezierCurveTo(-13,22,40,26,53,0);c.fill();
      c.fillStyle=species==='clownfish'?'#fff1d4':species==='butterfly'?'#cfc4ad':'#bd6944';
      for(const [x,y] of [[-10,3],[22,-2]]){c.beginPath();c.ellipse(x,y,species==='clownfish'?6:10,12,.4,0,Math.PI*2);c.fill();}
      c.strokeStyle='rgba(255,249,216,.2)';c.lineWidth=.6;for(let x=-30;x<35;x+=6){c.beginPath();c.ellipse(x,0,6,12,0,-1.1,1.1);c.stroke();}
      c.strokeStyle='rgba(255,249,216,.5)';c.beginPath();c.moveTo(38,-11);c.quadraticCurveTo(0,-15,-32,-2);c.stroke();
      c.fillStyle=def.color;c.globalAlpha=.6;for(const side of [-1,1]){c.beginPath();c.moveTo(14,side*10);c.quadraticCurveTo(-5,side*(species==='butterfly'?52:34),-25,side*16);c.fill();}c.globalAlpha=1;
    }
    c.fillStyle='#112f32';for(const side of [-1,1]){c.beginPath();c.arc(species==='turtle'?44:species==='ray'?23:40,side*6,2,0,Math.PI*2);c.fill();}c.restore();
  };
  function texture(species) {
    if (!textures.has(species)) {const canvas=document.createElement('canvas');canvas.width=200;canvas.height=130;const context=canvas.getContext('2d');if(species==='koi'&&paintedKoi)context.drawImage(paintedKoi,0,0,200,130);else drawCreature(context,species);textures.set(species,{canvas,texture:app?PIXI.Texture.from(canvas):null});}
    return textures.get(species);
  }
  try {
    if (!window.PIXI) throw Error('Renderer missing');
    app = new PIXI.Application();
    await app.init({resizeTo:host,antialias:true,backgroundAlpha:0,resolution:Math.min(devicePixelRatio,1.5),autoDensity:true,preference:'webgl'});
    host.append(app.canvas);app.ticker.maxFPS=30;surface=new PIXI.Graphics();beaconLayer=new PIXI.Container();beaconLayer.eventMode='none';app.stage.eventMode='none';app.stage.addChild(beaconLayer,surface);
    const flowerTexture=PIXI.Texture.from(flowerCanvas);textures.set('waypoint-flower',{canvas:flowerCanvas,texture:flowerTexture});
    WAYPOINTS.forEach(()=>{const flower=new PIXI.Sprite(flowerTexture);flower.anchor.set(.5);flower.scale.set(.42);beaconLayer.addChild(flower);});
    petalLayer=new PIXI.Container();petalLayer.eventMode='none';app.stage.addChild(petalLayer);
    petalViews=Array.from({length:28},()=>{const petal=new PIXI.Sprite(flowerTexture);petal.anchor.set(.5);petal.visible=false;petal.scale.set(.045);petalLayer.addChild(petal);return petal;});
  } catch {
    try {app?.destroy(true,{children:true});} catch { /* Initialization can fail before a renderer exists. */ }
    app=null;fallbackMode=true;fallback=document.createElement('canvas');host.append(fallback);
  }
  const canvas=app?.canvas||fallback;
  canvas.setAttribute('aria-hidden','true');
  function setCreatures(records, selected) {
    const old=new Map(fish.map(f=>[f.id,f]));
    fish = (records.length?records.slice(-24):[{id:`preview-${selected}`,species:selected}]).map(({id,species},i)=>{
      if(old.has(id)){const kept=old.get(id);old.delete(id);return kept;}
      const data=texture(species);let view,body,points,shadow;
      if(app){
        view=new PIXI.Container();view.eventMode='none';
        shadow=new PIXI.Sprite(data.texture);shadow.anchor.set(.5);shadow.position.set(5,10);shadow.tint=0x082e32;shadow.alpha=.25;view.addChild(shadow);
        if(species==='turtle'){body=new PIXI.Sprite(data.texture);body.anchor.set(.5);}
        else{points=spine(0,i*2.4,0).map(p=>new PIXI.Point(p.x,p.y));body=new PIXI.MeshRope({texture:data.texture,points,textureScale:0,width:130});}
        view.addChild(body);app.stage.addChildAt(view,0);
      }
      return {id,species,view,body,points,x:motion.matches?.55+(i%4)*.045:.76,y:motion.matches?.55+Math.floor(i/4)*.012:.57,vx:0,vy:0,angle:Math.PI,seed:i*2.4,preview:!records.length,arrival:0};
    });
    old.forEach(f=>f.view?.destroy());
    render(0);
  }
  function render(dt) {
    size={w:host.clientWidth,h:host.clientHeight};time+=dt;
    let context;
    if(fallback){const dpr=Math.min(devicePixelRatio,1.5),w=Math.round(size.w*dpr),h=Math.round(size.h*dpr);if(fallback.width!==w||fallback.height!==h){fallback.width=w;fallback.height=h;}context=fallback.getContext('2d');context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,size.w,size.h);}
    const neighbours=fish.map(f=>({id:f.id,x:f.x,y:f.y}));
    for(const f of fish){
      const tx=target.x+Math.cos(time*.3+f.seed)*.022,ty=target.y+Math.sin(time*.35+f.seed)*.018;
      // A guided companion leads; the school yields around it rather than blocking its arrival.
      const school=mission?.status==='playing'&&mission.receiptId===f.id?[{id:f.id,x:f.x,y:f.y}]:neighbours;
      if(dt)Object.assign(f,steerCreature(f,school,{x:tx,y:ty},dt,size.w,size.h));
      f.arrival=Math.min(1,f.arrival+(motion.matches?1:dt*.8));
      const scale=CREATURES[f.species].size*Math.max(.45,Math.min(.85,size.w/1100))*(.6+f.arrival*.4);
      if(f.view){
        f.view.position.set(f.x*size.w,f.y*size.h);f.view.rotation=f.angle;f.view.scale.set(scale);f.view.alpha=(f.preview?.7:.96)*(.4+.6*f.arrival);
        if(f.points){const bend=spine(time,f.seed,motion.matches?0:f.species==='ray'?5:11+Math.min(7,Math.hypot(f.vx,f.vy)/12));bend.forEach((p,i)=>f.points[i].set(p.x,p.y));}
      }
      else{context.save();context.translate(f.x*size.w,f.y*size.h);context.rotate(f.angle);context.scale(scale,scale);context.globalAlpha=f.preview?.7:1;context.drawImage(texture(f.species).canvas,-100,-65);context.restore();}
    }
    // Sparse surface reflections sit above the fish, keeping one underwater plane.
    surface?.clear();
    if(mission?.status==='playing'&&armed&&!motion.matches){
      const lead=fish.find(f=>f.id===mission.receiptId),point=WAYPOINTS[mission.step];
      if(lead){
        const bendX=(lead.x+point.x)/2,bendY=(lead.y+point.y)/2-.045;
        for(let i=1;i<=18;i++){const u=((i/18+time*.11)%1),v=1-u,x=(v*v*lead.x+2*v*u*bendX+u*u*point.x)*size.w,y=(v*v*lead.y+2*v*u*bendY+u*u*point.y)*size.h;
          if(surface)surface.circle(x,y,1.3+(i%3)*.3).fill({color:0xefcf92,alpha:.35});
          else{context.fillStyle='rgba(239,207,146,.35)';context.beginPath();context.arc(x,y,1.5,0,Math.PI*2);context.fill();}
        }
      }
    }
    WAYPOINTS.forEach((p,i)=>{
      const visible=mission&&(mission.status==='completed'||i<=mission.step),current=mission?.status==='playing'&&mission.step===i;
      const flower=beaconLayer?.children[i];
      if(flower){flower.visible=!!visible;flower.position.set(p.x*size.w,p.y*size.h);flower.alpha=current?.9:.52;flower.scale.set(current?.42:.27);flower.rotation=motion.matches?0:Math.sin(time*.6+i)*.05;}
      else if(visible){context.save();context.globalAlpha=current?.9:.52;const edge=current?54:35;context.drawImage(flowerCanvas,p.x*size.w-edge/2,p.y*size.h-edge/2,edge,edge);context.restore();}
      if(current){const radius=36+(motion.matches?0:Math.sin(time*2)*3);if(surface){surface.circle(p.x*size.w,p.y*size.h,radius).stroke({color:0xf2d49a,width:1.3,alpha:.6});if(charge>0)surface.arc(p.x*size.w,p.y*size.h,radius+5,-Math.PI/2,-Math.PI/2+Math.min(1,charge/.65)*Math.PI*2).stroke({color:0xffe9b0,width:3,alpha:.9});}else{context.strokeStyle='#e4c588';context.lineWidth=1.3;context.beginPath();context.arc(p.x*size.w,p.y*size.h,radius,0,Math.PI*2);context.stroke();}}
    });
    if(mission?.status==='playing'&&armed&&dt){
      const p=WAYPOINTS[mission.step],companion=fish.find(f=>f.id===mission.receiptId);
      const near=companion&&Math.hypot((companion.x-p.x)*size.w,(companion.y-p.y)*size.h)<48;
      charge=near?charge+dt:Math.max(0,charge-dt);
      if(charge>=.65){const step=mission.step;armed=false;flourish={...p,age:0,final:step===2};queueMicrotask(()=>onArrival(step));}
    }
    for(let i=0;i<8;i++){
      const x=(.25+i*.07)*size.w,y=(.46+Math.sin(i*1.8+time*.18)*.12)*size.h;
      if(surface)surface.moveTo(x,y).bezierCurveTo(x+12,y-4,x+30,y+8,x+49,y+2).stroke({color:0xc5e3cf,width:1,alpha:.15});
      else{context.strokeStyle='rgba(197,227,207,.15)';context.lineWidth=1;context.beginPath();context.moveTo(x,y);context.bezierCurveTo(x+12,y-4,x+30,y+8,x+49,y+2);context.stroke();}
    }
    ripple.age+=dt;
    if(flourish)flourish.age+=dt;
    for(let i=0;i<28;i++){
      const age=flourish?.age??9,visible=!motion.matches&&age<2.3,petal=petalViews[i];
      if(petal)petal.visible=visible;
      if(!visible)continue;
      const angle=i*2.39996,travel=(10+(i%7)*6)*Math.min(1,age/1.3),x=flourish.x*size.w+Math.cos(angle)*travel,y=flourish.y*size.h+Math.sin(angle)*travel*.65-age*12,alpha=Math.max(0,1-age/2.3)*.7;
      if(petal){petal.position.set(x,y);petal.rotation=angle+age*.3;petal.alpha=alpha;petal.scale.set(flourish.final?.055:.04);}
      else{context.save();context.globalAlpha=alpha;context.translate(x,y);context.rotate(angle+age*.3);context.drawImage(flowerCanvas,-4,-4,8,8);context.restore();}
    }
    if(!motion.matches&&ripple.age<2){
      const x=ripple.x*size.w,y=ripple.y*size.h,r=8+ripple.age*28,alpha=(1-ripple.age/2)*.4;
      if(surface)surface.ellipse(x,y,r,r*.4).stroke({color:0xeee0b2,width:1.4,alpha});
      else{context.strokeStyle=`rgba(238,224,178,${alpha})`;context.beginPath();context.ellipse(x,y,r,r*.4,0,0,Math.PI*2);context.stroke();}
    }
    if(app&&(motion.matches||paused||!dt))app.render();
  }
  let lastGuide=0;
  const pointer=e=>{
    if(paused)return;
    const rect=canvas.getBoundingClientRect();target={x:Math.max(.2,Math.min(.85,(e.clientX-rect.left)/rect.width)),y:Math.max(.35,Math.min(.78,(e.clientY-rect.top)/rect.height))};
    if(mission?.status==='playing'){const p=WAYPOINTS[mission.step];if(Math.hypot((target.x-p.x)*size.w,(target.y-p.y)*size.h)<52)armed=true;}
    if(ripple.age>1)ripple={...target,age:0};
    if(motion.matches){fish.forEach((f,i)=>{f.x=target.x+(i%4)*.025;f.y=target.y+Math.floor(i/4)*.025;});render(0);if(armed&&mission?.status==='playing'){armed=false;onArrival(mission.step);}}
    if(performance.now()-lastGuide>12000){onGuide();lastGuide=performance.now();}
  };
  canvas.addEventListener('pointermove',pointer);canvas.addEventListener('pointerdown',pointer);
  let raf=0,previous=0;
  const tick=now=>{if(!paused&&!document.hidden&&!motion.matches){render(previous?Math.min((now-previous)/1000,.05):0);previous=now;raf=requestAnimationFrame(tick);}};
  const updateLoop=()=>{cancelAnimationFrame(raf);previous=0;if(app){if(paused||document.hidden||motion.matches)app.stop();else app.start();}else if(!paused&&!document.hidden&&!motion.matches)raf=requestAnimationFrame(tick);render(0);};
  if(app)app.ticker.add(t=>{if(!paused&&!document.hidden&&!motion.matches)render(Math.min(t.deltaMS/1000,.05));});
  const resize=new ResizeObserver(()=>render(0));resize.observe(host);
  document.addEventListener('visibilitychange',updateLoop);motion.addEventListener('change',updateLoop);updateLoop();
  return {
    fallback:fallbackMode,
    setCreatures,
    setJourney(value){const changed=mission?.receiptId!==value?.receiptId||mission?.step!==value?.step;mission=value?{...value}:null;if(changed){armed=false;charge=0;if(value?.status==='playing'&&value.step===0)target={x:.72,y:.55};}render(0);},
    guideJourney(){if(paused||mission?.status!=='playing')return;target={...WAYPOINTS[mission.step]};armed=true;ripple={...target,age:0};if(motion.matches){fish.forEach((f,i)=>{f.x=target.x+(i%4)*.02;f.y=target.y+Math.floor(i/4)*.015;});render(0);armed=false;onArrival(mission.step);}},
    guide(wander=false){if(paused)return;target=wander?{x:.71,y:.70}:{x:.49,y:.70};ripple={...target,age:0};if(motion.matches){fish.forEach((f,i)=>{f.x=target.x+(i%4)*.03;f.y=target.y+Math.floor(i/4)*.015;});render(0);}},
    pause(value){paused=value;updateLoop();},
    dispose(){cancelAnimationFrame(raf);resize.disconnect();motion.removeEventListener('change',updateLoop);document.removeEventListener('visibilitychange',updateLoop);canvas.removeEventListener('pointermove',pointer);canvas.removeEventListener('pointerdown',pointer);if(app)app.destroy(true,{children:true,texture:true,textureSource:true});textures.clear();}
  };
}
