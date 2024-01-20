window.addEventListener("load", () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;

  class InputHander {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", e => {
        if (this.#isKey(e.key) && !this.keys.includes(e.key)) {
          this.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", e => {
        if (this.#isKey(e.key)) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }

    #isKey(key) {
      return (
        key === "ArrowRight" ||
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "ArrowLeft" ||
        key === "Shift"
      );
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      // documet.getElementById("playerImage")
      this.image = playerImage;
      this.maxFrame = 8;
      this.frameX = 0;
      this.frameY = 0;
      this.frame = 0;
      this.frameInterval = 20;
      this.speedX = 0;
      this.speedY = 0;
      this.speedMultiplier = 2;
      this.weight = 1;
    }

    update(input) {
      const keys = input.keys;

      if (keys.includes("ArrowRight")) {
        this.speedX = 5;
      } else if (keys.includes("ArrowLeft")) {
        this.speedX = -5;
      } else if (keys.includes("ArrowUp") && this.onGround()) {
        this.speedY -= 30;
      } else {
        this.speedX = 0;
      }

      if (keys.includes("Shift")) {
        console.log(keys.includes("Shift"));
        this.speedX *= this.speedMultiplier;
      }

      // horizontal movement
      this.x += this.speedX;
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x > this.gameWidth - this.width) {
        this.x = this.gameWidth - this.width;
      }

      // vertical movement
      this.y += this.speedY;
      if (!this.onGround()) {
        this.speedY += this.weight;
        this.frameY = 1;
      } else {
        this.speedY = 0;
        this.frameY = 0;
      }
      if (this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
      }

      // if (this.frame > this.frameInterval) {
      //   if (this.frameX < this.maxFrame) {
      //     this.frameX++;
      //   } else {
      //     this.frameX = 0;
      //   }
      //   this.frame = 0;
      // } else {
      //   this.frame += deltaTime;
      // }
    }

    onGround() {
      return this.y >= this.gameHeight - this.height;
    }

    draw(context) {
      context.fillStyle = "#fff";
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
  }

  class Background {}

  class Enemy {}

  function handleEnemies() {}

  function displayStatusText() {}

  const input = new InputHander();
  const player = new Player(canvas.width, canvas.height);
  let lastTimestamp = 0;
  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    let deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    player.update(input);
    requestAnimationFrame(animate);
  }
  animate(0);
});
