import { Animator, State } from "./Animator";

export class LinesAnimator implements Animator {
    state: State
    freezeTime: number
    constructor(state: State, freezeTime = 0.5) {
        this.state = state
        this.freezeTime = freezeTime
    }

    nextState(rows: number, columns: number): State[][] {
        let output: State[][] = []
        for (let y = 0; y < rows; y++) {
            output[y] = []
            for (let x = 0; x < columns; x++) {
                output[y][x] = this.state
            }
        }
        return output
    }
    hasFinished(): boolean {
        return true
    }

    restart(rows: number, columns: number): void {
        // nop
    }

}