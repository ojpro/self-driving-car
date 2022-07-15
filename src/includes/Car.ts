import Controls from "./Controls";

class Car {
    private x: number;
    public y: any;
    private readonly width: number;
    private readonly height: number;
    private controls: Controls;
    private speed: number;
    private readonly acceleration: number;
    private readonly maxSpeed: number;
    private readonly friction: number;
    private angle: number;
    private image: HTMLImageElement;

    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.speed = 0
        this.acceleration = 0.2
        this.maxSpeed = 3
        this.friction = 0.05

        this.angle = 0

        this.controls = new Controls();

        this.image = new Image()
        this.image.src = '/images/purple-car.png'
    }

    public update() {
        this.move()
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle)
        ctx.drawImage(this.image,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height)

        ctx.restore()
    }

    private move() {
        if (this.controls.forward) {
            this.speed += this.acceleration
        }

        if (this.controls.reverse) {
            this.speed -= this.acceleration
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed
        }

        if (this.speed < -this.maxSpeed) {
            this.speed = -this.maxSpeed / 2
        }

        if (this.speed > 0) {
            this.speed -= this.friction
        }

        if (this.speed < 0) {
            this.speed += this.friction
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1
            if (this.controls.left) {
                this.angle += flip * .03
            }

            if (this.controls.right) {
                this.angle -= flip * .03
            }
        }


        this.x -= Math.sin(this.angle) * this.speed
        this.y -= Math.cos(this.angle) * this.speed
    }
}

export default Car