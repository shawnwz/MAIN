/**
 * @class o5.log
 * @singleton
 * @author lmayle
 */

o5.log = new (function Log ()
{
}) ();

o5.log.enabled = true;

o5.log.enable = function enable ()
{
};

o5.log.setAll = function setAll (targetClass, enabled)
{
	this.setBase		(targetClass, enabled);
	this.setDebug		(targetClass, enabled);
	this.setDeprecated	(targetClass, enabled);
	this.setEntry		(targetClass, enabled);
	this.setError		(targetClass, enabled);
	this.setExit		(targetClass, enabled);
	this.setInfo		(targetClass, enabled);
	this.setWarning		(targetClass, enabled);
};

o5.log.setBase 			= function setBase 			(targetClass, enabled) { this._setGiven(targetClass, enabled, 'log'); 			};

o5.log.setDebug 		= function setDebug 		(targetClass, enabled) { this._setGiven(targetClass, enabled, 'logDebug'); 		};

o5.log.setDeprecated 	= function setDeprecated 	(targetClass, enabled) { this._setGiven(targetClass, enabled, 'logDeprecated'); };

o5.log.setEntry 		= function setEntry 		(targetClass, enabled) { this._setGiven(targetClass, enabled, 'logEntry'); 		};

o5.log.setError 		= function setError 		(targetClass, enabled) { this._setGiven(targetClass, enabled, 'logError'); 		};

o5.log.setExit 			= function setExit 			(targetClass, enabled) { this._setGiven(targetClass, enabled, 'logExit'); 		};

o5.log.setInfo 			= function setInfo			(targetClass, enabled) { this._setGiven(targetClass, enabled, 'logInfo'); 		};

o5.log.setWarning 		= function setWarning		(targetClass, enabled) { this._setGiven(targetClass, enabled, 'logWarning'); 	};

o5.log._setGiven = function _setGiven (targetClass, enabled, name/*, method*/)
{
	if (o5.log.enabled && enabled)
	{
		// only use the binding method with NW, otvwebkit doesn't support this method properly
		if (typeof webkitGetObjectFromPlugin === "function" || window.nwDispatcher || window.nw)
		{
			
			Object.defineProperty(targetClass, name, {
				get: function() {
					
					return o5.log['_' + name + 'EnabledBind'].call(this);
					
				}, enumerable: false, configurable: true });
			
			
			if(targetClass.prototype)
			Object.defineProperty(targetClass.prototype, name, {
				get: function() {
					
					return o5.log['_' + name + 'EnabledBind'].call(this);
					
				}, enumerable: false, configurable: true });
		}
		else
		{
			Object.defineProperty(targetClass.prototype ? targetClass.prototype : targetClass, name,
				{ value: o5.log['_' + name + 'Enabled'], writable: true, enumerable: false, configurable: true });
		}
	}
	else
	{
		// needs improvements, setting _logDisabled is only needed if someone up in the prototype chain is enabled, otherwise just remove property here
		Object.defineProperty(targetClass.prototype ? targetClass.prototype : targetClass, name,
				{ value: o5.log._logDisabled, writable: true, enumerable: false, configurable: true });
	}
};

o5.log._log1 = function _log1 (output, obj, func, args, prefix)
{
	if (obj !== window)
	{
		var fn = func ? func.name : null;
		var fo = o5.$.getHomeObject(func, obj);

		if (!fn)
		{
			fn = func && func.__homeObjectKey__ ? func.__homeObjectKey__ : 'unnamed';
		}

		if (fo && fo.name)
		{
			args.unshift(fo.name + '.' + fn + ':');
		}
		else
		{
			args.unshift(fn + ':');
		}

		if (prefix)
		{
			args.unshift(prefix);
		}
	}
	
	//eslint-disable-next-line no-console
	console[output](args.join(' '));
};

o5.log._log1Bind = function _log1Bind (output, obj, func, args, prefix)
{
	if (obj !== window && func)
	{
		var fn = func ? func.name : null;
		var fo = o5.$.getHomeObject(func, obj);

		if (!fn)
		{
			fn = func && func.__homeObjectKey__ ? func.__homeObjectKey__ : 'unnamed';
		}

		if (fo && fo.name)
		{
			args.unshift(fo.name + '.' + fn + ':');
		}
		else
		{
			args.unshift(fn + ':');
		}

		if (prefix)
		{
			args.unshift(prefix);
		}
	}
	
	//eslint-disable-next-line no-console
	return console[output].bind(console, args.join(' '));
};


//Base log stubs
o5.log._logDisabled = function _logDisabled () { };

o5.log._logEnabled = function _logEnabled ()
{
	var caller = null;
	
	try { //temporary workaround due to an issue in WK2
		caller = arguments.callee.caller;
	} catch(e){}
	
	//eslint-disable-next-line no-caller
	o5.log._log1('log', this, caller, Array.prototype.slice.call(arguments));
};

