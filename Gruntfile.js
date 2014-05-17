"use strict";

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        jshint: { options: { node: true }, target: ['*.js']},
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    nodeArgs: ['-harmony'],
                    watchedFolders: ['./'],
                    env: {
                        PORT: '5000'
                    }
                }
            }
        },
    });
    grunt.registerTask('default', ['jshint','nodemon']);
};