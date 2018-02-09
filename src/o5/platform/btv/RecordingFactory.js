/**
 * RecordingFactory maps recording object(s) retrieved from CCOM to that
 * defined in o5.data.Recording
 *
 * @class o5.platform.btv.RecordingFactory
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.RecordingFactory = new (function RecordingFactory () {
    this.customMappingFunc = null;
})();

/**
 * Maps a recording object from the platform to that defined in o5.data.Recording.
 * If the recording properties differ from what is defined in this method, the application should call
 * registerCustomMappingFunc() to mapping more properties at the end of mapObject().
 * @method _getMappedObject
 * @private
 * @param {Object} obj Recording object to be mapped
 * @return {Object} Mapped recording object
 */
o5.platform.btv.RecordingFactory._getMappedObject = function _getMappedObject (obj) {
    var mapped = new o5.data.Recording(obj);

    mapped.taskId = obj.taskId;
    mapped.jobId = obj.jobId;
    mapped.seriesId = obj.seriesId;
    mapped.seasonId = obj.seasonId;
    mapped.episodeId = obj.episodeId;
    mapped.seriesName = obj.seriesName;
    mapped.title = obj.title;
    mapped.url = "pvr://" + obj.taskId;
    mapped.eventId = obj.eventId;
    mapped.startTime = obj.startTime; // scheduled start time
    mapped.endTime = obj.endTime;     // scheduled end time
    mapped.actualStartTime = obj.actualStartTime;
    mapped.actualStopTime = obj.actualStopTime;
    mapped.softPrepaddingDuration = obj.softPrepaddingDuration;
    mapped.softPostpaddingDuration = obj.softPostpaddingDuration;
    mapped.hardPrepaddingDuration = obj.hardPrepaddingDuration;
    mapped.hardPostpaddingDuration = obj.hardPostpaddingDuration;
    mapped.duration = obj.duration;    // scheduled duration
    mapped.actualDuration = obj.actualDuration; // actual recording duration
    mapped.serviceId = obj.serviceId;
    mapped.shortDesc = obj.shortDesc;
    mapped.longDesc = obj.longDesc;
    mapped.contentDesc = obj.contentDesc;
    mapped.keep = obj.keep;
    mapped.lastPlayedOffset = obj.lastPlayedOffset;
    mapped.bookmark = obj.bookmark;
    mapped.objectState = obj.objectState;
    mapped.parentalRating = obj.ageRating || obj.parentalRating + 3;
    mapped.scheduleType = obj.scheduleType;
    mapped.completeStatus = obj.completeStatus;
    mapped.expirationDate = obj.expirationDate;
    mapped.recordingType = obj.scheduleType === "SERIES" ? o5.data.Recording.RECORDING_TYPE.SERIES : o5.data.Recording.RECORDING_TYPE.SINGLE;
    mapped.cumulativeStatus = obj.cumulativeStatus;
    mapped.taskType = obj.taskType;
    mapped.isProgramLocked = (obj.isProgramLocked || (obj.isProgramLocked === false)) ? obj.isProgramLocked : o5.platform.ca.ParentalControl.isRatingExceeded(mapped.parentalRating);

    /* Legacy support, to be removed... */
    mapped._data = mapped;

    if (this.customMappingFunc !== null) {
        this.customMappingFunc(mapped, obj);
    }

    return mapped;
};

/**
 * Maps an array of recording objects from the platform to that defined in
 * o5.data.Recording
 * @method _getMappedArray
 * @private
 * @param {Array.<Object>} array Array of recording objects to be mapped
 * @return {Array.<Object>} Mapped array of recording objects
 */
o5.platform.btv.RecordingFactory._getMappedArray = function _getMappedArray (array) {
    var i,
        mapped,
        mappedArray = [];

    if (array.length > 0) {
        for (i = 0; i < array.length; i++) {
            mapped = this._getMappedObject(array[i]);
            mappedArray.push(mapped);
        }
    }
    return mappedArray;
};

/**
 * Maps a recording object from the platform to that defined in
 * o5.data.Recording
 * @method mapObject
 * @param {Object} obj Recording object to be mapped
 * @return {Object} Mapped recording object
 */
o5.platform.btv.RecordingFactory.mapObject = function mapObject (obj) {
    if (obj) {
        return this._getMappedObject(obj);
    } else {
        return null;
    }
};

/**
 * Maps an array of recording objects from the platform to that defined in
 * o5.data.Recording
 * @method mapArray
 * @param {Array.<Object>} array Array of recording objects to be mapped
 * @return {Array.<Object>} Mapped array of recording objects
 */
o5.platform.btv.RecordingFactory.mapArray = function mapArray (array) {
    if (array) {
        return this._getMappedArray(array);
    } else {
        return [];
    }
};

/**
 * Register custom mapping function to be called at the end of mapObject()
 * @method registerCustomMappingFunc
 * @param {Function} func Custom mapping function
 * @param {Object} func.mapped JS object to copy to
 * @param {Object} func.obj CCOM object to copy from
 */
o5.platform.btv.RecordingFactory.registerCustomMappingFunc = function registerCustomMappingFunc (func) {
    if (func instanceof Function) {
        this.customMappingFunc = func;
    }
};

// uncomment to turn debugging on for RecordingFactory object
// o5.log.setAll(o5.platform.btv.RecordingFactory, true);
