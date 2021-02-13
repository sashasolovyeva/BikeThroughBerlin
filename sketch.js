let bikeRight, bikeLeft
let biker
let bikelaneW = 105

let bg, bg2
let bgXPos, bgXPos2
let bgXSpeed = 3

let carImage
let cars = []
let numberOfCars

let gameState = 0
let gameover = false

let font

let foodImages = []
let foodItem
let fallingFoods = []
let foodRain = false

let enemyBikesImages = []
let enemyBikes = []

let score = 0
let bonus = 1
let scoreSizeChange = false
let scoreSize = 40
let scoreSizeSpeed = 2

let currentFrame
let scoreFrame = 0

let sound1, sound2, sound3
let playSoundPermitted = true

let counter = 0
let counter2 = 0

function preload() {
	bikeRight = loadImage("assets/right.gif")
	bikeLeft = loadImage("assets/left.gif")

	bg = loadImage("assets/berlin_background.png")
	bg2 = loadImage("assets/berlin_background.png")

	carImage = loadImage("assets/car1.png")

	font = loadFont("assets/berlin.regular.ttf")

	for(let i = 0; i < 4; i++){
		foodImages[i] = loadImage("assets/food" + i + ".png")
	}

	for(let i = 0; i < 4; i++){
		enemyBikesImages[i] = loadImage("assets/enemyBikes" + i + ".gif")
	}

	sound1 = loadSound("assets/horn.wav")

	// decided against these because the sound quality was bad
	sound2 = loadSound("assets/bike.wav")
	sound3 = loadSound("assets/tasty.mp3")
}

function setup() {
	createCanvas(930, windowHeight)
	textFont(font)
	textAlign(CENTER, CENTER)

	biker = new Biker(100)

	bgXPos = 0
	bgXPos2 = bg.width

	for(let i = 0; i < 8; i++){
		let temp = new Car(i)
		cars.push(temp)
	}

	foodItem = new Food()

	for(let i = 0; i < 10; i++){
		let temp = new FallingFood()
		fallingFoods.push(temp)
	}

	for(let i = 0; i < 2; i++){
		let temp = new EnemyBikes()
		enemyBikes.push(temp)
	}
}

