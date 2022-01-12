import { Animator, State } from './animators/Animator'
import { WallClock } from './WallClock'

export class Choreographer {
    animators: Animator[]
    state: number
    wallClock: WallClock
    fps: number = 60
    currentState: State[][]
    targetState: State[][]
    speed: number = (2 * Math.PI / 10)  // 10 sec for full turn
    minAngleDiff: number  = this.speed / this.fps
    nextAnimatorTime ?: number
    freezeTime : number = 0.5
    achievedTargetState = false

    constructor(animators: Animator[], wallClock: WallClock) {
        this.animators = animators
        this.state = 0
        this.wallClock = wallClock
        this.currentState = State.createClocksState(this.wallClock.rows, this.wallClock.columns)
        this.targetState = this.currentState
    }

    start() {
        let state = this.nextState()
        this.wallClock.draw(state)
        setTimeout(() => { this.start() }, 1000 * this.freezeTime / this.fps)
    }

    private nextState(): State[][] {
        if ((this.targetState == null || !this.animators[this.state].hasFinished()) && this.achievedTargetState){
            this.targetState = this.animators[this.state].nextState(this.currentState)
        }
        let { nextState, moving } = this.interpolate(this.targetState)
        this.achievedTargetState = !moving
        if (this.animators[this.state].hasFinished() && moving == false) {
            if (this.nextAnimatorTime == null){
                this.nextAnimatorTime = new Date().getTime() + 1000 * this.animators[this.state].freezeTime
                return this.currentState
            }
            else if (this.nextAnimatorTime > new Date().getTime()){
                return this.currentState
            }
            this.targetState = null
            this.animators[this.state].restart()
            this.state = (this.state + 1) % this.animators.length
            this.nextAnimatorTime = null
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
                let { interpolatedValue, changed } = this.interpolateValue(currentState.hourRotation, newState.hourRotation)
                interpolated[y][x] = interpolated[y][x].setHourRotation(interpolatedValue)
                moving ||= changed;
                ({ interpolatedValue, changed } = this.interpolateValue(currentState.minRotation, newState.minRotation))
                interpolated[y][x] = interpolated[y][x].setMinRotation(interpolatedValue)
                moving ||= changed
            }
        }
        return { nextState: interpolated, moving }
    }

    private interpolateValue(oldValue: number, newValue: number): { interpolatedValue: number, changed: boolean } {
        if (oldValue == newValue){
            return {interpolatedValue: oldValue, changed:false}
        }
        let clockwiseDist = Math.abs(oldValue - newValue)
        if (clockwiseDist < this.minAngleDiff) {
            return { interpolatedValue: newValue, changed: true }
        }
        let maxV = Math.max(oldValue, newValue)
        let minV = Math.min(oldValue, newValue)
        let counterclockwiseDist = minV + 2 * Math.PI - maxV
        let result: number
        let sign: number
        if (clockwiseDist < counterclockwiseDist) { // clockwise
            sign = (oldValue < newValue) ? 1 : -1
        } else {
            sign = (oldValue < newValue) ? -1 : 1
        }
        result = oldValue + sign * this.minAngleDiff
        return { interpolatedValue: (result + 2 * Math.PI) % (2 * Math.PI), changed: true } // keep 2pi range
    }
}