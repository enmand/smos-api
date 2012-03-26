var App = require('../lib/app.js').App.instance(),
	exec 			= require('child_process').exec;

exports.Send = (function()
{
	App.action('update', function()
	{
		App.run('git pull', function(out)
		{
			App.respond(out);
		}, function(err)
		{
			App.respond(err);
		});
	});
})();