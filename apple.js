class Apple{

    constructor(canvasWidth, canvasHeight, unit) {

        this.x = 0;
        this.y = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.unit = unit;

    }

    spawn() {
        this.x = (Math.random() * (this.canvasWidth - (2 * this.unit))) + this.unit;
        this.x = this.x - (this.x % this.unit);
        this.y = (Math.random() * (this.canvasHeight - (2 * this.unit))) + this.unit;
        this.y = this.y - (this.y % this.unit);
    }

    update(draw) {

        if (draw) {
            stroke(255, 0, 0);        
            point(this.x, this.y);        
        }
        
    }

}