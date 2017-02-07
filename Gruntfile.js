module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: [ './*.js','./*.html','./*.css'],
      tasks: [],
      options:{livereload:true}
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

};