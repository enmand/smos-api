var EventEmitter 	= require('events').EventEmitter,
	child_process	= require('child_process'),
	util 			= require('util');

/**
 * Our Router is a Singleton that emits events based on
 * paths that are passed into it. 
 * 
 * @return {Function} The Router
 */
exports.App = (function()
{
	var instance = null;

	function _App()
	{
		this.params 	= {};
		this.Request 	= null;
		this.Response 	= null;
		this.PATH 		= null;

		this.respond = function(resp, code, type)
		{
			var code = code || 200;
			var type = type || "text/plain";

			this.Response.writeHead(code, {"Content-Type": type});
			this.Response.end(resp);
		}

		this.run = function(command, callback, errcb)
		{
			child_process.exec(command, {"cwd": this.PATH}, function(code, out, err)
			{
				if(err)
				{
					errcb(err, code);
				} else
				{
					callback(out, code);
				}
			})
		}

		this.send = function(action)
		{
			if(this.listeners(action).length != 0)
			{
				this.emit(action)
			} else
			{
				this.respond("No action: /" + action + " in " + this.params.pathname[0], 404);
			}
		}

		this.action = function(action, callback)
		{
			this.on(action, callback);
		}
	}
	
	// We emit events from our single instance
	util.inherits(_App, EventEmitter);

	return new function()
	{
		this.instance = function()
		{
				if(instance == null)
				{
					instance = new _App();
				}

				return instance;
		}
	}
})();