var RecogState = {
	"Calibrating":1,
	"Recognizing":2
}
Object.freeze(RecogState);


function Color(_r,_g,_b){
	this.r = _r;
	this.g = _g;
	this.b = _b;
	
	this.Rdist = function(other){
		return Math.abs(this.r - other.r);
	}
	this.Distance = function(other){
		return Math.abs(this.r - other.r) + Math.abs(this.g - other.g) + Math.abs(this.b - other.b);
	}
}
class Vector2 {
	constructor (_x,_y){
		this.x = _x;
		this.y = _y;
	}
	static Distance (v1,v2){
		return Math.sqrt((v2.x - v1.x)^2 + (v2.y - v1.y)^2);
	}
	static Lerp (v1,v2,l){
		return new Vector2(
			Lerp(v1.x,v2.x,l),
			Lerp(v1.y,v2.y,l)
		);
	}
}
/*
function Vector2(_x,_y){
	this.x = _x;
	this.y = _y;
}
Vector2.prototype.Distance = function(v1,v2){
	return Math.sqrt((v2.x - v1.x)^2 + (v2.y - v1.y)^2);
}
Vector2.prototype.Lerp = function(v1,v2,l){
	return new Vector2(
		Lerp(v1.x,v2.x,l),
		Lerp(v1.y,v2.y,l)
	);
}*/

function Lerp(a,b,l){
	return a + (b - a) * l;
}

function Rect(_topLeft, _topRight, _bottomRight, _bottomLeft){
	this.topLeft = _topLeft;
	this.topRight = _topRight;
	this.bottomLeft = _bottomLeft;
	this.bottomRight = _bottomRight;
}