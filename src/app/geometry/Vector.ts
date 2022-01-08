export class Vector {
    x: number
    y: number

    constructor(y: number, x: number) {
        this.y = y
        this.x = x
    }

    rotate(angle: number): Vector {
        let newX = this.x * Math.cos(angle) - this.y * Math.sin(angle)
        let newY = this.x * Math.sin(angle) + this.y * Math.cos(angle)
        return new Vector(newY, newX);
    }

    add(other: Vector): Vector {
        return new Vector(this.y + other.y, this.x + other.x)
    }

    sub(other: Vector) {
        return this.add(other.inv())
    }

    inv() {
        return new Vector(-this.y, -this.x)
    }

    length(){
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    perpendicularCounterClockwise() {
        return new Vector(this.x, -this.y);
    }

    perpendicularClockwise() {
        return new Vector( -this.x, this.y);
    }

    angle() {
        return (Math.atan2(this.y, this.x) + Math.PI * 3 / 2) % (2 * Math.PI) // rotate 90 deg left
    }
}