/**
 * This class contains the logic for storing and retrieving EPG data to/from RAM memory, which is
 * JavaScript cache. Data stored here does not persists over power cycles.
 *
 * @class o5.platform.btv.EPGCache
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.EPGCache = new (function EPGCache () {
    // Cached services, unsorted array
    this.cachedServices = [];
    // Cached events in hashmap (key=serviceId, value=array of event objects sorted by ascending startTime)
    this.cachedEvents = {};
})();

/**
 * Returns the index number of the given service in the cachedServices array
 * @method _getCachedServiceIndex
 * @private
 * @param {Object} service Service object
 * @return {Number} Index in cachedServices array or -1 if not found
 */
o5.platform.btv.EPGCache._getCachedServiceIndex = function _getCachedServiceIndex (service) {
    var i,
        cachedServiceslength = this.cachedServices.length;
    for (i = 0; i < cachedServiceslength; i++) {
        if (service.serviceId === this.cachedServices[i].serviceId) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns the index number of the given eventId in the cachedEvents hash map
 * @method _getCachedEventIndex
 * @private
 * @param {Object} serviceId Service id
 * @param {Object} eventId Event id
 * @return {Number} Index in cachedEvents hash map or -1 if not found
 */
o5.platform.btv.EPGCache._getCachedEventIndex = function _getCachedEventIndex (serviceId, eventId) {
    var i,
        cachedEventArray,
        cachedEventlength;

    if (this.cachedEvents[serviceId] && this.cachedEvents[serviceId].length) {
        cachedEventArray = this.cachedEvents[serviceId];
        cachedEventlength = cachedEventArray.length;

        for (i = 0; i < cachedEventlength; i++) {
            if (eventId === cachedEventArray[i].eventId) {
                return i;
            }
        }
    }
    return -1;
};

/**
 * Removes events older than a specified time from the cache
 * @method _removeEventsOlderThan
 * @private
 * @param {Number} time Events endTime less than this value will be removed from the cache.
 * Time in milliseconds as returned by the `Date` object's `getTime` method.
 * @return {Boolean} Returns true if event(s) is removed, false otherwise.
 */
o5.platform.btv.EPGCache._removeEventsOlderThan = function _removeEventsOlderThan (time) {
    var i,
        result = false,
        eventsLength,
        serviceId;

    for (serviceId in this.cachedEvents) {
        if (this.cachedEvents.hasOwnProperty(serviceId)) {
            eventsLength = this.cachedEvents[serviceId].length;
            for (i = eventsLength - 1; i >= 0; i--) {
                if (this.cachedEvents[serviceId][i] && this.cachedEvents[serviceId][i].endTime < time) {
                    this.cachedEvents[serviceId].splice(i, 1);
                    result = true;
                }
            }
        }
    }

    return result;
};

/**
 * Removes events newer than a specified time from the cache
 * @method _removeEventsNewerThan
 * @private
 * @param {Number} time Events startTime greater than this value will be removed from the cache.
 * Time in milliseconds as returned by the `Date` object's `getTime` method.
 * @return {Boolean} Returns true if event(s) is removed, false otherwise.
 */
o5.platform.btv.EPGCache._removeEventsNewerThan = function _removeEventsNewerThan (time) {
    var i,
        result = false,
        eventsLength,
        serviceId;

    for (serviceId in this.cachedEvents) {
        if (this.cachedEvents.hasOwnProperty(serviceId)) {
            eventsLength = this.cachedEvents[serviceId].length;
            for (i = eventsLength - 1; i >= 0; i--) {
                if (this.cachedEvents[serviceId][i] && this.cachedEvents[serviceId][i].startTime > time) {
                    this.cachedEvents[serviceId].splice(i, 1);
                    result = true;
                }
            }
        }
    }

    return result;
};

/**
 * Remove service from cache
 * @method _removeService
 * @private
 * @param {Object} serviceId Service id
 * @return {Boolean} Returns true if service is removed, false otherwise.
 */
o5.platform.btv.EPGCache._removeService = function _removeService (serviceId) {
    var i,
        result = false,
        servicesLength = this.cachedServices.length;
    // Remove service from cachedServices array
    for (i = 0; i < servicesLength; i++) {
        if (this.cachedServices[i].serviceId === serviceId) {
            this.cachedServices.splice(i, 1);
            result = true;
            break;
        }
    }

    // Remove service from cachedEvents map
    if (this.cachedEvents[serviceId]) {
        this.cachedEvents[serviceId] = null;
        delete this.cachedEvents[serviceId];
        result = true;
    }

    return result;
};

/**
 * @method init
 * @deprecated Don't use, does nothing.
 */
o5.platform.btv.EPGCache.init = function init () {
    this.logDeprecated();
};

/**
 * This mirrors o5.platform.btv.PersistentCache.beginBatch() but there is no atomic operation
 * in RAM cache. This API was added to support the case where the client is using both persistent
 * and RAM cache interchangeably.
 * @method beginBatch
 * @async
 * @param {Function} callback Callback function that's to be called back when beginBatch is
 * completed.
 * @param {Boolean} callback.result True if successful or false for failure.
 */
o5.platform.btv.EPGCache.beginBatch = function beginBatch (callback) {
    setTimeout(function () { callback(true);
        return; }, 0);
};

/**
 * This mirrors o5.platform.btv.PersistentCache.commitBatch() but there is no atomic operation
 * in RAM cache. This API was added to support the case where the client is using both persistent
 * and RAM cache interchangeably.
 * @method commitBatch
 * @async
 * @param {Function} callback Callback function that's to be called back when commitBatch is
 * completed.
 * @param {Boolean} callback.result True if successful or false for failure.
 */
o5.platform.btv.EPGCache.commitBatch = function commitBatch (callback) {
    setTimeout(function () { callback(true);
        return; }, 0);
};

/**
 * This mirrors o5.platform.btv.PersistentCache.cancelBatch() but there is no atomic operation
 * in RAM cache. This API was added to support the case where the client is using both persistent
 * and RAM cache interchangeably.
 * @method cancelBatch
 * @async
 * @param {Function} callback Callback function that's to be called back when cancelBatch is
 * completed.
 * @param {Boolean} callback.result True if successful or false for failure.
 */
o5.platform.btv.EPGCache.cancelBatch = function cancelBatch (callback) {
    setTimeout(function () { callback(true);
        return; }, 0);
};

/**
 * Cache the given service in RAM cache. If serviceToAdd already exist in cache, then it will
 * overwrite it. Cached service is mapped to O5 format.
 * @method cacheService
 * @param {Object} serviceToAdd EPG service that's to be cached
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @param {Boolean} [skipMapping=false] If true, no mapping will be applied prior to caching the service.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.EPGCache.cacheService = function cacheService (serviceToAdd, callback, skipMapping) {
    var service = serviceToAdd,
        serviceIndex;

    if ((serviceToAdd && serviceToAdd._data) || (serviceToAdd && skipMapping)) {
        if (!skipMapping) {
            // Map IP data format to DB schema, then to O5 format
            service = o5.platform.btv.PersistentCache._mapIPServiceToDBSchema(serviceToAdd._data);
            service = o5.platform.btv.EPGServiceFactory.mapObject(service, true);
        }

        if (service.uri) {
            serviceIndex = this._getCachedServiceIndex(service);
            this.logInfo("serviceIndex: " + serviceIndex + ", service.uri: " + service.uri);

            if (serviceIndex === -1) {
                this.cachedServices.push(service);
                serviceIndex = this.cachedServices.length - 1;
            } else {
                this.cachedServices[serviceIndex] = service;
            }
            if (callback) {
                setTimeout(function () { callback(true, serviceIndex);
                    return; }, 0);
            }
        }
    }

    return serviceIndex;
};

/**
 * Cache the given service tag in RAM cache only if serviceToAdd.serviceId exist in the cache.
 * If service tag already exist in cache, then it will overwrite it. Cached service tag is mapped to O5 format.
 * @method cacheTagService
 * @param {Object} serviceToAdd EPG service that's to be cached
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @param {Boolean} [skipMapping=false] If true, no mapping will be applied prior to caching the service tag.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.EPGCache.cacheTagService = function cacheTagService (serviceToAdd, callback, skipMapping) {
    var mappedServiceTag = serviceToAdd,
        serviceIndex,
        serviceObj;

    if ((serviceToAdd && serviceToAdd._data) || (serviceToAdd && skipMapping)) {
        if (!skipMapping) {
            // Map IP data format to DB schema
            mappedServiceTag = o5.platform.btv.PersistentCache._mapIPServiceTagToDBSchema(serviceToAdd._data);
        }

        if (mappedServiceTag) {
            serviceIndex = this._getCachedServiceIndex(mappedServiceTag);
            this.logInfo("serviceIndex: " + serviceIndex + ", serviceId: " + mappedServiceTag.serviceId);

            if (serviceIndex !== -1) {
                serviceObj = this.cachedServices[serviceIndex];
                // Add serviceTags to existing serviceObj and map it to O5 format
                serviceObj.serviceTags = mappedServiceTag.tagValues;
                o5.platform.btv.EPGServiceFactory._mapServiceTag(serviceObj);

                if (callback) {
                    setTimeout(function () { callback(true, serviceIndex);
                        return; }, 0);
                }
            }
        }
    }

    return serviceIndex;
};

/**
 * Cache the given event in RAM cache.
 * @method cacheEvent
 * @param {Object} eventToAdd Event to be cached
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @param {Boolean} [skipMapping=false] If true, no mapping will be applied prior to caching the event.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
// Disable ESLint complexity, need to revisit event insertion code carefully to avoid regression.
// eslint-disable-next-line complexity
o5.platform.btv.EPGCache.cacheEvent = function cacheEvent (eventToAdd, callback, skipMapping) {
    var i,
        epgEvent = eventToAdd,
        cachedEventArray,
        eventIndex,
        isCached = false,
        eventsToRemove = [];

    if ((eventToAdd && eventToAdd._data) || (eventToAdd && skipMapping)) {
        if (!skipMapping) {
            // Map IP data format to DB schema, then to O5 format
            epgEvent = o5.platform.btv.PersistentCache._mapIPEventToDBSchema(eventToAdd._data);
            epgEvent = o5.platform.btv.EPGEventFactory.mapObject(epgEvent, true);
        }

        if (!epgEvent.serviceId) {
            return eventIndex;
        }

        if (!this.cachedEvents[epgEvent.serviceId]) {
            this.cachedEvents[epgEvent.serviceId] = [];
        }
        cachedEventArray = this.cachedEvents[epgEvent.serviceId];

        // Insert epgEvent to end of array if epgEvent.startTime is at the end of the queue
        if (cachedEventArray.length === 0 ||
            cachedEventArray[cachedEventArray.length - 1].endTime <= epgEvent.startTime) {
            cachedEventArray.push(epgEvent);
            eventIndex = cachedEventArray.length - 1;
        } else {
            // Insert epgEvent chronologically, with earliest startTime at the beginning
            for (i = 0; i < cachedEventArray.length; i++) {
                if (isCached) {
                    if (cachedEventArray[i].startTime < epgEvent.endTime) {
                        eventsToRemove.push(i);
                    } else {
                        break;
                    }
                } else if (epgEvent.startTime < cachedEventArray[i].endTime) {
                    cachedEventArray.splice(i, 0, epgEvent);
                    isCached = true;
                    eventIndex = i;
                }
            }
            // Insert first, then remove duplicates or out of order events
            if (eventsToRemove.length > 0) {
                for (i = eventsToRemove.length - 1; i >= 0; i--) {
                    cachedEventArray.splice(eventsToRemove[i], 1);
                }
            }
        }
        if (callback) {
            setTimeout(function () { callback(true, eventIndex);
                return; }, 0);
        }
    }

    return eventIndex;
};

/**
 * Cache the given array of events in RAM cache.
 * @method cacheEvents
 * @param {Array} events An array of events
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Boolean} [skipMapping=false] If true, no mapping will be applied prior to caching the event.
 */
o5.platform.btv.EPGCache.cacheEvents = function cacheEvents (events, callback, skipMapping) {
    var i;
    for (i = 0; i < events.length; i++) {
        this.cacheEvent(events[i], callback, skipMapping);
    }
};

/**
 * Cache the given event tag in RAM cache only if eventId exist in the cache.
 * If event tag already exist in cache, then it will overwrite it. Cached event tag is mapped to O5 format.
 * @method cacheTagEvent
 * @param {Object} eventToAdd EPG event that's to be cached
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @param {Boolean} [skipMapping=false] If true, no mapping will be applied prior to caching the event tag.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.EPGCache.cacheTagEvent = function cacheTagEvent (eventToAdd, callback, skipMapping) {
    var mappedEventTag = eventToAdd,
        serviceId,
        eventIndex,
        eventObj;

    if ((eventToAdd && eventToAdd._data) || (eventToAdd && skipMapping)) {
        if (!skipMapping) {
            // Map IP data format to DB schema
            mappedEventTag = o5.platform.btv.PersistentCache._mapIPEventTagToDBSchema(eventToAdd._data);
        }
        serviceId = eventToAdd.serviceId || eventToAdd._data.serviceId || undefined;

        if (mappedEventTag && serviceId !== undefined) {
            eventIndex = this._getCachedEventIndex(serviceId, mappedEventTag.eventId);
            this.logInfo("eventIndex: " + eventIndex + ", eventId: " + mappedEventTag.eventId);

            if (eventIndex !== -1) {
                eventObj = this.cachedEvents[serviceId][eventIndex];
                // Add eventTags to existing eventObj and map it to O5 format
                eventObj.eventTags = mappedEventTag.tagValues;
                o5.platform.btv.EPGEventFactory._mapEventTag(eventObj);

                if (callback) {
                    setTimeout(function () { callback(true, eventIndex);
                        return; }, 0);
                }
            }
        }
    }

    return eventIndex;
};

/**
 * Cache the given array of event tags in RAM cache.
 * @method cacheTagEvents
 * @param {Array} events An array of event tags
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Boolean} [skipMapping=false] If true, no mapping will be applied prior to caching the event tag.
 */
o5.platform.btv.EPGCache.cacheTagEvents = function cacheTagEvents (events, callback, skipMapping) {
    var i;
    for (i = 0; i < events.length; i++) {
        this.cacheTagEvent(events[i], callback, skipMapping);
    }
};

/**
 * Returns the unsorted cached services
 * @method getServices
 * @return {Array} Array of service objects
 */
o5.platform.btv.EPGCache.getServices = function getServices () {
    return this.cachedServices;
};

/**
 * Returns the unsorted cached services
 * @method getOTTBTVServices
 * @return {Array} Array of service objects
 */
o5.platform.btv.EPGCache.getOTTBTVServices = function getOTTBTVServices () {
    return this.cachedServices;
};

/**
 * @method fetchServices
 * @removed
 */

/**
 * @method updateService
 * @removed
 */

/**
 * Returns the event with the specified event id
 * @method getEventById
 * @param {String} eventId Event id
 * @return {Object} EPG event object
 */
o5.platform.btv.EPGCache.getEventById = function getEventById (eventId) {
    var eventsLength,
        serviceId,
        i;

    if (!eventId)
        return null;

    for (serviceId in this.cachedEvents) {
        if (this.cachedEvents.hasOwnProperty(serviceId)) {
            eventsLength = this.cachedEvents[serviceId].length;
            for (i = 0; i < eventsLength; i++) {
                if (this.cachedEvents[serviceId][i].eventId === eventId) {
                    return this.cachedEvents[serviceId][i];
                }
            }
        }
    }
    return null;
};

/**
 * Asynchronous version of getEventById
 * @method fetchEventById
 * @async
 * @param {String} eventId Event id
 * @param {Function} callback Callback function to receive event object
 * @param {Object} callback.event EPG event object
 */
o5.platform.btv.EPGCache.fetchEventById = function fetchEventById (eventId, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getEventById(eventId));
        }, 0);
    }
};

