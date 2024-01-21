export class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];

    window.addEventListener("keydown", ({ key }) => {
      if (this.#isTargetKey(key) && !this.keys.includes(key)) {
        this.keys.push(key);
      } else if (key === "d") {
        this.game.debug = !this.game.debug;
      }
    });

    window.addEventListener("keyup", ({ key }) => {
      const keyIndex = this.keys.indexOf(key);
      this.keys.splice(keyIndex, 1);
    });
  }

  #isTargetKey(key) {
    return (
      key === "ArrowDown" ||
      key === "ArrowUp" ||
      key === "ArrowRight" ||
      key === "ArrowLeft" ||
      key === "Enter"
    );
  }
}
