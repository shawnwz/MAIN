/**
 * Notifies callers about the start of scheduled programs. Callers can register their own
 * method which will be invoked when scheduled programs are about to start.
 *
 * @class o5.platform.btv.Reminders
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.Reminders = new (function Reminders () {
    this.TASK_TYPE_REMINDER = "GRMDR";
    this.JOB_TYPE_SINGLE = "ONE_TIME";
    this.JOB_TYPE_SERIES = "SERIES";
    this.preHardPaddingDuration = 0;
    this.reminderCallback = null;
    this.gReminderCallback = null;
    this.taskOccuredCallback = null;
    this.jobHandleLookup = {};
    this.cachedTasks = {};
    this.remindEvent = null;
})();

/**
 * Sets the callback to be executed when an event for which a reminder was set earlier
 * is about to start.
 * @method _setGReminderCallback
 * @private
 * @chainable
 * @param {Function} callback Callback function to be invoked when reminder task starts
 * @param {Object} callback.result Result object
 * @param {Object} callback.result.task Mapped reminder object or null if not found.
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.Reminders._setGReminderCallback = function _setGReminderCallback (callback) {
    this.logEntry();
    if (this.gReminderCallback) {
        CCOM.Scheduler.removeEventListener("onTaskStarted", this.gReminderCallback, false);
    }
    this.gReminderCallback = function (e) {
        if (e.taskType === o5.platform.btv.Reminders.TASK_TYPE_REMINDER) {
            callback({
                task: o5.platform.btv.PVRManager.getTask(e.taskId)
            });
            return;
        }
    };
    if (this.gReminderCallback) {
        CCOM.Scheduler.addEventListener("onTaskStarted", this.gReminderCallback, false);
    }
    this.logExit();
    return this;
};

/**
 * Event handler to handle job succeeded callback
 * @method _addJobSucceededListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.Reminders._addJobSucceededListener = function _addJobSucceededListener (e) {
    var me = o5.platform.btv.Reminders;
    me.logEntry();
    me.cachedTasks[me.remindEvent] = e.jobId;
    if (me.jobHandleLookup.hasOwnProperty(e.handle)) {
        me.jobHandleLookup[e.handle](true);
        delete me.jobHandleLookup[e.handle];
    }
    me.logExit();
};

/**
 * Event handler to handle task failed callback
 * @method _addTaskFailedListener
 * @private
 * @param {Object} e Event object
 */
o5.platform.btv.Reminders._addTaskFailedListener = function _addTaskFailedListener (e) {
    var me = o5.platform.btv.Reminders;
    me.logEntry();
    if (me.jobHandleLookup.hasOwnProperty(e.handle)) {
        me.jobHandleLookup[e.handle](false);
        delete me.jobHandleLookup[e.handle];
    }
    me.logExit();
};

o5.platform.btv.Reminders._deleteJobSucceededListener = function _deleteJobSucceededListener (e) {
    var me = o5.platform.btv.Reminders;
    me.logEntry();
    delete me.cachedTasks[me.remindEvent];
    if (me.jobHandleLookup.hasOwnProperty(me.remindEvent)) {
        me.jobHandleLookup[me.remindEvent](true);
        delete me.jobHandleLookup[me.remindEvent];
    }
    me.logExit();
};


/**
 * Generates the information object to schedule and request job resources
 * @method _getAdditionalInfo
 * @private
 * @param {Object} entity Task object
 * @param {Number} preHardPaddingDurationTime Hard pre-padding time
 * @return {Object} Returns the information object
 */
o5.platform.btv.Reminders._getAdditionalInfo = function _getAdditionalInfo (entity, preHardPaddingDurationTime) {
    var additionalInfo = {};
    if (entity && entity.seriesId) {
        additionalInfo.sqlQueryFilter = "seriesId = '" + entity.seriesId + "'";
        additionalInfo.sqlQueryFilter += " AND ";
        additionalInfo.sqlQueryFilter += " startTime >= '" + entity.startTime + "'";
        additionalInfo.eventId = entity.eventId;
        additionalInfo.hardPrepaddingDuration = preHardPaddingDurationTime;
    }
    return additionalInfo;
};

