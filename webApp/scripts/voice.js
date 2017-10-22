var voice = 0;

speechSynthesis.onvoiceschanged = function(){
}

function Speak(text){
	var utter = new SpeechSynthesisUtterance(text);
	speechSynthesis.speak(utter);
}