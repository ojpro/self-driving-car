import Controls from "./Controls";
import Sensor from "./Sensor";
import {polysIntersection} from "./Utils";
import NeuralNetwork from "./Network";

class Car {
    public x: number;
    public y: any;
    private readonly width: number;
    private readonly height: number;
    private controls: Controls;
    private speed: number;
    private readonly acceleration: number;
    private readonly maxSpeed: number;
    private readonly friction: number;
    public angle: number;
    private image: HTMLImageElement;
    private sensor: Sensor;
    public polygon: any[];
    private damaged: boolean;
    public brain: NeuralNetwork;
    private useAI: boolean;
    private mask: HTMLCanvasElement;

    constructor(x, y, width, height, controlled = "OTHER", maxSpeed = 3, color: string = "blue") {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.speed = 0
        this.acceleration = 0.2
        this.maxSpeed = maxSpeed
        this.friction = 0.05

        this.useAI = controlled == "SELF"

        this.angle = 0

        this.damaged = false

        if (controlled != "OTHER") {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            )
        }

        this.controls = new Controls(controlled);

        this.image = new Image()
        this.image.src = '/images/purple-car.png'

        this.mask = document.createElement("canvas");
        this.mask.width = width;
        this.mask.height = height;

        const maskCtx = this.mask.getContext("2d");
        this.image.onload = () => {
            maskCtx.fillStyle = color;
            maskCtx.rect(0, 0, this.width, this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation = "destination-atop";
            maskCtx.drawImage(this.image, 0, 0, this.width, this.height);
        }
    }

    public update(roadBorders: any[], traffic: Car[]) {
        if (!this.damaged) {
            this.move()
            this.polygon = this.createPolygon()
            this.damaged = this.assessDamage(roadBorders, traffic)
        }

        if (this.sensor) {
            this.sensor.update(roadBorders, traffic)
            const offsets = this.sensor.readings.map(
                s => s == null ? 0 : 1 - s.offset
            )

            const outputs = NeuralNetwork.feedForward(offsets, this.brain)

            if (this.useAI) {
                this.controls.forward = outputs[0]
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.reverse = outputs[3]
            }

        }
    }

    private createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2
        const alpha = Math.atan2(this.width, this.height)
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        })

        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        })

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        })

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        })

        return points
    }

    draw(ctx: CanvasRenderingContext2D, enableSensors = false) {

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle)
        if (!this.damaged) {
            ctx.drawImage(this.mask, -this.width / 2, -this.height / 2, this.width, this.height)
            ctx.globalCompositeOperation = "multiply"
        }

        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height)
        ctx.restore()

        if (this.sensor && enableSensors) {
            this.sensor.draw(ctx)
        }
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

    private assessDamage(roadBorders: any[], traffic: Car[]) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersection(this.polygon, roadBorders[i])) {
                return true
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersection(this.polygon, traffic[i].polygon)) {
                return true
            }
        }

        return false
    }
}

export default Car