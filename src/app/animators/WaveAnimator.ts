import { Animator, State } from "./Animator";

export class WaveAnimator extends Animator {
    freezeTime: number = 2

    hasFinished(): boolean {
        return true;
    }

    nextState(): State[][] {
        let state = State.createClocksState(this.rows, this.columns)
        let delta = Math.PI / this.rows
        let rot = 0
        for (let y = 0; y < this.rows; y++) {
            rot += delta
            for (let x = 0; x < this.columns; x++) {
                state[y][x] = new State(rot + Math.PI, rot)
            }
        }
        return state
    }

    restart(): void {
        // nop
    }

}