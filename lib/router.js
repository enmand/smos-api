var EventEmitter 	= require('events').EventEmitter,
	util 			= require('util');

/**
 * Our Router is a Singleton that emits events based on
 * paths that are passed into it. 
 * 
 * @return {Function} The Router
 */
exports.Router = (function()
{
	var instance = null;

	function _Router()
	{
		this.params = {};
	}
	
	// We emit events from our single instance
	util.inherits(_Router, EventEmitter);

	return new function()
	{
		this.instance = function()
		{
				if(instance == null)
				{
					instance = new _Router();
				}
				return instance;
		}
	}
})();