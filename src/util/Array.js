"use strict";

if (!Array.prototype.contains) {
// eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'contains', {
    value: 	function(elem) {
			var e = elem.toLowerCase(),
          i;
			for (i in this) {
				if (this[i].toLowerCase() === e) {
					return true;
				}
			}
			return false;
		}
	});
}

if (!Array.prototype.shuffle) {
// eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'shuffle', {
    value: 	function () {
			var m = this.length, t, i;
			while (m) {
				i = Math.floor(Math.random() * m--);
				t = this[m];
				this[m] = this[i];
				this[i] = t;
			}
		}
	});
}

if (!Array.prototype.findIndex) {
// eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
      if (this === null) {
        throw new TypeError('"this" is null or not defined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      var o = Object(this),
// eslint-disable-next-line no-bitwise
      	len = o.length >>> 0,
      	thisArg = arguments[1],
      	k = 0;

      while (k < len) {
        if (predicate.call(thisArg, o[k], k, o)) {
          return k;
        }
        k++;
      }
      return -1;
    }
  });
}

