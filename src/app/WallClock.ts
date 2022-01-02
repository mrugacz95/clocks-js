import { Animator, State } from './animators/Animator'
import { Choreographer } from './Choreographer'

export class WallClock {
    root: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    width: number
    height: number
    columns: number = 15
    rows: number = 8
    margin: number = 30
    dividerSize: number = 10
    singleClockSize: number = 60
    wallStartX: number
    wallStartY: number
    choreographer: Choreographer
    running: boolean = false

    constructor(root: HTMLCanvasElement, animators: Animator[]) {
        this.root = root
        this.ctx = this.root.getContext("2d")
        this.width = this.root.width
        this.height = this.root.height
        this.width = this.columns * this.singleClockSize + (this.columns - 1) * this.dividerSize + 2 * this.margin
        this.height = this.rows * this.singleClockSize + (this.rows - 1) * this.dividerSize + 2 * this.margin
        this.root.width = window.innerWidth;
        this.root.height = window.innerHeight;
        this.wallStartX = this.root.width / 2 - this.width / 2
        this.wallStartY = this.root.height / 2 - this.height / 2
        this.choreographer = new Choreographer(animators, this)
    }

    start() {
        if (this.running) {
            console.error("Already running");
            return
        }
        this.running = true
        this.choreographer.start()
    }

    draw(nextState: State[][]) {
        this.ctx.clearRect(0, 0, this.root.width, this.root.height);
        this.drawBoard()
        this.drawDials()
        this.drawArrows(nextState)
    }

    drawBoard() {
        this.ctx.shadowBlur = 25;
        this.ctx.shadowOffsetX = 15;
        this.ctx.shadowOffsetY = 15;
        this.ctx.shadowColor = "#9d9d9d";

        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(this.wallStartX, this.wallStartY, this.width, this.height);

        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowColor = "#f2f2f2";
    }

    drawDials() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                this.ctx.shadowBlur = 0;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
                this.ctx.shadowColor = "#fff";
                this.ctx.strokeStyle = "#fff"
                this.ctx.lineWidth = 0;
                this.ctx.save()
                this.ctx.beginPath();
                this.ctx.arc(
                    x * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartX + this.margin,
                    y * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartY + this.margin,
                    this.singleClockSize / 2,
                    0,
                    2 * Math.PI);
                this.ctx.clip()

                this.ctx.beginPath();
                this.ctx.fillStyle = "#000";
                this.ctx.shadowBlur = 8;
                this.ctx.shadowOffsetX = 5;
                this.ctx.shadowOffsetY = 0;
                this.ctx.shadowColor = "#000";
                this.ctx.arc(
                    x * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartX + this.margin + 5,
                    y * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartY + this.margin,
                    this.singleClockSize / 1.5,
                    0,
                    2 * Math.PI);
                this.ctx.stroke();
                this.ctx.restore()
            }
        }
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowColor = "#f2f2f2";
        this.ctx.lineWidth = 0;
    }

    drawArrows(states: State[][]) {

        this.ctx.fillStyle = "#000";
        this.ctx.strokeStyle = "#000"
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {

                this.ctx.lineWidth = 4
                let state = states[y][x]
                let clockXCenter = x * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartX + this.margin;
                let clockYCenter = y * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartY + this.margin
                let { arrowY, arrowX } = this.rotateArrow(this.singleClockSize / 2 - 1, state.minRotation)
                this.ctx.beginPath();
                this.ctx.moveTo(clockXCenter, clockYCenter);
                this.ctx.lineTo(arrowX + clockXCenter, arrowY + clockYCenter);

                ({ arrowY, arrowX } = this.rotateArrow(this.singleClockSize / 3, state.hourRotation));
                this.ctx.moveTo(clockXCenter, clockYCenter);
                this.ctx.lineTo(arrowX + clockXCenter, arrowY + clockYCenter)
                this.ctx.stroke()


                this.ctx.lineWidth = 0
                this.ctx.beginPath()
                this.ctx.arc(
                    clockXCenter,
                    clockYCenter,
                    2,
                    0,
                    2 * Math.PI);
                this.ctx.fill()
            }
        }
        this.ctx.lineWidth = 0
    }

    rotateArrow(length: number, rotation: number): { arrowY: number, arrowX: number } {
        let arrowX = length * Math.sin(rotation)
        let arrowY = -length * Math.cos(rotation)
        return { arrowY, arrowX }
    }
} 