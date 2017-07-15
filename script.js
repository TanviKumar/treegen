function tree() {
	this.angle;
	this.axiom="F";
	this.sentence=this.axiom;
	this.len=75;
	this.weight=1;
	this.rules = [];
	this.trials=["FF+[+F-F-F]-[-F+F+F]","FF+[+F-F-F]-[--F+F+F]","FFF[++F-F-F][--F+F+F]", "FF-[-F+FF+F]+[+F-F-F]", "FF[++F[-F]+F][--F[+F]-F]"];
}

tree.prototype.generate = function() {
	this.len*=0.5;
	this.weight++;
	var nextSentence = "";
    for (var i = 0; i < this.sentence.length; i++) {
    	var current = this.sentence.charAt(i);
    	var found = false;
    
	    if (current == this.rules.a) {
	        found = true;
	        nextSentence += this.rules.b;
	    }
	    
	    if (!found) {
	        nextSentence += current;
	    }
    }
    this.sentence = nextSentence;
}

tree.prototype.initialAssign = function(text,len){
	this.len= len;
	this.weight=1;
	this.sentence=this.axiom;
	this.rules.a="F";
	this.rules.b=text;
}

tree.prototype.draw = function() {
    background(51);
    resetMatrix();
    translate(width / 2, height);
    stroke(255, 100);
    for (var i = 0; i < this.sentence.length; i++) {
    	var current = this.sentence.charAt(i);

	    if (current == "F") {
	      line(0, 0, 0, -this.len);
	      translate(0, -this.len);
	      strokeWeight(this.weight);
	    } else if (current == "+") {
	      rotate(this.angle);
	    } else if (current == "-") {
	      rotate(-this.angle);
	    } else if (current == "[") {
	    	this.weight--;	
	        push();
	    } else if (current == "]") {
	    	this.weight++;
	        pop();
    	}
    }
}

function addToInput(trialButton){
	var input =document.getElementById("input");
	input.value = trialButton.target.value;
	document.getElementById("primaryTree").click();
}

function create(text) {
	var li = document.createElement("LI");
	var newButton = document.createElement("BUTTON");
	newButton.value = text;
	newButton.innerHTML  = text;
	newButton.onclick = function(){addToInput(event);};
	li.appendChild(newButton);
	document.getElementById("trials").appendChild(li);
}

function setup() {

	var treeObject = new tree();

	treeObject.rules ={
	  a: "F",
	  b: "F"
	};

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
	
    var genButton = document.getElementById("genButton");
    genButton.addEventListener("click", function(){
    	treeObject.initialAssign(document.getElementById("input").value, document.getElementById("length").value);
    	for (var i = 0; i < 4; i++) {
    		treeObject.generate();
    	};
    	treeObject.draw();		    	
    });

    var primaryTree = document.getElementById("primaryTree");
    primaryTree.addEventListener("click", function(){
    	treeObject.initialAssign(document.getElementById("input").value, document.getElementById("length").value);
    	treeObject.generate();
    	treeObject.draw();
    });

    var iterateButton = document.getElementById("iterate");
    iterateButton.addEventListener("click", function(){treeObject.generate();
    	treeObject.draw();
    });

    var saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", function(){
    	var input = document.getElementById("input").value;
    	create(input);
    	treeObject.trials.push(input);
    	localStorage.setItem("trials", JSON.stringify(treeObject.trials));
    })

	createCanvas(700,700);
    treeObject.angle = radians(25);
    background(51);
    treeObject.draw();
  
}
