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
            this.brain = new NeuralNetwork(4, 3, 3);
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

        let appleDist = Math.sqrt( ( Math.pow(this.apple.x - snakeHeadX, 2) + 
                                     Math.pow(this.apple.y - snakeHeadY, 2) ) );                                                                          

        let left = 0;
        let right = 0;
        let ahead = 0;

        let index = 0;
        switch(this.direction) {
            case this.DIRECTIONS.up:
                //Left
                if (this.apple.x == snakeHeadX - 10 && this.apple.y == snakeHeadY)
                    left = 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX - 10 && this.yCor[i] == snakeHeadY) {
                        left = -1;
                        break;
                    }
                }
                
                if (snakeHeadX - 10 == 0)
                    left = -1;

                //Right
                if (this.apple.x == snakeHeadX + 10 && this.apple.y == snakeHeadY)
                    right= 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX + 10 && this.yCor[i] == snakeHeadY) {
                        right = -1;
                        break;
                    }
                }

                if (snakeHeadX + 10 == this.canvasWidth)
                    right = -1;      
                    
                //Ahead
                if (this.apple.x == snakeHeadX && this.apple.y == snakeHeadY - 10)
                    ahead= 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX && this.yCor[i] == snakeHeadY - 10) {
                        ahead = -1;
                        break;
                    }
                }

                if (snakeHeadY - 10 == 0)
                    ahead = -1;                        

                break;

            case this.DIRECTIONS.right:  
                //Left
                if (this.apple.x == snakeHeadX  && this.apple.y == snakeHeadY - 10)
                    left = 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX && this.yCor[i] == snakeHeadY - 10) {
                        left = -1;
                        break;
                    }
                }
                
                if (snakeHeadY - 10 == 0)
                    left = -1;

                //Right
                if (this.apple.x == snakeHeadX && this.apple.y == snakeHeadY + 10)
                    right= 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX && this.yCor[i] == snakeHeadY + 10) {
                        right = -1;
                        break;
                    }
                }

                if (snakeHeadY + 10 == this.canvasHeight)
                    right = -1;      
                    
                //Ahead
                if (this.apple.x == snakeHeadX + 10 && this.apple.y == snakeHeadY)
                    ahead= 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX + 10 && this.yCor[i] == snakeHeadY) {
                        ahead = -1;
                        break;
                    }
                }

                if (snakeHeadX + 10 == this.canvasWidth)
                    ahead = -1;                         

                break;                 

            case this.DIRECTIONS.down:
                //Left
                if (this.apple.x == snakeHeadX + 10 && this.apple.y == snakeHeadY)
                    left = 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX + 10 && this.yCor[i] == snakeHeadY) {
                        left = -1;
                        break;
                    }
                }
                
                if (snakeHeadX + 10 == this.canvasWidth)
                    left = -1;

                //Right
                if (this.apple.x == snakeHeadX - 10 && this.apple.y == snakeHeadY)
                    right= 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX - 10 && this.yCor[i] == snakeHeadY) {
                        right = -1;
                        break;
                    }
                }

                if (snakeHeadX - 10 == 0)
                    right = -1;      
                    
                //Ahead
                if (this.apple.x == snakeHeadX && this.apple.y == snakeHeadY + 10)
                    ahead= 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX && this.yCor[i] == snakeHeadY + 10) {
                        ahead = -1;
                        break;
                    }
                }

                if (snakeHeadY + 10 == this.canvasHeight)
                    ahead = -1;  

                break; 

            case this.DIRECTIONS.left:              
                //Left
                if (this.apple.x == snakeHeadX  && this.apple.y == snakeHeadY + 10)
                    left = 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX && this.yCor[i] == snakeHeadY + 10) {
                        left = -1;
                        break;
                    }
                }
                
                if (snakeHeadY + 10 == this.canvasHeight)
                    left = -1;

                //Right
                if (this.apple.x == snakeHeadX && this.apple.y == snakeHeadY - 10)
                    right= 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX && this.yCor[i] == snakeHeadY - 10) {                        
                        right = -1;
                        break;
                    }
                }

                if (snakeHeadY - 10 == 0)
                    right = -1;      
                    
                //Ahead
                if (this.apple.x == snakeHeadX - 10 && this.apple.y == snakeHeadY)
                    ahead= 1;
                
                for (let i = this.numSegments - 2; i >=0; i--){
                    if (this.xCor[i] == snakeHeadX - 10 && this.yCor[i] == snakeHeadY) {
                        ahead = -1;
                        break;
                    }
                }

                if (snakeHeadX - 10 == 0)
                    ahead = -1;                                         

                break;             
        }        

        appleDist = 1 / appleDist;

        let prediction = [];
        prediction = this.brain.feedForward([ahead, left, right, appleDist]);
                
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
        this.apples += 10;    
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