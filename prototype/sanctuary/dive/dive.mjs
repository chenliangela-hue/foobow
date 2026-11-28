import { Music } from '../music.mjs';

const strings = {
  en: {
    title: ['Beneath', 'the Lilies'], back: '← Sanctuary', soundLabel: 'Sound', sound: 'Sound off', soundOn: 'Sound on',
    intro: 'Release a koi into a quiet virtual pond and see the water through its eyes.',
    release: 'Release the koi', fallback: 'Play the illustrated pond', surface: 'Surface', koi: 'Koi view',
    pause: 'Pause motion', resume: 'Resume motion', loading: 'Preparing the pond…',
    pond: 'Interactive koi pond', controls: 'Pond controls', views: 'Camera view',
    guide: 'Move your pointer or touch the water to guide. With the pond focused, use arrow keys.',
    observe: 'Follow the koi as it swims. Switch to Surface to guide it again.',
    still: 'Motion is paused. Resume whenever you’re ready.', guided: 'Koi guided.',
    failure: '3D graphics are unavailable on this device. You can still visit the illustrated pond.',
    audioError: 'Sound is unavailable on this device.',
  },
  zh: {
    title: ['莲叶', '之下'], back: '← 返回静心花园', soundLabel: '声音', sound: '声音已关闭', soundOn: '声音已开启',
    intro: '在虚拟池塘里放游一尾锦鲤，透过它的眼睛看看水下世界。',
    release: '放游锦鲤', fallback: '游玩绘本池塘', surface: '水面', koi: '锦鲤视角',
    pause: '暂停动画', resume: '恢复动画', loading: '正在准备池塘…',
    pond: '互动锦鲤池塘', controls: '池塘操作', views: '切换视角',
    guide: '移动鼠标或轻触水面，引导锦鲤。池塘获得焦点时，也可以使用方向键。',
    observe: '跟随锦鲤畅游。切回水面视角可以继续引导它。',
    still: '动画已暂停。准备好后可随时恢复。', guided: '已引导锦鲤。',
    failure: '此设备无法显示 3D 画面。你仍可游玩绘本池塘。',
    audioError: '此设备无法播放声音。',
  },
};

const $ = id => document.getElementById(id);
const page = document.querySelector('main');
const host = $('pond');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const music = new Music();
const directions = { ArrowUp: [0, -1], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowRight: [1, 0] };
let language = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';
let game, view = 'surface', stage = 'loading', paused = motion.matches, speaking = 'loading';

function render() {
  const text = strings[language];
  document.documentElement.lang = language === 'zh' ? 'zh-Hans' : 'en';
  document.title = `${text.title.join(language === 'zh' ? '' : ' ')} · Foobow`;
  $('title').replaceChildren(text.title[0], document.createElement('br'), text.title[1]);
  for (const id of ['back', 'intro', 'release', 'fallback', 'surface', 'koi']) $(id).textContent = text[id];
  $('language').textContent = language === 'en' ? '中文' : 'English';
  $('language').lang = language === 'en' ? 'zh-Hans' : 'en';
  $('back').href = $('fallback').href = language === 'zh' ? '../?lang=zh' : '../';
  $('sound').textContent = music.enabled ? text.soundOn : text.sound;
  $('sound').setAttribute('aria-label', text.soundLabel);
  $('sound').setAttribute('aria-pressed', String(music.enabled));
  $('pause').textContent = paused ? text.resume : text.pause;
  $('surface').setAttribute('aria-pressed', String(view === 'surface'));
  $('koi').setAttribute('aria-pressed', String(view === 'koi'));
  $('instructions').textContent = view === 'surface' ? text.guide : text.observe;
  $('controls').setAttribute('aria-label', text.controls);
  document.querySelector('.views').setAttribute('aria-label', text.views);
  host.setAttribute('aria-label', text.pond);
  host.tabIndex = view === 'surface' ? 0 : -1;
  host.dataset.view = view;
  host.hidden = stage !== 'playing';
  $('controls').hidden = stage !== 'playing';
  document.querySelector('.entry').hidden = stage === 'playing';
  $('release').hidden = stage === 'failure';
  $('release').disabled = stage !== 'ready';
  $('fallback').hidden = stage !== 'failure';
  page.dataset.stage = stage === 'playing' ? stage : 'entry';
  announce(speaking);
}

function announce(message = '') {
  speaking = message;
  const sentence = strings[language][message] ?? '';
  if ($('status').textContent !== sentence) $('status').textContent = sentence;
}

function failure() {
  if (stage === 'failure') return;
  const inGame = stage === 'playing' || document.activeElement === $('release');
  stage = 'failure';
  game?.dispose();
  game = undefined;
  speaking = 'failure';
  render();
  if (inGame) $('fallback').focus();
}

function syncMotion() {
  game?.pause(stage !== 'playing' || paused || document.hidden);
}

function selectView(next) {
  if (view === next) return;
  view = next;
  game.selectView(next);
  speaking = paused ? 'still' : '';
  render();
  music.cue(1);
}

$('release').addEventListener('click', () => {
  stage = 'playing';
  speaking = paused ? 'still' : '';
  render();
  try {
    game.mount();
    syncMotion();
    host.focus({ preventScroll: true });
    music.cue(2);
  } catch {
    failure();
  }
});
$('surface').addEventListener('click', () => selectView('surface'));
$('koi').addEventListener('click', () => selectView('koi'));
$('pause').addEventListener('click', () => {
  paused = !paused;
  syncMotion();
  speaking = paused ? 'still' : '';
  render();
});
motion.addEventListener('change', ({ matches }) => {
  if (!matches) return;
  paused = true;
  syncMotion();
  if (stage === 'playing') speaking = 'still';
  render();
});
document.addEventListener('visibilitychange', syncMotion);

$('language').addEventListener('click', () => {
  language = language === 'en' ? 'zh' : 'en';
  const url = new URL(location.href);
  url.searchParams.set('lang', language);
  history.replaceState(null, '', url);
  render();
});
$('sound').addEventListener('click', async () => {
  $('sound').disabled = true;
  try {
    await (music.enabled ? music.mute() : music.enable());
  } catch {
    if (stage !== 'loading' && stage !== 'failure') announce('audioError');
  } finally {
    $('sound').disabled = false;
    render();
  }
});
host.addEventListener('pointerdown', event => {
  if (view !== 'surface' || !event.isPrimary || event.button !== 0) return;
  host.focus({ preventScroll: true });
  if (game.pointer(event, true)) announce('guided');
});
host.addEventListener('pointermove', event => {
  if (view !== 'surface' || !event.isPrimary || ((paused || event.pointerType !== 'mouse') && !event.buttons)) return;
  game.pointer(event, false);
});
host.addEventListener('keydown', event => {
  if (view !== 'surface' || !Object.hasOwn(directions, event.key)) return;
  event.preventDefault();
  game.keyboard(...directions[event.key]);
  announce('guided');
});

render();
try {
  const { createPond } = await import('./pond.mjs');
  const pond = await createPond(host, failure);
  if (stage === 'failure') pond.dispose();
  else {
    game = pond;
    stage = 'ready';
    speaking = '';
    render();
  }
} catch {
  failure();
}
