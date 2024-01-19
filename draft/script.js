/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
let CANVAS_WIDTH = (canvas.width = window.innerWidth);
let CANVAS_HEIGHT = (canvas.height = window.innerHeight);

const ctx = canvas.getContext("2d");

let ravens = [];
let gameFrame = 0;

class Raven {
  constructor() {
    this.width = 271;
    this.height = 194;
    this.image = new Image();
    this.image.src = "./raven.png";
    this.x = CANVAS_WIDTH;
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    // horizontal speed
    this.directionX = Math.random() * 5 + 3;
    // vertical speed
    this.directionY = Math.random() * 5 - 2.5;
    this.frame = 0;
    this.numberOfSpites = 5;
    this.staggerFrames = 5;
  }

  update() {
    this.x -= this.directionX;
    if (gameFrame % this.staggerFrames == 0) {
      this.frame < this.numberOfSpites ? this.frame++ : (this.frame = 0);
    }
  }

  draw() {
    // if (this.frame % 6 === 0) {
    ctx.drawImage(
      this.image,
      this.width * this.frame,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    // }
    // ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

const raven = new Raven();

function animate(timestamp) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gameFrame++;
  raven.update();
  raven.draw();
  requestAnimationFrame(animate);
}

animate();
