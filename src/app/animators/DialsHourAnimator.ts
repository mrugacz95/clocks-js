import { Animator } from "./Animator"
import { State } from "./Animator"

export class DialsHourAnimator extends Animator {
    freezeTime = 1.5

    internalNextState(): State[][] {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const hourRotation = hours % 12 / 12 * 2 * Math.PI;
        const minRotation = minutes / 60 * 2 * Math.PI;

        let output: State[][] = []
        for (let y = 0; y < this.wallClock.rows; y++) {
            output[y] = []
            for (let x = 0; x < this.wallClock.columns; x++) {
                output[y][x] = new State(hourRotation, minRotation)
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