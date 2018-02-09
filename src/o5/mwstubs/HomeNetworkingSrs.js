/**
 * Stub for Home Networking SRS (Schedule Recording Service): CCOM.HomeNetworkingSrs class, which is introduced in v5.1.2.
 *
 * Note that this is not a singleton object. An instance of such an object must be created by
 * calling CCOM.HomeNetworking.getInstance()
 * @ignore
 */
CCOM.HomeNetworkingSrs = function(createArgs)
{
	this._id = CCOM.stubs.uuid();
	this._createArgs = createArgs;
};
CCOM.HomeNetworkingSrs.prototype._MY_NAME_SPACE = "CCOM.HomeNetworkingSrs";

/*
 * events
 */
CCOM.HomeNetworkingSrs.prototype._EVENT_ON_SCHEDULE_ADDED = "onScheduleAdded";
CCOM.HomeNetworkingSrs.prototype._EVENT_ON_TASK_ADDED = "onTaskAdded";
CCOM.HomeNetworkingSrs.prototype._EVENT_ON_SCHEDULE_UPDATED = "onScheduleUpdated";
CCOM.HomeNetworkingSrs.prototype._EVENT_ON_TASK_UPDATED = "onTaskUpdated";
CCOM.HomeNetworkingSrs.prototype._EVENT_ON_SCHEDULE_REMOVED = "onScheduleRemoved";
CCOM.HomeNetworkingSrs.prototype._EVENT_ON_TASK_REMOVED = "onTaskRemoved";
CCOM.HomeNetworkingSrs.prototype._EVENT_ON_CONFLICT_IMMINENT = "onConflictImminent";
CCOM.HomeNetworkingSrs.prototype._EVENT_CREATE_SCHEDULE_OK = "createScheduleOK";
CCOM.HomeNetworkingSrs.prototype._EVENT_CREATE_SCHEDULE_FAILED = "createScheduleFailed";
CCOM.HomeNetworkingSrs.prototype._EVENT_DELETE_SCHEDULE_OK = "deleteScheduleOK";
CCOM.HomeNetworkingSrs.prototype._EVENT_DELETE_SCHEDULE_FAILED = "deleteScheduleFailed";
CCOM.HomeNetworkingSrs.prototype._EVENT_DELETE_TASK_OK = "deleteTaskOK";
CCOM.HomeNetworkingSrs.prototype._EVENT_DELETE_TASK_FAILED = "deleteTaskFailed";
CCOM.HomeNetworkingSrs.prototype._EVENT_GET_SCHEDULE_CONFLICTS_OK = "getScheduleConflictsOK";
CCOM.HomeNetworkingSrs.prototype._EVENT_GET_SCHEDULE_CONFLICTS_FAILED = "getScheduleConflictsFailed";
CCOM.HomeNetworkingSrs.prototype._EVENT_GET_SCHEDULES_OK = "getSchedulesOK";
CCOM.HomeNetworkingSrs.prototype._EVENT_GET_SCHEDULES_FAILED = "getSchedulesFailed";
CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASK_OK = "getTaskOK";
CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASK_FAILED = "getTaskFailed";
CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASK_CONFLICTS_OK = "getTaskConflictsOK";
CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASK_CONFLICTS_FAILED = "getTaskConflictsFailed";
CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASKS_FROM_SCHEDULE_OK = "getTasksFromScheduleOK";
CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASKS_FROM_SCHEDULE_FAILED = "getTasksFromScheduleFailed";
CCOM.HomeNetworkingSrs.prototype._EVENT_UPDATE_SCHEDULE_PRIORITY_OK = "updateSchedulePriorityOK";
CCOM.HomeNetworkingSrs.prototype._EVENT_UPDATE_SCHEDULE_PRIORITY_FAILED = "updateSchedulePriorityFailed";

/*
 * enums
 */
