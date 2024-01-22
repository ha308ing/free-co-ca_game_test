import { Dust, Fire, Splash } from "./particles.js";

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
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

export class Sitting extends State {
  constructor(game) {
    super("SITTING", game);
  }

  enter() {
    this.game.player.frameY = 5;
    this.game.player.frameLimit = 4;
    this.game.player.frameX = 0;
    this.game.speed = this.game.speedMax * 0;
  }

  handleInput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.game.player.setState(states.RUNNING);
    } else if (input.includes("Enter")) {
      this.game.player.setState(states.ROLLING);
    } else if (input.includes("ArrowUp")) {
      this.game.player.setState(states.JUMPING);
    }
  }
}

export class Running extends State {
  constructor(game) {
    super("RUNNING", game);
    this.game.player = player;
  }

  enter() {
    this.game.player.frameY = 3;
    this.game.player.frameLimit = 8;
    this.game.player.frameX = 0;
    this.game.speed = this.game.speedMax * 1;
  }

  handleInput(input) {
    if (this.game.player.frameX % 6 === 0)
      this.game.particles.push(
        new Dust(
          this.game,
          this.game.player.x + this.game.player.width * 0.3,
          this.game.player.y + this.game.player.height
        )
      );
    if (input.includes("ArrowDown")) {
      this.game.player.setState(states.SITTING);
    } else if (input.includes("ArrowUp")) {
      this.game.player.setState(states.JUMPING);
    } else if (input.includes("Enter")) {
      this.game.player.setState(states.ROLLING);
    }
  }
}

export class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
  }

  enter() {
    if (this.game.player.onGround()) this.game.player.speedY -= 20;
    this.game.player.frameY = 1;
    this.game.player.frameLimit = 6;
    this.game.player.frameX = 0;
    this.game.speed = this.game.speedMax * 1;
  }

  handleInput(input) {
    if (this.game.player.speedY > this.game.player.weight) {
      this.game.player.setState(states.FALLING);
    } else if (input.includes("Enter")) {
      this.game.player.setState(states.ROLLING);
    } else if (input.includes("ArrowDown")) {
      this.game.player.setState(states.DIVING);
    }
  }
}

export class Falling extends State {
  constructor(game) {
    super("FALLING", game);
  }

  enter() {
    this.game.player.frameY = 2;
    this.game.player.frameLimit = 6;
    this.game.player.frameX = 0;
    this.game.speed = this.game.speedMax * 1;
  }

  handleInput(input) {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING);
    } else if (input.includes("Enter")) {
      this.game.player.setState(states.ROLLING);
    } else if (input.includes("ArrowDown")) {
      this.game.player.setState(states.DIVING);
    }
  }
}

export class Rolling extends State {
  constructor(game) {
    super("ROLLING", game);
  }

  enter() {
    this.game.player.frameY = 6;
    this.game.player.frameLimit = 6;
    this.game.player.frameX = 0;
    this.game.speed = this.game.speedMax * 2;
  }

  handleInput(input) {
    this.game.particles.push(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );

    if (!input.includes("Enter") && this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING);
    } else if (!input.includes("Enter") && !this.game.player.onGround()) {
      this.game.player.setState(states.FALLING);
    } else if (
      input.includes("Enter") &&
      input.includes("ArrowUp") &&
      this.game.player.onGround()
    ) {
      this.game.player.speedY -= 27;
    } else if (input.includes("ArrowDown")) {
      this.game.player.setState(states.DIVING);
    }
  }
}

export class Diving extends State {
  constructor(game) {
    super("DIVING", game);
  }

  enter() {
    this.game.player.frameY = 6;
    this.game.player.frameLimit = 6;
    this.game.player.speedY = 15;
    this.game.player.frameX = 0;
    this.game.speed = this.game.speedMax * 0;
  }

  handleInput(input) {
    this.game.particles.push(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );

    if (this.game.player.onGround()) {
      for (let i = 0; i < 30; i++) {
        this.game.particles.push(
          new Splash(
            this.game,
            this.game.player.x + this.game.player.width * 0.5,
            this.game.player.y + this.game.player.height * 0.5
          )
        );
      }

      this.game.player.setState(states.RUNNING);
    } else if (input.includes("Enter") && this.game.player.onGround()) {
      this.game.player.setState(states.ROLLING);
    }
  }
}
