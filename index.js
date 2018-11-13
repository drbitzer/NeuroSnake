let scoreElem;
let speedElem;
let drawSnake = true;
let drawBtn;
let snakeArr = [];
let snakeSave = [];
let bestScoreSnake = null;
let slider;

let MAX = 2000;
let generation = 1;

function setup() {
  createCanvas(500, 500);

  scoreElem = createDiv('Generation = ' + generation);
  scoreElem.position(20, 20);
  scoreElem.id = 'generation';
  scoreElem.style('color', 'white');

  slider = createSlider(0, 100, 1, 1); 
  speedElem = createDiv('Speed = x' + slider.value());
  speedElem.position(20, 40);
  speedElem.style('color', 'white');  

  drawBtn = createButton('Set Draw');
  drawBtn.position(0, 550);
  drawBtn.mousePressed(toggleDraw);
  
  frameRate(10);
  stroke(255);
  strokeWeight(10); 

  for (let i = 0; i < MAX; i++){
    snakeArr.push(new Snake(500, 500, 10));
    snakeArr[i].setApple(new Apple(500, 500, 10));
    snakeArr[i].apple.spawn()
  }

}

function toggleDraw() {
  if (drawSnake) {
    drawSnake = false;
  } else {
    drawSnake = true;
  }
}

function draw() {
  
    background(0);

    speedElem.html('Speed = x' + slider.value());
    let rate = slider.value();

    for (let i = 0; i < rate; i++) {

      for (let j = 0; j < snakeArr.length; j++) {
        if (snakeArr[j].isAlive == false) {
          snakeSave.push(snakeArr[j]);
          snakeArr.splice(j, 1);          
        } else {
          checkGameStatus(snakeArr[j], j);  
          if (snakeArr[j] != null) {
            checkForFruit(snakeArr[j]);     
            snakeArr[j].apple.update();          
            snakeArr[j].update(drawSnake);
          }
        }
      }
            
    }
    
    if (snakeArr.length == 0) {      
      generation++;
      scoreElem.html('Generation = ' + generation);

      calcFitness();

      let bestSnake1 = snakeSave[0];
      let bestSnake2 = snakeSave[0];
      let fitness = 0;
      let bestFitness = 0;
      let bestSnakeIndex = 0;

      for (let i = 0; i < snakeSave.length; i++) {
        fitness = snakeSave[i].fitness;
        if (fitness > bestFitness) {
          bestSnake1 = snakeSave[i];
          bestFitness = fitness;
          bestSnakeIndex = i;
        }
      }
      snakeSave.splice(bestSnakeIndex, 1);

      fitness = 0;
      bestFitness = 0;
      for (let i = 0; i < snakeSave.length; i++) {
        fitness = snakeSave[i].fitness;
        if (fitness > bestFitness) {
          bestSnake2 = snakeSave[i];
          bestFitness = fitness;
          bestSnakeIndex = i;
        }
      }      

      snakeSave = [];
      for (let i = 0; i < MAX; i++){        
        snakeArr.push(new Snake(500, 500, 10, bestSnake1));
        snakeArr[i].brain.combine(bestSnake2.brain);
        snakeArr[i].brain.mutate(0.3);
        snakeArr[i].setApple(new Apple(500, 500, 10));
        snakeArr[i].apple.spawn();
      }          
    }
}

function calcFitness() {
  snakeSave.forEach(element => {
    element.fitness = ( element.apples + element.score ) / 2;    
  });
}

function checkGameStatus(snake, index) {
    
    if (snake.xCor[snake.xCor.length - 1] > width ||
        snake.xCor[snake.xCor.length - 1] < 0 ||
        snake.yCor[snake.yCor.length - 1] > height ||
        snake.yCor[snake.yCor.length - 1] < 0 || checkSnakeCollision(snake)) { 

/*             noLoop();
            var scoreVal = parseInt(scoreElem.html().substring(8));
            scoreElem.html('Game ended! Your score was : ' + scoreVal); */

            snakeSave.push(snake);
            snakeArr.splice(index, 1);

    }
}

function checkSnakeCollision(snake) {

  let snakeHeadX = snake.xCor[snake.xCor.length - 1];
  let snakeHeadY = snake.yCor[snake.yCor.length - 1];

  for (var i = 0; i < snake.xCor.length - 1; i++) {
    if (snake.xCor[i] === snakeHeadX && snake.yCor[i] === snakeHeadY) {
      return true;
    }
  }

}

function checkForFruit(snake) {

  if (snake.xCor[snake.xCor.length - 1] === snake.apple.x && snake.yCor[snake.yCor.length - 1] === snake.apple.y) {  

    snake.newSegment();
    snake.apple.spawn();  

/*     snakeArr.forEach(element => {
      element.setApple(apple);
    }); */

  }

}

/* function keyPressed() {
  switch (keyCode) {
    case 37:
      if (snake.direction != snake.DIRECTIONS.right) {
        snake.newDirection = snake.DIRECTIONS.left;    
      }
      break;
    case 39:
      if (snake.irection != snake.DIRECTIONS.left) {
        snake.newDirection = snake.DIRECTIONS.right;
      }
      break;
    case 38:
      if (snake.direction != snake.DIRECTIONS.down) {
        snake.newDirection = snake.DIRECTIONS.up;
      }
      break;
    case 40:
      if (snake.direction != snake.DIRECTIONS.up) {
        snake.newDirection = snake.DIRECTIONS.down;
      }
      break;
  }
} */
