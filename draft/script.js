/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
let CANVAS_WIDTH = (canvas.width = window.innerWidth);
let CANVAS_HEIGHT = (canvas.height = window.innerHeight);

const ctx = canvas.getContext("2d");

let score = 0;
ctx.font = "50px Impact";

// accumulate time values between frames
let timeToNextRaven = 0;

// time to when timeToNextRaven accumulated to ravenInterval value
// trigger next raven and reset, timeToNextRaven to start again
let ravenInterval = 500;

// timestamp value from previous value
let lastTime = 0;

let ravens = [];
let gameFrame = 0;

class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = 0.4 + 0.6 * Math.random();
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.image = new Image();
    this.image.src = "./raven.png";
    this.x = CANVAS_WIDTH;
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    // horizontal speed
    this.directionX = Math.random() * 5 + 3;
    // vertical speed
    this.directionY = Math.random() * 5 - 2.5;
    this.frame = 0;
    this.maxFrame = 4;
    this.markedForDelete = false;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 100 + 100;
  }

  update(deltaTime) {
    if (this.y < 0 || this.y > CANVAS_HEIGHT - this.height)
      this.directionY *= -1;

    this.x -= this.directionX;
    this.y += this.directionY;

    if (this.x < -this.width) {
      this.markedForDelete = true;
    }

    this.timeSinceFlap += deltaTime;

    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) {
        this.frame = 0;
      } else {
        this.frame++;
        this.timeSinceFlap = 0;
      }
    }
  }

  draw() {
    // if (this.frame % 6 === 0) {
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
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

// timestamp to refer to ms not computer speed
// draw next frame after timestamp, not just when finish calcs
function animate(timestamp) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // time in ms between frames
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    // add new raven every timeToNextRaven
    ravens.push(new Raven());
    timeToNextRaven = 0;
  }
  drawScore();
  [...ravens].forEach(raven => {
    raven.update(deltaTime);
    raven.draw();
  });

  ravens = ravens.filter(r => !r.markedForDelete);
  console.log(ravens);

  requestAnimationFrame(animate);
}

animate(0);

function drawScore() {
  const textCoord = { x: 55, y: 80 };
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, textCoord.x - 3, textCoord.y - 3);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, textCoord.x, textCoord.y);
}

window.addEventListener("click", event => {});
