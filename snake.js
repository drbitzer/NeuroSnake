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
            this.brain = new NeuralNetwork(11, 7, 3);
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

        let leftBorderDist = 0;
        let rightBorderDist = 0;
        let aheadBorderDist = 0;
        let appleAhead = 0;
        let appleLeft = 0;
        let appleRight = 0;
        let bodyAhead = 0;
        let bodyLeft = 0;
        let bodyRight = 0;
        let appleDist = Math.sqrt( ( Math.pow(this.apple.x - snakeHeadX, 2) + 
                                     Math.pow(this.apple.y - snakeHeadY, 2) ) );                                     

        let xCorSave = this.xCor.slice();
        let yCorSave = this.yCor.slice();
        this.xCor.pop();
        this.yCor.pop();

        let index = 0;
        switch(this.direction) {
            case this.DIRECTIONS.up:
                leftBorderDist = snakeHeadX / this.unit; // this.canvasWidth;
                rightBorderDist = ( this.canvasWidth - snakeHeadX ) / this.unit; // this.canvasWidth;
                aheadBorderDist = snakeHeadY / this.unit; // this.canvasHeight;
                appleAhead = ( snakeHeadY - this.apple.y ) / this.unit; // appleDist;
                appleLeft = ( snakeHeadX - this.apple.x ) / this.unit; // appleDist;
                appleRight = ( this.apple.x - snakeHeadX ) / this.unit; // appleDist;

                index = this.xCor.findIndex( element => { return element == snakeHeadX; });
                if ( this.yCor[index] < snakeHeadY) {
                    //bodyAhead = this.PART_SIZE / ( snakeHeadY - this.yCor[index] );
                    bodyAhead = ( snakeHeadY - this.yCor[index] ) / this.unit;
                }
    
                index = this.yCor.findIndex( element => { return element == snakeHeadY; });
                if ( this.xCor[index] < snakeHeadX) {
                    //bodyLeft = this.PART_SIZE / ( snakeHeadX - this.xCor[index] );
                    bodyAhead = ( snakeHeadX - this.xCor[index] ) / this.unit;
                }                

                index = this.yCor.findIndex( element => { return element == snakeHeadY; });
                if ( this.xCor[index] > snakeHeadX) {
                    //bodyRight = this.PART_SIZE / ( this.xCor[index] - snakeHeadX );
                    bodyRight = ( this.xCor[index] - snakeHeadX ) / this.unit;
                }                

                break;

            case this.DIRECTIONS.right:
                leftBorderDist = snakeHeadY / this.unit; // this.canvasHeight;
                rightBorderDist = ( this.canvasHeight - snakeHeadY ) / this.unit; // this.canvasHeight;
                aheadBorderDist = ( this.canvasWidth - snakeHeadX ) / this.unit; // this.canvasWidth;
                appleAhead = ( this.apple.x - snakeHeadX ) / this.unit; // appleDist;
                appleLeft = ( snakeHeadY - this.apple.y ) / this.unit; // appleDist;
                appleRight = ( this.apple.y - snakeHeadY ) / this.unit; // appleDist;           

                index = this.yCor.findIndex( element => { return element == snakeHeadY; });
                if ( this.xCor[index] > snakeHeadX) {
                    //bodyAhead = this.PART_SIZE / ( this.xCor[index] - snakeHeadX );
                    bodyAhead = ( this.xCor[index] - snakeHeadX ) / this.unit;
                }
    
                index = this.xCor.findIndex( element => { return element == snakeHeadX; });
                if ( this.yCor[index] < snakeHeadY) {
                    //bodyLeft = this.PART_SIZE / ( snakeHeadY - this.yCor[index] );
                    bodyLeft = ( snakeHeadY - this.yCor[index] ) / this.unit;
                }                

                index = this.xCor.findIndex( element => { return element == snakeHeadX; });
                if ( this.yCor[index] > snakeHeadY) {
                    //bodyRight = this.PART_SIZE / ( this.yCor[index] - snakeHeadY );
                    bodyRight = ( this.yCor[index] - snakeHeadY ) / this.unit;
                }                   

                break;                 

            case this.DIRECTIONS.down:
                leftBorderDist = ( this.canvasWidth - snakeHeadX ) / this.unit; // this.canvasWidth;
                rightBorderDist = snakeHeadX / this.unit; // this.canvasHeight;
                aheadBorderDist = ( this.canvasHeight - snakeHeadY ) / this.unit; // this.canvasHeight;
                appleAhead = ( this.apple.y - snakeHeadY ) / this.unit; // appleDist;
                appleLeft = ( this.apple.x - snakeHeadX ) / this.unit; // appleDist;
                appleRight = ( snakeHeadX - this.apple.x ) / this.unit; // appleDist;
                
                index = this.xCor.findIndex( element => { return element == snakeHeadX; });
                if ( this.yCor[index] > snakeHeadY) {
                    //bodyAhead = this.PART_SIZE / ( this.yCor[index] - snakeHeadY );
                    bodyAhead = ( this.yCor[index] - snakeHeadY ) / this.unit;
                }
    
                index = this.yCor.findIndex( element => { return element == snakeHeadY; });
                if ( this.xCor[index] > snakeHeadX) {
                    //bodyLeft = this.PART_SIZE / (this.xCor[index] - snakeHeadX);
                    bodyLeft = (this.xCor[index] - snakeHeadX) / this.unit;
                }                

                index = this.yCor.findIndex( element => { return element == snakeHeadY; });
                if ( this.xCor[index] < snakeHeadX) {
                    //bodyRight = this.PART_SIZE / ( snakeHeadX - this.xCor[index] );
                    bodyRight = ( snakeHeadX - this.xCor[index] ) / this.unit;
                }                    
                
                break; 

            case this.DIRECTIONS.left:
                leftBorderDist = ( this.canvasHeight - snakeHeadY ) / this.unit; // this.canvasHeight;
                rightBorderDist = snakeHeadY  / this.unit; // this.canvasHeight;
                aheadBorderDist = snakeHeadX / this.unit; // this.canvasWidth;
                appleAhead = ( snakeHeadX - this.apple.x ) / this.unit; // appleDist;
                appleLeft = ( this.apple.y - snakeHeadY ) / this.unit; // appleDist;
                appleRight = ( snakeHeadY - this.apple.y ) / this.unit; // appleDist;    
                
                index = this.yCor.findIndex( element => { return element == snakeHeadY; });
                if ( this.xCor[index] < snakeHeadX) {
                    //bodyAhead = this.PART_SIZE / (snakeHeadX - this.xCor[index]);
                    bodyAhead = (snakeHeadX - this.xCor[index]) / this.unit;
                }
    
                index = this.xCor.findIndex( element => { return element == snakeHeadX; });
                if ( this.yCor[index] > snakeHeadY) {
                    //bodyLeft = this.PART_SIZE / (this.yCor[index] - snakeHeadY);
                    bodyLeft = (this.yCor[index] - snakeHeadY) / this.unit;
                }                

                index = this.xCor.findIndex( element => { return element == snakeHeadX; });
                if ( this.yCor[index] < snakeHeadY) {
                    //bodyRight = this.PART_SIZE / (snakeHeadY - this.yCor[index]);
                    bodyRight = (snakeHeadY - this.yCor[index]) / this.unit;
                }                   
                
                break;             
        }       
        
        this.xCor = xCorSave.slice();
        this.yCor = yCorSave.slice();

        if (appleAhead < 0) appleAhead = 0;
        if (appleLeft < 0) appleLeft= 0;
        if (appleRight < 0) appleRight = 0;                  
        
        this.lastAppleDist = appleDist;   

        let directionInput = 1 / this.direction;

        if (aheadBorderDist)
            aheadBorderDist = 1 / aheadBorderDist;

        if (leftBorderDist)
            leftBorderDist = 1 / leftBorderDist;

        if (rightBorderDist)
            rightBorderDist = 1 / rightBorderDist;

        if (appleAhead)
            appleAhead = 1 / appleAhead;

        if (appleLeft)
            appleLeft = 1 / appleLeft;

        if (appleRight)
            appleRight = 1 / appleRight;

        if (bodyAhead)
            bodyAhead = 1 / bodyAhead;

        if (bodyLeft)
            bodyLeft = 1 / bodyLeft;

        if (bodyRight)
            bodyRight = 1 / bodyRight;

        let currentLength = 1 / this.numSegments;

        

        let prediction = [];
        prediction = this.brain.feedForward([directionInput, aheadBorderDist, leftBorderDist, rightBorderDist, appleAhead, appleLeft, appleRight, bodyAhead, bodyLeft, bodyRight, currentLength]);
        
        let probability = 0;
        index = 0;
        let action;
        prediction.forEach(element => {
            index++;
            if (element > probability) {
                probability = element;

                switch (index) {
                    case 1:
                        action = this.ACTION.ahead;
                        break;
                    case 2:
                        action = this.ACTION.left;
                        break;
                    case 3:
                        action = this.ACTION.right;
                        break;
                }
                
            }            
        });

        switch(action) {
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
        this.lastAppleDist = Math.sqrt( ( Math.pow(this.apple.x/this.canvasWidth - snakeHeadX/this.canvasWidth, 2) + 
                             Math.pow(this.apple.y/this.canvasHeight - snakeHeadY/this.canvasHeight, 2) ) );
    }

}