o5.log._logEnabledBind = function _logEnabledBind ()
{
	var caller = null;
	
	try { //temporary workaround due to an issue in WK2
		caller = arguments.callee.caller.caller;
	} catch(e){}
	
	//eslint-disable-next-line no-caller
	return o5.log._log1Bind('log', this, caller, Array.prototype.slice.call(arguments));
};

o5.log._logUnknown = function _logUnknown () { };



//Debug log stubs
o5.log._logDebugEnabled = function _logDebugEnabled ()
{
	//eslint-disable-next-line no-caller
	o5.log._log1('log', this, arguments.callee.caller, Array.prototype.slice.call(arguments), '[DEBUG]');
};

o5.log._logDebugEnabledBind = function _logDebugEnabledBind ()
{
	var caller = null;
	
	try { //temporary workaround due to an issue in WK2
		caller = arguments.callee.caller.caller;
	} catch(e){}
	
	//eslint-disable-next-line no-caller
	return o5.log._log1Bind('log', this, caller, Array.prototype.slice.call(arguments), '[DEBUG]');
};

o5.log._logDebugUnknown = function _logDebugUnknown () { };



//Deprecated log stubs
o5.log._logDeprecatedEnabled = function _logDeprecatedEnabled ()
{
	//eslint-disable-next-line no-caller
	o5.log._log1('warn', this, arguments.callee.caller, ['This API has been deprecated!'], '[WARNING]');
};

o5.log._logDeprecatedEnabledBind = function _logDeprecatedEnabledBind ()
{
	var caller = null;
	
	try { //temporary workaround due to an issue in WK2
		caller = arguments.callee.caller.caller;
	} catch(e){}
	
	//eslint-disable-next-line no-caller
	return o5.log._log1Bind('warn', this, caller, ['This API has been deprecated!'], '[WARNING]');
};

o5.log._logDeprecatedUnknown = function _logDeprecatedUnknown () { };

//Entry log stubs
o5.log._logEntryEnabled = function _logEntryEnabled ()
{
	//eslint-disable-next-line no-caller
	var f = arguments.callee.caller;
	var fo = o5.$.getHomeObject(f, this);
	var fn = f.name ? f.name : f.__homeObjectKey__;
	var fon = fo ? fo.name : 'unnamed';

	var argc = f.arguments.length;
	var args = '';

	if (argc > 0)
	{
		for (var a = 0; a < argc; a++)
		{
			var arg = f.arguments[a];

		    switch (typeof (arg))
		    {
			case 'function':
				//checking for call property before getting name because CCOM objects incorrectly reports themselves as functions
				//and accessing name property on CCOM Objects usually throws an exception for some reason, but call returns undefined
				args += '{function ' + (arg.call ? arg.name : '') + '}';
				break;

			default:
				args += arg;
				break;
			}

			if (a < argc - 1)
			{
				args += ', ';
			}
		}
	}

	if (arguments.length > 0)
	{
		//eslint-disable-next-line no-console
		console.log(fon + '.' + fn + '>>> ' + args + '\n' + Array.prototype.slice.call(arguments).join(' '));
	}
	else
	{
		//eslint-disable-next-line no-console
		console.log(fon + '.' + fn + '>>> ' + args);
	}
};

o5.log._logEntryEnabledBind = function _logEntryEnabledBind ()
{
	var caller = null;
	
	try { //temporary workaround due to an issue in WK2
		caller = arguments.callee.caller.caller;
	} catch(e){}
	
	//eslint-disable-next-line no-caller
	var f = caller;
	var fo = o5.$.getHomeObject(f, this);
	var fn = f ? (f.name ? f.name : f.__homeObjectKey__) : 'unknown';
	var fon = fo ? fo.name : 'unnamed';
	
	if(this instanceof HTMLElement && this.id)
	{
		fon = '[' + this.localName + '#' + this.id + ']' + fon;
	}
	
	var argc = 0;
	try { //temporary workaround due to an issue in WK2
		argc = f ? f.arguments.length : 0;
	} catch(e){ }
	var args = '';

	if (argc > 0)
	{
		for (var a = 0; a < argc; a++)
		{
			var arg = f.arguments[a];

		    switch (typeof (arg))
		    {
			case 'function':
				//checking for call property before getting name because CCOM objects incorrectly reports themselves as functions
				//and accessing name property on CCOM Objects usually throws an exception for some reason, but call returns undefined
				args += '{function ' + (arg.call ? arg.name : '') + '}';
				break;

			default:
				args += arg;
				break;
			}

			if (a < argc - 1)
			{
				args += ', ';
			}
		}
	}

	if (arguments.length > 0)
	{
		//eslint-disable-next-line no-console
		return console.log.bind(console, fon + '.' + fn + '>>> ' + args + '\n' + Array.prototype.slice.call(arguments).join(' '));
	}
	else
	{
		//eslint-disable-next-line no-console
		return console.log.bind(console, fon + '.' + fn + '>>> ' + args);
	}
};

