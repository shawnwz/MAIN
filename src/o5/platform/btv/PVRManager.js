/**
 * Singleton instance to assist in PVR functionality. The class wraps up the complexity
 * of requesting/stopping series, event and timed recordings offering a call back to
 * update the user interface once recordings have been set. The PVRManager
 * employs the help of the conflict manager to provide basic recording request conflict
 * resolutions, the init method allows the conflict manager to be replaced by a custom class
 * that conforms to the same interface. The meta-data associated to recordings has been
 * extended to allow bookmarks on content, plus additional data like name and lock. There are
 * also many methods defined such as isEventRecording to simplify the logic of the client
 * application
 *
 * @class o5.platform.btv.PVRManager
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.PVRManager = new (function PVRManager () {

    this._conflictManaer = null;
    this._emptyFunction = function () {};
    this._taskAboutToStartCallback = this._emptyFunction;
    this._taskAboutToStartConflictCallback = this._emptyFunction;
    this._taskStartedCallback = this._emptyFunction;
    this._jobDeletedFailedCallback = this._emptyFunction;
    this._addJobFailedCallback = this._emptyFunction;
    this._taskChangedCallback = null;
    this._taskIdForBookMarkDeletion = null;
    this._taskEndedCallback = this._emptyFunction;
    this._taskStoppedOKCallback = this._emptyFunction;
    this._recordingRequestFailedCallback = this._emptyFunction;
    this._recordingRequestConflictsCallback = this._emptyFunction;
    this._taskChangedConflictCallback = this._emptyFunction;
    this._seriesRequestConflictsCallback = this._emptyFunction;
    this._diskSpaceWarningCallback = this._emptyFunction;
    this._jobDeletedOKCallback = this._emptyFunction;
    this._deleteContentOKCallback = this._emptyFunction;
    this._cancelEventRecordingCallback = this._emptyFunction;
    this._updateTaskCallbackLookup = {};
    this._updateJobCallbackLookup = {};
    this._updateEntryCallbackLookup = {};
    this._defaultPadding = 0;
    this._currentPartitionName = [];
    this._scheduledRecordStartTime = 0;
    this._uiRefreshListeners = [];
    this._addJobCompletedListeners = [];
    this._totalTasks = [];
    this._tasksEndTimeArray = [];
    this._taskCount = 0;
    this._taskStopCount = 0;
    this._activeRecordings = {}; // Stores active records (key=serviceId, value=taskId)
    this._recordingsReturnOrder = 0;
    this._addJobHandle = null;
    this._hddAvailability = false;
    this._hddAvailabilityFunc = null;
    this._unPlugStatusOfDriveFunc = null;
    this._pvrMediumId = null;

    this.REC_COUNT = 20;

    // Task type
    this.TASK_TYPE = {
        RECORDING: "REC",   // Recording
        RMDR: "RMDR",       // Reminder
        REMINDER: "GRMDR"   // Generic reminder, only time notification are given
    };

    // Job (schedule) type. A job can create one or more tasks.
    this.JOB_TYPE = {
        SINGLE: "ONE_TIME", // One time job, time based
        EVENT:  "ONE_EVT",  // One time show, event based
        REPEAT: "RPT_TIME", // Repeat time schedule, time based
        REPEAT_INTERVAL: "RPT_INTERVAL", // Repeat interval schedule, time based
        SERIES: "SERIES",   // Series booking schedule
        SEARCH: "SEARCH"    // Search based booking schedule
    };

    // The current processing state of the task
    this.OBJECT_STATE = {
        BOOKED: 0,    // Booked, not yet started
        PROCESSING: 1,
        SUSPEND_PROCESSING: 2,
        STOP_PROCESSING: 3,
        PROCESSED: 4, // Processed, but not final
        FINAL: 5,     // Final, content file (for some task types) is available
        ERROR: 6,     // Error, no content file
        DELETING: 7,
        DELETED: 8    // Deleted, content file is deleted
    };

    this.COMPLETION_STATUS_INVALID = undefined;
    this.COMPLETION_STATUS_NONE = undefined;
    this.COMPLETION_STATUS_PARTIAL = undefined;
    this.COMPLETION_STATUS_FULL = undefined;
})();

/**
 * Enumeration of recording order types.
 * @readonly
 * @property {Number} RecordingsReturnOrderType
 * @property {Number} RecordingsReturnOrderType.BY_DATE 1
 * @property {Number} RecordingsReturnOrderType.BY_DATE_DESC 2
 * @property {Number} RecordingsReturnOrderType.BY_NAME 3
 */
o5.platform.btv.PVRManager.RecordingsReturnOrderType = {
    BY_DATE: 1,
    BY_DATE_DESC: 2,
    BY_NAME: 3
};

/**
 * Enumeration of scheduled task status.
 * @readonly
 * @property {Number} TaskStatus
 * @property {Number} TaskStatus.TASK_STATUS_UNSCHEDULED 1
 * @property {Number} TaskStatus.TASK_STATUS_SCHEDULED 2
 * @property {Number} TaskStatus.TASK_STATUS_SCHEDULED_BY_SERIES 3
 * @property {Number} TaskStatus.TASK_STATUS_ACTIVE 4
 * @property {Number} TaskStatus.TASK_STATUS_ACTIVE_IN_SERIES 5
 * @property {Number} TaskStatus.TASK_STATUS_PARTIAL 6
 * @property {Number} TaskStatus.TASK_STATUS_COMPLETED 7
 */
o5.platform.btv.PVRManager.TaskStatus = {
    TASK_STATUS_UNSCHEDULED: 1,
    TASK_STATUS_SCHEDULED: 2,
    TASK_STATUS_SCHEDULED_BY_SERIES: 3,
    TASK_STATUS_ACTIVE: 4,
    TASK_STATUS_ACTIVE_IN_SERIES: 5,
    TASK_STATUS_PARTIAL: 6,
    TASK_STATUS_COMPLETED: 7
};

/**
 * Enumeration of frequency of recordings.
 * @readonly
 * @property {Number} Frequency
 * @property {Number} Frequency.ONCE 1
 * @property {Number} Frequency.DAILY 2
 * @property {Number} Frequency.WEEKLY 3
 * @property {Number} Frequency.WEEKDAYS 4
 * @property {Number} Frequency.WEEKENDS 5
 */
o5.platform.btv.PVRManager.Frequency = {
    ONCE: 1,
    DAILY: 2,
    WEEKLY: 3,
    WEEKDAYS: 4,
    WEEKENDS: 5
};

/**
 * Event handler to fire callback functions
 * @method _fireCallback
 * @private
 * @param {Number} handle Handle
 * @param {Object} lookup Function table
 * @param {Boolean} param Value to send to callback to notify success or failed event notification
 */
o5.platform.btv.PVRManager._fireCallback = function _fireCallback (handle, lookup, param) {
    if (handle && lookup[handle]) {
        lookup[handle](param, handle);
        lookup[handle] = null;
        delete lookup[handle];
    }
};

o5.platform.btv.PVRManager._updateTaskOKListener = function _updateTaskOKListener (e) {
    this._fireCallback(e.handle, this._updateTaskCallbackLookup, true);
};

o5.platform.btv.PVRManager._updateTaskFailedListener = function _updateTaskFailedListener (e) {
    this._fireCallback(e.handle, this._updateTaskCallbackLookup, false);
};

o5.platform.btv.PVRManager._updateJobOKListener = function _updateJobOKListener (e) {
    this._fireCallback(e.handle, this._updateJobCallbackLookup, true);
};

o5.platform.btv.PVRManager._updateJobFailedListener = function _updateJobFailedListener (e) {
    this._fireCallback(e.handle, this._updateJobCallbackLookup, false);
};

o5.platform.btv.PVRManager._updateEntryOKListener = function _updateEntryOKListener (e) {
    this._fireCallback(e.handle, this._updateEntryCallbackLookup, true);
};

o5.platform.btv.PVRManager._updateEntryFailedListener = function _updateEntryFailedListener (e) {
    this._fireCallback(e.handle, this._updateEntryCallbackLookup, false);
};

/**
 * Extracts all results from a result set and returns them as an array.
 * @method _getArrayFromResultSet
 * @private
 * @param {Object} resultSet NPObject to retrieve recording objects
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager._getArrayFromResultSet = function _getArrayFromResultSet (resultSet) {
    this.logEntry();
    var rsArray,
        returnArray = [],
        i,
        len;
    if (!resultSet) {
        this.logDebug("No Data Found");
        return returnArray;
    }
    if (!resultSet.error) {
        rsArray = resultSet.getNext(this.REC_COUNT);
        while (rsArray && rsArray.length) {
            len = rsArray.length;
            this.logDebug("Processing " + String(len) + " records...");
            for (i = 0; i < len; i++) {
                returnArray.push(o5.platform.btv.RecordingFactory.mapObject(rsArray[i]));
            }
            if (len < this.REC_COUNT) {
                this.logDebug("No more results");
                rsArray = null;
            } else {
                this.logDebug("More results getting next set of records...");
                rsArray = resultSet.getNext(this.REC_COUNT);
            }
        }
        this.logDebug("Resetting ResultsSet");
    } else {
        this.logError("_getArrayFromResultSet", "error : " + resultSet.error.message);
    }

    this.logDebug("_getArrayFromResultSet", "Exit - returnArray length = " + String(returnArray.length));
    this.logExit();
    return returnArray;
};

/**
 * This method returns the mediumId
 * @method _getMediumIdCriteria
 * @private
 * @return {String} Returns criteria string to filter for mediumId
 */
o5.platform.btv.PVRManager._getMediumIdCriteria = function _getMediumIdCriteria () {
    return (this._pvrMediumId && this._pvrMediumId !== null) ? " AND (mediumID = '" + this._pvrMediumId + "' OR objectState = " + this.OBJECT_STATE.BOOKED + " OR objectState = " + this.OBJECT_STATE.ERROR + ")" : "";
};

/**
 * Extracts the first result from a result set and returns it as an object.
 * @method _getObjectFromResultSet
 * @private
 * @param {Object} resultSet NPObject to retrieve the next result
 * @return {Object} Result object or null
 */
o5.platform.btv.PVRManager._getObjectFromResultSet = function _getObjectFromResultSet (resultSet) {
    var resultArray,
        resultObject = null;

    if (resultSet && !resultSet.error) {
        resultArray = resultSet.getNext(1);
        if (resultArray.length) {
            resultObject = resultArray[0];
        }
        resultSet.reset();
    }

    return resultObject;
};

/**
 * Determines if the given task is scheduled.
 * @method _isTaskObjectScheduled
 * @private
 * @param {Object} task Recording object
 * @return {Boolean} Returns true if the task is a scheduled recording, otherwise false.
 */
o5.platform.btv.PVRManager._isTaskObjectScheduled = function _isTaskObjectScheduled (task) {
    if (task && task._data && task._data.objectState === this.OBJECT_STATE.BOOKED) {
        return true;
    }
    return false;
};

/**
 * Determines if the given task is of type recording.
 * @method _isTaskObjectPVR
 * @private
 * @param {Object} task Recording object
 * @return {Boolean} Returns true if it is a recording task, otherwise false.
 */
o5.platform.btv.PVRManager._isTaskObjectPVR = function _isTaskObjectPVR (task) {
    if (task && task._data && task._data.taskType === this.TASK_TYPE.RECORDING) {
        return true;
    }
    return false;
};

/**
 * Determines if the passed task object is currently active.
 * @method _isTaskObjectActive
 * @private
 * @param {Object} task Recording object
 * @return {Boolean} Returns true if the task is an active recording, otherwise false.
 */
o5.platform.btv.PVRManager._isTaskObjectActive = function _isTaskObjectActive (task) {
    this.logEntry("_isTaskObjectActive", "Enter - task._data.objectState = " + String(task._data.objectState));
    if (task && task._data && task._data.objectState === this.OBJECT_STATE.PROCESSING) {
        this.logExit("_isTaskObjectActive", "Exit true");
        return true;
    }
    this.logExit("_isTaskObjectActive", "Exit false");
    return false;
};

/**
 * Returns true if the passed task object is currently suspended. This means the task
 * should be active but is not recording because of no signal or a similar problem.
 * @method _isTaskObjectSuspended
 * @private
 * @param {Object} task Recording object
 * @return {boolean} Returns true if the task is a suspended recording, otherwise false.
 */
o5.platform.btv.PVRManager._isTaskObjectSuspended = function _isTaskObjectSuspended (task) {
    this.logEntry();
    if (task && task._data && task._data.objectState === this.OBJECT_STATE.SUSPEND_PROCESSING) {
        this.logExit();
        return true;
    }
    this.logExit();
    return false;
};

/**
 * Determines if the passed task object is a partial recording.
 * @method _isTaskObjectPartial
 * @private
 * @param {Object} task Recording object
 * @return {Boolean} Returns true if the task is a partial recording, otherwise false.
 */
o5.platform.btv.PVRManager._isTaskObjectPartial = function _isTaskObjectPartial (task) {
    if (task && task._data && task._data.completeStatus === this.COMPLETION_STATUS_PARTIAL) {
        return true;
    }
    return false;
};

/**
 * Determines if the passed task object is a complete recording.
 * @method _isTaskObjectComplete
 * @private
 * @param {Object} task Recording object
 * @return {Boolean} Returns true if the task is a complete recording, otherwise false.
 */
o5.platform.btv.PVRManager._isTaskObjectComplete = function _isTaskObjectComplete (task) {
    if (task && task._data && task._data.completeStatus === this.COMPLETION_STATUS_FULL) {
        return true;
    }
    return false;
};

/**
 * Returns a Scheduler Job matching the given jobId. If no job is found, null is returned.
 * @method getJob
 * @param {Number} jobId Job id
 * @param {Boolean} [sort=false] If true, sort order is set to "LIMIT 1".
 * Otherwise it is set to "jobId DESC LIMIT 1".
 * @return {Object} Mapped recording object or null if not found.
 */
o5.platform.btv.PVRManager.getJob = function getJob (jobId, sort) {
    this.logEntry();
    if (!sort) {
        sort = "jobId DESC LIMIT 1";
    } else {
        sort = "LIMIT 1";
    }
    var resultSet = CCOM.Scheduler.getJobsRSByQuery("*", "jobId='" + jobId + "'", sort),
        job = o5.platform.btv.RecordingFactory.mapObject(this._getObjectFromResultSet(resultSet));
    this.logExit();
    return job;
};

/**
 * Returns the job for a scheduled event recording.
 * @method getJobByEvent
 * @param {String} eventId Event id
 * @param {Boolean} [sort=false] If true, sort order is set to "LIMIT 1".
 * Otherwise it is set to "jobId DESC LIMIT 1".
 * @return {Object} Recording object or null if not found.
 */