o5.platform.btv.Reminders._init = function _init () {
    // Don't use 'this' as this is called by o5.$.init2()
    var me = o5.platform.btv.Reminders;
    CCOM.Scheduler.addEventListener("addJobOK", me._addJobSucceededListener);
    CCOM.Scheduler.addEventListener("addJobFailed", me._addTaskFailedListener);
    CCOM.Scheduler.addEventListener("deleteJobOK", me._deleteJobSucceededListener);
};

/**
 * Initializes the reminder functionality, and starts listening to the CCOM add job event.
 * Be sure to register at least one listener in order to do something useful when the
 * add job event is triggered.
 * @method init
 * @param {Number} alertTime Unused variable
 * @param {Function} [reminderCallbackFunction] Callback function to be invoked for when a reminder starts
 */
o5.platform.btv.Reminders.init = function init (alertTime, reminderCallbackFunction) {
    this.logEntry();
    this.preHardPaddingDuration = o5.platform.system.Preferences.get("/system/opentv/scheduler/JobTaskManager/viewerPeriod", true) * 1000;
    //'alertTime' not used... set the 'viewer period alert' time configuration value to 'alertTime'
    if (reminderCallbackFunction) {
        this._setGReminderCallback(reminderCallbackFunction);
    }
    this.logExit();
};

/**
 * Sets the callback to be executed when an event for which a reminder was set earlier is
 * about to start in `alertTime` seconds. The callback is passed a task object that is
 * returned from the tasks database.
 * @method setReminderCallback
 * @chainable
 * @param {Function} callback Callback function to be invoked
 * @param {Object} callback.result Result object
 * @param {Object} callback.result.task Mapped reminder object
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.Reminders.setReminderCallback = function setReminderCallback (callback) {
    this.logEntry();
    var me = o5.platform.btv.Reminders;
    if (this.reminderCallback) {
        CCOM.Scheduler.removeEventListener("onTaskVPAlert", this.reminderCallback, false);
    }
    this.reminderCallback = function (e) {
        var event = o5.platform.btv.PVRManager.getTask(e.taskId);
        if (e.taskType === "RMDR") {
            delete me.cachedTasks[event.eventId];
            callback(event);
            return;
        }
    };
    if (this.reminderCallback) {
        CCOM.Scheduler.addEventListener("onTaskVPAlert", this.reminderCallback, false);
    }
    this.logExit();
    return this;
};

/**
 * Sets the callback to be executed when an event for which a reminder was set earlier is
 * starting. The callback is passed a task object that is returned from the tasks database.
 * @method setTaskOccuredCallback
 * @chainable
 * @param {Function} callback Callback function to be invoked to receive the task object
 * @param {Object} callback.result Result object
 * @param {Object} callback.result.task Mapped reminder object
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.Reminders.setTaskOccuredCallback = function setTaskOccuredCallback (callback) {
    this.logEntry();
    if (this.taskOccuredCallback) {
        CCOM.Scheduler.removeEventListener("onTaskStarted", this.taskOccuredCallback, false);
    }
    this.taskOccuredCallback = function (e) {
        if (e.taskType === "RMDR") {
            callback({
                task: o5.platform.btv.PVRRMCache.getTaskById(e.taskId)
            });
            return;
        }
    };
    if (this.taskOccuredCallback) {
        CCOM.Scheduler.addEventListener("onTaskStarted", this.taskOccuredCallback, false);
    }
    this.logExit();
    return this;
};

/**
 * Sets a reminder for the given event id. Two callbacks could be associated the reminder,
 * one that will be invoked when the event is about to start in `alertTime` seconds,
 * and another that will be invoked when the event is starting.
 * @method setReminder
 * @async
 * @chainable
 * @param {String} eventId The event id we are setting a reminder for
 * @param {Function} [callback] Callback for when the reminder is added successfully or
 * unsuccessfully
 * @param {Boolean} callback.result True if reminder is added successfully or false for failure
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.Reminders.setReminder = function setReminder (eventId, callback) {
    this.logEntry();
    var handle;

    this.remindEvent = eventId;

    handle = CCOM.Scheduler.addJob("RMDR", "ONE_EVT", {
        eventId: eventId
    });
    if (callback) {
        this.logDebug("adding jobHandleLookup - handle = " + handle);
        this.jobHandleLookup[handle] = callback;
    }
    this.logExit();
    return this;
};

/**
 * Sets a generic reminder for the given event id. Two callbacks could be associated the reminder,
 * one that will be invoked when the event is about to start in `alertTime` seconds, and
 * another that will be invoked when the event is starting.
 * @method setGReminder
 * @async
 * @chainable
 * @param {Object} entity Event object with the following must have properties:
 * @param {String} entity.eventId Event id
 * @param {String} entity.uri Service uri
 * @param {String} entity.title Title
 * @param {Number} entity.startTime Start time
 * @param {Number} entity.endTime End time
 * @param {Function} [callback] Callback for when the reminder is added successfully or
 * unsuccessfully
 * @param {Boolean} callback.result True if reminder is added successfully or false for failure
 * @param {Boolean} [isSeries=false] True if it is a series reminder or false for single reminder
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.Reminders.setGReminder = function setGReminder (entity, callback, isSeries) {
    this.logEntry();
    var eventId = entity.eventId,
        sourceURL = entity.uri,
        title = entity.title,
        handle,
        startTime = entity.startTime,
        seriesReminderQuery,
        duration = entity.endTime - startTime;
    if (isSeries) {
        seriesReminderQuery = this._getAdditionalInfo(entity, this.preHardPaddingDuration);
        handle = CCOM.Scheduler.addJob(this.TASK_TYPE_REMINDER, this.JOB_TYPE_SERIES, seriesReminderQuery);
    } else {
        handle = CCOM.Scheduler.addJob(this.TASK_TYPE_REMINDER, this.JOB_TYPE_SINGLE, {
            startTime: startTime,
            duration: duration,
            hardPrepaddingDuration: this.preHardPaddingDuration,
            sourceURL: sourceURL,
            eventId: eventId,
            title: title
        });
    }
    if (callback) {
        this.logDebug("adding jobHandleLookup - handle = " + handle);
        this.jobHandleLookup[handle] = callback;
    }
    this.logExit();
    return this;
};

/**
 * Cancels the reminder for the given event id
 * @method cancelReminder
 * @async
 * @chainable
 * @param {String} eventId The event id we want to cancel
 * @param {Function} [callback] Callback for when the reminder is added successfully or
 * unsuccessfully
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.Reminders.cancelReminder = function cancelReminder (eventId, callback) {
    this.logEntry();
    //var task = o5.platform.btv.PVRRMCache.getScheduledReminderByEvent(eventId);
    if (this.cachedTasks[eventId]) {
        this.remindEvent = eventId;
        CCOM.Scheduler.deleteJob(this.cachedTasks[eventId]);
    }
    if (callback) {
        this.jobHandleLookup[eventId] = callback;
    }
    this.logExit();
    return this;
};

/**
 * Cancels the series reminder for the given event id
 * @method cancelSeriesReminder
 * @async
 * @chainable
 * @param {String} eventId The event id we want to cancel
 * @return {Object} Returns 'this' to support chainable methods
 */
