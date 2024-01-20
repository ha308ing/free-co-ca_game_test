window.addEventListener("load", function () {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  canvas.width = 500;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");

  class Game {
    constructor(ctx, width, height) {
      this.enemies = [];
      this.ctx = ctx;
      this.width = width;
      this.height = height;

      // enemy appear interval (ms)
      this.enemyInterval = 1000;

      // time since enemy appeared
      this.enemyTimer = 0;

      this.enemyTypes = ["worm", "ghost", "spider"];
    }

    update(deltaTime) {
      // update less frequently for optimization
      this.enemies = this.enemies.filter(enemy => !enemy.markedForDelete);

      // if (this.enemyTimer % this.enemyInterval === 0) this.#addNewEnemy();
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
      } else {
        // increase frame time not number of frames
        // to support different refresh rate and power
        // else enemyTimer will reach enemyInterval sooner on fast computer
        // on fast computer deltaTime is low -> adds smaller deltaTime
        // on slow -> adds larger deltaTime
        // so enemyInterval would be reached on the same time
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach(e => e.update(deltaTime));
    }

    draw() {
      this.enemies.forEach(e => e.draw(this.ctx));
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    #addNewEnemy() {
      // structure {y: Worm}
      const enemyType =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      console.log(enemyType);
      let enemy;
      switch (enemyType) {
        case "worm":
          enemy = new Worm(this);
          break;
        case "ghost":
          enemy = new Ghost(this);
          break;
        case "spider":
          enemy = new Spider(this);
          break;
      }
      this.enemies.push(enemy);
      console.log(this.enemies);
      // this.enemies.sort((a, b) => a.y - b.y);
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.markedForDelete = false;
      this.frameX = 0;
      this.maxFrame = 5;
      this.frameInterval = 5;
      this.frameTimer = 0;
      this.x = this.game.width;
    }

    update(deltaTime) {
      this.x -= this.speedX * deltaTime;
      if (this.x < 0 - this.width) {
        this.markedForDelete = true;
      }
      if (this.y < 0 - this.height * 2) {
        this.markedForDelete = true;
      }
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }

    draw(ctx) {
      ctx.drawImage(
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

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      // html elements with id
      // are global variables
      // div#myId => myId
      // this.image = new Image();
      // this.image.src = "./enemy_worm.png";
      this.image = worm;
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.sizeModifier = 0.5;
      this.width = this.spriteWidth * this.sizeModifier;
      this.height = this.spriteHeight * this.sizeModifier;
      this.speedX = Math.random() * 0.1 + 0.1;
      // worms are on the ground
      this.y = this.game.height - this.height;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.image = ghost;
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.sizeModifier = 0.5;
      this.width = this.spriteWidth * this.sizeModifier;
      this.height = this.spriteHeight * this.sizeModifier;
      this.speedX = Math.random() * 0.2 + 0.1;
      // ghosts are on the top 60%
      this.y = 0.6 * Math.random() * this.game.height;
      this.angle = 0;
      this.curve = Math.random() * 3;
    }

    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle) * this.curve;
      this.angle += 0.04;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      super.draw(ctx);
      ctx.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.image = spider;
      this.spriteWidth = 310;
      this.spriteHeight = 175;
      this.sizeModifier = 0.5;
      this.width = this.spriteWidth * this.sizeModifier;
      this.height = this.spriteHeight * this.sizeModifier;
      this.x = Math.random() * (this.game.width - this.width);
      this.y = 0 - this.height;
      this.speedY = Math.random() * 0.1 + 0.1;
      this.speedX = 0;
      this.amplitude =
        this.game.height * 0.5 + Math.random() * this.game.height * 0.5;
    }

    update(deltaTime) {
      super.update(deltaTime);
      if (this.y > this.amplitude - this.height) this.speedY *= -1;
      this.y += this.speedY * deltaTime;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width * 0.5, 0);
      ctx.lineTo(this.x + this.width * 0.5, this.y + 10);
      ctx.stroke();
      super.draw(ctx);
    }
  }

  const game = new Game(ctx, canvas.width, canvas.height);
  // console.log(game);
  let lastTime = 1;
  function animate(timestamp) {
    game.clear();
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    game.update(deltaTime);
    game.draw();

    requestAnimationFrame(animate);
  }

  animate(0);
});
