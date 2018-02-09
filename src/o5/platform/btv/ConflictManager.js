/**
 * A class used to query the Scheduler for conflicting tasks.
 * The public API allows the retrieval of tasks that conflict with a specific recording
 * or retrieval of tasks that are conflicting at a specific time.
 * Many of the public methods are asynchronous and require callbacks to be passed in.
 * These callbacks must accept an array of tasks. If the returned array is empty, then it
 * means that no conflicts were detected.
 *
 * @class o5.platform.btv.ConflictManager
 * @constructor
 * @param {Object} pvrManagerObj Handle to o5.platform.btv.PVRManager object.
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.ConflictManager = function ConflictManager (pvrManagerObj) {
    this._pvrManager = pvrManagerObj || o5.platform.btv.PVRManager;
    this._taskAllOptionsHandle = null;
    this._taskAllOptionsCallback = function () {};
    this._taskOverlapsHandle = null;
    this._taskOverlapsCallback = function () {};
    this._existingConflicts = [];
    this._taskIdOfUnscheduledTask = null;
    
    this._taskOverlapsListenerBind = this._taskOverlapsListener.bind(this);
    this._taskAllOptionsListenerBind = this._taskAllOptionsListener.bind(this);
};

/**
 * Task types
 * @property {String} _TASK_TYPE
 * @private
 * @readonly
 */
o5.platform.btv.ConflictManager.prototype._TASK_TYPE = {
    RECORDING: "REC",
    REMINDER: "RMDR",
    REVIEWBUFFER: "RBREC",
    LIVE: "LIVE"
};

/**
 * Completion status
 * @property {Number} _COMPLETION_STATUS
 * @private
 * @readonly
 */
o5.platform.btv.ConflictManager.prototype._COMPLETION_STATUS = {
    INVALID: 0,
    NONE: 1,
    PARTIAL: 2,
    FULL: 3
};

/**
 * Makes an array of the task options excluding reminders
 * @method _removeRemindersFromConflictOptions
 * @private
 * @param {Object} event Event
 * @return {Array} An array of task options excluding reminders
 */
o5.platform.btv.ConflictManager.prototype._removeRemindersFromConflictOptions = function _removeRemindersFromConflictOptions (event) {
    this.logEntry();
    var i,
        j,
        addTaskOption = true,
        taskItemLookup = {},
        taskOptionItems = [],
        taskOptionsWithoutReminders = [];

    for (i = 0; i < event.allTaskIds.length; i++) {
        taskItemLookup[event.allTaskIds[i]] = event.allTaskTypes[i];
    }

    for (i = 0; i < event.taskOptions.length; i++) {
        taskOptionItems = event.taskOptions[i];
        for (j = 0; j < taskOptionItems.length; j++) {
            if (taskItemLookup[taskOptionItems[j]] === this._TASK_TYPE.REMINDER) {
                addTaskOption = false;
                break;
            }
        }
        if (addTaskOption) {
            taskOptionsWithoutReminders.push(event.taskOptions[i]);
        } else {
            addTaskOption = true;
        }
    }
    return taskOptionsWithoutReminders;
};

/**
 * Handler for the getTaskAllOptions events
 * @method _taskAllOptionsListener
 * @private
 * @param {Object} event Event
 */
o5.platform.btv.ConflictManager.prototype._taskAllOptionsListener = function _taskAllOptionsListener (event) {
    this.logEntry();
    var conflictingTasks = [],
        conflictingTask,
        i,
        taskOptionsWithoutReminders = [];

    if (event.handle === this._taskAllOptionsHandle && event.error === undefined && event.taskOptions) {
        taskOptionsWithoutReminders = this._removeRemindersFromConflictOptions(event);
        if (taskOptionsWithoutReminders.length > 1) {
            for (i = 0; i < event.allTaskIds.length; i++) {
                conflictingTask = this._pvrManager.getTask(event.allTaskIds[i]);
                if (conflictingTask && (event.allTaskTypes[i] === this._TASK_TYPE.RECORDING)) {
                    conflictingTasks.push(conflictingTask);
                }
            }
            this._taskAllOptionsCallback(conflictingTasks);
        }
    }
};

/**
 * Handler for the getTaskOverlaps events
 * @method _taskOverlapsListener
 * @private
 * @param {Object} event Event
 */
