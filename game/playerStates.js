const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

class State {
  constructor(state) {
    this.state = state;
  }
}

export class Sitting extends State {
  constructor(player) {
    super("SITTING");
    this.player = player;
  }

  enter() {
    this.player.frameY = 5;
    this.player.frameLimit = 4;
    this.player.frameX = 0;
    this.player.game.speed = this.player.game.speedMax * 0;
  }

  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.player.setState(states.RUNNING);
    } else if (input.includes("Enter")) {
      this.player.setState(states.ROLLING);
    }
  }
}

export class Running extends State {
  constructor(player) {
    super("RUNNING");
    this.player = player;
  }

  enter() {
    this.player.frameY = 3;
    this.player.frameLimit = 8;
    this.player.frameX = 0;
    this.player.game.speed = this.player.game.speedMax * 1;
  }

  handleInput(input) {
    if (input.includes("ArrowDown")) {
      this.player.setState(states.SITTING);
    } else if (input.includes("ArrowUp")) {
      this.player.setState(states.JUMPING);
    } else if (input.includes("Enter")) {
      this.player.setState(states.ROLLING);
    }
  }
}

export class Jumping extends State {
  constructor(player) {
    super("JUMPING");
    this.player = player;
  }

  enter() {
    if (this.player.onGround()) this.player.speedY -= 20;
    this.player.frameY = 1;
    this.player.frameLimit = 6;
    this.player.frameX = 0;
    this.player.game.speed = this.player.game.speedMax * 1;
  }

  handleInput(input) {
    if (this.player.speedY > this.player.weight) {
      this.player.setState(states.FALLING);
    } else if (input.includes("Enter")) {
      this.player.setState(states.ROLLING);
    }
  }
}

export class Falling extends State {
  constructor(player) {
    super("FALLING");
    this.player = player;
  }

  enter() {
    this.player.frameY = 2;
    this.player.frameLimit = 6;
    this.player.frameX = 0;
    this.player.game.speed = this.player.game.speedMax * 1;
  }

  handleInput(input) {
    if (this.player.onGround()) {
      this.player.setState(states.RUNNING);
    } else if (input.includes("Enter")) {
      this.player.setState(states.ROLLING);
    }
  }
}

export class Rolling extends State {
  constructor(player) {
    super("ROLLING");
    this.player = player;
  }

  enter() {
    this.player.frameY = 6;
    this.player.frameLimit = 6;
    this.player.frameX = 0;
    this.player.game.speed = this.player.game.speedMax * 2;
  }

  handleInput(input) {
    if (!input.includes("Enter") && this.player.onGround()) {
      this.player.setState(states.RUNNING);
    } else if (!input.includes("Enter") && !this.player.onGround()) {
      this.player.setState(states.FALLING);
    } else if (
      input.includes("Enter") &&
      input.includes("ArrowUp") &&
      this.player.onGround()
    ) {
      this.player.speedY -= 27;
    }
  }
}
