window.addEventListener("load", function () {
  console.log("hi");
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
      this.#addNewEnemy();
    }

    update() {
      this.enemies.forEach(e => e.update());
    }

    draw() {
      this.enemies.forEach(e => e.draw());
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    #addNewEnemy() {
      this.enemies.push(new Enemy(this));
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height;
      this.width = 100;
      this.height = 100;
    }

    update() {
      this.x--;
    }

    draw() {
      this.game.ctx.fillStyle = "black";
      this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  const game = new Game(ctx, canvas.width, canvas.height);
  // console.log(game);
  let lastTime = 1;
  function animate(timestamp) {
    game.clear();
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    game.update();
    game.draw();

    requestAnimationFrame(animate);
  }

  animate(0);
});
