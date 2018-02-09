/**
 * Singleton instance to assist in PVR Cache functionality. The class wraps up the complexity
 * of requesting/stopping series, event and timed recordings offering a call back to
 * update the user interface once recordings have been set. The PVRRMCache
 * employs the help of the conflict manager to provide basic recording request conflict
 * resolutions, the init method allows the conflict manager to be replaced by a custom class
 * that conforms to the same interface. The meta-data associated to recordings has been
 * extended to allow bookmarks on content, plus additional data like name and lock. There are
 * also many methods defined such as isEventRecording to simplify the logic of the client
 * application
 *
 * @class o5.platform.btv.PVRRMCache
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.PVRRMCache = new (function PVRRMCache () {
    this.pvrManager = o5.platform.btv.PVRManager;
    // Cached recordings
    this.cacheRec = {
        all: [],
        booked: [],
        processing: [],
        suspendedProcessing: [],
        stopProcessing: [],
        processed: [],
        fiNal: [],
        erRor: []
    };
    this.cacheRmdr = []; // Cached reminders
    this.objectStates = this.pvrManager.getObjectStates();
    this.jobType = this.pvrManager.getJobType();
    this.TASKTYPE = this.pvrManager.getTaskType();
    this.pvrMediumId = undefined;
    this.FulfillmentStatus = {
        INVALID: 0,
        NONE: 1,
        PARTIAL: 2,
        FULL: 3
    };
})();

/**
 * Caches recordings or reminders.
 * @method _cacheTasks
 * @private
 * @param {Array.<Object>} recs An array of recording objects
 * @param {Boolean} isRec If true, it replaces the cached recordings. If false, it replaces
 * the cached reminders.
 */
o5.platform.btv.PVRRMCache._cacheTasks = function _cacheTasks (recs, isRec) {
    var i,
        recsLength = recs.length;
    this.logEntry();

    if (isRec) {
        this.cacheRec = {
            all: [],
            booked: [],
            processing: [],
            suspendedProcessing: [],
            stopProcessing: [],
            processed: [],
            fiNal: [],
            erRor: []
        };

        for (i = 0; i < recsLength; i++) {
            if (recs[i].objectState < this.objectStates.DELETING) {
                switch (recs[i].objectState) {
                    case this.objectStates.BOOKED:
                        this.cacheRec.booked[this.cacheRec.booked.length] = recs[i];
                        break;
                    case this.objectStates.PROCESSING:
                        this.cacheRec.processing[this.cacheRec.processing.length] = recs[i];
                        break;
                    case this.objectStates.SUSPEND_PROCESSING:
                        this.cacheRec.suspendedProcessing[this.cacheRec.suspendedProcessing.length] = recs[i];
                        break;
                    case this.objectStates.STOP_PROCESSING:
                        this.cacheRec.stopProcessing[this.cacheRec.stopProcessing.length] = recs[i];
                        break;
                    case this.objectStates.PROCESSED:
                        this.cacheRec.processed[this.cacheRec.processed.length] = recs[i];
                        break;
                    case this.objectStates.FINAL:
                        this.cacheRec.fiNal[this.cacheRec.fiNal.length] = recs[i];
                        break;
                    case this.objectStates.ERROR:
                        this.cacheRec.erRor[this.cacheRec.erRor.length] = recs[i];
                        break;
                }
            }
            this.cacheRec.all[this.cacheRec.all.length] = recs[i];
        }
    } else {
        this.cacheRmdr = recs;
    }
    this.logExit();
};

/**
 * Get cached recording list based on category
 * @method _getCachedRecording
 * @private
 * @param {String} [category='all'] One of 'all', 'booked', 'processing', 'suspendedProcessing', 'stopProcessing',
 * 'processed','fiNal' or 'erRor'.
 * @return {Array} Array of requested category recordings
 */
