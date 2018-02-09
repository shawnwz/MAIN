/**
 * Stub for Scheduler: CCOM.Scheduler, a singleton added since v5.0.0
 * @ignore
 */
CCOM.Scheduler = new (function Scheduler ()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.Scheduler";
	this._id = CCOM.stubs.uuid();

	// events in xml
	this._EVENT_ON_ADD_JOB_COMPLETED = "onAddJobCompleted";
	this._EVENT_ON_UPDATE_JOB_COMPLETED = "onUpdateJobCompleted";
	this._EVENT_ON_ADD_TASK_FAILED = "onAddTaskFailed";
	this._EVENT_ON_JOBS_MODIFIED = "onJobsModified";
	this._EVENT_ON_JTM_READY = "onJtmReady";
	this._EVENT_ON_TASK_STARTED = "onTaskStarted";
	this._EVENT_ON_TASK_STOPPED = "onTaskStopped";
	this._EVENT_ON_TASK_VP_ALERT = "onTaskVPAlert";
	this._EVENT_ON_TASKS_CHANGED = "onTasksChanged";
	this._EVENT_ON_TASKS_MODIFIED = "onTasksModified";
	// events from methods
	this._EVENT_ADD_JOB_OK = "addJobOK";
	this._EVENT_ADD_JOB_FAILED = "addJobFailed";
	this._EVENT_DELETE_JOB_OK = "deleteJobOK";
	this._EVENT_DELETE_JOB_FAILED = "deleteJobFailed";
	this._EVENT_GET_TASK_ALL_OPTIONS_OK = "getTaskAllOptionsOK";
	this._EVENT_GET_TASK_ALL_OPTIONS_FAILED = "getTaskAllOptionsFailed";
	this._EVENT_GET_TASK_OVERLAPS_OK = "getTaskOverlapsOK";
	this._EVENT_GET_TASK_OVERLAPS_FAILED = "getTaskOverlapsFailed";
	this._EVENT_GET_TASK_OVERLAPS_OPTIONS_OK = "getTaskOverlapsOptionsOK";
	this._EVENT_GET_TASK_OVERLAPS_OPTIONS_FAILED = "getTaskOverlapsOptionsFailed";
	this._EVENT_STOP_TASK_OK = "stopTaskOK";
	this._EVENT_STOP_TASK_FAILED = "stopTaskFailed";
	this._EVENT_UPDATE_JOB_OK = "updateJobOK";
	this._EVENT_UPDATE_JOB_FAILED = "updateJobFailed";
	this._EVENT_UPDATE_TASK_OK = "updateTaskOK";
	this._EVENT_UPDATE_TASK_FAILED = "updateTaskFailed";
	this._EVENT_GET_JOBS_PRIORITY_OK = "getJobsPriorityOK";
	this._EVENT_GET_JOBS_PRIORITY_FAILED = "getJobsPriorityFailed";
	this._EVENT_REORDER_JOBS_OK = "reorderJobsOK";
	this._EVENT_REORDER_JOBS_FAILED = "reorderJobsFailed";
	this._EVENT_UPSERT_TASK_OK = "upsertTaskOK";
	this._EVENT_UPSERT_TASK_FAILED = "upsertTaskFailed";
	this._EVENT_GET_CURRENT_TASKS_STATUS_OK = "getCurrentTasksStatusOK";
	this._EVENT_GET_CURRENT_TASKS_STATUS_FAILED = "getCurrentTasksStatusFailed";
	this._EVENT_PRIORITIZE_TASKS_OK = "prioritizeTasksOK";
	this._EVENT_PRIORITIZE_TASKS_FAILED = "prioritizeTasksFailed";
	this._EVENT_GET_TASK_STATE_INFO_OK = "getTaskStateInfoOK";
	this._EVENT_GET_TASK_STATE_INFO_FAILED = "getTaskStateInfoFailed";
	this._EVENT_REORDER_TASKS_OK = "reorderTasksOK";
	this._EVENT_REORDER_TASKS_FAILED = "reorderTasksFailed";
	this._EVENT_GET_TASK_ALL_OPTIONS_BY_CONFLICT_ID_OK = "getTaskAllOptionsByConflictIdOK";
	this._EVENT_GET_TASK_ALL_OPTIONS_BY_CONFLICT_ID_FAILED = "getTaskAllOptionsByConflictIdFailed";
	this._EVENT_GET_TASK_INFO_OK = "getTaskInfoOK";
	this._EVENT_GET_TASK_INFO_FAILED = "getTaskInfoFailed";
	
	this._supportedEvents = [
		this._EVENT_ON_ADD_JOB_COMPLETED,
		this._EVENT_ON_UPDATE_JOB_COMPLETED,
		this._EVENT_ON_ADD_TASK_FAILED,
		this._EVENT_ON_JOBS_MODIFIED,
		this._EVENT_ON_JTM_READY,
		this._EVENT_ON_TASK_STARTED,
		this._EVENT_ON_TASK_STOPPED,
		this._EVENT_ON_TASK_VP_ALERT,
		this._EVENT_ON_TASKS_CHANGED,
		this._EVENT_ON_TASKS_MODIFIED,
		// events from methods
		this._EVENT_ADD_JOB_OK,
		this._EVENT_ADD_JOB_FAILED,
		this._EVENT_DELETE_JOB_OK,
		this._EVENT_DELETE_JOB_FAILED,
		this._EVENT_GET_TASK_ALL_OPTIONS_OK,
		this._EVENT_GET_TASK_ALL_OPTIONS_FAILED,
		this._EVENT_GET_TASK_OVERLAPS_OK,
		this._EVENT_GET_TASK_OVERLAPS_FAILED,
		this._EVENT_GET_TASK_OVERLAPS_OPTIONS_OK,
		this._EVENT_GET_TASK_OVERLAPS_OPTIONS_FAILED,
		this._EVENT_STOP_TASK_OK,
		this._EVENT_STOP_TASK_FAILED,
		this._EVENT_UPDATE_JOB_OK,
		this._EVENT_UPDATE_JOB_FAILED,
		this._EVENT_UPDATE_TASK_OK,
		this._EVENT_UPDATE_TASK_FAILED,
		this._EVENT_GET_JOBS_PRIORITY_OK,
		this._EVENT_GET_JOBS_PRIORITY_FAILED,
		this._EVENT_REORDER_JOBS_OK,
		this._EVENT_REORDER_JOBS_FAILED,
		this._EVENT_UPSERT_TASK_OK,
		this._EVENT_UPSERT_TASK_FAILED,
		this._EVENT_GET_CURRENT_TASKS_STATUS_OK,
		this._EVENT_GET_CURRENT_TASKS_STATUS_FAILED,
		this._EVENT_PRIORITIZE_TASKS_OK,
		this._EVENT_PRIORITIZE_TASKS_FAILED,
		this._EVENT_GET_TASK_STATE_INFO_OK,
		this._EVENT_GET_TASK_STATE_INFO_FAILED,
		this._EVENT_REORDER_TASKS_OK,
		this._EVENT_REORDER_TASKS_FAILED,
		this._EVENT_GET_TASK_ALL_OPTIONS_BY_CONFLICT_ID_OK,
		this._EVENT_GET_TASK_ALL_OPTIONS_BY_CONFLICT_ID_FAILED,
		this._EVENT_GET_TASK_INFO_OK,
		this._EVENT_GET_TASK_INFO_FAILED
	];
	this.JOBS = [];
	this.TASKS = [  { jobId: 99, taskId: 1, objectState: 5 }, { jobId: 100, taskId: 2, objectState: 5 } ]; // few recorded tasks


	Object.defineProperty(this, 'taskOverlapsHandle', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.scheduler.taskOverlapsHandle : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.scheduler.taskOverlapsHandle= val;
 		},
		enumerable: true
	});

	Object.defineProperty(this, 'taskAllOptionsHandle', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.scheduler.taskAllOptionsHandle : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.scheduler.taskAllOptionsHandle= val;
 		},
		enumerable: true
	});

	Object.defineProperty(this, 'jobPriority', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.scheduler.jobPriority : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.scheduler.jobPriority= val;
 		},
		enumerable: true
	});

	Object.defineProperty(this, 'taskPriority', {
		get: function () {
			return (CCOM.stubs.stbData && CCOM.stubs.stbData.nagraCA) ? CCOM.stubs.stbData.scheduler.taskPriority : null;
		},
		set: function(val) {
 			CCOM.stubs.stbData.scheduler.taskPriority= val;
 		},
		enumerable: true
	});

	this._createTask = function (taskType, jobType, jobObject)
	{
		var time = new Date().getTime();
		var taskObject = {};

		taskObject.jobId = jobObject.jobId;
		taskObject.taskId = this.TASKS.length + 1;
		taskObject.taskType = taskType;
		taskObject.eventId = jobObject.eventId;
		taskObject.startTime = jobObject.startTime; // || jobObject.timeOfDay;
		taskObject.endTime = jobObject.endTime || jobObject.startTime + jobObject.duration;
		taskObject.unscheduled = jobObject.unscheduled;
		taskObject.taskOpState = taskObject.startTime < time && taskObject.endTime > time ? 5 : 0;
		taskObject.objectState = 0; // Scheduled
		taskObject.serviceId = jobObject.serviceId || jobObject.eventId + "s";
		taskObject.duration = jobObject.duration;
		taskObject.title = jobObject.title;
		taskObject.softPostpaddingDuration = jobObject.softPostpaddingDuration;
		taskObject.softPrepaddingDuration = jobObject.softPrepaddingDuration;
		taskObject.keep = jobObject.keep;
		taskObject.toSource = function()
		{
			return "";
		};
		taskObject.scheduleType = jobType;
		taskObject.cumulativeStatus = 0; //normal
		taskObject.currentStatus = 0; //normal
		taskObject.priority = jobObject.priority + this.taskPriority;
		this.taskPriority += 1;
		if (time < taskObject.startTime)
		{
			taskObject.objectState = 0; // Scheduled
			taskObject.completeStatus = 1;
		}
		else if (time > taskObject.endTime)
		{
			taskObject.objectState = 5; // Recorded
			taskObject.completeStatus = 3;
		}
		else
		{
			taskObject.objectState = 1; // Active
			taskObject.completeStatus = 1;
		}
		return taskObject;
	}
	this._getFulfillmentStatusObjForTask = function (task, fulfillmentStatus)
	{
		return {
			taskId : task.taskId,
			jobId : task.jobId,
			taskType : task.taskType,
			startTime : task.startTime,
			duration : task.endTime,
			fulfillmentStatus : fulfillmentStatus
		};
	}
	//AddTaskFailedReason
	this.SYSTEM_ERROR = 1;
	this.TOO_MANY_TASKS = 2;
	this.DUPLICATE_TASK = 3;
	this.EXPIRATION_EARLIER_THAN_START = 4;
	this.INVALID_EVENT_ID = 5;
	this.OUT_OF_MEMORY = 6;
	this.TYPE_INVALID = 7;
	this.TOO_MANY_JOBS = 8;
	this.BAD_PARAM = 9;
	this.DUPLICATE_JOB = 10;
	this.BAD_STATE = 11;
	//CompleteStatus
	this.SUCCESS_COMPLETE = 0;
	//SYSTEM_ERROR= 1;
	this.BAD_PARAMETERS = 2;
	//FulfillmentStatus
	this.INVALID = 0;
	this.NONE = 1;
	this.PARTIAL = 2;
	this.FULL = 3;
	// JTMActionInfo
	this.CREATED = 0;
	this.DELETED = 1;
	this.PROPERTY_CHANGED = 2;
	this.ACTIVATED = 3;
	this.DEACTIVATED = 4;
	this.getCurrentTasksStatus = function()
	{
		var i, taskLen = this.TASKS.length, time = new Date().getTime(), status = {}, tasksStatus = [], curTaskList = [], curTasksLen;

		for (i = 0; i < taskLen; i += 1)
		{
			if ((this.TASKS[i].startTime - this.TASKS[i].softPrepaddingDuration) < time
					&& (this.TASKS[i].endTime + this.TASKS[i].softPostpaddingDuration) > time)
			{
				curTaskList.push(this.TASKS[i]);
			}
		}
		curTasksLen = curTaskList.length;
		for (i = 0; i < curTasksLen; i += 1)
		{
			status = {};
			status.taskId = curTaskList[i].taskId;
			status.cumulativeStatus = curTaskList[i].cumulativeStatus;
			status.currentStatus = curTaskList[i].currentStatus;
			status.duration = curTaskList[i].duration;
			status.startTime = curTaskList[i].startTime;
			status.taskType = curTaskList[i].taskType;
			tasksStatus.push(status);
		}
		return tasksStatus;
	};
	this.getJobsPriority = function(jobIdArray)
	{
		var i, jobLen = jobIdArray.length, jobPriorityList = [];

		for (i = 0; i < jobLen; i += 1)
		{
			if (this.JOBS[i])
			{
				jobPriorityList.push(this.JOBS[i].priority);
			}
		}
		return jobPriorityList;
	};
	this.getTaskOverlapsOptions = function(taskId, expandWindow, showAllOptions)
	{
		var _handle = CCOM.stubs.getHandle();

		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_TASK_OVERLAPS_OPTIONS_FAILED, {
			target : this,
			handle : _handle,
			error : {
				domain : "com.opentv.Scheduler",
				name : "Failed",
				message : ""
			}
		});
		return _handle;
	};
	this.getTaskStateInfo = function(taskId)
	{
		return {
			objState : 0,
			currentStatus : 0,
			cumulativeStatus : 0
		};
	};
	this.prioritizeTasks = function(prioritizeTaskIds, allTaskIds)
	{
		return {
			domain : "com.opentv.Scheduler",
			name : "Failed",
			message : ""
		};
	};
	this.reorderJobs = function(jobIdArray)
	{
		var i, j, taskLen = this.TASKS.length, conflictJobLen = jobIdArray.length, time = new Date().getTime(), idxOfReorderTask = [], newOrderTask = [];

		for (i = 0; i < conflictJobLen; i += 1)
		{
			for (j = 0; j < taskLen; j += 1)
			{
				if ((this.TASKS[j].jobId === jobIdArray[i]) && (time > this.TASKS[j].startTime))
				{
					idxOfReorderTask[i] = j;
					newOrderTask.push(this.TASKS[j]);
				}
			}
		}
		for (i = 0; i < idxOfReorderTask.length; i += 1)
		{
			this.TASKS.splice(idxOfReorderTask[i], 1, newOrderTask[i]);
		}
		return null;
	};
	this.reorderTasks = function(taskIdArray)
	{
		var i, j, taskLen = this.TASKS.length, conflictTaskLen = taskIdArray.length, time = new Date().getTime(), idxOfReorderTask = [], newOrderTask = [];

		for (i = 0; i < conflictTaskLen; i += 1)
		{
			for (j = 0; j < taskLen; j += 1)
			{
				if (this.TASKS[j].taskId === taskIdArray[i] && ((String(this.TASKS[i].taskType) === "REC") || (String(this.TASKS[i].taskType) === "RMDR"))
						&& (time > this.TASKS[j].startTime))
				{
					idxOfReorderTask[i] = j;
					newOrderTask.push(this.TASKS[j]);
				}
			}
		}
		for (i = 0; i < idxOfReorderTask.length; i += 1)
		{
			this.TASKS.splice(idxOfReorderTask, 1, newOrderTask[i]);
		}
		return null;
	};
	this.updateJob = function(jobId, updateInfo)
	{
		var i, jobLen = this.JOBS.length, property, _handle = CCOM.stubs.getHandle();

		for (i = 0; i < jobLen; i += 1)
		{
			if (this.JOBS[i].jobId === jobId)
			{
				for (property in updateInfo)
				{
					if (updateInfo.hasOwnProperty(property))
					{
						this.JOBS[i][property] = updateInfo[property];
					}
				}
			}
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UPDATE_JOB_OK, {
			target : this,
			handle : _handle
		});
		return _handle;
	};
	this.getTasksRSByWindow = function(properties, criteria, startTime, endTime)
	{
		this.logInfo("Operation Failed");
		return {
			error : {
				domain : "com.opentv.Scheduler",
				name : "OperationFailed",
				message : ""
			}
		};
	};
	this.getJobsRSByQuery = function(fields, criteria, order)
	{
		var results = [], i, titleEndPosition, rs;

		if (criteria.substr(0, 5) === "jobId")
		{
			for (i = 0; i < this.JOBS.length; i += 1)
			{
				if (String(this.JOBS[i].jobId) === criteria.substring(7, criteria.length - 1))
				{
					results.push(this.JOBS[i]);
				}
			}
		}
		else if (criteria.substr(0, 7) === "eventId")
		{
			for (i = 0; i < this.JOBS.length; i += 1)
			{
				if (String(this.JOBS[i].eventId) === criteria.substring(9, criteria.length - 1))
				{
					results.push(this.JOBS[i]);
				}
			}
		}
		rs = new CCOM.ResultSet(results);
		return rs;
	};
	this.getTasksRSByQuery = function(fields, criteria, order)
	{
		var results = [], titleEndPosition, i, rs;

		if (CCOM.stubs.stbData.tasksJobs.db)
		{
			var stmt = CCOM.stubs.stbData.tasksJobs.db.prepare('SELECT ' + fields + ' FROM Tasks WHERE ' + criteria + ' ORDER BY ' + order);

			while (stmt.step())
			{
				results.push(stmt.getAsObject());
			}
		}
		else if (criteria.substr(0, 6) === "taskId")
		{
			for (i = 0; i < this.TASKS.length; i += 1)
			{
				if (String(this.TASKS[i].taskId) === criteria.substring(8, criteria.length - 1))
				{
					results.push(this.TASKS[i]);
				}
			}
		}
		else if (criteria.substr(0, 5) === "jobId")
		{
			for (i = 0; i < this.TASKS.length; i += 1)
			{
				if (String(this.TASKS[i].jobId) === criteria.substring(7, criteria.length - 1))
				{
					results.push(this.TASKS[i]);
				}
			}
		}
		else if (criteria.substr(0, 7) === "eventId")
		{
			for (i = 0; i < this.TASKS.length; i += 1)
			{
				if (String(this.TASKS[i].eventId) === criteria.substring(9, criteria.length - 1))
				{
					results.push(this.TASKS[i]);
				}
			}
		}
		else if (criteria.substr(0, 5) === "title")
		{
			if (criteria.substr(6, 7) === "LIKE '%")
			{
				titleEndPosition = criteria.indexOf("%", 13);
				for (i = 0; i < this.TASKS.length; i += 1)
				{
					if (String(this.TASKS[i].title).toLowerCase().indexOf(criteria.substring(13, titleEndPosition).toLowerCase()) !== -1)
					{
						results.push(this.TASKS[i]);
					}
				}
			}
			else
			{
				titleEndPosition = criteria.indexOf("'", 12);
				for (i = 0; i < this.TASKS.length; i += 1)
				{
					if (String(this.TASKS[i].title).toLowerCase() === criteria.substring(12, titleEndPosition).toLowerCase())
					{
						results.push(this.TASKS[i]);
					}
				}
			}
		}
		else if (criteria.substr(0, 32) === "taskType='REC' AND objectState==")
		{
			for (i = 0; i < this.TASKS.length; i += 1)
			{
				if (String(this.TASKS[i].objectState) === criteria.substring(33, criteria.length - 1))
				{
					results.push(this.TASKS[i]);
				}
			}
		}
		else if (criteria.substr(0, 50) === "taskType='REC' AND unscheduled=0 AND (objectState==")
		{
			for (i = 0; i < this.TASKS.length; i += 1)
			{
				if (String(this.TASKS[i].objectState) === criteria.substring(51, criteria.length - 2))
				{
					results.push(this.TASKS[i]);
				}
			}
		}
		else if (criteria.substr(0, 31) === "taskType='REC' AND objectState<")
		{
			for (i = 0; i < this.TASKS.length; i += 1)
			{
				if (String(this.TASKS[i].objectState) < criteria.substring(33, criteria.length - 1))
				{
					results.push(this.TASKS[i]);
				}
			}
		}
		rs = new CCOM.ResultSet(results);
		return rs;
	};
	this.addJob = function(taskType, jobType, jobObject)
	{
		var jobId = this.JOBS.length + 1, taskObject = {}, now = new Date(), currentDayIndex = now.getDay() - 1 < 0 ? 6 : now.getDay() - 1, startTime, hours, mins, taskStartDate, i, daysDifferenceFromNow, MS_PER_DAY = 86400000, evt, _handle = CCOM.stubs
				.getHandle();

		jobObject.jobId = jobId;
		jobObject.type = jobType;
		jobObject.taskType = taskType;
		jobObject.toSource = function()
		{
			return "";
		};
		jobObject.priority = this.jobPriority;
		this.jobPriority += 10;
		this.JOBS.push(jobObject);
		if (jobType === "RPT_TIME" && jobObject.repeatDaysArray && jobObject.timeOfDay)
		{
			i = 0;
			hours = Math.floor(jobObject.timeOfDay / 3600);
			mins = (jobObject.timeOfDay - (hours * 3600)) / 60;
			for (i = 0; i < jobObject.repeatDaysArray.length; i += 1)
			{
				if (jobObject.repeatDaysArray[i])
				{
					daysDifferenceFromNow = i - currentDayIndex < 0 ? 6 - currentDayIndex + i + 1 : i - currentDayIndex;
					taskStartDate = new Date(now.getTime() + daysDifferenceFromNow * MS_PER_DAY);
					taskStartDate.setHours(hours);
					taskStartDate.setMinutes(mins);
					taskStartDate.setMilliseconds(0);
					jobObject.startTime = taskStartDate.getTime();
					jobObject.endTime = jobObject.startTime + jobObject.duration;
					jobObject.softPostpaddingDuration = 0;
					jobObject.softPrepaddingDuration = 0;
					jobObject.duration = 3600000 * 2;
					taskObject = this._createTask(taskType, jobType, jobObject);
					this.TASKS.push(taskObject);
				}
			}
		}
		else
		{
			evt = CCOM.EPG.getEventById(jobObject.eventId);
			if (evt)
			{
				jobObject.startTime = evt.startTime;
				jobObject.endTime = evt.endTime;
				jobObject.title = evt.title;
				jobObject.serviceId = evt.serviceId;
				jobObject.softPostpaddingDuration = 0;
				jobObject.softPrepaddingDuration = 0;
				jobObject.duration = 3600000 * 2;
			}
			taskObject = this._createTask(taskType, jobType, jobObject);
			this.TASKS.push(taskObject);
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ADD_JOB_OK, {
			target : this,
			handle : _handle,
			jobId : jobId
		});
		return _handle;
	};
	this.stopTask = function(taskId)
	{
		var i, _handle = CCOM.stubs.getHandle();

		for (i = 0; i < this.TASKS.length; i += 1)
		{
			if (this.TASKS[i].taskId === taskId)
			{
				this.TASKS[i].objectState = 5;
				this.TASKS[i].completeStatus = 2;
				//TASKS.splice(i, 1);
				break;
			}
		}
//		Log.log("Stop Recording is not supported!!");
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_STOP_TASK_OK, {
			target : this,
			handle : _handle
		});
		return _handle;
	};
	this.deleteJob = function(id)
	{
		var i, _handle = CCOM.stubs.getHandle();

		for (i = 0; i < this.JOBS.length; i += 1)
		{
			if (this.JOBS[i].jobId === id)
			{
				this.JOBS.splice(i, 1);
			}
		}
		for (i = this.TASKS.length - 1; i >= 0; i--)
		{
			if (this.TASKS[i].jobId === id)
			{
				this.TASKS.splice(i, 1);
			}
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_DELETE_JOB_OK, {
			target : this,
			handle : _handle
		});
		return _handle;
	};
	this.updateTask = function(taskId, metaData)
	{
		var i, property, _handle = CCOM.stubs.getHandle();

		for (i = 0; i < this.TASKS.length; i += 1)
		{
			if (this.TASKS[i].taskId === taskId)
			{
				for (property in metaData)
				{
					if (metaData.hasOwnProperty(property))
					{
						this.TASKS[i][property] = metaData[property];
					}
				}
				break;
			}
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UPDATE_TASK_OK, {
			target : this,
			handle : _handle
		});
		return _handle;
	};
	this.upsertTask = function(taskId, metaData)
	{
		var i, property, _handle = CCOM.stubs.getHandle();

		for (i = 0; i < this.TASKS.length; i += 1)
		{
			if (this.TASKS[i].taskId === taskId)
			{
				for (property in metaData)
				{
					if (metaData.hasOwnProperty(property))
					{
						this.TASKS[i][property] = metaData[property];
					}
				}
				break;
			}
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_UPSERT_TASK_OK, {
			target : this,
			handle : _handle
		});
		return _handle;
	};
	this.getTaskOverlaps = function(taskId)
	{
		var fulfillmentStatus,

		/*task = $N.platform.btv.PVRManager.getTask(taskId),*/
		task = {}, conflictingTasks = [ this._getFulfillmentStatusObjForTask(task, 3) ], i;

		this.taskOverlapsHandle++;
		for (i = 0; i < this.TASKS.length; i += 1)
		{
			if (this.TASKS[i].taskId === taskId)
			{
				task.push(this.TASKS[i]);
			}
		}
		for (i = 0; i < this.TASKS.length; i += 1)
		{
			if (this.TASKS[i].taskId !== taskId
					&& ((this.TASKS[i].startTime >= task.startTime && this.TASKS[i].startTime < task.endTime)
							|| (this.TASKS[i].endTime > task.startTime && this.TASKS[i].endTime < task.endTime) || (this.TASKS[i].startTime <= task.startTime && this.TASKS[i].endTime >= task.endTime)))
			{
				fulfillmentStatus = conflictingTasks.length > 1 ? 1 : 3;
				conflictingTasks.push(this._getFulfillmentStatusObjForTask(this.TASKS[i], fulfillmentStatus));
			}
		}
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_TASK_OVERLAPS_OK, {
			taskOverlaps : conflictingTasks,
			handle : this.taskOverlapsHandle
		});
		return this.taskOverlapsHandle;
	};
	this.getTaskAllOptions = function(time, candidateIds, unscheduledTaskIds)
	{
		var fulfillmentStatus, conflictingTasks = [], i;

		this.taskAllOptionsHandle++;
		for (i = 0; i < this.TASKS.length; i += 1)
		{
			if (this.TASKS[i].startTime <= time && this.TASKS[i].endTime > time)
			{
				fulfillmentStatus = conflictingTasks.length > 1 ? 1 : 3;
				conflictingTasks.push(this._getFulfillmentStatusObjForTask(this.TASKS[i], fulfillmentStatus));
			}
		}
		conflictingTasks = conflictingTasks.length > 1 ? conflictingTasks : [];
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_TASK_ALL_OPTIONS_OK, {
			target : this,
			handle : this.taskAllOptionsHandle,
			taskOptions : null,
			allTaskIds : conflictingTasks,
			allTaskTypes : null
		});
		return this.taskAllOptionsHandle;
	};
	this.getTaskAllOptionsByConflictId = function(conflictId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Scheduler",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.getTaskInfo = function(taskId)
	{
		this.logWarning("This API has not been implemented yet!");
		return {
			error : {
				domain : "com.opentv.Scheduler",
				name : "Failed",
				message : "Not implemented yet"
			}
		};
	};

	this.addEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.addEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	this.removeEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.removeEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};

	this.getTaskAllOptions = function(time, candidateIds, unscheduledTaskIds)
	{
		var fulfillmentStatus, conflictingTasks = [], i;

		this.taskAllOptionsHandle++;
		for (i = 0; i < this.TASKS.length; i += 1)
		{
			if (this.TASKS[i].startTime <= time && this.TASKS[i].endTime > time)
			{
				fulfillmentStatus = conflictingTasks.length > 1 ? 1 : 3;
				conflictingTasks.push(this._getFulfillmentStatusObjForTask(this.TASKS[i], fulfillmentStatus));
			}
		}
		conflictingTasks = conflictingTasks.length > 1 ? conflictingTasks : [];
		CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_GET_TASK_ALL_OPTIONS_OK, {
			target : this,
			handle : this.taskAllOptionsHandle,
			taskOptions : null,
			allTaskIds : conflictingTasks,
			allTaskTypes : null,
			backgroundTaskIds : null,
			taskPriorityNames : null
		});
		return this.taskAllOptionsHandle;
	};
})();
