/**
 * PVRSearch class is used to offer an API to return search
 * results from a PVR task database. This class only handles
 * one request at a time.
 *
 * @class o5.platform.btv.PVRSearch
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.PVRSearch = new (function PVRSearch () {
    this.DEFAULT_MAX_RESULTS = 999;
    this._maxResults = this.DEFAULT_MAX_RESULTS;

    this._query = "";

    this._dataReceievedCallback = null;
    this._dataCompleteCallback = null;

    this.OBJECT_STATE = {
        BOOKED: 0,
        PROCESSING: 1,
        SUSPEND_PROCESSING: 2,
        STOP_PROCESSING: 3,
        PROCESSED: 4,
        FINAL: 5,
        ERROR: 6,
        DELETING: 7,
        DELETED: 8
    };
})();

/**
 * Creates a query to search for tasks matching the given title
 * @method _buildTitleQuery
 * @private
 * @param {String} title Title
 * @param {boolean} exactMatch True for exact match or false for similar.
 */
o5.platform.btv.PVRSearch._buildTitleQuery = function _buildTitleQuery (title, exactMatch) {
    if (this._query !== "") {
        this._query += " AND ";
    }

    this._query += "title";

    if (exactMatch) {
        this._query += " LIKE '" + title + "'";
    } else {
        this._query += " LIKE '%" + title + "%'";
    }
};

/**
 * Resets the internal query variable to empty string
 * @method _resetRequestData
 * @private
 */
o5.platform.btv.PVRSearch._resetRequestData = function _resetRequestData () {
    this._query = "";
};

/**
 * Extracts all results from a result set and returns them as an array.
 * @method _getArrayFromResultSet
 * @private
 * @param {Object} resultSet Result set object
 * @return {Array} An array of PVR tasks
 */
o5.platform.btv.PVRSearch._getArrayFromResultSet = function _getArrayFromResultSet (resultSet) {
    var rsArray;
    var returnArray = [];
    var i;
    var len;
    if (!resultSet.error) {
        rsArray = resultSet.getNext(this._maxResults);
        len = rsArray.length;
        for (i = 0; i < len; i++) {
            rsArray[i].url = "pvr://" + rsArray[i].taskId;
            returnArray.push(rsArray[i]);
        }
    }
    resultSet.reset();
    resultSet = null;
    return returnArray;
};

/**
 * Executes the currently held query and calls the data received callback.
 * @method _executeQuery
 * @private
 */
o5.platform.btv.PVRSearch._executeQuery = function _executeQuery () {
    this.logDebug("this._query : " + this._query);
    var resultSet = CCOM.Scheduler.getTasksRSByQuery("*", this._query + " AND taskType='REC' AND (objectState<" + String(this.OBJECT_STATE.ERROR) + ")", "title");
    var tasks = this._getArrayFromResultSet(resultSet);
    this.logDebug("Found " + String(tasks.length) + " tasks.");
    this._dataCompleteCallback(true);
    this._dataReceievedCallback(tasks);
};

/**
 * Returns an array of tasks matching the given title
 * @method getTasksByTitle
 * @async
 * @param {String} title Title
 * @param {Function} dataCallback Callback function to receive tasks
 * @param {Array} dataCallback.tasks An array of PVR tasks
 * @param {Function} finishedCallback Callback function to receive data complete notification
 * @param {Boolean} finishedCallback.result Always returns true
 * @param {Boolean} exactMatch True for exact match or false for similar.
 * @param {Number} [limit=999] Maximum number of results to get
 */
o5.platform.btv.PVRSearch.getTasksByTitle = function getTasksByTitle (title, dataCallback, finishedCallback, exactMatch, limit) {
    this.logDebug("Starting search for " + title);
    if (dataCallback && finishedCallback) {
        this._maxResults = limit || this.DEFAULT_MAX_RESULTS;
        this._dataReceievedCallback = dataCallback;
        this._dataCompleteCallback = finishedCallback;
        this._resetRequestData();
        this._buildTitleQuery(title, exactMatch);

        setTimeout(function () {
            this._executeQuery();
        }.bind(this), 1);
    }
};

/**
 * Cancels a previous request
 * @method cancelLastRequest
 * @deprecated Don't use, does nothing useful
 */
o5.platform.btv.PVRSearch.cancelLastRequest = function cancelLastRequest () {
    this.logEntry();
    this._resetRequestData();
};

// uncomment to turn debugging on for PVRSearch object
// o5.log.setAll(o5.platform.btv.PVRSearch, true);