o5.platform.btv.PVRRMCache._getCachedRecording = function _getCachedRecording (category) {
    if (category) {
        return this.cacheRec[category];
    }
    return this.cacheRec.all || [];
};

/**
 * Check if the given property 'checkId' is scheduled (booked or recording).
 * @method _isScheduled
 * @private
 * @param {String} checkId Property value to check against
 * @param {String} checkProp Property name to query from cache
 * @param {Boolean} isPvr True if it is a recording, false if it is a reminder.
 * @return {Boolean} Returns true if the given checkId is in the scheduled cache.
 */
o5.platform.btv.PVRRMCache._isScheduled = function _isScheduled (checkId, checkProp, isPvr) {
    var checkRecs = this._getCachedRecording('processing').concat(this._getCachedRecording('booked')),
        i,
        checkLength = checkRecs.length;
    for (i = 0; i < checkLength; i++) {
        if (checkId === checkRecs[i][checkProp]) {
            if (isPvr) {
                if (checkRecs[i].taskType === this.TASKTYPE.RECORDING) {
                    return true;
                }
            } else {
                return true;
            }
        }
    }
    return false;
};

/**
 * Query for a task that matches the given checkId.
 * @method _getTask
 * @private
 * @param {String} checkId Property value to check against
 * @param {String} checkProp Property name to query from cache
 * @param {Boolean} isPvr True if it is a recording, false if it is a reminder.
 * @return {Object} Returns the task object
 */
// Disable ESLint complexity because this API may be refactored in the future to simplify scheduling of task & jobs
// eslint-disable-next-line complexity
o5.platform.btv.PVRRMCache._getTask = function _getTask (checkId, checkProp, isPvr) {
    //this.logDebug("_getTask(), checkProp: " + checkProp + ", checkId: " + checkId + ", isPvr: " + isPvr);
    var allRecs = this._getCachedRecording().concat(this.cacheRmdr),
        allRecLength = allRecs.length,
        i, j,
        nullTask = {
            _data: ""
        },
        recordings;
    for (i = 0; i < allRecLength; i++) {
        if (allRecs[i].scheduleType === "SERIES") {
            recordings = allRecs[i].subRecordings;
            if (recordings && recordings.length) {
                for (j = 0; j < recordings.length; j++) {
                    if (recordings[j].taskId === checkId || recordings[j].eventId === checkId) {
                        return recordings[j];
                    } else if (checkId === allRecs[i][checkProp]) {
                        if (isPvr) {
                            if (allRecs[i].taskType === this.TASKTYPE.RECORDING) {
                                return allRecs[i];
                            }
                        } else {
                            return allRecs[i];
                        }
                    }
                }
            }
        } else if (checkId === allRecs[i][checkProp]) {
            if (isPvr) {
                if (allRecs[i].taskType === this.TASKTYPE.RECORDING) {
                    return allRecs[i];
                }
            } else {
                return allRecs[i];
            }
        }
    }
    return nullTask;
};

/**
 * Check if the given checkId is active recording.
 * @method _isActive
 * @private
 * @param {String} checkId Property value to check against
 * @param {String} checkProp Property name to query from cache
 * @param {Boolean} isPvr True if it is a recording, false if it is a reminder.
 * @return {Boolean} True if it is active recording, otherwise false.
 */
o5.platform.btv.PVRRMCache._isActive = function _isActive (checkId, checkProp, isPvr) {
    var activeRecs = this._getCachedRecording('processing'),
        i,
        activeRecLength = activeRecs.length;
    for (i = 0; i < activeRecLength; i++) {
        if (checkId === activeRecs[i][checkProp]) {
            if (isPvr) {
                if (activeRecs[i].taskType === this.TASKTYPE) {
                    return true;
                }
            } else {
                return true;
            }
        }
    }
    return false;
};

/**
 * Called by o5.$.init2() when O5 starts up.
 * @method _init
 * @private
 */
