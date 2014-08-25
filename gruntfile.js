'use strict';

module.exports = function(grunt) {

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: {
                src: [ 'gruntfile.js', 'cloud/*.js', 'cloud/controllers/*.js', 'cloud/custom/*.js', 'cloud/dal/*.js' ],
                options: {
                    jshintrc: true
                }
            }
        },

        mochaTest: {
            options: {
                reporter: 'spec',
                bail: true
            },
            unit: [ 'test/mocha/unit/**/*.js' ]
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        shell: {
            coverage: {
                command: 'istanbul cover node_modules/mocha/bin/_mocha test/mocha/unit/**/*.js',
                options: {
                    stdout: true
                }
            },
            cov_report: {
                command: 'open coverage/lcov-report/index.html',
                options: {
                    stdout: true
                }
            }
        }
    });

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    grunt.registerTask('default', [ 'jshint' ]);

    // Test task.
    grunt.registerTask('test-unit', [ 'jshint', 'env:test', 'mochaTest:unit' ]);

    // Coverage task
    grunt.registerTask('cov', [ 'jshint', 'env:test', 'shell:coverage' ]);

};