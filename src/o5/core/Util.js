/**
 * O5.js misc utilities
 *
 * @author lmayle
 * @ignore
 */

/**
 * Internal function to get Home Object of given method
 * @ignore
 * @param {Function} f Function to look for
 * @param {Object} o Object at the bottom of the prototype chain from where to start the search
 * @return {Object} The Home Object of the given function if found, null otherwise
 */
o5.$.getHomeObject = function getHomeObject (f, o)
{
	if(!f)
		return null;
	
	var name = f.name;

	var proto = null;

	if (f.__homeObject__)
	{
		return f.__homeObject__;
	}

	if (name)
	{
		for (proto = o; proto; proto = proto.__proto__)
		{
			if (proto.hasOwnProperty(name) && proto[name] === f)
			{
				//eslint-disable-next-line no-return-assign
				return f.__homeObject__ = proto.constructor;
			}
		}
	}
	else
	{
		for (proto = o; proto; proto = proto.__proto__)
		{
			var key;
			var keys = Object.keys(proto);

			for (var i = 0; (key = keys[i]) !== undefined; i++)
			{
				if (Object.getOwnPropertyDescriptor(proto, key).value === f)
				{
					f.__homeObjectKey__ = key;

					//eslint-disable-next-line no-return-assign
					return f.__homeObject__ = proto.constructor;
				}
			}
		}
	}
	
	return null;
};




//Extensions to JS

o5.$.initJSExtensions = function initJSExtensions (w)
{
//	dbgf(w.location);
	
	w.String.prototype.padLeft = function (len, pad)
	{
		var str = this;
		
	    while (str.length < len)
	        str = pad + str;
	    
	    return str;
	};
	
	w.Date.parseFBDate = function parseFBDate (fbDate)
	{
		var arrDateTime = fbDate.split("T");
		var arrDateCode = arrDateTime[0].split("-");
		var arrTimeCode = arrDateTime[1].substring(0, arrDateTime[1].indexOf("+")).split(":");
		
		var ret = new Date();
		
		ret.setUTCFullYear(arrDateCode[0], arrDateCode[1] - 1, arrDateCode[2]);
		ret.setUTCHours(arrTimeCode[0], arrTimeCode[1], arrTimeCode[2]);
		
		return ret;
	};
	
	w.parseFileDate = function parseFileDate (str)
	{
	    var ret = new Date();
	    
	    ret.setUTCFullYear(str.substr(0, 4), str.substr(4, 2) - 1, str.substr(6, 2));
	    ret.setUTCHours(str.substr(8, 2), str.substr(10, 2), 0, 0);
	    
	    return ret;
	};
	
	w.Date.prototype.addMinutes = function (minutes)
	{
		return new Date(this.getTime() + minutes * 60000);
	};
	
	w.Date.prototype.addDays = function (days)
	{
		return new Date(this.getTime() + days * 24 * 60 * 60000);
	};
	
	w.Date.prototype.toTimeString = function ()
	{
		var hours = this.getHours();
		var minutes = this.getMinutes();
		
		var am = hours < 12;
		
		if(!am)
			hours -= 12;
		
		if(hours == 0)
			hours = 12;
		
		return hours.toString() + ":" + minutes.toString().padLeft(2, "0") + (am ? " AM" : " PM");
		
//		return this.getHours().toString().padLeft(2, "0") + ":" + this.getMinutes().toString().padLeft(2, "0");
	};
	
	w.Date.prototype.toDateString = function ()
	{
		return (this.getMonth() + 1).toString().padLeft(2, "0") + "/" + this.getDate().toString().padLeft(2, "0") + "/" + this.getFullYear().toString();
	};
	
	w.Date.prototype.toShortDateString = function ()
	{
		return (this.getMonth() + 1).toString().padLeft(2, "0") + "/" + this.getDate().toString().padLeft(2, "0");
	};
	
	w.Date.prototype.toShortWeekDayString = function ()
	{
		switch (this.getDay())
		{
		case 0: return "Sun"; break;
		case 1: return "Mon"; break;
		case 2: return "Tue"; break;
		case 3: return "Wed"; break;
		case 4: return "Thu"; break;
		case 5: return "Fri"; break;
		case 6: return "Sat"; break;
		}
		return "";
	};
	
	w.Date.prototype.toMonthString = function ()
	{
		switch (this.getMonth())
		{
		case  0: return "January"; break;
		case  1: return "February"; break;
		case  2: return "March"; break;
		case  3: return "April"; break;
		case  4: return "May"; break;
		case  5: return "June"; break;
		case  6: return "July"; break;
		case  7: return "August"; break;
		case  8: return "September"; break;
		case  9: return "October"; break;
		case 10: return "November"; break;
		case 11: return "December"; break;
		}
		return "";
	};
	
	w.Date.prototype.toWeekDateTimeString = function ()
	{
		return this.toShortWeekDayString() + " " + this.toDateString() + " " + this.toTimeString();
	};
	
	w.Date.prototype.toFBWeekDateTimeString = function ()
	{
		return this.toShortWeekDayString() + " " + this.toMonthString() + " " + this.getDate() + " at " + this.toTimeString();
	};
	
	w.Date.prototype.toWeekShortDateTimeString = function ()
	{
		return this.toShortWeekDayString() + " " + this.toShortDateString() + " " + this.toTimeString();
	};
	
	w.Date.prototype.toWeekShortDateString = function ()
	{
		return this.toShortWeekDayString() + " " + this.toShortDateString();
	};
	
	w.Date.prototype.toDateTimeString = function ()
	{
		return this.toDateString() + " " + this.toTimeString();
	};
	
	w.Date.prototype.greaterOrEqualByMinute = function (val)
	{
		return (this - val) >= 59000;
	};
	
	w.Date.prototype.diffByMinute = function (val)
	{
		return Math.abs(this - val) >= 59000;
	};
};

o5.$.initJSExtensions(window);





o5.EventTarget = function O5jsEventTarget ()
{
};


o5.EventTarget.prototype.addEventListener = function addEventListener (type, listener)
{
	if(!this.__eventListeners)
		this.__eventListeners = new Map();
	
	var typeListeners = this.__eventListeners.get(type);
	
	if(!typeListeners)
	{
		typeListeners = new Set();
		
		this.__eventListeners.set(type, typeListeners);
	}
	
	typeListeners.add(listener);
};

o5.EventTarget.prototype.dispatchEvent = function dispatchEvent (event, props)
{
	if(!this.__eventListeners)
		return;
	
	var typeListeners = this.__eventListeners.get(event.type);
	
	if(!typeListeners)
		return;
	
//	for(var key of Object.keys(props))
//	{
//		event[key] = props[key];
//	}
	
	if(props)
	{
		var keys = Object.keys(props);
		
		for (var i = 0; i < keys.length; i++)
		{
			event[keys[i]] = props[keys[i]];
		}
	}
	
//	for(var listener of typeListeners.values())
//	{
//		listener.call(this, event);
//	}
	
	typeListeners.forEach(function(listener){
		listener.call(this, event);
	}, this);
};

















