//sc stands for sandcastls;
global.sc = global.sc || {};
const win = nw.Window.get();
console.log("nw : ",nw);
var fs = require('fs');
// var location = window.Location;
// console.log("location : ",location);
var gui = new dat.GUI();
console.log("gui : ",gui);
gui.add(win,'showDevTools');
gui.add({f:function () {
	nw.App.quit();
}},'f').name('close app');
gui.add(location,'reload');

function init(nw_window) {
	console.log("nw_window : ",nw_window);
	new_win = nw_window;
	// gui.add(new_win,'open');
	win.on('close',function(){	new_win.close();win.close();});
	win.showDevTools(null,function (argument) {
		console.log("argument : ----",argument);
		// body...
	});
	var gui_main = gui.addFolder('main');
	// gui_main.open();
	gui.add(new_win,'showDevTools');
	global.sc.gui = gui_main;
	new_win.showDevTools(null,function (argument3) {
		console.log("argument3 : ",argument3);
		// body...
	});

	nw_window.x = current_layout.canvas.x;
	nw_window.y = current_layout.canvas.y;
	setTimeout(()=> {
		new_win.setAlwaysOnTop(true);
		win.setAlwaysOnTop(true);
		setTimeout(()=> {
			new_win.setAlwaysOnTop(false);	
			win.setAlwaysOnTop(false);
			win.requestAttention(false);
			new_win.requestAttention(false);
		}, 1000);
	}, 1000);
	new_win.on('focus',()=>{
		win.show();
	});

}