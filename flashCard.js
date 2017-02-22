"use strict";

var fs = require("fs");
var inquirer = require("inquirer");
var basicQuestions = require("./basicFlashCards.json");
var clozeQuestions = require("./clozeFlashCards.json");

var score;
var count;
var basicCardArray = [];
var clozeCardArray = [];

var BasicCard = function (front, back){
    if(this instanceof BasicCard){
        this.front = front;
        this.back = back;

    }else{
        return new BasicCard(front, back);
    }
};

BasicCard.prototype.returnBasicCard = function(){
    console.log("Question: " + this.front + "\nAnswer: " + this.back);
};

function ClozeCard(text, cloze){
    if(this instanceof ClozeCard){
        this.text = text;
        this.cloze = cloze;
    } else {
        return new ClozeCard(text, cloze);
    }    
}

ClozeCard.prototype.returnClozeText = function() {
    console.log("this cloze = " + this.cloze);
    return(this.cloze);
}

ClozeCard.prototype.returnFullText = function() {
    console.log("this full = " + this.text);
    return(this.text);
}

function readBasicFlashCardFile(){
    fs.readFile("basicFlashCards.json", 'utf8', function (err,data) {
      data = JSON.parse(data); 
      for(var i = 0; i < data.length; i++) {
        var newBasicCard = new BasicCard();
        newBasicCard.front = data[i].front;
        newBasicCard.back = data[i].back;
        basicCardArray.push(newBasicCard);
      }
    });
}

function readClozeFlashCardFile(){
    fs.readFile("clozeFlashCards.json", 'utf8', function (err,data) {
      data = JSON.parse(data); 
      for(var i = 0; i < data.length; i++) {
        var newClozeCard = new ClozeCard();
        newClozeCard.text = data[i].question;
        newClozeCard.cloze = data[i].clozeDeleted;
        clozeCardArray.push(newClozeCard);
      }
    });
}

function playBasicCardObjects(){

    if( count < basicCardArray.length){
        inquirer.prompt([
            {
                name: "answer",
                message: basicCardArray[count].front
            }
        ]).then(function(response){

            if (response.answer === basicCardArray[count].back){
                score++;
                console.log(`-----------------------------`);
                console.log(`That's correct!`);
                console.log(`Current Score: ${score}`);
                console.log(`-----------------------------`);
            } else {
                console.log(`-----------------------------`);
                console.log(`That's incorrect! The correct answer is ${basicCardArray[count].back}`);
                console.log(`Current Score: ${score}`);
                console.log(`-----------------------------`);
            }
            count++;
            playBasicCardObjects();
        });

     } else if (count > basicCardArray.length - 1){
        console.log(`-----------------------------`);
        console.log(`All cards completed!`);
        console.log(`Your Score: ${score}`);
        console.log(`-----------------------------`);
        playCards();
    }

}

function playClozeCardObjects(){

    if( count < clozeCardArray.length){
        inquirer.prompt([
            {
                name: "answer",
                message: clozeCardArray[count].text
            }
        ]).then(function(response){

            if (response.answer === clozeCardArray[count].cloze){
                score++;
                console.log(`-----------------------------`);
                console.log(`That's correct!`);
                console.log(`Current Score: ${score}`);
                console.log(`-----------------------------`);
            } else {
                console.log(`-----------------------------`);
                console.log(`That's incorrect! The correct answer is ${clozeCardArray[count].back}`);
                console.log(`Current Score: ${score}`);
                console.log(`-----------------------------`);
            }
            count++;
            playClozeCardObjects();
        });

     } else if (count > clozeCardArray.length - 1){
        console.log(`-----------------------------`);
        console.log(`All cards completed!`);
        console.log(`Your Score: ${score}`);
        console.log(`-----------------------------`);
        playCards();
    }

}

function playCards(){
    score = 0;
    count = 0;
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "How would you like to Play?",
        choices: [
            { name: "BasicCard" },
            { name: "ClozeCard" },
            { name: "Exit" }
        ]

    }).then(function(answers) {
        if (answers.command === "BasicCard") {
            // playBasicCard();
            playBasicCardObjects();
        } else if (answers.command === "ClozeCard") {
            // playClozeCard();
            playClozeCardObjects();
        }else{
            console.log("Exiting.....");
            process.exit();
        }
    });

}

//start game
readBasicFlashCardFile();
readClozeFlashCardFile();
playCards();