o5.platform.btv.Reminders.cancelSeriesReminder = function cancelSeriesReminder (eventId) {
    this.logEntry();
    var task = o5.platform.btv.PVRManager.getScheduledReminderBySeriesEvent(eventId);
    if (task) {
        CCOM.Scheduler.deleteJob(task.jobId);
    }
    this.logExit();
    return this;
};

/**
 * Returns true if the given event id has a reminder set
 * @method isReminderSetForEventId
 * @param {String} eventId Event id
 * @return {Boolean} Returns true if the reminder is set, otherwise false.
 */
o5.platform.btv.Reminders.isReminderSetForEventId = function isReminderSetForEventId (eventId) {
    this.logEntry();
/*
    var task = o5.platform.btv.PVRRMCache.getScheduledReminderByEvent(eventId);
    if (task) {
        return true;
    }
*/
    if (this.cachedTasks && this.cachedTasks[eventId]) {
        return true;
    }
    return false;
};

/**
 * @method isReminderSetForSeriesEventId
 * @removed
 */

/**
 * @method setAutoTunePlayer
 * @removed
 */

// Add _init() to array for o5.$.init2() to call when O5 starts up.
o5.$.init2Callbacks.push(o5.platform.btv.Reminders._init);

// uncomment to turn debugging on for Reminders object
// o5.log.setAll(o5.platform.btv.Reminders, true);
