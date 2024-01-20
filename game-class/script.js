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
      this.enemies.forEach(e => e.draw());
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    #addNewEnemy() {
      this.enemies.push(new Worm(this));
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

    draw() {
      this.game.ctx.drawImage(
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
