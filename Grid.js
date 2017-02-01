Grid.count = 0;
/**
 * Main class, parent class.
 * This is the meain or parent class for all grid types.
 * prototypal inheritance.
 * update_tile method should be overwritten/overriden.
 * each extended class should hav an update_grid_size methos
 * @param {[type]} sides      [description]
 * @param {[type]} index_main [description]
 * @param {[type]} config     [description]
 */
function Grid (sides,index_main,config) {
	defaults={};
	defaults.radius =20;//default radius of main polygon
	defaults.dimension =550;
	defaults.dimensiony =550;
	defaults.min_index=0;
	defaults.max_index=0;
	if(!config){
		config=defaults;
	}
	this.sides=sides;
	this.INDEX_MAIN = index_main;
	this.radius=config.radius || defaults.radius;
	this.mid = {};
	this.midangles = {};
	this.inv_sin = {};
	this.delta={};
	this.min_index = config.min_index;
	this.max_index = config.max_index;
	this.radii = {};
	for(var i in this.sides){
		this.midangles[i] = Math.PI/i;
		this.inv_sin[i]   = 1/Math.sin(this.midangles[i]);
		this.delta[i]     = 2*Math.PI/i;
		this.mid[i]       = 1/Math.tan(this.delta[i]*0.5);
		this.radii[i]        = 0;
	}
	this.ANGLE_MAIN      = this.delta[this.INDEX_MAIN];
	this.ANGLE_MAIN_HALF =  this.ANGLE_MAIN*0.5;
	this.ANGLE_MAIN_HALF =  this.midangles[this.INDEX_MAIN];//!!!!!!!!!!!!
	this.dimension = config.dimension||defaults.dimension;
	this.dimensiony = config.dimensiony||defaults.dimensiony;
	// this.dimensiony=
	this.SIN_BETA = Math.sin(this.ANGLE_MAIN_HALF)
	this.COS_BETA = Math.cos(this.ANGLE_MAIN_HALF)
	this.h={};
	this.update_sizes = function  (factors) {
		// console.log("factors : ",factors);
		//KEY CONSTRAINT!!!
		//They all have the same side length, hence the same midside
		// this.midside=this.radius*Math.sin(this.ANGLE_MAIN_HALF);
		
		this.midside=this.radius*this.SIN_BETA;
		this.midheight=this.radius*this.COS_BETA;
		//reset each time?
		var f_length = factors?factors.length:1;
		for(var i in this.sides){
			this.h[i]=this.midside*this.mid[i];
			this.radii[i]=this.midside*this.inv_sin[i];
			if(factors&&false){
				this.h[i]*=factors[i%f_length]*2
				this.radii[i]*=factors[i%f_length]*2
			}

		}
	}
	this.d={};
	this.r={};
	this.update_grid_cols_rows = function  () {
		var size_threshold = 29;
		// var cols_complete = this.radius>size_threshold?3:2;
		// var rows_complete = this.radius>size_threshold?3:2;
		var cols_complete = 3;
		var rows_complete = 3;
		var cols = this.cols = (this.dimension/this.grid_dimension_1|0)+cols_complete;
		var rows = this.rows = (this.dimensiony/this.grid_dimension_2|0)+rows_complete;
		if(this.rows%2===0){
			this.rows +=1;
		}
		this.rows+=2;
		this.cols+=2;
		this.amount_tiles = this.cols*this.rows;
	}
	this.update_grid_size_and_ratio=function (factors) {
		// body...
		this.update_grid_size();//specific to each concrete class
		/*
		this.tile_c.polygons.forEach(function (polygon,i) {
			var vertices = polygon.points||polygon.vertices;
			vertices.forEach(function (vertex) {
				// body...
			var x = polygon.center.x - vertex.x;
			var y = polygon.center.y - vertex.y;
			})
			
		})
		*/
		this.ratio = this.grid_dimension_2/this.grid_dimension_1;
	}	
	this.update_r_dependency=function  (factors) {
		// console.log('------------');
		this.update_sizes(factors);	  //abstract function NOT OVERRIDEN
		this.update_tile_distances();	  //abstract function NOT OVERRIDEN
		this.update_grid_size_and_ratio(factors) //abstract function NOT OVERRIDEN
		this.update_grid_cols_rows();	  //abstract function NOT OVERRIDEN
	}
	this.update_r_dependency_size=function  (factors) {
		this.update_sizes(factors);
		// this.update_tile_distances();
		// this.update_grid_size();
		this.update_grid_cols_rows();
	}
	this.update_r_dependency();
	this.update_tile();//specific to each concrete class
	this.tilec.polygons.forEach(function (p) {
		// console.log("p : ",p);
		var v = p.vertices||p.points
		// console.log("v : ",v);
	})
}
Grid.prototype.update_tile_distances = function(first_argument) {
	for(var i in this.sides){
		this.d[i] = this.h[this.INDEX_MAIN]+this.h[i];
		this.r[i] = this.radii[this.INDEX_MAIN]+this.radii[i];
	}
}
Grid.prototype.update_tile = function(first_argument) {

};
Grid.prototype.draw = function(first_argument) {

};
Grid.prototype.name = function(first_argument) {

	return Object.keys(this.sides).join()||'ajhkajd';//lousey default
}
///////////////////////////////////static functions///////////////////////////////
///////////////////////////////////static functions///////////////////////////////
/*
Grid.draw_grid_OLD =function (context,argument) {
	argument.forEach(function  (tile,i,a) {
		tile.forEach(function  (polygon,i,a) {
			Grid._draw_polygon_from_points(context,polygon)
		})
	})
}
*/
Grid.draw_grid =function (context,grid_data,config) {
	// console.log("grid_data : ",grid_data);
	grid_data.forEach(function  (tile,i,a) {
		tile.polygons.forEach(function  (polygon,i,a) {
			Grid._draw_polygon_from_points(context,polygon.vertices,config);
			// context.beginPath();
			// context.arc(polygon.center.x,polygon.center.y,2,0,Math.PI*2);
			// context.stroke();
		})
	})
}
/*
Grid.grid_data = function (cx,cy,grid) {
	var cols = grid.cols;
	var half_c = cols*0.5|0;
	var half_r = grid.rows*0.5|0;

	var grid_points =[];
	var config = {};
	//config.complete = true//for 1
	//config.min=0;
	//config.max =5;
	//config.radius =grid.radius;
	var Sbis = grid.grid_dimension_2;
	var Hbis = grid.grid_dimension_1;

	var u,v,x,y;
	var amount_tiles = grid.amount_tiles;
	for (var i = 0; i < amount_tiles; i++) {
		u = i%cols-half_c;
		v = (i/cols|0)-half_r;
		if(v%2===0){
			u+=grid.cols_factor*0.5;
		}
		// console.log("",u,v);
		x = cx+u*Hbis;
		y = cy+v*Sbis;
		grid_points.push(Grid.tile_loop2(x,y,grid.tile));
	};
	return grid_points;
}
*/
Grid.grid_data = function (cx,cy,grid) {
	// console.log('---------------------------------');
	var cols = grid.cols;
	var rows = grid.rows;
	var r = grid.ratio;
	// console.log("r : ",r);
	// console.log("rows : ",rows);
	// console.log("cols : ",cols);
	var half_c = cols*0.5|0;
	// console.log("half_c : ",half_c);
	var half_r = grid.rows*0.5|0;
	// console.log("half_r : ",half_r);

	var grid_polygons =[];
	/*
	var config = {};
	config.complete = true//for 1
	config.min=0;
	config.max =5;
	config.radius =grid.radius;
	if(grid.tilec){
		var tilec = grid.tilec;
	}
	*/
	var Sbis = grid.grid_dimension_2;
	var Hbis = grid.grid_dimension_1;

	var u,v,x,y;
	var amount_tiles = grid.amount_tiles;
	for (var i = 0; i < amount_tiles; i++) {
		u = i%cols-half_c;
		v = (i/cols|0)-half_r;
		if(v%2===0){
			// u+=grid.cols_factor*0.5;
			u+=-0.5;
		}
		// console.log("",u,v);
		u+=0.5;
		x = cx+u*Hbis;
		y = cy+v*Sbis;
		grid_polygons.push(Grid.tile_loop4(x,y,grid.tilec));
	};
	return grid_polygons;
}
/*Grid.grid_data2*/
/**
 * Static function which returns a whole GRID from a TILE
 * lets see:
 * The tile that is within the grid argument
 * 
 * @param  {[type]} cx      x coordinate of tile center
 * @param  {[type]} cy      y coordinate of tile center
 * @param  {[type]} grid    grid instance, an instance from some Grid son, or exetension.
 * @param  {[type]} factors optional
 * @return {[type]}         [description]
 */
