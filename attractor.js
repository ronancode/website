var a, c, canvas, click, context, d, dejong, e, flage, flagg, height, i, mouseX, mouseY, speed, width, x, y, opt, colorr, colorb, colorg, trail, ms, pixels, white;
var count = 0;

colorr = 160;
colorb = 160;
colorg = 80;

x = 1;
y = 1;

a = Math.random() * 4;
e = Math.random() * 4;
c = Math.random() * 4;
d = Math.random() * 4;

click = 0;

// mouseX = 0;
// mouseY = 0;

speed = 100;

i = 0;

flage = 0;
flagg = 0;

opt = 1;

white = 0;

attractor = function(x, y, opt) {
  if (opt == 0) {      //Dejong
    var x2 = Math.sin(a * y) - (Math.cos(c * x));
    var y2 = Math.sin(e * x) - (Math.cos(d * y));
    return [x2, y2];
  }
  else {
    var x2 = (d * Math.sin(a * y)) - (Math.sin(e * x));
    var y2 = (c * Math.cos(a * x)) + (Math.cos(e * y));
    return [x2, y2];
  }
};

height = (Math.floor(window.innerHeight/10)*10) + 200;

width = (Math.floor(window.innerWidth/10)*10) + 100;

pixels = 0.006; //10/width;

var canvas = document.getElementById('myCanvas');

context = canvas.getContext('2d');

context.translate(width / 2, height / 2);

context.scale(130,130);

document.addEventListener('click', function() {
  a = Math.random() * 4;
  e = Math.random() * 4;
  c = Math.random() * 4;
  d = Math.random() * 4;
  opt = Math.floor(Math.random() * 2)
  //return console.log("pixels: " + pixels);
});

document.addEventListener('contextmenu', function() {
  colorr = Math.random() * 300;
  colorb = Math.random() * 300;
  colorg = Math.random() * 300;
  document.getElementById("colorp").innerHTML = "r: " + colorr.toFixed(2) + " g: " + colorg.toFixed(2) + " b: " + colorb.toFixed(2);
});

document.addEventListener('keydown', function(event) {
  if (event.keyCode == 32) {
    if (count == 0) {
      context.scale(80,80);      
    }
    else {
      context.scale(0.0125, 0.0125);
    }
    count = !count;
  }
  if (event.keyCode == 87) {
    white = !white;
    //return console.log('white: ' + white);
  }
  //return console.log("event.keyCode " + event.keyCode);
});

//document.addEventListener("mousemove", function(e) {
//  mouseX = event.pageX;
//  mouseY = event.pageY;
//});

setInterval(function() {
  var b, g, r, ref;
  if (opt == 0) {
    document.getElementById("attractorp1").innerHTML = "x2=sin(" + a.toFixed(2) + "y)-cos(" + c.toFixed(2) + "x)";
    document.getElementById("attractorp2").innerHTML = "y2=sin(" + e.toFixed(2) + "x)-cos(" + d.toFixed(2) + "y)";
  }
  else {
    document.getElementById("attractorp1").innerHTML = "x2=" + d.toFixed(2) + "cos(" + a.toFixed(2) + "y)-cos(" + e.toFixed(2) + "x)";
    document.getElementById("attractorp2").innerHTML = "y2=" + c.toFixed(2) + "cos(" + a.toFixed(2) + "y)-cos(" + e.toFixed(2) + "x)";    
  }
  if (flage === 0) {
    e += Math.random() / speed;
  } else {
    e -= Math.random() / speed;
  }
  if (flagg === 0) {
    d -= Math.random() / speed;
  } else {
    d += Math.random() / speed;
  }
  if (e > 4) {
    a = a + (Math.random() / speed);
    flage = 1;
  } else if (e < -4) {
    a = a - (Math.random() / speed);
    flage = 0;
  }
  if (d < -4) {
    c = c + (Math.random() / speed);
    flagg = 1;
  } else if (d > 4) {
    c = c - (Math.random() / speed);
    flagg = 0;
  }
  trail = (Math.sin(e)/4.2)+0.3;
  context.globalCompositeOperation = 'source-over';
  if (white) {
    context.fillStyle = "rgba(255,255,255," + trail + ")";
    context.fillRect(-(width/2), -(height/2), width, height);
  }
  else {
    context.fillStyle = "rgba(0,0,0," + trail + ")";
    context.fillRect(-(width/2), -(height/2), width, height);
    context.globalCompositeOperation = 'lighter';
  }
  ms = (new Date).getTime();
  while (((new Date).getTime() - ms) < 28) {
    r = Math.floor(Math.abs(x) * colorr);
    b = Math.floor(Math.abs(y) * colorb);
    g = Math.floor(Math.abs(x + y) * colorg);
    context.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", 1)";
    ref = attractor(x, y, opt);
    x = ref[0];
    y = ref[1];
    context.fillRect(x, y, pixels, pixels);
    context.stroke();
    context.restore();
  }
}, 0);