import { test, expect } from '@playwright/test';
const url='http://127.0.0.1:4187/sanctuary/';
const key='foobow.sanctuary.prototype.v1';
test.beforeEach(async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});});
async function ready(page,showCollection=true){await page.goto(url);await expect(page.locator('body')).toHaveAttribute('data-ready','true');if(showCollection)await page.getByRole('button',{name:'Show collection',exact:true}).click();}

test('release, journal, persistence, daily visit, pause and bilingual keyboard controls',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);
  await expect(page.locator('#seeds')).toHaveText('80');
  await page.getByRole('button',{name:'Set free · Golden koi · 20 seeds',exact:true}).focus();await page.keyboard.press('Enter');
  await expect(page.locator('#seeds')).toHaveText('60');await expect(page.locator('#collectionCount')).toHaveText('1 life · 1 kind');
  await page.getByRole('button',{name:'Just swim',exact:true}).click();
  await page.getByRole('button',{name:'Life journal',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('.entry')).toHaveCount(1);await expect(page.locator('.entry')).toContainText('The water is bigger');
  await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Life journal',exact:true})).toBeFocused();
  await page.reload();await expect(page.locator('#seeds')).toHaveText('60');
  await page.getByRole('button',{name:'Show collection',exact:true}).click();
  await page.getByRole('button',{name:'A quiet visit · +10 seeds'}).click();await expect(page.locator('#seeds')).toHaveText('70');
  await page.getByRole('button',{name:'A quiet visit · +10 seeds'}).click();await expect(page.locator('#seeds')).toHaveText('70');
  await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.locator('#release')).toBeDisabled();await expect(page.getByRole('button',{name:'Gather by the lotus'})).toBeDisabled();
  await page.getByRole('button',{name:'Resume',exact:true}).click();await page.getByRole('button',{name:'Gather by the lotus'}).click();await expect(page.locator('#blessing')).toContainText('I found you');
  await page.getByRole('button',{name:'中文',exact:true}).click();await expect(page.getByRole('heading',{name:'因你善念， 生命自在。'})).toBeVisible();
  await page.screenshot({path:info.outputPath('sanctuary-zh.png'),fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});

test('habitats filter species, affordable releases are bounded and no account score changes',async({page},info)=>{
  await page.addInitScript(()=>localStorage.setItem('foobow.prototype.state.v1',JSON.stringify({karma:87})));await ready(page);
  await page.getByRole('button',{name:'Sea',exact:true}).click();await expect(page.getByRole('button',{name:/Golden koi ·/})).toHaveCount(0);
  await page.getByRole('button',{name:'Gentle ray · 50 seeds',exact:true}).click();await page.getByRole('button',{name:'Set free · Gentle ray · 50 seeds',exact:true}).click();
  await expect(page.locator('#seeds')).toHaveText('30');await expect(page.locator('#release')).toBeDisabled();await expect(page.locator('#feedback')).toContainText('Not enough');
  await page.getByRole('button',{name:'Show collection',exact:true}).click();
  await page.getByRole('button',{name:'Clownfish · 25 seeds',exact:true}).click();await page.getByRole('button',{name:'Set free · Clownfish · 25 seeds',exact:true}).click();await expect(page.locator('#seeds')).toHaveText('5');
  await page.getByRole('button',{name:'Life journal',exact:true}).click();await expect(page.locator('.entry')).toHaveCount(2);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('foobow.prototype.state.v1')).karma)).toBe(87);
  await page.screenshot({path:info.outputPath('journal.png'),fullPage:true});
});

test('corrupt saves are preserved and unavailable graphics use a playable canvas fallback',async({page})=>{
  await page.route('**/vendor/pixi.min.js',r=>r.abort());
  await page.route('**/assets/koi-painted-v2.png',r=>r.abort());
  await page.addInitScript(({key})=>localStorage.setItem(key,'broken journal'),{key});await ready(page);
  await expect(page.locator('#storageNotice')).toContainText('kept unchanged');await expect(page.locator('#rendererStatus')).toContainText('Simple illustration mode');await expect(page.locator('#water canvas')).toBeVisible();
  await page.locator('#release').click();await expect(page.locator('#seeds')).toHaveText('60');expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe('broken journal');
});