o5.platform.btv.PVRManager.getJobByEvent = function getJobByEvent (eventId, sort) {
    this.logEntry();
    if (!sort) {
        sort = "jobId DESC LIMIT 1";
    } else {
        sort = "LIMIT 1";
    }
    var resultSet = CCOM.Scheduler.getJobsRSByQuery("*", "eventId='" + eventId + "'", sort),
        job = this._getObjectFromResultSet(resultSet);
    this.logExit();
    return job;
};

/**
 * Retrieves a task by its task id.
 * @method getTask
 * @param {Number} taskId The task identifier
 * @return {Object} Mapped recording object or null if not found.
 */
o5.platform.btv.PVRManager.getTask = function getTask (taskId) {
    this.logEntry();
    var resultSet = CCOM.Scheduler.getTasksRSByQuery("*", "taskId='" + String(taskId) + "'", "startTime"),
        task = o5.platform.btv.RecordingFactory.mapObject(this._getObjectFromResultSet(resultSet));
    this.logExit();
    return task;
};

/**
 * Retrieves a task associated with an event.
 * @method getTaskByEventId
 * @param {String} eventId The event identifier
 * @param {Boolean} [sort=false] If true, sort order is set to "LIMIT 1".
 * Otherwise it is set to "taskId DESC LIMIT 1".
 * @param {String} [properties="*"] A comma-separated string of property names indicating which content properties
 * should be retrieved. Defaults to query for all available properties.
 * @return {Object} Mapped recording object or null if not found.
 */
o5.platform.btv.PVRManager.getTaskByEventId = function getTaskByEventId (eventId, sort, properties) {
    this.logEntry();
    if (!sort) {
        sort = "taskId DESC LIMIT 1";
    } else {
        sort = "LIMIT 1";
    }
    var isInactive = 0,
        resultSet = CCOM.Scheduler.getTasksRSByQuery(properties || "*", "eventId='" + eventId + "' AND inactive=" + isInactive + this._getMediumIdCriteria(), sort),
        task = o5.platform.btv.RecordingFactory.mapObject(this._getObjectFromResultSet(resultSet));
    this.logExit();
    return task;
};

/**
 * Returns the PVR task associated with an event.
 * @method _getPVRTaskByEvent
 * @private
 * @param {String} eventId Event id
 * @param {String} [sort="taskId DESC"] Sort order
 * @param {String} [properties="*"] A comma-separated string of property names indicating which content properties
 * should be retrieved. Defaults to query for all available properties.
 * @return {Object} Mapped recording object or null if not found.
 */
o5.platform.btv.PVRManager._getPVRTaskByEvent = function _getPVRTaskByEvent (eventId, sort, properties) {
    this.logEntry();
    if (!sort) {
        sort = "taskId DESC";
    }
    if (eventId) {
        var isInactive = 0,
            resultSet = CCOM.Scheduler.getTasksRSByQuery(properties || "*", "eventId='" + eventId + "' AND taskType='" + this.TASK_TYPE.RECORDING + "' AND inactive=" + isInactive + this._getMediumIdCriteria(), sort),
            task = o5.platform.btv.RecordingFactory.mapObject(this._getObjectFromResultSet(resultSet));
        this.logExit();
        return task;
    }
    this.logExit();
    return null;
};

/**
 * Returns the task associated with an active reminder,
 * i.e. will NOT return any reminders that are marked as cancelled.
 * @method getScheduledReminderByEvent
 * @param {String} eventId Event id
 * @return {Object} Mapped recording object or null if not found.
 */
o5.platform.btv.PVRManager.getScheduledReminderByEvent = function getScheduledReminderByEvent (eventId) {
    this.logEntry();
    if (eventId) {
        var resultSet = CCOM.Scheduler.getTasksRSByQuery("*", "eventId='" + eventId + "' AND taskType='" + this.TASK_TYPE.REMINDER + "' AND objectState=" + String(this.OBJECT_STATE.BOOKED), "startTime"),
            task = o5.platform.btv.RecordingFactory.mapObject(this._getObjectFromResultSet(resultSet));
        this.logExit();
        return task;
    }
    this.logExit();
    return null;
};

/**
 * Returns the task associated with an active series reminder.
 * @method getScheduledReminderBySeriesEvent
 * @param {String} eventId Event id
 * @return {Object} Mapped recording object or null if not found.
 */
o5.platform.btv.PVRManager.getScheduledReminderBySeriesEvent = function getScheduledReminderBySeriesEvent (eventId) {
    this.logEntry();
    if (eventId) {
        var resultSet = CCOM.Scheduler.getTasksRSByQuery("*", "eventId='" + eventId + "' AND taskType='" + this.TASK_TYPE.REMINDER + "' AND scheduleType='" + this.JOB_TYPE.SERIES + "' AND objectState=" + String(this.OBJECT_STATE.BOOKED), "startTime"),
            task = o5.platform.btv.RecordingFactory.mapObject(this._getObjectFromResultSet(resultSet));
        this.logExit();
        return task;
    }
    this.logExit();
    return null;
};

/**
 * Returns the reminder tasks associated
 * i.e. will NOT return any reminders that are marked as cancelled.
 * @method getScheduledReminder
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getScheduledReminder = function getScheduledReminder () {
    this.logEntry();
    var resultSet = CCOM.Scheduler.getTasksRSByQuery("*", "taskType='" + this.TASK_TYPE.REMINDER + "' AND objectState=" + String(this.OBJECT_STATE.BOOKED), "startTime"),
        tasks = this._getArrayFromResultSet(resultSet);
    this.logExit();
    return tasks;
};

/**
 * Returns the reminder tasks associated with an event start time,
 * i.e. will NOT return any reminders that are marked as cancelled.
 * @method getScheduledReminderByStartTime
 * @param {String} startTime Start time in UTC milliseconds
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getScheduledReminderByStartTime = function getScheduledReminderByStartTime (startTime) {
    this.logEntry();
    if (startTime) {
        var resultSet = CCOM.Scheduler.getTasksRSByQuery("*", "startTime='" + startTime + "' AND taskType='" + this.TASK_TYPE.REMINDER + "' AND objectState<" + String(this.OBJECT_STATE.ERROR), "startTime"),
            tasks = this._getArrayFromResultSet(resultSet);
        this.logExit();
        return tasks;
    }
    this.logExit();
    return [];
};

/**
 * Retrieves a tasks by its start time and object state.
 * @method getRecordingsByCurrentTimeAndState
 * @param {String} [startTime=current time] Start time in UTC milliseconds
 * @param {Number} [state=1] Object state, according to property values returned from `getObjectStates`.
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getRecordingsByCurrentTimeAndState =
function getRecordingsByCurrentTimeAndState (startTime, state) {
    this.logEntry();
    var objectState = state,
        currentTime = startTime || new Date().getTime(),
        resultSet,
        tasks = [];

    if ((state === undefined) || (state === null)) {
        objectState = 1;
    }
    resultSet = CCOM.Scheduler.getTasksRSByQuery("cumulativeStatus, jobId, taskType, keep, startTime, serviceId, eventId, parentalRating, episodeId, seriesName, seriesId, title, taskId, hardPostpaddingDuration, hardPrepaddingDuration, softPrepaddingDuration, endTime, softPostpaddingDuration, shortDesc, completeStatus, taskOpState, objectState, bookmark, lastPlayedOffset, expirationDate", "taskType='" + this.TASK_TYPE.RECORDING + "' AND startTime<'" + currentTime + "' AND endTime>'" + currentTime + "' AND objectState<=" + String(objectState) + this._getMediumIdCriteria(), "startTime");
    tasks = this._getArrayFromResultSet(resultSet);
    this.logExit();
    return tasks;
};

/**
 * Retrieves an array of tasks for the given job id
 * @method getTasksForJobId
 * @param {Number} jobId Job id
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getTasksForJobId = function getTasksForJobId (jobId) {
    this.logEntry();
    if (jobId) {
        var resultSet = CCOM.Scheduler.getTasksRSByQuery("*", "jobId='" + jobId + "'", "startTime"),
            tasks = this._getArrayFromResultSet(resultSet);
        this.logExit();
        return tasks;
    }
    this.logExit();
    return [];
};

/**
 * Retrieves a list of tasks for a given status
 * @method _getRecordingsByStatus
 * @private
 * @param {Number} status Task status to search for
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager._getRecordingsByStatus = function _getRecordingsByStatus (status) {
    var properties = "cumulativeStatus, jobId, taskType, keep, startTime, serviceId, eventId, parentalRating, " +
            "episodeId, seriesName, seriesId, title, taskId, scheduleType, hardPostpaddingDuration, " +
            "hardPrepaddingDuration, softPrepaddingDuration, endTime, softPostpaddingDuration, shortDesc, " +
            "longDesc, completeStatus, taskOpState, objectState, bookmark, lastPlayedOffset, expirationDate",
        criteria = "taskType='" + this.TASK_TYPE.RECORDING + "' AND objectState=" + String(status),
        orderBy = "startTime",
        isInactive,
        resultSet,
        tasks;

    if (status !== undefined || status !== null) {
        isInactive = (status === 0) ? "0" : "0" + this._getMediumIdCriteria();
        resultSet = CCOM.Scheduler.getTasksRSByQuery(properties, criteria + " AND inactive=" + isInactive, orderBy);
        tasks = this._getArrayFromResultSet(resultSet);
        return tasks;
    }
    return [];
};

/**
 * Gets all series recordings that match a given completion status, or every series recording
 * if no status is passed in
 * @method _getSeriesRecordingsByStatus
 * @private
 * @param {Number} [completionStatus] Recording status, which is one of `TaskStatus` values. If nothing is
 * passed in, returns all series recordings
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager._getSeriesRecordingsByStatus = function _getSeriesRecordingsByStatus (completionStatus) {
    this.logEntry();
    var condition = "",
        resultSet,
        tasks,
        TaskStatus = o5.platform.btv.PVRManager.TaskStatus,
        isInactive = "0",
        isTaskScheduled = false;

    if (completionStatus) {
        if (completionStatus === TaskStatus.TASK_STATUS_SCHEDULED) {
            condition = " AND objectState=" + String(this.OBJECT_STATE.BOOKED);
            isTaskScheduled = true;
        } else {
            if (completionStatus === TaskStatus.TASK_STATUS_COMPLETED) {
                condition = " AND completeStatus=" + String(this.COMPLETION_STATUS_FULL);
            } else if (completionStatus === TaskStatus.TASK_STATUS_PARTIAL) {
                condition = " AND completeStatus=" + String(this.COMPLETION_STATUS_PARTIAL);
            }
            condition += " AND (objectState=" + String(this.OBJECT_STATE.PROCESSED) + " OR objectState=" + String(this.OBJECT_STATE.FINAL) + ")";
        }
    } else {
        condition += " AND objectState<" + String(this.OBJECT_STATE.ERROR);
    }
    condition += isTaskScheduled ? " AND inactive=" + isInactive : " AND inactive=" + isInactive + this._getMediumIdCriteria();
    resultSet = CCOM.Scheduler.getTasksRSByQuery("cumulativeStatus, jobId, taskType, keep, startTime, serviceId, eventId, parentalRating, episodeId, seriesName, seriesId, title, taskId, scheduleType, softPrepaddingDuration, endTime, softPostpaddingDuration, shortDesc, longDesc, completeStatus, taskOpState, objectState, bookmark, lastPlayedOffset, expirationDate", "taskType='" + this.TASK_TYPE.RECORDING + "' AND scheduleType='" + this.JOB_TYPE.SERIES + "'" + condition, "startTime");
    tasks = this._getArrayFromResultSet(resultSet);
    this.logExit();
    return tasks;
};

/**
 * Returns an array of all active tasks.
 * @method _getActiveTasks
 * @private
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager._getActiveTasks = function _getActiveTasks () {
    return this._getRecordingsByStatus(this.OBJECT_STATE.PROCESSING);
};

/**
 * Returns an array of all scheduled, active and recorded tasks (including partials).
 * ONLY deleted and error tasks are NOT shown.
 * @method _getAllRecordings
 * @private
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager._getAllRecordings = function _getAllRecordings () {
    this.logEntry();
    var resultSet = CCOM.MediaLibrary.getEntryRSByQuery("*", "taskType='" + this.TASK_TYPE.RECORDING + "' AND (objectState<=" + String(this.OBJECT_STATE.ERROR) + ")", "Tasks", "startTime, taskId DESC"),
        tasks = this._getArrayFromResultSet(resultSet);
    this.logExit();
    return tasks;
};

/**
 * Returns an array of all recorded tasks (including partials).
 * ONLY deleted and error tasks are NOT shown.
 * @method _getWatchedRecordings
 * @private
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager._getWatchedRecordings = function _getWatchedRecordings () {
    var isInactive = "0",
        resultSet = CCOM.MediaLibrary.getEntryRSByQuery("cumulativeStatus, jobId, taskType, keep, startTime, serviceId, eventId, parentalRating, episodeId, seriesName, seriesId, title, taskId, scheduleType, softPrepaddingDuration, endTime, softPostpaddingDuration, shortDesc, completeStatus, taskOpState, objectState, bookmark, lastPlayedOffset, expirationDate", "taskType='" + this.TASK_TYPE.RECORDING + "' AND objectState IN(" + String(this.OBJECT_STATE.STOP_PROCESSING) + ", " + String(this.OBJECT_STATE.PROCESSED) + "," + String(this.OBJECT_STATE.FINAL) + ", " + String(this.OBJECT_STATE.ERROR) + ") AND (lastPlayedOffset = 0) AND inactive=" + isInactive + this._getMediumIdCriteria(), "Tasks", "startTime"),
        tasks = this._getArrayFromResultSet(resultSet);
    return tasks;
};

/**
 * Returns an array of all recorded tasks (including partials)
 * ONLY deleted and error tasks are NOT shown.
 * @method _getUnWatchedRecordings
 * @private
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager._getUnWatchedRecordings = function _getUnWatchedRecordings () {
    var isInactive = "0",
        resultSet = CCOM.MediaLibrary.getEntryRSByQuery("cumulativeStatus, jobId, taskType, keep, startTime, serviceId, eventId, parentalRating, episodeId, seriesName, seriesId, title, taskId, scheduleType, softPrepaddingDuration, endTime, softPostpaddingDuration, shortDesc, completeStatus, taskOpState, objectState, bookmark, lastPlayedOffset, expirationDate", "taskType='" + this.TASK_TYPE.RECORDING + "' AND objectState IN(" + String(this.OBJECT_STATE.STOP_PROCESSING) + ", " + String(this.OBJECT_STATE.PROCESSED) + "," + String(this.OBJECT_STATE.FINAL) + ", " + String(this.OBJECT_STATE.ERROR) + ") AND (lastPlayedOffset IS NULL OR lastPlayedOffset != 0) AND inactive=" + isInactive + this._getMediumIdCriteria(), "Tasks", "startTime"),
        tasks = this._getArrayFromResultSet(resultSet);
    return tasks;
};

/**
 * Returns an array of all tasks that are of type timed recording,
 * i.e. scheduleType = ONE_TIME or RPT_TIME
 * @method _getTimedTasks
 * @private
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager._getTimedTasks = function _getTimedTasks () {
    var resultSet = CCOM.MediaLibrary.getEntryRSByQuery("*", "taskType='" + this.TASK_TYPE.RECORDING + "' AND objectState<" + String(this.OBJECT_STATE.ERROR) + " AND (scheduleType='" + this.JOB_TYPE.SINGLE + "' OR scheduleType='" + this.JOB_TYPE.REPEAT + "')" + this._getMediumIdCriteria(), "Tasks", "startTime"),
        tasks = this._getArrayFromResultSet(resultSet);
    return tasks;
};

/**
 * Get task with given jobId
 * @method getTimedTasksforJobId
 * @param {Number} jobId Job id
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getTimedTasksforJobId = function getTimedTasksforJobId (jobId) {
    this.logEntry();
    var resultSet = CCOM.MediaLibrary.getEntryRSByQuery("taskId", "taskType='" + this.TASK_TYPE.RECORDING + "' AND objectState BETWEEN " + String(this.OBJECT_STATE.SUSPEND_PROCESSING) + " AND " + String(this.OBJECT_STATE.ERROR) + " AND jobId='" + jobId + "' AND (scheduleType='" + this.JOB_TYPE.SINGLE + "' OR scheduleType='" + this.JOB_TYPE.REPEAT + "')", "Tasks", "startTime"),
        tasks = this._getArrayFromResultSet(resultSet);
    this.logExit();
    return tasks;
};

/**
 * Returns all tasks from scheduler that are of type PVR, have not been deleted
 * and are partially recorded.
 * @method getPartialRecordings
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getPartialRecordings = function getPartialRecordings () {
    this.logEntry();
    var resultSet = CCOM.MediaLibrary.getEntryRSByQuery("cumulativeStatus, jobId, taskType, keep, startTime, serviceId, eventId, parentalRating, episodeId, seriesName, seriesId, title, taskId, scheduleType, hardPostpaddingDuration, hardPrepaddingDuration, softPrepaddingDuration, endTime, softPostpaddingDuration, shortDesc, longDesc, completeStatus, taskOpState, objectState, bookmark, lastPlayedOffset, expirationDate", "taskType='" + this.TASK_TYPE.RECORDING + "' AND completeStatus=" + String(this.COMPLETION_STATUS_PARTIAL) + " AND (objectState=" + String(this.OBJECT_STATE.PROCESSED) + " OR objectState=" + String(this.OBJECT_STATE.FINAL) + ")" + this._getMediumIdCriteria(), "Tasks", "startTime"),
        recordings = this._getArrayFromResultSet(resultSet);
    this.logExit();
    return recordings;
};

/**
 * Returns all failed tasks from scheduler that are of type PVR.
 * @method getFailedRecordings
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getFailedRecordings = function getFailedRecordings () {
    this.logEntry();
    var resultSet = CCOM.MediaLibrary.getEntryRSByQuery("cumulativeStatus, jobId, taskType, keep, startTime, serviceId, eventId, parentalRating, episodeId, seriesName, scheduleType, seriesId, title, taskId, hardPostpaddingDuration, hardPrepaddingDuration, softPrepaddingDuration, endTime, softPostpaddingDuration, shortDesc, longDesc, completeStatus, taskOpState, objectState, bookmark, lastPlayedOffset, expirationDate", "taskType='" + this.TASK_TYPE.RECORDING + "' AND (objectState=" + String(this.OBJECT_STATE.SUSPEND_PROCESSING) + " OR objectState=" + String(this.OBJECT_STATE.ERROR) + ")" + this._getMediumIdCriteria(), "Tasks", "startTime"),
        recordings = this._getArrayFromResultSet(resultSet);
    this.logExit();
    return recordings;
};

/**
 * Returns a list of all fully recorded tasks
 * @method _getCompletedRecordings
 * @private
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager._getCompletedRecordings = function _getCompletedRecordings () {
    this.logEntry();
    var orderBy = "startTime",
        resultSet,
        recordings;

    switch (this._recordingsReturnOrder) {
        case this.RecordingsReturnOrderType.BY_DATE:
            orderBy = "startTime";
            break;
        case this.RecordingsReturnOrderType.BY_DATE_DESC:
            orderBy = "startTime DESC";
            break;
        case this.RecordingsReturnOrderType.BY_NAME:
            orderBy = "case when seriesId is null then title else seriesId end";
            break;
        default:
            orderBy = "startTime";
            break;
    }

    resultSet = CCOM.MediaLibrary.getEntryRSByQuery("cumulativeStatus, jobId, taskType, keep, startTime, serviceId, eventId, parentalRating, episodeId, seriesName, seriesId, title, taskId, hardPostpaddingDuration, hardPrepaddingDuration, softPrepaddingDuration, scheduleType, endTime, softPostpaddingDuration, shortDesc, longDesc, completeStatus, taskOpState, objectState, bookmark, lastPlayedOffset, expirationDate", "taskType='" + this.TASK_TYPE.RECORDING + "' AND completeStatus=" + String(this.COMPLETION_STATUS_FULL) + " AND (objectState=" + String(this.OBJECT_STATE.PROCESSED) + " OR objectState=" + String(this.OBJECT_STATE.FINAL) + ")" + this._getMediumIdCriteria(), "Tasks", orderBy);
    recordings = this._getArrayFromResultSet(resultSet);
    this.logExit();
    return recordings;
};

/**
 * Executes the given listeners.
 * @method _executeListeners
 * @private
 * @param {Array} listeners Array of listeners to fire
 * @param {Object} data Data to pass to listener call
 */