o5.platform.btv.ConflictManager.prototype._taskOverlapsListener = function _taskOverlapsListener (event) {
    this.logEntry();
    var i,
        conflictingTask,
        conflictingTasks = [];
    if (event.handle === this._taskOverlapsHandle && event.error === undefined && event.taskOverlaps.length > 1) {
        for (i = 0; i < event.taskOverlaps.length; i++) {
            if (!this._existingConflicts[event.taskOverlaps[i].taskId] && event.taskOverlaps[i].taskId !== this._taskIdOfUnscheduledTask) {
                conflictingTask = this._pvrManager.getTask(event.taskOverlaps[i].taskId);
                if (conflictingTask) {
                    conflictingTasks.push(conflictingTask);
                    this._existingConflicts[event.taskOverlaps[i].taskId] = true;
                }
            }
        }
        this._taskOverlapsCallback(conflictingTasks);
    } else {
        this._taskOverlapsCallback([]);
    }
};

/**
 * Registers the event listeners for the getTaskOverlaps events
 * @method _registerTaskOverlapsListeners
 * @private
 */
o5.platform.btv.ConflictManager.prototype._registerTaskOverlapsListeners = function _registerTaskOverlapsListeners () {
    this.logEntry();
    CCOM.Scheduler.addEventListener("getTaskOverlapsOK", this._taskOverlapsListenerBind);
    CCOM.Scheduler.addEventListener("getTaskOverlapsFailed", this._taskOverlapsListenerBind);
};

/**
 * Registers the event listeners for the getTaskAllOptions events
 * @method _registerGetTaskAllOptionsListeners
 * @private
 */
o5.platform.btv.ConflictManager.prototype._registerGetTaskAllOptionsListeners = function _registerGetTaskAllOptionsListeners () {
    this.logEntry();
    CCOM.Scheduler.addEventListener("getTaskAllOptionsOK", this._taskAllOptionsListenerBind);
    CCOM.Scheduler.addEventListener("getTaskAllOptionsFailed", this._taskAllOptionsListenerBind);
};

/**
 * Unregisters the event listeners for the getTaskOverlaps events
 * @method _unRegisterTaskOverlapsListeners
 * @private
 */
o5.platform.btv.ConflictManager.prototype._unRegisterTaskOverlapsListeners = function _unRegisterTaskOverlapsListeners () {
    this.logEntry();
    CCOM.Scheduler.removeEventListener("getTaskOverlapsOK", this._taskOverlapsListenerBind, false);
    CCOM.Scheduler.removeEventListener("getTaskOverlapsFailed", this._taskOverlapsListenerBind, false);
};

/**
 * Unregisters the event listeners for the getTaskAllOptions events
 * @method _unRegisterGetTaskAllOptionsListeners
 * @private
 */
o5.platform.btv.ConflictManager.prototype._unRegisterGetTaskAllOptionsListeners = function _unRegisterGetTaskAllOptionsListeners () {
    this.logEntry();
    CCOM.Scheduler.removeEventListener("getTaskAllOptionsOK", this._taskAllOptionsListenerBind, false);
    CCOM.Scheduler.removeEventListener("getTaskAllOptionsFailed", this._taskAllOptionsListenerBind, false);
};

/**
 * Identifies tasks that conflict with the given task id
 * @method handleConflictsForRecording
 * @async
 * @param {Number} taskId Task id that we're interested in
 * @param {Function} callback Callback function that will be invoked with a list of conflicting tasks
 * @param {Object} callback.taskOverlapsObj getTaskOverlapsOK or getTaskOverlapsFailed returned object
 */
o5.platform.btv.ConflictManager.prototype.handleConflictsForRecording = function handleConflictsForRecording (taskId, callback) {
    this.logEntry();
    this._existingConflicts = [];
    this._registerTaskOverlapsListeners();
    this._taskIdOfUnscheduledTask = taskId;
    this._taskOverlapsCallback = function (conflictingTasks) {
        this._unRegisterTaskOverlapsListeners();
        callback(conflictingTasks);
    }.bind(this);
    this._taskOverlapsHandle = CCOM.Scheduler.getTaskOverlaps(this._taskIdOfUnscheduledTask);
};

/**
 * Identifies tasks that conflict with the supplied list of unscheduled tasks
 * @method handleConflictsForTasks
 * @async
 * @param {Array.<Object>} tasks List of unscheduled tasks
 * @param {Function} callback Callback function that will be invoked with an array of tasks
 * that have a scheduling conflict
 * @param {Object} callback.taskOverlapsObj getTaskOverlapsOK or getTaskOverlapsFailed returned object
 */
