module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		mochaTest: {
			options: {
				timeout: 3000,
				ignoreLeaks: false,
				reporter: 'spec'
			},
			src: ['test/**/*_test.js']
		},
		jshint: {
			options: {
				jshintrc: true
			},
			src: ['lib/**/*.js', 'test/**/*.js']
		},
		clean: {
			src: ['tmp']
		},
		mocha_istanbul: {
			coverage: {
				src: 'test',
				options: {
					mask: '**/*_test.js',
					reportFormats: ['html'],
					reporter: 'min'
				}
			}
		}
	});

	// Load grunt plugins for modules
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-istanbul');

	grunt.registerTask('coverage', ['mocha_istanbul', 'clean']);
	grunt.registerTask('test', ['mochaTest']);
	grunt.registerTask('default', ['jshint', 'mochaTest', 'clean']);

};
