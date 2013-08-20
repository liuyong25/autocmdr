

var assert = require("assert");
var path = require('path');
var exec = require('child_process').exec;

var globalCmds = [ 'config', 'completion', 'add', 'edit', 'init', 'rm'  ];

describe('autocmdr API', function () {
	var program = require("../");

	it('should be an Commander instance', function () {

		assert(!!program.Command);

		assert(program instanceof program.Command);
	});

	it('should load plugins without errors', function() {
		require('../lib/logger.js')(program);
		require('../lib/package.js')(program, {  path: path.resolve(__dirname, '../package.json'), name: 'autocmdr' });
		require('../lib/help.js')(program);
		//require('../lib/eco.js')(program);
		require('../lib/config.js')(program, {  path: path.resolve(__dirname, '../.autocmdr') });
		require('../lib/completion.js')(program);

		assert(!!program.logger);
		assert(!!program.package);
		//assert(!!program.eco);
		assert(!!program.config);

		assert.equal(program.package.description, 'autocmdr');
	});

	it('should load global cmds without errors', function() {
		require('../lib/loader.js')(program, {  path: path.resolve(__dirname, '../cmds/'), name: 'autocmdr'  });

		//assert(!!program.loadCmds);
		//assert(!!program.eco);

		var cmds = program.commands.map(function(d) { return d._name });
		assert.deepEqual(cmds, globalCmds);

	});

	// TODO: run in test directory
	//it('should add local cmds', function() {
	//	program.parse(['','','add','XXXtest', '-E']);
	//});

	//it('should load local cmds', function() {
		//require('../lib/loader.js')(program, {  path: path.resolve(__dirname, '../cmds/') });
		//console.log(program.commands)
	//});

	//it('should rm local cmds', function() {
	//	program.parse(['','','rm','XXXtest']);
	//});

});

describe('autocmdr bin', function(){

	it('--help should run without errors', function(done) {
		exec('node ./bin/autocmdr --help', function (error, stdout, stderr) {
			assert(!error);
			done();
		});
	});

	it('--version should run without errors', function(done) {
		exec('node ./bin/autocmdr --version', function (error, stdout, stderr) {
			assert(!error);
			done();
		});
	});

	it('completion should run without errors', function(done) {
		exec('node ./bin/autocmdr completion', function (error, stdout, stderr) {
			assert(!error);
			done();
		});
	});

	it('config should run without errors', function(done) {
		exec('node ./bin/autocmdr config', function (error, stdout, stderr) {
			assert(!error);
			done();
		});
	});

});