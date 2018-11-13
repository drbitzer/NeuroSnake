class Apple{

    constructor(canvasWidth, canvasHeight, unit) {

        this.x = 0;
        this.y = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.unit = unit;

    }

    spawn() {
        this.x = floor(random(this.unit, (this.canvasWidth - 20) / this.unit)) * this.unit;
        this.y = floor(random(this.unit, (this.canvasHeight - 20) / this.unit)) * this.unit;        
    }

    update() {

        stroke(255, 0, 0);        
        point(this.x, this.y);        
        
    }

}