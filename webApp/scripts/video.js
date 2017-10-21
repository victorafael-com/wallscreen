// check for getUserMedia support
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
 
if (navigator.getUserMedia) {       
    // get webcam feed if available
    navigator.getUserMedia({video: true}, handleVideo, videoError);
}
 
function handleVideo(stream) {
    // if found attach feed to video element
    video.src = window.URL.createObjectURL(stream);
}
function videoError(error){
	console.log(error);
}