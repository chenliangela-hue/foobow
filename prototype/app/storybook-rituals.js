(function setupStorybookRitualScenes() {
  const layers = [
    "story-sky",
    "story-sun",
    "story-hill story-hill-far",
    "story-hill story-hill-near",
    "story-water",
    "story-path",
    "story-place",
    "story-character",
    "story-prop",
    "story-effect story-effect-one",
    "story-effect story-effect-two"
  ];

  function buildScene(ritual, extraClass = "") {
    const scene = document.createElement("span");
    scene.className = `ritual-story-scene scene-${ritual} ${extraClass}`.trim();
    scene.setAttribute("aria-hidden", "true");
    scene.innerHTML = layers.map((classes) => `<span class="${classes}"></span>`).join("");
    return scene;
  }

  const featured = document.querySelector(".quiet-feature-art");
  if (featured) featured.replaceChildren(buildScene("breathe", "scene-feature"));

  document.querySelectorAll("#quietMomentsHub .quiet-game").forEach((card) => {
    const art = card.querySelector(".quiet-game-art");
    if (art) art.replaceWith(buildScene(card.dataset.playRitual));
  });

  document.querySelectorAll(".quick-ritual-card").forEach((card) => {
    const art = card.querySelector(".quick-ritual-icon");
    if (art) art.replaceWith(buildScene(card.dataset.quickRitual, "scene-quick"));
  });

  const pond = document.getElementById("gratitudePond");
  if (pond && !pond.querySelector(".storybook-memory-path")) {
    const bank = document.createElement("span");
    bank.className = "storybook-garden-bank";
    bank.setAttribute("aria-hidden", "true");

    const guide = document.createElement("span");
    guide.className = "storybook-garden-guide";
    guide.setAttribute("aria-hidden", "true");
    guide.innerHTML = '<span class="guide-head"></span><span class="guide-body"></span><span class="guide-arm"></span>';

    const path = document.createElement("span");
    path.className = "storybook-memory-path";
    path.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 3; index += 1) {
      const stone = document.createElement("span");
      stone.className = "storybook-memory-stone";
      stone.innerHTML = '<span class="memory-flower"></span>';
      path.append(stone);
    }
    pond.prepend(bank, guide, path);
  }
})();
