class Particle {
  constructor(game) {
    this.game = game;
    this.markedToDelete = false;
  }
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95;
    if (this.size < 0.5) this.markedToDelete = true;
  }
}

export class Dust extends Particle {
  constructor(game, x, y) {
    super(game);
    this.size = Math.random() * 5 + 5;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = "rgba(0,0,0,0.2)";
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}

export class Splash extends Particle {
  constructor(game, x, y) {
    super(game);
    this.size = Math.random() * 100 + 100;
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 6 - 3;
    this.speedY = Math.random() * 2 + 2;
    this.weight = 0;
    this.image = document.getElementById("fire");
  }
  update() {
    super.update();
    this.weight += 0.1;
    this.y += this.weight;
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.drawImage(
      this.image,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size,
      this.size
    );
    context.restore();
  }
}

export class Fire extends Particle {
  constructor(game, x, y) {
    super(game);
    this.x = x;
    this.y = y;
    this.image = document.getElementById("fire");
    this.size = Math.random() * 100 + 50;
    this.speedX = 1;
    this.speedY = 1;
    this.angle = 0;
    this.speedAngle = Math.random() * 0.2 - 0.1;
  }

  update() {
    super.update();
    this.angle += this.speedAngle;
    this.x += Math.sin(this.angle * 10);
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(
      this.image,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size,
      this.size
    );
    context.restore();
  }
}
