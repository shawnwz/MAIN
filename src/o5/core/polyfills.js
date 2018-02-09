/**
 * O5.js common polyfills
 *
 * @author lmayle
 * @ignore
 */


o5.$.initCorePolyfills = function initCorePolyfills (window, document)
{
	if (!window.String.prototype.startsWith)
	{
		window.String.prototype.startsWith = function (searchString, position)
		{
	      position = position || 0;
	      
	      return this.substr(position, searchString.length) === searchString;
	  };
	}
	
	if (!window.String.prototype.endsWith)
	{
		window.String.prototype.endsWith = function(searchString, position)
		{
			if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > this.length)
			{
				position = this.length;
			}
			position -= this.length;
			var lastIndex = this.lastIndexOf(searchString, position);
			return lastIndex !== -1 && lastIndex === position;
		};
	}
	
	if (!window.String.prototype.includes)
	{
		window.String.prototype.includes = function(search, start)
		{
			'use strict';
			if (typeof start !== 'number')
			{
				start = 0;
			}

			if (start + search.length > this.length)
			{
				return false;
			}
			else
			{
				return this.indexOf(search, start) !== -1;
			}
		};
	}
	
	if (!window.Array.prototype.find)
	{
		Object.defineProperty(window.Array.prototype, 'find', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: function find (predicate)
			{
				'use strict';
				if (this == null) {
					throw new TypeError('Array.prototype.find called on null or undefined');
				}
				if (typeof predicate !== 'function') {
					throw new TypeError('predicate must be a function');
				}
				var list = Object(this);
				var length = list.length >>> 0;
				var thisArg = arguments[1];
				var value;
		
				for (var i = 0; i < length; i++) {
					value = list[i];
					if (predicate.call(thisArg, value, i, list)) {
						return value;
					}
				}
				return undefined;
			}
		});
	}
	
	if (!window.Number.MIN_SAFE_INTEGER)
	{
		window.Number.MIN_SAFE_INTEGER = -9007199254740991;
	}
	
	if (!window.Number.MAX_SAFE_INTEGER)
	{
		window.Number.MAX_SAFE_INTEGER = 9007199254740991;
	}
	
	if (!window.Number.isInteger)
	{
		window.Number.isInteger = function(value) {
			return typeof value === 'number' && 
			isFinite(value) && 
			Math.floor(value) === value;
		};
	}
	
	
	if(!window.Object.values)
	{
		window.Object.values = function values (object) {
			return Object.keys(object).map(key => object[key]);
		};
	}
	
	Object.assignDeep = function (target, varArgs) { // .length of function is 2
	    'use strict';
	    if (target == null) { // TypeError if undefined or null
	        throw new TypeError('Cannot convert undefined or null to object');
	    }

	    var to = Object(target);

	    for (var index = 1; index < arguments.length; index++) {
	        var nextSource = arguments[index];

	        if (nextSource != null) { // Skip over if undefined or null
	            for (var nextKey in nextSource) {
	                // Avoid bugs when hasOwnProperty is shadowed
	                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
	                    if (typeof to[nextKey] === 'object' 
	                        && to[nextKey] 
	                        && typeof nextSource[nextKey] === 'object' 
	                        && nextSource[nextKey]) {                        
	                        Object.assignDeep(to[nextKey], nextSource[nextKey]);
	                    } else {
	                        to[nextKey] = nextSource[nextKey];
	                    }
	                }
	            }
	        }
	    }
	    return to;
	};
};

o5.$.initCorePolyfills(window, document);
