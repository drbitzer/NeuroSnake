class Snake {

    constructor(canvasWidth, canvasHeight, unit, snake) {

        this.DIRECTIONS = {
            "up": 1,
            "right": 2,
            "down": 3,
            "left": 4
        }

        this.ACTION = {
            "ahead": 1,
            "left": 2,
            "right": 3
        }

        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
        this.unit = unit;

        //this.XSTART = floor(random(this.unit, (this.canvasWidth - 20) / this.unit)) * this.unit;
        //this.YSTART = floor(random(this.unit, (this.canvasHeight - 20) / this.unit)) * this.unit;
        this.XSTART = (Math.random() * (this.canvasWidth - (2 * this.unit))) + this.unit;
        this.YSTART = (Math.random() * (this.canvasHeight - (2 * this.unit))) + this.unit;
        this.XSTART = this.XSTART - (this.XSTART % this.unit);
        this.YSTART = this.YSTART - (this.YSTART % this.unit);
        this.PART_SIZE = 10;

        this.numSegments = 10;
        this.direction = floor((Math.random() * 3) + 1);
        this.score = 0;
        this.apples = 0;
        this.fitness = 0;
        this.lastAppleDist = 0;
        this.timeWOEat = 0;
        this.isAlive = true;

        this.xCor = [];
        this.yCor = [];

        //this.color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = [255, 255, 255];

        for (let i = 0; i < this.numSegments; i++) {
            this.xCor.push(this.XSTART + (i * this.PART_SIZE));
            this.yCor.push(this.YSTART);
        }    
        
        if (snake) {
            this.brain = snake.brain.copy();
        } else {
            this.brain = new NeuralNetwork(20, 12, 4);
        }
        
        this.apple = null;

    }    

    reset() {

        this.xCor = [];
        this.yCor = [];

        for (let i = 0; i < this.numSegments; i++) {
            this.xCor.push(this.XSTART + (i * this.PART_SIZE));
            this.yCor.push(this.YSTART);
        }           

    }

    update(draw) {
        
        this.timeWOEat++;
        if ( this.timeWOEat / 10 >= 40 ){
            this.isAlive = false;
            this.score -= (this.score * 80 / 100);
            return;
        }      
        
        this.score += 1;

        let snakeHeadX = this.xCor[this.xCor.length - 1];
        let snakeHeadY = this.yCor[this.yCor.length - 1];                                     

        let xCorSave = this.xCor.slice();
        let yCorSave = this.yCor.slice();
        xCorSave.pop();
        yCorSave.pop();
        
        let index = 0;

        //North
        let borderNorth = 0;
        let appleNorth = 0;
        let bodyNorth = 0;

        borderNorth = 1 / snakeHeadY;
        if (this.apple.x == snakeHeadX && this.apple.y < snakeHeadY)
            appleNorth = 1;
        index = xCorSave.findIndex(element => { return element == snakeHeadX });
        if (this.yCor[index] < snakeHeadY)
            bodyNorth = 1 / (snakeHeadY - this.yCor[index]);		

        //East
        let borderEast = 0;
        let appleEast = 0;
        let bodyEast = 0;        

        borderEast = 1 / (this.canvasWidth - snakeHeadX);
        if (this.apple.y == snakeHeadY && this.apple.x > snakeHeadX)
            appleEast = 1;
        index = yCorSave.findIndex(element => { return element == snakeHeadY });
        if (this.xCor[index] > snakeHeadX)
            bodyEast = 1 / (this.xCor[index] - snakeHeadX);  		
            
        //South
        let borderSouth = 0;
        let appleSouth = 0;
        let bodySouth = 0;        

        borderSouth = 1 / (this.canvasHeight - snakeHeadY);
        if (this.apple.x == snakeHeadX && this.apple.y > snakeHeadY)
            appleSouth = 1;
        index = xCorSave.findIndex(element => { return element == snakeHeadX });
        if (this.yCor[index] > snakeHeadY)
            bodySouth = 1 / (this.yCor[index] - snakeHeadY);  
            
        //West
        let borderWest = 0;
        let appleWest = 0;
        let bodyWest = 0;        

        borderWest = 1 / snakeHeadX;
        if (this.apple.y == snakeHeadY && this.apple.x < snakeHeadX)
            appleWest = 1;
        index = yCorSave.findIndex(element => { return element == snakeHeadY });
        if (this.xCor[index] < snakeHeadX)
            bodyWest = 1/ (snakeHeadX - this.xCor[index]);  
		
		
		let appleNE = 0;
		let bodyNE = 0;			
		let appleSE = 0;
		let bodySE = 0;
		let appleSW = 0;
		let bodySW = 0;
		let appleNW = 0;
		let bodyNW = 0;		
		
		for (let i = 0; i < this.numSegments; i++) {
			//North-East
			if (this.xCor[i] > this.snakeHeadX && this.yCor[i] < this.snakeHeadY){
				bodyNE = 1 / Math.sqrt( ( Math.pow(this.xCor[i] - this.snakeHeadX, 2) + Math.pow(this.yCor[i] - snakeHeadY, 2) ) );
			}
			
			if (this.apple.x > this.snakeHeadX && this.apple.y < this.snakeHeadY){
				appleNE = 1 / Math.sqrt( ( Math.pow(this.apple.x - this.snakeHeadX, 2) + Math.pow(this.apple.y - snakeHeadY, 2) ) );
			}	
			
			//South-East
			if (this.xCor[i] > this.snakeHeadX && this.yCor[i] > this.snakeHeadY){
				bodySE = 1 / Math.sqrt( ( Math.pow(this.xCor[i] - this.snakeHeadX, 2) + Math.pow(this.yCor[i] - snakeHeadY, 2) ) );
			}
			
			if (this.apple.x > this.snakeHeadX && this.apple.y > this.snakeHeadY){
				appleSE = 1 / Math.sqrt( ( Math.pow(this.apple.x - this.snakeHeadX, 2) + Math.pow(this.apple.y - snakeHeadY, 2) ) );
			}	

			//South-West
			if (this.xCor[i] < this.snakeHeadX && this.yCor[i] > this.snakeHeadY){
				bodySW = 1 / Math.sqrt( ( Math.pow(this.xCor[i] - this.snakeHeadX, 2) + Math.pow(this.yCor[i] - snakeHeadY, 2) ) );
			}
			
			if (this.apple.x < this.snakeHeadX && this.apple.y > this.snakeHeadY){
				appleSW = 1 / Math.sqrt( ( Math.pow(this.apple.x - this.snakeHeadX, 2) + Math.pow(this.apple.y - snakeHeadY, 2) ) );
			}	

			//North-West
			if (this.xCor[i] < this.snakeHeadX && this.yCor[i] < this.snakeHeadY){
				bodyNW = 1 / Math.sqrt( ( Math.pow(this.xCor[i] - this.snakeHeadX, 2) + Math.pow(this.yCor[i] - snakeHeadY, 2) ) );
			}
			
			if (this.apple.x < this.snakeHeadX && this.apple.y < this.snakeHeadY){
				appleNW = 1 / Math.sqrt( ( Math.pow(this.apple.x - this.snakeHeadX, 2) + Math.pow(this.apple.y - snakeHeadY, 2) ) );
			}				
		}		
            
        if (borderNorth == Infinity)
            borderNorth = 100;        

        if (bodyNorth == Infinity)
            bodyNorth = 100;

        if (borderEast == Infinity)
            borderEast = 100;

        if (bodyEast == Infinity)
            bodyEast = 100;            

        if (borderSouth == Infinity)
            borderSouth = 100;

        if (bodySouth == Infinity)
            bodySouth = 100;   
            
        if (borderWest == Infinity)
            borderWest = 100;

        if (bodyWest == Infinity)
            bodyWest = 100;           

        let prediction = [];
        prediction = this.brain.feedForward([borderNorth, appleNorth, bodyNorth,
										     appleNE, bodyNE,
                                             borderEast, appleEast, bodyEast,
											 appleSE, bodySE,
                                             borderSouth, appleSouth, bodySouth,
											 appleSW, bodySE,
                                             borderWest, appleWest, bodyWest,
											 appleNW, bodyNW]);
        
        index = Math.max(...prediction);
        index = prediction.findIndex(element => { return element == index });

        switch(index) {
            case 0:
                this.turn(this.DIRECTIONS.up);
                break;
            case 1:
                this.turn(this.DIRECTIONS.right);
                break;
            case 2:
                this.turn(this.DIRECTIONS.down);
                break;
            case 3:
                this.turn(this.DIRECTIONS.left);
                break;
        }

        stroke(this.color[0], this.color[1], this.color[2], 255);
        for (let i = 0; i < this.numSegments; i++) { //this.numSegments - 1
            if (draw) {
                //line(this.xCor[i], this.yCor[i], this.xCor[i + 1], this.yCor[i + 1]);
                point(this.xCor[i], this.yCor[i]);
            }
        }              
    }

    turn(direction) {        
        for (var i = 0; i < this.numSegments - 1; i++) {
            this.xCor[i] = this.xCor[i + 1];
            this.yCor[i] = this.yCor[i + 1];
        }   

        switch (direction) {
            case this.DIRECTIONS.right:
                this.xCor[this.numSegments - 1] = this.xCor[this.numSegments - 1] + this.PART_SIZE;
                this.yCor[this.numSegments - 1] = this.yCor[this.numSegments - 1];
                break;
            case this.DIRECTIONS.up:
                this.xCor[this.numSegments - 1] = this.xCor[this.numSegments - 1];
                this.yCor[this.numSegments - 1] = this.yCor[this.numSegments - 1] - this.PART_SIZE;
                break;
            case this.DIRECTIONS.left:
                this.xCor[this.numSegments - 1] = this.xCor[this.numSegments - 1] - this.PART_SIZE;
                this.yCor[this.numSegments - 1] = this.yCor[this.numSegments - 1];
                break;
            case this.DIRECTIONS.down:
                this.xCor[this.numSegments - 1] = this.xCor[this.numSegments - 1];
                this.yCor[this.numSegments - 1] = this.yCor[this.numSegments - 1] + this.PART_SIZE;
                break;
        }   
        
        this.direction = direction;
    }

    newSegment() {

        this.xCor.unshift(this.xCor[0]);
        this.yCor.unshift(this.yCor[0]);
        this.numSegments++;  
        this.apples += 1;    
        this.timeWOEat = 0;

        this.color[1] -= 10;
        this.color[2] -= 10;
    }

    set newDirection(newDirection) {    
        this.direction = newDirection;
    }   
    
    setApple(apple) {
        this.apple = apple;

        let snakeHeadX = this.xCor[this.xCor.length - 1];
        let snakeHeadY = this.yCor[this.yCor.length - 1];       
        this.lastAppleDist = Math.sqrt( ( Math.pow(this.apple.x/this.canvasWidth - snakeHeadX/this.canvasWidth, 2) + 
                             Math.pow(this.apple.y/this.canvasHeight - snakeHeadY/this.canvasHeight, 2) ) );
    }

}