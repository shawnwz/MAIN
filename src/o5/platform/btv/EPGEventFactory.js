/**
 * EPGEventFactory maps EPG event object(s) retrieved from CCOM to that
 * defined in o5.data.EPGEvent
 *
 * @class o5.platform.btv.EPGEventFactory
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.EPGEventFactory = new (function EPGEventFactory () {
    this.customProperties = [];
    this.customMappingFunc = null;
})();

/**
 * @method _isnPvrSupported
 * @private
 * @param {String} eventId Event id
 * @param {String} serviceId Service id
 * @return {Boolean} Returns true if nPVR is supported, false otherwise.
 */
o5.platform.btv.EPGEventFactory._isnPvrSupported = function _isnPvrSupported (eventId, serviceId) {
    var serviceObj = o5.platform.btv.EPG.getChannelByServiceId(serviceId);
    return (serviceObj && serviceObj.nPvrSupport) ? true : false;
};

/**
 * Map event tags to O5.js format. Often time, the event tags vary from network to network. If the event
 * tags differ from what is defined in this method, the application should override this method.
 * @method _mapEventTag
 * @private
 * @param {Object} mapped Mapped (JS) event object
 */
o5.platform.btv.EPGEventFactory._mapEventTag = function _mapEventTag (mapped) {
    mapped.promoImage = (mapped.eventTags && mapped.eventTags.promoImage) ? mapped.eventTags.promoImage : null;
    mapped.isnPvr = (mapped.eventTags && mapped.eventTags.isnPvr) ? true : this._isnPvrSupported(mapped.eventId, mapped.serviceId);
    mapped.startOverSupport = (mapped.eventTags && mapped.eventTags.startOverSupport) ? true : false;
    mapped.catchUpSupport = (mapped.eventTags && mapped.eventTags.catchUpSupport) ? true : false;
};

/**
 * Retrieves the specified tag object or value for the given eventId.
 * Tagging refers to the concept of adding enhanced metadata to existing Service or Event entries.
 * Retrieving tag for events allows the application to access extra metadata that is not accessible in
 * `mapObject`. There is no standard format, as it is network configurable.
 * @method getTagForEvent
 * @param {String} eventId Unique event identifier
 * @param {String} [tag] Optional tag field name
 * @return {Object|String|Number} Returns tag object if `tag` is unspecified. Otherwise, the tag value if found.
 * If nothing is found, null is returned.
 */
o5.platform.btv.EPGEventFactory.getTagForEvent = function getTagForEvent (eventId, tag) {
    var tags = CCOM.EPG.getTagsByEventId(eventId),
        tagValues, i;
    if (tags && tags.length) {
        if (tag === undefined) {
            try {
                tagValues = JSON.parse(tags[0].tagValue) || null;
            } catch (e) {
                tagValues = null;
            }
            return tagValues;
        } else {
            for (i = tags.length - 1; i >= 0; i--) {
                if (tags[i].tagId === tag) {
                    return tags[i].tagValue;
                }
            }
        }
    }
    return null;
};

/**
 * Maps an event object from the platform to that defined in o5.data.EPGEvent.
 * If the event properties differ from what is defined in this method, the application should call
 * registerCustomMappingFunc() to mapping more properties at the end of mapObject().
 * @method mapObject
 * @param {Object} obj Event object to be mapped
 * @param {Boolean} [skipEventTags=false] Optional parameter to skip querying and mapping of event tags
 * @return {Object} Mapped event object
 */
// Disable ESLint complexity because once the deprecated customProperties is removed, complexity will be reduced to acceptable level
// eslint-disable-next-line complexity
o5.platform.btv.EPGEventFactory.mapObject = function mapObject (obj, skipEventTags) {
    if (!obj) {
        return null;
    }

    var mapped = new o5.data.EPGEvent(obj),
        i, prop,
        customPropLength = this.customProperties.length;

    mapped.eventId = obj.eventId;
    mapped.serviceId = obj.serviceId;
    mapped.startTime = obj.startTime;
    mapped.endTime = obj.endTime;
    mapped.title = obj.title;
    mapped.shortDesc = obj.shortDesc;
    mapped.longDesc = obj.longDesc;
    mapped.seriesId = obj.seriesId;
    mapped.episodeId = obj.episodeId;
    mapped.seasonId = obj.seasonId;
    mapped.seriesName = obj.seriesName;
    mapped.sourceId = obj.sourceId || o5.data.EPGEvent.SOURCE.EIT;
    mapped.definition = obj.definition || null;
    mapped.parentalRating = obj.ageRating || obj.parentalRatingConverted || obj.parentalRating || null;

    if (!skipEventTags) {
        mapped.eventTags = this.getTagForEvent(obj.eventId);
    } else {
        mapped.eventTags = null;
    }
    this._mapEventTag(mapped);

    /* Legacy support, to be removed... */
    mapped.source = mapped.sourceId;
    mapped.year = obj.year || null; // always undefined?
    mapped._data = mapped;

    for (i = 0; i < customPropLength; i++) {
        prop = this.customProperties[i];
        if (obj.hasOwnProperty(prop) && !mapped.hasOwnProperty(prop)) {
            mapped[prop] = obj[prop];
        }
    }

    if (this.customMappingFunc !== null) {
        this.customMappingFunc(mapped, obj);
    }

    return mapped;
};

/**
 * Maps an array of event objects from the platform to that defined in
 * o5.data.EPGEvent
 * @method mapArray
 * @param {Array.<Object>} array Array of event objects to be mapped
 * @param {Boolean} [skipEventTags=false] Optional parameter to skip querying and mapping of event tags
 * @return {Array} Mapped array of event objects
 */
o5.platform.btv.EPGEventFactory.mapArray = function mapArray (array, skipEventTags) {
    var i,
        mapped,
        mappedArray = [];
    // array could be NPObject and not instanceof Array
    if (array && array.length) {
        for (i = 0; i < array.length; i++) {
            mapped = this.mapObject(array[i], skipEventTags);
            mappedArray.push(mapped);
        }
    }

    return mappedArray;
};

/**
 * Add custom event properties to be mapped in mapObject()
 * @method setCustomProperties
 * @deprecated use registerCustomMappingFunc()
 * @param {Array.<String>} customPropertyArray An array of custom properties to be added to event factory
 */
o5.platform.btv.EPGEventFactory.setCustomProperties = function setCustomProperties (customPropertyArray) {
    if (customPropertyArray instanceof Array) {
        this.customProperties = customPropertyArray;
    }
};

/**
 * Register custom mapping function to be called at the end of mapObject()
 * @method registerCustomMappingFunc
 * @param {Function} func Custom mapping function
 * @param {Object} func.mapped JS object to copy to
 * @param {Object} func.obj CCOM object to copy from
 */
o5.platform.btv.EPGEventFactory.registerCustomMappingFunc = function registerCustomMappingFunc (func) {
    if (func instanceof Function) {
        this.customMappingFunc = func;
    }
};

// uncomment to turn debugging on for EPGEventFactory object
// o5.log.setAll(o5.platform.btv.EPGEventFactory, true);