o5.platform.btv.ConflictManager.prototype.handleConflictsForTasks = function handleConflictsForTasks (tasks, callback) {
    this.logEntry();
    var cumulativeConflictingTasks = [],
        taskOverlapsCount = 0;
    this._existingConflicts = [];
    this._registerTaskOverlapsListeners();
    this._taskIdOfUnscheduledTask = tasks[0].taskId;
    this._taskOverlapsCallback = function (conflictingTasks) {
        taskOverlapsCount++;
        cumulativeConflictingTasks = cumulativeConflictingTasks.concat(conflictingTasks);
        if (taskOverlapsCount === tasks.length) {
            this._unRegisterTaskOverlapsListeners();
            callback(cumulativeConflictingTasks);
            return;
        } else {
            this._taskIdOfUnscheduledTask = tasks[taskOverlapsCount].taskId;
            this._taskOverlapsHandle = CCOM.Scheduler.getTaskOverlaps(this._taskIdOfUnscheduledTask);
        }
    }.bind(this);
    this._taskOverlapsHandle = CCOM.Scheduler.getTaskOverlaps(this._taskIdOfUnscheduledTask);
};

/**
 * Given a job id, determines which existing tasks conflict with it.
 * @method handleConflictsForRepeatRecording
 * @removed
 */

/**
 * Identifies the tasks that conflict with the supplied time.
 * @method handleConflictsForTime
 * @async
 * @param {Number} time Time in UTC milliseconds. Be aware that although the time is specified in
 * milliseconds, the resolution is one second.
 * @param {Function} callback Callback function that will be invoked with a list of conflicting tasks
 * @param {Object} callback.taskOptionObj getTaskAllOptionsOK or getTaskAllOptionsFailed returned object
 */
o5.platform.btv.ConflictManager.prototype.handleConflictsForTime = function handleConflictsForTime (time, callback) {
    this.logEntry();
    this._registerGetTaskAllOptionsListeners();
    this._taskAllOptionsCallback = function (conflictingTasks) {
        this._unRegisterGetTaskAllOptionsListeners();
        callback(conflictingTasks);
    }.bind(this);
    this._taskAllOptionsHandle = CCOM.Scheduler.getTaskAllOptions(time, [], []);
};

/**
 * Identifies tasks that conflict with the supplied list of unscheduled tasks.
 * Returns conflicts including the supplied tasks.
 * @method handleConflictForSeriesTasks
 * @deprecated Use checkConflictForSeriesTasks()
 * @async
 * @param {Array.<Object>} tasks List of unscheduled tasks
 * @param {Function} callback Callback function that will be invoked with an array of tasks
 * that have a scheduling conflict
 * @param {Object} callback.taskOverlapsObj getTaskOverlapsOK or getTaskOverlapsFailed returned object
 */
o5.platform.btv.ConflictManager.prototype.handleConflictForSeriesTasks = function handleConflictForSeriesTasks (tasks, callback) {
    var cumulativeConflictingTasks = [],
        taskOverlapsCount = 0,
        taskIdOfUnscheduledSeriesTask;
    this._existingConflicts = [];
    this._registerTaskOverlapsListeners();
    taskIdOfUnscheduledSeriesTask = tasks[0].taskId;
    this._taskOverlapsCallback = function (conflictingTasks) {
        taskOverlapsCount++;
        cumulativeConflictingTasks = cumulativeConflictingTasks.concat(conflictingTasks);
        if (taskOverlapsCount === tasks.length) {
            this._unRegisterTaskOverlapsListeners();
            callback(cumulativeConflictingTasks);
            return;
        } else {
            taskIdOfUnscheduledSeriesTask = tasks[taskOverlapsCount].taskId;
            this._taskOverlapsHandle = CCOM.Scheduler.getTaskOverlaps(taskIdOfUnscheduledSeriesTask);
        }
    }.bind(this);
    this._taskOverlapsHandle = CCOM.Scheduler.getTaskOverlaps(taskIdOfUnscheduledSeriesTask);
};

