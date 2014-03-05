module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        execute: {
            target: {
                src: ['build.js']
            }
        },
        watch: {
            files: [
                'Gruntfile.js',
                'lib/swagger.js',
                'src/main/javascript/doc.js',
                'src/main/html/index.html',
                'src/main/less/*.less',
                'src/main/templates/*.handlebars'
            ],
            tasks: ['execute']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-execute');

    // Default task(s) can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['execute']);
};