import { Animator, State } from "./Animator";

export class LinesAnimator extends Animator {
    state: State

    constructor(state: State, freezeTime = 0) {
        super(freezeTime);
        this.state = state
    }

    nextState(): State[][] {
        let output: State[][] = []
        for (let y = 0; y < this.rows; y++) {
            output[y] = []
            for (let x = 0; x < this.columns; x++) {
                output[y][x] = this.state
            }
        }
        return output
    }

    hasFinished(): boolean {
        return true
    }

    restart(): void {
        // nop
    }

}