o5.platform.btv.PVRManager._executeListeners = function _executeListeners (listeners, data) {
    this.logEntry();
    var i;
    for (i = 0; i < listeners.length; i++) {
        listeners[i].listener.call(listeners[i].callFunc, data);
    }
    this.logExit();
};

/**
 * Returns an array of 7 elements that represent Monday - Sunday, where Monday is index 0.
 * Value of true in the array represents a repeat recording for that day.
 * @method _checkRepeatDaysArray
 * @private
 * @param {Array} daysArray An array of size 7 with boolean values
 * @return {Array} An array of size 7 with boolean values
 */
o5.platform.btv.PVRManager._checkRepeatDaysArray = function _checkRepeatDaysArray (daysArray) {
    var i,
        daysInAWeek = 7,
        repeatDaysArray = [],
        atLeastOneDayRepeated = false;
    // Make sure the array is boolean
    for (i = 0; i < daysInAWeek; i++) {
        repeatDaysArray[i] = (daysArray[i] && daysArray[i] === true);
        if (!atLeastOneDayRepeated && repeatDaysArray[i]) {
            atLeastOneDayRepeated = true;
        }
    }
    return atLeastOneDayRepeated ? repeatDaysArray : [];
};

/**
 * Returns an array of 7 elements that represent Monday - Sunday, where Monday is index 0.
 * Value of true in the array represents a repeat recording for that day. Array is populated
 * depending on the given frequency.
 * E.g. if frequency type is o5.platform.btv.PVRManager.Frequency.DAILY then an array of 7 elements with
 * true values is returned
 * @method _getRepeatDaysArrayForFrequency
 * @private
 * @param {Number} frequency Recording frequency, which is one of the `Frequency` enumeration.
 * @return {Array} An array of 7 boolean values
 */
o5.platform.btv.PVRManager._getRepeatDaysArrayForFrequency = function _getRepeatDaysArrayForFrequency (frequency) {
    switch (frequency) {
        case o5.platform.btv.PVRManager.Frequency.DAILY:
            return [ true, true, true, true, true, true, true ];
        case o5.platform.btv.PVRManager.Frequency.WEEKLY:
            var todaysIndex = new Date().getDay() - 1,
                i,
                repeatDays = [];
            if (todaysIndex < 0) {
                todaysIndex = 6;
            }
            for (i = 0; i < 7; i++) {
                repeatDays.push(i === todaysIndex ? true : false);
            }
            return repeatDays;
        case o5.platform.btv.PVRManager.Frequency.WEEKDAYS:
            return [ true, true, true, true, true, false, false ];
        case o5.platform.btv.PVRManager.Frequency.WEEKENDS:
            return [ false, false, false, false, false, true, true ];
        default:
            return [];
    }
};

/**
 * Returns the status of a recording task for the given task
 * @method getStatusForTask
 * @param {Object} task Mapped recording object
 * @return {Number} Status of the scheduled task, which is one of the `TaskStatus` enumeration.
 */
o5.platform.btv.PVRManager.getStatusForTask = function getStatusForTask (task) {
    this.logDebug("Got task with ID: " + task.taskId + ", objectState: " + task.objectState + ", completeStatus: " + task.completeStatus);
    if (this._isTaskObjectActive(task)) {
        if (task.recordingType === o5.data.Recording.RECORDING_TYPE.SERIES) {
            this.logDebug("Returning status ACTIVE IN SERIES");
            return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_ACTIVE_IN_SERIES;
        } else {
            this.logDebug("Returning status ACTIVE");
            return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_ACTIVE;
        }
    }
    if (this._isTaskObjectScheduled(task)) {
        if (task.recordingType === o5.data.Recording.RECORDING_TYPE.SERIES) {
            this.logDebug("Returning status SCHEDULED BY SERIES");
            return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_SCHEDULED_BY_SERIES;
        } else {
            this.logDebug("Returning status SCHEDULED");
            return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_SCHEDULED;
        }
    }
    if (this._isTaskObjectPartial(task)) {
        this.logDebug("Returning status PARTIAL");
        return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_PARTIAL;
    }
    if (this._isTaskObjectComplete(task)) {
        this.logDebug("Returning status COMPLETE");
        return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_COMPLETED;
    }
    return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_UNSCHEDULED;

};

/**
 * Retrieves task by its start time, end time, and service id.
 * @method getTaskByServiceIdAndTime
 * @param {String} eventStartTime Event start time
 * @param {String} eventEndTime Event end time
 * @param {String} serviceId Service id
 * @param {String} eventId Event id
 * @return {Object} Mapped recording object or null if not found.
 */
o5.platform.btv.PVRManager.getTaskByServiceIdAndTime =
function getTaskByServiceIdAndTime (eventStartTime, eventEndTime, serviceId, eventId) {
    this.logEntry();
    if (eventStartTime && eventEndTime && serviceId) {
        var resultSet = eventId !== 0 ? CCOM.Scheduler.getTasksRSByQuery("cumulativeStatus, taskType, jobId, taskId, eventId, completeStatus, taskOpState, objectState, scheduleType, keep, actualStartTime, actualStopTime, hardPostpaddingDuration, hardPrepaddingDuration, softPrepaddingDuration, softPostpaddingDuration", "taskType='" + this.TASK_TYPE.RECORDING + "' AND serviceId= '" + serviceId + "'AND objectState< '" + String(this.OBJECT_STATE.SUSPEND_PROCESSING) + "' AND startTime <'" + eventEndTime + "' AND endTime > " + String(eventStartTime) + this._getMediumIdCriteria(), "taskId ASC LIMIT 1") : CCOM.Scheduler.getTasksRSByQuery("cumulativeStatus, taskType, taskId, jobId, eventId, completeStatus, actualStartTime, actualStopTime, taskOpState, objectState, scheduleType, hardPostpaddingDuration, hardPrepaddingDuration, softPrepaddingDuration, softPostpaddingDuration", "taskType='" + this.TASK_TYPE.RECORDING + "' AND serviceId= '" + serviceId + "' AND objectState< '" + String(this.OBJECT_STATE.SUSPEND_PROCESSING) + "'" + this._getMediumIdCriteria(), "taskId ASC LIMIT 1"),
            task = o5.platform.btv.RecordingFactory.mapObject(this._getObjectFromResultSet(resultSet));
        this.logExit();
        return task;
    }
    this.logExit();
    return null;
};

/**
 * Retrieves an event recording status by its start time, end time, and service id.
 * @method getEventRecordingStatusByServiceId
 * @param {String} eventStartTime Event start time
 * @param {String} eventEndTime Event end time
 * @param {String} serviceId Service id
 * @param {String} eventId Event id
 * @return {Number} Status of the recording task, which is one of the `TaskStatus` enumeration.
 */
o5.platform.btv.PVRManager.getEventRecordingStatusByServiceId =
function getEventRecordingStatusByServiceId (eventStartTime, eventEndTime, serviceId, eventId) {
    this.logEntry();
    if (serviceId && this._pvrMediumId && eventStartTime && eventEndTime) {
        var resultSet = eventId !== 0 ? CCOM.Scheduler.getTasksRSByQuery("cumulativeStatus, taskType, taskId, completeStatus, taskOpState, objectState, scheduleType", "taskType='" + this.TASK_TYPE.RECORDING + "' AND serviceId= '" + serviceId + "' AND startTime <'" + eventEndTime + "' AND objectState< '" + String(this.OBJECT_STATE.SUSPEND_PROCESSING) + "' AND startTime BETWEEN '" + eventStartTime + "' AND '" + eventEndTime + "' AND endTime > " + String(eventStartTime) + this._getMediumIdCriteria(), "taskId ASC LIMIT 1") : CCOM.Scheduler.getTasksRSByQuery("cumulativeStatus, taskType, taskId, completeStatus, taskOpState, objectState, scheduleType", "taskType='" + this.TASK_TYPE.RECORDING + "' AND serviceId= '" + serviceId + "' AND objectState< '" + String(this.OBJECT_STATE.SUSPEND_PROCESSING) + "'" + this._getMediumIdCriteria(), "taskId ASC LIMIT 1"),
            task = o5.platform.btv.RecordingFactory.mapObject(this._getObjectFromResultSet(resultSet));
        if (task && this._isTaskObjectPVR(task)) {
            this.logExit();
            return this.getStatusForTask(task);
        }
        this.logExit();
        return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_UNSCHEDULED;
    }
    this.logExit();
    return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_UNSCHEDULED;
};

/**
 * Returns a list of all recordings for a given series
 * @method getAllRecordingsForSeries
 * @param {String} seriesId Series id
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getAllRecordingsForSeries = function getAllRecordingsForSeries (seriesId) {
    if (seriesId) {
        var resultSet = CCOM.Scheduler.getTasksRSByQuery("*", "seriesId='" + seriesId + "' AND taskType='" + this.TASK_TYPE.RECORDING + "' AND objectState<>" + this.OBJECT_STATE.DELETED + this._getMediumIdCriteria(), 'startTime'),
            recordings = this._getArrayFromResultSet(resultSet);
        return recordings;
    }
    return [];
};

/**
 * Allows query of CCOM Tasks database using passed in properties, selection criteria, and sort order
 * @method getTasksByQuery
 * @param {String} [properties="*"] A comma-separated string of property names indicating which content properties
 * should be retrieved. Defaults to query for all available properties.
 * @param {String} [criteria=null] The selection criteria (the where clause). Null implies no filtering.
 * @param {String} [order="startTime"] Sort order
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getTasksByQuery = function getTasksByQuery (properties, criteria, order) {
    properties = properties || "*";
    criteria = criteria || null;
    order = order || "startTime";
    var resultSet = CCOM.Scheduler.getTasksRSByQuery(properties, criteria, order);
    return this._getArrayFromResultSet(resultSet);
};

/**
 * Gets the current active recordings and stores the data
 * @method _storeActiveRecordings
 * @private
 */