o5.platform.btv.PVRRMCache._init = function _init () {
    // Don't use 'this' as this is called by o5.$.init2()
    var me = o5.platform.btv.PVRRMCache;
    me.FulfillmentStatus.INVALID = CCOM.Scheduler.INVALID;
    me.FulfillmentStatus.NONE = CCOM.Scheduler.NONE;
    me.FulfillmentStatus.PARTIAL = CCOM.Scheduler.PARTIAL;
    me.FulfillmentStatus.FULL = CCOM.Scheduler.FULL;
};

/**
 * Initializes the PVRRMCache ready for use, must be called prior to any
 * other method calls.
 * @method initialise
 */
o5.platform.btv.PVRRMCache.initialise = function initialise () {
    var allTasks = this.pvrManager.getAllRecordings(true),
        isPvr = true; // Unable to get taskType as a field.
    this._cacheTasks(allTasks, isPvr);
    allTasks = this.pvrManager.getScheduledReminder();
    this._cacheTasks(allTasks);
};

/**
 * Get cached recording list based on category
 * @method getCachedRecording
 * @removed move to private API
 */


/**
 * Check if task with eventId is scheduled
 * @method isPVREventScheduled
 * @param {String} eventId Event id
 * @return {Boolean} Returns true if task is scheduled, otherwise false.
 */
o5.platform.btv.PVRRMCache.isPVREventScheduled = function isPVREventScheduled (eventId) {
    var isPvr = true;
    return this._isScheduled(eventId, 'eventId', isPvr);
};

/**
 * Get task by event id
 * @method getTaskByEventId
 * @param {String} eventId Event id
 * @return {Object} Task associated with the event id
 */
o5.platform.btv.PVRRMCache.getTaskByEventId = function getTaskByEventId (eventId) {
    return this._getTask(eventId, 'eventId');
};

/**
 * Check if task with taskId is scheduled
 * @method isTaskScheduled
 * @param {Number} taskId Task id
 * @return {Boolean} Returns true if task is scheduled, otherwise false.
 */
o5.platform.btv.PVRRMCache.isTaskScheduled = function isTaskScheduled (taskId) {
    var isPvr = true;
    return this._isScheduled(taskId, 'taskId', isPvr);
};

/**
 * Check if task with taskId is recording now
 * @method isTaskRecordingNow
 * @param {Number} taskId Task id
 * @return {Boolean} Returns true if task is recording, otherwise false.
 */
o5.platform.btv.PVRRMCache.isTaskRecordingNow = function isTaskRecordingNow (taskId) {
    return this._isActive(taskId, 'taskId');
};

/**
 * Get task with given taskId
 * @method getTaskById
 * @param {Number} taskId Task id
 * @return {Object} Returns task with the given taskId.
 */
o5.platform.btv.PVRRMCache.getTaskById = function getTaskById (taskId) {
    return this._getTask(taskId, 'taskId');
};

/**
 * Get task with given jobId
 * @method getJobById
 * @param {Number} jobId Job id
 * @return {Object} Returns task with the given jobId.
 */
o5.platform.btv.PVRRMCache.getJobById = function getJobById (jobId) {
    return this._getTask(jobId, 'jobId');
};

/**
 * Get task with given eventId
 * @method getPVREventByEventId
 * @param {String} eventId Event id
 * @return {Object} Returns task with the given eventId.
 */
o5.platform.btv.PVRRMCache.getPVREventByEventId = function getPVREventByEventId (eventId) {
    return this._getTask(eventId, 'eventId', true);
};

/**
 * Check if event with given event id is recording now
 * @method isEventRecordingNow
 * @param {String} eventId Event id
 * @return {Boolean} Returns true if event is recording, otherwise false.
 */
o5.platform.btv.PVRRMCache.isEventRecordingNow = function isEventRecordingNow (eventId) {
    var isPvr = true;
    return this._isActive(eventId, 'eventId', isPvr);
};

/**
 * Check if a recording with given taskId is protected or not
 * @method isRecordingProtected
 * @param {Number} taskId Task id
 * @return {Boolean} Returns true if task is protected, otherwise false.
 */