/**
 * Returns the current event from the specified serviceId
 * @method getEventCurrent
 * @param {String} serviceId Service id
 * @return {Object} EPG event object
 */
o5.platform.btv.EPGCache.getEventCurrent = function getEventCurrent (serviceId) {
    var now = new Date().getTime(),
        i,
        eventsLength,
        eventsForService;
    if (!this.cachedEvents[serviceId]) {
        return null;
    }
    eventsForService = this.cachedEvents[serviceId];
    eventsLength = eventsForService.length;
    for (i = 0; i < eventsLength; i++) {
        if (eventsForService[i].startTime <= now && eventsForService[i].endTime > now) {
            return eventsForService[i];
        }
    }
    return null;
};

/**
 * Asynchronous version of getEventCurrent
 * @method fetchEventCurrent
 * @async
 * @param {String} serviceId Service id
 * @param {Function} callback Callback function to receive event object
 * @param {Object} callback.event EPG event object
 */
o5.platform.btv.EPGCache.fetchEventCurrent = function fetchEventCurrent (serviceId, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getEventCurrent(serviceId));
        }, 0);
    }
};

/**
 * Returns the events on the specified serviceId and time
 * @method getEventByTime
 * @param {String} serviceId Service id
 * @param {Number} time Time in UTC milliseconds
 * @return {Object} EPG event object
 */
