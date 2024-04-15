
var socket;
var myPlayer;
var myId;
var foodObjects = []

class Potato{
    constructor(name, qty){
        this.name = name
        this.qty = qty
    }

    SayHello(){
        console.log("My name is " + this.name + " and im a potato")
    }
}

class Tomato{
    constructor(name, qty, color){
        this.name = name
        this.qty = qty
        this.color = color
    }

    SayHello(){
        console.log("My name is " + this.name + " and im a tomato")
    }
}

// everything about the (loading) before the game starts
function preload() {
}


// First thing called when the game is started, called only once
function setup() {
    players = [];
    myId = 0;

    socket = io();
    
    // Send data to server to tell our name
    myName = "John" + Math.floor(Math.random()*100)
    socket.emit("imReady", {name: myName});


    // Listening for the new ID the server gives us
    socket.on("yourId", function(data) {
        myId = data.id;
        console.log("My ID is " + myId)
    });

    socket.on("newPlayer", function(data) {
        var player = new Player(data.id, data.name, data.x, data.y);
        players.push(player);
    });

    socket.on("initPack", function(data) {
        console.log("initPack is called")
        for(var i in data.initPack) {
            var player = new Player(data.initPack[i].id, data.initPack[i].name, data.initPack[i].x, data.initPack[i].y);
            players.push(player);
        }
    });

    socket.on("updatePack", function(data) {
        for(var i in data.updatePack) {
            for(var j in players) {
                if(players[j].id === data.updatePack[i].id) {
                    players[j].x = data.updatePack[i].x;
                    players[j].y = data.updatePack[i].y;
                    players[j].angle = data.updatePack[i].angle;
                    players[j].mass = data.updatePack[i].mass;
                    players[j].radius = data.updatePack[i].radius;
                }
            }
        }
    });


    socket.on("updateObject", function(data) {
        foodObjects = []
        data.foodObjects.forEach(e => {
            foodObjects.push(new Food (e.value, e.x, e.y))
        });
    });


    // Listening for a player to leave
    socket.on("someoneLeft", function(data) {
        for(var i in players) {
            if(players[i].id === data.id) {
                players.splice(i, 1); // remove the player from our list of player to draw
            }
        }
    });


    createCanvas(windowWidth, windowHeight); // Set up canva for drawing
}





///////////////////////////////////////////////////////////////////////////////////////////////////////////////




// Called a lot per second to display graphics on screen
function draw(){

    background(150,150,150)  //Draw the map background // Color with rgb code

    // Center camera on player // TODO optimize
    var pX
    var pY
    var pMass
    var pRadius
    for(var i in players) {
        if(players[i].id === myId) {
            pX = players[i].x
            pY = players[i].y
            pMass = players[i].mass
            pRadius = players[i].radius
        }
    }

    // Display score (always top left) - STATIC
    push()
    textSize(50);
    text("Mass: " + pMass, 50, 100)
    pop()

    translate(width/2 - pX, height/2 - pY);

    // Draw objects on the map
    rectMode(CENTER) // Set the rect to always be centered
    rect(0,0,10,10) // rect(x,y,width,height)
    rect(100,0,10,10)
    rect(0,100,10,10)
    rect(100,100,10,10)

    // Draw food
    foodObjects.forEach(e=>{
        e.draw();
    });


    //Draw players
    for(var i in players) {
        players[i].draw();
    }

    
    
    
    sendInputData() // Send data of the player to the server
}



function sendInputData() {
    var angle = atan2(mouseY - windowHeight/2, mouseX - windowWidth/2);
    socket.emit("inputData", {mouseX, mouseY, angle, windowWidth, windowHeight});
}





class Player{
    constructor(id, name,x,y){
        this.id = id
        this.name = name
        this.x = x
        this.y = y
        this.angle = 0
        this.mass = 0
        this.radius = 0
    }

    draw(){
        // push()
        // translate(this.x, this.y) // Center the next drawing on the player coordinates
        // // Draw name
        // textSize(30);
        // text(this.name,-50,-50)
        // rotate(this.angle) // Rotate player object to be aligned with the mouse

        // // Draw the object representing the player
        // fill(255,0,0)
        // beginShape()
        // vertex(30,0)
        // vertex(30-90, 30)
        // vertex(30-75,0)
        // vertex(30-90,-30)
        // endShape(CLOSE)
        // pop()


        push()
        translate(this.x, this.y)

        // Draw circle
        fill(255, 0, 0) // Color
        circle(0, 0, this.radius)

        // Draw name
        fill(0,0,0) // Black
        textSize(30);
        text(this.name, -50, 0)

        pop()
    }
}



class Food{
    constructor(value, x, y){
        this.value = value
        this.x = x
        this.y = y
    }

    draw(){
        push()
        fill(0,0,255)
        circle(this.x, this.y, 50) // rect(x,y,radius)
        pop()
    }
}