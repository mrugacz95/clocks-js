import { Animator, State } from "./Animator";

export class WaveAnimator extends Animator {
    freezeTime: number = 2

    hasFinished(): boolean {
        return true;
    }

    internalNextState(): State[][] {
        let state = State.createClocksState(this.wallClock.rows, this.wallClock.columns)
        let delta = Math.PI / this.wallClock.rows
        let rot = 0
        for (let y = 0; y < this.wallClock.rows; y++) {
            rot += delta
            for (let x = 0; x < this.wallClock.columns; x++) {
                state[y][x] = new State(rot + Math.PI, rot)
            }
        }
        return state
    }

    restart(): void {
        // nop
    }

}