o5.platform.btv.PVRManager._storeActiveRecordings = function _storeActiveRecordings () {
    var activeTasks = this._getActiveTasks(),
        i;
    for (i = 0; i < activeTasks.length; i++) {
        this._activeRecordings[activeTasks[i].serviceId] = activeTasks[i].taskId;
    }
};

/**
 * Calls PVRRMCache.initialise() to cache tasks in PVR RAM cache
 * @method _cachePVRRMDRtasks
 * @private
 */
o5.platform.btv.PVRManager._cachePVRRMDRtasks = function _cachePVRRMDRtasks () {
    o5.platform.btv.PVRRMCache.initialise();
};

/* CCOM event listener call back methods */

/**
 * Handles the CCOM scheduler addJobCompleted listener callback when a recording request is made.
 * @method _addJobCompletedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._addJobCompletedListener = function _addJobCompletedListener (e)
{
    this.logDebug("job:" + e.jobId);

    this._cachePVRRMDRtasks();

    var i;
    var me = o5.platform.btv.PVRManager;
    var tasks = this.getTasksForJobId(e.jobId);
    var unscheduledTasks = [];
    var taskOverlapsHandle;
    var taskOverlapsCount = 0;
    var existingConflicts = [];
    var taskOverlapsListener;

    if (e.status !== CCOM.Scheduler.SUCCESS_COMPLETE)
    {
        this.logError("Job object created failed! e.status = " + e.status);
    }

    taskOverlapsListener = function (overlapObj)
    {
        if(overlapObj.handle !== taskOverlapsHandle)
            return;

        taskOverlapsCount++;

        if (overlapObj.error === undefined)
        {
            for (i = 0; i < overlapObj.taskOverlaps.length; i++)
            {
                if (!existingConflicts[overlapObj.taskOverlaps[i].taskId] &&
                    (overlapObj.taskOverlaps[i].fulfillmentStatus === me.COMPLETION_STATUS_NONE ||
                     overlapObj.taskOverlaps[i].fulfillmentStatus === me.COMPLETION_STATUS_PARTIAL))
                {
                    unscheduledTasks.push(me.getTask(overlapObj.taskOverlaps[i].taskId));
                    existingConflicts[overlapObj.taskOverlaps[i].taskId] = true;
                }
            }
        }

        if (taskOverlapsCount === tasks.length)
        {
            CCOM.Scheduler.removeEventListener("getTaskOverlapsOK", taskOverlapsListener, false);
            CCOM.Scheduler.removeEventListener("getTaskOverlapsFailed", taskOverlapsListener, false);
            if (unscheduledTasks.length > 0)
            {
                me._conflictManager.handleConflictsForTasks(unscheduledTasks, function (conflicts) {
                    o5.platform.btv.PVRManager._recordingRequestConflictsCallback(unscheduledTasks, conflicts);
                });
            } else
            {
                me._executeListeners(me._addJobCompletedListeners, e.jobId);
                me._executeListeners(me._uiRefreshListeners);
            }
        }
        else
        {
            taskOverlapsHandle = CCOM.Scheduler.getTaskOverlaps(tasks[taskOverlapsCount].taskId);
        }
    };

    if (tasks[0])
    {
        if (tasks[0].taskType === this.TASK_TYPE.REMINDER)
        {
           this._executeListeners(this._uiRefreshListeners);
        }
        else
        {
            CCOM.Scheduler.addEventListener("getTaskOverlapsOK", taskOverlapsListener);
            CCOM.Scheduler.addEventListener("getTaskOverlapsFailed", taskOverlapsListener);
            taskOverlapsHandle = CCOM.Scheduler.getTaskOverlaps(tasks[0].taskId);
        }
    }
};

/**
 * Handles the CCOM scheduler addTaskFailed listener callback when a recording request fails.
 * @method _addTaskFailedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._addTaskFailedListener = function _addTaskFailedListener (e) {
    this.logError("ERROR Task add failed: jobId:" + e.jobId + " reason:" + e.reason);
    if (this._recordingRequestFailedCallback) {
        this._recordingRequestFailedCallback(e.jobId);
    }
};

/**
 * Handles the CCOM scheduler addJobFailed listener callback when a recording request fails.
 * @method _addJobFailedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._addJobFailedListener = function _addJobFailedListener (e) {
    this.logError("ERROR Job add failed");
    if (this._addJobFailedCallback) {
        this._addJobFailedCallback(e);
    }
};

/**
 * A listener method that maintains the SchedulerMap for recording requests made from outside
 * of this class, e.g. Series recordings
 * @method _taskAboutToStartListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._taskAboutToStartListener = function _taskAboutToStartListener (e) {
    this.logEntry();
    var viewerPeriodInMilliSeconds = parseInt(o5.platform.system.Preferences.get("/system/opentv/scheduler/JobTaskManager/viewerPeriod", true) * 1000, 10),
        timeInUtcMilliseconds = parseInt(new Date().getTime(), 10),
        tenSecondsInMilliseconds = 60000,
        tenSecondsAfterRecordingStartsInUtcMilliseconds = parseInt(timeInUtcMilliseconds + viewerPeriodInMilliSeconds + tenSecondsInMilliseconds, 10),
        resultSet,
        tasks,
        startTime,
        taskStatus,

        handleConflictsForTimeCallback = function (conflicts) {
            this.logDebug("handleConflictsForTimeCallback - conflicts.length = " + conflicts.length);
            if (conflicts.length > 1) {
                this._taskAboutToStartConflictCallback([this.getTask(e.taskId)], conflicts);
            } else {
                this._taskAboutToStartCallback(e.taskId);
            }
        }.bind(this);
    taskStatus = this.getTask(e.taskId);
    startTime = taskStatus.startTime;
    if (this._scheduledRecordStartTime < startTime) {
        setTimeout(function () {
            this._hddAvailability = this._hddAvailabilityFunc ? this._hddAvailabilityFunc() : null;
            if (this._hddAvailability === null || this._hddAvailability === undefined) {
                this._scheduledRecordStartTime = startTime;
                resultSet = CCOM.Scheduler.getTasksRSByQuery("*", "startTime='" + this._scheduledRecordStartTime + "' AND taskType='" + this.TASK_TYPE.RECORDING + "' AND objectState=" + String(this.OBJECT_STATE.BOOKED), "startTime");
                tasks = this._getArrayFromResultSet(resultSet);
            }
        }.bind(this), 3000);
    }
    this._conflictManager.handleConflictsForTime(tenSecondsAfterRecordingStartsInUtcMilliseconds, handleConflictsForTimeCallback);
    this.logExit();
};

/**
 * Handles the CCOM scheduler TaskStarted listener callback when a scheduled task starts.
 * Custom behavior is defined in the taskStartedCallback and a call to update the UI occurs.
 * @method _taskStartedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._taskStartedListener = function _taskStartedListener (e) {
    this.logEntry();
    this.logDebug("task:" + e.taskId);
    var i,
        activeTasks = this._getActiveTasks();
    for (i = 0; i < activeTasks.length; i++) {
        if (activeTasks[i].taskId === e.taskId) {
            this._activeRecordings[activeTasks[i].serviceId] = e.taskId;
            break;
        }
    }
    if (this._taskStartedCallback) {
        this._taskStartedCallback(e.taskId);
    }
    this._cachePVRRMDRtasks();
    this._executeListeners(this._uiRefreshListeners);
    this.logExit();
};

/**
 * Handles the CCOM scheduler TaskEnded listener callback when a task finishes recording.
 * Custom behavior is defined in the taskEndedCallback and a call to update the UI occurs.
 * @method _taskStoppedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._taskStoppedListener = function _taskStoppedListener (e) {
    this.logEntry();
    this._taskCount++;
    var unPlugStatus,
        task,
        tasksArrayLength,
        tasksEndTimeArrayLength,
        maxEndTime,
        i,
        index;
    for (index in this._activeRecordings) {
        if (this._activeRecordings.hasOwnProperty(index) && e.taskId === this._activeRecordings[index]) {
            delete this._activeRecordings[index];
        }
    }
    task = this.getTask(e.taskId);
    this._totalTasks.push(task.jobId);
    this._tasksEndTimeArray.push(task.endTime);
    tasksArrayLength = this._totalTasks.length;
    tasksEndTimeArrayLength = this._tasksEndTimeArray.length;
    setTimeout(function () {
        this._taskStopCount++;
        unPlugStatus = this._unPlugStatusOfDriveFunc ? this._unPlugStatusOfDriveFunc() : false;
        this._hddAvailability = this._hddAvailabilityFunc ? this._hddAvailabilityFunc() : null;
        //this._hddAvailability = o5.app.USBHotPlug.getAssociatedInternalMediumId();
        if ((this._hddAvailability === null || this._hddAvailability === undefined) && (this._taskStopCount === 1) && e.taskType === this.TASK_TYPE.RECORDING) {
            for (i = 0; i < tasksEndTimeArrayLength - 1; i++) {
                if (this._tasksEndTimeArray[i] < this._tasksEndTimeArray[i + 1]) {
                    maxEndTime = this._tasksEndTimeArray[i + 1];
                } else {
                    maxEndTime = this._tasksEndTimeArray[i];
                    this._tasksEndTimeArray[i] = this._tasksEndTimeArray[i + 1];
                    this._tasksEndTimeArray[i + 1] = maxEndTime;
                }
            }
            if (unPlugStatus) {
                tasksArrayLength = this._totalTasks.length;
                if (tasksArrayLength === this._taskCount) {
                    //o5.app.USBHotPlug.showHDDRemovedActiveRecordPopUp(this._totalTasks);
                }
            }
        }
    }.bind(this), 5000);
    if (task.endTime === this._tasksEndTimeArray[tasksEndTimeArrayLength - 1] && (e.currentStatus === this.OBJECT_STATE.PROCESSED || e.currentStatus === this.OBJECT_STATE.FINAL)) {
        o5.platform.btv.PVRManager.setActiveRecordTasksList();
    }
    if (this._taskEndedCallback) {
        this._taskEndedCallback(e.taskId);
    }
    this._cachePVRRMDRtasks();
    this._executeListeners(this._uiRefreshListeners);
    this.logExit();
};

/**
 * Executes the diskSpaceWarningCallback when the disk space is within the given used percentage.
 * @method _diskSpaceWarningListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._diskSpaceWarningListener = function _diskSpaceWarningListener (e) {
    this.logEntry();
    if (this._diskSpaceWarningCallback) {
        this._diskSpaceWarningCallback();
    }
    this.logExit();
};

/**
 * Executes the jobDeletedOK callback when a deleteJob has been successful.
 * @method _jobDeletedOKListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._jobDeletedOKListener = function _jobDeletedOKListener (e) {
    this.logEntry();
    if (this._jobDeletedOKCallback) {
        this._jobDeletedOKCallback();
    }
    this.logExit();
};

/**
 * Executes the jobDeletedFailed callback when a deleteJob has failed.
 * @method _jobDeletedFailedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._jobDeletedFailedListener = function _jobDeletedFailedListener (e) {
    this.logEntry();
    if (this._jobDeletedFailedCallback) {
        this._jobDeletedFailedCallback();
    }
    this.logExit();
};

/**
 * Executes the taskStoppedOK callback when a stopTask has been successful.
 * @method _taskStoppedOKListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._taskStoppedOKListener = function _taskStoppedOKListener (e) {
    this.logEntry();
    if (this._taskStoppedOKCallback) {
        this._taskStoppedOKCallback();
    }
    this.logExit();
};

/**
 * Calls UI refresh listeners when task changed event occurs (i.e. tasks added, deleted, or reordered).
 * It also calls _taskChangedConflictCallback if the event comes from requestSeriesRecording().
 * Calling _taskChangedConflictCallback does not necessary mean there is a conflict. There is no
 * conflict if the result conflicts array is empty.
 * @method _taskChangedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._taskChangedListener = function _taskChangedListener (e) {
    // Decide if we need to determine if the tasks have changed as the result of a user recording request, as not to
    // fire the this._taskChangedConflictCallback for recurring / series-linked automatic recording requests
    this.logEntry();
    var i,
        unscheduledTasks = [];
    if (this._taskChangedCallback) {
        this._taskChangedCallback();
    }
    if (e.fulfillmentStatusArray) {
        for (i = 0; i < e.fulfillmentStatusArray.length; i++) {
            if (e.fulfillmentStatusArray[i].fulfillmentStatus === this.COMPLETION_STATUS_NONE || e.fulfillmentStatusArray[i].fulfillmentStatus === this.COMPLETION_STATUS_PARTIAL) {
                unscheduledTasks.push(this.getTask(e.fulfillmentStatusArray[i].taskId));
            } else if (e.fulfillmentStatusArray[i].fulfillmentStatus === this.COMPLETION_STATUS_INVALID) {
                this.logWarning("Requested recording is in the past");
            }
        }
        if (unscheduledTasks.length > 0) {
            // Check for conflict
            this._conflictManager.handleConflictsForTasks(unscheduledTasks, function (conflicts) {
                // Calls callback only if this task change event matches _addJobHandle, which is set in requestSeriesRecording()
                if (e.handle === this._addJobHandle) {
                    this._taskChangedConflictCallback(unscheduledTasks, conflicts);
                }
            }.bind(this));
        }
    }
    this._executeListeners(this._uiRefreshListeners);
    this.logExit();
};

/**
 * @method _taskModifiedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._taskModifiedListener = function _taskModifiedListener (e) {
    this._cachePVRRMDRtasks();
};

/**
 * Registers all the event listeners to the relevant callback methods.
 * Calling this method is required before making any recording requests.
 * @method _registerEventListeners
 * @private
 */
