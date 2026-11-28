// Portable session rules and original steering math. No renderer, clock or reward writes.
export const WAYPOINTS = Object.freeze([{x:.68,y:.46},{x:.36,y:.60},{x:.69,y:.62}]);
export function beginJourney(receipt) {
  return {receiptId:receipt.id,species:receipt.species,habitat:receipt.habitat,step:0,status:'playing',paused:false};
}
export function arrive(state, step) {
  if(!state||state.paused||state.status!=='playing'||step!==state.step)return state;
  const next=step+1;
  return {...state,step:next,status:next===3?'completed':'playing'};
}
export function pauseJourney(state, paused) {return state?{...state,paused}:state;}
export function spine(time, seed, amplitude) {
  return Array.from({length:17},(_,i)=>{const t=i/16;return{x:-100+t*200,y:Math.sin(time*6-t*4+seed)*amplitude*(1-t)**2};});
}
export function steerCreature(fish, neighbours, target, delta, width, height) {
  if(!Number.isFinite(delta)||delta<=0)return fish;
  const dt=Math.min(delta,.05),maxSpeed=(fish.species==='turtle'?44:94)*Math.max(.7,Math.min(1.3,width/900));
  const dx=(target.x-fish.x)*width,dy=(target.y-fish.y)*height,distance=Math.hypot(dx,dy);
  let wantX=distance?dx/distance*maxSpeed*Math.min(1,distance/65):0;
  let wantY=distance?dy/distance*maxSpeed*Math.min(1,distance/65):0;
  for(const other of neighbours){
    if(other.id===fish.id)continue;
    const sx=(fish.x-other.x)*width,sy=(fish.y-other.y)*height,d=Math.hypot(sx,sy);
    if(d<38){const pressure=(38-d)*1.8;if(d>.01){wantX+=sx/d*pressure;wantY+=sy/d*pressure;}else wantX+=(fish.id<other.id?-1:1)*pressure;}
  }
  const blend=1-Math.exp(-dt*3.2);
  let vx=(fish.vx||0)+(wantX-(fish.vx||0))*blend,vy=(fish.vy||0)+(wantY-(fish.vy||0))*blend;
  const speed=Math.hypot(vx,vy);if(speed>maxSpeed){vx=vx/speed*maxSpeed;vy=vy/speed*maxSpeed;}
  const heading=speed>.8?Math.atan2(vy,vx):fish.angle;
  const turn=Math.atan2(Math.sin(heading-fish.angle),Math.cos(heading-fish.angle));
  const angle=fish.angle+Math.max(-dt*3.5,Math.min(dt*3.5,turn));
  if(speed>.8){const actualSpeed=Math.min(speed,maxSpeed);vx=Math.cos(angle)*actualSpeed;vy=Math.sin(angle)*actualSpeed;}
  return {x:Math.max(.18,Math.min(.85,fish.x+vx*dt/width)),y:Math.max(.35,Math.min(.79,fish.y+vy*dt/height)),vx,vy,angle};
}
