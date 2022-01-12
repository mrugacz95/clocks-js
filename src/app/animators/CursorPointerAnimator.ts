import { Animator, State } from "./Animator";
import { WallClock } from "../WallClock";
import { Vector } from "../geometry/Vector";

export class CursorPointerAnimator extends  Animator{
    pointerPosition: Vector

    init(wallClock: WallClock) {
        super.init(wallClock);
        this.trackPointer()

        let centerCol = Math.round(this.wallClock.columns / 2) - 1
        let centerRow = Math.round(this.wallClock.rows / 2) - 1
        this.pointerPosition = this.wallClock.dialsCenters[centerRow][centerCol]
    }

    trackPointer(){
        window.addEventListener('mousemove', (event) => {
            this.pointerPosition = new Vector(event.y, event.x)
        })
    }

    hasFinished(): boolean {
        return true;
    }

    protected internalNextState(currentState: State[][]): State[][] {
        let initial = State.createClocksState(this.wallClock.rows, this.wallClock.columns)
        let wallClockPosition = new Vector(this.wallClock.root.getBoundingClientRect().top , this.wallClock.root.getBoundingClientRect().left)
        for (let y = 0; y < this.wallClock.rows; y++) {
            for (let x = 0; x < this.wallClock.columns; x++) {
                let dialCenter = this.wallClock.dialsCenters[y][x]
                let direction = this.pointerPosition.sub(wallClockPosition).sub(dialCenter)
                initial[y][x] = new State(direction.angle(), direction.inv().angle())
            }
        }
        return initial
    }

    restart(): void {
        // nop
    }

}