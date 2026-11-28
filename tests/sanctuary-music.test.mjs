import test from 'node:test';
import assert from 'node:assert/strict';
import { Music } from '../prototype/sanctuary/music.mjs';

test('optional arrival audio stays bounded and mute stops queued notes as well as the music',async()=>{
  const nodes=[];
  class Audio {
    state='suspended';currentTime=0;destination={};
    async resume(){this.state='running';}
    async suspend(){this.state='suspended';}
    async close(){this.state='closed';}
    createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
    createOscillator(){const node={frequency:{value:0},stops:[],connect(){},disconnect(){},start(){},stop(time){this.stops.push(time);}};nodes.push(node);return node;}
  }
  globalThis.window={AudioContext:Audio};globalThis.document={hidden:false};
  const music=new Music();
  try{
    music.cue(3);assert.equal(nodes.length,0);
    await music.enable();music.cue(3);assert.ok(nodes.length>2);
    for(let i=0;i<20;i++)music.cue(3);
    assert.ok(nodes.length<=12,'rapid replay cannot create unlimited overlapping voices');
    await music.mute();assert.equal(music.voices.size,0);assert.ok(nodes.every(n=>n.stops.at(-1)===undefined),'mute stops scheduled future voices immediately');
    const before=nodes.length;music.cue(3);assert.equal(nodes.length,before);assert.equal(music.context.state,'suspended');
  }finally{await music.dispose();delete globalThis.window;delete globalThis.document;}
});
