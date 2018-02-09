/**
 * Originally based on: https://github.com/DungBeetleBASH/e
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 DungBeetleBASH
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @class Events
 */
$util.Events = (function () {
	"use strict";
	var eventMap = {};

	/**
	 * @method isDuplicate
	 * @private
	 * @param {String} eventName
	 * @param {Function} callback
	 * @param {Object} context reference to the calling context
	 */
	function isDuplicate(eventName, callback, context) {
		var isExisting = false,
			isHandlerDuplicated = function (eventHandler) {
				if (eventHandler.callback === callback && eventHandler.context === context) {
					isExisting = true;
					return true;
				}
			};

		if (!eventMap[eventName] || !eventMap[eventName].length) {
			return false;
		}

		eventMap[eventName].some(isHandlerDuplicated);

		if (isExisting) {
			return true;
		}

		return false;
	}

	/**
	 * @method fireCallbacks
	 * @private
	 * @param {String} eventName
	 * @param {Object} args
	 */
	function fireCallbacks(eventName, args) {
		eventMap[eventName].forEach(function (eventHandler) {
			if (eventHandler.callback) {
				eventHandler.callback.apply(eventHandler.context, args);
			} else {
				console.warn("no callback function for " + eventName);
			}
		});
	}

	/**
	 * Remove all event handlers from an event
	 * by removing the event from the eventMap.
	 * @method removeAllForEvent
	 * @private
	 * @param {String} eventName
	 */
	function removeAllForEvent(eventName) {
		if (eventMap[eventName]) {
			delete eventMap[eventName];
		}
	}

	/**
	 * Removes all events and event handlers from the eventMap.
	 * @method removeAll
	 * @private
	 */
	function removeAll() {
		eventMap = {};
	}

	/**
	 * @method removeOnceCallbacks
	 * @private
	 * @param {String} eventName
	 */
	function removeOnceCallbacks(eventName) {
		if (!eventMap[eventName]) {
			return;
		}

		eventMap[eventName] = eventMap[eventName].filter(function (eventHandler) {
			return (!eventHandler.once);
		});

		if (!eventMap[eventName].length) {
			removeAllForEvent(eventName);
		}
	}

	/**
	 * @method removeCallback
	 * @private
	 * @param {String} eventName
	 * @param {Function} callback
	 * @param {Object} ctx reference to the calling context
	 */
	function removeCallback(eventName, callback, ctx) {
		eventMap[eventName] = eventMap[eventName].filter(function (eventHandler) {
			return !(eventHandler.context === ctx && eventHandler.callback === callback);
		});

		if (!eventMap[eventName].length) {
			removeAllForEvent(eventName);
		}
	}

	return {

		/**
		 * Bind a callback to an event and an optional context
		 * @method on
		 * @public
		 * @param {String} eventName
		 * @param {Function} callback
		 * @param {Object} [context] reference to the calling context
		 * @param {Boolean} [once] If true, the callback will be removed once fired
		 */
		on: function (eventName, callback, context, once) {
			var ctx = context || this;
			if (isDuplicate(eventName, callback, ctx)) {
				return;
			}
			if (!callback) {
				console.warn("no callback for " + eventName);
			}
			eventMap[eventName] = eventMap[eventName] || [];
			eventMap[eventName].push({ callback: callback, context: ctx, once: once });
		},

		/**
		 * Bind a callback to an event and fire it only once
		 * @method once
		 * @public
		 * @param {String} eventName
		 * @param {Function} callback
		 * @param {Object} [context] reference to the calling context
		 */
		once: function (eventName, callback, context) {
			var ctx = context || this;
			this.on(eventName, callback, ctx, true);
		},

		/**
		 * Call all callbacks bound to an event
		 * @method fire
		 * @public
		 * @param {String} eventName
		 * @param {...Mixed} [arguments] zero or more optional arguments
		 */
		fire: function (eventName) {
			var args = [].slice.call(arguments, 1);
			if (!eventMap[eventName]) {
				console.warn("no event handler for " + eventName);
				return;
			}
			fireCallbacks(eventName, args);
			removeOnceCallbacks(eventName);
		},

		/**
		 * Call an array of events
		 * @method fireAll
		 * @public
		 * @param {Array} events
		 */
		fireAll: function (events) {
			events.forEach(function (event) {
				this.fire(event.name, event.data);
			}, this);
		},

		/**
		 * Remove one or more event handlers
		 * If no eventName is passed, remove all events and event handlers.
		 * If an eventName but no event handlers is passed, remove all event handlers for that event and remove the event.
		 * If an eventName and event handlers are passed, remove event handlers with matching eventName and context.
		 * @method remove
		 * @public
		 * @param {String} [eventName]
		 * @param {Function} [callback]
		 * @param {Object} [context] reference to the calling context
		 */
		remove: function (eventName, callback, context) {
			var ctx = context || this;

			if (!eventName) {
				removeAll();
				return;
			}

			if (!eventMap[eventName]) {
				return;
			}

			if (!callback) {
				removeAllForEvent(eventName);
				return;
			}

			removeCallback(eventName, callback, ctx);
		},

		/**
		 * Given an eventName, returns all event handlers associated with that event.
		 * With no event name passed, returns the whole event map.
		 * @method getEvents
		 * @public
		 * @param {String} [eventName]
		 * @return {Object|Array}
		 */
		getEvents: function (eventName) {
			if (eventName) {
				return eventMap[eventName] || [];
			}
			return eventMap;
		}
	};
}());
