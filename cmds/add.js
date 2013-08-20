/**
 * This is a autocmdr command/plugin file
 *
 * It exports a single initialization function. 
 *
 */


// TODO: Clean this up!!

module.exports = function (program) {
	var editor = require('editor');
	var path = 	require('path');
	var fs = require('fs');
	var prompt = require('prompt');

	program
		.command('add [cmdfile]')
		.usage('[cmdfile]')
		.option('-E, --no-editor', "don\'t open new command file in editor")
		.option('-P, --no-prompt', "don\'t prompt for additional input")
		.option('--desc [description]', "description")
		.description('Create a autocmdr command file.')
		.action(function(name, opts){
			opts = opts || {};
			opts.name = name || 'cmdfile';
			opts.name = opts.name.replace('.js', '');
			opts.template = opts.template || path.join(__dirname, '../template/');
			opts.output = opts.output || process.cwd();

			var ctx = {
		      name: opts.name,
			  description: opts.desc || ' ',
		      version: '0.0.0',
		      yesno: 'no'
		    };

			var properties = {
		      name: {
			        pattern: /^[a-zA-Z0-9\s\-]+$/,
			        message: 'Name must be only letters, numbers, spaces, or dashes',
			        default: ctx.name,
			        required: true
			      },
			  description: { default: ctx.description },
		      version: { default: ctx.version }  // TODO: validate
		    };

		    if (!opts.prompt)
		    	prompt.override = ctx;

		    prompt.start();

		    prompt.get({ properties: properties }, function (err, ctx) {
		    	if (err && err.message == 'canceled') {
					console.log('\n');
	            	program.logger.warn('Command initialization skipped');
	            	return;
		    	}

		    	ctx.name = ctx.name.replace('.js', '');
		    	ctx.file = 'cmds/'+ctx.name+'.js';

				var src = path.join(opts.template, '/cmds/cmdrfile.js.eco');
				var dst = path.join(opts.output, ctx.file);

				fs.exists(dst, function (exists) {

					if (exists) {  
						program.logger.warn('Command',ctx.name.green,'already exists at',dst.blue);

						var yesno = { name: 'yesno',
									  message: 'Overwrite?',
									  validator: /y[es]*|n[o]?/,
									  warning: 'Must respond yes or no',
									  default: 'no'
									};

						prompt.get( yesno , function (err, val) {  // TODO: Prompt to overwrite
							if (val.yesno == "yes" || val.yesno == "y") {
								_write()
							} else {
								program.logger.warn('Command initialization skipped');
							}
						});

					} else {
						_write();
					}

					function _write() {
						program.logger.info('Initializing command',ctx.name.green,'at',dst.blue);
						program.eco(src, dst, ctx);
						_edit();
					}

					function _edit() {
						if (opts.editor) {
							program.logger.info('Opening',ctx.name.green,'in editor');

							//if (opts.editor === true && program.config.get('editor')) {
							//	_opts = { editor: program.config.get('editor') };
							//} else {
							//	_opts = {};
							//}

							editor(dst, function (code, sig) {  // TODO: Catch error
								//console.log(code, sig);
							    //console.log('finished editing with code ' + code);
							});
						}							
					}
						
				});

		    });

		});

};