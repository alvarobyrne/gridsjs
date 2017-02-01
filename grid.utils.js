/*

DEPENDENCIES

get_clipping_polygon      -> vector2
get_clipping_polygon     -> Polygon
	Polygon                           -> GeometricShape
	Polygon.getRegularCenteredPolygon -> BalancingKDTree

grid_utils.image_to_grid -> ConvexPolygon
	ConvexPolygon.fromArray           -> Rectangle

 */
//<script type="text/javascript" src="polygon.freshplayer.js"></script>
//<script type="text/javascript" src="/libs/clipper/clipper_unminified.js"></script>
//import clipper sooner than other libraries
/*globals Grid, grid_data,box2d_utils from box2d.utils*/
var grid_utils={};
grid_utils.config={};
function set_grid_data (grid) {
	console.log('---------------------');
	grid_data = Grid.grid_data (controller.offset,controller.offset,grid);
}
//used at grid_client.js and toxic.grid.html
/**
 * algorithm explained at vertices_unification.html help section
 * @param  {[type]} grid_data                  [description]
 * @param  {[type]} squared_distance_threshold [description]
 * @return {[type]}                            [description]
 */
grid_utils.unifying = function (grid_data,squared_distance_threshold) {
	// clearInterval(radomizationn_interval_id);
	// clearInterval(radomizationn_interval_id);
	var all_points_repeated = [];

	grid_data.forEach(function  (tile,i) {
		tile.id = i;
		tile.polygons.forEach(function  (polygon,j) {
			// console.log("polygon : ",polygon);
			polygon.tile_id=i;
			polygon.id=j;
			polygon.vertices.forEach(function  (vertex,k) {
				vertex.id=k;
				vertex.tile_id=i;
				vertex.polygon_id=j;
				vertex.voronoiId=polygon.voronoiId;
				vertex.index=null;
				all_points_repeated.push(vertex);
			})
			// body...
		})
	})
	// console.log("all_points_repeated : ",all_points_repeated.length);
	var all_points_indexed = [];
	var indices = [];
	var count=0;
	var all_points_repeated_length = all_points_repeated.length;
	for (var i = 0; i < all_points_repeated_length; i++) {
		var vertex = all_points_repeated[i]
		for (var j = i+1; j < all_points_repeated_length; j++) {
			count++
			var vertex2 = all_points_repeated[j]
			if(vertex.index&&vertex2.index){continue}
			var dy = vertex.y-vertex2.y;
			var dx = vertex.x-vertex2.x;
			var d2 = dx*dx+dy*dy;
			if(d2<=squared_distance_threshold){
				var unique_id;
				if(vertex.index||vertex2.index){
					// One of them has been indexed,i.e. if property index is defined
					// it means that the other is not indexed .let's find which is it?
					var not;
					var idx1 = vertex.index;
					var idx2 = vertex2.index;
					if(vertex.index){
						unique_id     = vertex.index;
						not           = vertex2;
						vertex2.index = unique_id;
					}else if(vertex2.index){
						unique_id     = vertex2.index;
						vertex.index  = unique_id;
						not           = vertex;
					}
					var v = all_points_indexed[unique_id]
					v.polygon_ids.push(not.voronoiId);

					indices[not.tile_id]                         = indices[not.tile_id]||[]
					indices[not.tile_id][not.polygon_id]         = indices[not.tile_id][not.polygon_id]||[];
					indices[not.tile_id][not.polygon_id][not.id] = unique_id;
					v.v_in_cell[not.voronoiId] = not.id;
				}else{
					//None of the vertices are indexed
					var v = {x:vertex.x,y:vertex.y}

					all_points_indexed.push(v);

					unique_id = all_points_indexed.length-1;

					indices[vertex.tile_id]                               = indices[vertex.tile_id]||[]
					indices[vertex.tile_id][vertex.polygon_id]            = indices[vertex.tile_id][vertex.polygon_id]||[];
					indices[vertex.tile_id][vertex.polygon_id][vertex.id] = unique_id;

					// v.tpv=[]
					// v.tpv.push([vertex.tile_id,vertex.polygon_id,vertex.id])

					indices[vertex2.tile_id]                                 = indices[vertex2.tile_id]||[]
					indices[vertex2.tile_id][vertex2.polygon_id]             = indices[vertex2.tile_id][vertex2.polygon_id]||[];
					indices[vertex2.tile_id][vertex2.polygon_id][vertex2.id] = unique_id;
					// v.tpv.push([vertex2.tile_id,vertex2.polygon_id,vertex2.id])

					v.index       = unique_id;
					v.polygon_ids=[vertex.voronoiId,vertex2.voronoiId];
					// console.log("v : ",v);
					vertex.index  = unique_id;
					// console.log("vertex : ",vertex);
					vertex2.index = unique_id;
					v.v_in_cell = {};
					v.v_in_cell[vertex.voronoiId] = vertex.id;
					v.v_in_cell[vertex2.voronoiId] = vertex2.id;

				}
			}
		};
	};
	//Now that al vertices are indexed 
	//lets make every vertex point to a unique one 
	//with help of those indices
	//
	//
	//
	// console.log("count : ",count);
	// console.log("all_points_indexed : ",all_points_indexed.length);
	var half_edges = [];
	var half_edges_obj  = [];
	var half_edges_obj2 = {};
	grid_data.forEach(function  (tile,i) {
		var unique_tile = indices[i];
		if(!unique_tile){
			console.log('returning');
			return
		}
		tile.polygons.forEach(function  (polygon,j) {
			var voronoiId = polygon.voronoiId;
			var unique_vertices_ids = unique_tile[j];
			polygon.halfedges = [];
			polygon.indices = [];
			polygon.half_edges_obj = {};
			polygon.neighbours = [];
			var id = polygon.id;
			polygon.vertices.forEach(function  (vertex,k,a) {
				var l = (k+1)%a.length;
				var unique_vertex_idx = unique_vertices_ids[k];
				// var unique_vertex_idx = indices[i][j][k];
				var unique_vertex_idx_next = unique_vertices_ids[l];
				var u = indices[i][j][k];
				var v = indices[i][j][l];
				var are_equal  = unique_vertex_idx===u;
				var are_equal2 = unique_vertex_idx_next===v;
				var are_equal3 = vertex.index===u;
				var are_equal4 = v===a[l].index;
				// console.log('----------------------');
				// console.log("are_equal4 : ",are_equal4);
				// console.log("are_equal3 : ",are_equal3);
				if(!are_equal4){
					var vi = a[l].index
					// console.log("vi : ",vi,v);
				}
				// console.log("are_equal2 : ",are_equal2);
				// console.log("are_equal : ",are_equal);
				// unique_vertex_idx=vertex.index;
				// unique_vertex_idx_next=a[l].index;
				var pair_of_indices = [unique_vertex_idx,unique_vertex_idx_next]
				polygon.indices.push(unique_vertex_idx);
				polygon.halfedges.push(pair_of_indices)
				if(unique_vertex_idx){
					grid_data[i].polygons[j].vertices[k] = all_points_indexed[unique_vertex_idx];
					// 
					// 
					// Key to it all!!!
					// 
					// 
					// var aaaa = all_points_indexed[unique_vertex_idx];
					// debugger
					// console.log('	a');
					// vertex = all_points_indexed[unique_vertex_idx];
					// 
					// 
					// 
					if(unique_vertex_idx_next){
						half_edges.push(pair_of_indices);
						half_edges_obj.push({indices:pair_of_indices,voronoiId});
					}else{
						// console.log('no  next');
					}
				}else{
					// console.log('APC: adorable y pequenya criatura');
					// console.log('not unique');
				}
			})
		})
	})
	grid_data.all_points_indexed = all_points_indexed;
	grid_data.half_edges         = half_edges;
	grid_data.half_edges_obj     = half_edges_obj;
}
grid_utils.get_edges_raw=function (grid_data) {
	var half_edges = grid_data.half_edges
	// console.log("half_edges : ",half_edges);
	var half_edges_unique = {};
	var half_edges_unique2 = {};
	grid_data.half_edges.forEach(function (argument,i) {
		var obj = grid_data.half_edges_obj[	i]
		var i0 = argument[0];
		var i1 = argument[1];
		var hash;
		var hash1 = i0+','+i1,
			hash2 = i1+','+i0;
		half_edges_unique2[hash1]=i
		half_edges_unique2[hash2]=i
		if(i0>i1){
			hash=hash1
		}else{
			hash=hash2

		}
		if(!half_edges_unique[hash]){
			half_edges_unique[hash]=[]
		}
		half_edges_unique[hash].push(obj.voronoiId);
	})
	var edges=[];
	var polygons = []
	grid_data.forEach(function (tile) {
		tile.polygons.forEach(function (polygon) {
			polygons.push(polygon);
		})
	})
	// console.log("polygons : ",polygons.length);
	var half_edges_indices_hashes = Object.keys(half_edges_unique)
	half_edges_indices_hashes.forEach(function (hash,i) {
		var pair = hash.split(',').map(function (argument) {
			return +argument;
		})
		var i0 = pair[0];
		var i1 = pair[1];
		var polygons_ids = half_edges_unique[hash];
		var var_name = hash.split(',')
		// console.log("var_name : ",var_name);
		var id0 = polygons_ids[0];
		var id1 = polygons_ids[1];
		var p0  = polygons[id0];
		if(p0)p0.neighbours.push(id1)
		var p1  = polygons[id1];
		if(p1)p1.neighbours.push(id0)
		var p0_indices = p0.indices
				
		var p1_indices = p1?p1.indices:[];
		var position_in_polygon10 = p1_indices.indexOf(i0);
		var position_in_polygon11 = p1_indices.indexOf(i1);
		var position_in_polygon00 = p0_indices.indexOf(i0);
		var position_in_polygon01 = p0_indices.indexOf(i1);
		// var c = new qlib.Vector2(p0.center);
		var c = p0.center;
		var v0 = grid_data.all_points_indexed[i0];
		var v1 = grid_data.all_points_indexed[i1];
		if(!v0.edges_ids)v0.edges_ids=[]
		v0.edges_ids.push(i);
		if(!v1.edges_ids)v1.edges_ids=[]
		v1.edges_ids.push(i);
		edges[i]={v0,v1};
		var is_left = (v1.x-v0.x)*(c.y-v0.y)-(c.x-v0.x)*(v1.y-v0.y);
		var rsite,lsite;
		if(is_left>=0){
			lsite = id0;
			rsite = id1;
		}else{
			rsite = id0;
			lsite = id1;
		}
		edges[i].lsite = lsite;
		edges[i].rsite = rsite;
		edges[i].i0    = i0;
		edges[i].i1    = i1;
	})
	return edges
}
function SCHalfEdge() {
	this.site={id:-1,x:NaN,y:NaN}
	this.edge =new SCEdge();
}
function SCEdge(lsite,rsite) {
	this.lsite = {id:-1,x:NaN,y:NaN}
	this.rsite = {id:-1,x:NaN,y:NaN}
	this.va=new SCVertex();
	this.vb=new SCVertex();
}
function SCVertex() {
	this.x = NaN;
	this.y = NaN;
}
grid_utils.update_radius  = function (current_grid,radius,x,y,callback) {
	// console.log('-------------');
	// console.log("current_grid : ",current_grid);
	var grid_data;
	current_grid.radius = radius;
	current_grid.update_r_dependency();
	current_grid.update_tile()
	grid_data = Grid.grid_data (x,y,current_grid) ;
	// Grid.draw_grid2(canvasCtx,grid_data);
	grid_utils._set_initial_radii(current_grid);
	if(callback)callback()
	// current_color_function(grid_data);
	// draw_frame();
	// controller_size.max(radius);
	// controller_size.updateDisplay();
	// seriously_update();
	return grid_data
}
//'private'
grid_utils._set_initial_radii  = function  (current_grid) {
	grid_utils.initial_radii = {};
	var sides = current_grid.sides;
	for(var j in sides){
		// console.log("j : ",j);
		grid_utils.initial_radii[j]=current_grid.radii[j];
		// count_type++;
		// sides[j]=
	}
}
grid_utils.do_clear_canvas = function  (canvasCtx,controller) {
	
	if(controller.is_clearing_canvas)
	canvasCtx.clearRect(0,0,canvasCtx.canvas.width,canvasCtx.canvas.height)
}
grid_utils.do_intersect = function (grid_data,box2) {
	if(box2 === undefined && controller.box){
		box2 = {
			xl:controller.box.l,
			xr:controller.box.l+controller.box.w,
			yt:controller.box.t,
			yb:controller.box.t+controller.box.h
		}
	}else if(box2 === undefined && controller.box===undefined){
		box2 = {
			xl:100,
			xr:200,
			yt:100,
			yb:200
		}
	}
	var reference_box = grid_utils.get_polygon_from_box(box2);
	grid_utils.do_intersect2(grid_data,reference_box)
}
/*
grid_utils.get_polygon_from_box = function (box) {
	return [
		{x:box.xl,y:box.yt},
		{x:box.xr,y:box.yt},
		{x:box.xr,y:box.yb},
		{x:box.xl,y:box.yb}
	];
}
*/
//modifies grid_data
//depends on clipperlib
grid_utils.do_intersect2 = function (grid_data,reference_box) {
	grid_data.forEach(function  (tile) {
		for (var i = tile.polygons.length - 1; i >= 0; i--) {
			var is_intersecting = grid_utils._intersect_polygon (tile.polygons[i],reference_box)
			if(!is_intersecting){
				tile.polygons.splice(i,1)
			}

		};
	})
}
//'private'
//NO, not private, voronoi_utils uses it & it's also tested in grid_utils_client
grid_utils._intersect_polygon = function (polygon,reference_box) {
	grid_utils.cpr = grid_utils.cpr===undefined?new ClipperLib.Clipper():grid_utils.cpr;
	var subject_fillType = clip_fillType = ClipperLib.PolyFillType.pftNonZero;
	subject_fillType = clip_fillType = ClipperLib.PolyFillType.pftNegative;
	subject_fillType = clip_fillType = ClipperLib.PolyFillType.pftPositive;
	subject_fillType = clip_fillType = ClipperLib.PolyFillType.pftEvenOdd;
	subject_fillType = clip_fillType = ClipperLib.PolyFillType.pftNonZero;
	var operation;
	operation = ClipperLib.ClipType.ctUnion;
	operation = ClipperLib.ClipType.ctDifference;
	operation = ClipperLib.ClipType.ctXor;
	operation = ClipperLib.ClipType.ctIntersection;
	// var polygon = tile.polygons[i]
	var index_output;
	// intersect_polygon2()
	var vertices = polygon.vertices;
	// console.log("vertices : ",vertices);
	var center = polygon.center;
	var cpr = grid_utils.cpr;
	// console.log("cpr : ",cpr);
	cpr.Clear();
	var ptSubject = ClipperLib.PolyType.ptSubject;
	var ptClip = ClipperLib.PolyType.ptClip;
	var reference_box_capitalized = reference_box.map(function (vertex) {
		return{X:vertex.x,Y:vertex.y}
	})
	var vertices_capitalized = vertices.map(function (vertex) {
		return{X:vertex.x,	Y:vertex.y}
	})
	/*
	cpr.AddPaths([reference_box_capitalized],ptSubject,true)
	cpr.AddPaths([vertices_capitalized],ptClip,true);
	/*/
	cpr.AddPaths([reference_box_capitalized],ptClip,true)
	cpr.AddPaths([vertices_capitalized],ptSubject,true);
	//*/

	// cpr.AppendPoly(ClipperLib.PolyType.ptSubject,true)
	var solution_paths = new ClipperLib.Paths();
	cpr.Execute(operation, solution_paths, subject_fillType, clip_fillType);

	// var intersection;
	// intersection = intersectionPolygons(reference_box,vertices);
	// intersection = intersectionPolygons(vertices,reference_box);
	if(solution_paths.length ){
		index_output = true;
		// polygon.vertices = intersection;
		// output=true
		polygon.vertices = solution_paths[0].map(function  (vertex) {
			return{x:vertex.X,y:vertex.Y}
		});
	}else{
		polygon.vertices=[]
	}
	return index_output
}
grid_utils.intersect_polygon2 = function (polygon,clipping_polygon) {
	var subject_fillType = clip_fillType = ClipperLib.PolyFillType.pftNonZero;
	subject_fillType = clip_fillType = ClipperLib.PolyFillType.pftNegative;
	subject_fillType = clip_fillType = ClipperLib.PolyFillType.pftPositive;
	subject_fillType = clip_fillType = ClipperLib.PolyFillType.pftEvenOdd;
	subject_fillType = clip_fillType = ClipperLib.PolyFillType.pftNonZero;
	var operation;
	operation = ClipperLib.ClipType.ctUnion;
	operation = ClipperLib.ClipType.ctDifference;
	operation = ClipperLib.ClipType.ctXor;
	operation = ClipperLib.ClipType.ctIntersection;
	var vertices = polygon.vertices;
	var cpr = grid_utils.cpr;
	// console.log("cpr : ",cpr);
	cpr.Clear();
	var ptSubject = ClipperLib.PolyType.ptSubject;
	var ptClip = ClipperLib.PolyType.ptClip;
	var reference_box_capitalized = clipping_polygon.map(function (vertex) {
		return{X:vertex.x,Y:vertex.y}
	})
	var vertices_capitalized = vertices.map(function (vertex) {
		return{X:vertex.x,Y:vertex.y}
	})
	/*
	cpr.AddPaths([reference_box_capitalized],ptSubject,true)
	cpr.AddPaths([vertices_capitalized],ptClip,true);
	/*/
	cpr.AddPaths([reference_box_capitalized],ptClip,true)
	cpr.AddPaths([vertices_capitalized],ptSubject,true);
	//*/

	// cpr.AppendPoly(ClipperLib.PolyType.ptSubject,true)
	var solution_paths = new ClipperLib.Paths();
	cpr.Execute(operation, solution_paths, subject_fillType, clip_fillType);

	var index_output;
	if(solution_paths.length ){
		index_output = true;
		polygon.vertices = solution_paths[0].map(function  (vertex) {
			return{x:vertex.X,y:vertex.Y}
		});
	}else{
		polygon.vertices=[]
	}
	return index_output
}
grid_utils.get_polygon_from_box = function (box) {
	return [
		{x:box.xl,y:box.yt},
		{x:box.xr,y:box.yt},
		{x:box.xr,y:box.yb},
		{x:box.xl,y:box.yb}
	];
}
grid_utils.set_extensions=function  (config,type) {
	type=type===undefined?'GridExtension':type;
	grid_utils.config = config;
	var count_extension=1
	grid_utils.grids=[]
	while(window[type+count_extension]){
		var GridExt = window[type+count_extension]
		grid_utils.grids.push(new GridExt(grid_utils.config));
		count_extension++;
	}
}
/**
 * [get_extensions description]
 * While an extension named GridExtension1
 * ,GridExtension2
 * ,GridExtension3
 * ...
 * exists, create and instance of it and addit to 
 * function output
 * @param  {[type]} config [description]
 * @param  {[type]} type   [description]
 * @return {[type]}        [description]
 */
