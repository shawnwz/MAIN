
/**
 * Returns events on the specified serviceId and time
 */
"use strict";

o5.platform.btv.PersistentCache.getEventByCount = function getEventByCount (serviceId, time, count, property) {

    var criteria, orderBy, resultSet,
			properties = property || "*",
			resultArray = [],
			events = [],
			errorName,
			errorMsg;

		if (count < 0) {
	    criteria = "endTime<=" + time + " AND serviceId='" + serviceId + "'";
			orderBy = "endTime DESC LIMIT " + Math.abs(count);
		} else {
	    criteria = "endTime>" + time + " AND serviceId='" + serviceId + "'";
			orderBy = "endTime ASC LIMIT " + count;
		}

		resultSet = CCOM.EPG.getEventsRSByQuery(properties, criteria, orderBy);

    if (resultSet.error) {
        errorName = resultSet.error.name || "";
        errorMsg = resultSet.error.message || "";
        this.logError("getEventsRSByQuery() failed! " + errorName + ", " + errorMsg);
    } else {
        resultArray = resultSet.getNext(999);
        resultSet.reset();
        events = o5.platform.btv.EPGEventFactory.mapArray(resultArray, (property !== undefined));
		if (count < 0) {
			events.reverse();
		}
    }
		return events;
};

/**
 * Returns events on the specified serviceId and timewindow
 */
o5.platform.btv.PersistentCache.getEventByTime = function getEventByTime (serviceId, startTime, stopTime, property) {
    var criteria = "startTime<" + stopTime + " AND endTime>" + startTime + " and serviceId='" + serviceId + "'",
			properties = property || "*",
			orderBy = "startTime ASC",
			resultSet = CCOM.EPG.getEventsRSByQuery(properties, criteria, orderBy),
			resultArray = [],
			skipEventTags = (property !== undefined),
			events = [],
			errorName,
			errorMsg;

    if (resultSet.error) {
        errorName = resultSet.error.name || "";
        errorMsg = resultSet.error.message || "";
        this.logError("getEventsRSByQuery() failed! " + errorName + ", " + errorMsg);
    } else {
        resultArray = resultSet.getNext(999);
        resultSet.reset();

        events = o5.platform.btv.EPGEventFactory.mapArray(resultArray, skipEventTags);
    }
		return events;
};

/**
 * The event properties differ from what is defined in the original _mapIPEventToDBSchema
 * method, hence we override this method.
 */
o5.platform.btv.PersistentCache._mapIPEventToDBSchema = function _mapIPEventToDBSchema (eventObject) {

	// we only keep the ones we cant regenerate with $service.Map.generic()
	var mapped = {
		actors          : eventObject.actors ? eventObject.actors.join("|") : "",
		aspect          : eventObject.aspect,
		audioMode       : eventObject.audioMode,
		categories      : eventObject.categories ? eventObject.categories.join("|") : "",
		channelTag      : eventObject.channelTag,
		contentType     : eventObject.contentType,
		contentWarning  : eventObject.contentWarning ? eventObject.contentWarning.join("|") : "",
		countries       : eventObject.countries ? eventObject.countries.join("|") : "",
		definition      : eventObject.definition,
		directors       : eventObject.directors ? eventObject.directors.join("|") : "",
		displayName     : eventObject.displayName,
		duration        : eventObject.duration,
		editorialId     : eventObject.editorialId,
		endTime         : eventObject.endTime,
		episodeNumber   : eventObject.episodeNumber,
		episodeTitle    : eventObject.episodeTitle,
		eventId         : eventObject.eventId,
		genre           : eventObject.genre,
		id              : eventObject.id,
		isCatchUp       : eventObject.isCatchUp === true ? 1 : 0,
		isStartOver     : eventObject.isStartOver === true ? 1 : 0,
		language        : eventObject.language,
		longDesc        : eventObject.longDesc,
		mainContentRef  : eventObject.mainContentRef,
		multipleVersions: eventObject.multipleVersions ? eventObject.multipleVersions.join("|") : "",
		origEventId     : eventObject.origEventId,
		parentalRating  : eventObject.parentalRating,
		programId       : eventObject.programId,
		programTimes    : eventObject.programTimes ? eventObject.programTimes.join("|") : "",
		seasonNumber    : eventObject.seasonNumber,
		seriesRef       : eventObject.seriesRef,
		serviceId       : eventObject.serviceId,
		shortDesc       : eventObject.shortDesc,
		sortTitle       : eventObject.sortTitle,
		source          : "PC:" + eventObject.source,
		startTime       : eventObject.startTime,
		subTitles       : eventObject.subTitles,
		technicalId     : eventObject.technicalId,
		title           : eventObject.title,
		year            : eventObject.year
	}, key;

	for (key in mapped) {
		if (mapped.hasOwnProperty(key)) {
			if (typeof mapped[key] === "undefined") {
				mapped[key] = "";
			}
		}
	}

	// must haves
	if (!mapped.startTime) {
		this.logError("must have eventObject.startTime");
	}
	if (!mapped.endTime) {
		this.logError("must have eventObject.endTime");
	}
	if (!mapped.eventId) {
		this.logError("must have eventObject.eventId");
	}
	if (!mapped.serviceId) {
		this.logError("must have eventObject.serviceId");
	}
	return mapped;
};

/**
 * The service properties differ from what is defined in the original _mapIPServiceToDBSchema
 * method, hence we override this method.
 */
o5.platform.btv.PersistentCache._mapIPServiceToDBSchema = function _mapIPServiceToDBSchema (serviceObject) {
	// must haves
	if (!serviceObject.serviceId) {
		this.logError("must have serviceObject.serviceId");
	}
	if (!serviceObject.uri) {
		this.logError("must have serviceObject.uri");
	}
	return serviceObject;
};
