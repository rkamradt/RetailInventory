"use strict";

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        jshint: { options: { node: true, strict: true, indent: 4 }, 
                  target: ['*.js','app/models/*.js','app/routes/*.js']
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    nodeArgs: ['-harmony'],
                    watchedFolders: ['.', 'app/models', 'all/routes'],
                    env: {
                        PORT: '5000'
                    }
                }
            }
        },
        simplemocha: {
            options: {
                globals: ['should'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },

            server: {
                src: ['test/*.js']
            }
        }
    });
    grunt.registerTask('test', ['jshint','simplemocha']);
    grunt.registerTask('default', ['jshint','nodemon']);
};