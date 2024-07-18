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

// Rules object, you can change here for personalization
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

// Set world
world.height = Math.floor(canvasDimensions.height / rules.cells);
world.size = Math.floor(canvasDimensions.height / world.height);
world.width = Math.floor(canvasDimensions.width / world.size);


console.log(world.height, world.width);

let life = 0;

class Cell {
  constructor(x_, y_, s, l) {
    this.x = x_;
    this.y = y_;
    this.size = s;
    this.life = l;
  }

  rules(sum) {
    if (this.life === 1) {
      this.life = sum >= rules.min && sum <= rules.max ? 1 : 0;
    } else {
      if (sum === rules.max) {
        this.life = 1;
      }
    }
  }

  show() {
    context.fillStyle = this.life === 1 ? "white" : "black";
    context.beginPath();
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

for (let i = 0; i < world.width; i++) {
  world.grid[i] = new Array(world.height);
  world.asum[i] = new Array(world.height);
  for (let j = 0; j < world.height; j++) {
    life = i > 0 && j > 0 && i < world.width && j < world.height && Math.random() > 0.8 ? 1 : 0;
    world.grid[i][j] = new Cell(i * world.size, j * world.size, world.size, life);
  }
}

function draw() {
  for (let ix = 1; ix < world.width - 1; ix++) {
    for (let iy = 1; iy < world.height - 1; iy++) {
      const sum =
        world.grid[ix - 1][iy - 1].life +
        world.grid[ix - 1][iy].life +
        world.grid[ix - 1][iy + 1].life +
        world.grid[ix][iy - 1].life +
        world.grid[ix][iy + 1].life +
        world.grid[ix + 1][iy - 1].life +
        world.grid[ix + 1][iy].life +
        world.grid[ix + 1][iy + 1].life;

      world.asum[ix][iy] = sum;
    }
  }

  for (let i = 0; i < world.width; i++) {
    for (let j = 0; j < world.height; j++) {
      world.grid[i][j].show();
      if (i > 0 && j > 0 && i < world.width && j < world.height) {
        world.grid[i][j].rules(world.asum[i][j]);
      }
    }
  }
}

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function loop() {
  setTimeout(function () {
    window.requestAnimFrame(loop);
    context.fillStyle = "rgba(30,30,30,1)";
    context.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
    draw();
  }, 1000 / 60);
}

window.addEventListener("resize", function () {
  canvasDimensions.width = canvas.width = window.innerWidth;
  canvasDimensions.height = canvas.height = window.innerHeight - headerHeight - footerHeight;
  context.fillStyle = "rgba(30,30,30,1)";
  context.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
});

loop();