o5.platform.btv.PVRManager._registerEventListeners = function _registerEventListeners () {
    CCOM.Scheduler.addEventListener("onAddJobCompleted", this._addJobCompletedListener.bind(this));
    CCOM.Scheduler.addEventListener("onTaskVPAlert", this._taskAboutToStartListener.bind(this));
    CCOM.Scheduler.addEventListener("onTaskStarted", this._taskStartedListener.bind(this));
    CCOM.Scheduler.addEventListener("onTaskStopped", this._taskStoppedListener.bind(this));
    CCOM.Scheduler.addEventListener("onAddTaskFailed", this._addTaskFailedListener.bind(this));
    CCOM.Scheduler.addEventListener("addJobFailed", this._addJobFailedListener.bind(this));
    CCOM.Scheduler.addEventListener("onTasksChanged", this._taskChangedListener.bind(this));
    CCOM.Scheduler.addEventListener("onTasksModified", this._taskModifiedListener.bind(this));
    CCOM.Scheduler.addEventListener("deleteJobOK", this._jobDeletedOKListener.bind(this));
    CCOM.Scheduler.addEventListener("deleteJobFailed", this._jobDeletedFailedListener.bind(this));
    CCOM.Scheduler.addEventListener("stopTaskOK", this._taskStoppedOKListener.bind(this));
    CCOM.MediaLibrary.addEventListener("onContentModified", this._contentModifiedListener.bind(this));
    CCOM.MediaLibrary.addEventListener("onDiskSpaceAlert", this._diskSpaceWarningListener.bind(this));
    CCOM.MediaLibrary.addEventListener("deleteContentOK", this._deleteContentOKListener.bind(this));
    CCOM.MediaLibrary.addEventListener("deleteContentFailed", this._deleteContentFailedListener.bind(this));

    CCOM.Scheduler.addEventListener("updateTaskOK", this._updateTaskOKListener.bind(this));
    CCOM.Scheduler.addEventListener("updateTaskFailed", this._updateTaskFailedListener.bind(this));

    CCOM.Scheduler.addEventListener("updateJobOK", this._updateJobOKListener.bind(this));
    CCOM.Scheduler.addEventListener("updateJobFailed", this._updateJobFailedListener.bind(this));

    CCOM.MediaLibrary.addEventListener("updateEntryOK", this._updateEntryOKListener.bind(this));
    CCOM.MediaLibrary.addEventListener("updateEntryFailed", this._updateEntryFailedListener.bind(this));
};

/**
 * Populates the additional info for a recording request. Works for both event and series requests,
 * @method _getAdditionalInfoFromRequest
 * @private
 * @param {String} eventId The event id
 * @param {Object} [metaData={}] Metadata object that contains the following optional parameters:
 * @param {Number} [metaData.softPrepaddingDuration=0] Specifies the number of milliseconds before the
 * start time (startTime - hardPrepaddingDuration) that the event can start if there are resources.
 * @param {Number} [metaData.softPostpaddingDuration=0] Specifies the number of milliseconds after the
 * end time (startTime + duration + hardPostpaddingDuration ) that the event can persist if there are resources.
 * @param {Number} [metaData.hardPrepaddingDuration=0] Specifies the number of milliseconds before the
 * start time that the event can start.
 * @param {Number} [metaData.hardPostpaddingDuration=0] Specifies the number of milliseconds after the
 * end time (startTime+duration)that the event can persist.
 * @param {Boolean|String|Number} [keepTime=false] If this is set to true, >0, or any non empty string, then the
 * recording is set to protected (i.e. keep the recording).
 * @param {Object} [event] EPG event object
 * @param {Boolean} [recordOnSingleChannel=false] Specifies whether recording is performed on a single
 * channel only (on the same channel as the event). This is provided for series recordings only.
 * @return {Object} Returns the additional info object.
 */
o5.platform.btv.PVRManager._getAdditionalInfoFromRequest =
function _getAdditionalInfoFromRequest (eventId, metaData, keepTime, event, recordOnSingleChannel) {
    var additionalInfo = metaData || {};
    if (eventId) {
        additionalInfo.keep = keepTime ? true : false;
        if (!additionalInfo.hasOwnProperty('softPrepaddingDuration') && !isNaN(this._defaultPadding)) {
            additionalInfo.softPrepaddingDuration = this._defaultPadding; //in milliseconds
        }
        if (!additionalInfo.hasOwnProperty('softPostpaddingDuration') && !isNaN(this._defaultPadding)) {
            additionalInfo.softPostpaddingDuration = this._defaultPadding; //in milliseconds
        }
        if (!additionalInfo.hasOwnProperty('hardPrepaddingDuration') && !isNaN(this._defaultPadding)) {
            additionalInfo.hardPrepaddingDuration = this._defaultPadding; //in milliseconds
        }
        if (!additionalInfo.hasOwnProperty('hardPostpaddingDuration') && !isNaN(this._defaultPadding)) {
            additionalInfo.hardPostpaddingDuration = this._defaultPadding; //in milliseconds
        }
        if (event && event.seriesId) {
            additionalInfo.sqlQueryFilter = "seriesId = '" + event.seriesId + "'";
            additionalInfo.sqlQueryFilter += " AND ";
            additionalInfo.sqlQueryFilter += " startTime >= '" + event.startTime + "'";
            additionalInfo.eventId = eventId;
            if (recordOnSingleChannel) {
                additionalInfo.sqlQueryFilter += " AND ";
                additionalInfo.sqlQueryFilter += "serviceId = '" + event.serviceId + "'";
            }
        } else {
            additionalInfo.eventId = eventId;
        }
    }
    return additionalInfo;
};

/**
 * Takes in the initial mappedRecording and returns a folder object with relevant attributes set to the
 * value of the initial mappedRecording returned for that series PLUS a subRecordings array.
 * @method _mapFolder
 * @private
 * @param {Object} mappedRecording Mapped recording
 * @return {Object} Returns a copy of mappedRecording plus 'subRecordings=[]' property
 */
o5.platform.btv.PVRManager._mapFolder = function _mapFolder (mappedRecording) {
    var folder = {};
    folder.jobId = mappedRecording.jobId;
    folder.seriesId = mappedRecording.seriesId;
    folder.seasonId = mappedRecording.seasonId;
    folder.seriesName = mappedRecording.seriesName;
    folder.eventId = mappedRecording.eventId;
    folder.startTime = mappedRecording.startTime;
    folder.endTime = mappedRecording.endTime;
    folder.scheduleType = mappedRecording.scheduleType;
    folder.serviceId = mappedRecording.serviceId;
    folder.subRecordings = [];
    return folder;
};

/**
 * Manipulates a resultSet to return series linked tasks as folders.
 * @method mapRecordingsToFolder
 * @param {Array} recordings List of recordings that need to be mapped to a folder
 * @return {Array} List of recordings mapped to folders for series-linked tasks
 */
o5.platform.btv.PVRManager.mapRecordingsToFolder = function mapRecordingsToFolder (recordings) {
    var folder,
        returnArray = [],
        seriesLookup = {};

    recordings.forEach(function (recording, index) {
        //recording = o5.platform.btv.RecordingFactory.mapObject(recording);
        // testing seriesId here so recordings grouped even if not requested as part of a series
        // we could use scheduleType instead but that would just group recordings if they were requested as
        // part of a series.
        if (recording.seriesId === undefined || recording.seriesId === null || recording.seriesId === '' || !recording.recordingType) {
            returnArray.push(recording);
        } else if (!seriesLookup[recording.seriesId]) {
            seriesLookup[recording.seriesId] = {};
            folder = this._mapFolder(recording);
            folder.subRecordings.push(recording);
            seriesLookup[recording.seriesId] = folder;
            returnArray.push(folder);
        } else {
            folder = seriesLookup[recording.seriesId];
            folder.subRecordings.push(recording);
        }
    }.bind(this));
    return returnArray;
};

/**
 * Executes if the "onContentModified" listener is fired.
 * @method _contentModifiedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._contentModifiedListener = function _contentModifiedListener (e) {
    this.logDebug("medialibId: " + e.medialibId + " Status is " + e.modifyType);
    if (e.modifyType === 3) {
        this._cachePVRRMDRtasks();
    }
    if (this._deleteContentOKCallback) {
        this._deleteContentOKCallback(true);
    }
    if (this._cancelEventRecordingCallback) {
        this._cancelEventRecordingCallback(true);
        this._cancelEventRecordingCallback = null;
    }
};

/**
 * @method _deleteContentOKListener
 * @private
 */
o5.platform.btv.PVRManager._deleteContentOKListener = function _deleteContentOKListener () {
};

/**
 * Executes if the "deleteContentFailed" event is fired.
 * @method _deleteContentFailedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.PVRManager._deleteContentFailedListener = function _deleteContentFailedListener (e) {
    this.logError("Error name: " + e.error.name + ", Error message: " + e.error.message);
    if (this._deleteContentOKCallback) {
        this._deleteContentOKCallback(false);
    }
};

/**
 * Called by o5.$.init2() when O5 starts up.
 * @method _init
 * @private
 */
o5.platform.btv.PVRManager._init = function _init () {
    // Don't use 'this' as this is called by o5.$.init2()
    var me = o5.platform.btv.PVRManager;

    me._recordingsReturnOrder = me.RecordingsReturnOrderType.BY_DATE;
    me.COMPLETION_STATUS_INVALID = CCOM.Scheduler.INVALID; // 0
    me.COMPLETION_STATUS_NONE = CCOM.Scheduler.NONE; // 1
    me.COMPLETION_STATUS_PARTIAL = CCOM.Scheduler.PARTIAL; // 2
    me.COMPLETION_STATUS_FULL = CCOM.Scheduler.FULL; // 3

    me._registerEventListeners();
};

/**
 * Initialises the PVRManager ready for use, must be called prior to any other method calls.
 * @method init
 * @param {Object} [altConflictManager] ConflictManager instance
 * @param {Object} [configuration] Optional configuration object containing the following properties:
 * @param {Boolean} [configuration.altConflictManager] ConflictManager instance. If this is missing, it will
 * create a ConflictManager instance.
 * @param {Function} [configuration.hddAvailabilityFunc] Function to check HDD availability
 * @param {Function} [configuration.unPlugStatusOfDriveFunc] Function to check if HDD is unplugged
 */
o5.platform.btv.PVRManager.init = function init (altConflictManager, configuration) {
    this.logEntry();

    if (!configuration) {
        configuration = {};
        configuration.altConflictManager = altConflictManager || new o5.platform.btv.ConflictManager(o5.platform.btv.PVRManager);
        configuration.hddAvailabilityFunc = null;
        configuration.unPlugStatusOfDriveFunc = null;
    }

    this._conflictManager = configuration.altConflictManager;
    this._hddAvailabilityFunc = configuration.hddAvailabilityFunc;
    this._unPlugStatusOfDriveFunc = configuration.unPlugStatusOfDriveFunc;

    this._storeActiveRecordings();
    this._cachePVRRMDRtasks();
    this.logExit();
};

/**
 * Delete a scheduled job previously added.
 * @method deleteJob
 * @async
 * @chainable
 * @param {Number} jobId Job id to be removed
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.deleteJob = function deleteJob (jobId) {
    this.logEntry();
    CCOM.Scheduler.deleteJob(jobId);
    this.logExit();
    return this;
};

/**
 * @method getBookedAndActiveRecordings
 * @removed
 */

/**
 * @method setTaskAboutToStartCallback
 * @removed
 */

/**
 * Sets the callback to be invoked when a recording is about to try and start but fail
 * due to conflicts existing
 * @method setTaskAboutToStartConflictCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setTaskAboutToStartConflictCallback = function setTaskAboutToStartConflictCallback (callback) {
    this.logEntry();
    if (!callback) {
        callback = this._emptyFunction;
    }
    this._taskAboutToStartConflictCallback = callback;
    this.logExit();
    return this;
};

/**
 * Sets the callback to be invoked when a recording starts.
 * @method setTaskStartedCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setTaskStartedCallback = function setTaskStartedCallback (callback) {
    this.logEntry();
    if (!callback) {
        callback = this._emptyFunction;
    }
    this._taskStartedCallback = callback;
    this.logExit();
    return this;
};

/**
 * Sets the array of the current partition names
 * @method setPartitionName
 * @deprecated Don't use
 * @param {Array} partitionName An array of partition names
 */
o5.platform.btv.PVRManager.setPartitionName = function setPartitionName (partitionName) {
    this._currentPartitionName = partitionName;
};

/**
 * Gets the array of the current partition name
 * @method getPartitionName
 * @return {Array} Returns an array of current partition names
 */
o5.platform.btv.PVRManager.getPartitionName = function getPartitionName () {
    return this._currentPartitionName;
};

/**
 * Sets the callback to be invoked when a task ends.
 * @method setTaskEndedCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setTaskEndedCallback = function setTaskEndedCallback (callback) {
    this.logEntry();
    if (!callback) {
        callback = this._emptyFunction;
    }
    this._taskEndedCallback = callback;
    this.logExit();
    return this;
};

/**
 * Sets the callback to be invoked when a stopTask is successful.
 * @method setTaskStoppedOKCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setTaskStoppedOKCallback = function setTaskStoppedOKCallback (callback) {
    this.logEntry();
    if (!callback) {
        callback = this._emptyFunction;
    }
    this._taskStoppedOKCallback = callback;
    this.logExit();
    return this;
};

/**
 * Sets the callback to be invoked when a deleteJob is successful.
 * @method setJobDeletedOKCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setJobDeletedOKCallback = function setJobDeletedOKCallback (callback) {
    this.logEntry();
    this._jobDeletedOKCallback = callback || this._emptyFunction;
    this.logExit();
    return this;
};

/**
 * Sets the callback to be invoked when a deleteJob has failed
 * @method setJobDeletedFailedCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setJobDeletedFailedCallback = function setJobDeletedFailedCallback (callback) {
    this.logEntry();
    this._jobDeletedFailedCallback = callback || this._emptyFunction;
    this.logExit();
    return this;
};

/**
 * Sets the callback to be invoked when add job has failed
 * @method setAddJobFailedCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @param {Number} callback.handle Added job handle
 * @param {Object} callback.error Error object
 * @param {String} callback.error.name Error name
 * @param {String} [callback.error.message] Optional error message
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setAddJobFailedCallback = function setAddJobFailedCallback (callback) {
    this._addJobFailedCallback = callback || this._emptyFunction;
    return this;
};

/**
 * @method setTaskDeletedOKCallback
 * @removed
 */

