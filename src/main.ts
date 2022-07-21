// $ vanilla magic selector

import Car from './includes/Car'
import Road from "./includes/Road";

import { $ } from './includes/Utils'
import Visualizer from "./includes/Visualizer";
import NeuralNetwork from "./includes/Network";

// Let's Do it
const carCanvas: HTMLCanvasElement = $('#carCanvas')
const networkCanvas: HTMLCanvasElement = $('#networkCanvas')

carCanvas.width = 300
networkCanvas.width = 1000

const carCtx: CanvasRenderingContext2D = carCanvas.getContext('2d');
const networkCtx: CanvasRenderingContext2D = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * .94);

$("#carsCount").onchange = ()=>{
    localStorage.setItem('carsCount',$("#carsCount").value)
    window.location.reload()
}

const cars: Car[] = generateCars(localStorage.getItem("carsCount") || 100)

const traffic = [
    new Car(road.getLaneCenter(1), -100, 50, 80),
    new Car(road.getLaneCenter(0), -400, 50, 80),
    new Car(road.getLaneCenter(2), -700, 50, 80),
    new Car(road.getLaneCenter(2), -1000, 50, 80),
    new Car(road.getLaneCenter(0), -1000, 50, 80),
    new Car(road.getLaneCenter(0), -1400, 50, 80),
    new Car(road.getLaneCenter(1), -1600, 50, 80),
    new Car(road.getLaneCenter(1), -2100, 50, 80),
    new Car(road.getLaneCenter(0), -2600, 50, 80),
    new Car(road.getLaneCenter(2), -2300, 50, 80),
    new Car(road.getLaneCenter(2), -3000, 50, 80),
]

let bestCar:Car = cars[0];

if(localStorage.getItem('bestBrain')){
    for (let i = 0;i<cars.length;i++){
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'))
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,.2)
        }
    }
}

animate()

$('#save').addEventListener('click',function  ()  {
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain))
})

$('#discard').addEventListener('click',function (){
    localStorage.removeItem("bestBrain")
})



function generateCars(n){
    const cars = []
    for (let i = 1;i<=n;i++){
        cars.push(new Car(road.getLaneCenter(1),100,50,80,"SELF",10,"purple"))
    }

    return cars
}

function animate() {

    for(let i = 0;i<traffic.length;i++){
        traffic[i].update(road.borders,[])
    }

    for(let i =0;i<cars.length;i++){
        cars[i].update(road.borders,traffic)
    }

    bestCar = cars.find(
        car => car.y == Math.min(...cars.map(car => car.y))
    );

    carCanvas.height = window.innerHeight
    networkCanvas.height = window.innerHeight

    carCtx.save()
    carCtx.translate(0, -bestCar.y + carCanvas.height * .8)

    road.draw(carCtx)

    for(let i = 0;i<traffic.length;i++){
        traffic[i].draw(carCtx )
    }

    carCtx.globalAlpha = .2
    for(let i =0;i<cars.length;i++) {
        cars[i].draw(carCtx)
    }
    carCtx.globalAlpha = 1
    bestCar.draw(carCtx,true)
    
    carCtx.restore()

    Visualizer.drawNetwork(networkCtx,bestCar.brain);

    requestAnimationFrame(animate)
}