Grid.grid_data_from_tile = function (cx,cy,grid,factors) {
	var cols = grid.cols;
	var half_c = cols*0.5|0;
	var half_r = grid.rows*0.5|0;

	var grid_polygons =[];
	/*
	var config = {};
	config.complete = true//for 1
	config.min=0;
	config.max =5;
	config.radius =grid.radius;
	*/
	if(grid.tilec){
		var tilec = grid.tilec;
	}
	var Sbis = grid.grid_dimension_2;
	var Hbis = grid.grid_dimension_1;

	var u,v,x,y;
	var amount_tiles = grid.amount_tiles;
	// var f_length = factors?factors.length:1;
	// var f_length = factors.length;
	var gc = Grid.count;
	Grid.count = 0;
	for (var i = 0; i < amount_tiles; i++) {
		u = i%cols-half_c;
		v = (i/cols|0)-half_r;
		if(v%2===0){
			u+=grid.cols_factor*0.5;
		}
		// console.log("",u,v);
		x = cx+u*Hbis;
		y = cy+v*Sbis;
		var tile = Grid.tile_loop4(x,y,grid.tilec,factors)
		
		grid_polygons.push(tile);
	};
	return grid_polygons;
}
//'private' 
//compare with grid_utils.draw_polygon @ grid.utils.js
Grid._draw_polygon_from_points = function (context,vertices,config) {

	context.beginPath();
	// context.fillStyle = 'rgba(255,255,255,0.3)';
	vertices.forEach(function  (vertex,i,a) {
		if(i===0){
			context.moveTo(vertex.x,vertex.y)
		}else{
			context.lineTo(vertex.x,vertex.y)
		}
	});
	context.closePath();
	if(config&&config.is_filling)context.fill();
	context.stroke();
}
Grid.polygon_data = function (cx,cy,sides,r,init_angle) {
	var points = [];
	if(init_angle===undefined)init_angle=0;
	var delta_angle = 2*Math.PI/sides;
	for (var i = 0; i < sides; i++) {
		points.push({
			x:cx+r*Math.cos((i+0.5)*delta_angle+init_angle),
			y:cy+r*Math.sin((i+0.5)*delta_angle+init_angle)
		})
	};
	return points
}
Grid.polygon_data2 = function (cx,cy,sides,r,init_angle) {
	var points = [];
	if(init_angle===undefined)init_angle=0;
	var delta_angle = 2*Math.PI/sides;
	for (var i = 0; i < sides; i++) {
		points.push({
			x:cx+r*Math.cos((i+0.5)*delta_angle+init_angle),
			y:cy+r*Math.sin((i+0.5)*delta_angle+init_angle)
		})
	};
	var polygon = new Polygon();
	polygon.vertices = points;
	polygon.center = {x:cx,y:cy};
	polygon.r = r;
	polygon.init_angle = init_angle;
	return polygon
}
Grid.scale_polygon = function (polygon,f) {
	var vs = polygon.vertices||polygon.points
	var center = polygon.center;
	vs.forEach(function (v) {
		v.x = (center.x-v.x)*f+center.x
		v.y = (center.y-v.y)*f+center.y
	})
}
Grid.translate_polygon = function (cx,cy,polygon_points,f) {
	var points = [];
	polygon_points.forEach(function  (vertex) {
		points.push({x:vertex.x*f+cx,y:vertex.y*f+cy})
	})
	return points
}
Grid.tile_data =function (x,y,config,min,max) {
	var polygons = Grid.tile_data2(x,y,config,min,max);
	var vertices2 = polygons.map(function (polygon) {
		return polygon.vertices
		// polygon.vertices.forEach(function (vertex) {
			
		// })
	});
	/*
	var vertices=[]

	for (var i = min; i < max; i++) {
		var dist = config.D
		var rn = config.r
		var s = config.s;
		var delta = config.delta;
		var angle_init = config.angle_init;
		var cx = x+dist*Math.cos(i*delta+angle_init);
		var cy = y+dist*Math.sin(i*delta+angle_init);
		var points = Grid.polygon_data(
			cx,
			cy,
			s,
			rn,
			i*delta-angle_init+config.angle_polygon
		);
		vertices.push(points);
	};
	console.log("vertices : ",vertices);
	*/
	// console.log("vertices2 : ",vertices2);
	return vertices2
}
Grid.tile_data2 =function (x,y,config,min,max) {
	var polygons=[]
	var polygon;
	for (var i = min; i < max; i++) {
		polygon = new Polygon();
		var dist = config.D
		var rn = config.r
		var s = config.s;
		var delta = config.delta;
		var angle_init = config.angle_init;
		var cx = x+dist*Math.cos(i*delta+angle_init);
		var cy = y+dist*Math.sin(i*delta+angle_init);
		var points = Grid.polygon_data(
			cx,
			cy,
			s,
			rn,
			i*delta-angle_init+config.angle_polygon
		);
		polygon.center = {x:cx,y:cy};
		polygon.vertices = points;
		polygon.r = rn;
		polygon.init_angle = angle_init;
		polygons.push(polygon);
	};
	return polygons
}
Grid.tile_loop=function  (x,y,D,min,max) {
	var grid = D.grid;
	var vertices = []
	for (var i = min; i < max; i++) {
		var idx = i%2;
		var config = D[i%2];
		var dist = config.D
		var rn = config.r
		var s = config.s;
		var sssssws = i*grid.ANGLE_MAIN;
		var points = Grid.polygon_data(x+dist*Math.cos(i*grid.ANGLE_MAIN),y+dist*Math.sin(i*grid.ANGLE_MAIN),s,rn,sssssws);
		vertices.push(points)
	};
	return vertices;
}
Grid.tile_loop5=function  (x,y,D,min,max) {
	var grid = D.grid;
	var polygons = []
	var polygon;
	for (var i = min; i < max; i++) {
		polygon=new Polygon;
		var idx = i%2;
		var config = D[i%2];
		var dist = config.D
		var rn = config.r
		var s = config.s;
		var sssssws = i*grid.ANGLE_MAIN;
		var cx = x+dist*Math.cos(i*grid.ANGLE_MAIN);
		var cy = y+dist*Math.sin(i*grid.ANGLE_MAIN);
		var points = Grid.polygon_data(cx,cy,s,rn,sssssws);
		polygons.push(polygon);
		polygon.vertices = points;
		polygon.r = rn;
		polygon.init_angle = sssssws;
		polygon.center={x:cx,y:cy};

	};
	return polygons;
}
/*
Grid.tile_loop3=function  (x,y,D,min,max) {
	var grid = D.grid;
	var vertices = []
	for (var i = min; i < max; i++) {
		// var idx = i%2;
		// var config = D[i%2];
		var config = D[i];
		var dist = config.D
		var rn = config.r
		var s = config.s;
		var sssssws = i*grid.ANGLE_MAIN;
		var points = Grid.polygon_data(x+dist*Math.cos(i*grid.ANGLE_MAIN),y+dist*Math.sin(i*grid.ANGLE_MAIN),s,rn,sssssws);
		vertices.push(points)
	};
	return vertices;
}
Grid.tile_loop2 = function  (x,y,tile) {
	var vertices = []
	// var grid = D.grid;
	// var tile = D.tile;
	tile.forEach(function  (polygon_points) {
		vertices.push(Grid.translate_polygon(x,y,polygon_points));
	})
	return vertices;
}
*/
/**
 * @param  {[type]} x      [description]
 * @param  {[type]} y      [description]
 * @param  {[type]} tile_c [description]
 * @return {[type]}        [description]
 */