o5.platform.btv.EPGCache.getEventByTime = function getEventByTime (serviceId, time) {
    var i,
        events = this.cachedEvents[serviceId];

    if (events && events.length) {
        for (i = events.length - 1; i >= 0; i--) {
            if ((events[i].startTime <= time) && (events[i].endTime >= time)) {
                return events[i];
            }
        }
    }

    return null;
};

/**
 * Returns the event showing immediately after a specified event on the same service
 * @method getEventNext
 * @param {String} eventId Event id
 * @return {Object} EPG event object
 */
o5.platform.btv.EPGCache.getEventNext = function getEventNext (eventId) {
    var i,
        event = this.getEventById(eventId),
        serviceId,
        eventsForService,
        eventsLength;
    if (!event) {
        return null;
    }

    serviceId = event.serviceId;
    eventsForService = this.cachedEvents[serviceId];
    eventsLength = eventsForService.length;
    // eventsForService is sorted by ascending startTime, so search from beginning of array
    for (i = 0; i < eventsLength; i++) {
        if (eventsForService[i].startTime >= event.endTime) {
            return eventsForService[i];
        }
    }
    return null;
};

/**
 * Asynchronous version of getEventNext
 * @method fetchEventNext
 * @async
 * @param {String} eventId Event id
 * @param {Function} callback Callback function to receive event object
 * @param {Object} callback.event EPG event object

 */
