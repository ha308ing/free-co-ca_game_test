export const state = {
  STANDING_LEFT: 0,
  STANDING_RIGHT: 1,
  SITTING_LEFT: 2,
  SITTING_RIGHT: 3,
  RUNNING_LEFT: 4,
  RUNNING_RIGHT: 5,
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
    this.player.speed = 0;
    this.player.frameY = 1;
    this.player.frameMax = 6;
  }

  handleInput(input) {
    if (input === "PRESS right") {
      // set state to StandingRight
      this.player.setState(state.RUNNING_RIGHT);
    } else if (input === "PRESS left") {
      this.player.setState(state.RUNNING_LEFT);
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
    this.player.speed = 0;
    this.player.frameY = 0;
    this.player.frameMax = 6;
  }

  handleInput(input) {
    if (input === "PRESS left") {
      // set state to StandingLeft
      this.player.setState(state.RUNNING_LEFT);
    } else if (input === "PRESS right") {
      this.player.setState(state.RUNNING_RIGHT);
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
    this.player.speed = 0;
    this.player.frameMax = 4;
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
    this.player.speed = 0;
    this.player.frameMax = 4;
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

export class RunningLeft extends State {
  constructor(player) {
    super("RUNNING LEFT");

    this.player = player;
  }

  enter() {
    this.player.frameY = 7;
    this.player.speed = -this.player.maxSpeed;
    this.player.frameMax = 8;
  }

  handleInput(input) {
    if (input === "PRESS right") {
      this.player.setState(state.RUNNING_RIGHT);
    } else if (input === "RELEASE left") {
      this.player.setState(state.STANDING_LEFT);
    } else if (input === "PRESS down") {
      this.player.setState(state.SITTING_LEFT);
    }
  }
}

export class RunningRight extends State {
  constructor(player) {
    super("RUNNING RIGHT");

    this.player = player;
  }

  enter() {
    this.player.frameY = 6;
    this.player.speed = this.player.maxSpeed;
    this.player.frameMax = 8;
  }

  handleInput(input) {
    if (input === "PRESS left") {
      this.player.setState(state.RUNNING_LEFT);
    } else if (input === "RELEASE right") {
      this.player.setState(state.STANDING_RIGHT);
    } else if (input === "PRESS down") {
      this.player.setState(state.SITTING_RIGHT);
    }
  }
}
