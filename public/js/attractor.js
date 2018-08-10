var canvas = document.getElementById('render');
var width;
var height;

var smaller_dimension;

context = canvas.getContext('2d');

var x = 1;
var y = 1;

var init_time;
var color_time;
var punch_time;
var transition_time;

var points;

var pixel_size = 1;

var flage = 0;
var flagg = 0;

var speedx = 200;

var bg_r;
var bg_g;
var bg_b;
var bg_a;

var pt_r;
var pt_g;
var pt_b;

var scale;

var a,e,c,d;

var iterations;
var max_iterations = 100000;
// a = Math.random() * 4;
// e = Math.random() * 4;
// c = Math.random() * 4;
// d = Math.random() * 4;

// Good ones
a = 0.584655955693238;
e = 1.2905043420726843;
c = 2.405493475325425;
d = 3.752765965210892;

// a = 3.9377217893063516;
// e = 0.23884414420813194;
// c = 0.5316400850078518;
// d = 1.3908523331817744;

// console.log("a = " + a + ";\ne = " + e + ";\nc = " + c + ";\nd = " + d + ";");

var style = Math.floor(Math.random() * 3);
console.log(style);

function initialize() {
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();
}

// Handle window resizing
function resizeCanvas() {
	width = window.innerWidth;
	height = window.innerHeight;

	canvas.height = height-10;
	canvas.width = width-10;

	if (height >= width) {
		smaller_dimension = width;
	}
	else {
		smaller_dimension = height;
	}

	scale = 60*(smaller_dimension/300);
	if (scale > 130) {scale=130;}
}

attractor = function(x, y) {
	var x2 = Math.sin(a * y) - (Math.cos(c * x));
	var y2 = Math.sin(e * x) - (Math.cos(d * y));
	return [x2, y2];
};

// Initialize when page is loaded
$(window).on('load',function(){
	initialize();
	color_time = (new Date).getTime();
	punch_time = color_time;
	transition_time = color_time;
	setInterval(function() {
		if (flage === 0) {
			e += Math.random() / speedx;
		} else {
			e -= Math.random() / speedx;
		}
		if (flagg === 0) {
			d -= Math.random() / speedx;
		} else {
			d += Math.random() / speedx;
		}
		if (e > 4) {
			a = a + (Math.random() / speedx);
			flage = 1;
		} else if (e < -4) {
			a = a - (Math.random() / speedx);
			flage = 0;
		}
		if (d < -4) {
			c = c + (Math.random() / speedx);
			flagg = 1;
		} else if (d > 4) {
			c = c - (Math.random() / speedx);
			flagg = 0;
		}
		if (style == 0) {
			bg_r = 255;
			bg_g = 255;
			bg_b = 255;
			bg_a = 0.75;
			document.body.style.backgroundColor = "rgba(255,255,255,1)";
			pt_r = 51;
			pt_g = 51;
			pt_b = 51;
		}
		else if (style == 1) {
			bg_r = 0;
			bg_g = 0;
			bg_b = 0;
			bg_a = 0.4;
			document.body.style.backgroundColor = "rgba(0,0,0,1)";
			pt_r = 160;
			pt_g = 80;
			pt_b = 160;
		}
		else {
			bg_r = 235;
			bg_g = 230;
			bg_b = 193;
			bg_a = 0.75;
			document.body.style.backgroundColor = "rgba(235,230,193,1)";
			pt_r = 247;
			pt_g = 70;
			pt_b = 53;
		}
		context.fillStyle = "rgba(" + bg_r + "," + bg_g + "," + bg_b + "," + bg_a + ")";
		context.fillRect(0,0, width, height);
		init_time = (new Date).getTime();
		if (style == 1) {
			if (color_time < (init_time-100)) {
			    r = Math.floor(Math.abs(x) * pt_r);
			    b = Math.floor(Math.abs(y) * pt_b);
			    g = Math.floor(Math.abs(x + y) * pt_g);
			    color_time = (new Date).getTime();
			}
		}
		else {
			r = pt_r;
			g = pt_g;
			b = pt_b;
		}
		if ((init_time - punch_time) > 4500) {
			pixel_size = 40;
			max_iterations = 1;
			if ((init_time - punch_time) > 5500) {
				punch_time = (new Date).getTime();
			} 
		}
		else {
			pixel_size = 1;
			max_iterations = 10000;
		}
		if ((init_time - transition_time) > 2000) {
			style += 1;
			if (style > 2) {style = 0;}
			transition_time = (new Date).getTime();
		}
		context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", 1)";
		iterations = 0;
		while (((new Date).getTime() - init_time) < 17) {
			if (iterations < max_iterations) {
				points = attractor(x,y);
				x = points[0];
				y = points[1];
		        x_offset = (x*scale+(width/2));
		        y_offset = (y*scale+(height/2));
				context.fillRect(x_offset,y_offset,pixel_size,pixel_size);
				iterations += 1;
			}
		}
	}, 0);
});