grid_utils.get_extensions=function  (config,type) {
	type=type===undefined?'GridExtension':type;
	var grids=[];
	grid_utils.config = config;
	var count_extension=1
	// grid_utils.grids=[];
	while(window[type+count_extension]){
		// console.log("count_extension : ",count_extension);
		var GridExt = window[type+count_extension]
		grids.push(new GridExt(grid_utils.config));
		count_extension++;
	}
	return grids;
}
//previously called randomize_all_points_indexed
grid_utils.randomize_all_unified_points = function  (grid_data,controller) {
	var all_points_indexed = grid_data.all_points_indexed;
	all_points_indexed.forEach(function  (vertex) {
		vertex.x+=(-0.5+Math.random())*controller.randomness
		vertex.y+=(-0.5+Math.random())*controller.randomness
	})
}
/*
grid_utils.vertices_and_center_from_config =function(box) {
	return {
		vertices:[
			{x:box.left,y:box.top},
			{x:box.left+box.width,y:box.top},
			{x:box.left+box.width,y:box.top+box.height},
			{x:box.left,y:box.top+box.height}
		],
		center:{
			x: box.left+box.width*0.5,
			y: box.top+box.height*0.5
		}
	}
}
*/
/*
depends on box2d.utils.js and, if intersecting, on clipperlib 
used at box2d-voronoi.2.html NOT THE STATIC
the static one is used at image.grid.voronoi.html
*/
// grid_utils.no_box2d_utils_message_error='box2d_utils geti ti from....'
grid_utils.add_bodies_grid =function (world,grids_,box,vel,index,is_intersecting,config) {
	// console.log("box : ",box);
	// if(!box2d_utils)throw grid_utils.no_box2d_udtils_message_error;
	is_intersecting=is_intersecting===undefined?true:is_intersecting;
	// console.log("index : ",index);
	// console.log("box : ",box);
	var rect_config = grid_utils.vertices_and_center_from_config(box);
	// console.log("rect_config : ",rect_config);

	var grid_index = grids_.length*Math.random()|0
	if(index===undefined)index = grid_index;
	var grid = grids_[index];
	// console.log("grid : ",grid);
	var grid_center_x;
	var grid_center_y;
	grid_center_x = rect_config.center.x;
	// console.log("grid_center_x : ",grid_center_x);
	grid_center_y = rect_config.center.y;
	// console.log("grid_center_y : ",grid_center_y);
	
	// return
	var grid_data = Grid.grid_data(grid_center_x,grid_center_y,grid);
	// controller.box = {l:140,t:120,w:100,h:100}
	// controller.is_intersecting = true;
	var config_={}
	config_.density = config.polygon_density;		
	config_.vel = vel;
	config_.inv_scale = config.inv_scale;

	var box3 = rect_config.vertices
	// console.log("box3 : ",box3);
	if(is_intersecting){
		// console.log('------------------');
		grid_utils.do_intersect2(grid_data,box3);
	}

	var broken_bodies = grid_utils._add_grid_to_box2d(world,grid_data,vel,config_);
	return broken_bodies
}
/*
*/
/**
 * depends on box2d.utils.js
 * todo: used NO WHERE box2d-voronoi.2.html
 * 'private?'
 * @param {[type]} world      [description]
 * @param {[type]} grid_data_ [description]
 * @param {[type]} vel        [description]
 * @param {[type]} config_    [description]
 */
