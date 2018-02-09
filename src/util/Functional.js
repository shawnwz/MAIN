/**
 * https://github.com/DungBeetleBASH/fn
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
 * @class Functional
 */
$util.Functional = (function () {
	"use strict";

	var slice = [].slice;

	/**
	 * Get's the previous index looping around to the end when at the beginning
	 *
	 * @method previousIndex
	 * @param {Array} arr
	 * @param {Number} index
	 * @return {Number} index
	 */
	function previousIndex(arr, index) {
		return (index + arr.length - 1) % arr.length;
	}

	/**
	 * Get's the next index looping around to the beginning when at the end
	 *
	 * @method previousIndex
	 * @param {Array} arr
	 * @param {Number} index
	 * @return {Number} index
	 */
	function nextIndex(arr, index) {
		return (index + 1) % arr.length;
	}

	return {

		/**
		 * Performs right to left function composition
		 * @method compose
		 * @param {...Function} arguments
		 * @return {Function}
		 */
		compose: function () {
			return this.pipe.apply(null, slice.call(arguments).reverse());
		},

		/**
		 * Create a curried function
		 * @method curry
		 * @param {Function} func
		 * @return {Function}
		 */
		curry: function (func) {
			return function curried() {
				var args = slice.call(arguments);
				if (args.length < func.length) {
					return function () {
						return curried.apply(null, args.concat(slice.call(arguments)));
					};
				}
				return func.apply(null, args);
			};
		},

		/**
		 * Returns a function for performing a forking/convergence operation
		 * @method fork
		 * @param {Function} lastly
		 * @param {Function} func1
		 * @param {Function} func2
		 * @return {Function}
		 */
		fork: function (lastly, func1, func2) {
			return this.partial(function (lastly, func1, func2, val) { // eslint-disable-line
				return lastly(func1(val), func2(val));
			})(lastly, func1, func2);
		},

		/**
		 * Create a partially applied function
		 * @method partial
		 * @param {Function} func
		 * @param {...Mixed} arguments
		 * @return {Function}
		 */
		partial: function (func) {
			return this.curry(func).apply(this, slice.call(arguments, 1));
		},

		/**
		 * Performs left to right function composition
		 * @method pipe
		 * @param {...Function} arguments
		 * @return {Function}
		 */
		pipe: function () {
			var funcs = slice.call(arguments);
			return function () {
				var result,
					args = slice.call(arguments);
				funcs.forEach(function (func, i) {
					result = (i === 0) ? func.apply(null, args) : func(null, result);
				});
				return result;
			};
		},

		/**
		 * Returns the previous element in an array in a cyclic manner
		 * @method previous
		 * @param {Array} arr
		 * @param {Number} index
		 * @return {Mixed}
		 */
		previous: function (arr, index) {
			return arr[previousIndex(arr, index)];
		},

		/**
		 * Returns the next element in an array in a cyclic manner
		 * @method next
		 * @param {Array} arr
		 * @param {Number} index
		 * @return {Mixed}
		 */
		next: function (arr, index) {
			return arr[nextIndex(arr, index)];
		},

		/**
		 * Returns the last element in an array
		 * @method last
		 * @param {Array} arr
		 * @return {Mixed}
		 */
		last: function (arr) {
			return arr[arr.length - 1];
		},

		/**
		 * Returns an array of numbers of length 'count', starting at 'start'
		 * If a number < 1 is passed as count, an empty array is returned.
		 * @method range
		 * @param {Number} count
		 * @param {Number} [startIndex] If undefined, defaults to 0
		 * @return {Array}
		 */
		range: function (count, startIndex) {
			var start = startIndex || 0,
				limit = start + parseInt(count, 10),
				returnArray = [],
				i;
			if (count < 1) {
				return returnArray;
			}
			for (i = start; i < limit; i++) {
				returnArray.push(i);
			}
			return returnArray;
		}

	};
}());
