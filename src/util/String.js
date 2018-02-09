"use strict";
// eslint-disable-next-line no-extend-native
String.prototype.removeAt = function(n, m) {
	var result = this.split('');
	result.splice(n, m || 1);
	return result.join('');
};
// eslint-disable-next-line no-extend-native
String.prototype.insertAt = function(n, str) {
	return [this.slice(0, n), str, this.slice(n)].join('');
};
// eslint-disable-next-line no-extend-native
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
// eslint-disable-next-line no-extend-native
String.prototype.titleCase = function() {
	return this.toLowerCase().split(' ').map(function(word) {
		return word.replace(word[0], word[0].toUpperCase());
	}).join(' ');
};

if (!String.prototype.startsWith) {
	(function() {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			var object = {},
				$defineProperty = Object.defineProperty,
				result;
			try {
				result = $defineProperty(object, object, object) && $defineProperty;
			} catch (error) { } // eslint-disable-line
			return result;
		}()),
		toString = {}.toString,
		startsWith = function(search) {
			if (this === null) {
				// eslint-disable-next-line new-cap
				throw TypeError();
			}
			var string = String(this),
				stringLength,
				searchString,
				searchLength,
				position,
				pos, start, index;
			if (search && toString.call(search) === '[object RegExp]') {
				// eslint-disable-next-line new-cap
				throw TypeError();
			}
			stringLength = string.length;
			searchString = String(search);
			searchLength = searchString.length;
			position = arguments.length > 1 ? arguments[1] : undefined;
			// `ToInteger`
			pos = position ? Number(position) : 0;
			// eslint-disable-next-line no-self-compare
			if (pos !== pos) { // better `isNaN`
				pos = 0;
			}
			start = Math.min(Math.max(pos, 0), stringLength);
			// Avoid the `indexOf` call if no match is possible
			if (searchLength + start > stringLength) {
				return false;
			}
			index = -1;
			while (++index < searchLength) {
				if (string.charCodeAt(start + index) !== searchString.charCodeAt(index)) {
					return false;
				}
			}
			return true;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'startsWith', {
				'value'       : startsWith,
				'configurable': true,
				'writable'    : true
			});
		} else {
			// eslint-disable-next-line no-extend-native
			String.prototype.startsWith = startsWith;
		}
	}());
}
