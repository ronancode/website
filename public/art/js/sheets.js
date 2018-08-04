var canvas = document.getElementById('render');
var width;
var height;

var smaller_dimension;

context = canvas.getContext('2d');

document.body.style.backgroundColor = "rgba(0,0,0,1)";

function initialize() {
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();
}

// Handle window resizing
function resizeCanvas() {
	width = window.innerWidth;
	height = window.innerHeight;

	canvas.height = height-20;
	canvas.width = width-20;

	if (height >= width) {
		smaller_dimension = width;
	}
	else {
		smaller_dimension = height;
	}

	console.log("width: " + width);
	console.log("height: " + height);

	scale = 60*(smaller_dimension/300);
}

initialize();

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomPoint(x,prevx,i,j,initial_x) {
	prevLimit = getRandomInt(0,3);
	rando = getRandomInt(-prevLimit,prevLimit+1);
	x = x + rando;
	if (x > prevx+prevLimit) {x=prevx+prevLimit;}
	else if (x < prevx-prevLimit) {x=prevx-prevLimit;}
	return x;
}

var line_separation = 2;
var initial_x = 200;
var pts_per_line, num_lines;
pts_per_line = width/3;
num_lines = Math.floor(height/(line_separation)) - Math.floor(initial_x/line_separation) - 10;

//Generate array
var points = [];
x = initial_x;
for(var i=0; i < num_lines; i++) {
	for (var j=0; j < pts_per_line; j++) {
		index = j + i*pts_per_line;
		points[index] = x + line_separation*i;
	}
}

var r,g,b;

var gradient = context.createLinearGradient(0,height-30,0,300);
gradient.addColorStop(0,"#b87e7a");
gradient.addColorStop(0.05,"#f2a48d");
gradient.addColorStop(0.15,"#fccfa8");
gradient.addColorStop(0.5,"#e3eae3");
gradient.addColorStop(1,"#6ba8c5");

function render() {
	var x,y;
	context.beginPath();
	for(var i=0; i < num_lines; i++) {
		for (var j=0; j < pts_per_line; j++) {
			index = j + i*pts_per_line;
			x = points[index];
			if (j==0) {prevx = x;prevlinex=x;}
			else {prevx = points[index-1];prevlinex=x;}
			x = getRandomPoint(x,prevx,i,j,initial_x);
			points[index] = x;
			y = (j * (width/pts_per_line));
			if (j == 0) {
				context.strokeStyle = gradient;
				context.lineWidth = 1;
				context.moveTo(y,x)
			}
			else {
				context.lineTo(y,x)
			}
		}
	}
	r=0;g=0;b=0;
    context.fillStyle = "rgba("+r+","+g+","+b+","+1+")";
    context.fillRect(0, 0, width, height);
	context.stroke();
}

$(window).on('load',function(){
	initialize();
	setInterval(function() {
		render();
	}, 0);
});