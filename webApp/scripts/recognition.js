var currentState = RecogState.Calibrating;
var recogRect = new Rect();
var calibratingPhase = 0;

var laserPointMinRed = 245;
var laserPointLowLightMinRed = 175;
var lowLightAverage = 70;

function RecogStart(){
	$("#videoElement").click(function(c){
		if(currentState != RecogState.Calibrating)
			return;
		
		switch(calibratingPhase){
			case 0:
			calibratingPhase++;
			$("#recalibrate-0").hide();
			$("#recalibrate-1").show();
			recogRect.topLeft = new Vector2(c.offsetX, c.offsetY);
			break;
			case 1:
			calibratingPhase++;
			$("#recalibrate-1").hide();
			$("#recalibrate-2").show();
			recogRect.topRight = new Vector2(c.offsetX, c.offsetY);
			break;
			case 2:
			calibratingPhase++;
			$("#recalibrate-2").hide();
			$("#recalibrate-3").show();
			recogRect.bottomLeft = new Vector2(c.offsetX, c.offsetY);
			break;
			case 3:
			calibratingPhase = 0;
			$("#recalibrate-3").hide();
			recogRect.bottomRight = new Vector2(c.offsetX, c.offsetY);
			recogRect.CalculateBoundaries();
			currentState = RecogState.Recognizing;
			$("#recalibrate").hide();
			if(IsDebugging){
				$("#recogCanvas").show();
			}
			break;
		}
	});
	$("#recalibrate-0").show();
	$("#recalibrate").show();
	
	if(IsDebugging){
		$("#interactableRoot").css({"opacity":"0.5"});
	}
};

function UpdateRecognition(){
	if(currentState == RecogState.Calibrating)
		return;
	
	var iterations = 80;
	
	recogContext.drawImage(video, 0,0, recogCanvas.width, recogCanvas.height);
	recogData = recogContext.getImageData(0,0,recogCanvas.width, recogCanvas.height);
	
	var bestColor = new Color(0,0,0);
	var bestColorPos = new Vector2(-1,-1);
	
	var average = 0;
	
	for(var x = 0; x < iterations; x++){
		var top = Vector2.Lerp(recogRect.topLeft, recogRect.topRight, x / iterations);
		var bottom = Vector2.Lerp(recogRect.bottomLeft, recogRect.bottomRight, x / iterations);
		
		for(var y = 0; y < iterations; y++){
			var point = Vector2.Lerp(top, bottom, y / iterations);
			
			var pointColor = GetPixel(Math.round(point.x), Math.round(point.y));
			if(pointColor.r > bestColor.r){
				bestColor = pointColor;
				bestColorPos.x = x;
				bestColorPos.y = y;
			}
			average += pointColor.r;
			if(IsDebugging){
				SetPixel(Math.round(point.x), Math.round(point.y), new Color(255 * x/iterations, 255 * y/iterations,0));
			}
		}
	}
	
	average /= (iterations * iterations);
	if(IsDebugging){
		recogContext.putImageData(recogData,0,0);
		Debug.Show(bestColor.r + " (avg: "+average+")-- " + Math.round(bestColorPos.x)+", "+Math.round(bestColorPos.y),0);
		
	}
	if(debugNextFrame){
		var txt = bestColor.r + " (avg: "+average+")-- " + Math.round(bestColorPos.x)+", "+Math.round(bestColorPos.y);
		console.log(txt);
		debugNextFrame = false;
		$("<div />").addClass("debug").hide().append(
			$("<span />").text(txt)
		).append(
			$("<img />").attr("src",recogCanvas.toDataURL())
		).appendTo("body");
	}
	var x = -1;
	var y = -1;
	if(bestColor.r > laserPointMinRed || (average < lowLightAverage && bestColor.r > laserPointLowLightMinRed)){
		x = bestColorPos.x * window.innerWidth/iterations;
		y = bestColorPos.y * window.innerHeight/iterations;
	}
	
	CheckCurrentInteractable(x,y); //screen.js
}
function GetPixel(x, y) {
	var index = (y*recogData.width + x)*4;
	
	return new Color(recogData.data[index],recogData.data[index+1],recogData.data[index+2]);
}
function SetPixel(x, y, color){
	var index = (y*recogData.width+x)*4;
	recogData.data[index] = color.r;
	recogData.data[index+1] = color.g;
	recogData.data[index+2] = color.b;
}