/**
 * Checks if the task for the given taskId will not fully record due to conflicts.
 * Calls the callback with a false value if not or a true value if it will fully record.
 * The UI should wait for the callback before using this function again.
 * @method isTaskConflicting
 * @async
 * @param {Number} taskId Task id we're interested in
 * @param {Function} callback Callback function that will be invoked with a true or false value
 * @param {Boolean} callback.isTaskConflicting True if there is a conflict, false otherwise
 */
o5.platform.btv.ConflictManager.prototype.isTaskConflicting = function isTaskConflicting (taskId, callback)
{
    this.logEntry();
    
    var taskOverlapsOptionsHandle;
    var isConflicting = false;
    
    var checkIfConflictingCallback = function (event)
    {
		if(event.handle !== taskOverlapsOptionsHandle)
			return;
		
        CCOM.Scheduler.removeEventListener("getTaskOverlapsOptionsOK", checkIfConflictingCallback, false);
        CCOM.Scheduler.removeEventListener("getTaskOverlapsOptionsFailed", checkIfConflictingCallback, false);
        
        if (event.error === undefined)
        {
            if (event.taskOptions.length > 1)
            {
                isConflicting = true;
            }
        }
        
        callback(isConflicting);
    };
        
    if (!this._pvrManager.isTaskScheduled(taskId))
    {
        callback(false);
        
        return;
    }
    else
    {
        CCOM.Scheduler.addEventListener("getTaskOverlapsOptionsOK", checkIfConflictingCallback);
        CCOM.Scheduler.addEventListener("getTaskOverlapsOptionsFailed", checkIfConflictingCallback);
        taskOverlapsOptionsHandle = CCOM.Scheduler.getTaskOverlapsOptions(taskId, false, false);
    }
};

/**
 * Checks if there is any unscheduled tasks conflicting with supplied tasks
 * @method checkConflictForSeriesTasks
 * @async
 * @param {Array.<Object>} tasks List of tasks
 * @param {Function} callback Callback function that will be invoked with unscheduled tasks list
 * @param {Array.<Object>} callback.taskOverlaps Array of overlapping tasks
 */
o5.platform.btv.ConflictManager.prototype.checkConflictForSeriesTasks = function checkConflictForSeriesTasks (tasks, callback)
{
    this.logEntry();
    
    var i;
    var unscheduledTasks = [];
    var taskOverlapsHandle;
    var taskOverlapsCount = 0;
    var existingConflicts = [];
    
    var taskOverlapsListener = function (overlapObj)
    {
    	if (overlapObj.handle !== taskOverlapsHandle)
    		return;

    	taskOverlapsCount++;
        
        if (overlapObj.error === undefined)
        {
            for (i = 0; i < overlapObj.taskOverlaps.length; i++)
            {
                if (!existingConflicts[overlapObj.taskOverlaps[i].taskId] &&
                		(overlapObj.taskOverlaps[i].fulfillmentStatus === this._COMPLETION_STATUS.NONE ||
                				overlapObj.taskOverlaps[i].fulfillmentStatus === this._COMPLETION_STATUS.PARTIAL))
                {
                    unscheduledTasks.push(overlapObj.taskOverlaps[i]);
                    existingConflicts[overlapObj.taskOverlaps[i].taskId] = true;
                }
            }
        }
        
        if (taskOverlapsCount === tasks.length)
        {
            CCOM.Scheduler.removeEventListener("getTaskOverlapsOK", taskOverlapsListener, false);
            CCOM.Scheduler.removeEventListener("getTaskOverlapsFailed", taskOverlapsListener, false);
            
            if (unscheduledTasks.length)
            {
                this.handleConflictForSeriesTasks(unscheduledTasks, callback);
            }
            else
            {
                callback(unscheduledTasks);
                
                return;
            }
        }
        else
        {
            taskOverlapsHandle = CCOM.Scheduler.getTaskOverlaps(tasks[taskOverlapsCount].taskId);
        }
    }.bind(this);
        
    if (tasks[0])
    {
        CCOM.Scheduler.addEventListener("getTaskOverlapsOK", taskOverlapsListener);
        CCOM.Scheduler.addEventListener("getTaskOverlapsFailed", taskOverlapsListener);
        
        taskOverlapsHandle = CCOM.Scheduler.getTaskOverlaps(tasks[0].taskId);
    }
    else
    {
        callback(unscheduledTasks);
        
        return;
    }
};

// uncomment to turn debugging on for ConflictManager object
// o5.log.setAll(o5.platform.btv.ConflictManager, true);
