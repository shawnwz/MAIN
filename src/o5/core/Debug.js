/**
 * @class o5.debug
 * @singleton
 * @author lmayle
 */

o5.debug = function Debug () {};

/**
 * Print given Object in a structured format, optionally printing inner objects down to N levels
 * @param {Object} object The given Object
 * @param {number} [levels=0] If internal objects should be described as well, up to N levels
 */
o5.debug.print = function print (object, levels)
{
	//eslint-disable-next-line no-console
	console.log('*****************\n[object ' + object.constructor.name + ']\n' + this._printObject(object, 1, levels === null ? 0 : levels));
};

o5.debug._printObject = function _printObject (obj, level, printChildren)
{
	var details = '';
	var fieldContents;

	//eslint-disable-next-line guard-for-in
	for (var field in obj)
	{
	    fieldContents = obj[field];

	    switch (typeof (fieldContents))
	    {
	    case 'function':
	    	fieldContents = '{function ' + obj[field].name + '}';
	    	break;

	    case 'object':
	    	if (obj[field] === null)
			{
    			break;
			}

			if (printChildren)
			{
				fieldContents = '{object ' + obj[field].constructor.name + '}\n' + this._printObject(fieldContents, level + 1, printChildren - 1);
			}
			else
			{
				fieldContents = '{object ' + obj[field].constructor.name + '}';
			}

			break;

	    case 'string':
			var len = fieldContents.length;

			if (len > 100)
			{
				fieldContents = fieldContents.substr(0, 100) + '...';
			}

			fieldContents = '{string ' + len + '} "' + fieldContents + '"';
			break;
			
		default:
	    	fieldContents = fieldContents.toString();
    		break;
	    }

	    for (var i = 0; i < level; i++)
	    {
	    	details += '  ';
	    }

	    details += field + ': ' + fieldContents + '\n';
	}

	return details;
};


