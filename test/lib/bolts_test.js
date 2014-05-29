var _ = require('lodash'),
	constants = require('../../lib/constants'),
	fs = require('fs'),
	logger = require('../../lib/logger'),
	path = require('path'),
	should = require('should'),
	wrench = require('wrench');

// the test environment constants
var TMP = path.resolve('tmp'),
	HOME = path.join(TMP, 'home'),
	CONFIG = path.join(HOME, constants.CONFIG),
	FOO = path.resolve('foo'),
	SRC = path.resolve('src'),
	FIXTURES = path.resolve('test','fixtures');

// prep test environment
constants.HOME = HOME;
logger.quiet = true;

// make sure to load bolts _after_ setting HOME
var bolts = require('../..');

// test suite
describe('bolts.js', function() {

	beforeEach(function() {
		logger.quiet = true;
		wrench.mkdirSyncRecursive(HOME, 0755);
	});

	it('exports a function', function() {
		should.exist(bolts);
		bolts.should.be.a.Function;
	});

	it.skip('returns error when no opts and no config', function(done) {
		// need to stub stdin for prompt
		bolts(function(err) {
			should.exist(err);
			err.should.match(/missing/);
			done();
		});
	});

	it('returns error when no project and no config', function(done) {
		bolts({ prompt: false }, function(err) {
			should.exist(err);
			err.should.match(/missing/);
			done();
		});
	});

	it('executes using explicit config file', function(done) {
		var opts = {
			prompt: false,
			config: path.join(FIXTURES, constants.CONFIG)
		};
		var config = require(opts.config);

		bolts(opts, function(err) {
			should.not.exist(err);

			// get expected source file listing and update JS file names
			var srcFiles = wrench.readdirSyncRecursive(SRC);
			srcFiles = _.map(srcFiles, function(file) {
				var basename = path.basename(file);
				if (_.contains(['module.js','module_test.js'], basename)) {
					return path.join(path.dirname(file), basename.replace('module', 'foo'));
				}
				return file;
			});

			// make sure we have all expected files, and validate where possible
			var actualFiles = wrench.readdirSyncRecursive(FOO);
			srcFiles.forEach(function(file) {
				actualFiles.should.containEql(file);

				if (file === 'package.json') {
					var json = require(path.join(FOO, 'package.json'));
					json.name.should.equal(config.project);
					json.description.should.equal(config.description);
					json.author.name.should.equal(config.name);
					json.author.email.should.equal(config.email);
					json.repository.url.should.equal(
						'git://github.com/' + config.github + '/' + config.project + '.git');
				}
			});

			done();
		});
	});

	afterEach(function() {
		wrench.rmdirSyncRecursive(TMP, true);
		wrench.rmdirSyncRecursive(FOO, true);
	});

});


