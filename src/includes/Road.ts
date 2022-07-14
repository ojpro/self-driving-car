import {lerp} from "./Utils";

export default class Road {
    private x: number;
    private laneCount: number;
    private width: number;
    private left: number;
    private right: number;
    private top: number;
    private bottom: number;

    constructor(x, width, laneCount = 3) {
        this.x = x
        this.width = width
        this.laneCount = laneCount

        this.left = this.x - width / 2
        this.right = this.x + width / 2

        const infinity = 10000000
        this.top = -infinity
        this.bottom = infinity
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 5
        ctx.strokeStyle = 'white'

        for (let i = 0; i <= this.laneCount; i++) {
            const x = lerp(
                this.left,
                this.right,
                i / this.laneCount
            )

            if (i > 0 && i < this.laneCount) {
                ctx.setLineDash([20, 20])
            } else {
                ctx.setLineDash([])
            }

            ctx.beginPath()
            ctx.moveTo(x, this.top)
            ctx.lineTo(x, this.bottom)
            ctx.stroke()
        }
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount
        return this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount -1) * laneWidth
    }
}