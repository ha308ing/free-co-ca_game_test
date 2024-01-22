export class FloatingMessages {
  constructor(value, x, y, targetX, targetY) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.markedToDelete = false;
    this.timer = 0;
    this.fontFamily = "Creepster";
    this.fontSize = 20;
    this.fontColor = "black";
    this.fontShadowColor = "white";
  }

  update() {
    this.x += (this.targetX - this.x) * 0.03;
    this.y += (this.targetY - this.y) * 0.03;
    this.timer++;
    if (this.timer > 100) this.markedToDelete = true;
  }

  draw(context) {
    context.font = this.fontSize + "px " + this.fontFamily;
    context.fillStyle = this.fontShadowColor;
    context.fillText(this.value, this.x + 2, this.y + 2);
    context.fillStyle = this.fontColor;
    context.fillText(this.value, this.x, this.y);
  }
}