o5.platform.btv.EPGCache.fetchEventNext = function fetchEventNext (eventId, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getEventNext(eventId));
        }, 0);
    }
};

/**
 * Returns the event showing immediately before a specified event on the same service
 * @method getEventPrevious
 * @param {String} eventId Event id
 * @return {Object} EPG event object
 */
o5.platform.btv.EPGCache.getEventPrevious = function getEventPrevious (eventId) {
    var i,
        event = this.getEventById(eventId),
        serviceId,
        eventsForService,
        eventsLength;
    if (!event) {
        return null;
    }

    serviceId = event.serviceId;
    eventsForService = this.cachedEvents[serviceId];
    eventsLength = eventsForService.length;
    // eventsForService is sorted by ascending startTime, so search from end of array
    for (i = eventsLength - 1; i >= 0; i--) {
        if (eventsForService[i].endTime <= event.startTime) {
            return eventsForService[i];
        }
    }
    return null;
};

/**
 * Asynchronous version of getEventPrevious
 * @method fetchEventPrevious
 * @async
 * @param {String} eventId Event id
 * @param {Function} callback Callback function to receive EPG event object
 * @param {Object} callback.eventObj EPG event object
 */
o5.platform.btv.EPGCache.fetchEventPrevious = function fetchEventPrevious (eventId, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getEventPrevious(eventId));
        }, 0);
    }
};

