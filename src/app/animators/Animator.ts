export interface Animator {
    nextState(rows: number, columns: number): State[][]
    hasFinished(): boolean
    restart(rows: number, columns: number): void
    freezeTime: number
}

export class State {
    readonly minRotation: number
    readonly hourRotation: number

    constructor(hourRotation: number, minRotation: number) {
        this.hourRotation = hourRotation
        this.minRotation = minRotation
    }

    setHourRotation(rot: number){
        return new State(rot, this.minRotation)
    }

    setMinRotation(rot: number){
        return new State(this.hourRotation, rot)
    }

    static OFF: State = new State(Math.PI * 10 / 8, Math.PI * 10 / 8)
    static RIGHT: number = Math.PI / 2
    static LEFT: number = Math.PI * 6 / 4
    static DOWN: number = Math.PI
    static UP: number = 0

    static createClocksState(rows: number, columns: number): State[][] {
        let state = []
        for (let y = 0; y < rows; y++) {
            state[y] = []
            for (let x = 0; x < columns; x++) {
                state[y][x] = State.OFF
            }
        }
        return state
    }
}