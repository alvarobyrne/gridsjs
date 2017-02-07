console.log('hi grids');
var config={
	radius:50,//polygon radius
	dimension:500//Tile dimension
}
var grids = grid_utils.get_extensions(config);
//These are the classes
// console.log("grids : ",grids);
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.background='none';
canvas.width=innerWidth;
canvas.height=innerHeight;
var canvasCtx = canvas.getContext('2d');
///////////////////
var current_grid = grids[8];
console.log("current_grid : ",current_grid);
//The class GridExtension0 has information about it's polygons,
//the polygons that make ONE tile
var grid_data = Grid.grid_data_from_tile(innerWidth*0.5,innerHeight*0.5,current_grid)
// console.log("grid_data : ",grid_data);
canvasCtx.strokeStyle = 'white';
Grid.draw_grid(canvasCtx,grid_data);
console.log("global_test : ",global_test);
var polygon_count=0
console.log("config : ",config);
var gui;
var global_test = typeof global;
var ccontext = canvasCtx;
if(global_test!=="undefined"){
	console.log('A');
	if(global.sc && global.sc.gui){
		console.log('B');
		gui = global.sc.gui;
	}
}else{
	console.log('C');
	gui = new dat.GUI();
	gui.open();
}
var config = {
	palettes:chroma.brewer,
	gui,
	grid_data,
	canvasCtx,
	polygon_count
}
var grid_drawing = new GridDrawing(config);
function clear_canvas(){
	canvasCtx.clearRect(0,0,1000,1000);
}