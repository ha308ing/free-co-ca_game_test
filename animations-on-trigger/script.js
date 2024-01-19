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
    this.x = x;
    this.y = y;
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth * 0.5;
    this.height = this.spriteHeight * 0.5;
    this.image = new Image();
    this.image.src = "./boom.png";
    this.frame = 0;
  }

  update() {
    this.frame++;
  }

  draw() {
    ctx.drawImage(
      this.image,
      (this.frame % 6) * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
}

window.addEventListener("click", event => {
  // const x = event.layerX;
  // const y = event.layerY;
  const positionX = event.x - canvasPosition.left;
  const positionY = event.y - canvasPosition.top;
  const e = new Explosion(positionX, positionY);
  e.draw();
});
const e = new Explosion(10, 10);