//ScheduleType
CCOM.HomeNetworkingSrs.prototype.MANUAL = 1;
CCOM.HomeNetworkingSrs.prototype.CDS_SERVICE = 2;
CCOM.HomeNetworkingSrs.prototype.CDS_EVENT = 3;
CCOM.HomeNetworkingSrs.prototype.BY_MATCHING_NAME = 4;
CCOM.HomeNetworkingSrs.prototype.BY_MATCHING_ID = 5;
//MatchingIdType
CCOM.HomeNetworkingSrs.prototype.PROGRAM_ID = 1;
CCOM.HomeNetworkingSrs.prototype.SERIES_ID = 2;
//MatchingNameType
CCOM.HomeNetworkingSrs.prototype.PROGRAM = 1;
CCOM.HomeNetworkingSrs.prototype.SERIES = 2;
//MatchingEpisodeType
CCOM.HomeNetworkingSrs.prototype.ALL = 1;
CCOM.HomeNetworkingSrs.prototype.FIRST_RUN = 2;
CCOM.HomeNetworkingSrs.prototype.REPEAT = 3;
//ScheduleState
CCOM.HomeNetworkingSrs.prototype.SCHEDULE_STATE_OPERATIONAL = 1;
CCOM.HomeNetworkingSrs.prototype.SCHEDULE_STATE_COMPLETED = 2;
CCOM.HomeNetworkingSrs.prototype.SCHEDULE_STATE_ERROR = 3;
//ScheduleStateOld
CCOM.HomeNetworkingSrs.prototype.OPERATIONAL = 1;
CCOM.HomeNetworkingSrs.prototype.COMPLETED = 2;
CCOM.HomeNetworkingSrs.prototype.ERROR = 3;
//TaskState
CCOM.HomeNetworkingSrs.prototype.TASK_STATE_WAITING_FOR_START = 1;
CCOM.HomeNetworkingSrs.prototype.TASK_STATE_RECORDING = 2;
CCOM.HomeNetworkingSrs.prototype.TASK_STATE_COMPLETED = 3;
CCOM.HomeNetworkingSrs.prototype.TASK_STATE_ERROR = 4;
CCOM.HomeNetworkingSrs.prototype.TASK_STATE_FATAL_ERROR = 5;
//TaskStateOld
CCOM.HomeNetworkingSrs.prototype.WAITING_FOR_START = 1;
CCOM.HomeNetworkingSrs.prototype.RECORDING = 2;
//COMPLETED= 3;
//ERROR= 4;
CCOM.HomeNetworkingSrs.prototype.FATAL_ERROR = 5;
// ScheduleError
CCOM.HomeNetworkingSrs.prototype.SCHEDULE_ERROR_NONE = 1;
CCOM.HomeNetworkingSrs.prototype.SCHEDULE_ERROR_GENERAL = 2;
CCOM.HomeNetworkingSrs.prototype.SCHEDULE_ERROR_MAX_TASK_COUNT_REACHED = 3;
CCOM.HomeNetworkingSrs.prototype.SCHEDULE_ERROR_EPG_INFO_UNAVAILABLE = 4;
CCOM.HomeNetworkingSrs.prototype.SCHEDULE_ERROR_RS_DISABLED = 5;
CCOM.HomeNetworkingSrs.prototype.SCHEDULE_ERROR_INSUFFICIENT_MEMORY = 6;
CCOM.HomeNetworkingSrs.prototype.SCHEDULE_ERROR_RESOURCE_ERROR = 7;
//ScheduleErrorOld
CCOM.HomeNetworkingSrs.prototype.NONE = 1;
CCOM.HomeNetworkingSrs.prototype.GENERAL = 2;
CCOM.HomeNetworkingSrs.prototype.MAX_TASK_COUNT_REACHED = 3;
CCOM.HomeNetworkingSrs.prototype.EPG_INFO_UNAVAILABLE = 4;
CCOM.HomeNetworkingSrs.prototype.RS_DISABLED = 5;
CCOM.HomeNetworkingSrs.prototype.INSUFFICIENT_MEMORY = 6;
CCOM.HomeNetworkingSrs.prototype.RESOURCE_ERROR = 7;

/*
 * methods
 */
