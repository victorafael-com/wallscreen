var icons = [
	"",
	"cleaning.png",
	"health.png",
	"keyboard.png",
	"phrases.png"
];
var current = 0;
var formSample;
var interactableSample;
$(document).ready(function(){
	for(var i = 0; i < icons.length; i++){
		$(".icon").append(
			$("<option />").attr("value",icons[i]).text(icons[i])
		);
	}
	
	formSample = $(".interactableForm");
	formSample.appendTo("body").hide();
	interactableSample = $(".interactable");
	interactableSample.appendTo("body").hide();
	
	$("#new").click(NewInteractable);
});

function NewInteractable(){
	SpawnInteractable(formSample);
}
function DuplicateInteractable(original){
	SpawnInteractable(original);
}
function SpawnInteractable(source){
	var element = $(source).clone().appendTo("#formRoot").show();
	element.attr("index", current);
	element.find("*").change(function(){
		ApplyInteractableData(element);
	});
	var display = $(interactableSample).clone().appendTo("#interactableRoot").show().attr("index",current);
	ApplyInteractableData(element);
	
	element.find(".delete").click(function(){
		display.remove();
		element.remove();
	});
	element.find(".duplicate").click(function(){
		DuplicateInteractable(element);
	});
	element.click(function(c){
		if($(c.toElement).hasClass("interactableForm") || element.find(".minify").is(":visible")){
			element.find(".form").toggle();
			element.find(".minify").toggle();
		}
	});
	current++;
}

function ApplyInteractableData(el){
	var displayEl = $(".interactable[index="+el.attr("index")+"]");
	var data = {
		x: el.find(".x").val(),
		y: el.find(".y").val(),
		width: el.find(".width").val(),
		height: el.find(".height").val(),
		background: el.find(".color").val(),
		content: el.find(".txt").val(),
		icon:el.find(".icon").val()
	}
	el.css({"background":data.background});
	el.find(".minify").text(data.content);
	displayEl.css({
		"top":data.y+"%",
		"left":data.x+"%",
		"width":data.width+"%",
		"height":data.height+"%",
		"background":data.background
	});
	if(data.icon.trim().length > 0){
		displayEl.find("img").show().attr("src","icons/"+data.icon);
	}else{
		displayEl.find("img").hide();
	}
	var typeVal = el.find(".type").val();
	if(typeVal == "text"){
		displayEl.find("span").text(typeVal+":");
		el.find(".dataLine").hide();
	}else{
		displayEl.find("span").text(typeVal+":"+el.find(".data").val());
		el.find(".dataLine").show();
	}
	displayEl.find(".txt").text(data.content);
}