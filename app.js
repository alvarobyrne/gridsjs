const guinw = require('nw.gui')
console.log("guinw : ",guinw);
var w = guinw.Window.get();
console.log("w : ",w);
// w.maximize();
w.on('maximize',function (argument) {
	console.log('maximized');
})
var fs = require('fs');
// console.log("fs : ",fs);
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
var dt = guinw.Window.get().showDevTools();
dt.x = 0;
dt.y=768*0.5;
dt.width=1370*0.5;
dt.height=768*0.5;
w.x=0;
w.y=0;
w.width=1370*0.5;
w.height=768*0.5;
console.log("dt : ",dt);
var new_win = guinw.Window.open('canvas.html',
	{
		x:1370*0.5,
		y:0,
		toolbar:false,
		frame:false,
		width:1370*0.5,
		height:768
	});

w.on('close',function(){
	new_win.close();
});
	
document
console.log("document : ",document);