/**
 * Sets the callback that should be executed when a recording request fails.
 * @method setRecordingRequestFailedCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setRecordingRequestFailedCallback = function setRecordingRequestFailedCallback (callback) {
    this.logEntry();
    if (!callback) {
        callback = this._emptyFunction;
    }
    this._recordingRequestFailedCallback = callback;
    this.logExit();
    return this;
};

/**
 * Sets the callback that should be executed when a recording request produces a conflict.
 * @method setRecordingRequestConflictsCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setRecordingRequestConflictsCallback = function setRecordingRequestConflictsCallback (callback) {
    this.logEntry();
    if (!callback) {
        callback = this._emptyFunction;
    }
    this._recordingRequestConflictsCallback = callback;
    this.logExit();
    return this;
};

/**
 * Sets the callback that should be executed when a recording request
 * for a series produces a conflict.
 * @method setSeriesRequestConflictsCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setSeriesRequestConflictsCallback = function setSeriesRequestConflictsCallback (callback) {
    this.logEntry();
    if (!callback) {
        callback = this._emptyFunction;
    }
    this._seriesRequestConflictsCallback = callback;
    this.logExit();
    return this;
};

/**
 * Sets the callback that should be fired when task changed event occurs (i.e. tasks added,
 * deleted, or reordered) and the event comes from requestSeriesRecording().
 * @method setTaskChangedConflictCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @param {Array} callback.unscheduledTasks A list of unscheduled tasks that is used to
 * check for conflicting tasks
 * @param {Array} callback.conflicts A list of conflicting tasks, could be empty.
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setTaskChangedConflictCallback = function setTaskChangedConflictCallback (callback) {
    this.logEntry();
    if (!callback) {
        callback = this._emptyFunction;
    }
    this._taskChangedConflictCallback = callback;
    this.logExit();
    return this;
};

/**
 * Sets the callback that should be executed when disk space is below the
 * high water mark warning value.
 * @method setDiskSpaceWarningCallback
 * @chainable
 * @param {Function} [callback=function(){}] Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setDiskSpaceWarningCallback = function setDiskSpaceWarningCallback (callback) {
    this.logEntry();
    if (!callback) {
        callback = this._emptyFunction;
    }
    this._diskSpaceWarningCallback = callback;
    this.logExit();
    return this;
};

/**
 * @method setHighWaterMarkWarningValue
 * @removed
 */

/**
 * Saves the bookmark information for a recording.
 * @method saveBookmark
 * @async
 * @chainable
 * @param {Number} taskId Task id
 * @param {Number} bmIndex Unused variable
 * @param {Number} bmPosition Player position
 * @param {Function} [callback] Callback function to be invoked when the bookmark is updated
 * @param {Boolean} callback.result True if successful or false for failure
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.saveBookmark = function saveBookmark (taskId, bmIndex, bmPosition, callback) {
    this.logEntry();
    var handle;
    if ((bmPosition !== undefined) && (bmPosition !== null)) {
        handle = CCOM.MediaLibrary.updateEntry(taskId, {
            bookmark: parseInt(bmPosition, 10)
        });
        if (handle && callback) {
            this._updateEntryCallbackLookup[handle] = callback;
        }
    }
    this.logExit();
    return this;
};

/**
 * For the given scheduler taskId, deletes the bookmark information for a recording in the
 * database.
 * @method deleteBookmark
 * @async
 * @chainable
 * @param {Number} taskId Task id
 * @param {Function} callback Callback function to be invoked for successful delete
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.deleteBookmark = function deleteBookmark (taskId, callback) {
    this.logEntry();
    this._taskIdForBookMarkDeletion = taskId;
    o5.platform.btv.PVRManager.saveBookmark(taskId, null, 0, callback);
    this.logExit();
    return this;
};

/**
 * For the given a scheduler taskId returns the current bookmark position for
 * the recording.
 * @method getBookmark
 * @param {Number} taskId Task id
 * @return {Number} Returns bookmark position
 */
o5.platform.btv.PVRManager.getBookmark = function getBookmark (taskId) {
    this.logEntry();
    var task = this.getTask(taskId);
    if (task && task.bookmark) {
        this.logDebug("Returning bookmark");
        return task.bookmark;
    }
    this.logDebug("Returning false");
    return 0;
};

/**
 * Delete bookmark from home networking
 * @method deleteBookmarkFromRecording
 * @deprecated Does nothing
 * @async
 * @param {String} deviceUdn A unique identifier for the DLNA server
 * @param {String} objectId The object to delete the bookmark from
 * @param {Boolean} all True to delete all bookmarks. False to delete only bookmarks created by this device.
 * @param {Function} callback Callback function to be invoked for successful delete
 */
o5.platform.btv.PVRManager.deleteBookmarkFromRecording =
function deleteBookmarkFromRecording (deviceUdn, objectId, all, callback) {
};

/**
 * Registers all the event listeners to the relevant callback methods.
 * Calling this method is required before making any recording requests.
 * @method registerEventListeners
 * @removed moved to private API
 */

/**
 * Unregisters all the event listeners and resets all the custom callback.
 * method references
 * @method unRegisterEventListeners
 * @removed
 */

/**
 * Creates a series recording.
 * @method requestSeriesRecording
 * @async
 * @param {Object} event EPG event object
 * @param {Object} [metaData={}] Metadata object that contains the following optional parameters:
 * @param {Number} [metaData.softPrepaddingDuration=0] Specifies the number of milliseconds before the
 * start time (startTime - hardPrepaddingDuration) that the event can start if there are resources.
 * @param {Number} [metaData.softPostpaddingDuration=0] Specifies the number of milliseconds after the
 * end time (startTime + duration + hardPostpaddingDuration ) that the event can persist if there are resources.
 * @param {Number} [metaData.hardPrepaddingDuration=0] Specifies the number of milliseconds before the
 * start time that the event can start.
 * @param {Number} [metaData.hardPostpaddingDuration=0] Specifies the number of milliseconds after the
 * end time (startTime+duration)that the event can persist.
 * @param {Boolean} [keepTime=false] If this is set to true, then the recording is set to protected.
 * (i.e. keep the recording).
 * @param {Boolean} [recordOnSingleChannel=false] Specifies whether recording is performed on a single
 * channel only (on the same channel as the event). This is provided for series recordings only.
 */
o5.platform.btv.PVRManager.requestSeriesRecording = function requestSeriesRecording (event, metaData, keepTime, recordOnSingleChannel) {
    this.logEntry();
    var additionalInfo;
    if (!event || !event.startTime || !event.seriesId) {
        this.logError("ERROR : passed in event object has no seriesId or startTime");
    } else {
        additionalInfo = this._getAdditionalInfoFromRequest(event.eventId, metaData, keepTime, event, recordOnSingleChannel);
        this._addJobHandle = CCOM.Scheduler.addJob(this.TASK_TYPE.RECORDING, this.JOB_TYPE.SERIES, additionalInfo);
        this.logDebug("requestSeriesRecording", this._addJobHandle);
        if (this._addJobHandle && this._addJobHandle.error) {
            this.logError("ERROR : name:" + this._addJobHandle.error.name + " message:" + this._addJobHandle.error.message);
        }
    }
    this.logExit();
};

//eslint-disable-next-line valid-jsdoc
/**
 * Updates a Job.
 * @method updateJob
 * @async
 * @deprecated Use `protectRecording` and `unprotectRecording` methods to set or unset keep recording.
 */
o5.platform.btv.PVRManager.updateJob = function updateJob (event, metaData, keepTime, jobId, callback) {
    var additionalInfo,
        handle;

    this.logEntry();
    if (event && event.eventId) {
        additionalInfo = this._getAdditionalInfoFromRequest(event.eventId, metaData, keepTime, event);
        handle = CCOM.Scheduler.updateJob(jobId, additionalInfo);
        if (handle && callback) {
            this._updateJobCallbackLookup[handle] = callback;
        }
    }
    this.logExit();
    return handle;
};

/**
 * Cancels an existing series recording matching a given event
 * @method cancelSeriesRecording
 * @async
 * @chainable
 * @param {Number} jobId Identifier of the series job that we want to cancel
 * @param {Function} [callback] Callback function to be invoked for successful delete
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.cancelSeriesRecording = function cancelSeriesRecording (jobId, callback) {
    this.logEntry();
    if (callback) {
        this._jobDeletedOKCallback = callback;
    }
    this.deleteJob(jobId);
    this.logExit();
    return this;
};

/**
 * @method cancelSeriesRecordingByEventId
 * @removed
 */

/**
 * Cancels a recurring scheduled recording
 * @method cancelRecurringRecording
 * @async
 * @chainable
 * @deprecated Use cancelSeriesRecording() instead
 * @param {Number} jobId Identifier of the series job that we want to cancel
 * @param {Function} [callback] Callback function to be invoked for successful delete
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.cancelRecurringRecording = function cancelRecurringRecording (jobId, callback) {
    this.logEntry();
    if (callback) {
        this._jobDeletedOKCallback = callback;
    }
    this.deleteJob(jobId);
    this.logExit();
    return this;
};

/**
 * Creates an event recording.
 * @method requestEventRecording
 * @async
 * @param {String} eventId Event id
 * @param {Object} [metaData={}] Metadata object that contains the following optional parameters:
 * @param {Number} [metaData.softPrepaddingDuration=0] Specifies the number of milliseconds before the
 * start time (startTime - hardPrepaddingDuration) that the event can start if there are resources.
 * @param {Number} [metaData.softPostpaddingDuration=0] Specifies the number of milliseconds after the
 * end time (startTime + duration + hardPostpaddingDuration ) that the event can persist if there are resources.
 * @param {Number} [metaData.hardPrepaddingDuration=0] Specifies the number of milliseconds before the
 * start time that the event can start.
 * @param {Number} [metaData.hardPostpaddingDuration=0] Specifies the number of milliseconds after the
 * end time (startTime+duration)that the event can persist.
 * @param {Boolean} [keepTime=false] If this is set to true, then the recording is set to protected.
 * (i.e. keep the recording).
 * @return {Number} Returns the added job handle that can be checked against in the callback of
 * setAddJobFailedCallback().
 */
o5.platform.btv.PVRManager.requestEventRecording = function requestEventRecording (eventId, metaData, keepTime) {
    this.logEntry();
    var additionalInfo,
        result;

    additionalInfo = this._getAdditionalInfoFromRequest(eventId, metaData, keepTime);

    result = CCOM.Scheduler.addJob(this.TASK_TYPE.RECORDING, this.JOB_TYPE.EVENT, additionalInfo);
    this.logDebug("requestEventRecording", result);
    return result;
};

/**
 * Given an EPG eventId, cancels an existing recording or deletes a scheduled event recording.
 * @method cancelEventRecording
 * @async
 * @chainable
 * @param {String} eventId EPG event id
 * @param {Function} callback Callback function to be invoked for successful delete
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.cancelEventRecording = function cancelEventRecording (eventId, callback) {
    this.logEntry();
    var task = this._getPVRTaskByEvent(eventId),
        job;
    if (task && task !== null) {
        job = this.getJob(task.jobId);
    }
    if (job && this._isTaskObjectScheduled(task) && task.recordingType === o5.data.Recording.RECORDING_TYPE.SINGLE) {
        this.logDebug("Event is scheduled and a single event - deleting job");
        this.deleteJob(job.jobId);
    } else if (this._isTaskObjectActive(task) || this._isTaskObjectSuspended(task) || (this._isTaskObjectScheduled(task))) {
        this.logDebug("Event is active or scheduled and a series - stopping task");
        CCOM.Scheduler.stopTask(task.taskId);
    }
    this._cancelEventRecordingCallback = callback;
    this.logExit();
    return this;
};

/**
 * Requests scheduler time based recording with the given parameters
 * A repeat recording is added if the metaData object contains a repeatDaysArray
 * that is not null or undefined.
 * The correct format of the repeatDaysArray is a seven-element array of Booleans,
 * that represent days of the week on which to record running from Monday to Sunday.
 * @method requestTimeRecording
 * @async
 * @param {Number} startTime Start time in seconds
 * @param {Number} endTime End time in seconds
 * @param {Number} frequency Recording frequency, which is one of the `Frequency` enumeration.
 * @param {Number} serviceId Service id
 * @param {Boolean} keepTime If this is set to true, then the recording is set to protected.
 * (i.e. keep the recording).
 * @param {Object} metaData Metadata object that contains the following parameters:
 * @param {String} metaData.title Title
 * @param {String} [metaData.uri] Source URI
 * @param {Number} [metaData.softPrepaddingDuration=0] Specifies the number of milliseconds before the
 * start time (startTime - hardPrepaddingDuration) that the event can start if there are resources.
 * @param {Number} [metaData.softPostpaddingDuration=0] Specifies the number of milliseconds after the
 * end time (startTime + duration + hardPostpaddingDuration ) that the event can persist if there are resources.
 * @param {Number} [metaData.hardPrepaddingDuration=0] Specifies the number of milliseconds before the
 * start time that the event can start.
 * @param {Number} [metaData.hardPostpaddingDuration=0] Specifies the number of milliseconds after the
 * end time (startTime+duration)that the event can persist.
 * @param {Array} [metaData.repeatDaysArray] An array of seven booleans corresponding to the days Monday
 * through Sunday. Monday is index 0. For every boolean that is set, the time-based rule will know to record
 * on that day at the time specified by timeOfDay and for the duration set in duration. Therefore, this field
 * is valid only if timeOfDay and duration are set and is a repeat recording.
 * @return {Boolean} Returns true if successful, otherwise false.
 */
// Disable ESLint complexity because this API may be refactored in the future to simplify scheduling jobs and tasks
/* eslint-disable complexity */
o5.platform.btv.PVRManager.requestTimeRecording =
function requestTimeRecording (startTime, endTime, frequency, serviceId, keepTime, metaData) {
    this.logEntry();
    var result,
        job = metaData || {},
        isRepeatRecording = false,
        startTimeDate;
    job.duration = (endTime - startTime) * 1000;
    job.sourceURL = metaData.url;
    job.keep = keepTime ? true : false;
    job.serviceId = serviceId;
    job.title = metaData.title;
    if (!job.sourceURL) {
        if (serviceId && o5.platform.btv.EPG && o5.platform.btv.EPG.getChannelByServiceId(serviceId)) {
            job.sourceURL = o5.platform.btv.EPG.getChannelByServiceId(serviceId).uri;
        } else {
            return false;
        }
    }
    if (!job.hasOwnProperty('softPrepaddingDuration') && !isNaN(this._defaultPadding)) {
        job.softPrepaddingDuration = this._defaultPadding; //in milliseconds
    }
    if (!job.hasOwnProperty('softPostpaddingDuration') && !isNaN(this._defaultPadding)) {
        job.softPostpaddingDuration = this._defaultPadding; //in milliseconds
    }
    if (!job.hasOwnProperty('hardPrepaddingDuration') && !isNaN(this._defaultPadding)) {
        job.hardPrepaddingDuration = this._defaultPadding; //in milliseconds
    }
    if (!job.hasOwnProperty('hardPostpaddingDuration') && !isNaN(this._defaultPadding)) {
        job.hardPostpaddingDuration = this._defaultPadding; //in milliseconds
    }
    if (job.hasOwnProperty('repeatDaysArray') || (frequency && frequency !== o5.platform.btv.PVRManager.Frequency.ONCE)) {
        if (job.hasOwnProperty('repeatDaysArray')) {
            job.repeatDaysArray = this._checkRepeatDaysArray(job.repeatDaysArray);
        } else if (frequency) {
            job.repeatDaysArray = this._getRepeatDaysArrayForFrequency(frequency);
        }
        isRepeatRecording = (!job.repeatDaysArray || job.repeatDaysArray.length === 0) ? false : true;
    }
    if (isRepeatRecording) {
        startTimeDate = new Date(startTime * 1000);
        job.timeOfDay = (startTimeDate.getHours() * 3600) + (startTimeDate.getMinutes() * 60);
        result = CCOM.Scheduler.addJob(this.TASK_TYPE.RECORDING, this.JOB_TYPE.REPEAT, job);
    } else {
        job.startTime = startTime * 1000;
        result = CCOM.Scheduler.addJob(this.TASK_TYPE.RECORDING, this.JOB_TYPE.SINGLE, job);
    }

    this.logDebug("requestTimeRecording", result);
    if (result && result.error) {
        this.logError("ERROR : name:" + result.error.name + " message:" + result.error.message);
        return false;
    }
    this.logExit();
    return true;
};
/* eslint-enable complexity */

