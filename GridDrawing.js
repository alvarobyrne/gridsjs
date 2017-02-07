//Project done by http://www.kuip.co.uk/
//https://github.com/loredanacirstea/es6-design-patterns
//http://loredanacirstea.github.io/es6-design-patterns/
//License: Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/4.0/)
'use strict';
class DrawGrid {
    constructor(grid_data){

        grid_data.color_per_type={}
        var palette_copy = grid_data.palette.concat();
        // console.log("palette_copy : ",palette_copy);
        var type_of_side = '3,4,5,6,8,10,12';
        type_of_side=type_of_side.split(',');
        type_of_side.forEach((type)=> {
            var color = palette_copy.splice(palette_copy.length*Math.random()|0,1);
            var type_number = +type;
            grid_data.color_per_type[type_number] = color;
        })

        // console.log("grid_data : ",grid_data);
        switch(grid_data.strategy_id) {
            case "A":
                this.strategy = new ConcreteStrategyA(grid_data);
                break
            case "B":
                this.strategy = new ConcreteStrategyB(grid_data);
                break
            case "C":
                this.strategy = new ConcreteStrategyC(grid_data);
                break
            case "D":
                this.strategy = new ConcreteStrategyD(grid_data);
                break
            case "E":
                this.strategy = new ConcreteStrategyE(grid_data);
                break
            case "F":
                this.strategy = new ConcreteStrategyF(grid_data);
                break
            case "G":
                this.strategy = new ConcreteStrategyG(grid_data);
                break
            case "H":
                this.strategy = new ConcreteStrategyH(grid_data);
                break
            default:
                this.strategy = new ConcreteStrategyA(grid_data);
        }
    }
    ContextInterface (){
        this.strategy.draw()
    }
}
class ColoringStrategy {
    constructor(config) {
        this.grid_data         = config.grid_data;
        this.canvasCtx         = config.canvasCtx;
        this.palette           = config.palette;
        this.color_offset      = config.color_offset;
        this.perlin_offset     = config.perlin_offset;
        this.perlin_depth      = config.perlin_depth;
        this.perlin_frequency  = config.perlin_frequency;
        this.color_per_type    = config.color_per_type;
    }
    draw (){
        this.grid_data.forEach(  (tile,i)=> {
            var polygons = tile.polygons;
            polygons.forEach(  (polygon,j)=> {
                var vertices = polygon.vertices;
                var sides_amount = vertices.length;
                vertices.forEach(  (vertex,k)=> {
                    if(k===0){
                        this.selecting_color_function(sides_amount,j);
                        this.canvasCtx.beginPath();
                        this.canvasCtx.moveTo(vertex.x, vertex.y);
                    }else{
                        this.canvasCtx.lineTo(vertex.x, vertex.y);
                    }
                })
                this.canvasCtx.closePath();
                this.canvasCtx.stroke();
                this.canvasCtx.fill();
            })
        })
    }
    selecting_color_function(){
        throw 'should overwite!!!'
    }
}
class ConcreteStrategyA extends ColoringStrategy{
    selecting_color_function(polygon_sides_amount,i){
        var idx = (this.color_offset+i)%this.palette.length;
        // console.log("idx : ",idx);
        this.canvasCtx.fillStyle = this.palette[idx];
    }
}
class ConcreteStrategyB extends ColoringStrategy{
    selecting_color_function(polygon_sides_amount,i){
        this.canvasCtx.fillStyle = this.color_per_type[polygon_sides_amount]
    }
}
class ConcreteStrategyC extends ConcreteStrategyB{
    selecting_color_function(polygon_sides_amount,i){
        //set random palette
        super.selecting_color_function(polygon_sides_amount,i);
    }
}
class ConcreteStrategyD extends ColoringStrategy{
    selecting_color_function(polygon_sides_amount,i){
        // this.canvasCtx.fillStyle = this.color_per_type[polygon_sides_amount]
        this.canvasCtx.fillStyle = this.palette[this.palette.length*Math.random()|0];
    }
}
class ConcreteStrategyE extends ColoringStrategy{
    selecting_color_function(polygon_sides_amount,i){
        // this.canvasCtx.fillStyle = this.color_per_type[polygon_sides_amount]
        this.canvasCtx.fillStyle = this.palette[this.palette.length*Math.random()|0];
    }
}
class ConcreteStrategyF extends ConcreteStrategyA{
    draw (){
        let polygon_count=0;
        this.grid_data.forEach(  (tile,i)=> {
            var polygons = tile.polygons;
            polygons.forEach(  (polygon,j)=> {
                var vertices = polygon.vertices;
                var sides_amount = vertices.length;
                vertices.forEach(  (vertex,k)=> {
                    if(k===0){
                        this.selecting_color_function(sides_amount,polygon_count);
                        this.canvasCtx.beginPath();
                        this.canvasCtx.moveTo(vertex.x, vertex.y);
                    }else{
                        this.canvasCtx.lineTo(vertex.x, vertex.y);
                    }
                })
                this.canvasCtx.closePath();
                this.canvasCtx.stroke();
                this.canvasCtx.fill();
                polygon_count++
            })
        })
    }
}
class ConcreteStrategyG extends ColoringStrategy{
    constructor(config){
        super(config)
        this.noise = noise.perlin2;
        // console.log("noise : ",noise);
        // console.log("fn : ",fn);
        // console.log('G');
    }
    draw (){
        let polygon_count=0;
        this.grid_data.forEach(  (tile,i)=> {
            var polygons = tile.polygons;
            polygons.forEach(  (polygon,j)=> {
                var c = polygon.center;
                if(c.x<-50||c.x>innerWidth+50||c.y<-50||c.y>innerHeight+50)return
                var vertices = polygon.vertices;
                var sides_amount = vertices.length;
                vertices.forEach(  (vertex,k)=> {
                    if(k===0){
                        this.selecting_color_function(polygon.center);
                        this.canvasCtx.beginPath();
                        this.canvasCtx.moveTo(vertex.x, vertex.y);
                    }else{
                        this.canvasCtx.lineTo(vertex.x, vertex.y);
                    }
                })
                this.canvasCtx.closePath();
                this.canvasCtx.stroke();
                this.canvasCtx.fill();
                polygon_count++
            })
        })
    }
    selecting_color_function(c){
        var f = this.perlin_frequency;
        var value = this.noise(-200+this.perlin_offset+c.x*f,-200+c.y*f)
        var idx = ((value+1)*0.5*this.palette.length)|0;
        this.canvasCtx.fillStyle = this.palette[idx];
    }
}
class ConcreteStrategyH extends ConcreteStrategyG{
    constructor(config){
        super(config)
        this.noise = noise.perlin3;
        this.noise = config.noise_function === 'simplex' ? noise.simplex3 : noise.perlin3;

        // console.log("noise : ",noise);
        // console.log("fn : ",fn);
        // console.log('G');
    }
    selecting_color_function(c){
        var f = this.perlin_frequency;
        var value = this.noise(-200+this.perlin_offset+c.x*f,-200+c.y*f,this.perlin_depth)
        var idx = ((value+1)*0.5*this.palette.length)|0;
        idx = (this.color_offset+idx)%this.palette.length;
        this.canvasCtx.fillStyle = this.palette[idx];
    }
}
class GridDrawing{
    constructor(config){
        var p = this.palettes  = config.palettes;
        // console.log("p : ",p);
        this.grid_data = config.grid_data;
        this.canvasCtx = config.canvasCtx;
        this.do_randomize_palette()
        // var keys = Object.keys(this.palettes)
        // this.palette_key = keys[keys.length*Math.random()|0];
        // this.palette = this.palettes[this.palette_key];
        this.draw_config = {
            grid_data:config.grid_data,
            canvasCtx:config.canvasCtx,
            palette:this.palette,
            strategy_id:-1,
            color_offset:0,
            perlin_offset:0,
            perlin_period:200,
            perlin_frequency:NaN,
            perlin_depth:0,
            noise_function:'perlin',
        }
        this.draw_config.perlin_frequency=1/this.draw_config.perlin_period;
        this.context=null;
        if(!config.gui)return;
        this.gui = config.gui.addFolder('GridDrawing');
        this.gui.open();
        // this.gui.add(this,'use_strategy_A').name('current palette + offset + type');
        // this.gui.add(this,'use_strategy_B').name('random current palette + type');
        // this.gui.add(this,'use_strategy_C').name('random palette');
        // this.gui.add(this,'use_strategy_D').name('current palette + random');
        var strategies = this.strategies = {
            A:'current palette + offset + type',
            B:'current palette + type + random color',
            C:'random palette + type',
            D:'random palette + random color',
            E:'current palette + random color',
            F:'Description',
            G:'perlin 2d',
            H:'perlin 3d'
        }       
            console.log("strategies : ",strategies);
        var key;
        for( key in strategies ){
            var object = strategies[key];
            this.gui.add(this,'use_strategy_'+key).name(key+'. '+ object);
        }
        this.strategy_id = '';
        this.gui_strategy_id = this.gui.add(this,'strategy_id').name('current strategy');
        var keys = Object.keys(this.palettes)
        this.gui_palette_key = this.gui.add(this,'palette_key',keys);
        this.gui_palette_key.onChange((argument)=> {
            // this.palette_key = keys[keys.length*Math.random()|0];
            // this.palette = this.palettes[argument];
            this.palette = this.palettes[this.palette_key];
            this.draw_config.palette=this.palette,
            this.draw(this.draw_config);
        });
        this.gui_offset = this.gui.add({variable:1},'variable',0,100)
        // this.gui_offset = this.gui.add({variable:1},'variable',0,this.palette.length)
        this.gui_offset.name('color offset');
        this.gui_offset.step(1);
        this.gui_offset.onChange((argument)=>{
            this.draw_config.color_offset=argument;
            // console.log("argument : ",argument);
            var sid = this.draw_config.strategy_id;
            // console.log("sid : ",sid);
            this.draw(this.draw_config)
        })
        this.gui_perlin_offset = this.gui.add({variable:this.draw_config.perlin_offset},'variable',0,10)
        this.gui_perlin_offset.name('perlin offset');
        this.gui_perlin_offset.onChange((argument)=>{
            this.draw_config.perlin_offset=argument;
            // console.log("argument : ",argument);
            var sid = this.draw_config.strategy_id;
            // console.log("sid : ",sid);
            this.draw(this.draw_config)
        })
        this.gui_perlin_frequency = this.gui.add({variable:this.draw_config.perlin_period},'variable',1,400)
        this.gui_perlin_frequency.step(1);
        this.gui_perlin_frequency.name('perlin frequency');
        this.gui_perlin_frequency.onChange((argument)=>{
            this.draw_config.perlin_frequency=1/argument;
            this.draw(this.draw_config)
        })
        this.gui_perlin_depth = this.gui.add({variable:this.draw_config.perlin_depth},'variable',-1,1)
        this.gui_perlin_depth.step(0.01);
        this.gui_perlin_depth.name('perlin depth');
        this.gui_perlin_depth.onChange((argument)=>{
            this.draw_config.perlin_depth=argument;
            this.draw(this.draw_config)
        })
        this.gui.add({f:(x)=> {
            this.draw_config.noise_function = this.draw_config.noise_function==='perlin'?'simplex':'perlin';
            this.draw(this.draw_config)
        }},'f').name('perlin/simplex');
    }
    do_randomize_palette(){

        var keys = Object.keys(this.palettes)
        this.palette_key = keys[keys.length*Math.random()|0];
        this.palette = this.palettes[this.palette_key];
        if(this.gui_palette_key)this.gui_palette_key.updateDisplay();

        if(this.draw_config)this.draw_config.palette=this.palette;
    }
    do_randomize_strategy(){
        var strategies = this.strategies;
        console.log("this : ",this);
        return;
        // console.log("strategies : ",strategies);
        var keys = Object.keys(strategies);
        var random_strategy = keys[keys.length*Math.random()|0]
        // console.log("random_strategy : ",random_strategy);
        this.use_strategy(random_strategy);
    }

    use_strategy_A(){
        this.use_strategy("A");
    }
    use_strategy_B(){
        this.use_strategy("B");
    }
    use_strategy_C(){
        this.do_randomize_palette();
        this.use_strategy("C");
    }
    use_strategy_D(){
        this.do_randomize_palette();
        this.use_strategy("D");
    }
    use_strategy_E(){
        this.use_strategy("E");
    }
    use_strategy_F(){
        this.use_strategy("F");
    }
    use_strategy_G(){
        this.use_strategy("G");
    }
    use_strategy_H(){
        this.use_strategy("H");
    }
    /////////
    use_strategy(id){
        this.set_strategy(id);
        this.draw(this.draw_config);
    }
    draw(config){
        this.context = new DrawGrid(config);
        this.context.ContextInterface();
    }
    set_strategy(id){
        this.strategy_id = id;
        this.draw_config.strategy_id = this.strategy_id;
        if(this.gui_strategy_id)this.gui_strategy_id.updateDisplay()
    }
    draw_current(){
        this.draw(this.draw_config);
        
    }
}