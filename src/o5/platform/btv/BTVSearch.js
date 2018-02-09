/**
 * BTVSearch class is used to offer an API to return search
 * results from an EPG database. This class only handles
 * one request at a time.
 *
 * @class o5.platform.btv.BTVSearch
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.BTVSearch = new (function BTVSearch () {
    this._DEFAULT_PROPERTIES = "*";
    this._DEFAULT_ORDER = "title DESC";
    this._MAX_RESULTS = 999;
    this._MS_IN_A_DAY = 86400000;
    this._query = "";
    this._dataReceievedCallback = null;
    this._catchUpDataReceievedCallback = null;
    this._dataCompleteCallback = null;
    this._catchUpDataCompleteCallback = null;
})();

/**
 * Adds a predicate to the query object to search title
 * @method _addTitleSearchPredicate
 * @private
 * @param {String} title Title
 * @param {Boolean} [exactMatch=false] True for an exact match.
 */
o5.platform.btv.BTVSearch._addTitleSearchPredicate = function _addTitleSearchPredicate (title, exactMatch) {
    if (this._query !== "") {
        this._query += " AND ";
    }

    this._query += "title";

    if (exactMatch) {
        // we still perform a LIKE here because it ignores case, but we do not use any wildcards
        this._query += " LIKE '" + title + "'";
    } else {
        this._query += " LIKE '%" + title + "%'";
    }
};

/**
 * Adds a predicate to the query object to search for events that
 * have not yet finished
 * @method _addNowFutureSearchPredicate
 * @private
 */
o5.platform.btv.BTVSearch._addNowFutureSearchPredicate = function _addNowFutureSearchPredicate () {
    if (this._query !== "") {
        this._query += " AND ";
    }
    this._query += "endTime > " + String(new Date().getTime());
};

/**
 * Adds a predicate to the query object to search for events that
 * have not yet finished
 * @method _addPastCatchUpSearchPredicate
 * @private
 */
o5.platform.btv.BTVSearch._addPastCatchUpSearchPredicate = function _addPastCatchUpSearchPredicate () {
    //var startTime = now - o5.app.Config.getConfigValue("reverse.epg.days") * this._MS_IN_A_DAY;
    if (this._query !== "") {
        this._query += " AND ";
    }
    this._query += "endTime < " + String(new Date().getTime());
};

/**
 * Creates a query to search for events matching the given title
 * that have not already finished
 * @method _buildNonExpiredEventsByTitleQuery
 * @private
 * @param {Object} title Title
 * @param {boolean} [exactMatch=false] True for an exact match.
 */
o5.platform.btv.BTVSearch._buildNonExpiredEventsByTitleQuery = function _buildNonExpiredEventsByTitleQuery (title, exactMatch) {
    this._addTitleSearchPredicate(title, exactMatch);
    this._addNowFutureSearchPredicate();
};

/**
 * Creates a query to search for catchUp events matching the given title
 * @method _buildCatchUpEventsByTitleQuery
 * @private
 * @param {Object} title Title
 * @param {boolean} [exactMatch=false] True for an exact match.
 */
o5.platform.btv.BTVSearch._buildCatchUpEventsByTitleQuery = function _buildCatchUpEventsByTitleQuery (title, exactMatch) {
    this._addTitleSearchPredicate(title, exactMatch);
    this._addPastCatchUpSearchPredicate();
};

/**
 * Resets the internal variables back to their default values
 * @method _resetRequestData
 * @private
 */
o5.platform.btv.BTVSearch._resetRequestData = function _resetRequestData () {
    this._query = "";
};

/**
 * Executes the currently held query.
 * @method _executeQuery
 * @private
 */
