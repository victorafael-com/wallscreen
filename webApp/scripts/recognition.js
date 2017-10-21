var currentState = RecogState.Calibrating;
var recogRect = new Rect();
var calibratingPhase = 0;



function RecogStart(){
	$("#videoElement").click(function(c){
		if(currentState != RecogState.Calibrating)
			return;
		console.log(c);
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
			currentState = RecogState.Recognizing;
			$("#recalibrate").hide();
	$("#recogCanvas").show();
			break;
		}
	});
	$("#recalibrate-0").show();
	$("#recalibrate").show();
};

function UpdateRecognition(){
	if(currentState == RecogState.Calibrating)
		return;
	
	var iterations = 100;
	
	recogContext.drawImage(video, 0,0, recogCanvas.width, recogCanvas.height);
	recogData = recogContext.getImageData(0,0,recogCanvas.width,recogCanvas.height);
	
	var bestColor = new Color(0,0,0);
	var bestColorPos = new Vector2(-1,-1);
	
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
			
			SetPixel(Math.round(point.x), Math.round(point.y), new Color(255 * x/iterations, 255 * y/iterations,0));
		}
	}
	recogContext.putImageData(recogData,0,0);
	$("#debug-l1").text(bestColor.r + " -- " + Math.round(bestColorPos.x)+", "+Math.round(bestColorPos.y));
}
function GetPixel(x, y) {
	var index = (y*recogData.width+x)*4;
	
	return new Color(recogData.data[index],recogData.data[index+1],recogData.data[index+2]);
}
function SetPixel(x, y, color){
	var index = (y*recogData.width+x)*4;
	recogData.data[index] = color.r;
	recogData.data[index+1] = color.g;
	recogData.data[index+2] = color.b;
}