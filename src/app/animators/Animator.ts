export interface Animator{
    nextState(rows: number, columns: number): State[][]
    hasFinished() : boolean
    restart(): void
}

export class State{
    minRotation: number
    hourRotation: number

    constructor(hourRotation:number, minRotation: number){
        this.hourRotation = hourRotation
        this.minRotation = minRotation
    }

    static OFF = new State(Math.PI * 10 / 8,Math.PI * 10 / 8)

    static createClocksState(rows: number, columns: number) : State[][]{
        let state = []
        for (let y = 0; y < rows; y++) {
            state[y] = []
            for (let x = 0; x < columns; x++) {
                state[y][x] = new State(0,0)         
            }
        }
        return state
    }
}