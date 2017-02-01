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

var Watcher = require('watch-fs').Watcher;
 
var watcher = new Watcher({
    paths: [ '.' ],
    filters: {
        includeFile: function(name) {
        	// console.log("name : ",name);
            return /\.js/.test(name);
        }
    }
});
 
watcher.on('create', function(name) {
    console.log('file ' + name + ' created');
});
 
watcher.on('change', function(name) {
    console.log('file ' + name + ' changed');
    location.reload();
});
 
watcher.on('delete', function(name) {
    console.log('file ' + name + ' deleted');
});
 
watcher.start(function(err, failed) {
    console.log('watcher started');
    console.log('files not found', failed);
});
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.border='1px solid red';
canvas.style.background='none';
canvas.width=innerWidth;
canvas.height=innerHeight;
var canvasCtx = canvas.getContext('2d');
var dt = guinw.Window.get().showDevTools();