CCOM.HomeNetworkingSrs.prototype.createSchedule = function(details)
{
	this.logInfo("This API has not been supported yet!.");
	var hdl, evt;

	hdl = CCOM.stubs.getHandle();
	evt = {
		target : this,
		handle : hdl,
		error : {
			domain : "com.opentv.HomeNetworkingSrs",
			name : "HnStatusError",
			message : "not supported"
		}
	};
	CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_CREATE_SCHEDULE_FAILED, evt, 0);
	return hdl;
};
CCOM.HomeNetworkingSrs.prototype.deleteSchedule = function(scheduleId)
{
	this.logInfo("This API has not been supported yet!.");
	var hdl, evt;

	hdl = CCOM.stubs.getHandle();
	evt = {
		target : this,
		handle : hdl,
		error : {
			domain : "com.opentv.HomeNetworkingSrs",
			name : "HnStatusError",
			message : "not supported"
		}
	};
	CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELETE_SCHEDULE_FAILED, evt, 0);
	return hdl;
};
CCOM.HomeNetworkingSrs.prototype.deleteTask = function(taskId)
{
	this.logInfo("This API has not been supported yet!.");
	var hdl, evt;

	hdl = CCOM.stubs.getHandle();
	evt = {
		target : this,
		handle : hdl,
		error : {
			domain : "com.opentv.HomeNetworkingSrs",
			name : "HnStatusError",
			message : "not supported"
		}
	};
	CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELETE_TASK_FAILED, evt, 0);
	return hdl;
};
CCOM.HomeNetworkingSrs.prototype.getScheduleConflicts = function(scheduleId)
{
	this.logInfo("This API has not been supported yet!.");
	var hdl, evt;

	hdl = CCOM.stubs.getHandle();
	evt = {
		target : this,
		handle : hdl,
		error : {
			domain : "com.opentv.HomeNetworkingSrs",
			name : "HnStatusError",
			message : "not supported"
		}
	};
	CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_SCHEDULE_CONFLICTS_FAILED, evt, 0);
	return hdl;
};
CCOM.HomeNetworkingSrs.prototype.getSchedules = function(scheduleId, startingIndex, requestCount)
{
	this.logInfo("This API has not been supported yet!.");
	var hdl, evt;

	hdl = CCOM.stubs.getHandle();
	evt = {
		target : this,
		handle : hdl,
		error : {
			domain : "com.opentv.HomeNetworkingSrs",
			name : "HnStatusError",
			message : "not supported"
		}
	};
	CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_SCHEDULES_FAILED, evt, 0);
	return hdl;
};
CCOM.HomeNetworkingSrs.prototype.getTask = function(taskId)
{
	this.logInfo("This API has not been supported yet!.");
	var hdl, evt;

	hdl = CCOM.stubs.getHandle();
	evt = {
		target : this,
		handle : hdl,
		error : {
			domain : "com.opentv.HomeNetworkingSrs",
			name : "HnStatusError",
			message : "not supported"
		}
	};
	CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_TASK_FAILED, evt, 0);
	return hdl;
};
CCOM.HomeNetworkingSrs.prototype.getTaskConflicts = function(taskId)
{
	this.logInfo("This API has not been supported yet!.");
	var hdl, evt;

	hdl = CCOM.stubs.getHandle();
	evt = {
		target : this,
		handle : hdl,
		error : {
			domain : "com.opentv.HomeNetworkingSrs",
			name : "HnStatusError",
			message : "not supported"
		}
	};
	CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_TASK_CONFLICTS_FAILED, evt, 0);
	return hdl;
};
CCOM.HomeNetworkingSrs.prototype.getTasksFromSchedule = function(scheduleId, startingIndex, requestCount)
{
	this.logInfo("This API has not been supported yet!.");
	var hdl, evt;

	hdl = CCOM.stubs.getHandle();
	evt = {
		target : this,
		handle : hdl,
		error : {
			domain : "com.opentv.HomeNetworkingSrs",
			name : "HnStatusError",
			message : "not supported"
		}
	};
	CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_TASKS_FROM_SCHEDULE_FAILED, evt, 0);
	return hdl;
};
CCOM.HomeNetworkingSrs.prototype.updateSchedulePriority = function(scheduleId, priority)
{
	this.logInfo("This API has not been supported yet!.");
	var hdl, evt;

	hdl = CCOM.stubs.getHandle();
	evt = {
		target : this,
		handle : hdl,
		error : {
			domain : "com.opentv.HomeNetworkingSrs",
			name : "HnStatusError",
			message : "not supported"
		}
	};
	CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UPDATE_SCHEDULE_PRIORITY_FAILED, evt, 0);
	return hdl;
};
CCOM.HomeNetworkingSrs.prototype.addEventListener = function(event, callback)
{
	if (this._supportedEvents.indexOf(event) === -1)
	{
		return CCOM.stubs.ERROR_INVALID_EVENT;
	}
	return CCOM.stubs.addEventListener(this._id, this._NS, event, callback);
};
CCOM.HomeNetworkingSrs.prototype.removeEventListener = function(event, callback)
{
	if (this._supportedEvents.indexOf(event) === -1)
	{
		return CCOM.stubs.ERROR_INVALID_EVENT;
	}
	return CCOM.stubs.removeEventListener(this._id, this._NS, event, callback);
};
CCOM.HomeNetworkingSrs.prototype._supportedEvents = [
	CCOM.HomeNetworkingSrs.prototype._EVENT_ON_SCHEDULE_ADDED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_ON_TASK_ADDED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_ON_SCHEDULE_UPDATED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_ON_TASK_UPDATED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_ON_SCHEDULE_REMOVED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_ON_TASK_REMOVED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_ON_CONFLICT_IMMINENT,
	CCOM.HomeNetworkingSrs.prototype._EVENT_CREATE_SCHEDULE_OK,
	CCOM.HomeNetworkingSrs.prototype._EVENT_CREATE_SCHEDULE_FAILED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_DELETE_SCHEDULE_OK,
	CCOM.HomeNetworkingSrs.prototype._EVENT_DELETE_SCHEDULE_FAILED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_DELETE_TASK_OK,
	CCOM.HomeNetworkingSrs.prototype._EVENT_DELETE_TASK_FAILED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_GET_SCHEDULE_CONFLICTS_OK,
	CCOM.HomeNetworkingSrs.prototype._EVENT_GET_SCHEDULE_CONFLICTS_FAILED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_GET_SCHEDULES_OK,
	CCOM.HomeNetworkingSrs.prototype._EVENT_GET_SCHEDULES_FAILED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASK_OK,
	CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASK_FAILED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASK_CONFLICTS_OK,
	CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASK_CONFLICTS_FAILED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASKS_FROM_SCHEDULE_OK,
	CCOM.HomeNetworkingSrs.prototype._EVENT_GET_TASKS_FROM_SCHEDULE_FAILED,
	CCOM.HomeNetworkingSrs.prototype._EVENT_UPDATE_SCHEDULE_PRIORITY_OK,
	CCOM.HomeNetworkingSrs.prototype._EVENT_UPDATE_SCHEDULE_PRIORITY_FAILED
];