function draw() {

	imageMode(CORNER)
	currentFrame = frameCount

	// Start screen
	if(gameState == 0){
		fill(112, 149, 177)
		rect(0, 0, width, height)

		image(bg, 0, 0)

		fill(255)
		textSize(80)
		text("Welcome to the game!", width/2, height/2 + 100)
		textSize(40)
		text("Use A, S, W and D keys to direct the bike", width/2, height/2 + 170)
		text("Choose the level of difficulty:", width/2, height/2 + 220)
		// noFill()
		strokeWeight(2)
		stroke(255)
		if(mouseX > width/2 - 300 && mouseX < width/2 - 50 && mouseY > height/2 + 270 && mouseY < height/2 + 370){
			fill('rgba(185, 219, 240, .6)')
		}else{
			noFill()
		}
		rect(width/2 - 300, height/2 + 270, 250, 100)
		if (mouseX > width/2 + 50 && mouseX < width/2 + 300 && mouseY > height/2 + 270 && mouseY < height/2 + 370){
			fill('rgba(185, 219, 240, .6)')
		} else{
			noFill()
		}
		rect(width/2 + 50, height/2 + 270, 250, 100)
		noStroke()
		fill(255)
		text("Beginner", width/2 - 175, height/2 + 320)
		text("Advanced", width/2 + 175, height/2 + 320)

	}

	// Game over
	if(gameState == 2){
		fill(112, 149, 177)
		rect(0, 0, width, height)

		image(bg, 0, 0)

		fill(255)
		textSize(80)
		text("Game Over!", width/2, height/2 + 100)
		textSize(40)
		text("Your score is: " + score, width/2, height/2 + 200)
		text("Click anywhere to play again", width/2, height/2 + 300)

		// Reverting the variables
		scoreFrame = 0
		bonus = 1
		for(let i = 0; i < cars.length; i++){
			cars[i].x = width/2 + i * 200 * random(2, 4)
			cars[i].y = bg.height + bikelaneW + i * 50
		}

		for(let i = 0; i < enemyBikes.length; i++){
			enemyBikes[i].x = random(width/2 + 100, width)
			enemyBikes[i].enemyBikeArtwork = enemyBikesImages[parseInt(random(enemyBikesImages.length))]
		}

		biker.y = random(bg.height, height - 200)
		biker.x = 100

	}

	// Pause
	if(gameState == 4){
		fill(112, 149, 177)
		rect(0, 0, width, height)

		image(bg, 0, 0)

		fill(255)
		textSize(80)
		text("The game is paused", width/2, height/2 + 100)
		textSize(40)
		text("Click anywhere to continue playing", width/2, height/2 + 200)
	}

//_________________________________________________________________________________________________

if(gameState == 1){
	// Moving the background
	noFill()
	image(bg, bgXPos, 0)
	image(bg2, bgXPos2, 0)

	bgXPos -= bgXSpeed
	bgXPos2 -= bgXSpeed

	if(bgXPos <= -bg.width){
		bgXPos = bg.width
	}

	if(bgXPos2 <= -bg.width){
		bgXPos2 = bg.width
	}

	// Score
	scoreFrame += .2
	score = parseInt(scoreFrame + bonus)
	fill(112, 149, 177)
	rect(width - 100, 0, 100, 85)

	fill(255)
	textAlign(CENTER, CENTER)
	textSize(scoreSize)
	text(score, width - 50, 40)

	if(scoreSizeChange){
		scoreSize += scoreSizeSpeed

		if(scoreSize > 90){
			scoreSizeSpeed *= -1
		}
		if(scoreSize < 40){
			scoreSizeChange = false
			scoreSizeSpeed *= -1
			scoreSize = 40
		}
	}

	// Pause button
	fill(112, 149, 177)
	rect(0, 0, 100, 85)
	stroke(255)
	strokeWeight(10)
	line(35, 10, 35, 70)
	line(65, 10, 65, 70)


	// Road
	noStroke()
	// bike lanes
	fill(150)
	rect(0, bg.height, width, bikelaneW)

	fill(180)
	rect(0, bg.height + bikelaneW, width, 300)

	// Initialize the character
	biker.display()
	biker.move()

	// Initialize food
	foodItem.display()
	foodItem.relocate()

	// Collision detection for food
	if(biker.x + bikeRight.width > foodItem.x && biker.x < foodItem.x + foodImages[0].width && biker.y + bikeRight.height > foodItem.y && biker.y < foodItem.y + foodImages[0].height){
		foodItem.countFrames = true
		// increasing the score every time an objective is reached
		bonus += 100
		scoreSizeChange = true
		if(playSoundPermitted){
			sound3.play()
		}
	}

	// Initialize cars
	for(let i = 0; i < numberOfCars; i++){
		cars[i].display()
		cars[i].move()

		// Collision detection for cars
		if(biker.x + bikeRight.width > cars[i].x + 40 && biker.x < cars[i].x - 40 + carImage.width && biker.y + bikeRight.height > cars[i].y + 40 && biker.y < cars[i].y + carImage.height - 40){
			gameState = 2
			if(playSoundPermitted){
				sound1.play()
			}
		}
	}

	// Initialize enemy bikes
	for(let i = 0; i < enemyBikes.length; i++){
		enemyBikes[i].display()
		enemyBikes[i].move()

		// Collision detection for enemy bikes
		if(biker.x + bikeRight.width > enemyBikes[i].x + 40 && biker.x < enemyBikes[i].x - 40 + enemyBikes[i].enemyBikeArtwork.width && biker.y + bikeRight.height > enemyBikes[i].y + 40 && biker.y < enemyBikes[i].y + enemyBikes[i].enemyBikeArtwork.height - 40){
			bonus -= 10
			fill(255, 0, 0)
			textSize(40)
			text("Ouch!", biker.x + 50, biker.y - 20)
			scoreSizeChange = true
			if(playSoundPermitted){
				sound2.play()
			}
		}
	}

	// Initialize falling food
	if(foodRain){
		for(let i = 0; i < 10; i++){
			fallingFoods[i].fall()

			// Collision detection for food frenzy
			if(biker.x + bikeRight.width > fallingFoods[i].x && biker.x < fallingFoods[i].x + foodImages[0].width && biker.y + bikeRight.height > fallingFoods[i].y && biker.y < fallingFoods[i].y + foodImages[0].height){
				fallingFoods[i].x = 3000
				fallingFoods[i].y = 3000
				bonus += 10
				scoreSizeChange = true
				if(playSoundPermitted){
					sound3.play()
				}
			}
		}
	}
}

}

//__________________________________________________________________________________________

function mousePressed(){
		if(gameState == 0){
			if(mouseX > width/2 - 300 && mouseX < width/2 - 50 && mouseY > height/2 + 270 && mouseY < height/2 + 370){
				gameState = 1
				numberOfCars = 4
			}
			else if (mouseX > width/2 + 50 && mouseX < width/2 + 300 && mouseY > height/2 + 270 && mouseY < height/2 + 370){
				gameState = 1
				numberOfCars = 7
			}
		}
		else if(gameState == 2){
			gameState = 1
		}
		else if(gameState == 1 && mouseX < 100 && mouseY < 100){
			gameState = 4
		}
		else if(gameState == 4){
			gameState = 1
		}
}

