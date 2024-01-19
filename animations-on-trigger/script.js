/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 700);
const ctx = canvas.getContext("2d");
let canvasPosition = canvas.getBoundingClientRect();

ctx.fillStyle = "white";

const explosions = [];

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth * 0.5;
    this.height = this.spriteHeight * 0.5;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "./boom.png";
    this.frame = 0;
    this.timer = 0;
    // random angle from 0 to 360 deg (2PI)
    this.angle = Math.random() * 6.28;
    this.sound = new Audio();
    this.sound.src = "./boom.wav";
  }

  update() {
    if (this.timer === 0) {
      this.sound.play();
    }
    this.timer++;
    if (this.timer % 7 === 0) {
      this.frame++;
    }
  }

  draw() {
    // save current state of the canvas
    // the following changes affect only next draw call
    ctx.save();

    // change coornates origin (translate rotation center)
    ctx.translate(this.x, this.y);

    // rotate entire canvas context
    ctx.rotate(this.angle);

    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.width * 0.5, // this.x is captured in translate,
      // this.x,
      0 - this.height * 0.5, // this.y is captured in translate,
      // this.y,
      this.width,
      this.height
    );

    // restore canvas context to the original save point
    ctx.restore();
  }
}

window.addEventListener("click", event => {
  createAnimation(event);
});

// window.addEventListener("mousemove", event => {
//   createAnimation(event);
// });

function createAnimation(event) {
  // const x = event.layerX;
  // const y = event.layerY;
  const positionX = event.x - canvasPosition.left;
  const positionY = event.y - canvasPosition.top;
  explosions.push(new Explosion(positionX, positionY));
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].draw();
    if (explosions[i].frame > 5) {
      explosions.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvasPosition = canvas.getBoundingClientRect();
});