Grid.tile_loop4 = function  (x,y,tile_c,factors) {
	// console.log("tile_c : ",tile_c);
	// console.log("tile : ",tile);
	var polygons = []
	// var grid = D.grid;
	// var tile = D.tile;
	// var polygon;
	// var vertices;
	var f_length = factors?factors.length:1;
	tile_c.polygons.forEach(function  (polygon) {
		//
		//
		//
		var polygon_grid = new Polygon()
		//
		//
		//
		//
		var center = polygon.center||polygon.centroid;
		var f=1;
		var f_idx = Grid.count%f_length;
		// console.log("f_idx : ",f_idx);
		if(factors)f=factors[f_idx];
		// console.log("f : ",f);
		// f = isNaN(f)?1:f;
		polygon_grid.voronoiId = Grid.count;
		polygon_grid.vertices = Grid.translate_polygon(x,y,polygon.vertices||polygon.points,1)
		polygon_grid.center={x:center.x+x,y:center.y+y};
		// Grid.scale_polygon(polygon_grid,f)
		polygon_grid.r = f;
		polygon_grid.r = polygon.r*f;
		polygon_grid.init_angle = polygon.init_angle;
		// console.log("polygon : ",polygon);
		polygons.push(polygon_grid);
		Grid.count++;
	})
	return new Tile(polygons)
}
Grid.tile_translated =function (x,y,tile) {
	// var D = {};
	// D.grid = grid;
	// D.tile = grid.tile;
	// console.log("D : ",D);
	return Grid.tile_loop2(x,y,tile);
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
function Polygon () {
	this.vertices = [];
	this.center = {};
	this.r =null;
	this.init_angle =null;
}
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
function Tile (polygons) {
	this.polygons = polygons;
}
///////////////////////////extensions/////////////////////////////////////////
////////////////////////////////1////5/6/10///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/**
 * First Grid son class, extension class
 * prototypal inheritance: This one is not archimedean: it has an irregular hexagon.
 * @param {[type]} config_grid [description]
 */
function GridExtension1 (config_grid) {
	var index_main = 10;
	var sides = {5:5,6:6,10:index_main};
	// config_grid.sides = {5:5,6:6,10:index_main};
	// TODO: REDO
	if(!config_grid){
		config_grid = {};
	}

	config_grid.min_index=0;
	config_grid.max_index=10;


	this.rows_complete = 1;
	this.cols_complete = 1;
	this.cols_factor = +1;
	Grid.call(this,sides,index_main,config_grid);// prototypal inheritance
	// this.update_tile();
}
/*
prototypal inheritance;
 */
GridExtension1.prototype = Object.create(Grid.prototype);
GridExtension1.prototype.update_tile = function(first_argument) {
	// Grid.prototype.update_tile.call(this,first_argument);
	this.long_name='BarrelDecagonPentagonGrid'
	var tile=[]
	var tiles=[]
	var index = 5;
	//Di si an object: in other cases it is an array
	var D = {r:this.radii[index],
		D:this.d[index],
		s:index,
		delta:this.delta[this.INDEX_MAIN],
		angle_init:this.ANGLE_MAIN_HALF,
		angle_polygon:0,
	};
	var cx = 0;
	var cy = 0;
	var min_index = 3;
	var max_index = min_index+4;
	var vertices_0 = Grid.tile_data(cx, cy, D, 2, 3)[0];
	// console.log("vertices_0 : ",vertices_0);
	var pentagons = Grid.tile_data(cx, cy, D, min_index, max_index);
	var pentagonsp = Grid.tile_data2(cx, cy, D, min_index, max_index);
	/*
	D = {r:this.radii[index],
		D:this.d[index],
		s:index,
		delta:this.delta[this.INDEX_MAIN],
		angle_init:this.ANGLE_MAIN_HALF,
		angle_polygon:Math.PI,
	};
	*/
	D.angle_polygon = Math.PI;
	var r5 = this.radii[index];
	var h10r5 = r5*Math.sin(Math.PI/5);
	var h10r5 = this.radii[index]*Math.sin(this.midangles[index]);
	var vertices_1 = Grid.tile_data(cx, cy+h10r5, D, 2, 3)[0];
	////////////////////////////////////////
	var hex_vertices = [vertices_0[1],vertices_0[2],vertices_0[3],vertices_0[4],vertices_1[2],vertices_1[3]];
	var hex_verticesp = new Polygon();
	hex_verticesp.vertices = hex_vertices;

	var hex_center={x:0,y:0};
	hex_vertices.forEach(function  (vertex) {
		hex_center.x+=vertex.x;
		hex_center.y+=vertex.y;
	})
	hex_center.x/=hex_vertices.length;
	hex_center.y/=hex_vertices.length;
	hex_verticesp.center = hex_center;
	hex_verticesp.r = 50;//worthless!
	hex_verticesp.init_angle = 0;//worthless!
	hex_verticesp.not_regular=true;
	////////////////////////////////////////


	var main_polygon = Grid.polygon_data(cx, cy, this.INDEX_MAIN, this.radii[this.INDEX_MAIN], this.ANGLE_MAIN_HALF);
	this.init_angle = this.ANGLE_MAIN_HALF;
	this.init_angle2 = this.ANGLE_MAIN;
	var main_polygonp = Grid.polygon_data2(cx, cy, this.INDEX_MAIN, this.radii[this.INDEX_MAIN], this.init_angle);

	this.tile = tile = tile.concat(pentagons,[hex_vertices],[main_polygon]);
	tiles = tiles.concat([main_polygonp,hex_verticesp],pentagonsp);
	this.tilec = new Tile(tiles);
};
GridExtension1.prototype.update_grid_size = function  (argument) {
	var side = 2*this.midside;
	var barrelWidth = 2*this.radii[5]*Math.sin(this.delta[5]);
	// var horizontal_space = 2*this.radii[10]+4*this.midside+2*this.midside*(1+2*Math.cos(2*this.midangles[5]));
	var horizontal_space = 2*this.radii[10]+2*side+barrelWidth;
	this.grid_dimension_1 = horizontal_space;
	// var vertical_space = 2*this.h[10]+this.radii[5]*(1+Math.sin(this.midangles[5])+Math.sin(this.midangles[5]));
	// var vertical_space = 2*this.h[10]+this.radii[5]*(1+2*Math.sin(this.midangles[5]));
	var barrelHeight = 2*side*Math.sin(2*this.midangles[5]);
	var vertical_space = 2*this.h[10]+barrelHeight;
	this.grid_dimension_2 = vertical_space*0.5;
	/*
		factorized
		var horizontal_space = 2*this.radius+2*this.midside*(3+2*Math.cos(this.angles[5]));
		this.grid_dimension_1 = horizontal_space;
		var vertical_space = 2*this.h[10]+this.radii[5]*(1+2*Math.sin(this.midangles[5]));
		this.grid_dimension_2 = vertical_space*0.5;
	*/
	/*
		var ratio = vertical_space/horizontal_space
		this.cols = (this.dimension/this.grid_dimension_1|0)+1;
		this.cols_r = (this.dimension/this.r[6]|0)+1;
		this.rows = (this.dimension/this.grid_dimension_2|0)+2;
		this.rows_r = (this.dimension/this.r[5]|0)+2;

		this.amount_tiles = this.cols*this.rows;
		this.amount_tiles_r = this.cols_r*this.rows_r;
	*/
}
////////////////////////////////2////4/6/12///////////////////////////////////
/**
 * Second grid extension
 * this one is archimedean
 * @param {[type]} config_grid [description]
 */
function GridExtension2 (config_grid) {
	this.long_name='DodecagonHexagonSquare'
	var index_main = 12;
	var sides={4:4,6:6,12:index_main};
	// config_grid.sides = {5:5,6:6,10:index_main};
	this.rows_complete = 1;
	this.cols_complete = 1;
	this.cols_factor = 1;
	config_grid.min_index=0;
	config_grid.max_index=5;
	// prototypal inheritance;
	Grid.call(this,sides,index_main,config_grid);
	// this.update_tile();
}
// prototypal inheritance;
GridExtension2.prototype = Object.create(Grid.prototype);
GridExtension2.prototype.update_tile = function(first_argument) {
	var tile=[]
	var tiles=[]
	var min = this.min_index;
	var max = this.max_index;

	var cx=0,cy=0;
	var main_polygon = Grid.polygon_data(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],0);
	this.init_angle = 0;
	this.init_angle2 = this.ANGLE_MAIN+this.ANGLE_MAIN_HALF;
	var main_polygonp = Grid.polygon_data2(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],this.init_angle);

	var D=[
		{r:this.radii[4],D:this.d[4],s:4},
		{r:this.radii[6],D:this.d[6],s:6},
	];
	D.grid = this;//hack
	var squares_n_hexagons = Grid.tile_loop(cx, cy, D, min, max)
	var squares_n_hexagonsp = Grid.tile_loop5(cx, cy, D, min, max)
	tile = tile.concat(squares_n_hexagons,[main_polygon]);
	tiles = tiles.concat([main_polygonp],squares_n_hexagonsp);
	this.tile = tile;
	this.tilec = new Tile(tiles);
};
GridExtension2.prototype.update_grid_size = function  (argument) {
	this.grid_dimension_2 = this.d[6]+this.h[4]+this.h[6];
	this.grid_dimension_1 = 2*this.d[4];
	/*
	this.cols = (this.dimension/this.d[4]|0)+1;
	this.cols_r = (this.dimension/this.r[4]|0)+1;
	this.rows = (this.dimension/this.d[6]|0)+2;
	this.rows_r = (this.dimension/this.r[6]|0)+2;

	this.amount_tiles = this.cols*this.rows;
	this.amount_tiles_r = this.cols_r*this.rows_r;
	*/
}
////////////////////////////////3////3/4/6/4///////////////////////////////////
/**
 * Third xtension
 * @param {[type]} config_grid [description]
 */
