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
}