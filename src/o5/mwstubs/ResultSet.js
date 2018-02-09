/**
 * Stub for ResultSet: CCOM.ResultSet When creating a new instance, you must pass in an array of required objects for your particular test
 * case.
 * @ignore
 */
CCOM.ResultSet = function(results)
{
	this._id = CCOM.stubs.uuid();
	this.results = results; // an array of ?
	this.index = 0; // the index to the result array
};

CCOM.ResultSet.prototype._MY_NAME_SPACE = "CCOM.ResultSet";
CCOM.ResultSet.prototype._EVENT_FETCH_NEXT_EVNETS_OK = "fetchNextOK";
CCOM.ResultSet.prototype._EVENT_FETCH_NEXT_EVNETS_FAILED = "fetchNextFailed",

/*
 * shared public interface
 */
CCOM.ResultSet.prototype.getNext = function(required)
{
	var i, items = [], end = this.index + required;

	for (i = this.index; i < end; i += 1)
	{
		if (this.results[i])
		{
			items.push(this.results[i]);
		}
		else
		{
			break;
		}
	}
	this.index = i;
	return items;
};

CCOM.ResultSet.prototype.fetchNext = function(count)
{
	var items = this.getNext(count), size = items.length;

	if (size > 0)
	{
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_FETCH_NEXT_EVNETS_OK, {
			handle : size,
			results : items
		});
	}
	else
	{
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_FETCH_NEXT_EVNETS_FAILED, {
			handle : size,
			error : "error"
		});
	}
	return size;
};

CCOM.ResultSet.prototype.reset = function()
{
};

CCOM.ResultSet.prototype.getPropertyNames = function()
{
	return [];
};

CCOM.ResultSet.prototype.addEventListener = function(event, callback)
{
	if (-1 === this._supportedEvents.indexOf(event))
	{
		return CCOM.stubs.ERROR_INVALID_EVENT;
	}
	return CCOM.stubs.addEventListener(this._id, this._MY_NAME_SPACE, event, callback);
};

CCOM.ResultSet.prototype.removeEventListener = function(event, callback)
{
	if (-1 === this._supportedEvents.indexOf(event))
	{
		return CCOM.stubs.ERROR_INVALID_EVENT;
	}
	return CCOM.stubs.removeEventListener(this._id, this._MY_NAME_SPACE, event, callback);
};

CCOM.ResultSet.prototype._supportedEvents = [
	CCOM.ResultSet.prototype._EVENT_FETCH_NEXT_EVNETS_OK,
	CCOM.ResultSet.prototype._EVENT_FETCH_NEXT_EVNETS_FAILED
];
