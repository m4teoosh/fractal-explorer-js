var canvas;
var ctx;
var xRange;
var yRange;

var xOffset = 0;
var yOffset = 0;
let max_iterations = 1000;

function setup() {
    
  canvas = document.getElementById('canvas');
  canvas.width = document.body.clientWidth; 
  canvas.height = document.body.clientHeight;

  if (canvas.getContext){
    ctx = canvas.getContext('2d');

    setRange(4, 4);
    drawMandelbrotSet();
    drawCoordinateSystem();
  }

  // adding zoom on mouse click
  canvas.addEventListener("click", function(e) { 
    console.log("click");
    var cRect = canvas.getBoundingClientRect();        
    var canvasX = Math.round(e.clientX - cRect.left);  
    var canvasY = Math.round(e.clientY - cRect.top);   
    var trueCoordinates = getNormalizedCoordinates(canvasX, canvasY);

    // draw zoomed set
    setRange(xRange / 2, yRange / 2);
    xOffset = trueCoordinates[0];
    yOffset = trueCoordinates[1];
    drawMandelbrotSet();
    drawCoordinateSystem();

    ctx.fillStyle = "white";
    ctx.fillText("X: " + String(trueCoordinates[0]).slice(0,5) + ", Y: " + String(trueCoordinates[1]).slice(0,5), 10, 20);
  });
  }
  

function drawCoordinateSystem() {
  var ctx = canvas.getContext('2d');
  
  // draw x and y axises
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  // horizontal markers
  for(var i = 0; i < canvas.width; i += canvas.width / 10){
    if(i != canvas.width / 2) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height / 2 - canvas.height / 120);
        ctx.lineTo(i, canvas.height / 2 + canvas.height / 120);
        ctx.stroke();
    }
    // draw numbers
    var increment = -xRange / 2 +  (i / canvas.width) * xRange + xOffset;
    ctx.fillText(String(increment).slice(0,5), i + 10, canvas.height / 2 - 10);
    
}

  // vertical markes
  for(var i = 0; i < canvas.height; i += canvas.height / 5){
      if(i != canvas.width / 2) {
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - canvas.width / 120, i);
          ctx.lineTo(canvas.width / 2 + canvas.width / 120, i);
          ctx.stroke();
      }

      // draw numbers
      var increment = -yRange / 2 + i / canvas.height * yRange + yOffset;
      ctx.fillText(String(increment).slice(0,5), canvas.width / 2 + 10, i +10);
    

  }
}

  // sets range for coordinate system than marks values on x and y axis
function setRange(x, y) {
  xRange = x;
  yRange = y;
}

function getNormalizedCoordinates(x, y){
    if(x <= canvas.width && y <= canvas.height){
      x = (-xRange / 2) + (x  / canvas.width) * xRange + xOffset;
      y =  (yRange / 2) - (y / canvas.height) * yRange + yOffset;
    }
    return [x, y];
}

function drawMandelbrotSet(){
  var img = new ImageData(canvas.width, canvas.height);
  var counter = 0;

    for(var i = 0; i < canvas.height; i++){
      for(var j = 0; j < canvas.width; j++){
        var iter = mandelbrotEquation(getNormalizedCoordinates(j,i)[0],getNormalizedCoordinates(j,i)[1]);

        if(iter == max_iterations){
          // ctx.fillStyle = "black";
          // ctx.fillRect(i, j, 1, 1);
          img.data[counter + 0] = 0;        
          img.data[counter + 1] = 0;        
          img.data[counter + 2] = 0;  
          img.data[counter + 3] = 255;
        }
        if(iter < max_iterations){
          // ctx.fillStyle = `rgb(50,${255 * iter / max_iterations},${255 * iter / max_iterations})`;
          // ctx.fillRect(i, j, 1, 1);
          img.data[counter + 0] = 0;        
          img.data[counter + 1] = 255 * iter / max_iterations;        
          img.data[counter + 2] = 0;  
          img.data[counter + 3] = 255;
        }
        counter += 4;
      }
    }

    ctx.putImageData(img,0,0);
}

function drawJuliaSet(c){
  for(var i = 0; i < canvas.width; i++){
    for(var j = 0; j < canvas.height; j++){
      var iter = juliaEquation(getNormalizedCoordinates(i,j)[0],getNormalizedCoordinates(i,j)[1], c);

      if(iter == max_iterations){
        ctx.fillStyle = "black";
        ctx.fillRect(i, j, 1, 1);
      }
      if(iter < max_iterations){
        ctx.fillStyle = `rgb(0,${255 * iter / max_iterations},0)`;
        ctx.fillRect(i, j, 1, 1);
      }
    }
  }
}

function mandelbrotEquation(x, y){
  var iterations = 0;
  var a = x;
  var b = y;

  while(iterations < max_iterations) {
      var newA = (a * a) - (b * b);
      var newB = 2 * a * b;
      a = newA + x;
      b = newB + y;

      if(a + b > 16 || a + b < -16){
        break;
      }

      iterations++;
  }

    return iterations;
}

function juliaEquation(x, y, c){
  var iterations = 0;
  
  var a = x;
  var b = y;

  while(iterations < max_iterations && a + b >= 4) {
      var newA = (a * a) - (b * b);
      var newB = 2 * a * b;
      a = newA + c[0];
      b = newB + c[1];

     

      iterations++;
  }

    return iterations;
}