/**
 * Update a job's time recording
 * @method updateTimeRecording
 * @async
 * @param {Number} jobId Job id to be updated
 * @param {Number} startTime Start time in UTC milliseconds
 * @param {Number} endTime End time in UTC milliseconds
 * @param {Object} metaData Metadata object
 * @param {String} metaData.title Title, this property must exist
 * @param {Function} [callback] Callback function to be invoked when the job is updated.
 * @param {Boolean} callback.result True if successful or false for failure.
 * @return {Boolean} Returns true
 */
o5.platform.btv.PVRManager.updateTimeRecording = function updateTimeRecording (jobId, startTime, endTime, metaData, callback) {
    this.logEntry();
    var handle,
        updatedJob = metaData || {};

    updatedJob.duration = (endTime - startTime) * 1000;
    updatedJob.title = metaData.title;
    updatedJob.startTime = startTime * 1000;

    if (jobId) {
        handle = CCOM.Scheduler.updateJob(jobId, updatedJob);
        if (handle && callback) {
            this._updateJobCallbackLookup[handle] = callback;
        }
    }
    this.logExit();
    return true;
};

/**
 * Determines if the task identified by the given taskId is currently scheduled or active
 * regardless of type.
 * @method isTaskScheduled
 * @param {Number} taskId Task id
 * @return {Boolean} Returns true if task is active or scheduled, otherwise false.
 */
o5.platform.btv.PVRManager.isTaskScheduled = function isTaskScheduled (taskId) {
    this.logEntry();
    if (taskId) {
        var task = this.getTask(taskId);
        if (task && (this._isTaskObjectScheduled(task) || this._isTaskObjectActive(task))) {
            this.logDebug("Returning true for ID: " + taskId);
            return true;
        }
    }
    this.logDebug("Returning false for event ID: " + taskId);
    return false;
};

/**
 * @method isTaskUnscheduled
 * @removed
 */

/**
 * Determines if the task identified by the given taskId is a currently scheduled or active task
 * of PVR type. This search in the PVR RAM cache, instead of the persistent database.
 * @method isPVRTaskScheduled
 * @param {Number} taskId Task id
 * @return {Boolean} Returns true if task is active or scheduled, otherwise false.
 */
o5.platform.btv.PVRManager.isPVRTaskScheduled = function isPVRTaskScheduled (taskId) {
    this.logEntry();
    if (taskId) {
        var task = o5.platform.btv.PVRRMCache.getTaskById(taskId);
        if (task && this._isTaskObjectPVR(task) && (this._isTaskObjectScheduled(task) || this._isTaskObjectActive(task))) {
            this.logDebug("Returning true for ID: " + taskId);
            return true;
        }
    }
    this.logDebug("Returning false for ID: " + taskId);
    return false;
};

/**
 * Determines if the task identified by the given id is an active task of PVR type.
 * @method isTaskRecordingNow
 * @param {Number} taskId Task id
 * @return {Boolean} Returns true if task is active, otherwise false.
 */
o5.platform.btv.PVRManager.isTaskRecordingNow = function isTaskRecordingNow (taskId) {
    this.logEntry();
    if (taskId) {
        var task = this.getTask(taskId);
        if (task && this._isTaskObjectPVR(task) && this._isTaskObjectActive(task)) {
            this.logDebug("Returning true for task ID: " + taskId);
            return true;
        }
    }
    this.logDebug("Returning false for task ID: " + taskId);
    return false;
};

/**
 * Determines if the event identified by the given id is currently scheduled or active
 * regardless of type.
 * @method isEventScheduled
 * @param {String} eventId EPG event id
 * @return {Boolean} Returns true if task is active or scheduled, otherwise false.
 */
o5.platform.btv.PVRManager.isEventScheduled = function isEventScheduled (eventId) {
    this.logEntry();
    if (eventId) {
        var task = this.getTaskByEventId(eventId);
        if (task && (this._isTaskObjectActive(task) || this._isTaskObjectScheduled(task))) {
            this.logDebug("Returning true for event ID: " + eventId);
            return true;
        }
    }
    this.logDebug("Returning false for event ID: " + eventId);
    return false;
};

/**
 * @method isEventUnScheduled
 * @removed
 */

/**
 * @method isEventPartialRecording
 * @removed
 */

/**
 * @method isPVREventUnScheduled
 * @removed
 */

/**
 * Determines if the PVR event identified by the given id is a currently scheduled or active.
 * @method isPVREventScheduled
 * @param {String} eventId EPG event id
 * @return {Boolean} Returns true if task is active or scheduled, otherwise false.
 */
o5.platform.btv.PVRManager.isPVREventScheduled = function isPVREventScheduled (eventId) {
    this.logEntry();
    if (eventId) {
        var task = this._getPVRTaskByEvent(eventId, null, "taskType, objectState");
        if (task && this._isTaskObjectPVR(task) && (this._isTaskObjectActive(task) || this._isTaskObjectScheduled(task))) {
            this.logDebug("Returning true for event ID: " + eventId);
            return true;
        }
    }
    this.logDebug("Returning false for event ID: " + eventId);
    return false;
};

/**
 * Determines if the the event identified by the given id is a currently active task of PVR.
 * @method isEventRecordingNow
 * @param {String} eventId EPG event id
 * @return {Boolean} Returns true if task is active, otherwise false.
 */
o5.platform.btv.PVRManager.isEventRecordingNow = function isEventRecordingNow (eventId) {
    this.logEntry();
    if (eventId) {
        var task = this._getPVRTaskByEvent(eventId);
        if (task && this._isTaskObjectActive(task)) {
            this.logDebug("Returning true for event ID: " + eventId);
            return true;
        }
    }
    this.logDebug("Returning false for event ID: " + eventId);
    return false;
};

/**
 * Returns the status of an event recording task given an eventId.
 * @method getEventRecordingStatus
 * @param {String} eventId EPG event id
 * @return {Number} Status of the scheduled task, which is one of the `TaskStatus` enumeration.
 */
o5.platform.btv.PVRManager.getEventRecordingStatus = function getEventRecordingStatus (eventId) {
    this.logEntry();
    if (eventId) {
        var task = this._getPVRTaskByEvent(eventId, null, "taskId, taskType, taskOpState, objectState, completeStatus, scheduleType");
        if (task && this._isTaskObjectPVR(task)) {
            return this.getStatusForTask(task);
        }
    }
    this.logExit();
    return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_UNSCHEDULED;
};

/**
 * Returns the status of a recording task for the given taskId. This search in the PVR RAM cache,
 * instead of the persistent database.
 * @method getTaskRecordingStatus
 * @param {Number} taskId Task id
 * @return {Number} Status of the scheduled task, which is one of the `TaskStatus` enumeration.
 */
o5.platform.btv.PVRManager.getTaskRecordingStatus = function getTaskRecordingStatus (taskId) {
    this.logEntry();
    if (taskId) {
        var task = o5.platform.btv.PVRRMCache.getTaskById(taskId);
        if (task && this._isTaskObjectPVR(task)) {
            return this.getStatusForTask(task);
        }
    }
    this.logExit();
    return o5.platform.btv.PVRManager.TaskStatus.TASK_STATUS_UNSCHEDULED;
};

/**
 * @method cancelTasksById
 * @removed
 */

/**
 * Deletes the task with the provided taskId from scheduler, if it
 * is the only task in a job then the job is also deleted.
 * If the task is currently active, the task is cancelled first.
 * @method deleteTaskById
 * @async
 * @chainable
 * @param {Number} taskId Task Id of the task to be deleted
 * @param {Function} callback Callback function
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.deleteTaskById = function deleteTaskById (taskId, callback) {
    this.logEntry();
    var task = this.getTask(taskId),

        removeTaskFromDbAndDelete = function (jobId, _taskId) {
            //CCOM.Scheduler.deleteJob(jobId);
            if (callback) {
                this._deleteContentOKCallback = callback;
            }
            CCOM.MediaLibrary.deleteContent(_taskId, true);
        }.bind(this),

        stopTaskOKCallback = function (e) {
            removeTaskFromDbAndDelete(task.jobId, task.taskId);
            CCOM.Scheduler.removeEventListener("stopTaskOK", stopTaskOKCallback, false);
        };

    if (task) {
        if (o5.platform.btv.PVRRMCache.isTaskRecordingNow(taskId)) {
            CCOM.Scheduler.addEventListener("stopTaskOK", stopTaskOKCallback);
            this.cancelTaskById(task.taskId);
        } else {
            removeTaskFromDbAndDelete(task.jobId, task.taskId);
        }
    } else {
        this.logExit();
        callback(false);
        return this;
    }
    this.logExit();
    return this;
};

/**
 * Cancels or stops the recording of the given id. Only active
 * tasks can be cancelled. The recording is stopped but not deleted.
 * @method cancelTaskById
 * @async
 * @chainable
 * @param {Number} taskId Task id
 * @param {Function} [callback] Callback function to be invoked if task is stopped successfully
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.cancelTaskById = function cancelTaskById (taskId, callback) {
    this.logEntry();
    if (callback) {
        this._taskStoppedOKCallback = callback;
    }
    var task = this.getTask(taskId, "objectState, scheduleType, jobId"),
        isSeriesOrRepeat = (task.recordingType === o5.data.Recording.RECORDING_TYPE.SERIES) || (task._data.scheduleType === this.JOB_TYPE.REPEAT);
    if (o5.platform.btv.PVRRMCache.isTaskRecordingNow(taskId) || this._isTaskObjectSuspended(task) || (this._isTaskObjectScheduled(task) && isSeriesOrRepeat)) {
        this.logDebug("Task is recording stopping first - Call CCOM.Scheduler.stopTask - taskId = " + taskId);
        CCOM.Scheduler.stopTask(taskId);
    } else if (this._isTaskObjectScheduled(task)) {
        this.deleteJob(task.jobId);
    } else {
        this.logError("cancel failed ", taskId);
    }
    this.logExit();
    return this;
};

/**
 * @method isRecurringRecording
 * @removed
 */

/**
 * @method isChannelCurrentlyRecording
 * @removed
 */

/**
 * Determines if recording is protected.
 * @method isRecordingProtected
 * @param {Number} taskId Task id
 * @return {Boolean} Returns true if task is protected, otherwise false.
 */
o5.platform.btv.PVRManager.isRecordingProtected = function isRecordingProtected (taskId) {
    this.logEntry();
    var task = this.getTask(taskId);
    if (task && task.keep) {
        this.logDebug("Returning true");
        return true;
    }
    this.logDebug("Returning false");
    return false;
};

/**
 * Sets the task with the given task id to protected.
 * @method protectRecording
 * @async
 * @chainable
 * @param {Number} taskId Task id
 * @param {Function} [callback] Callback function to be invoked when the task is updated
 * @param {Boolean} callback.result True if successful or false for failure
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.protectRecording = function protectRecording (taskId, callback) {
    this.logEntry();
    var task = this.getTask(taskId),
        handle;

    if (task) {
        if (task.objectState !== this.OBJECT_STATE.FINAL &&
				task.objectState !== this.OBJECT_STATE.ERROR &&
				task.objectState !== this.OBJECT_STATE.PROCESSED &&
				task.objectState !== this.OBJECT_STATE.DELETING &&
				task.objectState !== this.OBJECT_STATE.DELETED) {
            handle = CCOM.Scheduler.updateTask(taskId, {
                keep: true
            });
            if (handle && callback) {
                this._updateTaskCallbackLookup[handle] = callback;
            }
        } else {
            handle = CCOM.MediaLibrary.updateEntry(taskId, {
                keep: true
            });
            if (handle && callback) {
                this._updateEntryCallbackLookup[handle] = callback;
            }
        }
    }
    this.logExit();
    return this;
};

/**
 * Sets the task with the given task id to unprotected.
 * @method unprotectRecording
 * @async
 * @chainable
 * @param {Number} taskId Task id
 * @param {Function} [callback] Callback function to be invoked when the task is updated
 * @param {Boolean} callback.result True if successful or false for failure
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.unprotectRecording = function unprotectRecording (taskId, callback) {
    this.logEntry();
    var task = this.getTask(taskId),
        handle;
    if (task) {
		if (task.objectState !== this.OBJECT_STATE.FINAL &&
				task.objectState !== this.OBJECT_STATE.ERROR &&
				task.objectState !== this.OBJECT_STATE.PROCESSED &&
				task.objectState !== this.OBJECT_STATE.DELETING &&
				task.objectState !== this.OBJECT_STATE.DELETED) {
            handle = CCOM.Scheduler.updateTask(taskId, {
                keep: false
            });
            if (handle && callback) {
                this._updateTaskCallbackLookup[handle] = callback;
            }
        } else {
            handle = CCOM.MediaLibrary.updateEntry(taskId, {
                keep: false
            });
            if (handle && callback) {
                this._updateEntryCallbackLookup[handle] = callback;
            }
        }
    }
    this.logExit();
    return this;
};

/**
 * Returns all available recordings (scheduled, partially recorded, fully recorded)
 * @method getAllRecordings
 * @param {Boolean} [asFolders=false] Determines whether series recordings are returned as folders
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getAllRecordings = function getAllRecordings (asFolders) {
    this.logEntry();
    var allTasks = this._getAllRecordings();
    asFolders = (asFolders === undefined || asFolders === null) ? false : asFolders;
    this.logExit();
    return asFolders ? this.mapRecordingsToFolder(allTasks) : allTasks;
};

/**
 * Returns all tasks from scheduler that are of type PVR, have not been deleted
 * and are scheduled or active.
 * @method getScheduledRecordings
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getScheduledRecordings = function getScheduledRecordings () {
    return this._getRecordingsByStatus(this.OBJECT_STATE.BOOKED);
};

/**
 * Returns all completed recordings.
 * @method getCompleteRecordings
 * @param {Boolean} [asFolders=false] Determines whether series recordings are returned as folders
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getCompleteRecordings = function getCompleteRecordings (asFolders) {
    this.logEntry();
    var recordedTasks = this._getCompletedRecordings();
    asFolders = (asFolders === undefined || asFolders === null) ? false : asFolders;
    this.logExit();
    return asFolders ? this.mapRecordingsToFolder(recordedTasks) : recordedTasks;
};

/**
 * Returns all tasks from scheduler that are of type PVR, have not been deleted
 * and currently active.
 * @method getActiveRecordings
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getActiveRecordings = function getActiveRecordings () {
    this.logEntry();
    var activeTasks = this._getActiveTasks();
    this.logExit();
    return activeTasks;
};

/**
 * Returns all available recordings (partially recorded, fully recorded) that is completely watched
 * @method getWatchedRecordings
 * @param {Boolean} [asFolders=false] Determines whether series recordings are returned as folders
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getWatchedRecordings = function getWatchedRecordings (asFolders) {
    this.logEntry();
    var allTasks = this._getWatchedRecordings();
    asFolders = (asFolders === undefined || asFolders === null) ? false : asFolders;
    this.logExit();
    return asFolders ? this.mapRecordingsToFolder(allTasks) : allTasks;
};

/**
 * Returns all available recordings (partially recorded, fully recorded) that has not been watched
 * @method getUnWatchedRecordings
 * @param {Boolean} [asFolders=false] Determines whether series recordings are returned as folders
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getUnWatchedRecordings = function getUnWatchedRecordings (asFolders) {
    this.logEntry();
    var allTasks = this._getUnWatchedRecordings();
    asFolders = (asFolders === undefined || asFolders === null) ? false : asFolders;
    this.logExit();
    return asFolders ? this.mapRecordingsToFolder(allTasks) : allTasks;
};

/**
 * Returns all tasks from scheduler that are of type PVR, have not been deleted
 * and are of type timed recording.
 * @method getTimedRecordings
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getTimedRecordings = function getTimedRecordings () {
    return this._getTimedTasks();
};

/**
 * Gets all series recordings that match a given completion status, or every series recording
 * if no status is passed in.
 * @method getSeriesRecordingsByStatus
 * @param {Number} recordingStatus Recording status, which is one of the `TaskStatus` enumeration.
 * @return {Array} A list of all matching series recordings. The array will contain one entry
 * for each series, with episodes folded under the 'subRecordings' attribute.
 */
