window.addEventListener("load", () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;
  const fullscreenButton = document.getElementById("fullscreenButton");

  class InputHander {
    constructor() {
      this.keys = [];
      this.touchY = "";
      this.touchTreshold = 30;
      window.addEventListener("keydown", e => {
        if (this.#isKey(e.key) && !this.keys.includes(e.key)) {
          this.keys.push(e.key);
        } else if (e.key === "Enter" && gameOver) {
          gameRestart();
        }
      });
      window.addEventListener("keyup", e => {
        if (this.#isKey(e.key)) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });

      window.addEventListener("touchstart", e => {
        this.touchY = e.targetTouches[0].pageY;
      });

      window.addEventListener("touchmove", e => {
        const swipteDistance = e.targetTouches[0].pageY - this.touchY;
        if (
          swipteDistance < -this.touchTreshold &&
          !this.keys.includes("swipe up")
        ) {
          this.keys.push("swipe up");
        } else if (
          swipteDistance > this.touchTreshold &&
          !this.keys.includes("swipe down")
        ) {
          this.keys.push("swipe down");
          if (gameOver) gameRestart();
        }
      });

      window.addEventListener("touchend", e => {
        this.keys.splice(this.keys.indexOf("swipe up", 1));
        this.keys.splice(this.keys.indexOf("swipe down", 1));
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
      this.x = 100;
      this.y = this.gameHeight - this.height;
      // documet.getElementById("playerImage")
      this.image = playerImage;
      this.maxFrame = 8;
      this.frameX = 0;
      this.frameY = 0;
      this.fps = 20;
      this.frameInterval = 1000 / this.fps;
      this.frameTimer = 0;
      this.speedX = 0;
      this.speedY = 0;
      this.speedMultiplier = 2;
      this.weight = 1;
    }

    update(input, deltaTime, enemies) {
      // controls
      const keys = input.keys;

      if (keys.includes("ArrowRight")) {
        this.speedX = 5;
      } else if (keys.includes("ArrowLeft")) {
        this.speedX = -5;
      } else if (
        (keys.includes("ArrowUp") || keys.includes("swipe up")) &&
        this.onGround()
      ) {
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
        this.maxFrame = 6;
        this.frameY = 1;
      } else {
        this.speedY = 0;
        this.frameY = 0;
        this.maxFrame = 8;
      }
      if (this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
      }

      // sprite animation
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

      // collision detection
      enemies.forEach(enemy => {
        // dx = enemy.collisionCirlce.center.x - this.collisionCircle.center.x
        const dx =
          enemy.x + (enemy.width * 0.5 - 20) - (this.x + this.width * 0.5);
        // dy = enemy.collisionCirlce.center.y - this.collisionCircle.center.y
        const dy =
          enemy.y + enemy.height * 0.5 - (this.y + this.height * 0.5 + 20);
        const distance = Math.sqrt(dx * dx + dy * dy);
        // if distance < sum of radii
        if (distance < enemy.width * 0.35 + this.width * 0.35) {
          gameOver = true;
        }
      });
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

      // collision circle
      // context.strokeStyle = "#fff";
      // context.lineWidth = 5;
      // context.beginPath();
      // context.arc(
      //   this.x + this.width * 0.5,
      //   this.y + this.height * 0.5 + 20,
      //   this.width * 0.35,
      //   0,
      //   Math.PI * 2
      // );
      // context.stroke();
    }

    onGround() {
      return this.y >= this.gameHeight - this.height;
    }

    restart() {
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.maxFrame = 8;
      this.frameY = 0;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById("backgroundImage");
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 2;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      );
    }

    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.x = 0;
      }
    }

    restart() {
      this.x = 0;
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById("enemyImage");
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.fps = 20;
      this.frameInterval = 1000 / this.fps;
      this.frameTimer = 0;
      this.maxFrame = 5;
      this.markedForDelete = false;
      // this.speed = Math.random() * 0.5 + 1;
      this.speed = 5;
    }

    update(deltaTime) {
      this.x -= this.speed;
      if (this.x < -this.width) {
        this.markedForDelete = true;
        score++;
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

    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );

      // collision circle
      // context.strokeStyle = "#fff";
      // context.lineWidth = 5;
      // context.beginPath();
      // context.arc(
      //   this.x + this.width * 0.5 - 20,
      //   this.y + this.height * 0.5,
      //   this.width * 0.35,
      //   0,
      //   Math.PI * 2
      // );
      // context.stroke();
    }
  }

  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach(enemy => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    enemies = enemies.filter(enemy => !enemy.markedForDelete);
  }

  function displayStatusText(context) {
    context.textAlign = "left";
    context.fillStyle = "#000";
    context.font = "40px Helvetica";
    context.fillText("Score: " + score, 20, 50);
    context.fillStyle = "#fff";
    context.font = "40px Helvetica";
    context.fillText("Score: " + score, 22, 52);

    if (gameOver) {
      context.textAlign = "center";
      context.fillStyle = "#000";
      context.fillText("Game over", canvas.width * 0.5, 200);
      context.save();
      context.font = "30px Helvetica";
      context.fillText(
        "press Enter or swipe down to restart",
        canvas.width * 0.5,
        250
      );
      context.restore();
      context.fillStyle = "#fff";
      context.fillText("Game over", canvas.width * 0.5 + 2, 200 + 2);
      context.save();
      context.font = "30px Helvetica";
      context.fillText(
        "press Enter or swipe down to restart",
        canvas.width * 0.5 + 2,
        250 + 2
      );
      context.restore();
    }
  }

  function gameRestart() {
    player.restart();
    background.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch(err => {
        alert(`Error, can't enable full-screen mode ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  fullscreenButton.addEventListener("click", toggleFullscreen);

  const input = new InputHander();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTimestamp = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  function animate(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    background.update();
    handleEnemies(deltaTime);
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    displayStatusText(ctx);
    if (!gameOver) {
      requestAnimationFrame(animate);
    }
  }
  animate(0);
});
