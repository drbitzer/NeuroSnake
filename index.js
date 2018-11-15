let scoreElem;
let speedElem;
let drawSnake = true;
let drawBtn;
let snakeArr = [];
let snakeSave = [];
let bestScoreSnake = null;
let slider;

let MAX = 1000;
let generation = 1;

//let savedSnake = "{\"DIRECTIONS\":{\"up\":1,\"right\":2,\"down\":3,\"left\":4},\"ACTION\":{\"ahead\":1,\"left\":2,\"right\":3},\"canvasHeight\":500,\"canvasWidth\":500,\"unit\":10,\"XSTART\":280,\"YSTART\":350,\"PART_SIZE\":10,\"numSegments\":111,\"direction\":1,\"score\":13728,\"apples\":1010,\"fitness\":7369,\"lastAppleDist\":410,\"timeWOEat\":100,\"isAlive\":true,\"xCor\":[470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,460,450,440,430,420,410,400,390,380,370,360,350,340,330,320,310,300,290,280,270,260,250,240,230,220,210,200,190,180,170,160,150,140,130,120,110,100,90,80,70,60,50,40,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30],\"yCor\":[290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,470,460,450,440,430,420,410,400,390,380,370,360,350,340,330,320,310,300,290,280,270,260,250,240,230,220,210,200,190,180,170,160,150,140,130,120,110,100,90,80,70,60,50,40,30,20,10,0,-10],\"color\":[255,-755,-755],\"brain\":{\"inputNodes\":11,\"hiddenNodes\":7,\"outputNodes\":3,\"weights_ih\":{\"rows\":7,\"cols\":11,\"data\":[[-0.14812172100455617,-1.5726795049146756,-1.3750460708029046,-0.7217331359518937,2.695326997642757,-0.8259956363060356,1.3212002040708244,0.3665498583879794,0.5224976678868659,-0.7286362573597776,0.44233172185603287],[-0.21507141530929597,0.6593130746457003,-1.6533201939946889,-0.42775705963618915,0.2587728595247284,2.0945385721331804,1.274035328409014,0.42548042059913876,-0.14266259973301504,-0.5610090032212971,-0.7584632132393418],[-0.1459672261566375,-0.11236543179582587,0.16474915571488372,-1.078752525589435,-1.26673775732103,-1.5110686992648246,0.7117609005409047,-0.28244740149596015,-1.8758446796632489,0.11866763996489951,1.3796275946999534],[-0.3348054713822988,0.8991133322293713,2.5373167426263294,1.3998669770328545,-1.2406297674706492,-0.08784469838058453,-0.5494057908418715,0.35516972162132976,0.7960193960385666,-0.8516518089375199,0.3519707873712154],[-0.09549243206042646,0.47701258380820166,-0.952441886842453,1.230392527990286,-1.166657461663548,-1.1675324105977443,-0.059034045890247425,-0.029215584351603707,-0.7266740617453774,-1.1642282786125113,-0.723534468811416],[0.7197411815984297,-1.0640189566537483,-0.30509104114872937,1.3355231270979981,1.2753957427671712,-2.7242477566689995,-0.532173585232727,-0.5473283232200443,-1.10471436020992,-0.46475025653803165,-0.3008751555298483],[1.9534321539796309,1.5836188394970618,1.8966413371548023,0.2703199178579322,-0.40903925639098115,0.08674321508453905,-1.0373666125250711,-0.1567544956521343,2.880653635563106,-0.8939459412602481,1.6476997232822108]]},\"weights_ho\":{\"rows\":3,\"cols\":7,\"data\":[[1.5355600233403588,-0.26790109723979455,-0.563175305591362,0.037054643925109945,0.9017419726879266,0.7921612015948195,-0.34808213202735844],[0.014606081697261852,-1.8878827501221758,0.5331715517424435,-2.009728121681736,0.7907583167849923,-2.3994527164841895,1.8257393900789287],[-0.7878202173942452,-0.43158024647753745,1.429498745491384,1.1826638607372195,2.102444174626727,-3.885679463368999,-0.11250914232978604]]},\"bias_h\":{\"rows\":7,\"cols\":1,\"data\":[[0.5688100504052571],[1.0253033605449082],[0.34443181302255116],[1.9901462702586556],[1.5970846695301812],[0.9718997244018992],[1.955408010781132]]},\"bias_o\":{\"rows\":3,\"cols\":1,\"data\":[[0.259899432299542],[-1.3073144279544833],[1.092802876034807]]}},\"apple\":{\"x\":440,\"y\":0,\"canvasWidth\":500,\"canvasHeight\":500,\"unit\":10}}";
let savedSnake;

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

  if (savedSnake) {
    let SavedSnake = JSON.parse(savedSnake);
    let newSnake = new Snake(500, 500, 10);
    
    newSnake.brain = new NeuralNetwork();
    newSnake.brain.inputNodes = SavedSnake.brain.inputNodes;
    newSnake.brain.hiddenNodes = SavedSnake.brain.hiddenNodes;
    newSnake.brain.outputNodes = SavedSnake.brain.outputNodes;

    newSnake.brain.weights_ih = new Matrix();
    newSnake.brain.weights_ih.rows = SavedSnake.brain.weights_ih.rows;
    newSnake.brain.weights_ih.cols = SavedSnake.brain.weights_ih.cols;
    newSnake.brain.weights_ih.data = SavedSnake.brain.weights_ih.data;

    newSnake.brain.weights_ho = new Matrix();
    newSnake.brain.weights_ho.rows = SavedSnake.brain.weights_ho.rows;
    newSnake.brain.weights_ho.cols = SavedSnake.brain.weights_ho.cols;
    newSnake.brain.weights_ho.data = SavedSnake.brain.weights_ho.data;

    newSnake.brain.bias_h = new Matrix();
    newSnake.brain.bias_h.rows = SavedSnake.brain.bias_h.rows;
    newSnake.brain.bias_h.cols = SavedSnake.brain.bias_h.cols;
    newSnake.brain.bias_h.data = SavedSnake.brain.bias_h.data;    

    newSnake.brain.bias_o = new Matrix();
    newSnake.brain.bias_o.rows = SavedSnake.brain.bias_o.rows;
    newSnake.brain.bias_o.cols = SavedSnake.brain.bias_o.cols;
    newSnake.brain.bias_o.data = SavedSnake.brain.bias_o.data;  

    for (let i = 0; i < MAX; i++){
      snakeArr.push(new Snake(500, 500, 10, newSnake));
      snakeArr[i].brain.mutate(0.3);
      snakeArr[i].setApple(new Apple(500, 500, 10));
      snakeArr[i].apple.spawn();
    } 
  } else {
    for (let i = 0; i < MAX; i++){
      snakeArr.push(new Snake(500, 500, 10));
      snakeArr[i].setApple(new Apple(500, 500, 10));
      snakeArr[i].apple.spawn()
    }
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
