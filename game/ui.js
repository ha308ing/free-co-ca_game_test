export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
    this.livesImage = document.getElementById("lives");
    this.livesSize = 50;
    this.livesSizeModifier = 0.7;
  }

  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "#fff";
    context.shadowBlur = 0;
    context.font = this.fontSize + "px " + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;

    // score
    context.fillText("Score: " + this.game.score, 20, 50);

    // timer
    const time = (this.game.time * 0.001).toFixed(1);
    context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
    context.fillText("Time: " + time, 20, 80);

    // lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(
        this.livesImage,
        0,
        0,
        this.livesSize,
        this.livesSize,
        20 + i * this.livesSize * this.livesSizeModifier,
        90,
        this.livesSize * this.livesSizeModifier,
        this.livesSize * this.livesSizeModifier
      );
    }

    // game over message
    if (this.game.gameOver) {
      context.textAlign = "center";
      context.font = this.fontSize * 2 + "px " + this.fontFamily;

      if (this.game.score > 5) {
        context.fillText(
          "Boo-yah",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
        context.fillText(
          "What are creatures of the night afraid of? You!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      } else {
        context.fillText(
          "Love at first bite?",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
        context.fillText(
          "Better luck next time!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      }
    }
    context.restore();
  }
}
