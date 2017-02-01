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
var current_grid = grids[4];
console.log("current_grid : ",current_grid);
//The class GridExtension0 has information about it's polygons,
//the polygons that make ONE tile
var grid_data = Grid.grid_data_from_tile(innerWidth*0.5,innerHeight*0.5,current_grid)
// console.log("grid_data : ",grid_data);
canvasCtx.strokeStyle = 'white';
Grid.draw_grid(canvasCtx,grid_data);