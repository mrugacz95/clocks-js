import { Angle, Animator, State } from "./Animator";

export class MagneticLinesAnimator extends Animator {
    freezeTime: number;
    state: number = 0
    maxState ?: number = null
    repeats = 3

    init(rows: number, columns: number) {
        super.init(rows, columns);
        this.maxState = columns * this.repeats + 1 // repeat 3 times
    }

    hasFinished(): boolean {
        return this.state == this.maxState;
    }

    nextState(): State[][] {
        if (this.state == 0) {
            this.state++
            return State.createClocksState(this.rows, this.columns, new State(Angle.DOWN_LEFT, Angle.UP_RIGHT))
        }
        let initial = State.createClocksState(this.rows, this.columns)
        let delta = Math.PI / this.columns
        let verticalCol = this.state - 1
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                let angle = ((verticalCol - x) * delta + this.repeats * 2 * Math.PI) % (2 * Math.PI)
                initial[y][x] = new State(angle, Angle.opposite(angle))
            }
        }
        this.state += 1
        return initial
    }

    restart(): void {
        this.state = 0
    }

}