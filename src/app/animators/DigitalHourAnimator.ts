import { Animator, State } from "./Animator";
import { Vector } from "../geometry/Vector"

export class DigitalHourAnimator implements Animator {
    freezeTime = 5
    numbers: { [num: number]: Vector[] } = { // ids of connected clock dials
        1: [[0, 1], [0, 2], [5, 2], [5, 1], [1, 1], [1, 0], [0, 1]].map((arr) => new Vector(arr[0], arr[1])),
        2: [[0, 0], [0, 2], [3, 2], [3, 1], [4, 1], [4, 2], [5, 2], [5, 0], [2, 0], [2, 1], [1, 1], [1, 0], [0, 0]].map((arr) => new Vector(arr[0], arr[1])),
        3: [[0, 0], [0, 2], [5, 2], [5, 0], [4, 0], [4, 1], [3, 1], [3, 0], [2, 0], [2, 1], [1, 1], [1, 0], [0, 0]].map((arr) => new Vector(arr[0], arr[1])),
        // 4: [[0, 0], [0, 1], [2, 1], [2, 1] , [0,1], [0,2], [5, 2], [5,1], [3,1], [3,0], [0,0]].map((arr) => new Vector(arr[0], arr[1])),
        4: [[0, 2], [5, 2], [5, 1], [3, 1], [3, 0], [2, 0], [0, 2]].map((arr) => new Vector(arr[0], arr[1])),
        5: [[0, 0], [3, 0], [3, 1], [4, 1], [4, 0], [5, 0], [5, 2], [2, 2], [2, 1], [1, 1], [1, 2], [0, 2], [0, 0]].map((arr) => new Vector(arr[0], arr[1])),
        6: [[0, 0], [5, 0], [5, 2], [2, 2], [2, 1], [1, 1], [1, 2], [0, 2], [0, 0]].map((arr) => new Vector(arr[0], arr[1])),
        7: [[0, 0], [0, 2], [5, 2], [5, 1], [1, 1], [1, 0], [0, 0]].map((arr) => new Vector(arr[0], arr[1])),
        8: [[0, 0], [0, 2], [5, 2], [5, 1], [1, 1], [5, 1], [5, 0], [0, 0]].map((arr) => new Vector(arr[0], arr[1])),
        9: [[0, 0], [0, 2], [5, 2], [5, 0], [4, 0], [4, 1], [3, 1], [3, 0], [0, 0]].map((arr) => new Vector(arr[0], arr[1])),
        0: [[0, 0], [0, 2], [5, 2], [5, 0], [0, 0]].map((arr) => new Vector(arr[0], arr[1])),


    }

    cache : State[][]
    cacheDate : Date

    nextState(rows: number, columns: number): State[][] {
        let today = new Date();
        if (this.cacheDate == today){
            return this.cache
        }
        let hours = today.getHours().toString().padStart(2, '0');
        let minutes = today.getMinutes().toString().padStart(2, '0');
        let initial = State.createClocksState(rows, columns)

        this.drawNumber(new Vector(1, 1), parseInt(hours[0]), initial)
        this.drawNumber(new Vector(1, 4), parseInt(hours[1]), initial)
        this.drawNumber(new Vector(1, 8), parseInt(minutes[0]), initial)
        this.drawNumber(new Vector(1, 11), parseInt(minutes[1]), initial)
        // initial[2][7] = new State(State.DOWN, State.DOWN)
        initial[3][7] = new State(State.UP, State.UP)
        initial[4][7] = new State(State.DOWN, State.DOWN)
        // initial[5][7] = new State(State.UP, State.UP)

        this.cache = initial
        return initial
    }

    drawNumber(d: Vector, number: number, state: State[][]) {
        let lines = this.numbers[number]
        for (let i = 0; i < lines.length - 1; i++) {
            this.drawLine(lines[i].add(d), lines[i + 1].add(d), state)
        }
    }

    hasFinished(): boolean {
        return true
    }

    restart(rows: number, columns: number): void {
        // nop
    }

    drawLine(p0: Vector, p1: Vector, state: State[][]) {
        if (Math.abs(p1.y - p0.y) < Math.abs(p1.x - p0.x)) {
            if (p0.x > p1.x)
                this.drawLineLow(p1, p0, state, false)
            else
                this.drawLineLow(p0, p1, state, true)
        } else {
            if (p0.y > p1.y)
                this.drawLineHigh(p1, p0, state, false)
            else
                this.drawLineHigh(p0, p1, state, true)
        }
    }

    drawLineLow(p0: Vector, p1: Vector, state: State[][], direction: boolean) {

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
                this.setLineState(y, x, hourRot, minRot, first, last, state, direction)
                changed = true
                y = y + yi;
                D = D + (2 * (dy - dx))
            } else {
                hourRot = changed ? slopeHourRot : State.LEFT
                minRot = State.RIGHT
                this.setLineState(y, x, hourRot, minRot, first, last, state, direction)
                changed = false
                D = D + 2 * dy
            }
        }
    }

    drawLineHigh(p0: Vector, p1: Vector, state: State[][], direction: boolean) {
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
                this.setLineState(y, x, hourRot, minRot, first, last, state, direction)
                x = x + xi;
                D = D + (2 * (dx - dy))
            } else {
                hourRot = changed ? slopeHourRot : State.UP
                minRot = State.DOWN
                this.setLineState(y, x, hourRot, minRot, first, last, state, direction)
                changed = false
                D = D + 2 * dx
            }
        }
    }

    setLineState(y: number,
                 x: number,
                 hourRotation: number,
                 minRotation: number,
                 first: boolean,
                 last: boolean,
                 state: State[][],
                 direction: boolean) {
        if (direction) {
            if (!first) {
                state[y][x] = state[y][x].setHourRotation(hourRotation)
            }
            if (!last) {
                state[y][x] = state[y][x].setMinRotation(minRotation)
            }
        } else {
            if (!last) {
                state[y][x] = state[y][x].setHourRotation(minRotation)
            }
            if (!first) {
                state[y][x] = state[y][x].setMinRotation(hourRotation)
            }
        }
        return state
    }
}