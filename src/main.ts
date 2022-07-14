// $ vanilla magic selector

import Car from './includes/Car'
import Road from "./includes/Road";

import {$} from './includes/Utils'

// Let's Do it
const canvas: HTMLCanvasElement = $('#canvas')

canvas.width = 300

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * .94);
const car: Car = new Car(road.getLaneCenter(1), 100, 40, 60)

animate()

function animate() {
    car.update()

    canvas.height = window.innerHeight
    road.draw(ctx)
    car.draw(ctx)
    requestAnimationFrame(animate)
}