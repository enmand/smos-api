/**
 * Resource tool to deploy and reload configuration when g
 */
var http 			= require('http'),
	App 			= require('./lib/app.js').App.instance(),
	fs 				= require('fs')
	url 			= require('url');

const KEYS = ['DEV_KEY'];

(function(){
	process.chdir(__dirname);
})();

http.createServer(function(req, res)
{
	var params = url.parse(req.url, true);

	if(!params.query.hasOwnProperty('key') || KEYS.indexOf(params.query.key) == -1)
	{
		res.writeHead(401, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify({
			"error": res.statusCode,
			"msg": "An error occured",
		}));
	}
	params.pathname = params.pathname.slice(1).split('/');

	App.params 		= params;
	App.Response 	= res;
	App.Request 	= req;
	App.PATH 		= __dirname;

	var controller_name = './controller/' + params.pathname[0] + '.js';
	fs.stat(controller_name, function(err)
	{
		if(err)
		{
			App.respond('Not found: /' + params.pathname.join('/'), 404);
		} else
		{
			var controller = require(controller_name);

			var action = params.pathname.slice(1).join('/');
			App.send(action);
		}
	});
}).listen(8080);