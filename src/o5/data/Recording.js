/**
 * The Recording Object is used to store attributes of a recording or a scheduled recording in a common format.
 * `o5.platform.btv.RecordingFactory` is an example class that returns objects conforming to the structure defined here.
 * 
 * @class o5.data.Recording
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */
o5.data.Recording = function Recording (source)
{
	this._source = source;
};

/**
 * Enumeration of recording type.
 * @readonly
 * @static
 * @property {Number} RECORDING_TYPE
 */
o5.data.Recording.RECORDING_TYPE = {
    SINGLE:	0,
    SERIES: 1
};

/**
 * The unique identifier for the recording or reminder.
 * This is mandatory unless the recording relates to a series folder.
 * @property {Number} taskId
 */

/**
 * The identifier for the job to which the recording or reminder belongs to (mandatory).
 * @property {Number} jobId
 */

/**
 * The identifier for the series of which the recording is part of (optional).
 * @property {String} seriesId
 */

/**
 * The identifier for the season of the series of which the recording is part of (optional).
 * @property {String} seasonId
 */

/**
 * The identifier for the episode in the series of the recording (optional).
 * @property {String} episodeId
 */

/**
 * The name of the series used for display in the folder of recordings.
 * @property {String} seriesName
 */

/**
 * The title of the recording.
 * @property {String} title
 */

/**
 * The URL in which the recording is to be displayed.
 * @property {String} url
 */

/**
 * The eventId relating to the recording or reminder.
 * @property {String} eventId
 */

/**
 * The start time of the scheduled event in UTC milliseconds.
 * @property {Number} startTime
 */

/**
 * The end time of the scheduled event in UTC milliseconds.
 * @property {Number} endTime
 */

/**
 * The actual start time of the recorded event in UTC milliseconds.
 * This includes soft and hard pre padding.
 * @property {Number} actualStartTime
 */

/**
 * The actual stop time of the recorded event in UTC milliseconds.
 * This includes soft and hard post padding.
 * @property {Number} actualStopTime
 */

/**
 * Specifies the number of milliseconds before the start time (startTime - hardPrepaddingDuration)
 * that the event can start if there are resources.
 * @property {Number} softPrepaddingDuration
 */

/**
 * Specifies the number of milliseconds after the end time (startTime + duration + hardPostpaddingDuration )
 * that the event can persist if there are resources.
 * @property {Number} softPostpaddingDuration
 */

/**
 * Specifies the number of milliseconds before the start time that the event can start.
 * @property {Number} hardPrepaddingDuration
 */

/**
 * Specifies the number of milliseconds after the end time (startTime + duration) that the event can persist.
 * @property {Number} hardPostpaddingDuration
 */

/**
 * The duration of the scheduled recording or reminder. The actual duration of the recorded recording is
 * actualDuration and may be different from (scheduled) duration.
 * @property {Number} duration
 */

/**
 * The actual duration of the recording, which could be different from (scheduled) duration.
 * @property {Number} actualDuration
 */

/**
 * Unique identifier of the channel on which the recording or reminder was made or scheduled.
 * @property {String} serviceId
 */

/**
 * A short description of the event.
 * @property {String} shortDesc
 */

/**
 * A long description of the event.
 * @property {String} longDesc
 */

/**
 * A description of the event content.
 * @property {String} contentDesc
 */

/**
 * Flag to indicate whether or not the recording should be kept or deleted when disk space is low.
 * @property {Number} keep
 */

/**
 * Last played offset of the recording.
 * @property {Number} lastPlayedOffset
 */

/**
 * Bookmark
 * @property {Number} bookmark
 */

/**
 * Task state
 * @property {Number} objectState
 * @property {Number} objectState.BOOKED 0
 * @property {Number} objectState.PROCESSING 1
 * @property {Number} objectState.SUSPEND_PROCESSING 2
 * @property {Number} objectState.STOP_PROCESSING 3
 * @property {Number} objectState.PROCESSED 4
 * @property {Number} objectState.FINAL 5
 * @property {Number} objectState.ERROR 6
 * @property {Number} objectState.DELETING 7
 * @property {Number} objectState.DELETED 8
 */

/**
 * The minimum age for allowed viewing.
 * @property {Number} parentalRating
 */

/**
 * Schedule type or job type.
 * @property {String} scheduleType
 * @property {String} scheduleType.SINGLE ONE_TIME
 * @property {String} scheduleType.EVENT ONE_EVT
 * @property {String} scheduleType.REPEAT RPT_TIME
 * @property {String} scheduleType.REPEAT_INTERVAL RPT_INTERVAL
 * @property {String} scheduleType.SERIES SERIES
 * @property {String} scheduleType.SEARCH SEARCH
 */

/**
 * Enum specifying the fulfillment level of a task over its future duration.
 * @property {Number} completeStatus
 * @property {Number} completeStatus.COMPLETION_STATUS_INVALID 0
 * @property {Number} completeStatus.COMPLETION_STATUS_NONE 1
 * @property {Number} completeStatus.COMPLETION_STATUS_PARTIAL 2
 * @property {Number} completeStatus.COMPLETION_STATUS_FULL 3
 */

/**
 * The date in UTC milliseconds until the job expires and is deleted. This date may not be earlier than the
 * end time of the final task, which is the default expiration.
 * @property {Number} expirationDate
 */

/**
 * Describes the recording type, one of `o5.data.Recording.RECORDING_TYPE`.
 * @property {Number} recordingType
 */

/**
 * The cumulativeStatus has a bit set if for any reason the task failed to start in the past.
 * If cumulativeStatus is 0, you can assume that the task has no interruptions in its recording
 * up to the present.
 * @property {Number} cumulativeStatus
 */

/**
 * Task type
 * @property {String} taskType
 * @property {String} taskType.RECORDING REC
 * @property {String} taskType.RMDR RMDR
 * @property {String} taskType.REMINDER GRMDR
 */

/**
 * Program lock flag
 * @property {Boolean} isProgramLocked
 */