//__________________________________________________________________________________________

class Biker {
	constructor(x){
		this.x = x
		this.y = random(bg.height, height - 200)
		this.bikeArtwork = bikeRight
	}

	display(){
		image(this.bikeArtwork, this.x, this.y)
	}

	move(){
		if(keyIsDown(65)){
			if(this.x > 0){
				this.x -= 5
			}
			this.bikeArtwork = bikeLeft
		}
		if(keyIsDown(68)){
			if(this.x < width - this.bikeArtwork.width){
				this.x += 5
			}
			this.bikeArtwork = bikeRight
		}
		if(keyIsDown(83)){
			if(this.y < height - this.bikeArtwork.height + 10){
				this.y += 5
			}
		}
		if(keyIsDown(87)){
			if(this.y > bg.height){
				this.y -= 5
			}
		}

	}
}


class Car {
	constructor(i){
		this.x = width/2 + i * 200 * random(2, 4)
		if(i < 4){
			this.y = bg.height + bikelaneW + i * 50
		}else {
			this.y = bg.height + bikelaneW + (i - 4) * 50
		}
		this.carArtwork = carImage
		this.speed = random(3, 10)
		this.carNumber = i
	}

	display(){
		image(this.carArtwork, this.x, this.y)
		// fill(255)
		// textSize(40)
		// text(this.carNumber, this.x + 75, this.y + 10)
	}

	move(){
		this.x -= this.speed

		if (this.x < -200) {
			this.x = random(width, width + 1000)
			this.speed = random(3, 10)
		}
	}
}

class Food {
	constructor(){
		this.x = random(200, width - 200)
		this.y = random(bg.height + bikelaneW, height - 100)
		this.foodArtwork = foodImages[parseInt(random(foodImages.length))]

		this.numberOfFrames = random(100, 500)

		this.countFrames = false
	}

	display(){
		image(this.foodArtwork, this.x, this.y)
	}

	relocate(){
		if(this.countFrames){
			this.numberOfFrames -= 1

			// Move with easing
			if(this.x < width + 100 && this.y > -200){
				this.x += 0.02 * (width + 100 - this.x)
				this.y -= 0.02 * (this.y + 200)
			}
		}

		if(this.numberOfFrames <= 0){
			this.x = random(200, width - 200)
			this.y = random(bg.height + bikelaneW, height - 100)
			this.foodArtwork = foodImages[parseInt(random(foodImages.length))]
			this.numberOfFrames = random(100, 500)
			this.countFrames = false
		}
	}

}

class FallingFood{
	constructor(){
		this.x = random(100, width-200)
		this.y = random(-200, -1000)
		this.foodArtwork = foodImages[parseInt(random(foodImages.length))]
	}

	fall(){
		image(this.foodArtwork, this.x, this.y)
		if(this.y < height){
			this.y += 5
		}else{
			this.x = random(100, width-200)
			this.y = random(-200, -1000)
			this.foodArtwork = foodImages[parseInt(random(foodImages.length))]
		}
	}
}

class EnemyBikes {
	constructor(){
		this.x = random(width/2 + 100, width)
		this.y = bg.height
		this.enemyBikeArtwork = enemyBikesImages[parseInt(random(enemyBikesImages.length))]
		this.speed = random(2, 5)
	}

	display(){
		image(this.enemyBikeArtwork, this.x, this.y)
	}

	move(){
		this.x -= this.speed

		if(this.x < -100){
			this.x = width + 100
			this.enemyBikeArtwork = enemyBikesImages[parseInt(random(enemyBikesImages.length))]
			this.speed = random(2, 5)
		}
	}
}


//__________________________________________________________________________
// HTML
function soundButtonHandler() {
	if(counter % 2 == 0){
  	playSoundPermitted = false
		document.getElementById("button1").innerHTML = "Allow Sound"
		counter++
	} else {
		playSoundPermitted = true
		document.getElementById("button1").innerHTML = "Stop Sound"
		counter++
	}
}

function foodRainHandler() {
	if(counter2 % 2 == 0){
  	foodRain = true
		document.getElementById("button2").innerHTML = "Stop"
		counter2++
	} else {
		foodRain = false
		document.getElementById("button2").innerHTML = "Click Me!"
		counter2++
	}
}
