import { WallClock } from "../WallClock";

export abstract class Animator {
    protected initialized: boolean = false
    protected wallClock: WallClock
    freezeTime: number

    constructor(freezeTime: number = 0) {
        this.freezeTime = freezeTime
    }

    init(wallClock: WallClock) {
        this.wallClock = wallClock
        this.initialized = true
    }

    nextState(currentState: State[][]): State[][] {
        if (!this.initialized) {
            throw new DOMException("Animator not initialized")
        }
        return this.internalNextState(currentState)
    }

    protected abstract internalNextState(currentState: State[][]): State[][]

    abstract hasFinished(): boolean

    abstract restart(): void
}

export class Angle {
    static RIGHT: number = Math.PI / 2
    static LEFT: number = Math.PI * 6 / 4
    static DOWN: number = Math.PI
    static UP: number = 0
    static UP_RIGHT: number = Math.PI / 4
    static UP_LEFT: number = Math.PI * 7 / 4
    static DOWN_RIGHT = Math.PI * 3 / 4
    static DOWN_LEFT = Math.PI * 5 / 4

    static opposite(angle: number) {
        return (angle + 3 * Math.PI) % (2 * Math.PI)
    }

    static wrap(angle: number) {
        return (angle + 2 * Math.PI) % (2 * Math.PI)
    }
}

export class State {
    readonly minRotation: number
    readonly hourRotation: number

    constructor(hourRotation: number, minRotation: number) {
        this.hourRotation = hourRotation
        this.minRotation = minRotation
    }

    setHourRotation(rot: number) {
        return new State(rot, this.minRotation)
    }

    setMinRotation(rot: number) {
        return new State(this.hourRotation, rot)
    }

    static OFF: State = new State(Angle.DOWN_LEFT, Angle.DOWN_LEFT)

    static createClocksState(rows: number, columns: number, initial = State.OFF): State[][] {
        let state = []
        for (let y = 0; y < rows; y++) {
            state[y] = []
            for (let x = 0; x < columns; x++) {
                state[y][x] = initial
            }
        }
        return state
    }
}