grid_utils._add_grid_to_box2d =function (world,grid_data_,vel,config_) {
	// if(box2d_utils===undefined)throw grid_utils.no_box2d_udtils_message_error;
	// config = config===undefined?{}:config
	var config={};
	config.density = config_.polygon_density;		
	config.vel = vel;
	config.inv_scale = config_.inv_scale;
	var bodies = [];
	grid_data_.forEach(function  (tile) {
		tile.polygons.forEach(function  (polygon,i) {
			var vertices_translated = polygon.vertices.map(function  (vertex) {
				return{
					x:vertex.x-polygon.center.x,
					y:vertex.y-polygon.center.y
				}
			})
			var grid_body = box2d_utils.add_polygon_body_from_vertices(
				world,
				polygon.center,
				vertices_translated,
				config);
			bodies.push(grid_body);
		})
	})
	return bodies;
}
grid_utils.vertices_and_center_from_config =function(box) {
	// console.trace();
	// console.log("box :--------------- ",box);
	return {
		vertices:[
			{x:box.left,y:box.top},
			{x:box.left+box.width,y:box.top},
			{x:box.left+box.width,y:box.top+box.height},
			{x:box.left,y:box.top+box.height}
		],
		center:{
			x: box.left+box.width*0.5,
			y: box.top+box.height*0.5
		}
	}
	// body...
}
grid_utils.draw_polygons = function (context,polygons) {
	polygons.forEach(function  (poly) {
		grid_utils.draw_polygon(context,poly)
	})
}
//compare with Grid._draw_polygon_from_points @ Grid.js
grid_utils.draw_polygon = function (context,polygon) {
	context.beginPath();
	// context.fillStyle = 'rgba(255,255,255,0.3)';
	polygon.vertices.forEach(function  (e,i,a) {
		if(i===0){
			context.moveTo(e.x,e.y)
		}else{
			context.lineTo(e.x,e.y)
		}
	});
	context.closePath();
	context.fill();
	context.stroke();
}
/*
depends on qlib
Creates canvas elements named pieces which are to be used in pixijs
or in any other graphics laibrary
or with canvas itself and no graphics library
*/
grid_utils.image_to_grid = function (grid_data,image_,is_stroke) {
	is_stroke = is_stroke===undefined?true:is_stroke;
	var pieces = []

	grid_data.forEach(function  (tile) {
		tile.polygons.forEach(function  (polygon) {
			var qvertices = polygon.vertices.map(function  (vertex) {
				return new qlib.Vector2(vertex.x,vertex.y)
			})
			var qolygon = qlib.ConvexPolygon.fromArray(qvertices);
			qolygon.updateBoundingRect();
			var bbox = qolygon._boundingRect;
			var piece = document.createElement('canvas');
			piece.style.background='none';
			piece.width=bbox.width;
			piece.height=bbox.height;
			var pieceCtx = piece.getContext('2d');
			// grid_utils._do_copy_piece = function  (context,vertices,bbox) {
			var vertices = grid_utils._do_copy_piece(image_,pieceCtx, polygon.vertices, bbox, is_stroke)
			pieces.push({piece:piece,bbox:bbox,vertices:vertices});
			/*
			pieceCtx.translate(-bbox.x,-bbox.y);
			pieceCtx.beginPath();
			var vertices = [];
			polygon.vertices.forEach(function  (vertex,i) {
				var start = vertex
				var x = start.x;
				var y = start.y;
				x -= bbox.x;y -= bbox.y;
				vertices.push({x:x,y:y})
				if(i===0){
					pieceCtx.moveTo(start.x,start.y);
				}else{
					pieceCtx.lineTo(start.x,start.y);
				}
			})
			if(is_stroke){
				pieceCtx.lineWidth=0;
				pieceCtx.closePath();
				pieceCtx.stroke();
			}
			pieceCtx.fillStyle=pieceCtx.createPattern(image_,'repeat')
			pieceCtx.fill();
			pieces.push({piece:piece,bbox:bbox,vertices:vertices});
			*/
		})

	})	
	return pieces;
}
/*
//inspired /copied /theft /mised-from by polyclip
usage of createPattern fron CanvasRenderingContext2d
*/
grid_utils._do_copy_piece = function  (image,context, polygon_vertices, bbox, is_stroke) {
	context.translate(-bbox.x,-bbox.y);
	context.beginPath();
	var vertices = [];
	polygon_vertices.forEach(function  (vertex,i) {
		var start = vertex
		var x = start.x;
		var y = start.y;
		x -= bbox.x;y -= bbox.y;
		vertices.push({x:x,y:y})
		if(i===0){
			context.moveTo(start.x,start.y);
		}else{
			context.lineTo(start.x,start.y);
		}
	})
	if(is_stroke){
		context.lineWidth=0;
		context.closePath();
		context.stroke();
	}
	context.fillStyle=context.createPattern(image,'repeat')
	
	// context.scale(0.7,0.7);
	context.fill();
	return vertices;
	// body...
}
/*
creates objects for box2d attaching them the pixi
attachment made via box2d-bodies' SetUserdata function
*/
grid_utils.do_break_image_pixi = function (stage,world_,pieces,is_reversing,config) {
// grid_utils.do_break_image_pixi = function (world_,pieces,is_debugging,is_adding,stage,inv_scale) {
	if(!config)config={}
	config.is_adding=!config.is_adding?true:config.is_adding;
	config.is_debugging=!config.is_debugging?false:config.is_debugging;
	config.inv_scale=!config.inv_scale?1/30:config.inv_scale;
	var pieces_list=[]
	var piece_box2d;
	pieces.forEach(function  (piece,j) {
		var texture = PIXI.Texture.fromCanvas(piece.piece);
		// create a new Sprite using the texture
		var sprite = new PIXI.Sprite(texture);
		// center the sprites anchor point
		// sprite.anchor.x = 0.5;
		// sprite.anchor.y = 0.5;
	 	var bbox = piece.bbox;
		// move the sprite t the center of the screen
		// sprite.y = bbox.y+bbox.height*0.5;
		// sprite.x = bbox.x+bbox.width*0.5;
		sprite.x = bbox.x;
		sprite.y = bbox.y;
		
		if(config.is_debugging&&false){
			//requires chroma, and config to have a palette
		
			var color;
			color = config.palette[polygon_number_of_sides]
			color = config.palette[j%config.palette.length]
			color=chroma(color).rgb();
			color = color[0]<<16|color[1]<<8|color[2];

			var graphics;
			graphics = new PIXI.Graphics();
			graphics.lineStyle ( 5 , color,  1);
			// graphics.beginFill(this.colour);
			graphics.drawCircle(0, 0, 5);
			graphics.drawCircle(-bbox.width*0.5, -bbox.height*0.5, 5);
		 
			sprite.addChild(graphics);
			var polygon_number_of_sides = piece.vertices.length;
			graphics = new PIXI.Graphics();
			// var anchor = graphics.anchor;
			// console.log("anchor : ",anchor);
			graphics.lineStyle(5,color,1);
			// graphics.drawRect(bbox.x,bbox.y,bbox.width,bbox.height)
			graphics.drawRect(-bbox.width*0.5,-bbox.height*0.5,bbox.width,bbox.height)
			// graphics.drawRect()

			// stage.addChild(graphics);
			sprite.addChild(graphics);
		}
		stage.addChild(sprite);
		var vertices = is_reversing?piece.vertices.reverse():piece.vertices;
		if(config.is_adding){

				var pos;
				// pos = {x:bbox.x*inv_scale,y:bbox.y*inv_scale};
				pos = {x:bbox.x,y:bbox.y};
			piece_box2d = box2d_utils.add_polygon_body_from_vertices(
				world_,
				pos,
				vertices,
				{inv_scale:controller.inv_scale}
			);
			piece_box2d.SetUserData({sprite:sprite,bbox:bbox,initial_position:pos})
		}else{

			piece_box2d = box2d_utils.get_polygon_body_from_vertices(
				world_,
				{x:bbox.x,y:bbox.y}, 
				vertices,
				{inv_scale:inv_scale}
			);
			piece_box2d.sprite = sprite;
			piece_box2d.bbox = bbox;
		}
		pieces_list.push(piece_box2d);

	})
	return pieces_list;
}
/*
*/
grid_utils.update_pixi = function(pieces_box2d,scale){
	pieces_box2d.forEach(function  (piece_box2d) {
		var user_data = piece_box2d.GetUserData();
		var sprite = user_data.sprite;
		var box2d_position;
		box2d_position = piece_box2d.GetWorldCenter()
		box2d_position = piece_box2d.GetPosition()
		var angle = piece_box2d.GetAngle();
		var pos;
		pos = sprite.position;
		// console.log('-----------------');
		// console.log("pos : ",pos);
		// sprite.anchor.x = 0.5;
		// sprite.anchor.y = 0.5;

		sprite.x = box2d_position.x*scale
		sprite.y = box2d_position.y*scale
		pos = sprite.position;
		// console.log("pos : ",pos);
		
		sprite.rotation = angle;
	})
}
/////////////////////////////quasimondo.libs required//////////////////////////
grid_utils.get_clipping_polygon =function(config) {
	var radius = config.radius;
	var sides= config.sides;
	var rotation =0;
	var center =new qlib.Vector2(config.x,config.y)
	return qlib.Polygon.getRegularCenteredPolygon( radius, sides, center , rotation )
}
