import { Animator, State } from './animators/Animator'
import { WallClock } from './WallClock'

export class Choreographer {
    animators: Animator[]
    state: number
    wallClock: WallClock
    fps: number = 30
    currentState: State[][]
    maxSpeed: number = (2 * Math.PI / 15) / (this.fps) // 15 sec for full turn

    constructor(animators: Animator[], wallClock: WallClock) {
        this.animators = animators
        this.state = 0
        this.wallClock = wallClock
        this.currentState = State.createClocksState(this.wallClock.rows, this.wallClock.columns)
    }

    start() {
        let state = this.nextState()
        this.wallClock.draw(state)
        setTimeout(() => { this.start() }, 1000 / this.fps)
    }

    private nextState(): State[][] {
        let { nextState, moving } = this.interpolate(this.animators[this.state].nextState(this.wallClock.rows, this.wallClock.columns))
        if (this.animators[this.state].hasFinished() && moving == false) {
            this.state = (this.state + 1) % this.animators.length
        }
        this.currentState = nextState
        return nextState
    }

    private interpolate(newClockState: State[][]): { nextState: State[][], moving: boolean } {
        let interpolated = State.createClocksState(this.wallClock.rows, this.wallClock.columns)
        let moving = false
        for (let y = 0; y < this.wallClock.rows; y++) {
            for (let x = 0; x < this.wallClock.columns; x++) {
                let newState = newClockState[y][x]
                let currentState = this.currentState[y][x]
                let { interpolatedValue, changed } = this.intepolateValue(currentState.hourRotation, newState.hourRotation)
                interpolated[y][x].hourRotation = interpolatedValue
                moving ||= changed;
                ({ interpolatedValue, changed } = this.intepolateValue(currentState.minRotation, newState.minRotation))
                interpolated[y][x].minRotation = interpolatedValue
                moving ||= changed
            }
        }
        return { nextState: interpolated, moving }
    }

    private intepolateValue(oldValue: number, newValue: number): { interpolatedValue: number, changed: boolean } {
        let clockwiseDist = Math.abs(oldValue - newValue)
        if (clockwiseDist < this.maxSpeed) {
            return { interpolatedValue: oldValue, changed: false }
        }
        let maxV = Math.max(oldValue, newValue)
        let minV = Math.min(oldValue, newValue)
        let counterclockwiseDist = minV + 2 * Math.PI - maxV
        let result: number
        let sign: number
        if (clockwiseDist < counterclockwiseDist) { // clockwise
            if (oldValue < newValue) {
                sign = 1
            }
            else {
                sign = - 1
            }
        } else {
            if (oldValue < newValue) {
                sign = -1
            }
            else {
                sign = 1
            }
        }
        result = oldValue + sign * this.maxSpeed
        return { interpolatedValue: (result + 2 * Math.PI) % (2 * Math.PI), changed: true }// keep 2pi range


        // if (oldValue < newValue) {
        //     return {
        //         interpolatedValue: (oldValue + this.maxSpeed + 2 * Math.PI) % (2 * Math.PI),
        //         changed: true
        //     }
        // }
        // return {
        //     interpolatedValue: (oldValue - this.maxSpeed + 2 * Math.PI) % (2 * Math.PI),
        //     changed: true
        // }
    }
}