const { text } = require("express");

var socket
var players = []
var myId = 0



// ---Functions from p5js that we are overwritting (preload, setup, draw)---

// Loading before the game starts
function preload(){
}


// First thing called when the game is started, called only once
function setup() {

    

    socket = io();
    
    // Send data to server to tell our name
    socket.emit("imReady", {name: "John"});

    // var myVar = new AZERTY(88) //////////////////////////////////////////////////
    // myVar.SayHello()


    // Listening for the new ID the server gives us
    socket.on("yourId", function(data) {
        myId = data.id;
        console.log("My ID is " + myId)
    });

    socket.on("newPlayer", function(data) {
        console.log("newPlayer is called")
        var player = new Player(data.id, data.name, data.x, data.y);
        players.push(player);
    });

    socket.on("initPack", function(data) {
        console.log("initPack is called")
        for(var i in data.initPack) {
            var player = new Player(data.initPack[i].id, data.initPack[i].name, data.initPack[i].x, data.initPack[i].y);
            player.SayHello();
            console.log(player.id)
            players.push(player);
            console.log(myId);
        }
    });

    socket.on("updatePack", function(data) {
        for(var i in data.updatePack) {
            for(var j in players) {
                if(players[j].id === data.updatePack[i].id) {
                    players[j].x = data.updatePack[i].x;
                    players[j].y = data.updatePack[i].y;
                    players[j].angle = data.updatePack[i].angle;
                }
            }
        }
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
    console.log("windowWidth : " + windowWidth)
}



// Called a lot per second to display graphics on screen
function draw(){

    background(150,150,150)  //Draw the map background // Color with rgb code
    
    sendInputData() // Send data of the player to the server
    
    // Center camera on player // TODO optimize
    for(var i in players) {
        if(players[i].id === myId) {
            translate(width/2 - players[i].x, height/2 - players[i].y);
        }
    }

    //Draw players
    for(var i in players) {
        players[i].draw();
    }

    // Draw objects on the map
    translate(0,0)
    rectMode(CENTER) // Set the rect to always be centered
    rect(0,0,10,10) // rect(x,y,width,height)
    rect(100,0,10,10)
    rect(0,100,10,10)
    rect(100,100,10,10)
}



function sendInputData() {
    var angle = atan2(mouseY - windowHeight/2, mouseX - windowWidth/2);
    socket.emit("inputData", {mouseX, mouseY, angle, windowWidth, windowHeight});
}



// class Player{
//     constructor(id, name,x,y){
//         this.id = id
//         this.name = name
//         this.x = x
//         this.y = y
//         this.angle = 0
//     }

//     draw(){
//         push()
//         translate(this.x, this.y) // Center the next drawing on the player coordinates
//         rotate(this.angle) // Rotate player object to be aligned with the mouse
        
//         // Draw the object representing the player
//         fill(255,0,0)
//         beginShape()
//         vertex(30,0)
//         vertex(30-90, 30)
//         vertex(30-75,0)
//         vertex(30-90,-30)
//         endShape(CLOSE)

//         // Draw name
//         //text(this.name,0,0)
//         pop()
//     }
// }


// var Player = function(id, name, x, y) {
// // function Player(id, name,x,y){
//     this.id = id
//     this.name = name
//     this.x = x
//     this.y = y
//     this.angle = 0
//     this.draw = function(){
//         push()
//         translate(this.x, this.y) // Center the next drawing on the player coordinates
//         rotate(this.angle) // Rotate player object to be aligned with the mouse
        
//         // Draw the object representing the player
//         fill(255,0,0)
//         beginShape()
//         vertex(30,0)
//         vertex(30-90, 30)
//         vertex(30-75,0)
//         vertex(30-90,-30)
//         endShape(CLOSE)

//         // Draw name
//         //text(this.name,0,0)
//         pop()
//     }
//     this.SayHello = function(){
//         console.log("Hello from " + this.name)
//     }

//     return this
// }

// The player object constructor
var Player = function(id, name, x, y) {
    this.id = id;
    this.name = name;
    this.location = createVector(x, y);
    this.angle = 0;

    this.draw = function() {
    
        push();
        translate(this.location.x, this.location.y);
        rotate(this.angle);
        fill(255, 0, 0);
        beginShape();
        vertex(30 + 30, 0);
        vertex(30 + -70, 30);
        vertex(30 + -45, 0);
        vertex(30 + -70, -30);
        endShape(CLOSE);
        pop();
        
        // this.speedX = cos(angle) * 3; // cosine is never gonna get more than 1
        // this.speedY = sin(angle) * 3;

        // if(this.speedX > 3) {
        //     this.speedX = 3;
        // }
    
        // if(this.speedY > 3) {
        //     this.speedY = 3;
        // }
    
        // this.x += this.speedX;
        // this.y += this.speedY;
    }
    
    return this;
}