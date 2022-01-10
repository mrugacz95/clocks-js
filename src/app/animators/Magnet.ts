import { Angle, Animator, State } from "./Animator";
import { Vector } from "../geometry/Vector";
import { WallClock } from "../WallClock";

export class Magnet extends Animator {
    t: number = 0.0
    delta: number = 0.1
    points: number[][]
    magnetPos = new Vector(230, 80)
    centerRow: number
    centerCol: number
    startingState = true
    rotate : number = 2 * Math.PI
    rotationPerformed = 0
    finished = false

    init(wallClock: WallClock) {
        super.init(wallClock);
        this.centerCol = Math.round(this.wallClock.columns / 2) - 1
        this.centerRow = Math.round(this.wallClock.rows / 2) - 1
    }

    protected internalNextState(currentState: State[][]): State[][] {
        if (this.startingState) return this.getStartingState()
        else return this.iterateState(currentState)

    }

    private getStartingState(): State[][] {
        let initial = State.createClocksState(this.wallClock.rows, this.wallClock.columns);
        this.magnetPos = this.wallClock.dialsCenters[this.centerRow][this.centerCol]
        for (let y = 0; y < this.wallClock.rows; y++) {
            for (let x = 0; x < this.wallClock.columns; x++) {
                if (y == this.centerRow && x == this.centerCol) {
                    const today = new Date();
                    const hours = today.getHours();
                    const minutes = today.getMinutes();
                    const hourRotation = hours % 12 / 12 * 2 * Math.PI;
                    const minRotation = minutes / 60 * 2 * Math.PI;
                    initial[y][x] = new State(hourRotation, minRotation)
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
        this.startingState = false
        return initial
    }

    private iterateState(currentState: State[][]): State[][] {
        let nextState: State[][] = State.createClocksState(this.wallClock.rows, this.wallClock.columns)
        nextState[this.centerRow][this.centerCol] = currentState[this.centerRow][this.centerCol]
        this.rotationPerformed += this.wallClock.choreographer.minAngleDiff
        if (this.rotationPerformed >= this.rotate){
            this.finished = true
        }
        for (let y = 0; y < this.wallClock.rows; y++) {
            for (let x = 0; x < this.wallClock.columns; x++) {
                if (y == this.centerRow && x == this.centerCol) {
                    continue
                }
                nextState[y][x] = new State(
                    Angle.wrap(currentState[y][x].hourRotation - this.wallClock.choreographer.minAngleDiff),
                    Angle.wrap(currentState[y][x].minRotation + this.wallClock.choreographer.minAngleDiff)
                )
            }
        }
        return nextState
    }

    hasFinished(): boolean {
        return this.finished;
    }

    restart(): void {
        this.startingState = true
        this.finished = false
        this.rotationPerformed = 0
    }

}