/**
 * Returns an array of events for the given serviceIds scheduled to show in the given time window
 * @method getEventsByWindow
 * @param {Array} serviceIds Array of service ids
 * @param {Number} startTime Time in UTC milliseconds
 * @param {Number} endTime Time in UTC milliseconds
 * @return {Array.<Object>} Array of EPG event objects
 */
o5.platform.btv.EPGCache.getEventsByWindow = function getEventsByWindow (serviceIds, startTime, endTime) {
    var i,
        j,
        serviceId,
        eventsForService,
        event,
        eventsInWindow = [];

    if (typeof startTime !== "number" || typeof endTime !== "number") {
        return [];
    }

    for (i = 0; i < serviceIds.length; i++) {
        serviceId = serviceIds[i];
        eventsForService = this.cachedEvents[serviceId];
        if (eventsForService) {
            for (j = 0; j < eventsForService.length; j++) {
                event = eventsForService[j];
                if ((event.endTime > startTime) && (event.startTime < endTime)) {
                    eventsInWindow.push(event);
                } else if (event.startTime > endTime) {
                    break;
                }
            }
        }
    }
    return eventsInWindow;
};

/**
 * Asynchronous version of getEventsByWindow
 * @method fetchEventsByWindow
 * @async
 * @param {Array} serviceIds Array of service ids that we're interested in
 * @param {Number} startTime Time in UTC milliseconds
 * @param {Number} endTime Time in UTC milliseconds
 * @param {Function} callback Callback function to receive event objects
 * @param {Array.<Object>} callback.eventsArray Array of EPG event objects
 */
