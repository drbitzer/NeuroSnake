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
            this.brain = new NeuralNetwork(7, 25, 3);
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
            this.score -= (this.score * 40 / 100);
            return;
        }      
        
        this.score += 1;

        let snakeHeadX = this.xCor[this.xCor.length - 1];
        let snakeHeadY = this.yCor[this.yCor.length - 1];     

        let appleDist = Math.sqrt( ( Math.pow(this.apple.x - snakeHeadX, 2) + 
                                     Math.pow(this.apple.y - snakeHeadY, 2) ) );                                                                          

        let left = 0;
        let right = 0;
        let ahead = 0;
		let appleAngle = 0;			
		let aheadWall = 0;
		let rightWall = 0;
		let leftWall = 0;
		let appleVect = createVector(this.apple.x - snakeHeadX, this.apple.y - snakeHeadY);
		let snakeDirVect = null;

        let index = 0;
        switch(this.direction) {
            case this.DIRECTIONS.up:
				//Calculate the angle between the snake direction vector and the apple vector
                snakeDirVect = createVector(0, -snakeHeadY);				
                
                if (!snakeDirVect.equals(0,0))
                    appleAngle = degrees(snakeDirVect.angleBetween(appleVect)) / 180;
                else
                    appleAngle = degrees(appleVect.heading()) / 180;
                
				if (this.apple.x < snakeHeadX)
					appleAngle = -appleAngle;
				
				//Left: Body?
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] < snakeHeadX && this.yCor[i] == snakeHeadY) {
                        left = (snakeHeadX - this.xCor[i]) / this.canvasWidth;
                        break;
                    }
                }
                
				//Left: Wall?				
				leftWall = snakeHeadX / this.canvasWidth;

                //Right: Body?                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] > snakeHeadX  && this.yCor[i] == snakeHeadY) {
                        right = (this.xCor[i] - snakeHeadX) / this.canvasWidth;
                        break;
                    }
                }
				
				//Right: Wall?                
                rightWall = (this.canvasWidth - snakeHeadX) / this.canvasWidth;      
                    
                //Ahead: Body?                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX && this.yCor[i] < snakeHeadY) {
                        ahead = (snakeHeadY - this.yCor[i]) / this.canvasHeight;
                        break;
                    }
                }
	
				//Ahead: Wall?
				aheadWall = snakeHeadY / this.canvasHeight;                        

                break;

            case this.DIRECTIONS.right:  
				//Calculate the angle between the snake direction vector and the apple vector
                snakeDirVect = createVector(snakeHeadX, 0);	
                
                if (!snakeDirVect.equals(0,0))
                    appleAngle = degrees(snakeDirVect.angleBetween(appleVect)) / 180;
                else
                    appleAngle = degrees(appleVect.heading()) / 180;                
                
				if (this.apple.y < snakeHeadY)
					appleAngle = -appleAngle;
				
				//Left: Body?
                for (let i = this.numSegments - 2; i >= 0; i--){
                    if (this.xCor[i] == snakeHeadX && this.yCor[i] < snakeHeadY) {
                        left = (snakeHeadY - this.yCor[i]) / this.canvasHeight;
                        break;
                    }
                }
                
				//Left: Wall?				
				leftWall = snakeHeadY / this.canvasHeight;

                //Right: Body?                
                for (let i = this.numSegments - 2; i >= 0; i--){
                    if (this.xCor[i] == snakeHeadX  && this.yCor[i] > snakeHeadY) {
                        right = (this.yCor[i] - snakeHeadY) / this.canvasHeight;
                        break;
                    }
                }
				
				//Right: Wall?               
                rightWall = (this.canvasHeight - snakeHeadY) / this.canvasHeight;      
                    
                //Ahead: Body?                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] > snakeHeadX && this.yCor[i] == snakeHeadY) {
                        ahead = (this.xCor[i] - snakeHeadX) / this.canvasWidth;
                        break;
                    }
                }
	
				//Ahead: Wall?                
				aheadWall = (this.canvasWidth - snakeHeadX) / this.canvasWidth;                        

                break;               

            case this.DIRECTIONS.down:
				//Calculate the angle between the snake direction vector and the apple vector
                snakeDirVect = createVector(0, snakeHeadY);	
                            
                if (!snakeDirVect.equals(0,0))
                    appleAngle = degrees(snakeDirVect.angleBetween(appleVect)) / 180;
                else
                    appleAngle = degrees(appleVect.heading()) / 180;                
                
				if (this.apple.x > snakeHeadX)
					appleAngle = -appleAngle;
				
				//Left: Body?
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] > snakeHeadX && this.yCor[i] == snakeHeadY) {
                        left = (this.xCor[i] - snakeHeadX) / this.canvasWidth;
                        break;
                    }
                }
                
				//Left: Wall?				
				leftWall = (this.canvasWidth - snakeHeadX) / this.canvasWidth;

                //Right: Body?                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] < snakeHeadX  && this.yCor[i] == snakeHeadY) {
                        right = (snakeHeadX - this.xCor[i]) / this.canvasWidth;
                        break;
                    }
                }
				
				//Right: Wall?                
                rightWall = snakeHeadX / this.canvasWidth;      
                    
                //Ahead: Body?                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX && this.yCor[i] > snakeHeadY) {
                        ahead = (this.yCor[i] - snakeHeadY) / this.canvasHeight;
                        break;
                    }
                }
	
				//Ahead: Wall?                
				aheadWall = (this.canvasHeight - snakeHeadY) / this.canvasHeight;                        

                break;

            case this.DIRECTIONS.left:              
				//Calculate the angle between the snake direction vector and the apple vector
                snakeDirVect = createVector(-snakeHeadX, 0);
                				
                if (!snakeDirVect.equals(0,0))
                    appleAngle = degrees(snakeDirVect.angleBetween(appleVect)) / 180;
                else
                    appleAngle = degrees(appleVect.heading()) / 180;                
                
				if (this.apple.y > snakeHeadY)
					appleAngle = -appleAngle;
				
				//Left: Body?
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX && this.yCor[i] > snakeHeadY) {
                        left = (this.yCor[i] - snakeHeadY) / this.canvasHeight;
                        break;
                    }
                }
                
				//Left: Wall?
				leftWall = (this.canvasHeight - snakeHeadY) / this.canvasHeight;

                //Right: Body?                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX  && this.yCor[i] < snakeHeadY) {
                        right = (snakeHeadY - this.yCor[i]) / this.canvasHeight;
                        break;
                    }
                }
				
				//Right: Wall?                
				rightWall = snakeHeadY / this.canvasHeight;      
                    
                //Ahead: Body?                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] < snakeHeadX && this.yCor[i] == snakeHeadY) {
                        ahead = (snakeHeadX - this.xCor[i]) / this.canvasWidth;
                        break;
                    }
                }
	
				//Ahead: Wall?                
				aheadWall = snakeHeadX / this.canvasWidth;                        

                break;              
        }      
		
        let prediction = [];
        prediction = this.brain.feedForward([ahead, aheadWall, left, leftWall, right, rightWall, appleAngle]); 
                
        index = Math.max(...prediction);
        index = prediction.findIndex(element => { return element == index }) + 1; 

         switch(index) {
            case this.ACTION.ahead:
                this.turn(this.direction);
                break;
            case this.ACTION.left:
                switch (this.direction) {
                    case this.DIRECTIONS.right:
                        this.turn(this.DIRECTIONS.up);
                        break;
                    case this.DIRECTIONS.up:
                        this.turn(this.DIRECTIONS.left);
                        break;
                    case this.DIRECTIONS.left:
                        this.turn(this.DIRECTIONS.down);
                        break;
                    case this.DIRECTIONS.down:
                        this.turn(this.DIRECTIONS.right);
                        break;
                }    
                break;
            case this.ACTION.right:
                switch (this.direction) {
                    case this.DIRECTIONS.right:
                        this.turn(this.DIRECTIONS.down);
                        break;
                    case this.DIRECTIONS.up:
                        this.turn(this.DIRECTIONS.right);
                        break;
                    case this.DIRECTIONS.left:
                        this.turn(this.DIRECTIONS.up);
                        break;
                    case this.DIRECTIONS.down:
                        this.turn(this.DIRECTIONS.left);
                        break;
                }  
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
        this.apples += 1000;    
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
    }

}