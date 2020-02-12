/***************************************************************************
*                                                                          *
*		This is a javascript file for drawing out                  *
*               a satellites ephemeris on the orbitology                   *
*                                  page                                    *
*                           By: Timothy Mudge                              *
*                                                                          *
***************************************************************************/

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.68
drawClock();


function drawClock() {
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius);
  //drawInclination(ctx, radius);
}

function drawFace(ctx, radius) {
  var grad;
  
  ctx.beginPath();
  ctx.arc(300, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fill();
  
  grad = ctx.createRadialGradient(300,0,radius*0.95, 300,0,radius*1.05);
  grad.addColorStop(0.3, 'rgba(255,255,255,0.3)');
  grad.addColorStop(0.2, 'rgba(255,255,255,0.2)');
  grad.addColorStop(0.4, 'rgba(0,0,255,0.2)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius*0.1;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(300, 0, radius*0.05, 0, 2*Math.PI);
  ctx.fillStyle = 'rgba(255,0,0,0.75)';
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius * 0.05 + "px arial";

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for(num = 1; num < 361; num++){
    ang = num * Math.PI / 180;
    ctx.rotate(ang);
    /*ctx.translate(10, 0, -radius * 0.05, 0, 2*Math.PI);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 300, -287);
    ctx.rotate(ang);
    ctx.translate(10, 0, -radius * 0.05, 0, 2*Math.PI);*/

    ctx.translate(0, -radius*2.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 300, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*2.85);
    ctx.rotate(-ang);
  }
}

/*function drawInclination(ctx, radius){
  var inclination;
  inclination = (document.getElementById("inclination")
  drawLine(
}*/

function drawTime(ctx, radius){
  var now = new Date();
  //var hour = now.getHours();
  //var minute = now.getMinutes();
  var second = now.getSeconds();
  //hour
  //hour = hour%12;
  //hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
  //drawHand(ctx, hour, radius*0.5, radius*0.07);
  //minute
  //minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
  //drawHand(ctx, minute, radius*0.8, radius*0.07);
  // second
  second = (second*Math.PI/30);
  drawHand(ctx, second, radius*0.9, radius*0.05);
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(300,0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
  ctx.fillStyle = 'rgba(255,0,0,1)';
  ctx.fill();
}
