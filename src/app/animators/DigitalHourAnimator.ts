import { Animator, State } from "./Animator";
import { Vector } from "../geometry/Vector"

export class DigitalHourAnimator implements Animator {
    freezeTime = 1
    numbers: { [num: number]: number[][] } = { // ids of connected clock dials
        1: [[0, 1], [0, 2], [5, 2], [5, 1], [1, 1], [1, 0], [1, 1], [0, 1]]
    }

    randInt(max: number) {
        return Math.round(Math.random() * max)
    }

    p1: Vector
    p2: Vector
    p3: Vector


    nextState(rows: number, columns: number): State[][] {
        let initial = State.createClocksState(rows, columns)
        if (this.p1 == null) {
            this.p1 = new Vector(0, 6)
            this.p2 = new Vector(7, 1)
            this.p3 = new Vector(6, 10)
        }
        this.drawLine(this.p1, this.p2, initial)
        this.drawLine(this.p2, this.p3, initial)
        this.drawLine(this.p3, this.p1, initial)
        return initial
    }

    hasFinished(): boolean {
        return true
    }

    restart(rows: number, columns: number): void {
        this.p1 = null
        this.p2 = null
        this.p3 = null
    }

    drawLine(p0: Vector, p1: Vector, state: State[][]) {
        if (Math.abs(p1.y - p0.y) < Math.abs(p1.x - p0.x)) {
            if (p0.x > p1.x)
                this.drawLineLow(p1, p0, state)
            else
                this.drawLineLow(p0, p1, state)
        } else {
            if (p0.y > p1.y)
                this.drawLineHigh(p1, p0, state)
            else
                this.drawLineHigh(p0, p1, state)
        }
    }

    drawLineLow(p0: Vector, p1: Vector, state: State[][]) {

        let dx = p1.x - p0.x
        let dy = p1.y - p0.y
        let yi = 1
        let slopeMinRot = Math.PI * 3 / 4
        let slopeHourRot = Math.PI * 7 / 4
        if (dy < 0) {
            yi = -1
            dy = -dy
            slopeMinRot = Math.PI / 4
            slopeHourRot = Math.PI * 5 / 4
        }
        let D = (2 * dy) - dx
        let y = p0.y
        let changed = false
        let hourRot: number
        let minRot: number
        for (let x = p0.x; x <= p1.x; x++) {
            let first = x == p0.x
            let last = x == p1.x
            if (D > 0) {
                hourRot = changed ? slopeHourRot : State.LEFT
                minRot = slopeMinRot
                this.setLineState(y, x, hourRot, minRot, first, last, state)
                changed = true
                y = y + yi;
                D = D + (2 * (dy - dx))
            } else {
                hourRot = changed ? slopeHourRot : State.LEFT
                minRot = State.RIGHT
                this.setLineState(y, x, hourRot, minRot, first, last, state)
                changed = false
                D = D + 2 * dy
            }
        }
    }

    drawLineHigh(p0: Vector, p1: Vector, state: State[][]) {
        let dx = p1.x - p0.x
        let dy = p1.y - p0.y
        let xi = 1
        let slopeHourRot = Math.PI * 7 / 4
        let slopeMinRot = Math.PI * 3 / 4
        if (dx < 0) {
            xi = -1
            dx = -dx
            slopeHourRot = Math.PI / 4
            slopeMinRot = Math.PI * 5 / 4
        }
        let D = (2 * dx) - dy
        let x = p0.x
        let changed = false
        let hourRot: number
        let minRot: number
        for (let y = p0.y; y <= p1.y; y++) {
            let first = y == p0.y
            let last = y == p1.y
            if (D > 0) {
                hourRot = changed ? slopeHourRot : State.UP
                minRot = slopeMinRot
                changed = true
                this.setLineState(y, x, hourRot, minRot, first, last, state)
                x = x + xi;
                D = D + (2 * (dx - dy))
            } else {
                hourRot = changed ? slopeHourRot : State.UP
                minRot = State.DOWN
                this.setLineState(y, x, hourRot, minRot, first, last, state)
                changed = false
                D = D + 2 * dx
            }
        }
    }

    setLineState(y: number, x: number, hourRotation: number, minRotation: number, first: boolean, last: boolean, state: State[][]) {
        if (!first) {
            state[y][x] = state[y][x].setHourRotation(hourRotation)
        }
        if (!last) {
            state[y][x] = state[y][x].setMinRotation(minRotation)
        }
        return state
    }
}