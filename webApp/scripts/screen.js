var interactableMap = [];
var currentInteractable = null;
var currentInteractableTime;
var currentScreen = "";
var lastScreen = "";

var interactionTime = 3;

class Interactable {
	constructor (data){
		this.data = data;
		this.CreateInteractable(data);
	}
	
	static Create(data){
		new Interactable(data);
	}
	
	CreateInteractable(data){
		var index = interactableMap.length;
	
		var root = $("<div />").addClass("interactable").appendTo("#interactableRoot");
		root.css({
			"top":data.y+"%",
			"left":data.x+"%",
			"width":data.width+"%",
			"height":data.height+"%",
			"background":data.bg
		});
		root.attr("interactable-index", index);
		
		root.append($("<div />").addClass("interactable-bg"));
		
		var labelDiv = $("<div />").addClass("interactable-content");
		if(data.icon.length > 0){
			labelDiv.append($("<img />").attr("src","icons/"+data.icon));
		}
		labelDiv.append($("<div />").text(data.content));
		root.append(labelDiv);
		
		interactableMap.push(this);
		this.element = root;
		this.canInteract = true;
	}
	
	PointerIn(){
		this.canInteract = true;
		this.element.addClass("hovered");
	}
	PointerOut(){
		this.element.removeClass("hovered");
	}
	Interact(){
		this.canInteract = false;
		switch(this.data.type){
			case "link":
			if(this.data.value == "-back"){
				LoadScreen(lastScreen);
			}else{
				LoadScreen(this.data.value);
			}
			break;
			case "text":
			Speak(this.data.content); //voice.js
			break;
			case "special":
			if(this.data.value.startsWith("char")){
				$("#textField").text($("#textField").text()+this.data.value.substr(5))
			}else if(this.data.value == "backspace"){
				var txt = $("#textField").text();
				$("#textField").text(txt.substr(0,txt.length - 1));
			}else if(this.data.value == "speak"){
				var txt = $("#textField").text();
				if(txt.trim().length > 0){
					Speak(txt);
					$("#textField").text("");
				}
			}
			break;
			default:
			console.logerror("Invalid data type: "+this.data.type);
			break;
		}
	}
}


function CheckCurrentInteractable(x,y){
	var el = document.elementFromPoint(x,y);
	if(el == null){
		if(currentInteractable != null){
			currentInteractable.PointerOut();
			currentInteractable = null;
		}
		return;
	}
	
	Debug.Show("element not null",1);
	var interactableElement = $(el).closest(".interactable")[0];
	
	if(interactableElement == null){
		if(currentInteractable != null){
			currentInteractable.PointerOut();
			currentInteractable = null;
		}
		return;
	}
	var index = $(interactableElement).attr("interactable-index");
	var interactable = interactableMap[index];
	
	Debug.Show("interactableElement not null. index: "+index, 2);
	
	if(currentInteractable != interactable){
		if(currentInteractable != null){
			currentInteractable.PointerOut();
		}
		currentInteractable = interactable;
		currentInteractable.PointerIn();
		currentInteractableTime = new Date();
	}else{
		if(!currentInteractable.canInteract) return;
		var ellapsed = new Date() - currentInteractableTime;
		ellapsed /= 1000;
		
		Debug.Show("Ellapsed time: "+ellapsed, 3);
		if(ellapsed >= interactionTime){
			currentInteractable.Interact();
		}
	}
}



function LoadScreen(jsonURL){
	lastScreen = currentScreen;
	currentScreen = jsonURL;
	ClearInteractables();
	if(jsonURL == "data/keyboard.json"){
		$("#textField").show();
	}else{
		$("#textField").hide();
	}
	$.getJSON(jsonURL, function(data){
		for(var i = 0; i < data.length; i++){
			Interactable.Create(data[i]);
		}
	});
}

function ClearInteractables(){
	$("#interactableRoot").html("");
	interactableMap = [];
	currentInteractable = null;
}

//Create interactable animation css
var style=document.createElement('style');
style.type='text/css';
var styleTxt = '.interactable.hovered .interactable-bg{animation-duration:'+interactionTime+'s}';
if(style.styleSheet){
    style.styleSheet.cssText= styleTxt;
}else{
    style.appendChild(document.createTextNode(styleTxt));
}
document.getElementsByTagName('head')[0].appendChild(style);