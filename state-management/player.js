import {
  StandingLeft,
  StandingRight,
  SittingLeft,
  SittingRight,
  RunningLeft,
  RunningRight,
  JumpingLeft,
  JumpingRight,
} from "./state.js";

export class Player {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.states = [
      new StandingLeft(this),
      new StandingRight(this),
      new SittingLeft(this),
      new SittingRight(this),
      new RunningLeft(this),
      new RunningRight(this),
      new JumpingLeft(this),
      new JumpingRight(this),
    ];
    this.currentState = this.states[1];
    this.image = document.getElementById("dogImage");
    this.width = 200;
    this.height = 181.83;
    this.x = this.gameWidth * 0.5 - this.width * 0.5;
    this.y = this.gameHeight - this.height;
    this.frameX = 0;
    this.frameY = 0;
    this.frameMax = 6;
    this.speedX = 0;
    this.speedY = 0;
    this.weight = 0.5;
    this.speed = 0;
    this.maxSpeed = 10;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(input, deltaTime) {
    this.currentState.handleInput(input);

    // horizontal movement
    this.x += this.speed;
    if (this.x >= this.gameWidth - this.width)
      this.x = this.gameWidth - this.width;
    if (this.x <= 0) this.x = 0;

    // vertical movement
    this.y += this.speedY;
    console.log(this.speedY);

    if (!this.onGround()) {
      // when on air add weight
      this.speedY += this.weight;
    } else {
      this.speedY = 0;
    }

    if (this.y > this.gameHeight - this.height)
      this.y = this.gameHeight - this.height;
    if (this.y <= 0) this.y = 0;

    // sprite animation
    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
    } else {
      if (this.frameX < this.frameMax - 1) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
      this.frameTimer = 0;
    }
  }

  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  onGround() {
    return this.y >= this.gameHeight - this.height;
  }
}
