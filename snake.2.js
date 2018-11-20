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
            this.brain = new NeuralNetwork(32, 18, 4);
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

    look(dirX, dirY) {
        let vision = [0, 0, 0, 0];

        let snakeHeadX = this.xCor[this.numSegments - 1];
        let snakeHeadY = this.yCor[this.numSegments - 1];

        let curPosX = snakeHeadX;
        let curPosY = snakeHeadY;

        let distance = 0;

        let borderFound = false;
        let appleFound = false;
        let bodyFound = false;

        while (!borderFound) {
            curPosX += dirX;
            curPosY += dirY;
            distance++;

            //Border
            if ( (curPosX <= 0 || curPosX >= this.canvasWidth || curPosY <= 0 || curPosY >= this.canvasHeight) && !borderFound) {
                vision[0] = 1 / distance;
                borderFound = true;
            }

            //Apple
            //Is the Apple straight ahead on this direction?
            if (curPosX == this.apple.x && curPosY == this.apple.y && !appleFound) {
                vision[1] = 1;
                appleFound = true;
            }                        

            //Body
            if (!bodyFound)
                for (let i = 0; i < this.numSegments - 1; i++)
                    if (curPosX == this.xCor[i] && curPosY == this.yCor[i]) {
                        vision[2] = 1 / distance;
                        bodyFound = true;
                        break;
                    }
        }

        //Is the apple on that side?
        if (Math.sign(dirX) >= 0 && Math.sign(dirY) <= 0) { //Nort North-East
            if (this.apple.x >= snakeHeadX && this.apple.y <= snakeHeadY)
                vision[3] = 1;
        } else if (Math.sign(dirX) >= 0 && Math.sign(dirY) >= 0) {  //East South-East
            if (this.apple.x >= snakeHeadX && this.apple.y >= snakeHeadY)
                vision[3] = 1;
        } else if (Math.sign(dirX) <= 0 && Math.sign(dirY) >= 0) {  //South-West West
            if (this.apple.x <= snakeHeadX && this.apple.y >= snakeHeadY)
                vision[3] = 1;
        } else if (Math.sign(dirX) <= 0 && Math.sign(dirY) <= 0) {  //North-West North
            if (this.apple.x <= snakeHeadX && this.apple.y <= snakeHeadY)
                vision[3] = 1;
        }

        return vision;
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

        let input = [];
        let vision = [];

        //North
        vision = this.look(0, -10);
        input.push(...vision);

        //NorthEast
        vision = this.look(10, -10);
        input.push(...vision);

        //East
        vision = this.look(10, 0);
        input.push(...vision);
        
        //SouthEast
        vision = this.look(10, 10);
        input.push(...vision);  
            
        //South
        vision = this.look(0, 10);
        input.push(...vision);
        
        //SouthWest
        vision = this.look(-10, 10);
        input.push(...vision);

        //West
        vision = this.look(-10, 0);
        input.push(...vision);
        
        //NorthWest
        vision = this.look(-10, -10);
        input.push(...vision);      

        let prediction = [];
        prediction = this.brain.feedForward(input);
                
        let index = Math.max(...prediction);
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