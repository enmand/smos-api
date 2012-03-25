/**
 * Resource tool to deploy and reload configuration when g
 */
var http 			= require('http'),
	Router 			= require('./router.js').Router.instance(),
	url 			= require('url'),
	exec 			= require('child_process').exec;

const KEYS = ['DEV_KEY'];
const PATH = "SMOS-PATH";

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

	Router.params = params;
	Router.emit(params.pathname[0], req, res, params);
}).listen(8080);

Router.on('development', function(req, res)
{
	if(this.params.pathname[1] == "update")
	{	
		exec('cat bootstrap.js', {'cwd': PATH}, function(code, out, err)
		{
			res.end(out);
		})
	}
	res.writeHead(200, {'Content-Type': 'text/plain'});
})