//Definition of the tree class.
function tree() {
	this.angle = 0;
	this.axiom = "F";
	this.sentence = this.axiom;
	this.len = 75;
	this.weight = [];
	this.branchValue = 1;
	this.check = false;
	this.alphabet= ["F", "f", "[", "]", "+", "-"];
	this.rules = {
	  letter: "",
	  becomes: ""
	};
	this.trials = ["F[-F]F[+F][F]","FF[--F+F][+FF---F]",
	"FF[++F-F-F][-F+F+F]","FF[++F-F-F][--F+F+F]","FFF[++F-F-F][--F+F+F]",
	 "FF[--F+FF+F][+F-F-F]", "FF[++F[-F]+F][--F[+F]-F]", 
	 "FF[++F[-F]+F][F[+F]-F][--F[+F]-F]", "FFF[++FF[--F][++F]][FF[++F][--F]][--FF[++F][--F]]"];
}

//Generates the next sentence. It applies the rules to the current 
//sentence to do so.
tree.prototype.generate = function() {
	var check = false;
	var openCount = 0;
	var closeCount = 0;
	for (var i = 0; i < this.rules.becomes.length; i++) {
		var current = this.rules.becomes.charAt(i);
		check = false;
		for (var j = 0; j < this.alphabet.length; j++) {
			if(current == this.alphabet[j]){
				check = true;
				break;
			}
		};
		if(check == false){
			break;
		}
	};

	for (var i = 0; i < this.rules.becomes.length; i++) {
		var current = this.rules.becomes.charAt(i);
		if(current == "["){
			openCount += 1;
		}
		if(current == "]"){
			closeCount += 1;
		}
	};
	if(check == false || openCount != closeCount){
		if(openCount != 0 || closeCount !=0){
			alert("Incorrect Design");
			this.check = true;
		}
	}
	else{
		this.len *= 0.5; //So the tree becomes denser instead of larger.
		this.branchValue += 1; //To ensure increased thickness of trunk.
		var nextSentence = "";
	    for (var i = 0; i < this.sentence.length; i++) {
	    	var current = this.sentence.charAt(i);
	    	if(current == current.toLowerCase()) {
	    		current = current.toUpperCase();
	    	}
	    	var found = false;
	    
		    if (current == this.rules.letter) {
		        found = true;
		        nextSentence += this.rules.becomes;
		    }
		    
		    if (!found) {
		        nextSentence += current;
		    }
	    }
	    this.sentence = nextSentence;
	    this.check = false;
	}
    
}

//Sets the required values for the tree.
tree.prototype.initialAssign = function(text,len){
	this.len = len;
	this.branchValue = 1;
	this.sentence = this.axiom;
	this.rules.letter = "F";
	this.rules.becomes = text;
}

//Assigns colors to different parts of tree
tree.prototype.colorAssign = function() {
	var colorValue;
	if(this.branchValue > 5){
		colorValue = document.getElementById("colorSet5").value;
	}
	else if(this.branchValue > 0){
		colorValue = document.getElementById("colorSet" + (this.branchValue)).value;
	}
	else{
		colorValue = document.getElementById("colorSet1").value;
	}
	stroke(colorValue);
}

//The drawing of the tree. 
tree.prototype.draw = function() {
    background(10);
    colorValue = color(document.getElementById("bgColorSet").value);
    fill(colorValue);
    rect(0,0,width,height);
    resetMatrix();
    translate(width / 2, height);

    for (var i = 0; i < this.weight.length; i++) {
    	this.weight[i]= document.getElementById("widthSet" + (i+1)).value;
    };

    for (var i = 0; i < this.sentence.length; i++) {
    	var current = this.sentence.charAt(i);

	    if (current == "F" || current == "f") {
	    	if(this.branchValue > 5)
	        	strokeWeight(this.weight[4]);
	        else if(this.branchValue > 0)
	        	strokeWeight(this.weight[this.branchValue-1]);
	        else
	        	strokeWeight(this.weight[0]);

	        if(document.getElementById("trippyColor").checked==true){
    			var colorValue = getRandomColor();
    			stroke(colorValue);
		    }
		    else{
		    	this.colorAssign();
		    }

	        line(0, 0, 0, -this.len);
	        translate(0, -this.len);
	    } 
	    else if (current == "+") {
	      	rotate(this.angle);
	    } 
	    else if (current == "-") {
	        rotate(-this.angle);
	    } 
	    else if (current == "[") {
	    	this.branchValue -= 1;	
	        push();
	    } 
	    else if (current == "]") {
	    	this.branchValue += 1;
	        pop();
    	}
    }
}

