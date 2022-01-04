import { Animator, State } from "./Animator";

export class WaveAnimator implements Animator{
    freezeTime: number = 2

    hasFinished(): boolean {
        return true;
    }

    nextState(rows: number, columns: number): State[][] {
        let state = State.createClocksState(rows, columns)
        let delta = Math.PI / rows
        let rot = 0
        for(let y = 0; y < rows; y++){
            rot += delta
            for (let x = 0 ; x < columns; x ++){
                state[y][x] = new State(rot + Math.PI, rot)
            }
        }
        return  state
    }

    restart(rows: number, columns: number): void {
        // nop
    }

}