o5.log._logEntryUnknown = function _logEntryUnknown () { };

//Error log stubs
o5.log._logErrorEnabled = function _logErrorEnabled ()
{
	//eslint-disable-next-line no-caller
	o5.log._log1('error', this, arguments.callee.caller, Array.prototype.slice.call(arguments), '[ERROR]');
};

o5.log._logErrorEnabledBind = function _logErrorEnabledBind ()
{
	var caller = null;
	
	try { //temporary workaround due to an issue in WK2
		caller = arguments.callee.caller.caller;
	} catch(e){}
	
	//eslint-disable-next-line no-caller
	return o5.log._log1Bind('error', this, caller, Array.prototype.slice.call(arguments), '[ERROR]');
};

o5.log._logErrorUnknown = function _logErrorUnknown () { };



//Exit log stubs
o5.log._logExitEnabled = function _logExitEnabled ()
{
	//eslint-disable-next-line no-caller
	var f = arguments.callee.caller;
	var fo = o5.$.getHomeObject(f, this);
	var fn = f.name ? f.name : f.__homeObjectKey__;
	var fon = fo ? fo.name : 'unnamed';

	//eslint-disable-next-line no-console
	console.log(fon + '.' + fn + '<<< ' + Array.prototype.slice.call(arguments).join(' '));
};

o5.log._logExitEnabledBind = function _logExitEnabledBind ()
{
	var caller = null;
	
	try { //temporary workaround due to an issue in WK2
		caller = arguments.callee.caller.caller;
	} catch(e){}
	
	//eslint-disable-next-line no-caller
	var f = caller;
	var fo = o5.$.getHomeObject(f, this);
	var fn = f.name ? f.name : f.__homeObjectKey__;
	var fon = fo ? fo.name : 'unnamed';

	//eslint-disable-next-line no-console
	return console.log.bind(console, fon + '.' + fn + '<<< ' + Array.prototype.slice.call(arguments).join(' '));
};

o5.log._logExitUnknown = function _logExitUnknown () { };



//Info log stubs
o5.log._logInfoEnabled = function _logInfoEnabled ()
{
	//eslint-disable-next-line no-caller
	o5.log._log1('info', this, arguments.callee.caller, Array.prototype.slice.call(arguments), '[INFO]');
};

o5.log._logInfoEnabledBind = function _logInfoEnabledBind ()
{
	var caller = null;
	
	try { //temporary workaround due to an issue in WK2
		caller = arguments.callee.caller.caller;
	} catch(e){}
	
	//eslint-disable-next-line no-caller
	return o5.log._log1Bind('info', this, caller, Array.prototype.slice.call(arguments), '[INFO]');
};

o5.log._logInfoUnknown = function _logInfoUnknown () { };



//Warning log stubs
o5.log._logWarningEnabled = function _logWarningEnabled ()
{
	//eslint-disable-next-line no-caller
	o5.log._log1('warn', this, arguments.callee.caller, Array.prototype.slice.call(arguments), '[WARNING]');
};

o5.log._logWarningEnabledBind = function _logWarningEnabledBind ()
{
	var caller = null;
	
	try { //temporary workaround due to an issue in WK2
		caller = arguments.callee.caller.caller;
	} catch(e){}
	
	//eslint-disable-next-line no-caller
	return o5.log._log1Bind('warn', this, caller, Array.prototype.slice.call(arguments), '[WARNING]');
};

o5.log._logWarningUnknown = function _logWarningUnknown () { };



/**
 * @class Object
 */

/**
 * @method log
 * Base logging function, will print with the name of caller function if available
 *
 * @param {...String} [text] One of more strings to be printed.
 */

/**
 * @method logDebug
 * Base logging function for debug, will print with the name of caller function if available
 *
 * @param {...String} [text] One of more strings to be printed.
 */

/**
 * @method logEntry
 * Log for function entry, will print list of arguments if available
 *
 * @param {...String} [text] One of more strings to be printed in addition to the function entry information.
 */

/**
 * @method logError
 * Base logging function for errors, will print with the name of caller function if available
 *
 * @param {...String} [text] One of more strings to be printed.
 */

/**
 * @method logExit
 * Log for function exit
 *
 * @param {...String} [text] One of more strings to be printed in addition to the function exit information.
 */

/**
 * @method logInfo
 * Base logging function for general information, will print with the name of caller function if available
 *
 * @param {...String} [text] One of more strings to be printed.
 */

/**
 * @method logWarning
 * Base logging function for warning, will print with the name of caller function if available
 *
 * @param {...String} [text] One of more strings to be printed.
 */


o5.log.setBase			(Object, true);
o5.log.setDebug			(Object, false);
o5.log.setDeprecated	(Object, true);
o5.log.setEntry			(Object, false);
o5.log.setError			(Object, true);
o5.log.setExit			(Object, false);
o5.log.setInfo			(Object, false);
o5.log.setWarning		(Object, true);

