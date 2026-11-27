import { canPlace, mosaicPieces, rotate, waterPath } from './quiet-games-rules.mjs';

const dialog = document.querySelector('#quietPuzzle');
const title = dialog.querySelector('h2');
const instructions = dialog.querySelector('#puzzleInstructions');
const status = dialog.querySelector('[role="status"]');
const board = dialog.querySelector('.puzzle-board');
const palette = dialog.querySelector('.puzzle-palette');
const restart = dialog.querySelector('#puzzleRestart');
const undo = dialog.querySelector('#puzzleUndo');
let current;
let replay = 0;
let attempt = 0;

function tile(label, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.addEventListener('click', action);
  return button;
}

function finish(message) {
  status.textContent = message;
  board.querySelectorAll('button').forEach(button => button.setAttribute('aria-disabled', 'true'));
}

function stream() {
  const solution = [0, 6, 12, 0, 10, 9, 3, 10, 0, 10, 12, 0, 0, 3, 9, 0];
  const flip = replay % 2 === 1;
  const masks = solution.map((_, index) => {
    const mirroredIndex = (3 - Math.floor(index / 4)) * 4 + index % 4;
    const mask = solution[flip ? mirroredIndex : index];
    const upright = flip ? (mask & 10) | ((mask & 1) << 2) | ((mask & 4) >> 2) : mask;
    return index % 2 ? rotate(rotate(upright)) : rotate(upright);
  });
  const source = flip ? 8 : 4;
  const outlet = source + 3;
  let turns = 0;
  let complete = false;
  const labels = ['north', 'east', 'south', 'west'];
  const buttons = masks.map((mask, index) => {
    const button = tile('Channel', () => {
      if (complete) return;
      masks[index] = rotate(masks[index]);
      turns += 1;
      draw();
    });
    button.disabled = !mask;
    if (index === source) button.dataset.edge = 'spring';
    if (index === outlet) button.dataset.edge = 'pond';
    for (const direction of labels) {
      const arm = document.createElement('span');
      arm.className = direction;
      arm.setAttribute('aria-hidden', 'true');
      button.append(arm);
    }
    return button;
  });
  function draw() {
    const wet = waterPath(masks, 4, source);
    buttons.forEach((button, index) => {
      const openings = labels.filter((_, bit) => masks[index] & (1 << bit));
      const marker = index === source ? 'Spring, ' : index === outlet ? 'Pond, ' : '';
      button.setAttribute('aria-label', masks[index] ? marker + openings.join(' and ') : 'Stone');
      button.classList.toggle('wet', wet.has(index));
      [...button.children].forEach((arm, bit) => { arm.hidden = !(masks[index] & (1 << bit)); });
    });
    complete = wet.has(outlet) && Boolean(masks[outlet] & 2);
    status.textContent = turns ? `${turns} turns` : 'The spring is on the left.';
    if (complete) finish(`The pond is flowing. Solved in ${turns} turns.`);
  }
  board.append(...buttons);
  draw();
}

function herbarium() {
  const plants = [['☘', 'Clover'], ['✿', 'Zinnia'], ['❋', 'Aster'], ['◈', 'Iris'], ['❧', 'Fern'], ['✾', 'Daisy']];
  const deck = [...plants, ...plants];
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  const thisAttempt = attempt;
  const matched = new Set();
  let open = [];
  let turns = 0;
  const buttons = deck.map(([symbol, name], index) => tile(`Covered tile ${index + 1}`, () => {
    if (matched.has(index) || open.includes(index) || open.length === 2) return;
    open.push(index);
    draw();
    if (open.length < 2) return;
    turns += 1;
    const [first, second] = open;
    if (deck[first] === deck[second]) {
      matched.add(first);
      matched.add(second);
      open = [];
      draw();
      if (matched.size === deck.length) finish(`Collection complete. Six pairs in ${turns} turns.`);
    } else {
      status.textContent = `${deck[first][1]} and ${name}. Try another pair.`;
      window.setTimeout(() => {
        if (attempt !== thisAttempt) return;
        open = [];
        draw();
      }, 950);
    }
  }));
  function draw() {
    buttons.forEach((button, index) => {
      const visible = matched.has(index) || open.includes(index);
      button.textContent = visible ? deck[index][0] : '✦';
      button.setAttribute('aria-label', visible ? `${deck[index][1]}, tile ${index + 1}` : `Covered tile ${index + 1}`);
      button.setAttribute('aria-disabled', String(matched.has(index)));
      button.classList.toggle('revealed', visible);
      button.classList.toggle('matched', matched.has(index));
    });
    status.textContent = open.length === 1 ? `${deck[open[0]][1]} revealed.` : `${matched.size / 2} of 6 pairs · ${turns} turns`;
  }
  board.append(...buttons);
  draw();
}

