import { Angle, Animator, State } from "./Animator";
import { Vector } from "../geometry/Vector";
import { WallClock } from "../WallClock";

export class Magnet extends Animator {
    t: number = 0.0
    delta: number = 0.1
    points: number[][]
    magnetPos = new Vector(230, 80)
    currentCol = 0
    selectedRow = 5

    init(wallClock: WallClock) {
        super.init(wallClock);
        this.selectedRow = Math.round(Math.random() * this.wallClock.rows)
    }

    protected internalNextState(): State[][] {
        let initial = State.createClocksState(this.wallClock.rows, this.wallClock.columns);
        this.magnetPos = this.wallClock.dialsCenters[this.selectedRow][this.currentCol]
        for (let y = 0; y < this.wallClock.rows; y++) {
            for (let x = 0; x < this.wallClock.columns; x++) {
                if (y == this.selectedRow && x == this.currentCol){
                    initial[y][x] = new State(Angle.DOWN, Angle.UP)
                    continue
                }
                let dialCenter = this.wallClock.dialsCenters[y][x]
                let differnce = this.magnetPos.sub(dialCenter)
                let distance = differnce.length()
                let arrowLen = this.wallClock.singleClockSize
                let angle = Math.acos(arrowLen / distance)
                initial[y][x] = initial[y][x].setHourRotation(Angle.wrap(differnce.inv().angle() + angle))
                initial[y][x] = initial[y][x].setMinRotation(Angle.wrap(differnce.inv().angle() - angle))
            }
        }
        this.currentCol += 3
        return initial
    }

    hasFinished(): boolean {
        return this.currentCol >= this.wallClock.columns;
    }

    restart(): void {
        this.selectedRow = Math.round(Math.random() * (this.wallClock.rows - 1))
        this.currentCol = 0
    }

}