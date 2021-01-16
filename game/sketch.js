var cols,rows;
var w = 40;
var grid = [];
//Current is the current cell
var current;
var stack = [];
var player
var mobGroup
var light
var fruit
var fruitGroup


function setup(){
  createCanvas(1320,631);
  cols = floor(width/w);
  rows = floor(height/w);

  light = createSprite(1,1,50,50)
  light.addImage("light",lightImage)

  player = createSprite(1,1,15,15)
  player.addImage("player",playerImage)
  player.scale = 0.05 

 mobGroup = createGroup();
 fruitGroup = createGroup();

  for(var j = 0; j < rows; j++){
  	for(var i = 0; i < cols; i++){
  		var cell = new Cell(i,j);
  		grid.push(cell);
  	}
  }

  current = grid[0];
}

function preload(){

	playerImage = loadImage("images/player.png")
	mobImage = loadImage("images/mobImage.png") 
	lightImage = loadImage("images/light.png")
    fruitImage = loadImage("images/fruit.png")
}	

function draw(){
  background("lightblue");

  for(var i = 0; i < grid.length; i++){
  	grid[i].show();
  }
  
  text("Please wait while we create a unique maze for you...", 570,615);

  current.visited = true;
  current.highlight();
 var next = current.checkNeighbors();



  if(next){
  	next.visited = true;
    
    stack.push(current);

    removeWalls(current, next);

  	current = next;
  }

  

  else if(stack.length > 0){
	current = stack.pop();
  }
  
player.velocityX = 0
player.velocityY = 0

light.x = player.x
light.y = player.y

  if(keyDown("RIGHT_ARROW")) {
	player.velocityX = +5;
}

if(keyDown("LEFT_ARROW")) {
	player.velocityX = -5;
}

if(keyDown("DOWN_ARROW")) {
	player.velocityY = +5;
}

if(keyDown("UP_ARROW")) {
	player.velocityY = -5;
}

spawnMobs();
spawnFruits();

if (mobGroup.isTouching (light)){
	mobGroup.setVisibleEach(true)

}

else {
	mobGroup.setVisibleEach(false)
}

  drawSprites();
}

function index(i, j){
	if(i < 0 || j < 0 || i >cols-1 || j > rows-1){
		return -1;
	}
	return i + j * cols;
}

function Cell(i,j){
	this.i = i;
	this.j = j;
	//top, right, bottom, left
	this.walls = [true, true, true, true];
	this.visited = false;

	this.checkNeighbors = function(){
		var neighbors = [];
		//Using a two-dimentional array
		var top = grid[index(i, j-1)];
		var right = grid[index(i+1, j)];
		var bottom = grid[index(i, j+1)];
		var left = grid[index(i-1, j)];

		if(top && !top.visited){
			neighbors.push(top);
		}
		if(right && !right.visited){
			neighbors.push(right);
		}
		if(bottom && !bottom.visited){
			neighbors.push(bottom);
		}
		if(left && !left.visited){
			neighbors.push(left);
		}
		if(neighbors.length > 0){
			var r = floor(random(0, neighbors.length))
			return neighbors[r];
		}
		else{
			return undefined;
		}
	}

	this.highlight = function(){
		var x = this.i*w;
		var y = this.j*w;
		noStroke();
		fill("");
		rect(x, y, w, w);
	}

	this.show = function(){
		var x = this.i*w;
		var y = this.j*w;
		stroke("yellow");

		if(this.walls[0]){
		    line(x,  y,  x+w,  y);
	    }  
		if(this.walls[1]){
		    line(x+w,  y,  x+w,  y+w);
		}
		if(this.walls[2]){
			line(x+w,  y+w,  x,  y+w);
		}
		if(this.walls[3]){
			line(x,  y+w,  x,  y);
		}

        if(this.visited){
        	noStroke();
        	fill("black");
        	rect(x,y,w,w);
        }
	}
}

function removeWalls(a, b){
	var x = a.i - b.i;
	if(x === 1){
		a.walls[3] = false;
		b.walls[1] = false;
	}
	else if(x === -1){
		a.walls[1] = false;
		b.walls[3] = false;
	}
	var y = a.j - b.j;
	if(y === 1){
		a.walls[0] = false;
		b.walls[2] = false;
	}
	else if(y === -1){
		a.walls[2] = false;
		b.walls[0] = false;
	}
}

function spawnMobs() {
	if (frameCount % 60 === 0){
	  var mob = createSprite(600,120,40,10);
	  mob.y = Math.round(random(0,1320));
	  mob.x = Math.round(random(0,631));
	  mob.addImage(mobImage);
	  mob.scale = 0.09;
	  mob.visible = false
	  mob.lifetime = 1000

	  //cloud.depth = trex.depth;
	  //trex.depth = trex.depth + 1;
	  
	 
	  mobGroup.add(mob);
	}
 
}

function spawnFruits() {
	if (frameCount % 30 === 0){
	  var fruit = createSprite(600,-30,40,10);
	  fruit.x = Math.round(random(0,631));
	  fruit.addImage(fruitImage);
	  fruit.scale = 0.09;
	  fruit.velocityY = 15
	  //fruit.visible = false
	  fruit.lifetime = 500
          console.log("yes spawning")
	  //cloud.depth = trex.depth;
	  //trex.depth = trex.depth + 1;
	  
	 
	  fruitGroup.add(fruit);
	}
 
}