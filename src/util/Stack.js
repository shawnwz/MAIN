/**
 * @method Stack
 * @constructor
 * @param (optional) [Array] - Array of elements to form the stack
 */
"use strict";

$util.Stack = function Stack(array) {
	this._array = array || [];
};

/**
 * @property uniqueValues
 * @public
 * @type {Boolean} uniqueValues
 */
Object.defineProperty($util.Stack.prototype, "uniqueValues", {
	get: function get() {
		return this._uniqueValues;
	},
	set: function set(uniqueValues) {
		this._uniqueValues = uniqueValues;
	}
});

/**
 * @property length
 * @public
 * @type {Number} length
 */
Object.defineProperty($util.Stack.prototype, "length", {
	get: function get() {
		return this._array.length || 0;
	}
});


$util.Stack.prototype.push = function push(element) {
	if (!this._uniqueValues || this._array.indexOf(element) === -1) {
		this._array.push(element);
	}
};

$util.Stack.prototype.pop = function pop() {
	return this._array.pop();
};

$util.Stack.prototype.peek = function peek() {
	return this._array[this._array.length - 1];
};

$util.Stack.prototype.isEmpty = function isEmpty() {
	return this._array.length === 0;
};

$util.Stack.prototype.clear = function clear() {
	this._array = [];
	return this._array;
};

$util.Stack.prototype.forEach = function forEach() {
	return Array.prototype.forEach.apply(this._array, arguments);
};

$util.Stack.prototype.some = function some() {
	return Array.prototype.some.apply(this._array, arguments);
};

$util.Stack.prototype.filter = function filter() {
	return Array.prototype.filter.apply(this._array, arguments);
};

$util.Stack.prototype.map = function map() {
	return Array.prototype.map.apply(this._array, arguments);
};