o5.platform.btv.EPGCache.fetchEventsByWindow = function fetchEventsByWindow (serviceIds, startTime, endTime, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getEventsByWindow(serviceIds, startTime, endTime));
        }, 0);
    }
};

/**
 * @method getEventsByQuery
 * @removed
 */

/**
 * Removes the event with the given event id from the cache
 * @method removeEvent
 * @param {String} eventId Event id
 */
o5.platform.btv.EPGCache.removeEvent = function removeEvent (eventId) {
    var event,
        eventsLength,
        serviceId,
        i;
    for (serviceId in this.cachedEvents) {
        if (this.cachedEvents.hasOwnProperty(serviceId)) {
            eventsLength = this.cachedEvents[serviceId].length;
            for (i = 0; i < eventsLength; i++) {
                if (this.cachedEvents[serviceId][i] && this.cachedEvents[serviceId][i].eventId === eventId) {
                    this.cachedEvents[serviceId].splice(i, 1);
                    break;
                }
            }
        }
    }
};

/**
 * Removes events older than a specified time from the cache
 * @method removeEventsOlderThan
 * @async
 * @param {Number} time Events endTime less than this value will be removed from the cache.
 * Time in milliseconds as returned by the `Date` object's `getTime` method.
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if event(s) removed, false otherwise.
 */
o5.platform.btv.EPGCache.removeEventsOlderThan = function removeEventsOlderThan (time, callback) {
    var me = this;
    if (time) {
        setTimeout(function () {
            var result = me._removeEventsOlderThan(time);
            if (callback !== undefined) {
                callback(result);
                return;
            }
        }, 0);
    }
};

/**
 * Removes events newer than a specified time from the cache
 * @method removeEventsNewerThan
 * @async
 * @param {Number} time Events startTime greater than this value will be removed from the cache.
 * Time in milliseconds as returned by the `Date` object's `getTime` method.
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if event(s) removed, false otherwise.
 */
o5.platform.btv.EPGCache.removeEventsNewerThan = function removeEventsNewerThan (time, callback) {
    var me = this;
    if (time) {
        setTimeout(function () {
            var result = me._removeEventsNewerThan(time);
            if (callback !== undefined) {
                callback(result);
                return;
            }
        }, 0);
    }
};

/**
 * Removes the service with the given service id from the cache
 * @method removeService
 * @async
 * @param {String} serviceId Service id
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if service removed, false otherwise.
 * @param {String} callback.serviceId Service id that can be used to check against the input service id.
 */
o5.platform.btv.EPGCache.removeService = function removeService (serviceId, callback) {
    var me = this;
    if (serviceId !== undefined && serviceId !== null) {
        setTimeout(function () {
            var result = me._removeService(serviceId);
            if (callback !== undefined) {
                callback(result, serviceId);
                return;
            }
        }, 0);
    }
};

/**
 * Removes all services and events from the cache
 * @method clearCache
 */
o5.platform.btv.EPGCache.clearCache = function clearCache () {
    this.cachedServices = [];
    this.cachedEvents = {};
};

/**
 * Registers a callback to be invoked when the `EPGServicesUpdated` event is fired
 * @method addEPGServicesUpdatedListener
 * @deprecated Don't use, does nothing.
 */
o5.platform.btv.EPGCache.addEPGServicesUpdatedListener = function addEPGServicesUpdatedListener () {
};

/**
 * Removes a callback previously registered for the `EPGServicesUpdated` event
 * @method removeEPGServicesUpdatedListener
 * @deprecated Don't use, does nothing.
 */
o5.platform.btv.EPGCache.removeEPGServicesUpdatedListener = function removeEPGServicesUpdatedListener () {
};


// Uncomment to turn debugging on for EPGCache object
// o5.log.setAll(o5.platform.btv.EPGCache, true);