test('returning creatures reach later chapters without care deadlines',async({page})=>{
  await page.addInitScript(({key})=>localStorage.setItem(key,JSON.stringify({version:1,seeds:10,lastVisit:-1,releases:[{id:'old-friend',species:'turtle',habitat:'pond',at:Date.now()-8*86400000}]})),{key});await ready(page);
  await page.getByRole('button',{name:'Life journal',exact:true}).click();await expect(page.locator('.entry')).toContainText('A life fully at home');await expect(page.locator('[aria-current=step]')).toHaveText('A life in bloom');
  await page.getByRole('button',{name:'Close',exact:true}).click();await page.getByRole('button',{name:'Visit a companion',exact:true}).click();await expect(page.locator('#companionJourney')).toBeVisible();await expect(page.locator('#seeds')).toHaveText('10');
});

test('normal motion follows pointer, pauses and music can be muted',async({page},info)=>{
  await page.emulateMedia({reducedMotion:'no-preference'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);
  await page.locator('#release').click();await page.getByRole('button',{name:'Just swim',exact:true}).click();await page.getByRole('button',{name:'Enable music',exact:true}).click();await expect(page.getByRole('button',{name:'Mute all',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Mute all',exact:true}).click();await expect(page.getByRole('button',{name:'Enable music',exact:true})).toHaveAttribute('aria-pressed','false');
  const box=await page.locator('#water').boundingBox();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.6);await page.getByRole('button',{name:'Explore together'}).click();await expect(page.locator('#blessing')).toContainText('so much to discover');
  await page.screenshot({path:info.outputPath('sanctuary.png'),fullPage:true});expect(errors).toEqual([]);
});

test('location permission is optional and derived coordinates are never stored',async({page,context})=>{
  await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:36.6,longitude:-121.9});await ready(page);
  await page.getByRole('button',{name:'Find nearest featured place'}).click();await expect(page.locator('#locationNote')).toContainText('Monterey coast');await expect(page.getByRole('button',{name:'Sea',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.locator('#release').click();const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);expect(saved.releases[0].habitat).toBe('sea');expect(JSON.stringify(saved)).not.toMatch(/latitude|longitude|-121\.9|36\.6/);
});

test('blocked writes keep play available and a denied location leaves manual selection usable',async({page})=>{
  await page.addInitScript(()=>{
    Storage.prototype.setItem=function(){throw new DOMException('Storage blocked','QuotaExceededError');};
    Object.defineProperty(navigator,'geolocation',{value:{getCurrentPosition(_ok,error){error({code:1});}}});
  });await ready(page);
  await page.locator('#release').click();await expect(page.locator('#storageNotice')).toContainText('could not be saved');await expect(page.locator('#seeds')).toHaveText('60');
  await page.getByRole('button',{name:'Show collection',exact:true}).click();
  await page.getByRole('button',{name:'Find nearest featured place'}).click();await expect(page.locator('#locationNote')).toContainText('declined');
  await page.getByRole('button',{name:'River',exact:true}).click();await expect(page.getByRole('button',{name:'River',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('tablet, phone and enlarged text keep the journey reachable without horizontal overflow',async({page},info)=>{
  await ready(page,false);
  for(const width of [1440,768,390]){
    await page.setViewportSize({width,height:900});
    await expect(page.getByRole('link',{name:'Choose a companion',exact:true})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`).toBe(true);
    await page.screenshot({path:info.outputPath(`width-${width}.png`),fullPage:true});
    await page.getByRole('button',{name:'Show collection',exact:true}).click();await expect(page.locator('#journey')).toBeVisible();
    await page.screenshot({path:info.outputPath(`collection-${width}.png`),fullPage:true});
    await page.getByRole('button',{name:'Return to the water',exact:true}).click();
  }
  await page.addStyleTag({content:'body{font-size:200%}'});
  await page.getByRole('link',{name:'Choose a companion',exact:true}).click();await expect(page.locator('#release')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('companion journey supports keyboard arrivals, pause, personalized wishes and reward-free replay',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);
  await page.getByRole('button',{name:'Pond turtle · 45 seeds',exact:true}).click();await page.locator('#release').click();
  await expect(page.locator('#companionJourney')).toBeVisible();await expect(page.locator('#journeyProgress')).toHaveAttribute('value','0');
  await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.locator('#journeyGuide')).toBeDisabled();
  await expect(page.locator('#pauseOverlay')).toContainText('companions are safe');
  await page.getByRole('button',{name:'Resume',exact:true}).click();
  for(const [i,name] of ['Guide to the first light','Swim to the quiet shallows','Lead the way home'].entries()){
    await page.getByRole('button',{name,exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('#journeyProgress')).toHaveAttribute('value',String(i+1));
  }
  await expect(page.locator('#blessing')).toContainText('your own pace');await expect(page.locator('#seeds')).toHaveText('35');
  await page.screenshot({path:info.outputPath('journey-completed.png'),fullPage:true});
  await page.getByRole('button',{name:'Replay this journey',exact:true}).click();await expect(page.locator('#journeyProgress')).toHaveAttribute('value','0');
  await expect(page.locator('#seeds')).toHaveText('35');await expect(page.locator('#collectionCount')).toHaveText('1 life · 1 kind');
  await page.getByRole('button',{name:'Just swim',exact:true}).click();await expect(page.locator('#companionJourney')).toBeHidden();await expect(page.locator('body')).toHaveClass(/immersive/);expect(errors).toEqual([]);
});

test('normal motion completes real proximity arrivals using pointer and guided controls',async({page},info)=>{
  test.setTimeout(90000);await page.emulateMedia({reducedMotion:'no-preference'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);
  await page.locator('#release').click();await page.locator('#scene').scrollIntoViewIfNeeded();
  const box=await page.locator('#water canvas').boundingBox();
  if(info.project.name==='mobile-chromium')await page.touchscreen.tap(box.x+box.width*.68,box.y+box.height*.46);
  else await page.mouse.click(box.x+box.width*.68,box.y+box.height*.46);
  await expect(page.locator('#journeyProgress')).toHaveAttribute('value','1',{timeout:20000});
  await page.getByRole('button',{name:'Swim to the quiet shallows',exact:true}).click();await expect(page.locator('#journeyProgress')).toHaveAttribute('value','2',{timeout:20000});
  await page.getByRole('button',{name:'Lead the way home',exact:true}).click();await expect(page.locator('#journeyProgress')).toHaveAttribute('value','3',{timeout:20000});
  await expect(page.locator('#blessing')).toContainText('sunlight');await expect(page.locator('#seeds')).toHaveText('60');
  await page.screenshot({path:info.outputPath('journey-normal.png'),fullPage:true});expect(errors).toEqual([]);
});

test('a full visible school cannot block the guided companion and keeps the wallet unchanged',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.addInitScript(({key})=>localStorage.setItem(key,JSON.stringify({version:1,seeds:0,lastVisit:-1,releases:Array.from({length:30},(_,i)=>({id:`school-${i}`,species:'koi',habitat:'pond',at:Date.now()-1000}))})),{key});
  await ready(page);await page.getByRole('button',{name:'Visit a companion',exact:true}).click();
  await page.getByRole('button',{name:'Guide to the first light',exact:true}).click();await expect(page.locator('#journeyProgress')).toHaveAttribute('value','1',{timeout:20000});
  await expect(page.locator('#seeds')).toHaveText('0');await expect(page.locator('#collectionCount')).toHaveText('30 lives · 1 kind');
});

test('water-first view opens the collection deliberately and keeps keyboard guidance reachable',async({page},info)=>{
  await ready(page,false);
  await expect(page.locator('#journey')).toBeHidden();await expect(page.locator('body')).toHaveClass(/immersive/);
  await page.screenshot({path:info.outputPath('polish-opening.png'),fullPage:true});
  await page.getByRole('link',{name:'Choose a companion',exact:true}).focus();await page.keyboard.press('Enter');
  await expect(page.locator('#journey')).toBeVisible();await expect(page.getByRole('button',{name:'Pond',exact:true})).toBeFocused();
  await page.locator('#release').click();await expect(page.locator('#journey')).toBeHidden();await expect(page.locator('#journeyGuide')).toBeFocused();
  await expect(page.locator('#waypointHint')).toHaveText('Follow this light');
  await page.screenshot({path:info.outputPath('polish-playing.png'),fullPage:true});
  await page.getByRole('button',{name:'Show collection',exact:true}).click();await expect(page.locator('#journey')).toBeVisible();
  await page.getByRole('button',{name:'Return to the water',exact:true}).click();await expect(page.locator('#journeyProgress')).toHaveAttribute('value','0');
  await page.getByRole('button',{name:'Guide to the first light',exact:true}).click();await expect(page.locator('#journeyProgress')).toHaveAttribute('value','1');
});

test('a collection deep link remains usable on entry',async({page})=>{
  await page.goto(`${url}#journey`);await expect(page.locator('body')).toHaveAttribute('data-ready','true');
  await expect(page.locator('#journey')).toBeVisible();await expect(page.getByRole('button',{name:'Return to the water',exact:true})).toHaveAttribute('aria-expanded','true');
});
