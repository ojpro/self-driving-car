export default class Controls {
    public forward: boolean;
    public left: boolean;
    public right: boolean;
    public reverse: boolean;

    constructor() {
        this.forward = false
        this.left = false
        this.right = false
        this.reverse = false

        this.addKeywordListener()
    }

    private addKeywordListener() {
        // listen for pressed keys
        document.onkeydown = (event) => {

            switch (event.key) {
                case   "ArrowUp":
                case "w":
                    this.forward = true
                    break
                case "ArrowRight":
                case "d":
                    this.right = true
                    break
                case "ArrowDown":
                case "s":
                    this.reverse = true
                    break
                case "ArrowLeft":
                case "a":
                    this.left = true
                    break
            }

        }

        // turn off controls
        document.onkeyup = (event) => {

            switch (event.key) {
                case   "ArrowUp":
                case "w":
                    this.forward = false
                    break
                case "ArrowRight":
                case "d":
                    this.right = false
                    break
                case "ArrowDown":
                case "s":
                    this.reverse = false
                    break
                case "ArrowLeft":
                case "a":
                    this.left = false
                    break
            }

        }
    }
}

