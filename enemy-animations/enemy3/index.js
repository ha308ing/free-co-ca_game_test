/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);
const numberOfEnemies = 1200;
const enemiesArray = [];

let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "./enemy3.png";
    this.speed = 1 + Math.random() * 4;
    this.spriteWidth = 218;
    this.spriteHeight = 177;
    this.width = this.spriteWidth * 0.5;
    this.height = this.spriteHeight * 0.5;
    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    this.angle = Math.random() * 500;
    this.angleSpeed = Math.random() * 1.5 + 0.5;
    // this.amplitude = 50 + Math.random() * 150;
  }

  update() {
    this.x =
      (CANVAS_WIDTH / 2) * Math.sin((this.angle * Math.PI) / 90) +
      (CANVAS_WIDTH - this.width) / 2;
    this.y =
      // (CANVAS_HEIGHT / 2) * Math.cos((this.angle * Math.PI) / 90) +
      // (CANVAS_HEIGHT / 2) * Math.cos((this.angle * Math.PI) / 180) +
      // (CANVAS_HEIGHT / 2) * Math.cos((this.angle * Math.PI) / 270) +
      (CANVAS_HEIGHT / 2) * Math.cos((this.angle * Math.PI) / 360) +
      (CANVAS_HEIGHT - this.height) / 2;

    this.angle += this.angleSpeed;

    if (this.x < -this.width) {
      this.x = CANVAS_WIDTH;
    }
    // this.y += Math.random() * 3 - 1.5;
    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? (this.frame = 0) : this.frame++;
    }
  }

  draw() {
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

for (let i = 0; i < numberOfEnemies; i++) {
  enemiesArray.push(new Enemy());
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemiesArray.forEach(e => {
    e.update();
    e.draw();
  });
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
