
class DrawingStrategy {
    constructor(type,gui){
        switch(type) {
            case "A":
                this.strategy = new StrategyDrawAllGrid(gui);
                break
            case "B":
                this.strategy = new StrategyDrawGrid(gui);
                break
            case "C":
                this.strategy = new StrategyDrawTile(gui);
                break
            default:
                this.strategy = new StrategyDrawAllGrid(gui);
        }
    }
    setup (){
       this.strategy.setup()
    }
    update (){
       this.strategy.update()
    }
    draw (){
       this.strategy.draw()
    }
}
DrawingStrategy.set_gui=function (gui) {
	var folder_scenes = gui.addFolder("Scenes");
	folder_scenes.open();
	var key;
    DrawingStrategy.strategies = {};
	DrawingStrategy.folders = {};	
	for( key in DrawingStrategy.strategies_object ){
		var object = DrawingStrategy.strategies_object[key];
		var folder = DrawingStrategy.folders[key] =	gui.addFolder(key);
		folder.open();
    	DrawingStrategy.strategies[key]=new DrawingStrategy(key,DrawingStrategy.folders[key]);
		folder_scenes.add({key:key,f:function(){
			var dom_element = DrawingStrategy.folders[this.key];
			clear_canvas();
			DrawingStrategy.do_close_all_folders();
			dom_element.domElement.style.display='block';
			DrawingStrategy.scene = DrawingStrategy.strategies[this.key];
			DrawingStrategy.scene.setup();
			DrawingStrategy.scene.draw();

		}},'f').name(key);
	}
}
DrawingStrategy.do_close_all_folders = function (argument) {
	var key;
	for( key in DrawingStrategy.folders ){
		var object = DrawingStrategy.folders[key];
		var d = object.domElement.style.display;
		console.log("d : ",d);
		object.domElement.style.display='none';
	}
}
DrawingStrategy.strategies_object = {
	A:"(Description here)",
	B:"(Description here)",
	C:"(Description here)"
}
DrawingStrategy.strategies_list = [{
	name:"",
	description:"",
	slug:""
}];
class StrategyDraw {
    constructor(config) {
    	this.config = config;
		this.grids = grid_utils.get_extensions(config);
		this.grids.pop();
    }
    update_draw(){
    	this.update();
    	this.draw();
    }
}
class StrategyDrawAllGrid extends StrategyDraw{
    constructor(gui) {
	 	var dim =200;
		var config={
			radius:20,
			dimension:dim*1.5,
			dim
		}

        super(config)
        // console.log('StrategyDrawAllGrid created')
    }

    setup(gui){
	 	var dim =this.config.dim;
    	/*
		var config={
			radius:20,
			dimension:dim*1.5
		}
		*/
		// let grids = grid_utils.get_extensions(config);
		// grids.pop();
		var w = dim;
		var h = dim;
		var cols = innerWidth/dim|0;
		this.grids.forEach(function (argument,i) {
			var current_grid = argument;
				var x = w*(i%cols)+10;
				var y = h*((i/cols)|0)+10;
				// console.log(x,y);
				// SAVE SAVE SAVE SAVE SAVE SAVE SAVE SAVE SAVE 
				ccontext.save();
				ccontext.beginPath();
				ccontext.rect(x, y, w-10, h-10);
				ccontext.clip();
				// ccontext.closePath();
				// debugger;
				var grid_data = Grid.grid_data_from_tile(x,y,current_grid);
				Grid.draw_grid(ccontext,grid_data);
				var polygon_count=0
				var config2 = {
					palettes:chroma.brewer,
					// gui,
					grid_data,
					canvasCtx:ccontext,
					polygon_count
				}
				// console.log("config2 : ",config2);
				var grid_drawing = new GridDrawing(config2);
				grid_drawing.do_randomize_strategy();
				grid_drawing.draw_current();
				ccontext.rect(x, y, w-10, h-10);
				ccontext.stroke();
				//RESTORE RESTORE RESTORE RESTORE RESTORE RESTORE RESTORE RESTORE RESTORE 
				ccontext.restore();
		})
   }
    update(){console.log('StrategyDrawAllGrid algorithm');}
    draw(){console.log('StrategyDrawAllGrid algorithm');}
}
class StrategyDrawTile extends StrategyDraw{
    constructor(gui) {
		var radius = 200;
	 	var dim =1000;
		var config={
			radius,
			dimension:dim*1.5
		}
    	super(config);
	}
	setup(){}
	update(){}
	draw(){}
}
class StrategyDrawGrid extends StrategyDraw{
    constructor(gui) {
		var radius = 50;
		var size = 50;
	 	var dim =200;
		var config={
			radius,
			dimension:dim*1.5
		}
        super(config);
        this.radius = radius;
        this.size = size;
        // console.log('StrategyDrawGrid created');
        gui.add(this,"radius",1,100).onChange(this.update_radius).step(0.5);
        gui.add(this,"size",1,500).onChange(this.update_size).step(0.5);
        var folder1 = gui.addFolder('f');
        folder1.open();
        //TODO: can't believe i'm using this
        let that = this;
        this.grids.forEach(function (argument,i) {
        	folder1.add({f: ()=> {
	        	console.log("argument : ",argument);
	        	console.log("i : ",i);
				// this.current_grid = this.grids[0];
				console.log("this : ",that);
				that.current_grid = that.grids[i];
				clear_canvas();
				that.update_radius(that.radius,that);
				that.update_size(that.radius,that);
				that.update_draw();
				// that.draw();
	        	
	        		
        	}},'f').name(argument.name());
        })
	DrawingStrategy.set_gui(gui);
	DrawingStrategy.scene = DrawingStrategy.strategies.B;
	DrawingStrategy.scene.setup();
	DrawingStrategy.scene.update();
    }
    //TODO: get rid of this scope thing
    update_radius(r,scope){
    	if(!scope)scope = this.object;
    	clear_canvas();
		scope.current_grid.radius = r;
		scope.current_grid.update_r_dependency();
		scope.current_grid.update_tile();
		scope.update_draw();
		// this.object.draw();
    }
    //TODO: get rid of this scope thing
    update_size(r,scope){
    	if(!scope)scope = this.object;
    	clear_canvas();
		scope.current_grid.radius = r;
		scope.current_grid.update_r_dependency_size();
		scope.current_grid.update_tile();
		scope.update_draw();
		// this.object.draw();
    }
    setup(){
		this.current_grid = this.grids[8];
    }
    update(){
		var x = innerWidth*0.5;
		var y = innerHeight*0.5;
		this.grid_data = Grid.grid_data_from_tile(x,y,this.current_grid);
    	// console.log('StrategyDrawGrid algorithm');
    }
    draw(){
		ccontext.strokeStyle = 'white';
		Grid.draw_grid(ccontext,this.grid_data);
    }
}

