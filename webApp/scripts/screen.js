var interactableMap = [];
var currentInteractable = null;
var currentInteractableTime;

var interactionTime = 3;

class Interactable {
	constructor (data){
		this.data = data;
		this.CreateInteractable(data);
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
		interactableMap.push(this);
		this.element = root;
		this.canInteract = true;
	}
	
	PointerIn(){
		console.log("Pointer In");
		this.canInteract = true;
		this.element.addClass("hovered");
	}
	PointerOut(){
		console.log("Pointer Out");
		this.element.removeClass("hovered");
	}
	Interact(){
		this.canInteract = false;
		console.log("Interact");
	}
}





function CheckCurrentInteractable(x,y){
	var el = document.elementFromPoint(x,y);
	if(el == null){
		console.log("null element on check");
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