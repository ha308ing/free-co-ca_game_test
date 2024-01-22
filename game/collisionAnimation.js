export class CollisionAnimation {
  constructor(game, x, y) {
    this.game = game;
    this.image = document.getElementById("boom");
    this.spriteWidth = 100;
    this.spriteHeight = 90;
    this.sizeModifier = Math.random() + 0.5;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    this.markedToDelete = false;
    this.fps = Math.random() * 10 + 15;
    this.frameInterval = 1000 / this.fps;
    this.frameLimit = 4;
    this.frameTimer = 0;
    this.frameX = 0;
  }

  update(deltaTime) {
    this.x -= this.game.speed;
    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
    } else {
      if (this.frameX < this.frameLimit) {
        this.frameX++;
      } else {
        this.frameX = 0;
        this.markedToDelete = true;
      }
      this.frameTimer = 0;
    }
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
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
