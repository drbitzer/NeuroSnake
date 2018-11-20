let scoreElem;
let speedElem;
let numSnakesElem;
let fitnessElem;
let drawSnake = false;
let drawBtn;
let snakeArr = [];
let snakeSave = [];
let bestScoreSnake = null;
let slider;

let MAX = 2000;
let generation = 1;

let savedSnake; // = "{\"DIRECTIONS\":{\"up\":1,\"right\":2,\"down\":3,\"left\":4},\"ACTION\":{\"ahead\":1,\"left\":2,\"right\":3},\"canvasHeight\":500,\"canvasWidth\":500,\"unit\":10,\"XSTART\":140,\"YSTART\":350,\"PART_SIZE\":10,\"numSegments\":111,\"direction\":3,\"score\":6660,\"apples\":1010,\"fitness\":3835,\"lastAppleDist\":0.8376156636548769,\"timeWOEat\":44,\"isAlive\":true,\"xCor\":[340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,490,480,470,460,450,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440,440],\"yCor\":[500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,500,490,480,470,460,450,440,430,420,410,400,390,380,370,360,350,340,330,320,310,300,290,280,270,260,250,240,230,220,210,200,190,180,170,160,150,140,130,120,110,100,90,80,70,60,60,60,60,60,60,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500],\"color\":[255,-755,-755],\"brain\":{\"inputNodes\":12,\"hiddenNodes\":8,\"outputNodes\":4,\"weights_ih\":{\"rows\":8,\"cols\":12,\"data\":[[-0.516001232516113,-0.4492379635869772,-0.9266283137491087,0.1865390935589813,-0.08613061413080667,-0.3196033753874964,-0.22548890231542956,-1.1415575093344534,-0.1874494548386302,-1.4920528167186702,1.1524527670579774,-0.9235272837070394],[-0.5351427399125013,-0.9285867112415741,0.04994885108473582,0.9815022677438102,-0.1865424801622686,-0.5506344249690869,-0.2531088429121314,0.9864372401406654,-1.4096720666900082,1.2526964620686039,0.2768176993677973,-0.008210969827759512],[0.9355723396155635,1.8185777244464212,1.1447512960111474,-1.5560650475383675,1.6252587870500945,-0.8518877492395525,-0.3869400657494811,-0.2944528995667991,-0.5797413570201895,1.0060078404909354,0.3867430731126017,-1.1735723481334221],[-0.6700194103692857,0.42870511991841365,0.7378713074431702,1.0420413287743269,0.18545947378386038,-0.32605096298333336,0.4663361747156688,1.8466426201498853,-0.35997598123857266,-2.3990313025025913,0.09219737342002482,0.5887023521328433],[0.20641704032158115,0.6495334057574178,0.7557749692623863,0.7646262848740032,-0.5941709689026002,0.2347532039416583,0.7623444236159536,-1.4157933817072228,-0.667657851358352,-1.5986273068689774,-0.4939060062036882,1.578034394925605],[0.31897836693224013,-1.2845315228236798,0.505157652149431,-0.257134687455817,1.2010023279644444,1.4513075958385837,-0.21070258831260766,0.6804236980936275,-0.7738516219078627,-0.1689773325076648,-1.1128251664563695,-0.8316625290289621],[-0.3288815969779654,0.8290929180409474,-0.04438080768794958,-1.04087797494703,0.6507190847554963,-0.06497387627386565,0.1704839172567824,0.8787889547596349,0.19898967022533098,0.6824776253331003,0.47065969190206286,0.5618268889302873],[-0.6053279801056822,0.4121357664627319,-0.30771939643739415,-0.4229982139454164,-1.063612487559407,-0.4311782217985879,0.20232999606989063,0.8407440231445675,-0.35695413600970877,-0.07763612911535259,-0.3467732988263611,0.5111895117981542]]},\"weights_ho\":{\"rows\":4,\"cols\":8,\"data\":[[0.15556152150240452,0.8670106080718442,-1.4642910692039401,0.4602610900881338,0.2789908240728175,0.7444501983018588,-0.29409095126944373,-0.1174252182699847],[-1.321716444181839,-0.4784291289423324,1.034646143707218,0.6647148674704242,1.497204075506875,0.15637970619551245,0.27693365748042126,-0.5102266218627894],[-0.9675136196932572,1.4458685023461855,0.3039701600855255,-0.7529349934974224,-0.9428156017548959,0.27729271151484824,-1.2685053433631839,0.44256299968263524],[0.41889791886995137,1.326849473093831,-0.20338222281776108,0.422266361423332,-0.9755011737348223,-1.0873986521115984,0.6660252262856562,-0.8197664163458794]]},\"bias_h\":{\"rows\":8,\"cols\":1,\"data\":[[0.1327683380600312],[-0.6586685872474674],[-0.6969435475948879],[-1.5016010329614582],[0.21580426669714176],[0.7608065640256627],[0.8848549741018314],[0.6253686198226023]]},\"bias_o\":{\"rows\":4,\"cols\":1,\"data\":[[-0.5014659521462339],[-0.5575569339043144],[1.2093648717662457],[0.6894126673315806]]}},\"apple\":{\"x\":470,\"y\":30,\"canvasWidth\":500,\"canvasHeight\":500,\"unit\":10}}";

