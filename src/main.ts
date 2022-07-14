// $ vanilla magic selector

import Car from './includes/Car'

import {$} from './includes/Utils'

// Let's Do it
const canvas: HTMLCanvasElement = $('#canvas')

canvas.width = 300

const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const car: Car = new Car(100, 100, 40, 60)

animate()

function animate() {
    car.update()

    canvas.height = window.innerHeight
    car.draw(ctx)
    requestAnimationFrame(animate)
}