// Original five-note motif, synthesized locally. No recordings or external services.
export class Music {
  context = null; timer = null; enabled = false; step = 0; generation = 0; voices = new Set();
  async enable() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw Error('Audio unavailable');
    const generation=++this.generation;
    this.context ||= new Audio();
    await this.context.resume();
    if(generation!==this.generation){await this.context.suspend();return;}
    if (this.context.state !== 'running') throw Error('Audio suspended');
    this.enabled = true;
    this.play();
    this.timer = setInterval(() => this.play(), 2600);
  }
  play() {
    if (!this.enabled || document.hidden || this.context.state !== 'running' || this.voices.size>=12) return;
    const ctx = this.context, now = ctx.currentTime;
    for (const [offset, volume] of [[0, .035], [12, .009]]) {
      const oscillator = ctx.createOscillator(), gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 220 * 2 ** (([0, 7, 12, 4, 9, 7, 4, 0][this.step % 8] + offset) / 12);
      gain.gain.setValueAtTime(0, now);gain.gain.linearRampToValueAtTime(volume, now + .12);gain.gain.exponentialRampToValueAtTime(.0001, now + 3.5);
      oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start(now);oscillator.stop(now + 3.6);
      this.voices.add(oscillator);oscillator.onended = () => { this.voices.delete(oscillator);oscillator.disconnect();gain.disconnect(); };
    }
    this.step++;
  }
  cue(stage) {
    if(!this.enabled||document.hidden||this.context?.state!=='running'||this.voices.size>9)return;
    const now=this.context.currentTime;
    for(let i=0;i<(stage===3?3:2);i++){
      const oscillator=this.context.createOscillator(),gain=this.context.createGain(),start=now+i*.14;
      oscillator.type='sine';oscillator.frequency.value=[440,554.37,659.25][i];
      gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.027,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+1.1);
      oscillator.connect(gain);gain.connect(this.context.destination);this.voices.add(oscillator);
      oscillator.onended=()=>{this.voices.delete(oscillator);oscillator.disconnect();gain.disconnect();};oscillator.start(start);oscillator.stop(start+1.2);
    }
  }
  async mute() { this.generation++;this.enabled = false;clearInterval(this.timer);this.timer = null;for(const voice of this.voices){try{voice.stop();}catch{/* Already ended. */}}this.voices.clear();if (this.context && this.context.state !== 'closed') await this.context.suspend(); }
  async dispose() { await this.mute();if (this.context && this.context.state !== 'closed') await this.context.close(); }
}