let capturer;

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

  numSnakesElem = createDiv('Snakes = ' + snakeArr.length);
  numSnakesElem.position(20,62);
  numSnakesElem.style('color', 'white');

  fitnessElem = createDiv('Fitness = 0');
  fitnessElem.position(20,82);
  fitnessElem.style('color', 'white');  

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
      snakeArr[i].brain.mutate(0.2);
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

    numSnakesElem.html('Snakes = ' + snakeArr.length);

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

/*       let parent1 = snakeSave[0];
      let parent2 = snakeSave[0];
      let index = 0;
      for (let i = 0; i < snakeSave.length; i++) {
        if (snakeSave[i].apples > parent1.apples) {
          parent1 = snakeSave[i];
          index = i;
        }
      }      

      snakeSave.splice(index, 1);
      
      for (let i = 0; i < snakeSave.length; i++) {
        if (snakeSave[i].score > parent2.score) {
          parent2 = snakeSave[i];
        }
      }  */   

      let bestSnake1 = snakeSave[0];      
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

      let bestSnake2 = snakeSave[0];
      fitness = 0;
      bestFitness = 0;
      bestSnakeIndex = 0;
      for (let i = 0; i < snakeSave.length; i++) {
        fitness = snakeSave[i].fitness;
        if (fitness > bestFitness) {
          bestSnake2 = snakeSave[i];
          bestFitness = fitness;
          bestSnakeIndex = i;
        }
      }

      snakeSave = []; 
      fitnessElem.html('Fitness = ' + bestSnake1.fitness + ', ' + bestSnake2.fitness);

      snakeArr.push(new Snake(500, 500, 10, bestSnake1));
      snakeArr[0].setApple(new Apple(500, 500, 10));
      snakeArr[0].apple.spawn();      

      snakeArr.push(new Snake(500, 500, 10, bestSnake2));
      snakeArr[1].setApple(new Apple(500, 500, 10));
      snakeArr[1].apple.spawn();            

      //Generate children
      for (let i = 2; i < MAX; i++){        
        snakeArr.push(new Snake(500, 500, 10, bestSnake1));
        snakeArr[i].brain.combine(bestSnake2.brain);
        snakeArr[i].brain.mutate(0.3);
        snakeArr[i].setApple(new Apple(500, 500, 10));
        snakeArr[i].apple.spawn();
      }               
    }
}

function calcFitness() {
  let totalScore = 0;
  for (let i = 0; i < snakeSave.length; i++)
    totalScore += (snakeSave[i].apples + snakeSave[i].score);

  snakeSave.forEach(element => {
    element.fitness = element.apples + element.score;    
  });
}

function checkGameStatus(snake, index) {
    
    if (snake.xCor[snake.xCor.length - 1] > width ||
        snake.xCor[snake.xCor.length - 1] < 0 ||
        snake.yCor[snake.yCor.length - 1] > height ||
        snake.yCor[snake.yCor.length - 1] < 0 || checkSnakeCollision(snake)) { 

      //snake.score -= (snake.score * 80 / 100);
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
