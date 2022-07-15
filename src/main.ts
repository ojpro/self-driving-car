// $ vanilla magic selector

import Car from './includes/Car'
import Road from "./includes/Road";

import { $ } from './includes/Utils'

// Let's Do it
const canvas: HTMLCanvasElement = $('#canvas')

canvas.width = 300

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * .94);
const car: Car = new Car(road.getLaneCenter(1), 100, 50, 80,"SELF",4)

const traffic = [
    new Car(road.getLaneCenter(1), -100, 50, 80)
]

animate()

function animate() {

    for(let i = 0;i<traffic.length;i++){
        traffic[i].update(road.borders,[])
    }

    car.update(road.borders,traffic)

    canvas.height = window.innerHeight

    ctx.save()
    ctx.translate(0, -car.y + canvas.height * .8)

    road.draw(ctx)

    for(let i = 0;i<traffic.length;i++){
        traffic[i].draw(ctx, "purple")
    }

    car.draw(ctx,'blue')

    ctx.restore()
    requestAnimationFrame(animate)
}