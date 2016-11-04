"use strict";

var xwidth = 101;
// In engine.js, the width of the canvas is specified as 505px
// Owing to the requirements, we can assume that each block is one-fith of the total width of the canvas
// So, for the manipulation of the x-axis movement, that is, for right and left movement,
// we can consider this as a single unit, and calculations for the distance scaled
// will be based on this.

var yheight = 75;
// This is for the y-axis.
// In engine.js, the height of the canvas is specified as 606px
// We can assume that each block is one-sixth of the total height
// This is for up and down movement

var score = 0; // stores the score
var wins = 0; // stores the number of wins
var losses = 0; // stores the number of losses

// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png'; // this is for the image of the enemy
    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * (300 - 100) + 100) * 101 ;
    // we have used math.random() to choose a random number between 100 (min, included)
    // and 300 (max, excluded)
};

// Multiplies any movement by the dt parameter which will ensure the game runs at the same speed for
// all computers.
// Updates the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
  // if the enemy has not crossed
  // the x-coordinate 505 mark i.e. end of the canvas
  // then it proceeds further
  if (this.x < 505) {
    this.x = this.x + (this.speed * dt);
}
  // if the enemy has already crossed the end mark
  // then, it is brought back to the starting point
 else {
    this.x = -105;
    this.y = (Math.floor(Math.random() * (4 - 1) + 1)) * yheight;
    this.speed = (Math.floor(Math.random() * (200 - 100) + 100)) * 101 * dt;
   }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Creating the player class
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.score = 0;
  this.wins = 0;
  this.losses = 0;
  // the under given function tell us the starting point of the player
  this.reset();
}

// This class requires an update(), render() and
// a handleInput() method.
// apart from the above methods, a new additon -
// reset() method tell us about the starting position of the player

Player.prototype.reset = function() {
  this.x = xwidth * 2;
  this.y = yheight * 5;
}


Player.prototype.collisionDetector = function() {
  // for retrieving the enemy objects we are using the for loop
  for (var id = 0; id < allEnemies.length; id++) {
    // for checking if there is a collision between the enemy and the player we are using 'if'
    if (this.x < allEnemies[id].x + xwidth && this.x + xwidth > allEnemies[id].x && this.y < allEnemies[id].y + yheight && this.y + yheight > allEnemies[id].y) {
        // if the condition is met, the player returns to the starting point
        // the number of losses is updated
        this.reset();
        this.losses = this.losses + 1;
        this.scoreBoard(-10, this.wins, this.losses);
      }
  }
}

// this method detects the collision and checks if the player has reached the destination
Player.prototype.update = function() {
  this.collisionDetector();
  // if the player successfully reaches the destination (top), he/she returns back to the initial position
  // and the number of wins get updated
    if (this.y < 10) {
      this.reset();
      this.wins = this.wins + 1;
      this.scoreBoard(10, this.wins, this.losses);
    }
  }

// this function displays the score, number of wins and number of losses
// takes three parameters - score, win, loss
// 'win' holds the number of wins
// 'loss' holds the number of losses
Player.prototype.scoreBoard = function(score, win, loss) {
  ctx.clearRect(10, 0, 500, 300);
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  this.score = this.score + score;
  ctx.fillText ("Score " + this.score, 10, 30);
  ctx.fillText ("Wins " + win, 210,30);
  ctx.fillText ("Losses " + loss, 410,30);
  }

// this creates the player on the screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// this function is for movement of the Player
// according to the input by the user
Player.prototype.handleInput = function(keyPress) {
  if (keyPress === 'left') {
    if (this.x !== 0) {
      this.x = this.x - xwidth;
    }
  }

  if (keyPress === 'up') {
    if (this.y !== 0) {
      this.y = this.y - yheight;
    }
  }

  if (keyPress === 'right') {
    if (this.x < 4 * xwidth){
      this.x = this.x + xwidth;
    }
  }

  if (keyPress === 'down') {
    if (this.y < 5 * yheight){
      this.y = this.y + yheight;
    }
  }

}
// Instantiating the objects.
// All the enemies are placed in an array called allEnemies
// The parameters, the coordiantes (x,y) are being passed as
// parameters.
var allEnemies = [
    new Enemy(-400, yheight),
    new Enemy(-380, 2*yheight),
    new Enemy(-350, 3*yheight)
];

// Place the player object in a variable called player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
