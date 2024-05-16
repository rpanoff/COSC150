//Original by Aaron Weeden, Shodor Education Foundation; Modifications by Bob Panoff

//Initialize variables

var canvas,
    context,
    people = new Array(),
   
//Set the initial population in total
 
    numPeople = 400, 
 
 //Each of persons has the same properties, except one is "infected:
   
    personWidth = 10,
    personHeight = 10,
    maxDistanceMoved = 20,
    infectionRate = .25,
    infectionDuration = 42,
    infectionRadius = 0;
    
    numInfected = 0;
    time=0;

window.onload = function () {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    initializePeople();

    setTimeout("step();", 100);
}

//Give everyone a random x,y on the canvas, make all susceptible

function initializePeople () {
    for (var i = 0; i < numPeople; i++) {
        people[i] = new Object();
        people[i].x = Math.random() * (canvas.width - personWidth);
        people[i].y = Math.random() * (canvas.height - personHeight);
        people[i].state = "susceptible";
        people[i].numDaysSick = 0;
    }
// make the 0th person infected

    people[0].state = "infected";
    
//Put initial infected person at center; else comment out next two lines for random 

 	 people[0].x = 0.5 * (canvas.width - personWidth);
   	 people[0].y = 0.5 * (canvas.height - personHeight);
}

//This is really the logic of the program
function step () {
    time++;
    incrementNumDaysSick();
    immunizePeople();
    infectPeople();
    movePeople();
    drawPeople();
    printPopCounts();
    
//Stop if no infected left

  	if (numInfected > 0) {
       setTimeout("step();", 10);
  	 }

}

function incrementNumDaysSick () {
    for (var i = 0; i < numPeople; i++) {
        if (people[i].state == "infected") {
            people[i].numDaysSick++;
        }
    }
}

function immunizePeople () {
    for (var i = 0; i < numPeople; i++) {
        if (people[i].state == "infected" &&
                people[i].numDaysSick == infectionDuration) {
            people[i].state = "immune";
        }
    }
}

function infectPeople () {
    for (var i = 0; i < numPeople; i++) {
        if (people[i].state == "infected") {
            for (var j = 0; j < numPeople; j++) {
                if (people[j].state == "susceptible" &&
                        intersects(people[i], people[j]) &&
                        Math.random() < infectionRate) {
                    people[j].state = "infected";
                }
            }
        }
    }
}

function intersects (person1, person2) {
    return (person1.x < person2.x + personWidth + infectionRadius &&
            person1.x + personWidth + infectionRadius  > person2.x &&
            person1.y < person2.y + personHeight  + infectionRadius &&
            person1.y + personHeight  + infectionRadius > person2.y);
}

function movePeople () {
    var newX,
        newY;

    for (var i = 0; i < numPeople; i++) {
        newX = -1;
        newY = -1;

        while (!positionIsOk(newX, newY)) {
            newX = people[i].x + randomDistance();
            newY = people[i].y + randomDistance();
        }

        people[i].x = newX;
        people[i].y = newY;
    }
}

function positionIsOk (newX, newY) {
    return (newX >= 0 && newX <= canvas.width - personWidth && newY >= 0 &&
            newY <= canvas.height - personHeight);
}

function randomDistance() {
    return Math.floor(Math.random() * (maxDistanceMoved + 1)) -
        (maxDistanceMoved / 2);
}

function drawPeople () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < numPeople; i++) {
        setColor(people[i].state);
        context.fillRect(people[i].x, people[i].y, personWidth,
                personHeight);
    }
}

function setColor (personState) {
    if (personState == "susceptible") {
        context.fillStyle = "blue";
    } else if (personState == "infected") {
        context.fillStyle = "red";
    } else if (personState == "immune") {
        context.fillStyle = "green";
    }
}

function printPopCounts () {
   var numSusceptible = 0;
   var numImmune = 0;
   
   numInfected = 0;
   for (var i = 0; i < numPeople; i++) {
       if (people[i].state == "susceptible") {
           numSusceptible++;
       } else if (people[i].state == "infected") {
           numInfected++;
       } else if (people[i].state == "immune") {
           numImmune++;
       }
   }
   context.fillStyle = "black";
   context.font = "15px monospace";
   context.fillText("Susceptible: " + numSusceptible, 0, 20);
   context.fillText("Infected: " + numInfected, 0, 40);
   context.fillText("Recovered: " + numImmune, 0, 60);
   context.fillText("Time: " + time, 0, 80);
}
