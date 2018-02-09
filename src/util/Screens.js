/**
 * @class Menus
 */
"use strict";

$util.Screens = (function () {

	/* Public API */
	return {

		/**
		 * @method getScreen
		 * @param {Object} namespace
		 * @param {String} screen
		 * @return {Array}
		 */
		getScreen: function (namespace, screen) {
			return namespace[screen] || [];
		}
	};
}());