o5.platform.btv.PVRManager.getSeriesRecordingsByStatus = function getSeriesRecordingsByStatus (recordingStatus) {
    return this.mapRecordingsToFolder(this._getSeriesRecordingsByStatus(recordingStatus));
};

/**
 * Returns a list of all recordings for a given series identified by a seriesId. By default,
 * this list is returned in the form of a folder with individual episodes in the series available
 * as 'subRecordings'.
 * @method getRecordingsBySeries
 * @param {String} seriesId Unique identifier for the series
 * @return {Array.<Object>} Returns an array of mapped recording objects
 */
o5.platform.btv.PVRManager.getRecordingsBySeries = function getRecordingsBySeries (seriesId) {
    return this.mapRecordingsToFolder(o5.platform.btv.PVRManager.getAllRecordingsForSeries(seriesId));
};

/**
 * Returns the PVR task associated with an event.
 * @method getPVRTaskByEvent
 * @removed
 */


/**
 * Determines if the given task is a PVR task and has been recorded.
 * @method isRecordingComplete
 * @param {Object} task Mapped recording object
 * @return {Boolean} Returns true if the given task has been recorded, otherwise false.
 */
o5.platform.btv.PVRManager.isRecordingComplete = function isRecordingComplete (task) {
    this.logEntry();
    if (task && this._isTaskObjectPVR(task) && (task._data.objectState >= this.OBJECT_STATE.PROCESSED)) {
        this.logDebug("Returning true");
        return true;
    }
    this.logDebug("Returning false");
    return false;
};

/**
 * Returns the progress of a currently recording task.
 * @method getTaskRecordProgress
 * @param {Number} taskId Task id
 * @return {Number} Percentage recorded
 */
o5.platform.btv.PVRManager.getTaskRecordProgress = function getTaskRecordProgress (taskId) {
    this.logEntry();
    var progress = 0,
        task = this.getTask(taskId),
        currentTime = new Date().getTime();
    if (task && task.startTime < currentTime) {
        if (task.endTime > currentTime) {
            progress = Math.round((currentTime - task.startTime) / (task.endTime - task.startTime) * 100);
        } else {
            progress = 100;
        }
    }
    this.logExit();
    return progress;
};

/**
 * Registers an event listener for uiRefresh as an alternative to the callback.
 * @method registerUIRefreshListener
 * @param {Function} listenerFn Callback function to receive UI refresh notification
 * @param {Object} callFunc A reference back to the object containing the listener
 */
o5.platform.btv.PVRManager.registerUIRefreshListener = function registerUIRefreshListener (listenerFn, callFunc) {
    this.logEntry();
    this._uiRefreshListeners.push({
        listener: listenerFn,
        callFunc: callFunc
    });
    this.logExit();
};

/**
 * Unregisters an event listener for uiRefresh
 * @method unregisterUIRefreshListener
 * @param {Function} listener Callback function that is receiving UI refresh notification
 */
o5.platform.btv.PVRManager.unregisterUIRefreshListener = function unregisterUIRefreshListener (listener) {
    this.logEntry();
    var i;
    for (i = 0; i < this._uiRefreshListeners.length; i++) {
        if (this._uiRefreshListeners[i].listener === listener) {
            this._uiRefreshListeners.splice(i, 1);
            break;
        }
    }
    this.logExit();
};

/**
 * Registers an event listener for when a job is successfully added.
 * @method registerAddJobCompletedListener
 * @param {Function} listenerFn Callback function to receive job complete notification
 * @param {Object} callFunc A reference back to the object containing the listener
 */
o5.platform.btv.PVRManager.registerAddJobCompletedListener = function registerAddJobCompletedListener (listenerFn, callFunc) {
    this.logEntry();
    this._addJobCompletedListeners.push({
        listener: listenerFn,
        callFunc: callFunc
    });
    this.logExit();
};

/**
 * Unregisters an addJobCompleted event listener
 * @method unregisterAddJobCompletedListener
 * @param {Function} listener Callback function that is receiving job complete notification
 */
o5.platform.btv.PVRManager.unregisterAddJobCompletedListener = function unregisterAddJobCompletedListener (listener) {
    this.logEntry();
    var i;
    for (i = 0; i < this._addJobCompletedListeners.length; i++) {
        if (this._addJobCompletedListeners[i].listener === listener) {
            this._addJobCompletedListeners.splice(i, 1);
            break;
        }
    }
    this.logExit();
};

/**
 * @method setUIRefreshCallback
 * @removed
 */

/**
 * Sets the function to be called whenever there's a change in the scheduler
 * @method setTaskChangedCallback
 * @chainable
 * @param {Function} callback Callback function that's to be invoked
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.PVRManager.setTaskChangedCallback = function setTaskChangedCallback (callback) {
    this.logEntry();
    if (!callback) {
        callback = this._emptyFunction;
    }
    this._taskChangedCallback = callback;
    this.logExit();
    return this;
};

/**
 * @method updateRecording
 * @removed
 */

/**
 * Sets the return order of recordings retrieved via the getCompleteRecordings function
 * @method setRecordingsReturnOrder
 * @param {Number} returnOrder Recording order types, which is one of the `RecordingsReturnOrderType` enumeration.
 */
o5.platform.btv.PVRManager.setRecordingsReturnOrder = function setRecordingsReturnOrder (returnOrder) {
    this._recordingsReturnOrder = returnOrder;
};

/**
 * Gets the return order of recordings retrieved via the getCompleteRecordings function
 * @method getRecordingsReturnOrder
 * @return {Number} Returns the current recording order, which is one of the `RecordingsReturnOrderType` enumeration.
 */
o5.platform.btv.PVRManager.getRecordingsReturnOrder = function getRecordingsReturnOrder () {
    return this._recordingsReturnOrder;
};

/**
 * @method setDefaultPadding
 * @removed
 */

/**
 * @method getDefaultPadding
 * @removed
 */

/**
 * Sets the scheduledRecordStartTime to zero.
 * @method setScheduledRecordStartTime
 */
o5.platform.btv.PVRManager.setScheduledRecordStartTime = function setScheduledRecordStartTime () {
    this._scheduledRecordStartTime = 0;
};

/**
 * Sets the tasks array to empty.
 * @method setActiveRecordTasksList
 */
o5.platform.btv.PVRManager.setActiveRecordTasksList = function setActiveRecordTasksList () {
    this._totalTasks.length = 0;
    this._tasksEndTimeArray.length = 0;
    this._taskCount = 0;
    this._taskStopCount = 0;
};

/**
 * Query for all generic reminders that are booked and with the matching title. Then return the first jobId
 * found from the result task list.
 * @method getArrayForStanbyBookedEvents
 * @param {String} title Title
 * @return {Number} Returns job id or null if not found.
 */
o5.platform.btv.PVRManager.getArrayForStanbyBookedEvents = function getArrayForStanbyBookedEvents (title) {
    var resultSet,
        tasks,
        jobId;
    resultSet = CCOM.Scheduler.getTasksRSByQuery("*", "taskType='" + this.TASK_TYPE.REMINDER + "' AND objectState='" + String(this.OBJECT_STATE.BOOKED) + "' AND title='" + String(title) + "'", "startTime");
    tasks = this._getArrayFromResultSet(resultSet);
    if (tasks[0] !== undefined) {
        jobId = tasks[0].jobId;
        return jobId;
    } else {
        return null;
    }
};

/**
 * Sets the callback method for delete content success.
 * @method setDeleteContentOKCallback
 * @param {Function} callback Callback function for delete content ok
 */
o5.platform.btv.PVRManager.setDeleteContentOKCallback = function setDeleteContentOKCallback (callback) {
    this._deleteContentOKCallback = callback;
};

/**
 * Return true if active recording on given serviceId
 * @method checkActiveRecordingByServiceId
 * @param {String} serviceId Service id
 * @return {Boolean} Returns true if given service id has active recording, otherwise false.
 */
o5.platform.btv.PVRManager.checkActiveRecordingByServiceId = function checkActiveRecordingByServiceId (serviceId) {
    if (this._activeRecordings[serviceId]) {
        return true;
    } else {
        return false;
    }
};

/**
 * Number of seconds that recording should be kept for if
 * no not protected and scheduler is set to auto delete
 * @property {Number} DEFAULT_KEEP_TIME
 * @removed
 */

/**
 * Enumeration of Schedule Tasks End Statuses.
 * Possible values are `TASK_END_REASON_NORMAL`, `TASK_END_REASON_USER`,
 * `TASK_END_REASON_OFFLINE`, & `TASK_END_REASON_SPACE`.
 * @property {Number} EndStatus
 * @removed
 */

/**
 * Enumeration of Schedule Tasks Failed Reasons.
 * Possible values are `TASK_STATUS_REASON_INTERRUPTED`, `TASK_STATUS_REASON_LATE`,
 * `TASK_STATUS_REASON_USER`, `TASK_STATUS_REASON_SPACE`, `TASK_STATUS_REASON_RESOURCE`,
 * `TASK_STATUS_REASON_URI`, `TASK_STATUS_REASON_PLAYER` and `TASK_STATUS_REASON_RECORDER`.
 * @property {Number} FailReason
 * @removed
 */

/*
 * Sets the callback method for bookmark deleted success.
 * The callback will triggered when bookmark is deleted successfully.
 * @method setDeleteBookMarkCallback
 * @deprecated Does nothing
 * @param {Function} callback Callback function for bookmark delete success
 */
o5.platform.btv.PVRManager.setDeleteBookMarkCallback = function setDeleteBookMarkCallback (callback) {
};

/**
 * Returns the object states enumeration
 * @method getObjectStates
 * @readonly
 * @return {Object} Object states enumeration with the following properties:
 *
 *        BOOKED {Number} 0
 *        PROCESSING {Number} 1
 *        SUSPEND_PROCESSING {Number} 2
 *        STOP_PROCESSING {Number} 3
 *        PROCESSED {Number} 4
 *        FINAL {Number} 5
 *        ERROR {Number} 6
 *        DELETING {Number} 7
 *        DELETED {Number} 8
 */
o5.platform.btv.PVRManager.getObjectStates = function getObjectStates () {
    return this.OBJECT_STATE;
};

/**
 * Returns the task type enumeration
 * @method getTaskType
 * @readonly
 * @return {Object} Task type enumeration with the following properties:
 *
 *        RECORDING {String} REC
 *        RMDR {String} RMDR
 *        REMINDER {String} GRMDR
 */
o5.platform.btv.PVRManager.getTaskType = function getTaskType () {
    return this.TASK_TYPE;
};

/**
 * Returns the job type enumeration
 * @method getJobType
 * @readonly
 * @return {Object} Job type enumeration with the following properties:
 *
 *        SINGLE {String} ONE_TIME
 *        EVENT {String} ONE_EVT
 *        REPEAT {String} RPT_TIME
 *        REPEAT_INTERVAL {String} RPT_INTERVAL
 *        SERIES {String} SERIES
 *        SEARCH {String} SEARCH
 */
o5.platform.btv.PVRManager.getJobType = function getJobType () {
    return this.JOB_TYPE;
};

/**
 * Sets medium id of the plugged-in medium (i.e. USB drive, HDD)
 * @method setPVRMediumId
 * @param {String} mediumId Medium id
 */
o5.platform.btv.PVRManager.setPVRMediumId = function setPVRMediumId (mediumId) {
    this._pvrMediumId = mediumId || null;
};

/**
 * Given a list of unscheduled tasks, calls ConflictManager to check for any conflicting task (i.e.
 * tasks that overlap). The result will be passed in to a callback that was registered in
 * setRecordingRequestConflictsCallback(). Therefore, prior to calling this method, the client should
 * call setRecordingRequestConflictsCallback() to register the callback function.
 * @method checkForWHConflictForTask
 * @async
 * @param {Array.<Object>} unscheduledTasks List of unscheduled tasks where taskId is a mandatory property
 * for each task object.
 */
o5.platform.btv.PVRManager.checkForWHConflictForTask = function checkForWHConflictForTask (unscheduledTasks) {
    this._conflictManager.handleConflictsForTasks(unscheduledTasks, function (conflicts) {
        this._recordingRequestConflictsCallback(unscheduledTasks, conflicts);
    }.bind(this));
};

/**
 * Refresh the current active list
 * @method executeUiRefreshCallback
 */
o5.platform.btv.PVRManager.executeUiRefreshCallback = function executeUiRefreshCallback () {
    this._executeListeners(this._uiRefreshListeners);
};


// Add _init() to array for o5.$.init2() to call when O5 starts up.
o5.$.init2Callbacks.push(o5.platform.btv.PVRManager._init);

// uncomment to turn debugging on for PVRManager object
// o5.log.setAll(o5.platform.btv.PVRManager, true);
