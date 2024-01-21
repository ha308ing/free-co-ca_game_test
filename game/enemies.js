class Enemy {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.frameLimit = 5;
    this.markedToDelete = false;
  }

  update(deltaTime) {
    // sprite animation
    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
    } else {
      if (this.frameX < this.frameLimit) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
      this.frameTimer = 0;
    }

    // movement
    this.x += this.speedX - this.game.speed;
    this.y += this.speedY;

    if (this.isOutsideScreen()) {
      this.markedToDelete = true;
    }
  }

  draw(context) {
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
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

  isOutsideScreen() {
    return (
      this.x < -this.width * 2 ||
      this.y < -this.height * 2 ||
      this.x > this.game.width + this.width * 2 ||
      this.y > this.game.height + this.height * 2
    );
  }
}

export class FlyingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 60;
    this.height = 44;
    this.x = this.game.width + Math.random() * 1.9 + this.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = -1 - Math.random();
    this.frameLimit = 5;
    this.image = document.getElementById("enemy_fly");
    this.angle = 0;
    this.speedAngle = Math.random() * 0.1 + 0.1;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.speedAngle;
    this.y += Math.sin(this.angle);
  }
}

export class GroundEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 60;
    this.height = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.frameLimit = 1;
    this.speedX = 0;
    this.speedY = 0;
    this.image = document.getElementById("enemy_plant");
  }
}

export class ClimbingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.image = document.getElementById("enemy_spider");
    this.width = 120;
    this.height = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
    this.frameLimit = 5;
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.y > this.game.height - this.game.groundMargin - this.height)
      this.speedY *= -1;
  }
  draw(context) {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.width * 0.5, 0);
    context.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.5);
    context.stroke();
  }
}
