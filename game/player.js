import { Sitting, Running, Jumping, Falling } from "./playerStates.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.image = document.getElementById("player");
    this.x = 100;
    this.y = this.game.height - this.height;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.frameLimit = 6;
    this.frameX = 0;
    this.frameY = 0;
    this.speed = 0;
    this.speedY = 0;
    this.weight = 1;
    this.maxSpeed = 10;
    this.states = [
      new Sitting(this),
      new Running(this),
      new Jumping(this),
      new Falling(this),
    ];
    this.currentState = this.states[0];
    this.currentState.enter();
  }

  update(input, deltaTime) {
    this.currentState.handleInput(input);
    // horizontal movement
    this.x += this.speed;
    if (input.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;

    const rightBoundary = this.game.width - this.width;
    const leftBoundary = 0;
    if (this.x > rightBoundary) this.x = rightBoundary;
    if (this.x < leftBoundary) this.x = leftBoundary;

    // vertical movement
    this.y += this.speedY;
    if (!this.onGround()) {
      this.speedY += this.weight;
    } else {
      this.speedY = 0;
    }

    // sprite animation
    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
    } else {
      this.frameTimer = 0;
      if (this.frameX < this.frameLimit) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
    }
  }

  onGround() {
    return this.y >= this.game.height - this.height;
  }

  draw(context) {
    // context.fillRect(this.x, this.y, this.width, this.height);
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

  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }
}
