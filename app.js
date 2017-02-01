const guinw = require('nw.gui')
console.log("guinw : ",guinw);
var w = guinw.Window.get();
console.log("w : ",w);
// w.maximize();
w.on('maximize',function (argument) {
	console.log('maximized');
})
var fs = require('fs');
window
console.log("window : ",window);
// var location = window.Location;
// console.log("location : ",location);
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.border='1px solid red';
canvas.style.background='none';
canvas.width=innerWidth;
canvas.height=innerHeight;
var canvasCtx = canvas.getContext('2d');
