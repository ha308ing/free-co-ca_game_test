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
      this.enemyInterval = 500;

      // time since enemy appeared
      this.enemyTimer = 0;

      this.enemyTypes = ["worm", "ghost"];
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
      let enemy;
      switch (enemyType) {
        case "worm":
          enemy = new Worm(this);
          break;
        case "ghost":
          enemy = new Ghost(this);
          break;
      }
      this.enemies.push(enemy);
      // this.enemies.sort((a, b) => a.y - b.y);
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height;
      this.width = 100;
      this.height = 100;
      this.markedForDelete = false;
    }

    update(deltaTime) {
      this.x -= this.speedX * deltaTime;
      if (this.x < 0 - this.width) {
        this.markedForDelete = true;
      }
    }

    draw(ctx = this.game.ctx) {
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
      this.numberOfSprites = 6;
      this.frame = 0;
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
      this.numberOfSprites = 6;
      this.frame = 0;
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

    draw(ctx = this.game.ctx) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      super.draw();
      ctx.restore();
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
