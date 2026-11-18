import { CREATURES, fresh, restore, release, visit, chapter, summary } from './rules.mjs';
import { COPY, PLACES, creatureIcon } from './content.mjs';
import { createWater } from './water.mjs';
import { Music } from './music.mjs';
import { beginJourney, arrive, pauseJourney, WAYPOINTS } from './journey.mjs';
import { JOURNEY_COPY } from './journey-copy.mjs';

const $=id=>document.getElementById(id), KEY='foobow.sanctuary.prototype.v1';
const requestedLanguage = new URLSearchParams(location.search).get('lang');
const initialLanguage = requestedLanguage ?? navigator.language;
let state=fresh(),language=initialLanguage.startsWith('zh')?'zh-Hans':'en',habitat='pond',selected='koi',paused=false,water,saveBlocked=false,storageWarning='',locating=false;
let companionJourney=null,immersive=location.hash!=='#journey';
const music=new Music();let audioBusy=false;
try{const raw=localStorage.getItem(KEY);if(raw!==null)state=restore(JSON.parse(raw));}catch{saveBlocked=true;storageWarning='invalidSave';}
function text(){return COPY[language];}
function collectionLabel(stats){return language==='en'?`${stats.total} ${stats.total===1?'life':'lives'} · ${stats.species} ${stats.species===1?'kind':'kinds'}`:`${stats.total} ${text().lives} · ${stats.species} ${text().speciesCount}`;}
function save(){
  if(saveBlocked)return;
  try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageWarning='storage';$('storageNotice').textContent=text().storage;}
}
function announce(key){$('feedback').textContent=text()[key];}
function renderJourney(){
  const j=companionJourney?.habitat===habitat?companionJourney:null,c=JOURNEY_COPY[language],active=!!j;
  $('companionJourney').hidden=!active;document.body.classList.toggle('on-journey',active);
  $('playHint').hidden=active;
  $('waypointHint').hidden=!j||j.status!=='playing';
  if(j?.status==='playing'){const point=WAYPOINTS[j.step];$('waypointHint').textContent=c.followLight;$('waypointHint').style.left=`${point.x*100}%`;$('waypointHint').style.top=`${point.y*100}%`;}
  water?.setJourney(j);
  if(!j)return;
  const finished=j.status==='completed';
  $('journeyTitle').textContent=finished?c.finished:c.title;
  $('journeySteps').replaceChildren(...c.steps.map((label,i)=>{const li=document.createElement('li');li.textContent=label;li.className=i<j.step?'done':i===j.step?'current':'';if(i===j.step)li.setAttribute('aria-current','step');return li;}));
  $('journeyProgress').value=j.step;$('journeyProgress').setAttribute('aria-label',c.progress);
  $('journeyInstruction').textContent=finished?c.finished:c.instruction;
  $('journeyInstruction').hidden=finished;
  $('journeyGuide').textContent=finished?c.replay:c.actions[j.step];$('journeyGuide').disabled=paused;
  $('journeySkip').textContent=c.skip;$('journeySkip').disabled=paused;
  $('storyCopy').textContent=finished?c.ending:c.passages[j.step];
  $('chapterLabel').textContent=`${text().species[j.species]} · ${finished?c.steps[2]:c.steps[j.step]}`;
  $('blessing').textContent=finished?c.wishes[j.species]:j.step?c.replies[j.step-1]:c.waiting;
}
function arrival(step){
  const next=arrive(companionJourney,step);
  if(next===companionJourney)return;
  companionJourney=next;render();
  if(!paused)music.cue(next.step);
}
function render(){
  const focusHabitat=document.activeElement?.dataset.habitatChoice,focusSpecies=document.activeElement?.dataset.speciesChoice;
  const t=text(),stats=summary(state);document.documentElement.lang=language;
  $('diveLink').textContent=language==='en'?'Beneath the Lilies':'莲叶之下';
  $('diveLink').href=language==='en'?'dive/':'dive/?lang=zh';
  document.body.classList.toggle('immersive',immersive);$('journey').hidden=immersive;
  $('pauseOverlay').hidden=!paused;$('pauseOverlay').textContent=language==='en'?'Paused. Take your time; your companions are safe.':'已暂停。慢慢来，伙伴们都安好。';
  $('collectionToggle').textContent=JOURNEY_COPY[language][immersive?'showCollection':'hideCollection'];$('collectionToggle').setAttribute('aria-expanded',String(!immersive));
  document.querySelectorAll('[data-copy]').forEach(el=>{const key=el.dataset.copy;el.textContent=t[key];if(key==='title'||key==='hint')el.style.whiteSpace='pre-line';});
  $('language').textContent=language==='en'?'中文':'English';$('seeds').textContent=state.seeds;$('rank').textContent=t.ranks[stats.rank];
  $('pause').textContent=t[paused?'resume':'pause'];$('pause').setAttribute('aria-pressed',String(paused));$('sound').textContent=t[music.enabled?'soundOn':'soundOff'];$('sound').setAttribute('aria-pressed',String(music.enabled));
  $('sound').disabled=paused||audioBusy;
  document.querySelectorAll('.atlas text').forEach((el,i)=>el.textContent=Object.values(t.habitats)[i]);
  $('chapterLabel').textContent=`${t.habitats[habitat]} · ${t.stages[0]}`;$('storyCopy').textContent=t.openings[habitat];$('blessing').textContent=t.welcome;
  $('scene').dataset.habitat=habitat;
  $('habitats').replaceChildren(...Object.keys(PLACES).map(id=>{const b=document.createElement('button');b.dataset.habitatChoice=id;b.textContent=t.habitats[id];b.setAttribute('aria-pressed',String(habitat===id));b.onclick=()=>{habitat=id;if(!CREATURES[selected].habitats.includes(id))selected=Object.keys(CREATURES).find(s=>CREATURES[s].habitats.includes(id));render();};return b;}));
  $('creatures').replaceChildren(...Object.entries(CREATURES).filter(([,def])=>def.habitats.includes(habitat)).map(([id,def])=>{
    const b=document.createElement('button');b.dataset.speciesChoice=id;b.className='creature';b.setAttribute('aria-pressed',String(selected===id));b.setAttribute('aria-label',`${t.species[id]} · ${def.cost} ${t.seedsUnit}`);
    b.innerHTML=creatureIcon(id,def.color);const label=document.createElement('span'),name=document.createElement('strong'),trait=document.createElement('small'),cost=document.createElement('span');name.textContent=t.species[id];trait.textContent=t.traits[id];cost.textContent=`${def.cost} ${t.seedsUnit}`;label.append(name,trait);b.append(label,cost);b.onclick=()=>{selected=id;render();};return b;
  }));
  $('release').textContent=`${t.release} · ${t.species[selected]} · ${CREATURES[selected].cost} ${t.seedsUnit}`;
  $('release').disabled=paused||state.seeds<CREATURES[selected].cost||state.releases.length>=500;
  $('visit').disabled=paused;
  for(const id of ['gather','wander'])$(id).disabled=paused;
  $('journeyVisit').hidden=!state.releases.some(r=>r.habitat===habitat);$('journeyVisit').disabled=paused;$('journeyVisit').textContent=JOURNEY_COPY[language].visit;
  $('collectionCount').textContent=collectionLabel(stats);
  $('storageNotice').textContent=storageWarning?t[storageWarning]:'';
  if(water){$('rendererStatus').textContent=water.fallback?t.graphicsFallback:'';water.setCreatures(state.releases.filter(r=>r.habitat===habitat),selected);}
  $('feedback').textContent=paused?t.paused:state.seeds<CREATURES[selected].cost?t.insufficient:state.releases.length>=500?t.full:'';
  if(focusHabitat)document.querySelector(`[data-habitat-choice="${focusHabitat}"]`)?.focus({preventScroll:true});
  if(focusSpecies)document.querySelector(`[data-species-choice="${focusSpecies}"]`)?.focus({preventScroll:true});
  renderJourney();
}
$('release').onclick=()=>{
  if(paused)return;
  try{state=release(state,selected,habitat,crypto.randomUUID(),Date.now());companionJourney=beginJourney(state.releases.at(-1));immersive=true;save();render();if(state.seeds>=CREATURES[selected].cost)announce('released');$('journeyGuide').focus({preventScroll:true});$('scene').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}catch{announce(state.seeds<CREATURES[selected].cost?'insufficient':'full');}
};
$('visit').onclick=()=>{if(paused)return;const next=visit(state,Date.now()),changed=next!==state;state=next;save();render();announce(changed?'visitDone':'visited');};
function journal(){
  const t=text(),stats=summary(state);
  $('journalSummary').textContent=`${collectionLabel(stats)} · ${t.ranks[stats.rank]}`;
  const entries=state.releases.slice().reverse().map(r=>{
    const article=document.createElement('article');article.className='entry';const stage=chapter(r,Date.now());
    const title=document.createElement('h3'),meta=document.createElement('p'),track=document.createElement('div'),story=document.createElement('p'),next=document.createElement('p');
    title.textContent=t.species[r.species];meta.className='meta';meta.textContent=`${t.habitats[r.habitat]} · ${new Intl.DateTimeFormat(language,{dateStyle:'medium'}).format(r.at)}`;track.className='chapter-track';
    t.stages.forEach((name,i)=>{const span=document.createElement('span');span.textContent=name;if(i===stage){span.className='current';span.setAttribute('aria-current','step');}track.append(span);});story.textContent=t.stories[stage];next.textContent=stage===3?t.complete:t.next;article.append(title,meta,track,story,next);return article;
  });
  if(!entries.length){const p=document.createElement('p');p.textContent=t.empty;entries.push(p);}
  $('entries').replaceChildren(...entries);
}
$('journalButton').onclick=()=>{journal();$('journal').showModal();};$('closeJournal').onclick=()=>$('journal').close();
$('language').onclick=()=>{language=language==='en'?'zh-Hans':'en';render();if($('journal').open)journal();};
$('gather').onclick=()=>{if(!paused){water?.guide();$('blessing').textContent=text().gathering;}};
$('collectionToggle').onclick=()=>{immersive=!immersive;render();};
document.querySelector('.gather a').onclick=event=>{event.preventDefault();immersive=false;render();$('journey').scrollIntoView({behavior:'instant',block:'start'});$('habitats').querySelector('button')?.focus({preventScroll:true});};
$('wander').onclick=()=>{if(!paused){water?.guide(true);$('blessing').textContent=text().exploring;}};
$('pause').onclick=async()=>{paused=!paused;companionJourney=pauseJourney(companionJourney,paused);water?.pause(paused);document.body.classList.toggle('paused',paused);if(paused)await music.mute();render();};
$('journeyGuide').onclick=()=>{if(paused||!companionJourney)return;if(companionJourney.status==='completed'){companionJourney=beginJourney({id:companionJourney.receiptId,...companionJourney});render();}else water?.guideJourney();};
$('journeySkip').onclick=()=>{if(!paused){companionJourney=null;immersive=true;render();$('gather').focus({preventScroll:true});}};
$('journeyVisit').onclick=()=>{if(paused)return;const friend=state.releases.findLast(r=>r.habitat===habitat);if(friend){companionJourney=beginJourney(friend);immersive=true;render();}};
$('sound').onclick=async()=>{
  if(audioBusy)return;audioBusy=true;$('sound').disabled=true;
  try{if(music.enabled)await music.mute();else if(!paused)await music.enable();render();}catch{announce('soundError');}finally{audioBusy=false;$('sound').disabled=paused;}
};
document.addEventListener('visibilitychange',async()=>{if(document.hidden){await music.mute();$('sound').textContent=text().soundOff;$('sound').setAttribute('aria-pressed','false');}});
$('delete').onclick=()=>{$('confirmDelete').hidden=false;};
$('confirmDelete').onclick=()=>{try{localStorage.removeItem(KEY);}catch{/* Temporary play remains available. */}state=fresh();companionJourney=null;saveBlocked=false;storageWarning='';$('confirmDelete').hidden=true;render();};
$('nearby').onclick=()=>{
  if(locating)return;
  if(!navigator.geolocation){$('locationNote').textContent=text().locationError;return;}
  locating=true;$('nearby').disabled=true;$('locationNote').textContent=text().locating;
  const end=()=>{locating=false;$('nearby').disabled=false;};
  navigator.geolocation.getCurrentPosition(position=>{
    const {latitude,longitude}=position.coords,rad=Math.PI/180;
    const distance=p=>{const a=Math.sin((p.lat-latitude)*rad/2)**2+Math.cos(latitude*rad)*Math.cos(p.lat*rad)*Math.sin((p.lon-longitude)*rad/2)**2;return 6371*2*Math.asin(Math.sqrt(Math.min(1,a)));};
    const nearest=Object.entries(PLACES).sort((a,b)=>distance(a[1])-distance(b[1]))[0];habitat=nearest[0];selected=Object.keys(CREATURES).find(s=>CREATURES[s].habitats.includes(habitat));render();$('locationNote').textContent=`${text().nearest}: ${language==='en'?nearest[1].name:nearest[1].zh} · ${Math.round(distance(nearest[1]))} ${text().curated}`;end();
  },()=>{$('locationNote').textContent=text().locationError;end();},{timeout:10000,maximumAge:60000,enableHighAccuracy:false});
};
render();$('rendererStatus').textContent=text().loading;
water=await createWater($('water'),()=>{if(!companionJourney&&state.releases.some(r=>r.habitat===habitat))$('blessing').textContent=text().gathering;},arrival);
water.pause(paused);
render();document.body.dataset.ready='true';
window.addEventListener('pagehide',()=>{water.dispose();void music.dispose();},{once:true});
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
