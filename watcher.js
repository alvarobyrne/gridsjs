
var Watcher = require('watch-fs').Watcher;
 
var watcher = new Watcher({
    paths: [ '.','app.thml' ],
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
    new_win.close();
    location.reload();
});
 
watcher.on('delete', function(name) {
    console.log('file ' + name + ' deleted');
});
 
watcher.start(function(err, failed) {
    console.log('watcher started');
    console.log('files not found', failed);
});