o5.platform.btv.PVRRMCache.isRecordingProtected = function isRecordingProtected (taskId) {
    var task = this._getTask(taskId, 'taskId');
    if (task && task.keep) {
        this.logExit();
        return true;
    }
    return false;
};

/**
 * Get all cached recordings
 * @method getAllRecordings
 * @param {Boolean} asFolders True to get all recordings as folders
 * @return {Array} Returns an array of tasks
 */
o5.platform.btv.PVRRMCache.getAllRecordings = function getAllRecordings (asFolders) {
    var allTasks = this._getCachedRecording();
    return asFolders ? o5.platform.btv.PVRManager.mapRecordingsToFolder(allTasks) : allTasks;
};

/**
 * Get all scheduled recordings
 * @method getScheduledRecordings
 * @return {Array} Returns all scheduled tasks
 */
o5.platform.btv.PVRRMCache.getScheduledRecordings = function getScheduledRecordings () {
    return this._getCachedRecording('booked');
};

/**
 * Get all active recordings
 * @method getActiveRecordings
 * @return {Array} Returns all active tasks
 */
o5.platform.btv.PVRRMCache.getActiveRecordings = function getActiveRecordings () {
    return this._getCachedRecording('processing');
};

/**
 * Get all partial and completed recordings
 * @method getPartialRecordings
 * @return {Array} Returns all partial and completed tasks
 */
o5.platform.btv.PVRRMCache.getPartialRecordings = function getPartialRecordings () {
    var recs = this._getCachedRecording('processed').concat(this._getCachedRecording('fiNal')),
        i,
        recLength = recs.length,
        partialRecs = [],
        partialStatus = this.FulfillmentStatus.PARTIAL;
    for (i = 0; i < recLength; i++) {
        if (recs[i].completeStatus === partialStatus) {
            partialRecs[partialRecs.length] = recs[i];
        }
    }
    return partialRecs;
};

/**
 * Get failed recordings
 * @method getFailedRecordings
 * @return {Array} Returns all suspended and erroneous tasks
 */
o5.platform.btv.PVRRMCache.getFailedRecordings = function getFailedRecordings () {
    return this._getCachedRecording('suspendedProcessing').concat(this._getCachedRecording('erRor'));
};

/**
 * Check if reminder is set for given event id
 * @method isReminderSetForEventId
 * @param {String} eventID Event id
 * @return {Boolean} Returns true if reminder is set
 */
o5.platform.btv.PVRRMCache.isReminderSetForEventId = function isReminderSetForEventId (eventID) {
    var i,
        rmdrsLength = this.cacheRmdr.length;
    for (i = 0; i < rmdrsLength; i++) {
        if (this.cacheRmdr[i].eventId === eventID) {
            return true;
        }
    }
    return false;
};

/**
 * Get scheduled or active task given the service id and time window
 * @method getTaskByServiceIdAndTime
 * @param {Number} eventStartTime Event start time
 * @param {Number} eventEndTime Event end time
 * @param {String} serviceId Service id
 * @return {Object} Returns a scheduled/active task or null if not found
 */
o5.platform.btv.PVRRMCache.getTaskByServiceIdAndTime =
function getTaskByServiceIdAndTime (eventStartTime, eventEndTime, serviceId) {
    var recs = this._getCachedRecording('booked').concat(this._getCachedRecording('processing')),
        i,
        recLength = recs.length;
    for (i = 0; i < recLength; i++) {
        if (serviceId === recs[i].serviceId) {
            if (recs[i].startTime < eventEndTime && recs[i].endTime > eventStartTime) {
                return recs[i];
            }
        }
    }
    return null;
};

/**
 * Get tasks with given jobId that are completed or in the process of doing so.
 * @method getTimedTasksforJobId
 * @param {Number} jobId Job id
 * @return {Array} Return an array of tasks
 */
