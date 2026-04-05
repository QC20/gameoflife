// Create canvas and context
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

// Get heights of header and footer
const headerHeight = document.querySelector("header").offsetHeight;
const footerHeight = document.querySelector("footer").offsetHeight;

// Set canvas width and height
const canvasDimensions = {
  width: window.innerWidth,
  height: window.innerHeight - headerHeight - footerHeight
};

canvas.width = canvasDimensions.width;
canvas.height = canvasDimensions.height;

// Append canvas to main element
document.querySelector("main").appendChild(canvas);

// Rules object
const rules = {
  min: 2,
  max: 3,
  cells: 8
};

// World object
const world = {
  height: 0,
  size: 0,
  width: 0,
  asum: [],
  grid: []
};

let animationId = null;
let running = false;

// ── Init / Restart ──────────────────────────────────────────────────────────

function initWorld(cellSize) {
  rules.cells = cellSize;

  world.height = Math.floor(canvasDimensions.height / rules.cells);
  world.size   = Math.floor(canvasDimensions.height / world.height);
  world.width  = Math.floor(canvasDimensions.width  / world.size);

  world.grid = [];
  world.asum = [];

  for (let i = 0; i < world.width; i++) {
    world.grid[i] = new Array(world.height);
    world.asum[i] = new Array(world.height).fill(0);
    for (let j = 0; j < world.height; j++) {
      const life =
        i > 0 && j > 0 && i < world.width - 1 && j < world.height - 1 &&
        Math.random() > 0.8 ? 1 : 0;
      world.grid[i][j] = new Cell(
        i * world.size,
        j * world.size,
        world.size,
        life
      );
    }
  }
}

// ── Cell class ───────────────────────────────────────────────────────────────

class Cell {
  constructor(x_, y_, s, l) {
    this.x    = x_;
    this.y    = y_;
    this.size = s;
    this.life = l;
  }

  rules(sum) {
    if (this.life === 1) {
      this.life = sum >= rules.min && sum <= rules.max ? 1 : 0;
    } else {
      if (sum === rules.max) this.life = 1;
    }
  }

  show() {
    context.fillStyle = this.life === 1 ? "white" : "black";
    context.beginPath();
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

// ── Draw loop ────────────────────────────────────────────────────────────────

function draw() {
  for (let ix = 1; ix < world.width - 1; ix++) {
    for (let iy = 1; iy < world.height - 1; iy++) {
      world.asum[ix][iy] =
        world.grid[ix - 1][iy - 1].life +
        world.grid[ix - 1][iy    ].life +
        world.grid[ix - 1][iy + 1].life +
        world.grid[ix    ][iy - 1].life +
        world.grid[ix    ][iy + 1].life +
        world.grid[ix + 1][iy - 1].life +
        world.grid[ix + 1][iy    ].life +
        world.grid[ix + 1][iy + 1].life;
    }
  }

  for (let i = 0; i < world.width; i++) {
    for (let j = 0; j < world.height; j++) {
      world.grid[i][j].show();
      if (i > 0 && j > 0 && i < world.width - 1 && j < world.height - 1) {
        world.grid[i][j].rules(world.asum[i][j]);
      }
    }
  }
}

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function (callback) { window.setTimeout(callback, 1000 / 60); }
  );
})();

function loop() {
  if (!running) return;
  setTimeout(function () {
    if (!running) return;
    window.requestAnimFrame(loop);
    context.fillStyle = "rgba(30,30,30,1)";
    context.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
    draw();
  }, 1000 / 60);
}

function startSimulation(cellSize) {
  running = false; // stop current loop
  context.fillStyle = "rgba(30,30,30,1)";
  context.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
  initWorld(cellSize);
  running = true;
  loop();
}

// ── Control panel ────────────────────────────────────────────────────────────

function buildControls() {
  const panel = document.createElement("div");
  panel.id = "controls";

  // Label + value readout
  const label = document.createElement("label");
  label.htmlFor = "res-slider";
  label.textContent = "Cell size";

  const valueDisplay = document.createElement("span");
  valueDisplay.id = "res-value";
  valueDisplay.textContent = rules.cells + "px";

  // Slider: 2px (dense) to 48px (chunky)
  const slider = document.createElement("input");
  slider.type  = "range";
  slider.id    = "res-slider";
  slider.min   = "2";
  slider.max   = "48";
  slider.step  = "1";
  slider.value = String(rules.cells);

  slider.addEventListener("input", () => {
    valueDisplay.textContent = slider.value + "px";
  });

  // Board-size hint
  const hint = document.createElement("span");
  hint.id = "res-hint";

  function updateHint(val) {
    const cols = Math.floor(canvasDimensions.width  / val);
    const rows = Math.floor(canvasDimensions.height / val);
    hint.textContent = cols + " × " + rows + " cells";
  }
  updateHint(rules.cells);

  slider.addEventListener("input", () => {
    updateHint(Number(slider.value));
  });

  // Restart button
  const btn = document.createElement("button");
  btn.id          = "restart-btn";
  btn.textContent = "Restart";

  btn.addEventListener("click", () => {
    updateHint(Number(slider.value));
    startSimulation(Number(slider.value));
  });

  // Keyboard shortcut: R key
  window.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") {
      updateHint(Number(slider.value));
      startSimulation(Number(slider.value));
    }
  });

  // Assemble
  const row = document.createElement("div");
  row.className = "ctrl-row";
  row.appendChild(label);
  row.appendChild(slider);
  row.appendChild(valueDisplay);

  panel.appendChild(row);
  panel.appendChild(hint);
  panel.appendChild(btn);

  document.body.appendChild(panel);
}

// ── Resize ───────────────────────────────────────────────────────────────────

window.addEventListener("resize", function () {
  canvasDimensions.width  = canvas.width  = window.innerWidth;
  canvasDimensions.height = canvas.height =
    window.innerHeight - headerHeight - footerHeight;
  context.fillStyle = "rgba(30,30,30,1)";
  context.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
});

// ── Boot ─────────────────────────────────────────────────────────────────────

buildControls();
startSimulation(rules.cells);
