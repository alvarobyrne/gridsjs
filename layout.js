const screens={
	hp:{
		width:1370,
		height:768
	},
	samsung:{
		
		width:1280,
		height:1024
	},
	projector:{
		width:800,
		height:600,
	}
}
const current_screen = screens.hp;
const layout={
	developer:{
		main:{
			x:0,
			y:0,
			width:current_screen.width*0.5,
			height:current_screen.height*0.5
		},
		canvas:{
			x:current_screen.width*0.5,
			y:0,
			width:current_screen.width*0.5,
			height:current_screen.height

		},
		devtools:{
			
			x:0,
			y:current_screen.height*0.5,
			width:current_screen.width*0.5,
			height:current_screen.height*0.5
		}
	}
}
const current_layout = layout.developer;
win.x = current_layout.main.x;
win.y=current_layout.main.y;
win.width=current_layout.main.width;
win.height=current_layout.main.height;
// dev_tools_win.x=current_layout.devtools.x;
// dev_tools_win.y=current_layout.devtools.y;
// dev_tools_win.width=current_layout.devtools.width;
// dev_tools_win.height=current_layout.devtools.height;
// console.log("dev_tools_win : ",dev_tools_win);
var new_win;
nw.Window.open('canvas.html',
	{
		x:current_layout.canvas.x,
		y:current_layout.canvas.y,
		// toolbar:false,
		frame:false,
		width:current_layout.canvas.width,
		height:current_layout.canvas.height
	},
	init);

	
document.addEventListener('keydown',function (argument) {
	console.log("argument : ",argument);
	
})
console.log("document : ",document);
