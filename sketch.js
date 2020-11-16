var PLAY = 1;
var END = 0;
var gameState = PLAY;

var message;

var monkey, monkey_running;
var ground, invisibleGround, groundImage;

var obstacle, banana, bananaImage, obstacleImage, bananasGroup;

var score, health;
var gameOver, gameOverImg, restart, restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  monkey_running = loadAnimation("1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png");
  
  groundImage = loadImage("ground2.png");
  
  bananaImage = loadImage("Banana.png");
  
  obstacleImage = loadImage("Rock.png")
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  message = "This is a message";
  console.log(message)
  
  monkey = createSprite(50,160,20,50);
  monkey.addAnimation("running", monkey_running);
  

  monkey.scale = 0.0925;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  bananasGroup  = createGroup()
  
  monkey.setCollider("rectangle",0,0,monkey.width,monkey.height);
  
  score = 0;
  health = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Alive: "+ score, 500,50);
  text("Health: "+ health, 350, 50);
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(setFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& monkey.y >= 100) {
        monkey.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8
  
    //spawn the clouds
    spawnBananas();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(monkey)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
    }
    if(bananasGroup.isTouching(monkey)){
        health++;
        bananasGroup.destroyEach();
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
    
     
     
      ground.velocityX = 0;
      monkey.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bananasGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0); 
    bananasGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  monkey.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  score = 0;
  health = 0;
  bananasGroup.destroyEach();
  obstaclesGroup.destroyEach();
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   obstacle.setCollider("rectangle",0,0,obstacle.height,obstacle.width)
   
    //assign scale and lifetime to the obstacle
    obstacle.addImage(obstacleImage)
    obstacle.scale = 0.0925;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnBananas() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    banana = createSprite(600,120,40,10);
    banana.y = Math.round(random(80,120));
    banana.addImage(bananaImage);
    banana.scale = 0.0925;
    banana.velocityX = -5;
    
     //assign lifetime to the variable
    banana.lifetime = 200;
    
    //adjust the depth
    banana.depth = monkey.depth;
    banana.depth = monkey.depth + 1;
    
    bananasGroup.add(banana);
  }
}