o5.platform.btv.BTVSearch._executeQuery = function _executeQuery () {

    var eventsArray = [],
        events = [],
        result = CCOM.EPG.getEventsRSByQuery(this._DEFAULT_PROPERTIES, this._query, this._DEFAULT_ORDER);

    if (result.error === undefined) {
        events = result.getNext(this._MAX_RESULTS);
        eventsArray = o5.platform.btv.EPGEventFactory.mapArray(events);
    } else {
        this.logError("Error from CCOM.EPG.getEventsRSByQuery : " + result.error.name + " " + result.error.message);
    }

    this.logDebug("Found " + String(eventsArray.length) + " events.");
    this._dataReceievedCallback(eventsArray);
    this._dataCompleteCallback(true);
    result.reset();
    result = null;
};

/**
 * Executes the currently held query for catch up support
 * @method _executeCatchUpQuery
 * @private
 */
o5.platform.btv.BTVSearch._executeCatchUpQuery = function _executeCatchUpQuery () {

    var eventsArray = [],
        events = [],
        tag = {
            tagId: 'catchUpSupport',
            tagValue: 1
        },
        result = CCOM.EPG.getEventsRSByTag(this._DEFAULT_PROPERTIES, tag, this._query, this._DEFAULT_ORDER);

    if (result.error === undefined) {
        events = result.getNext(this._MAX_RESULTS);
        eventsArray = o5.platform.btv.EPGEventFactory.mapArray(events);
    }

    this.logDebug("Found " + String(eventsArray.length) + " events.");
    this._catchUpDataReceievedCallback(eventsArray);
    this._catchUpDataCompleteCallback(true);
    result.reset();
    result = null;
};

/**
 * Retrieves an array of events matching the given title
 * @method getNonExpiredEventsByTitle
 * @async
 * @param {String} title Title of the event that we're interested in
 * @param {Function} dataCallback Callback function to be invoked when the data has been fetched. This
 * function should expect an array of EPG events
 * @param {Function} finishedCallback Callback function to be invoked when the data has been fetched. This
 * function should expect a Boolean value to indicate if the query was successful
 * @param {Boolean} [exactMatch=false] Indicates whether an exact match is required
 */
o5.platform.btv.BTVSearch.getNonExpiredEventsByTitle = function getNonExpiredEventsByTitle (title, dataCallback, finishedCallback, exactMatch) {
    this.logInfo("Starting search for " + title);
    if (dataCallback && finishedCallback) {
        this._dataReceievedCallback = dataCallback;
        this._dataCompleteCallback = finishedCallback;
        this._resetRequestData();
        this._buildNonExpiredEventsByTitleQuery(title, exactMatch);

        setTimeout(function () {
            this._executeQuery();
        }.bind(this), 1);
    }
};

/**
 * Retrieves an array of events matching the given title for catchup events
 * @method getcatchUpEventsByTitle
 * @async
 * @param {String} title Title of the event that we're interested in
 * @param {Function} dataCallback Callback function to be invoked when the data has been fetched. This
 * function should expect an array of EPG events
 * @param {Function} finishedCallback Callback function to be invoked when the data has been fetched. This
 * function should expect a Boolean value to indicate if the query was successful
 * @param {Boolean} [exactMatch=false] Indicates whether an exact match is required
 */
o5.platform.btv.BTVSearch.getcatchUpEventsByTitle = function getcatchUpEventsByTitle (title, dataCallback, finishedCallback, exactMatch) {
    if (dataCallback && finishedCallback) {
        this._catchUpDataReceievedCallback = dataCallback;
        this._catchUpDataCompleteCallback = finishedCallback;
        this._resetRequestData();
        this._buildCatchUpEventsByTitleQuery(title, exactMatch);

        setTimeout(function () {
            this._executeCatchUpQuery();
        }.bind(this), 1);
    }
};

/**
 * Cancels a previous request
 * @method cancelLastRequest
 */
o5.platform.btv.BTVSearch.cancelLastRequest = function cancelLastRequest () {
    this._resetRequestData();
};

// uncomment to turn debugging on for BTVSearch object
// o5.log.setAll(o5.platform.btv.BTVSearch, true);