o5.platform.btv.PVRRMCache.getTimedTasksforJobId = function getTimedTasksforJobId (jobId) {
    var recs = this._getCachedRecording(),
        i,
        recLength = recs.length,
        tmpTask = [];
    for (i = 0; i < recLength; i++) {
        // Look for tasks that is completed, or in the process of doing so
        if (recs[i].jobId === jobId && recs[i].objectState > String(this.objectStates.SUSPEND_PROCESSING) &&
            recs[i].objectState < String(this.objectStates.ERROR) &&
            ((recs[i].scheduleType === this.jobType.SINGLE) || (recs[i].scheduleType === this.jobType.REPEAT))) {
            tmpTask[tmpTask.length] = recs[i];
        }
    }
    return tmpTask;
};

/**
 * @method getBookedAndActiveRecordings
 * @removed
 */

/**
 * Get scheduled reminder
 * @method getScheduledReminder
 * @return {Array.<Object>} Returns an array of reminder objects
 */
o5.platform.btv.PVRRMCache.getScheduledReminder = function getScheduledReminder () {
    return this.cacheRmdr;
};

/**
 * Get all recordings that are not erroneous (scheduled, active, suspended, stopped, completed).
 * @method getTimedRecordings
 * @return {Array.<Object>} An array of tasks
 */
o5.platform.btv.PVRRMCache.getTimedRecordings = function getTimedRecordings () {
    var recs = this._getCachedRecording(),
        i,
        recsLength = recs.length,
        tmpTask = [];
    for (i = 0; i < recsLength; i++) {
        if (recs[i].objectState < this.objectStates.ERROR &&
            ((recs[i].scheduleType === this.jobType.SINGLE) || (recs[i].scheduleType === this.jobType.REPEAT))) {
            tmpTask[tmpTask.length] = recs[i];
        }
    }
    return tmpTask;
};

/**
 * Set PVR media id
 * @method setPVRMediumId
 * @param {String} id Medium id
 */
o5.platform.btv.PVRRMCache.setPVRMediumId = function setPVRMediumId (id) {
    this.pvrMediumId = id || null;
};

/**
 * Returns the task status of the task given the service id and time window. Note that
 * this method only looks for tasks that are scheduled or active.
 * @method getEventRecordingStatusByServiceId
 * @param {Number} eventStartTime Event start time
 * @param {Number} eventEndTime Event end time
 * @param {String} serviceId Service id of the task to query for
 * @return {Number} Returns the task status, which is one of the `TaskStatus` enumeration
 * in PVRManager.TaskStatus.
 */
o5.platform.btv.PVRRMCache.getEventRecordingStatusByServiceId =
function getEventRecordingStatusByServiceId (eventStartTime, eventEndTime, serviceId) {
    this.logEntry();
    if (this.pvrMediumId) {
        var i, j,
            recs = this._getCachedRecording(),
            recLength = recs.length;
        for (i = 0; i < recLength; i++) {
            if (recs[i].scheduleType === "SERIES" && recs[i].serviceId === serviceId) {
                for (j = 0; j < recs[i].subRecordings.length; j++) {
                    if (recs[i].subRecordings[j].serviceId === serviceId &&
                        recs[i].subRecordings[j].objectState < String(this.objectStates.SUSPEND_PROCESSING)) {
                        if (recs[i].subRecordings[j].startTime < eventEndTime &&
                            recs[i].subRecordings[j].endTime > eventStartTime) {
                            this.logExit();
                            return this.pvrManager.getStatusForTask(recs[i].subRecordings[j]);
                        }
                    }
                }
            } else if (recs[i].serviceId === serviceId && recs[i].objectState < String(this.objectStates.SUSPEND_PROCESSING)) {
                if (recs[i].serviceId === serviceId && recs[i].startTime < eventEndTime && recs[i].endTime > eventStartTime) {
                    this.logExit();
                    return this.pvrManager.getStatusForTask(recs[i]);
                }
            }
        }
    }
    this.logExit();
    return this.pvrManager.TaskStatus.TASK_STATUS_UNSCHEDULED;
};

