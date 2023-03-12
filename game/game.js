var unhappy = new Audio('sound/ouch.wav')
var happy = new Audio('sound/happy.wav')
var begin = new Audio('sound/gamewon.wav')
var over = new Audio('sound/gameover.wav')

var playerImg = new Image()
playerImg.src = "p66.png"

var Bugs = []
var keys = []

var mymove = 0
var score = 0

var fps = 20
var currentFrame = 0
var counter = 0

const c = document.getElementById("canvas")
const ctx = c.getContext("2d")

var sheet = {
    width: 267,
    height: 400
}

var player = {
    x: c.width / 2,
    y: c.height / 2,
    vx: 0,
    vy: 0,
    speed: 8,
    width: sheet.width/4,
    height: sheet.height/4,
}

class Bug {
    constructor(x, y, vx, vy, width, height) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.width = width
        this.height = height
        this.color = "yellow";
        this.size = 6;
        this.age = 0
    }
   
    draw() {

        switch (this.age){
            case 1:
                ctx.beginPath()
                ctx.fillStyle = "yellow";
                ctx.arc(this.x,this.y,6,0,2*Math.PI,false);
                ctx.fill()
                ctx.closePath()
                break
            case 2:
                ctx.beginPath()
                ctx.fillStyle = "red";
                ctx.arc(this.x,this.y,13,0,2*Math.PI,false);
                ctx.fill()
                ctx.closePath()
                break
                
            case 3:
                ctx.beginPath()
                ctx.fillStyle = "red";
                ctx.arc(this.x,this.y,20,0,2*Math.PI,false);
                ctx.fill()
                ctx.closePath()
                break
            
                
                    }   
    }
    
    update() {
        
        switch (this.age) {
            case 0:
                this.x += this.vx
                this.y += this.vy
                
                this.age = 1
                break

            case 1:
                this.x += this.vx
                this.y += this.vy
                this.width += 1;
                this.height += 1;
                if (this.width > 100) {
                    this.age = 2
                }
                break

            case 2:
                this.x += this.vx
                this.y += this.vy
                this.width -= 1;
                this.height -= 1;
                if (this.width < 1) {
                    this.age = 3
                }
                break

            case 3:
                this.x = getRandomInt(12, c.width - 12)
                this.y = 600
                this.width = 20
                this.height = 100
                this.age = 0
                break
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//key press events 

window.addEventListener("keydown", keysPressed, false)
window.addEventListener("keyup", keysReleased, false)

function keysPressed(e) {
    keys[e.keyCode] = true
    e.preventDefault()
}

function keysReleased(e) {
    keys[e.keyCode] = false
    mymove = 0
}

function controls() {
    // move player left
    if (keys[37] && player.x >= 0) { 
        player.x -= player.speed 
        mymove = 1
    }

    //move player right
    if (keys[39] && player.x <= (c.width - player.width + 5)) { 
        player.x += player.speed
        mymove = 2
    }

    // move player up
    if (keys[38] && player.y >= 110){ 
        player.y -= player.speed
        mymove = 3
    }
    
    //move player down
    if (keys[40] && player.y <= (c.height - player.height) ) {
        player.y += player.speed
        mymove = 0
    }

    //press space to destroy bug
    if (keys[32]) {
        PopBug()
    }
}

function animatePlayer() {
    currentFrame = ++currentFrame % 4
    player.vx = currentFrame * player.width
    player.vy = 3
    switch (mymove) {
        case 0:
            player.vy = mymove * player.height
            break
        case 1:
            player.vy = mymove * player.height
            break
        case 2:
            player.vy = mymove * player.height
            break
        case 3:
            player.vy = mymove * player.height
            break
    }

    for (var i = 0; i < Bugs.length; i++) {
        Bugs[i].update();
    }
}

function getDistance(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    }
    return true;
}

function draw() {
    //player
    ctx.drawImage(playerImg, player.vx, player.vy, player.width, player.height, player.x, player.y, player.width, player.height)

    //bugs
    for (var i = 0; i < Bugs.length; i++) {
        Bugs[i].draw();
    }

    //score
    ctx.font = "25px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("Score: " + score, 20, 40);

    //timer
    ctx.font = "25px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("Timer: " + counter, 840, 40);
}

function updateFrame() {
    controls()
    ctx.clearRect(0, 0, c.width, c.height)
    draw()
    animatePlayer()
    bugCollision()
    var frame = setTimeout(() => {
        requestAnimationFrame(updateFrame)
    }, 900 / fps);
}

var startMenuModal = new bootstrap.Modal(document.getElementById('startMenu'))
var gameOverModal = new bootstrap.Modal(document.getElementById('gameOver'))

window.onload = function startMenu() {
    startMenuModal.show();
}

function startGame() {
    var timer = document.getElementById("timer").value
    var volume = document.getElementById("volume").value
    var convertedTime = timer * 1000

    happy.volume = volume;
    unhappy.volume = volume;
    begin.volume = volume;
    over.volume = volume;

    //make bugs
    Bugs = []
    for (var i = 0; i < 10; i++) {
        var bug = new Bug(getRandomInt(12, c.width - 12), getRandomInt(170, c.height), getRandomInt(-3, 3), getRandomInt(-3, 3), 30, 100)
        Bugs.push(bug)
    }

    begin.play()

    //timer
    var stimer = setInterval(() => {
        document.getElementById('score').innerHTML = score;
        gameOverModal.show()
        over.play()
    }, convertedTime);

    counter = parseInt(timer)
    var tm = setInterval(countDown, 1000);

    function countDown() {
        counter--;
        if (counter == 0) {
            clearInterval(tm);
            clearInterval(stimer);
            clearTimeout(frame);
        }
    }

    updateFrame()
}

function restartGame() {
    var restartTimer = document.getElementById("restartTimer").value
    var restartVolume = document.getElementById("restartVolume").value
    var restartConvertedTime = restartTimer * 1000;

    happy.volume = restartVolume;
    unhappy.volume = restartVolume;
    begin.volume = restartVolume;
    over.volume = restartVolume;

    Bugs = []
    for (var i = 0; i < 10; i++) {
        var bug = new Bug(getRandomInt(12, c.width - 12), getRandomInt(170, c.height), getRandomInt(-3, 3), getRandomInt(-3, 3), 20, 100)
        Bugs.push(bug)
    }

    score = 0
    counter = 0
    document.getElementById('score').innerHTML = 0

    begin.play()

    var gtimer = setInterval(() => {
        document.getElementById('score').innerHTML = score
        gameOverModal.show()
        over.play()
    }, restartConvertedTime);

    //timer
    counter = parseInt(restartTimer)
    var rtm = setInterval(restartCountDown, 1000);

    function restartCountDown() {
        counter--;
        if (counter == 0) {
            clearInterval(rtm);
            clearInterval(gtimer);
            clearTimeout(frame);
        }
    }
    updateFrame()
}

function PopBug() {
    for (var i = 0; i < Bugs.length; i++) {
        if (getDistance(player.x, player.y, player.width, player.height, Bugs[i].x, Bugs[i].y, Bugs[i].width, Bugs[i].height)) {
            happy.play()
            score++
            Bugs[i].age = 3
            return
        }
        
    }
}

function bugCollision() {
    for (var i = 0; i < this.Bugs.length; i++) {
        
        if (Bugs[i].y + Bugs[i].height >= c.height) {
            Bugs[i].age = 0
        }

        if (Bugs[i].x + Bugs[i].width >= c.width) {
            Bugs[i].vx = -Bugs[i].vx;
            Bugs[i].x = c.width - Bugs[i].width - 1;
        }
        else if (Bugs[i].x <= 0) {
            Bugs[i].vx = -Bugs[i].vx;
            Bugs[i].x = 1;
        }
    }
}


