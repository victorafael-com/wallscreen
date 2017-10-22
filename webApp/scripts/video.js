// canvases
var canvas;
var context;
var recogCanvas;
var recogContext;

// video
var video;
var fps = 15;
var needVideo = false;

// recognition
var recogData;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
 
$(document).ready(function(){
	video = $("#videoElement")[0];
	canvas = $("#wallScreenCanvas")[0];
	context = canvas.getContext("2d");
	recogCanvas = $("#recogCanvas")[0];
	recogContext = recogCanvas.getContext("2d");
	if (navigator.getUserMedia) {       
		// get webcam feed if available
		navigator.getUserMedia({video: true}, handleVideo, videoError);
	} 
});
 
function handleVideo(stream) {
    // if found attach feed to video element
    video.src = window.URL.createObjectURL(stream);
	
	Start();
}
function videoError(error){
	console.log(error);
}

//Start
function Start(){
	if(video.videoWidth > 0){
		
		recogCanvas.width = video.videoWidth;
		recogCanvas.height = video.videoHeight;
		
		RecogStart();
		Update();
	}else{
		setTimeout(Start, 1/fps);
	}
}

//Repeats every frame
function Update(){
	if(needVideo)
		UpdateVideoDisplayCanvas();
	
	UpdateRecognition(); //recognition.js
	
	setTimeout(Update, 1 / fps);
}
function UpdateVideoDisplayCanvas(){
	context.drawImage(video, 0,0, canvas.width, canvas.height);
}