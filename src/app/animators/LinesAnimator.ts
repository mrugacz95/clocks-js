import { Animator, State } from "./Animator";

export class LinesAnimator implements Animator{
    state: State
    constructor(state: State){
            this.state = state
    }

    nextState(rows: number, columns: number): State[][] {
        let output: State[][] = []
        for(let y  =0 ; y< rows;y++){
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
    restart() {
        // nop
    }

}