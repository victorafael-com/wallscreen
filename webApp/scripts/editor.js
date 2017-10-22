var icons = [
	"",
	"cleaning.png",
	"health.png",
	"keyboard.png",
	"phrases.png",
	"body.png"
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
	$("#open").click(Open);
	$("#save").click(Save);
	$("#load").click(Load);
	$("#close").click(function(){
		$("#filePanel").hide();
	});
});

function NewInteractable(){
	return SpawnInteractable(formSample);
}
function DuplicateInteractable(original){
	return SpawnInteractable(original);
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
	return element;
}

function ApplyInteractableData(el){
	var displayEl = $(".interactable[index="+el.attr("index")+"]");
	var data = {
		x: el.find(".x").val(),
		y: el.find(".y").val(),
		width: el.find(".width").val(),
		height: el.find(".height").val(),
		bg: el.find(".color").val(),
		content: el.find(".txt").val(),
		icon:el.find(".icon").val(),
		type:el.find(".type").val(),
		value:el.find(".data").val()
	}
	el.css({"background":data.bg});
	el.find(".minify").text(data.content);
	displayEl.css({
		"top":data.y+"%",
		"left":data.x+"%",
		"width":data.width+"%",
		"height":data.height+"%",
		"background":data.bg
	});
	if(data.icon.trim().length > 0){
		displayEl.find("img").show().attr("src","icons/"+data.icon);
	}else{
		displayEl.find("img").hide();
	}
	if(data.type == "text"){
		displayEl.find("span").text(data.type+":");
		el.find(".dataLine").hide();
	}else{
		displayEl.find("span").text(data.type+":"+data.value);
		el.find(".dataLine").show();
	}
	displayEl.find(".txt").text(data.content);
}

function Open(){
	$("#textarea").text("");
	$("#filePanel").show();
}
function Save(){
	var allData = [];
	$("#formRoot .interactableForm").each(function(){
		var el = $(this);
		allData.push({
			x: el.find(".x").val(),
			y: el.find(".y").val(),
			width: el.find(".width").val(),
			height: el.find(".height").val(),
			bg: el.find(".color").val(),
			content: el.find(".txt").val(),
			icon:el.find(".icon").val(),
			type:el.find(".type").val(),
			value:el.find(".data").val()
		});
	});
	
	$("#textarea").val(JSON.stringify(allData));
	$("#filePanel").show();
}
function ClearScreen(){
	$("#formRoot").html("");
	$("#interactableRoot").html("");
}
function Load(){
	ClearScreen();
	var txt = $("#textarea").val();
	console.log(txt);
	var allData = JSON.parse(txt);
	for(var i = 0; i < allData.length; i++){
		var data = allData[i];
		var el = NewInteractable();
		
		el.find(".x").val(data.x);
		el.find(".y").val(data.y);
		el.find(".width").val(data.width);
		el.find(".height").val(data.height);
		el.find(".color").val(data.bg);
		el.find(".txt").val(data.content);
		el.find(".icon").val(data.icon);
		el.find(".type").val(data.type);
		el.find(".data").val(data.value);
		
		ApplyInteractableData(el);
	}
	$("#filePanel").hide();
}