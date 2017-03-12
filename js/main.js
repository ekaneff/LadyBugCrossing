// PROJECT BY EMILY KANEFF
//DWP Final Project

window.addEventListener("load", (e)=> {
    console.log("Let it begin!");
    var myApp = Game.getInstance();
});

class Game {
	constructor() {
		console.log("Game Created");
		this.images = [];
		this.screen = document.querySelector("canvas");
		this.player = null;
		Game.finished = false;
		this.ants = [];
		Game.state = "playing";
		Game.loop = null;
		Game.snd=new Audio("assets/sounds/music.wav");
		Game.snd.volume = 0.3;
		this.oneMin = 15;
		this.run = true;
		this.display = document.querySelector('#time');
		this.startTimer(this.oneMin, this.display, this.run);
		Game.ctx = this.screen.getContext("2d");
		this.loadAssets(["grass.png","ant-leftfacing.png", "ant-rightfacing.png", "bug.png"]); 

	}

	init() {
		console.log("Initializing...");
		Game.snd.play();
		this.screen.style.background = "url(" + this.images[0].src + ")";
		//this.player = new Player(this.images[3]);
		GameFactory.images = this.images;
		this.player= GameFactory.createObject("player");
		this.player.x = 400;
		this.player.y = 550;
		this.player.setScale(.21);
		this.player.draw();
		this.makeAnts();
		this.key = new Key();
		this.key.init();
		this.updateAll();
		
	}

	startTimer(duration, display, run){
		if (run){
			var timer = duration, minutes, seconds;
			Game.loop = setInterval(function(){
				minutes = parseInt(timer / 60, 10);
				seconds = parseInt(timer % 60, 10);

				minutes = minutes < 10 ? "0" + minutes : minutes;
		        seconds = seconds < 10 ? "0" + seconds : seconds;

		        display.innerHTML = minutes + ":" + seconds;

		        if (--timer < 0) {
		        	window.clearInterval(Game.loop);
		        	Game.state = "over";
		            document.querySelector("#gameOver").style.display = "block";
		            
		        } 
			}, 1000);
		} else {
			Game.state = "over";
			document.querySelector("#gameOver").style.display = "block";
		}
	}

	makeAnts() {
		var tempImg = this.images[2];
		var tempSpeed = 0;
		for (var j=0;j<3;j++) {
            for (var i=0;i<7;i++) {
            	if (j == 0) {
            		tempSpeed = 3;
            	} else if (j == 1) {
            		tempSpeed=-3;
            		tempImg = this.images[1];
            	} else {
            		tempImg = this.images[2];
            		tempSpeed = 2;
            	}
                var ant = new Ant(tempImg);
                ant.setScale(1.3);
                ant.speedX = tempSpeed;
               
                if (i == 3)i++;
                ant.x = 50 + (i*120);
                ant.y = 150 + (j*150);
                ant.draw();
                this.ants.push(ant);
            }
        }
	}

	loadAssets(arr) {
		var count = 0;
		var that = this;

		(function loadAsset() {
			var img = new Image();
			img.src = "assets/imgs/" + arr[count];
			img.addEventListener("load", function(e){
				that.images.push(img);
				count++;
				if (count < arr.length){
					loadAsset();
				} else {
					console.log("Images loaded");
					that.init();
				}
			});
		})();
	}

	getDistance(obj){
		var dx = this.player.x - obj.x;
        var dy = this.player.y - obj.y;

        var d = Math.sqrt(dx*dx+dy*dy); //pothagorean theorm 

        return d; 
	}

