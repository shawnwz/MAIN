/**
 * @class ControlEvents
 */
$util.ControlEvents = (function () {
	"use strict";

	var _eventMap = {},
		_logCss = 'background: black; color: white;',
		_errorCss = 'background: black; color: yellow;';

	function _add(control, eventName, callback, ctx) {

		if (typeof callback !== "function") {
			console.trace("%c callback for control event is not a function", _errorCss, control, eventName, callback);
		}

		if (!_eventMap[control]) {
			_eventMap[control] = {
				enabled  : true,
				debug    : false,
				dbgcolor : "",
				callbacks: {}
			};
		}
		if (!_eventMap[control].callbacks[eventName]) {
			_eventMap[control].callbacks[eventName] = [];
		}

		_eventMap[control].callbacks[eventName].push({
			callback: callback,
			context : ctx
		});
	}

	function _remove(control, eventName, ctx) {
		if (_eventMap[control] && _eventMap[control].callbacks[eventName]) {
			var callbacks = _eventMap[control].callbacks[eventName],
				i;
			for (i = 0; i < callbacks.length; i++) {
				if (callbacks[i].context === ctx) {
					callbacks.splice(i, 1);
					--i;
				}
			}
		}
	}

	return {

		/**
		 * Bind a callback to an event and an optional context
		 * @method on
		 * @public
		 * @param {String} control
		 * @param {String} eventName
		 * @param {Function} callback
		 * @param {Object} [context] reference to the calling context
		 */
		on: function (control, eventName, callback, context) {
			var ctx = context || this,
				i;

			if (!callback) {
				console.trace("%c no callback for ", _logCss, control);
			}
			if (!eventName) {
				console.trace("%c no eventName for ", _logCss, control);
			}

			if (typeof control === "string") { // register one
				_add(control, eventName, callback, ctx);
			} else if (typeof control === "object") {
				for (i in control) { // register many
					if (control.hasOwnProperty(i)) {
						_add(control[i], eventName, callback, ctx);
					}
				}
			}
		},

		/**
		 * Call all callbacks bound to an event
		 * @method fire
		 * @public
		 * @param {String} control
		 * @param {String} eventName
		 * @param {...Mixed} [arguments] zero or more optional arguments
		 */
		fire: function (control, eventName) {
			var args = [].slice.call(arguments, 2);

			if (!_eventMap[control]) {
				console.trace("%c no events for control", _logCss, control, eventName);
			} else if (eventName === "enable" || eventName === "disable") { // enable/disable events for this control
				_eventMap[control].enabled = (eventName === "enable");
			} else if (eventName === "debug") { // switch debug on or off
				_eventMap[control].debug = (args[0] === true);
				_eventMap[control].dbgcolor = args[1] || "background: red; color: white;";
			} else if (eventName === "detached") { // remove all handlers for this control regardless of context
				console.log("%c control detached", _logCss, control);
				delete _eventMap[control];
			} else if (!_eventMap[control].enabled) { // control is disabled
				console.log("%c control disabled", _logCss, control);
			} else {
				if (_eventMap[control].debug === true) {
					console.trace("%c fire:", _eventMap[control].dbgcolor, [].slice.call(arguments, 0), _eventMap[control].callbacks[eventName]);
				}
				if (_eventMap[control].callbacks[eventName]) { // fire events
					_eventMap[control].callbacks[eventName].forEach(function (eventHandler) {
						if (eventHandler.callback) {
							eventHandler.callback.apply(eventHandler.context, args);
						} else {
							console.trace("%c empty callback for control event", _errorCss, control, eventName);
						}
					});
				}
				if (_eventMap[control].callbacks["*"]) { // also call all wildcard handlers
					args.unshift(eventName); // add eventName
					_eventMap[control].callbacks["*"].forEach(function (eventHandler) {
						if (eventHandler.callback) {
							eventHandler.callback.apply(eventHandler.context, args);
						}
					});
				}
			}
		},

		/**
		 * remove callbacks for given context
		 * @method remove
		 * @public
		 * @param {String} control
		 * @param {String} eventName
		 */
		remove: function (control, eventName, context) {
			if (_eventMap[control] && (!eventName || _eventMap[control].callbacks[eventName])) {
				if (eventName) { // unregister one for this control and context
					_remove(control, eventName, context);
				} else {
					//eslint-disable-next-line no-param-reassign
					for (eventName in _eventMap[control]) { // unregister all for this control and context
						if (_eventMap[control].hasOwnProperty(eventName)) {
							_remove(control, eventName, context);
						}
					}
				}
			}
		}
	};
}());
