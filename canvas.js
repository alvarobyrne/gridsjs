global.sc
console.log("sc : ",global.sc);
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.border='1px solid red';
canvas.style.background='none';
canvas.width=500;
canvas.height=500;
var canvasCtx = canvas.getContext('2d');