/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
/** @type {HTMLCanvasElement} */
const collistionCanvas = document.getElementById("collistionCanvas");
let CANVAS_WIDTH = (canvas.width = window.innerWidth);
let CANVAS_HEIGHT = (canvas.height = window.innerHeight);

collistionCanvas.width = CANVAS_WIDTH;
collistionCanvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext("2d");
const ctxCollision = collistionCanvas.getContext("2d");

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
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color = `rgb(${this.randomColors[0]}, ${this.randomColors[1]}, ${this.randomColors[2]})`;
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
    ctxCollision.fillStyle = this.color;
    ctxCollision.fillRect(this.x, this.y, this.width, this.height);
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
  }
}

// timestamp to refer to ms not computer speed
// draw next frame after timestamp, not just when finish calcs
function animate(timestamp) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctxCollision.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // time in ms between frames
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    // add new raven every timeToNextRaven
    ravens.push(new Raven());
    timeToNextRaven = 0;
    // larger ravens to front
    ravens.sort((a, b) => a.height - b.height);
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

window.addEventListener("click", e => {
  // get data of clicked pixel {data: [red, green, blue, opacity(0..255)], height, width}
  const detectPixelColor = ctxCollision.getImageData(e.x, e.y, 1, 1);
  const pixelColor = detectPixelColor.data;
  ravens.forEach(r => {
    if (
      r.randomColors[0] === pixelColor[0] &&
      r.randomColors[1] === pixelColor[1] &&
      r.randomColors[2] === pixelColor[2]
    ) {
      score++;
      r.markedForDelete = true;
    }
  });
});