//Returns a random color.
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var colorValue = '#';
  for (var i = 0; i < 6; i++) {
    colorValue += letters[Math.floor(Math.random() * 16)];
  }
  return colorValue;
}

//On clicking on of the trial button, primary tree is generated.
function addToInput(text) {
	var input =document.getElementById("input");
	input.value = text;
	document.getElementById("primaryTree").click();
}

//Creates the button and appends to the list.
function create(text) {
	var li = document.createElement("LI");
	var newButton = document.createElement("BUTTON");
	newButton.value = text;
	newButton.innerHTML  = text;
	newButton.onclick = function(){
		addToInput(text);
	};
	li.appendChild(newButton);
	document.getElementById("trials").appendChild(li);
}

//Runs on loading.
function setup() {

	var treeObject = new tree(); //creates object of the class tree.
    treeObject.angle = radians(25);
    for (var i = 0; i < 5; i++) {
    	treeObject.weight[i] = i+1;
    };

    //Adds options if no options have been added before else displays all options.
	var trialNotEmpty = JSON.parse(localStorage.getItem("trials"));
	if(!trialNotEmpty){
		localStorage.setItem("trials", JSON.stringify(treeObject.trials));
		for (var i = 0; i < treeObject.trials.length; i++) {
			create(treeObject.trials[i]);
		};
	}
	else{
		treeObject.trials = JSON.parse(localStorage.getItem("trials"));
		for (var i = 0; i < treeObject.trials.length; i++) {
			create(treeObject.trials[i]);
		};
	}

	//Functionality for button to generate 3 iterations of a tree.

	var genButton3 = document.getElementById("genButton3");
	genButton3.addEventListener("click", function(){
    	var angle = document.getElementById("angle").value;
    	treeObject.angle = radians(angle);
    	treeObject.initialAssign(document.getElementById("input").value, document.getElementById("length").value);
    	for (var i = 0; i < 3; i++) {
    		treeObject.generate();
    	};
    	treeObject.draw();		    	
    });

	
	//Functionality for button to generate 4 iterations of a tree.
    var genButton4 = document.getElementById("genButton4");
    genButton4.addEventListener("click", function(){
    	var angle = document.getElementById("angle").value;
    	treeObject.angle = radians(angle);
    	treeObject.initialAssign(document.getElementById("input").value, document.getElementById("length").value);
    	for (var i = 0; i < 4; i++) {
    		treeObject.generate();
    	};
    	treeObject.draw();		    	
    });

    //Functionality for button to generate primary branch.
    var primaryTree = document.getElementById("primaryTree");
    primaryTree.addEventListener("click", function() {
    	var angle = document.getElementById("angle").value;
    	treeObject.angle = radians(angle);
    	treeObject.initialAssign(document.getElementById("input").value, document.getElementById("length").value);
    	treeObject.generate();
    	treeObject.draw();

    });

    //Functionality for button to create another iteration of present tree.
    var iterateButton = document.getElementById("iterate");
    iterateButton.addEventListener("click", function() {
    	treeObject.generate();
    	treeObject.draw();
    });

    //Saves your rule to localStroage and adds to list.
    var saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", function() {
    	var input = document.getElementById("input").value;
    	create(input);
    	treeObject.trials.push(input);
    	localStorage.setItem("trials", JSON.stringify(treeObject.trials));
    });

    //Redraws and accounts for any changes made to color and widths
    var reGen = document.getElementById("reGen");
    reGen.addEventListener("click", function() {
    	treeObject.len = document.getElementById("length").value;
    	//Reduces length based on the extent of the tree already made.
	    for (var i = 0; i < treeObject.branchValue - 1; i++) {
	    	treeObject.len *= 0.5;
	    };
	    treeObject.angle = radians(document.getElementById("angle").value);
	    
    	treeObject.draw();
    })

	createCanvas(800,700); 
    background(51);
    treeObject.draw();
  
}