	updateAll() {
		var that = this;

		(function drawFrame(){ //ask what this really does
			window.requestAnimationFrame(drawFrame);
			Game.ctx.clearRect(0,0,that.screen.width, that.screen.height);

			// ===========================
			//       GAME OVER THING
			// ===========================
			if (Game.state == "playing"){
				that.ants.forEach((el) => {
					if (el.alive) {
						if(that.getDistance(el) < 50) {
	                        console.log("the ant was hit");
	                        el.hit(that.player);
	                        Game.state = "over";
	                        that.run = false;
	                        Game.snd.pause();
							Game.snd.currentTime = 0;
	                        that.player.speed = 0;
	                        window.clearInterval(Game.loop);
	                        document.querySelector("#gameOver").style.display = "block";
	                    }
					}
	                el.update();
	            });
				that.player.update();
			} else if (Game.state == "over") {
				that.ants.speedX = 0;
				Game.snd.pause();
				Game.snd.currentTime = 0;
				//Game.state = "over";
	            that.run = false;
	            //alert("game over!");
	            that.player.speed = 0;
	            window.clearInterval(Game.loop);
				//that.ants.update();
				// that.player.update();
			} else {
				that.run = false;
				that.player.speed = 0;
				that.ants.speedX = 0;
				window.clearInterval(Game.loop);
				//console.log("You win!");
			}

			that.player.update();
			//that.ant.update();
		})();
	}

	static getInstance() {
        if(!Game._instance)
        {
            Game._instance = new Game();
            return Game._instance;
        }
        else
        {
            throw "Game Singleton already created!";
        }
    }
}

class Sprite {
	constructor(img) {
		this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.width = img.width;
        this.height = img.height;
        this.rotate = 0;
        this.image = img;
        this.ctx = Game.ctx; 
        this.alive = true;
	}

	setScale(num) {
		this.scale = num;
		this.width = this.image.width * this.scale;
		this.height = this.image.height * this.scale;
	}

	draw() {
		this.ctx.save();
		this.rotate = this.rotate % 360;
		var rad = this.rotate * .01745;

		// this.x = this.x % (800 + (this.image.width*.5));
  		// this.y = this.y % (600 + (this.image.height*.5));


		this.ctx.translate(this.x, this.y); //do converstions before actions
        this.ctx.rotate(rad);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.drawImage(this.image, -(this.image.width * .5), -(this.image.height * .5)); //shifting center of rotation
        this.ctx.restore();

        if (this.x < -(this.width * .5)) {
	    	this.x = 800 + (this.width * .5);
	    }
	    if (this.x > 800 + (this.width * .5)) {
	    	this.x = 0 - (this.width * .5);
	    }
	}
}

class Player extends Sprite {
	constructor(img) {
		super(img);
		//this.speedX = 0;
		//this.speedY = 0;
		this.speed = 1.5;
	}

	update(){
		if (Key.keys[37] == 1) {
			this.rotate = 270;
	        this.x -= this.speed;
	    } else if (Key.keys[39] == 1) {
	    	this.rotate = 90;
	        this.x += this.speed;
	    } else if (Key.keys[38] == 1) {
	    	this.rotate = 0;
	        this.y -= this.speed;
	    } else if (Key.keys[40] == 1) {
	    	this.rotate = 180;
	        this.y += this.speed;
	    } else {
	    	
	    }

	    if (this.y <= 70) {
	    	this.speed = 0;
	    	//cannot acces timer here, also cannot place finished alert here and I 
	    	//dont know where else to put it.
	    	Game.state = "finished";
	    	if (Game.finished == false && Game.state == "finished") {
	    		document.querySelector("#win").style.display = "block";
	    		Game.finished = true;
	    	}
	    	
	    	
	    }
     	this.draw();
	}
}

class Ant extends Sprite {
	constructor(img) {
		super(img);
		this.speedX = 2;
	}

	update(){
		this.x += this.speedX;
     	this.draw();
	}

	hit(obj) {
		this.speed = 0;
		this.alive = false;
	}

}

class Key {

    constructor() {
        Key.keys = []; //why is this Key.keys and not this?
        for(var i = 0; i < 100; i++){ //what is this doing
            Key.keys[i] = 0;
        }

        console.log(Key.keys);
    }

    init() {
        window.addEventListener("keydown", function(e){
        	e.preventDefault();
            Key.keys[e.keyCode] = 1;

        });

        window.addEventListener("keyup", function(e){

            Key.keys[e.keyCode] = 0;
        });
    }
}

class GameFactory {
	constructor() {}

	 static createObject(str) {
        if (str == "player") {
            return new Player(GameFactory.images[3]);
        } else {
            throw "wtf";
        }
    }
}

GameFactory.images =[];


