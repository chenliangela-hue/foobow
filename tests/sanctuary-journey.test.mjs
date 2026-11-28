import test from 'node:test';
import assert from 'node:assert/strict';
import { beginJourney, arrive, pauseJourney, steerCreature, spine } from '../prototype/sanctuary/journey.mjs';

test('a companion journey has three ordered arrivals and no repeat completion', () => {
  const start = beginJourney({id:'friend-one',species:'koi',habitat:'pond'});
  assert.equal(start.step,0);
  assert.equal(arrive(start,2),start);
  const paused=pauseJourney(start,true);
  assert.equal(arrive(paused,0),paused);
  const first=arrive(pauseJourney(paused,false),0);
  assert.equal(first.step,1);
  assert.equal(arrive(first,0),first);
  const ending=arrive(arrive(first,1),2);
  assert.equal(ending.status,'completed');
  assert.equal(ending.step,3);
  assert.equal(arrive(ending,2),ending);
  assert.equal('reward' in ending,false);
});

test('steering arrives smoothly, separates neighbours and remains bounded after a long frame', () => {
  let fish={id:'a',x:.3,y:.5,vx:0,vy:0,angle:0,seed:0,species:'koi'};
  const target={x:.7,y:.65};
  for(let i=0;i<600;i++)fish={...fish,...steerCreature(fish,[fish],target,1/60,900,700)};
  assert.ok(Math.hypot(fish.x-target.x,fish.y-target.y)<.025);
  assert.ok(Math.hypot(fish.vx,fish.vy)<15);
  const overlap={...fish,id:'b',seed:1};
  const a=steerCreature(fish,[fish,overlap],target,1000,900,700);
  const b=steerCreature(overlap,[fish,overlap],target,1000,900,700);
  assert.notEqual(a.vx,b.vx);
  assert.ok(a.x>=.18&&a.x<=.85&&a.y>=.35&&a.y<=.79);
  assert.deepEqual(steerCreature(fish,[fish],target,0,900,700),fish);
});

test('mesh spine keeps the head steady and bends the tail; reduced motion is still', () => {
  const points=spine(1,0,14);
  assert.equal(points.length,17);
  assert.equal(points.at(-1).y,0);
  assert.notEqual(points[0].y,0);
  assert.ok(Math.abs(points[0].y)<=14);
  assert.ok(spine(1,0,0).every(p=>p.y===0));
});

test('a fish turns gradually rather than flipping when its target crosses behind it', () => {
  const fish={id:'turning',x:.6,y:.6,vx:-80,vy:0,angle:0,seed:0,species:'koi'};
  const next=steerCreature(fish,[fish],{x:.2,y:.6},.05,900,700);
  assert.ok(Math.abs(next.angle-fish.angle)<=.18);
  assert.ok(next.x>.6,'velocity follows the turning body instead of swimming backwards');
});
