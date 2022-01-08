import { Animator, State } from './animators/Animator'
import { Choreographer } from './Choreographer'
import { Vector } from "./geometry/Vector";

export class WallClock {
    root: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    backgroundCtx: CanvasRenderingContext2D
    backgroundDrawn: boolean = false
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
    afterFirstDraw = false
    dialsCenters: Vector[][]

    constructor(root: HTMLCanvasElement, background: HTMLCanvasElement, animators: Animator[]) {
        this.root = root
        this.backgroundCtx = background.getContext("2d")
        this.ctx = this.root.getContext("2d")
        this.width = this.root.width
        this.height = this.root.height
        this.width = this.columns * this.singleClockSize + (this.columns - 1) * this.dividerSize + 2 * this.margin
        this.height = this.rows * this.singleClockSize + (this.rows - 1) * this.dividerSize + 2 * this.margin
        this.root.width = window.innerWidth;
        this.root.height = window.innerHeight;
        background.width = window.innerWidth
        background.height = window.innerHeight
        this.wallStartX = this.root.width / 2 - this.width / 2
        this.wallStartY = this.root.height / 2 - this.height / 2
        this.dialsCenters = []
        for (let y = 0; y < this.rows; y++) {
            this.dialsCenters[y] = []
            for (let x = 0; x < this.columns; x++) {
                this.dialsCenters[y][x] = new Vector(
                    y * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartY + this.margin,
                    x * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartX + this.margin
                )
            }
        }
        animators.forEach((animator: Animator) => {
            animator.init(this)
        })
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

    drawBackground() {
        if (this.backgroundDrawn == false) {
            this.drawBoard(this.backgroundCtx)
            this.drawDials(this.backgroundCtx)
            this.backgroundDrawn = true
        }
    }

    draw(nextState: State[][]) {
        this.drawBackground()
        this.ctx.clearRect(0, 0, this.root.width, this.root.height);
        this.ctx.save()
        this.afterFirstDraw = true
        this.ctx.restore()
        this.ctx.save()
        this.drawArrows(nextState)
    }

    drawBoard(ctx: CanvasRenderingContext2D) {
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 15;
        ctx.shadowOffsetY = 15;
        ctx.shadowColor = "#9d9d9d";

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.wallStartX, this.wallStartY, this.width, this.height);

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "#f2f2f2";
    }

    drawDials(ctx: CanvasRenderingContext2D) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "#fff";
                ctx.strokeStyle = "#fff"
                ctx.lineWidth = 0;
                ctx.save()
                ctx.beginPath();
                ctx.arc(
                    x * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartX + this.margin,
                    y * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartY + this.margin,
                    this.singleClockSize / 2,
                    0,
                    2 * Math.PI);
                ctx.clip()

                ctx.beginPath();
                ctx.fillStyle = "#000";
                ctx.shadowBlur = 8;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "#000";
                ctx.arc(
                    x * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartX + this.margin + 5,
                    y * (this.singleClockSize + this.dividerSize) + this.singleClockSize / 2 + this.wallStartY + this.margin,
                    this.singleClockSize / 1.5,
                    0,
                    2 * Math.PI);
                ctx.stroke();
                ctx.restore()
            }
        }
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "#f2f2f2";
        ctx.lineWidth = 0;
    }

    drawArrows(states: State[][]) {
        this.ctx.fillStyle = "#000";
        this.ctx.strokeStyle = "#000"
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                this.ctx.lineWidth = 4
                let state = states[y][x]
                let {y: clockYCenter, x: clockXCenter} = this.dialsCenters[y][x]
                let {arrowY, arrowX} = this.rotateArrow(this.singleClockSize / 2 - 1, state.minRotation)
                this.ctx.beginPath();
                this.ctx.moveTo(clockXCenter, clockYCenter);
                this.ctx.lineTo(arrowX + clockXCenter, arrowY + clockYCenter);

                ({arrowY, arrowX} = this.rotateArrow(this.singleClockSize / 3, state.hourRotation));
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
        return {arrowY, arrowX}
    }
} 