function transpose(piece) {
  const swapped = piece.map(([row, column]) => [column, row]);
  swapped.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const [top, leftmost] = swapped[0];
  return swapped.map(([row, column]) => [row - top, column - leftmost]);
}

function mosaic() {
  const names = ['Clay', 'Ochre', 'Jade', 'Indigo'];
  const cells = Array(16).fill('');
  const placed = [];
  const pieces = replay % 2 ? mosaicPieces.map(transpose) : mosaicPieces;
  let selected = 0;
  const buttons = cells.map((_, index) => tile('Empty cell', () => {
    if (selected < 0) return;
    const footprint = canPlace(cells, pieces[selected], index);
    if (!footprint.length) {
      status.textContent = 'That piece does not fit there.';
      return;
    }
    for (const cell of footprint) cells[cell] = names[selected];
    placed.push({ piece: selected, footprint });
    selected = names.findIndex((name, id) => !placed.some(entry => entry.piece === id));
    draw();
    if (placed.length === pieces.length) finish('The mosaic is complete.');
  }));
  const choices = names.map((name, index) => {
    const button = tile(name, () => { selected = index; draw(); });
    const preview = document.createElement('span');
    preview.className = 'piece-preview';
    preview.setAttribute('aria-hidden', 'true');
    const left = Math.min(...pieces[index].map(([, column]) => column));
    for (const [row, column] of pieces[index]) {
      const square = document.createElement('i');
      square.style.gridArea = `${row + 1} / ${column - left + 1}`;
      preview.append(square);
    }
    button.dataset.color = name;
    button.append(preview, name);
    return button;
  });
  function draw() {
    buttons.forEach((button, index) => {
      button.dataset.color = cells[index];
      button.removeAttribute('aria-disabled');
      button.setAttribute('aria-label', `Row ${Math.floor(index / 4) + 1}, column ${index % 4 + 1}, ${cells[index] || 'empty'}`);
    });
    choices.forEach((button, index) => {
      button.disabled = placed.some(entry => entry.piece === index);
      button.setAttribute('aria-pressed', String(selected === index));
    });
    undo.disabled = !placed.length;
    status.textContent = selected < 0 ? '' : `${placed.length} of 4 pieces placed · ${names[selected]} selected`;
  }
  undo.onclick = () => {
    const entry = placed.pop();
    for (const cell of entry.footprint) cells[cell] = '';
    selected = entry.piece;
    draw();
  };
  palette.append(...choices);
  board.append(...buttons);
  draw();
}

const games = {
  stream: ['After the Rain', 'Turn the channels to connect the spring to the pond. Water flows when two openings meet.', stream],
  herbarium: ['The Herbarium', 'Turn over two tiles at a time and find six matching pairs.', herbarium],
  mosaic: ['Courtyard Mosaic', 'Choose a piece, then choose the leftmost cell of its top row in the tray. Fit all four pieces.', mosaic],
};

function render() {
  attempt += 1;
  const [name, help, play] = games[current];
  dialog.dataset.game = current;
  title.textContent = name;
  instructions.textContent = help;
  board.replaceChildren();
  palette.replaceChildren();
  undo.hidden = current !== 'mosaic';
  undo.onclick = null;
  play();
}

document.querySelectorAll('[data-quiet-puzzle]').forEach(button => {
  button.addEventListener('click', () => {
    current = button.dataset.quietPuzzle;
    replay = 0;
    render();
    dialog.showModal();
    title.focus();
  });
  button.disabled = false;
});
restart.addEventListener('click', () => { replay += 1; render(); title.focus(); });
dialog.addEventListener('close', () => { attempt += 1; });
