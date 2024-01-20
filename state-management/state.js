export const state = {
  STANDING_LEFT: 0,
  STANDING_RIGHT: 1,
  SITTING_LEFT: 2,
  SITTING_RIGHT: 3,
};

class State {
  constructor(state) {
    this.state = state;
  }
}

/* state design pattern: separate class for each state */

export class StandingLeft extends State {
  constructor(player) {
    super("STANDING LEFT");

    this.player = player;
  }

  enter() {
    this.player.frameY = 1;
  }

  handleInput(input) {
    if (input === "PRESS right") {
      // set state to StandingRight
      this.player.setState(state.STANDING_RIGHT);
    } else if (input === "PRESS down") {
      this.player.setState(state.SITTING_LEFT);
    }
  }
}

export class StandingRight extends State {
  constructor(player) {
    super("STANDING RIGHT");

    this.player = player;
  }

  enter() {
    this.player.frameY = 0;
  }

  handleInput(input) {
    if (input === "PRESS left") {
      // set state to StandingLeft
      this.player.setState(state.STANDING_LEFT);
    } else if (input === "PRESS down") {
      this.player.setState(state.SITTING_RIGHT);
    }
  }
}

export class SittingLeft extends State {
  constructor(player) {
    super("SITTING LEFT");

    this.player = player;
  }

  enter() {
    this.player.frameY = 9;
  }

  handleInput(input) {
    if (input === "PRESS right") this.player.setState(state.SITTING_RIGHT);
    else if (input === "RELEASE down") {
      this.player.setState(state.STANDING_LEFT);
    }
    /*
      else if (input === "PRESS up") this.player.setState(state.STANDING_LEFT);
    */
  }
}

export class SittingRight extends State {
  constructor(player) {
    super("SITTING RIGHT");

    this.player = player;
  }

  enter() {
    this.player.frameY = 8;
  }

  handleInput(input) {
    if (input === "PRESS left") this.player.setState(state.SITTING_LEFT);
    else if (input === "RELEASE down") {
      this.player.setState(state.STANDING_RIGHT);
    }
    /*
      else if (input === "PRESS up") this.player.setState(state.STANDING_RIGHT);
     */
  }
}
