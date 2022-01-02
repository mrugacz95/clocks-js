import { Animator } from "./Animator" 
import { State } from "./Animator" 

export class HourAnimator implements Animator  {
    nextState(rows: number, columns: number): State[][] {
        var today = new Date();
        var hours = today.getHours()
        var minutes = today.getMinutes()
        var hourRotation = hours % 12 / 12 * 2 * Math.PI;
        var minRotation = minutes / 60 * 2 * Math.PI;

        let output: State[][] = []
        for(let y  =0 ; y< rows;y++){
            output[y] = []
            for (let x = 0; x < columns; x++) {
                output[y][x] = new State(hourRotation , minRotation)      
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