function GridExtension3 (config_grid) {
	this.long_name='HexagonSquareTriangleSquare'
	var index_main = 6;
	var sides={3:3,4:4,6:index_main};
	// config_grid.sides = {5:5,6:6,10:index_main};
	this.rows_complete = 1;
	this.cols_complete = 1;
	this.cols_factor = 1;
	config_grid.min_index=2;
	config_grid.max_index=5;
	Grid.call(this,sides,index_main,config_grid);
	// this.update_tile();
}
GridExtension3.prototype = Object.create(Grid.prototype);
GridExtension3.prototype.update_tile = function(first_argument) {
	var tile=[]
	var tiles=[]
	var min = this.min_index;
	// console.log("min : ",min);
	var max = this.max_index;
	// console.log("max : ",max);

	var cx=0,cy=0;
	var main_polygon = Grid.polygon_data(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],this.midangles[6]);
	this.init_angle = this.midangles[6];
	this.init_angle2 = this.ANGLE_MAIN;
	var main_polygonp = Grid.polygon_data2(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],this.init_angle);
	// var main_polygon_obj = new Polygon();
	// main_polygon_obj.center = {x:cx,y:cy};
	// main_polygon_obj.vertices = main_polygon;
	var index = 4;
	var D = {r:this.radii[index],
		D:this.d[index],
		s:index,
		delta:this.delta[this.INDEX_MAIN],
		angle_init:this.ANGLE_MAIN_HALF,
		// angle_init:0,
		angle_polygon:2*this.ANGLE_MAIN_HALF,
	};
	var squares = Grid.tile_data(cx, cy, D, min, max);
	var squares_tiles = Grid.tile_data2(cx, cy, D, min, max);
	var tangle;
	tangle = this.midangles[6]*2;
	tangle = 0;
	var tx;
	var ty;
	var lll = squares_tiles.length;
	// console.log("lll : ",lll);
	// squares_tiles.splice(2,1)
	var ref_square = squares_tiles[2].center;
	// console.log("ref_square : ",ref_square);
	var d34 = this.h[4]+this.h[3];

	tx = ref_square.x+d34*Math.cos(tangle);
	ty = ref_square.y+d34*Math.sin(tangle);
	var triangle = Grid.polygon_data(cx-tx,cy-ty,3,this.radii[3],0);
	var trianglep = Grid.polygon_data2(cx-tx,cy-ty,3,this.radii[3],0);

	tx = ref_square.x + d34*Math.cos(Math.PI);
	ty = ref_square.y + d34*Math.sin(Math.PI);
	var triangle2 = Grid.polygon_data(cx-tx,cy-ty,3,this.radii[3],this.midangles[3]);
	var triangle2p = Grid.polygon_data2(cx-tx,cy-ty,3,this.radii[3],this.midangles[3]);
	tile = tile.concat(squares,[triangle,triangle2],[main_polygon]);
	tiles = tiles.concat([main_polygonp],squares_tiles,[trianglep,triangle2p]);
	this.tile = tile;
	this.tilec = new Tile(tiles)
};
GridExtension3.prototype.update_grid_size = function  (argument) {
	this.grid_dimension_1 = 0.97*(2*this.radii[6]+2*this.midside+this.h[3]+this.r[3]);
	this.grid_dimension_2 = this.h[4]+this.h[6];
}
////////////////////////////////4////4/8/8/////////////////////////////////////
function GridExtension4 (config_grid) {
	this.long_name='SquareOctagon'
	var index_main = 4;
	var sides={8:8,4:index_main};
	// config_grid.sides = {5:5,6:6,10:index_main};
	this.rows_complete = 1;
	this.cols_complete = 1;
	this.cols_factor = 1;
	config_grid.min_index=0;
	config_grid.max_index=1;
	Grid.call(this,sides,index_main,config_grid);
	// this.update_tile();
}
GridExtension4.prototype = Object.create(Grid.prototype);
GridExtension4.prototype.update_tile = function(first_argument) {
	var tile=[]
	var min = this.min_index;
	var max = this.max_index;
	var cx=0,cy=0;
	this.init_angle=0;
	this.init_angle2=this.ANGLE_MAIN+this.ANGLE_MAIN_HALF;
	var main_polygon = Grid.polygon_data(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],0);
	var index = 8;
	var D = {r:this.radii[index],
		D:this.d[index],
		s:index,
		delta:this.delta[this.INDEX_MAIN],
		// angle_init:this.ANGLE_MAIN_HALF,
		angle_init:0,
		angle_polygon:2*this.ANGLE_MAIN_HALF,
	};
	var octagon = Grid.tile_data2(cx, cy, D, min, max);
	var main_polygon_obj = new Polygon();
	main_polygon_obj.vertices = main_polygon;
	main_polygon_obj.center = {x:cx,y:cy};
	// centers.push(octagon[0].vertices);
	tile = tile.concat(octagon[0].vertices,[main_polygon]);
	this.tile = tile;
	var tilec = this.tilec = new Tile([main_polygon_obj,octagon[0]]);
};
GridExtension4.prototype.update_grid_size = function  (argument) {
	this.grid_dimension_1 = 2*this.midside+2*this.h[8]
	this.grid_dimension_2 = 0.5*this.grid_dimension_1;
}
////////////////////////////////5////3/3/4/3/4///////////////////////////////////
function GridExtension5 (config_grid) {
	this.long_name='Square$Triangles'
	var index_main = 4;
	var sides={3:3,4:index_main};
	// config_grid.sides = {5:5,6:6,10:index_main};
	this.rows_complete = 1;
	this.cols_complete = 1;
	this.cols_factor = 1;
	config_grid.min_index=2;
	config_grid.max_index=4;
	Grid.call(this,sides,index_main,config_grid);
		// this.update_tile();
}
GridExtension5.prototype = Object.create(Grid.prototype);
GridExtension5.prototype.update_tile = function(first_argument) {
	var tiles = [];
	var min = this.min_index;
	var max = this.max_index;
	var cx=0,cy=0;
	var common_angle;
	common_angle = this.midangles[4];
	common_angle = 0;
	common_angle = this.midangles[3];
	this.init_angle = common_angle;
	this.init_angle2 = common_angle+this.ANGLE_MAIN_HALF;
	var main_polygonp = Grid.polygon_data2(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],this.init_angle);

	var delta = this.delta[this.INDEX_MAIN];

	var index = 3;
	var D = {
		r:this.radii[index],
		D:this.d[index],
		s:index,
		delta:this.delta[this.INDEX_MAIN],
		angle_init:common_angle,
		// angle_init:0,
		// angle_init:this.ANGLE_MAIN_HALF,
		angle_polygon:this.midangles[3],
		// angle_polygon:this.midangles[3]+common_angle,
		angle_polygon:0,
		// angle_polygon:-common_angle
		angle_polygon:2*common_angle+Math.PI,
	};
	var trianglesp = Grid.tile_data2(cx, cy, D, min, max);

	var t1 = trianglesp[0].center;
	var t2 = trianglesp[1].center;

	var b = common_angle+this.midangles[3]+Math.PI;
	var d34 =  this.d[3];
	var sq_x;
	sq_x = t1.x+d34*Math.cos(b);
	var sq_y;
	sq_y = t1.y+d34*Math.sin(b);
	var a = common_angle+this.midangles[3];
	var squarep = Grid.polygon_data2(sq_x,sq_y,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],a)

	var d33 =  2*this.h[3];

	b=-2.5*this.midangles[3]+common_angle;
	var tr_x = t2.x+d33*Math.cos(b);
	var tr_y = t2.y+d33*Math.sin(b);
	a = 2*this.midangles[4]+this.midangles[3]+common_angle;
	var trianglep = Grid.polygon_data2(tr_x,tr_y,3,this.radii[3],a);

	b=0
	b=2*this.midangles[3]+common_angle;
	var tr_x = t1.x+d33*Math.cos(b);
	var tr_y = t1.y+d33*Math.sin(b);
	a = 2*this.midangles[4]+this.midangles[3]+common_angle;
	a = 0
	a = this.midangles[3]+common_angle;
	var trianglep2 = Grid.polygon_data2(tr_x,tr_y,3,this.radii[3],a);

	// tiles = tiles.concat(trianglesp,[main_polygonp]);
	// tiles = tiles.concat(trianglesp,[main_polygonp],[squarep]);
	tiles = tiles.concat([main_polygonp],trianglesp,[trianglep2,trianglep,squarep]);
	this.tilec = new Tile(tiles);
};
GridExtension5.prototype.update_grid_size = function  (argument) {
	var dim =  this.midside+this.radii[3];
	var dim2 = 2*this.h[3]*2+this.radii[3]+2*this.midside;
	this.grid_dimension_2 = dim2*0.5;
	this.grid_dimension_1 = dim2
	// this.grid_dimension_1 = 2*this.h[3]*2+this.radii[3]+2*this.radii[3];
}
////////////////////////////////6////12/3/12////////////////////////////////
////////////////////////////////////////////////////////////////////////////
function GridExtension6 (config_grid) {
	this.long_name='DodecagonTriangles'
	var index_main = 12;
	var sides={3:3,12:index_main};
	// config_grid.sides = {5:5,6:6,10:index_main};
	this.rows_complete = 1;
	this.cols_complete = 1;
	this.cols_factor = 1;
	config_grid.min_index=1;
	config_grid.max_index=2;
	Grid.call(this,sides,index_main,config_grid);
}
GridExtension6.prototype = Object.create(Grid.prototype);
GridExtension6.prototype.update_tile = function(first_argument) {
	var cx=0,cy=0;
	var tiles = [];
	var common_angle = 0;
	this.init_angle = common_angle;
	this.init_angle2 = this.ANGLE_MAIN+this.ANGLE_MAIN_HALF;
	var main_polygonp = Grid.polygon_data2(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],this.init_angle);

	var index = 3;
	var min = this.min_index;
	var max = this.max_index;

	var D = {
		r:this.radii[index],
		D:this.d[index],
		s:index,
		delta:this.delta[this.INDEX_MAIN],
		angle_init:common_angle,
		angle_polygon:this.midangles[3],
	};
	var trianglesp = Grid.tile_data2(cx, cy, D, min, max);
	var trianglesp2 = Grid.tile_data2(cx, cy, D, 3, 4);

	tiles = tiles.concat([main_polygonp],trianglesp,trianglesp2);
	this.tilec = new Tile(tiles);
}
GridExtension6.prototype.update_grid_size = function  (argument) {
	this.grid_dimension_2 = this.h[12]*2-this.h[3]*2;
	this.grid_dimension_1 = this.h[12]*2;
}
////////////////////////////////7////3/3/6/6////////////////////////////////
////////////////////////////////////////////////////////////////////////////
function GridExtension7 (config_grid) {
	var index_main = 6;
	var sides={3:3,6:index_main};
	// config_grid.sides = {5:5,6:6,10:index_main};
	this.rows_complete = 1;
	this.cols_complete = 1;
	this.cols_factor = 1;
	config_grid.min_index=0;
	config_grid.max_index=1;
	Grid.call(this,sides,index_main,config_grid);
}
GridExtension7.prototype = Object.create(Grid.prototype);
GridExtension7.prototype.update_tile = function(first_argument) {
	var cx=0,cy=0;
	var tiles = [];
	var common_angle = 0;
	this.init_angle = common_angle;
	this.init_angle2 = this.ANGLE_MAIN+this.ANGLE_MAIN_HALF;
	var main_polygonp = Grid.polygon_data2(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],this.init_angle);

	var index = 3;
	var min = this.min_index;
	var max = this.max_index;

	var D = {
		r:this.radii[index],
		D:this.d[index],
		s:index,
		delta:this.delta[this.INDEX_MAIN],
		angle_init:common_angle,
		angle_polygon:this.midangles[3],
	};
	var trianglesp = Grid.tile_data2(cx, cy, D, min, max);
	var trianglesp2 = Grid.tile_data2(cx, cy, D, 3, 4);

	tiles = tiles.concat([main_polygonp],trianglesp,trianglesp2);
	this.tilec = new Tile(tiles);
}
GridExtension7.prototype.update_grid_size = function  (argument) {
	this.grid_dimension_2 = this.radii[6]
	this.grid_dimension_1 = this.h[6]*2+this.radii[3]*2+this.h[3]*2;
}
////////////////////////////////8////3/3/4/4////////////////////////////////
////////////////////////////////////////////////////////////////////////////
function GridExtension8 (config_grid) {
	var index_main = 4;
	var sides={3:3,4:index_main};
	// config_grid.sides = {5:5,6:6,10:index_main};
	this.rows_complete = 1;
	this.cols_complete = 1;
	this.cols_factor = 1;
	config_grid.min_index=1;
	config_grid.max_index=2;
	Grid.call(this,sides,index_main,config_grid);
}
GridExtension8.prototype = Object.create(Grid.prototype);
GridExtension8.prototype.update_tile = function(first_argument) {
	var cx=0,cy=0;
	var tiles = [];
	var common_angle = 0;
	this.init_angle = common_angle;
	this.init_angle2 = this.ANGLE_MAIN+this.ANGLE_MAIN_HALF;
	var main_polygonp = Grid.polygon_data2(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],this.init_angle);

	var index = 3;
	var min = this.min_index;
	var max = this.max_index;

	var D = {
		r:this.radii[index],
		D:this.d[index],
		s:index,
		delta:this.delta[this.INDEX_MAIN],
		angle_init:common_angle,
		angle_polygon:this.midangles[3],
	};
	var trianglesp = Grid.tile_data2(cx, cy, D, min, max);
	// var trianglesp2 = Grid.tile_data2(cx, cy, D, 3, 4);
	this.init_angle=common_angle;
	var squarep = Grid.polygon_data2(cx+this.d[4],cy,4,this.radii[4],this.init_angle);
	var triangle2p = Grid.polygon_data2(cx+this.d[4],cy+this.d[3],3,this.radii[3],0.5*this.midangles[3])
	var angle3 = this.midangles[3]*0.5;
	var t3x = cx+(this.h[3]*2)*Math.cos(angle3);
	var t3y = cy+this.d[3]+(this.h[3]*2)*Math.sin(angle3);
	var triangle3p = Grid.polygon_data2(t3x,t3y,3,this.radii[3],-0.5*this.midangles[3])
	tiles = tiles.concat([main_polygonp],trianglesp,[triangle3p]);
	// tiles = tiles.concat([main_polygonp],trianglesp,[squarep,triangle2p,triangle3p]);
	// tiles = tiles.concat([main_polygonp],trianglesp,trianglesp2);
	this.tilec = new Tile(tiles);
}
GridExtension8.prototype.update_grid_size = function  (argument) {
	this.grid_dimension_2 = this.h[4]+this.radii[3]+this.d[3];
	this.grid_dimension_1 = 2*this.h[4];
}
////////////////////////////////////////////////////////////////////////////
////////////////////////////////9////3/4/i//////////////////////////////////
////////////////////////////////////////////////////////////////////////////
function GridExtension9 (config_grid) {
	var index_main = 6;
	var sides={3:3,6:index_main};
	// config_grid.sides = {5:5,6:6,10:index_main};
	this.rows_complete = 1;
	this.cols_complete = 1;
	this.cols_factor = 1;
	config_grid.min_index=1;
	config_grid.max_index=3;
	Grid.call(this,sides,index_main,config_grid);
}
GridExtension9.prototype = Object.create(Grid.prototype);
GridExtension9.prototype.update_tile = function(first_argument) {
	var cx=0,cy=0;
	var tiles = [];
	var common_angle = 0;
	this.init_angle = common_angle;
	this.init_angle2 = this.ANGLE_MAIN+this.ANGLE_MAIN_HALF;
	var main_polygonp = Grid.polygon_data2(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],this.init_angle);

	var index = 3;
	var min = this.min_index;
	var max = this.max_index;

	var D = {
		r:this.radii[index],
		D:this.d[index],
		s:index,
		delta:this.delta[this.INDEX_MAIN],
		angle_init:common_angle,
		angle_polygon:this.midangles[3],
	};
	var trianglesp = Grid.tile_data2(cx, cy, D, min, max);
	var t0c = trianglesp[0].center;
	// console.log("t0c : ",t0c);
	var t1c = trianglesp[1].center;
	// console.log("t1c : ",t1c);
	// var trianglesp2 = Grid.tile_data2(cx, cy, D, 3, 4);
	var angle2 = 2*this.midangles[3];
	var r2 = 2*this.h[3];
	var t2x = t0c.x+r2*Math.cos(angle2);
	var t2y = t0c.y+r2*Math.sin(angle2);
	var triangle2p = Grid.polygon_data2(t2x,t2y,3,this.radii[3],this.midangles[3])
	var angle3 = this.midangles[3];
	var r3 = 2*this.h[3];
	var t3x = t1c.x+r3*Math.cos(angle3);
	var t3y = t1c.y+r3*Math.sin(angle3);
	var triangle3p = Grid.polygon_data2(t3x,t3y,3,this.radii[3],0)
	tiles = tiles.concat([main_polygonp],trianglesp,[triangle2p,triangle3p]);
	// tiles = tiles.concat([main_polygonp],trianglesp,trianglesp2);
	this.tilec = new Tile(tiles);
}
GridExtension9.prototype.update_grid_size = function  (argument) {
	this.grid_dimension_2 = this.midside*3+this.radii[6];
	this.grid_dimension_1 = this.d[6];
}
///////////////////////////////10////6/3/3/3//////////////////////////////////
////////////////////////////////////////////////////////////////////////////
function GridExtension10 (config_grid) {
	var index_main = 6;
	var sides={6:index_main,3:3};
	// config_grid.sides = {5:5,6:6,10:index_main};
	this.rows_complete = 1;
	this.cols_complete = 1;
	this.cols_factor = 1;
	config_grid.min_index=1;
	config_grid.max_index=4;
	Grid.call(this,sides,index_main,config_grid);
}
GridExtension10.prototype = Object.create(Grid.prototype);
GridExtension10.prototype.update_tile = function(first_argument) {
	var cx=0,cy=0;
	var tiles = [];
	var common_angle = 0;
	this.init_angle = common_angle;
	this.init_angle2 = this.ANGLE_MAIN+this.ANGLE_MAIN_HALF;
	var main_polygonp = Grid.polygon_data2(cx,cy,this.INDEX_MAIN,this.radii[this.INDEX_MAIN],this.init_angle);

	var index = 3;
	var min = this.min_index;
	var max = this.max_index;

	var D = {
		r:this.radii[index],
		D:this.d[index],
		s:index,
		delta:this.delta[this.INDEX_MAIN],
		angle_init:common_angle,
		angle_polygon:this.midangles[3],
	};
	var trianglesp = Grid.tile_data2(cx, cy, D, min, max);
	if(false){

	var t0c = trianglesp[0].center;
	// console.log("t0c : ",t0c);
	var t1c = trianglesp[1].center;
	var t2c = trianglesp[2].center;
	// console.log("t1c : ",t1c);
	// var trianglesp2 = Grid.tile_data2(cx, cy, D, 3, 4);
	var angle2 = 2*this.midangles[3];
	var r2 = 2*this.h[3];
	var t2x = t0c.x+r2*Math.cos(angle2);
	var t2y = t0c.y+r2*Math.sin(angle2);
	var triangle2p = Grid.polygon_data2(t2x,t2y,3,this.radii[3],this.midangles[3])
	var angle3 = this.midangles[3];
	var r3 = 2*this.h[3];
	var t3x = t1c.x+r3*Math.cos(angle3);
	var t3y = t1c.y+r3*Math.sin(angle3);
	var triangle3p = Grid.polygon_data2(t3x,t3y,3,this.radii[3],0)
	angle3 = 3*this.midangles[3];
	var t4x = t1c.x+r3*Math.cos(angle3);
	var t4y = t1c.y+r3*Math.sin(angle3);
	var triangle4p = Grid.polygon_data2(t4x,t4y,3,this.radii[3],0)
	angle3 = 2*this.midangles[3];
	var t5x = t2c.x+r3*Math.cos(angle3);
	var t5y = t2c.y+r3*Math.sin(angle3);
	var triangle5p = Grid.polygon_data2(t5x,t5y,3,this.radii[3],this.midangles[3])
	tiles = tiles.concat([main_polygonp],trianglesp,[triangle2p,triangle3p,triangle4p,triangle5p]);
	}
	tiles = tiles.concat([main_polygonp]);
	this.tilec = new Tile(tiles);
}
GridExtension10.prototype.update_grid_size = function  (argument) {
	this.grid_dimension_2 = 330;
	this.grid_dimension_1 = 330;
}
////////////////////////////////////////////////////////////////////////////
