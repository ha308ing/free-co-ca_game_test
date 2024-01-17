const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const playerImage = new Image();
playerImage.src = "./shadow_dog.png";

const spriteWidth = 575;
const spriteHeight = 523;

const playerStateControl = document.querySelector("select[name=playerState]");
let playerState = playerStateControl.value;

playerStateControl.addEventListener("change", e => {
  playerState = e.target.value;
});

let gameFrame = 0;
const staggerFrames = 6;

const spriteAnimations = [];
const animationStates = [
  { name: "idle", frames: 7 },
  { name: "jump", frames: 7 },
  { name: "fall", frames: 7 },
  { name: "run", frames: 9 },
  { name: "dizzy", frames: 11 },
  { name: "sit", frames: 5 },
  { name: "roll", frames: 7 },
  { name: "bite", frames: 7 },
  { name: "ko", frames: 12 },
  { name: "gotHit", frames: 4 },
];

animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
  };

  let positionY = spriteHeight * index;
  for (let j = 0; j < state.frames; j++) {
    let positionX = spriteWidth * j;
    frames.loc.push({ x: positionX, y: positionY });
  }

  spriteAnimations[state.name] = frames;
});

console.log(spriteAnimations);

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  let position =
    Math.floor(gameFrame / staggerFrames) %
    spriteAnimations[playerState].loc.length;

  let frameX = spriteAnimations[playerState].loc[position].x;
  let frameY = spriteAnimations[playerState].loc[position].y;

  ctx.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );

  gameFrame++;

  requestAnimationFrame(animate);
}

animate();