/**
 * Returns an array of tasks that meets the time and state (task status) requirement.
 * @method getRecordingsByCurrentTimeAndState
 * @param {Number} [startTime=current time] Time of task to look for
 * @param {Number} [state=1] The task status, which is one of the `TaskStatus` enumeration
 * in PVRManager.TaskStatus, to look for. Any value equal or less than this state will be
 * included in the return result.
 * @return {Array} An array of task objects.
 */
o5.platform.btv.PVRRMCache.getRecordingsByCurrentTimeAndState =
function getRecordingsByCurrentTimeAndState (startTime, state) {
    var i,
        recs = this._getCachedRecording(),
        currentTime = startTime || new Date().getTime(),
        objectState = state || 1,
        recLength = recs.length,
        tmpTasks = [];
    for (i = 0; i < recLength; i++) {
        if (recs[i].startTime < currentTime && recs[i].endTime > currentTime &&
            recs[i].objectState <= String(objectState)) {
            tmpTasks[tmpTasks.length] = recs[i];
        }
    }
    return tmpTasks;
};

/**
 * Returns the status of a recording task for the given eventId
 * @method getEventRecordingStatus
 * @param {String} eventId Event id of the task to search for
 * @param {Boolean} isPvr True if it is a recording, false if it is a reminder.
 * @return {Number} Returns the task status, which is one of the `TaskStatus` enumeration
 * in PVRManager.TaskStatus.
 */
o5.platform.btv.PVRRMCache.getEventRecordingStatus = function getEventRecordingStatus (eventId, isPvr) {
    var task = this._getTask(eventId, 'eventId', isPvr);
    return this.pvrManager.getStatusForTask(task);
};

/**
 * Returns the task associated with an active reminder,
 * i.e. will NOT return any reminders that are marked as cancelled.
 * @method getScheduledReminderByEvent
 * @param {String} eventId Event id
 * @return {Object} Returns the reminder or null if not found.
 */
o5.platform.btv.PVRRMCache.getScheduledReminderByEvent = function getScheduledReminderByEvent (eventId) {
    var i,
        rmdrLength = this.cacheRmdr.length;
    for (i = 0; i < rmdrLength; i++) {
        if (this.cacheRmdr[i].eventId === eventId) {
            return this.cacheRmdr[i];
        }
    }
    return null;
};

/**
 * Check if the reminder given the eventId is scheduled and a series.
 * @method isReminderSetForSeriesEventId
 * @param {String} eventId Event id
 * @return {Boolean} Returns true if the reminder is a scheduled series, otherwise false.
 */
o5.platform.btv.PVRRMCache.isReminderSetForSeriesEventId = function isReminderSetForSeriesEventId (eventId) {
    var i,
        rmdrLength = this.cacheRmdr.length;
    for (i = 0; i < rmdrLength; i++) {
        if (this.cacheRmdr[i].eventId === eventId && this.cacheRmdr[i].scheduleType === this.jobType.SERIES &&
            this.cacheRmdr[i].objectState === this.objectStates.BOOKED) {
            return true;
        }
    }
    return false;
};

/**
 * Clears PVR RAM cache
 * @method emptyCache
 */
o5.platform.btv.PVRRMCache.emptyCache = function emptyCache () {
    this.cacheRec = {
        all: [],
        booked: [],
        processing: [],
        suspendedProcessing: [],
        stopProcessing: [],
        processed: [],
        fiNal: [],
        erRor: []
    };
};


// Add _init() to array for o5.$.init2() to call when O5 starts up.
o5.$.init2Callbacks.push(o5.platform.btv.PVRRMCache._init);

// uncomment to turn debugging on for PVRRMCache object
// o5.log.setAll(o5.platform.btv.PVRRMCache, true);
