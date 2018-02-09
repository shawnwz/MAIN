/**
 * This class contains the logic for storing and retrieving EPG data to/from a database, which is
 * stored in persistent memory like flash memory. Data stored here persists over power cycles.
 *
 * @class o5.platform.btv.PersistentCache
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.PersistentCache = new (function PersistentCache () {
    this.addServiceCallbackLookup = {};
    this.addEventCallbackLookup = {};
    this.removeExpiredEventsCallbackLookup = {};
    this.removeServiceCallbackLookup = {};
    this.tagServiceCallbackLookup = {};
    this.tagEventCallbackLookup = {};
    this.beginBatchCallbackLookup = {};
    this.commitBatchCallbackLookup = {};
    this.cancelBatchCallbackLookup = {};
    this.isISDBT = false;
    this.tvServiceTypesIds = [];
    this.radioServiceTypesIds = [];

    this.customServiceMappingFunc = null;
    this.customTagServiceMappingFunc = null;
    this.customEventMappingFunc = null;
    this.customTagEventMappingFunc = null;
})();

/**
 * Map an object that conforms to the DB service schema. If the service properties differ from what is
 * defined in this method, the application should override this method.
 * @method _mapIPServiceToDBSchema
 * @private
 * @param {Object} serviceObject Service object to be mapped
 * @return {Object} Mapped object
 */
o5.platform.btv.PersistentCache._mapIPServiceToDBSchema = function _mapIPServiceToDBSchema (serviceObject) {
    var mappedObj = {},
        drmId,
        NA = "N/A";
    if (serviceObject.sid) { // GATEWAY
        mappedObj.serviceId = serviceObject.sid;
        mappedObj.type = serviceObject.type; //o5.data.EPGService.SERVICE_TYPE.TV;
        mappedObj.name = serviceObject.sn;
        mappedObj.uri = NA;
        /*mappedObj.broadcastOnId = NA;
        mappedObj.broadcastTsId = NA;
        mappedObj.broadcastServiceId = NA;
        mappedObj.eitpfPresent = NA;
        mappedObj.eitsPresent = NA;
        mappedObj.runningStatus = NA;
        mappedObj.scrambledStatus = NA;
        mappedObj.providerName = null;
        mappedObj.content = null;
        mappedObj.naspCA = null;
        mappedObj.channelKey = null;
        mappedObj.uriBlackoutAlternate = null;
        mappedObj.telephoneInfo = null;
        mappedObj.contactInfo = null;
        mappedObj.zoneSelect = null;
        mappedObj.remoteControlKeyId = null;*/
    } else if (serviceObject.mainContentUID) { // SDP 3.4
        drmId = serviceObject.drmID;
        mappedObj.serviceId = serviceObject.mainContentUID;
        mappedObj.channelKey = serviceObject.number;
        mappedObj.name = serviceObject.name;
        if (drmId) {
            mappedObj.uri = serviceObject.networkLocation + "?sdp_prm_id=" + drmId;
        } else {
            mappedObj.uri = serviceObject.networkLocation;
        }
        mappedObj.providerName = serviceObject.name;
        // mappedObj.type = o5.data.EPGService.SERVICE_TYPE.TV; // JSFW 2.3.0-b4 code - but cannot take - will affect most of the places
        mappedObj.type = "BTV";
    } else if (serviceObject.editorial) { // MDS
        drmId = serviceObject.technical.drmId;
        mappedObj.serviceId = serviceObject.editorial.id;
        mappedObj.channelKey = serviceObject.technical.tvChannel;
        mappedObj.name = serviceObject.technical.Title;
        if (drmId) {
            mappedObj.uri = serviceObject.technical.NetworkLocation + "?sdp_prm_id=" + drmId;
        } else {
            mappedObj.uri = serviceObject.technical.NetworkLocation;
        }
        mappedObj.providerName = serviceObject.editorial.provider;
        // mappedObj.type = o5.data.EPGService.SERVICE_TYPE.TV; // JSFW 2.3.0-b4 code - but cannot take - will affect most of the places
        mappedObj.type = "BTV";
    }
    else if (serviceObject.netflix) { // Netflix
        mappedObj.serviceId = serviceObject.netflix.serviceId;
        mappedObj.uri = serviceObject.netflix.uri;
        mappedObj.type = serviceObject.netflix.type;//"NETFLIX";
        mappedObj.name = serviceObject.netflix.name;
        mappedObj.channelKey = serviceObject.netflix.channelKey;
        mappedObj.providerName = serviceObject.netflix.providerName;
    } else { // SDP 3.1
        mappedObj.serviceId = serviceObject.uid.toString();
        mappedObj.uri = serviceObject.networkLocation;
        mappedObj.type = serviceObject.type;
        mappedObj.name = serviceObject.name;
        mappedObj.providerName = serviceObject.name;
        mappedObj.channelKey = serviceObject.number;
        /*mappedObj.broadcastOnId = null;
        mappedObj.broadcastTsId = null;
        mappedObj.broadcastServiceId = null;
        mappedObj.eitpfPresent = null;
        mappedObj.eitsPresent = null;
        mappedObj.runningStatus = null;
        mappedObj.scrambledStatus = null;
        mappedObj.content = null;
        mappedObj.naspCA = null;
        mappedObj.uriBlackoutAlternate = null;
        mappedObj.telephoneInfo = null;
        mappedObj.contactInfo = null;
        mappedObj.zoneSelect = null;
        mappedObj.remoteControlKeyId = null;
        mappedObj.merlinAccessCriteria = null;*/
    }
    return mappedObj;
};

/**
 * Helper function to _mapIPServiceTagToDBSchema
 * @method _parseServiceTags
 * @private
 * @param {Object} serviceTag Service object to read from
 * @param {Object} tagValues Tag value object to write to
 */
// Disable ESLint complexity because this API is tied to SDP and may be removed/refactored in the future
// eslint-disable-next-line complexity
o5.platform.btv.PersistentCache._parseServiceTags = function _parseServiceTags (serviceTag, tagValues) {
    var editorial = serviceTag.editorial,
        technical = serviceTag.technical;

    if (editorial && editorial.hasOwnProperty("startOverSupport")) {
        if (typeof editorial.startOverSupport === "string") {
            tagValues.startOverSupport = (editorial.startOverSupport.toLowerCase() === "true") ? true : false;
        } else if (typeof editorial.startOverSupport === "boolean") {
            tagValues.startOverSupport = editorial.startOverSupport;
        }
    }

    if (editorial && editorial.hasOwnProperty("catchUpSupport")) {
        if (typeof editorial.catchUpSupport === "string") {
            tagValues.catchUpSupport = (editorial.catchUpSupport.toLowerCase() === "true") ? true : false;
        } else if (typeof editorial.catchUpSupport === "boolean") {
            tagValues.catchUpSupport = editorial.catchUpSupport;
        }
    }

    if (technical && technical.hasOwnProperty("nPvrSupport")) {
        if (typeof technical.nPvrSupport === "string") {
            tagValues.nPvrSupport = (technical.nPvrSupport.toLowerCase() === "true") ? true : false;
        } else if (typeof technical.nPvrSupport === "boolean") {
            tagValues.nPvrSupport = technical.nPvrSupport;
        }
    }
};

/**
 * Map an object that conforms to the DB service tag schema. If the service tag properties differ from
 * what is defined in this method, the application should override this method.
 * @method _mapIPServiceTagToDBSchema
 * @private
 * @param {Object} serviceTag Service object to be mapped
 * @return {Object} Mapped object
 */
o5.platform.btv.PersistentCache._mapIPServiceTagToDBSchema = function _mapIPServiceTagToDBSchema (serviceTag) {
    var serviceId,
        technical = serviceTag.technical,
        JSONObjStr,
        tagValues = {},
        mappedObj;

    // The only difference between SDP 3.4 and other versions is that for 3.4, we store
    // only the technical channel, and therefore need to store the mainContentUID as serviceId
    if (serviceTag.mainContentUID) {
        serviceId = serviceTag.mainContentUID.toString();
    } else if (serviceTag.editorial) {
        serviceId = serviceTag.editorial.id;
    } else if (serviceTag.netflix) {
        serviceId = serviceTag.netflix.serviceId;
    } else {
        serviceId = serviceTag.uid.toString();
    }

    if (serviceId) {
        if (serviceTag.ratingID) {
            tagValues.rating = String(serviceTag.ratingID);
        }

        if (serviceTag.promoImage) {
            tagValues.promoImage = encodeURI(serviceTag.promoImage.toString());
        } else if (technical && technical.PromoImages && technical.PromoImages.length) {
            tagValues.promoImage = encodeURI(technical.PromoImages[0].toString());
        } else if (serviceTag.netflix && serviceTag.netflix.promoImage) {
            tagValues.promoImage = serviceTag.netflix.promoImage;
        }

        if (serviceTag.locale) {
            tagValues.locale = serviceTag.locale;
        }

        this._parseServiceTags(serviceTag, tagValues);

        JSONObjStr = JSON.stringify(tagValues);
        if (JSONObjStr !== "{}") {
            mappedObj = {
                serviceId: serviceId,
                tagValues: tagValues,
                JSONObjStr: JSONObjStr
            };
        }
    }

    return mappedObj;
};

/**
 * Map an object that conforms to the DB event schema. If the event properties differ from what is
 * defined in this method, the application should override this method.
 * @method _mapIPEventToDBSchema
 * @private
 * @param {Object} eventObject Event object to be mapped
 * @return {Object} Mapped object
 */
o5.platform.btv.PersistentCache._mapIPEventToDBSchema = function _mapIPEventToDBSchema (eventObject) {
    var mappedObj = {};
    // NA = "N/A";
    if (eventObject.hasOwnProperty("eit_info_short_desc")) { // GATEWAY
        mappedObj.eventId = eventObject.eit_info_event_id;
        mappedObj.serviceId = eventObject.sid;
        mappedObj.sourceId = o5.data.EPGEvent.SOURCE.GATEWAY;
        mappedObj.startTime = eventObject.eit_info_start_time_gmt;
        mappedObj.endTime = eventObject.eit_info_start_time_gmt + eventObject.eit_info_duration;
        mappedObj.title = eventObject.eit_info_event_name;
        mappedObj.shortDesc = eventObject.eit_info_short_desc;
        mappedObj.parentalRating = eventObject.eit_info_private_rating;
        mappedObj.privateRating = eventObject.eit_info_private_rating;
        /*mappedObj.broadcastOnId = NA;
        mappedObj.broadcastTsId = NA;
        mappedObj.broadcastServiceId = NA;
        mappedObj.broadcastEventId = NA;
        mappedObj.runningStatus = NA;
        mappedObj.scrambledStatus = NA;
        mappedObj.longDesc = null;
        mappedObj.contentDesc = null;
        mappedObj.naspBlackout = null;
        mappedObj.naspCA = null;
        mappedObj.naspPPV = null;
        mappedObj.zoneSelect = null;*/
    } else if (eventObject.eventId) { // MDS
        mappedObj.eventId = eventObject.id.toString();
        mappedObj.serviceId = eventObject.serviceRef.toString();
        mappedObj.sourceId = o5.data.EPGEvent.SOURCE.MDS;
        mappedObj.startTime = eventObject.period.start * 1000;
        mappedObj.endTime = eventObject.period.end * 1000;
        mappedObj.title = eventObject.Title;
        mappedObj.shortDesc = eventObject.Description;
        mappedObj.longDesc = eventObject.Synopsis;
        mappedObj.parentalRating = eventObject.Rating.precedence;
        mappedObj.privateRating = eventObject.Rating.precedence;
        if (eventObject.editorial) {
            mappedObj.episodeId = eventObject.editorial.Episode;
            mappedObj.seriesId = eventObject.editorial.seriesRef;
        }
    } else if (eventObject.netflix) { // Netflix
        mappedObj.eventId = eventObject.netflix.id;
        mappedObj.serviceId = eventObject.netflix.serviceId;
        mappedObj.sourceId = $N.data.EPGEvent.SOURCE.MDS;
        mappedObj.startTime = eventObject.netflix.startTime;
        mappedObj.endTime = eventObject.netflix.endTime;
        mappedObj.title = eventObject.netflix.title;
        mappedObj.shortDesc = eventObject.netflix.shortDesc;
        mappedObj.longDesc = eventObject.netflix.longDesc;
        mappedObj.parentalRating = eventObject.netflix.parentalRating;
        mappedObj.privateRating = eventObject.netflix.privateRating;
    } else { //SDP
        mappedObj.eventId = eventObject.uid.toString();
        mappedObj.serviceId = eventObject.channelUID.toString();
        mappedObj.sourceId = o5.data.EPGEvent.SOURCE.SDP;
        mappedObj.startTime = eventObject.startTime;
        mappedObj.endTime = eventObject.endTime;
        mappedObj.title = eventObject.eventName;
        mappedObj.shortDesc = eventObject.shortDescription;
        mappedObj.longDesc = eventObject.shortDescription;
        mappedObj.parentalRating = eventObject.eventRating;
        mappedObj.privateRating = eventObject.eventRating;
        /*mappedObj.broadcastOnId = NA;
        mappedObj.broadcastTsId = NA;
        mappedObj.broadcastServiceId = NA;
        mappedObj.broadcastEventId = NA;
        mappedObj.runningStatus = NA;
        mappedObj.scrambledStatus = NA;
        mappedObj.contentDesc = null;
        mappedObj.naspBlackout = null;
        mappedObj.naspCA = null;
        mappedObj.naspPPV = null;
        mappedObj.zoneSelect = null;*/
    }
    return mappedObj;
};

/**
 * Helper function to _mapIPEventTagToDBSchema
 * @method _parseEventTags
 * @private
 * @param {Object} eventTag Event object to read from
 * @param {Object} tagValues Tag value object to write to
 */
// Disable ESLint complexity because this API is tied to SDP and may be removed/refactored in the future
// eslint-disable-next-line complexity
o5.platform.btv.PersistentCache._parseEventTags = function _parseEventTags (eventTag, tagValues) {

    if (eventTag.hasOwnProperty("isStartOver")) {
        if (typeof eventTag.isStartOver === "string") {
            tagValues.startOverSupport = (eventTag.isStartOver.toLowerCase() === "true") ? true : false;
        } else if (typeof eventTag.isStartOver === "boolean") {
            tagValues.startOverSupport = eventTag.isStartOver;
        }
    }

    if (eventTag.hasOwnProperty("isCatchUp")) {
        if (typeof eventTag.isCatchUp === "string") {
            tagValues.catchUpSupport = (eventTag.isCatchUp.toLowerCase() === "true") ? true : false;
        } else if (typeof eventTag.isCatchUp === "boolean") {
            tagValues.catchUpSupport = eventTag.isCatchUp;
        }
    }

    if (eventTag.hasOwnProperty("isnPvr")) {
        if (typeof eventTag.isnPvr === "string") {
            tagValues.isnPvr = (eventTag.isnPvr.toLowerCase() === "true") ? true : false;
        } else if (typeof eventTag.isnPvr === "boolean") {
            tagValues.isnPvr = eventTag.isnPvr;
        }
    }

    if (eventTag.PromoImages && eventTag.PromoImages.length) {
        tagValues.promoImage = encodeURI(eventTag.PromoImages[0].toString());
    } else if (eventTag.netflix && eventTag.netflix.promoImage) {
        tagValues.promoImage = eventTag.netflix.promoImage;
    }
};

/**
 * Map an object that conforms to the DB event tag schema. If the event tag properties differ from
 * what is defined in this method, the application should override this method.
 * @method _mapIPEventTagToDBSchema
 * @private
 * @param {Object} eventTag Event object to be mapped
 * @return {Object} Mapped object
 */
o5.platform.btv.PersistentCache._mapIPEventTagToDBSchema = function _mapIPEventTagToDBSchema (eventTag) {
    var eventId,
        JSONObjStr,
        tagValues = {},
        mappedObj;

    if (eventTag.id) {
        eventId = eventTag.id.toString();
    } else if (eventTag.eventId) {
        eventId = eventTag.eventId.toString();
    } else if (eventTag.netflix) {
        eventId = eventTag.netflix.id;
    }

    if (eventId) {
        this._parseEventTags(eventTag, tagValues);

        JSONObjStr = JSON.stringify(tagValues);
        if (JSONObjStr !== "{}") {
            mappedObj = {
                eventId: eventId,
                tagValues: tagValues,
                JSONObjStr: JSONObjStr
            };
        }
    }

    return mappedObj;
};

/**
 * Retrieves TV and radio service types from CCOM.ConfigManager
 * @method _retriveServiceTypeIds
 * @private
 */
o5.platform.btv.PersistentCache._retriveServiceTypeIds = function _retriveServiceTypeIds () {
    var i,
        TV_SERVICE_TYPES = "/network/siconfig/svlSources/dvbSvlSource/tvServiceTypes",
        RADIO_SERVICE_TYPES = "/network/siconfig/svlSources/dvbSvlSource/radioServiceTypes",
        tvServiceTypes = CCOM.ConfigManager.getValue(TV_SERVICE_TYPES),
        radioServiceTypes = CCOM.ConfigManager.getValue(RADIO_SERVICE_TYPES);

    if (tvServiceTypes && tvServiceTypes.keyValue) {
        for (i = 0; i < tvServiceTypes.keyValue.length; i++) {
            this.tvServiceTypesIds.push(tvServiceTypes.keyValue[i]);
        }
    }

    if (radioServiceTypes && radioServiceTypes.keyValue) {
        for (i = 0; i < radioServiceTypes.keyValue.length; i++) {
            this.radioServiceTypesIds.push(radioServiceTypes.keyValue[i]);
        }
    }
};

/**
 * Register all event OK listeners
 * @method _addEventOKListeners
 * @private
 */
o5.platform.btv.PersistentCache._addEventOKListeners = function _addEventOKListeners () {
//@hdk enabled first 2 because we need them
    CCOM.EPG.addEventListener("addServiceOK", this._addServiceOKListener, false);
    CCOM.EPG.addEventListener("addEventOK", this._addEventOKListener, false);
    /* Comment out to optimize for performance
    CCOM.EPG.addEventListener("removeExpiredEventsOK", this._removeExpiredEventsOKListener, false);
    CCOM.EPG.addEventListener("removeServiceOK", this._removeServiceOKListener, false);
    CCOM.EPG.addEventListener("tagServiceOK", this._tagServiceOKListener, false);
    CCOM.EPG.addEventListener("tagEventOK", this._tagEventOKListener, false);
    */
    CCOM.EPG.addEventListener("beginBatchOK", this._beginBatchOKListener, false);
    CCOM.EPG.addEventListener("commitBatchOK", this._commitBatchOKListener, false);
    CCOM.EPG.addEventListener("cancelBatchOK", this._cancelBatchOKListener, false);
};

/**
 * Register all event failed listeners
 * @method _addEventFailedListeners
 * @private
 */
o5.platform.btv.PersistentCache._addEventFailedListeners = function _addEventFailedListeners () {
    CCOM.EPG.addEventListener("addServiceFailed", this._addServiceFailedListener, false);
    CCOM.EPG.addEventListener("addEventFailed", this._addEventFailedListener, false);
    CCOM.EPG.addEventListener("removeExpiredEventsFailed", this._removeExpiredEventsFailedListener, false);
    CCOM.EPG.addEventListener("removeServiceFailed", this._removeServiceFailedListener, false);
    CCOM.EPG.addEventListener("tagServiceFailed", this._tagServiceFailedListener, false);
    CCOM.EPG.addEventListener("tagEventFailed", this._tagEventFailedListener, false);
    CCOM.EPG.addEventListener("beginBatchFailed", this._beginBatchFailedListener, false);
    CCOM.EPG.addEventListener("commitBatchFailed", this._commitBatchFailedListener, false);
    CCOM.EPG.addEventListener("cancelBatchFailed", this._cancelBatchFailedListener, false);
};

/**
 * Event handler to fire callback functions
 * @method _fireCallback
 * @private
 * @param {Number} handle Handle
 * @param {Object} lookup Function table
 * @param {Boolean} param Value to send to callback to notify success or failed event notification
 */
o5.platform.btv.PersistentCache._fireCallback = function _fireCallback (handle, lookup, param) {
    if (handle && lookup[handle]) {
        lookup[handle](param, handle);
        lookup[handle] = null;
        delete lookup[handle];
    }
};

o5.platform.btv.PersistentCache._addServiceOKListener = function _addServiceOKListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.addServiceCallbackLookup, true);
};

o5.platform.btv.PersistentCache._addServiceFailedListener = function _addServiceFailedListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.addServiceCallbackLookup, false);
};

o5.platform.btv.PersistentCache._addEventOKListener = function _addEventOKListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.addEventCallbackLookup, true);
};

o5.platform.btv.PersistentCache._addEventFailedListener = function _addEventFailedListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.addEventCallbackLookup, false);
};

o5.platform.btv.PersistentCache._removeExpiredEventsOKListener = function _removeExpiredEventsOKListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.removeExpiredEventsCallbackLookup, true);
};

o5.platform.btv.PersistentCache._removeExpiredEventsFailedListener = function _removeExpiredEventsFailedListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.removeExpiredEventsCallbackLookup, false);
};

o5.platform.btv.PersistentCache._removeServiceOKListener = function _removeServiceOKListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.removeServiceCallbackLookup, true);
};

o5.platform.btv.PersistentCache._removeServiceFailedListener = function _removeServiceFailedListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.removeServiceCallbackLookup, false);
};

o5.platform.btv.PersistentCache._tagServiceOKListener = function _tagServiceOKListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.tagServiceCallbackLookup, true);
};

o5.platform.btv.PersistentCache._tagServiceFailedListener = function _tagServiceFailedListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.tagServiceCallbackLookup, false);
};

o5.platform.btv.PersistentCache._tagEventOKListener = function _tagEventOKListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.tagEventCallbackLookup, true);
};

o5.platform.btv.PersistentCache._tagEventFailedListener = function _tagEventFailedListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.tagEventCallbackLookup, false);
};

o5.platform.btv.PersistentCache._beginBatchOKListener = function _beginBatchOKListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.beginBatchCallbackLookup, true);
};

o5.platform.btv.PersistentCache._beginBatchFailedListener = function _beginBatchFailedListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.beginBatchCallbackLookup, false);
};

o5.platform.btv.PersistentCache._commitBatchOKListener = function _commitBatchOKListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.commitBatchCallbackLookup, true);
};

o5.platform.btv.PersistentCache._commitBatchFailedListener = function _commitBatchFailedListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.commitBatchCallbackLookup, false);
};

o5.platform.btv.PersistentCache._cancelBatchOKListener = function _cancelBatchOKListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.cancelBatchCallbackLookup, true);
};

o5.platform.btv.PersistentCache._cancelBatchFailedListener = function _cancelBatchFailedListener (e) {
    var me = o5.platform.btv.PersistentCache;
    me._fireCallback(e.handle, me.cancelBatchCallbackLookup, false);
};

/**
 * Called by o5.$.init2() when O5 starts up.
 * @method _init
 * @private
 */
o5.platform.btv.PersistentCache._init = function _init () {
    // Don't use 'this' as this is called by o5.$.init2()
    var me = o5.platform.btv.PersistentCache;
    me._retriveServiceTypeIds();
    me._addEventOKListeners();
    me._addEventFailedListeners();
};

/**
 * @method init
 * @deprecated Don't use, unnecessary call
 */
o5.platform.btv.PersistentCache.init = function init () {
    this.logDeprecated();
};

/**
 * Asynchronously declare the beginning of an atomic batch of modifications to the EPG DB
 * @method beginBatch
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.PersistentCache.beginBatch = function beginBatch (callback) {
    var handle = CCOM.EPG.beginBatch();
    if (handle && callback) {
        this.beginBatchCallbackLookup[handle] = callback;
    }
    return handle;
};

/**
 * Asynchronously commit an atomic batch of modifications to the EPG DB
 * <pre>
 * [Performance Warning]
 * A large batch of modifications (i.e. cache/remove events, services, and tags) will take some time to complete.
 * It is best to wait for the callback before doing any read or write to the database. While the database is busy
 * writing, any read or write to the database will result in an error object (DB locking error).
 * </pre>
 *
 * @method commitBatch
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.PersistentCache.commitBatch = function commitBatch (callback) {
    var handle = CCOM.EPG.commitBatch();
    if (handle && callback) {
        this.commitBatchCallbackLookup[handle] = callback;
    }
    return handle;
};

/**
 * Asynchronously cancel an atomic batch of modifications to the EPG DB
 * @method cancelBatch
 * @async
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.PersistentCache.cancelBatch = function cancelBatch (callback) {
    var handle = CCOM.EPG.cancelBatch();
    if (handle && callback) {
        this.cancelBatchCallbackLookup[handle] = callback;
    }
    return handle;
};

/**
 * Cache the given service in persistent cache. If custom mapping is required, the application should call
 * registerCustomServiceMappingFunc() to register for custom mapping function.
 * @method cacheService
 * @async
 * @param {Object} serviceToAdd EPG service that's to be cached
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.PersistentCache.cacheService = function cacheService (serviceToAdd, callback) {
    var service,
        handle;
    if (serviceToAdd && serviceToAdd._data) {
        service = this._mapIPServiceToDBSchema(serviceToAdd._data);
        if (this.customServiceMappingFunc !== null)
            this.customServiceMappingFunc(service, serviceToAdd._data);
        console.log("#########calling persistentCache cacheService:");
        // Check uri as it is a mandatory field in DB schema
        if (service.uri) {
            this.logInfo("service.uri: " + service.uri);
            console.log("service.uri: " + service.uri);
            handle = CCOM.EPG.addService(service, 1);
            if (handle && callback) {
                this.addServiceCallbackLookup[handle] = callback;
            }
        }
    }
    return handle;
};

/**
 * Cache service tag information in persistent cache. If custom mapping is required, the application should
 * call registerCustomTagServiceMappingFunc() to register for custom mapping function.
 * @method cacheTagService
 * @async
 * @param {Object} serviceToAdd EPG service that's to be cached
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.PersistentCache.cacheTagService = function cacheTagService (serviceToAdd, callback) {
    var serviceTag,
        handle;
    if (serviceToAdd && serviceToAdd._data) {
        serviceTag = this._mapIPServiceTagToDBSchema(serviceToAdd._data);
        if (this.customTagServiceMappingFunc !== null) {
            if (!serviceTag)
                serviceTag = {};
            this.customTagServiceMappingFunc(serviceTag, serviceToAdd._data);
        }

        if (serviceTag) {
            this.logInfo("serviceId: " + serviceTag.serviceId);
            handle = CCOM.EPG.tagService(serviceTag.serviceId, "serviceTagId", serviceTag.JSONObjStr);
            if (handle && callback) {
                this.tagServiceCallbackLookup[handle] = callback;
            }
        }
    }
    return handle;
};

/**
 * Cache the given event in persistent cache. If custom mapping is required, the application should
 * call registerCustomEventMappingFunc() to register for custom mapping function.
 * @method cacheEvent
 * @async
 * @param {Object} eventToAdd EPG event that's to be cached
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.PersistentCache.cacheEvent = function cacheEvent (eventToAdd, callback) {
    var event,
        handle;
    if (eventToAdd) {
        event = this._mapIPEventToDBSchema(eventToAdd._data);
        if (this.customEventMappingFunc !== null)
            this.customEventMappingFunc(event, eventToAdd._data);

        this.logInfo("event.serviceId: " + event.serviceId + ", event.eventId: " + event.eventId);
        handle = CCOM.EPG.addEvent(event, 1);
        if (handle && callback) {
            this.addEventCallbackLookup[handle] = callback;
        }
    }
    return handle;
};

/**
 * Cache an array of events to the persistent cache. If custom mapping is required, the application should
 * call registerCustomEventMappingFunc() to register for custom mapping function.
 * @method cacheEvents
 * @async
 * @param {Array} events An array of events
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 */
o5.platform.btv.PersistentCache.cacheEvents = function cacheEvents (events, callback) {
    var i;
    for (i = 0; i < events.length; i++) {
        this.cacheEvent(events[i], callback);
    }
};

/**
 * Cache event tag information in persistent cache. If custom mapping is required, the application should
 * call registerCustomTagEventMappingFunc() to register for custom mapping function.
 * @method cacheTagEvent
 * @async
 * @param {Object} eventToAdd EPG event that's to be cached
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.PersistentCache.cacheTagEvent = function cacheTagEvent (eventToAdd, callback) {
    var eventTag,
        handle;
    if (eventToAdd) {
        eventTag = this._mapIPEventTagToDBSchema(eventToAdd._data);
        if (this.customTagEventMappingFunc !== null) {
            if (!eventTag)
                eventTag = {};
            this.customTagEventMappingFunc(eventTag, eventToAdd._data);
        }

        if (eventTag) {
            this.logInfo("eventId: " + eventTag.eventId);
            handle = CCOM.EPG.tagEvent(eventTag.eventId, "eventTagId", eventTag.JSONObjStr);
            if (handle && callback) {
                this.tagEventCallbackLookup[handle] = callback;
            }
        }
    }
    return handle;
};

/**
 * Cache an array of event tags information to the persistent cache. If custom mapping is required,
 * the application should call registerCustomTagEventMappingFunc() to register for custom mapping function.
 * @method cacheTagEvents
 * @async
 * @param {Array.<Object>} events An array of EPG events that's to be cached
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 */
o5.platform.btv.PersistentCache.cacheTagEvents = function cacheTagEvents (events, callback) {
    var i;
    for (i = 0; i < events.length; i++) {
        this.cacheTagEvent(events[i], callback);
    }
};

/**
 * Returns the cached services - sorted by channelKey (channel number)
 * <pre>
 * [Performance Warning]
 * This method may take some time to complete depending on the number of services available in the
 * database and the service types to query for. This method should only be called once at start up.
 * After that, use addEPGServicesUpdatedListener() to register for callback when services get updated
 * in the database.
 * </pre>
 *
 * @method getServices
 * @return {Array} Returns an array (NPObject) of EPG services
 */
o5.platform.btv.PersistentCache.getServices = function getServices () {
    // Fetch all TV and Radio service types as defined in configman.
    // See _retriveServiceTypeIds()
    var resultSet,
        resultArray = [],
        sTypes = [],
        criteria = null;

    if (this.tvServiceTypesIds.length) {
        // use of concat to avoid array of arrays
        sTypes = sTypes.concat(this.tvServiceTypesIds);
    }
    if (this.radioServiceTypesIds.length) {
        sTypes = sTypes.concat(this.radioServiceTypesIds);
    }

    if (sTypes.length > 0) {
        sTypes.push("'BTV'");
        sTypes.push("'NETFLIX'"); // It is ok to have 'NETFLIX' type on platforms without Netflix
        criteria = "type in (" + sTypes.join(",") + ")";
    }
    this.logDebug("criteria: " + criteria);

    if (this.isISDBT) {
        resultSet = CCOM.EPG.getServicesRSByQuery("serviceId, case when (subChannelKey not null) then (channelKey||'.'||subChannelKey) else (channelKey) end as channelKey,name,uri,serviceId", criteria, "channelKey, subChannelKey asc");
    } else {
        resultSet = CCOM.EPG.getServicesRSByQuery("*", criteria, "channelKey asc");
    }

    if (resultSet.error === undefined) {
        resultArray = resultSet.getNext(999);
        resultSet.reset();
    } else {
        this.logError("getServices() failed!");
    }

    return resultArray;
};

/**
 * Asynchronous version of getServices()
 * @method fetchServices
 * @async
 * @param {Function} callback Callback function that will be called with the array of service objects
 * @param {Array} callback.serviceArray An array (NPObject) of EPG services
 */
o5.platform.btv.PersistentCache.fetchServices = function fetchServices (callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getServices());
        }, 1);
    }
};

/**
 * Returns the IP service list from EPG.js
 * @method getOTTBTVServices
 * @deprecated Use o5.platform.btv.EPG.getIPChannelsOrderedByChannelNumber() instead
 * @return {Array.<Object>} Array of IP service objects
 */
o5.platform.btv.PersistentCache.getOTTBTVServices = function getOTTBTVServices () {
    if (o5.platform.btv.EPG === undefined) {
        this.logWarning("o5.platform.btv.EPG is undefined!");
        return [];
    }

    var ipChannelList = o5.platform.btv.EPG.getIPChannelsOrderedByChannelNumber();
    this.logDebug("ipChannelList.length = " + ipChannelList.length);

    return ipChannelList;
};

/**
 * Returns genre services of a specific userByte
 * @method getGenreServices
 * @param {String} genreId Genre id
 * @return {Array} Array (NPObject) of EPG services
 */
o5.platform.btv.PersistentCache.getGenreServices = function getGenreServices (genreId) {
    var criteria = "serviceId IN (select serviceId_Key from ServiceGenre where userByte=" + genreId + ")",
        resultSet = CCOM.EPG.getServicesRSByQuery("serviceId, case when (subChannelKey not null) then (channelKey||'.'||subChannelKey) else (channelKey) end as channelKey, name, uri, serviceId, naspCA", criteria, "channelKey, subChannelKey asc"),
        resultArray = [];

    if (resultSet.error === undefined) {
        resultArray = resultSet.getNext(999);
        resultSet.reset();
    } else {
        this.logError("getGenreServices(" + genreId + ") failed!");
    }

    return resultArray;
};

/**
 * Returns the genre list
 * @method getGenreList
 * @return {Array.<Object>} Array of genre objects with the following attribute:
 *
 *        userByte {String} Genre id
 */
o5.platform.btv.PersistentCache.getGenreList = function getGenreList () {
    var i,
        resultSet,
        resultArray = [],
        genreListNPObj;

    resultSet = CCOM.EPG.getServicesRSByQuery("distinct(select userByte from ServiceGenre where serviceid_key=serviceid ) as userByte", null, null);
    if (resultSet.error === undefined) {
        genreListNPObj = resultSet.getNext(999);
        resultSet.reset();

        // Map genre list from NPObject to JS array
        for (i = 0; i < genreListNPObj.length; i++) {
            resultArray.push({ userByte:genreListNPObj[i].userByte });
        }
    }

    return resultArray;
};

/**
 * If the given service.serviceId exists then this record will be overwritten by the given service object.
 * Otherwise the service object will be added to the cache as a new record
 * @method updateService
 * @async
 * @param {String} serviceId Unused parameter
 * @param {Object} service EPG service that's to be updated or added if missing
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.PersistentCache.updateService = function updateService (serviceId, service, callback) {
    return this.cacheService(service, callback);
};

/**
 * Returns the event with the specified event id
 * @method getEventById
 * @param {String} eventId EPG event id
 * @return {Object} Mapped EPG event
 */
o5.platform.btv.PersistentCache.getEventById = function getEventById (eventId) {
    if (!eventId) {
        return null;
    }
    return o5.platform.btv.EPGEventFactory.mapObject(CCOM.EPG.getEventById(eventId));
};

/**
 * Asynchronous version of getEventById()
 * @method fetchEventById
 * @async
 * @param {String} eventId EPG event id
 * @param {Function} callback Callback function that will be called with a mapped EPG event
 * @param {Object} callback.event Mapped EPG event
 */
o5.platform.btv.PersistentCache.fetchEventById = function fetchEventById (eventId, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getEventById(eventId));
        }, 1);
    }
};

/**
 * Returns the event currently showing on the specified service
 * @method getEventCurrent
 * @param {String} serviceId EPG service id
 * @return {Object} Mapped EPG event
 */
o5.platform.btv.PersistentCache.getEventCurrent = function getEventCurrent (serviceId) {
    return o5.platform.btv.EPGEventFactory.mapObject(CCOM.EPG.getEventCurrent(serviceId));
};

/**
 * Asynchronous version of getEventCurrent()
 * @method fetchEventCurrent
 * @async
 * @param {String} serviceId EPG service id
 * @param {Function} callback Callback function that will be called with the current mapped EPG event
 * @param {Object} callback.event Mapped EPG event
 */
o5.platform.btv.PersistentCache.fetchEventCurrent = function fetchEventCurrent (serviceId, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getEventCurrent(serviceId));
        }, 1);
    }
};

/**
 * Returns the events on the specified serviceId and time
 * @method getEventByTime
 * @param {String} serviceId EPG service id
 * @param {Number} time Time in UTC milliseconds
 * @param {String} [property] Optional parameter that lists the desired properties to query for.
 * Default value is "eventId, serviceId, startTime, endTime, parentalRating, title, shortDesc, longDesc".
 * Specifying the property may potentially reduce the time to retrieve the data. Only non tag event
 * property names are queried if this parameter is set.
 * @return {Object} Returns mapped EPG event or undefined if not found.
 */
o5.platform.btv.PersistentCache.getEventByTime = function getEventByTime (serviceId, time, property) {
    var criteria = "startTime <= " + time + " and endTime >= " + time + " and serviceId like '" + serviceId + "'",
        properties = property || "eventId, serviceId, startTime, endTime, parentalRating, title, shortDesc, longDesc",
        resultSet = CCOM.EPG.getEventsRSByQuery(properties, criteria, null),
        resultArray = [],
        eventObj,
        skipEventTags = (property !== undefined) ? true : false;

    if (resultSet.error === undefined) {
        resultArray = resultSet.getNext(1);
        resultSet.reset();
        if (resultArray[0]) {
            eventObj = o5.platform.btv.EPGEventFactory.mapObject(resultArray[0], skipEventTags);
        }
    } else {
        this.logError("getEventByTime(" + serviceId + "," + time + ") failed!");
    }

    return eventObj;
};

/**
 * Returns the event showing immediately after a specified event on the same service
 * @method getEventNext
 * @param {String} eventId EPG event id
 * @return {Object} Mapped EPG event
 */
o5.platform.btv.PersistentCache.getEventNext = function getEventNext (eventId) {
    return o5.platform.btv.EPGEventFactory.mapObject(CCOM.EPG.getEventNext(eventId));
};

/**
 * Asynchronous version of getEventNext()
 * @method fetchEventNext
 * @async
 * @param {String} eventId EPG event id
 * @param {Function} callback Callback function that will be called with the next event
 * or null if no such event is found
 * @param {Object} callback.event Mapped EPG event
 */
o5.platform.btv.PersistentCache.fetchEventNext = function fetchEventNext (eventId, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getEventNext(eventId));
        }, 1);
    }
};

/**
 * Returns the event showing immediately before a specified event on the same service
 * @method getEventPrevious
 * @param {String} eventId EPG event id
 * @return {Object} Mapped EPG event
 */
o5.platform.btv.PersistentCache.getEventPrevious = function getEventPrevious (eventId) {
    return o5.platform.btv.EPGEventFactory.mapObject(CCOM.EPG.getEventPrevious(eventId));
};

/**
 * Asynchronous version of getEventPrevious()
 * @method fetchEventPrevious
 * @async
 * @param {String} eventId EPG event id
 * @param {Function} callback Callback function that will be called with the previous event
 * or null if no such event is found
 * @param {Object} callback.event Mapped EPG event
 */
o5.platform.btv.PersistentCache.fetchEventPrevious = function fetchEventPrevious (eventId, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getEventPrevious(eventId));
        }, 1);
    }
};

/**
 * Returns an array of events for the given serviceIds scheduled to show in the given time window.
 * <pre>
 * [Performance Warning]
 * This method may take some time to complete depending on the number of service ids and time window
 * duration. Specifying property with few properties could shorten this method execution time.
 * </pre>
 *
 * @method getEventsByWindow
 * @param {Array} serviceIds Array of service ids
 * @param {Number} startTime Time in UTC milliseconds
 * @param {Number} endTime Time in UTC milliseconds
 * @param {String} [property] Optional parameter that lists the desired properties to query for.
 * By default, all properties (excluding tag events) will be queried. Specifying the properties
 * may potentially reduce the time to retrieve the data. Only non tag event property names are queried.
 * @return {Array.<Object>} Array of EPG event objects
 */
o5.platform.btv.PersistentCache.getEventsByWindow = function getEventsByWindow (serviceIds, startTime, endTime, property) {
    var i,
        length = serviceIds.length,
        criteria,
        resultSet,
        resultArray = [];

    if (endTime === undefined) {
        return [];
    }

    if (property === undefined) {
        return CCOM.EPG.getEventsByWindow(serviceIds, startTime, endTime);
    }

    criteria = "((startTime <= " + startTime + " AND endTime >= " + startTime + ") OR " +
    "(startTime >= " + startTime + " AND endTime <= " + endTime + ") OR " +
    "(startTime <= " + endTime + " AND endTime >= " + endTime + ")) AND " +
    "serviceId IN ( ";

    for (i = 0; i < length; i++) {
        criteria += "'" + serviceIds[i] + "'";
        if (i + 1 < length) {
            criteria = criteria + ",";
        }
    }
    criteria = criteria + ")";

    resultSet = CCOM.EPG.getEventsRSByQuery(property, criteria, null);

    if (resultSet.error) {
        var errorName = resultSet.error.name || "",
            errorMsg = resultSet.error.message || "";
        this.logError("getEventsRSByQuery() failed! " + errorName + ", " + errorMsg);
    } else {
        resultArray = resultSet.getNext(999);
        resultSet.reset();
    }

    return resultArray;
};

/**
 * Asynchronous version of getEventsByWindow()
 * @method fetchEventsByWindow
 * @async
 * @param {Array} serviceIds Array of service ids
 * @param {Number} startTime Time in UTC milliseconds
 * @param {Number} endTime Time in UTC milliseconds
 * @param {Function} callback Function that will be called with an array of events or an empty
 * array if no matching events are found
 * @param {Array.<Object>} callback.resultArray Array of EPG event objects
 * @param {String} [property] Optional parameter that lists the desired properties to query for.
 * By default, all properties will be queried. Specifying the properties may potentially reduce the
 * time to retrieve the data.
 */
o5.platform.btv.PersistentCache.fetchEventsByWindow = function fetchEventsByWindow (serviceIds, startTime, endTime, callback, property) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getEventsByWindow(serviceIds, startTime, endTime, property));
        }, 1);
    }
};

/**
 * @method removeEvent
 * @removed
 */

/**
 * Removes events older than a specified time from the cache
 * @method removeEventsOlderThan
 * @async
 * @param {Number} time Time in milliseconds as returned by the `Date` object's `getTime` method.
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false as failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.PersistentCache.removeEventsOlderThan = function removeEventsOlderThan (time, callback) {
    var handle;
    if (time) {
        handle = CCOM.EPG.removeExpiredEvents(time);
        if (handle && callback) {
            this.removeExpiredEventsCallbackLookup[handle] = callback;
        }
    }
    return handle;
};

/**
 * Removes the service with the given service id from the cache
 * @method removeService
 * @async
 * @param {String} serviceId Service id
 * @param {Function} [callback] Optional callback function
 * @param {Boolean} callback.result True if successful or false for failure.
 * @param {Number} callback.handle Handle that can be used to check against the returned value.
 * @return {Number} Returns the registered handle that can be used to check in the callback in case of multiple calls.
 */
o5.platform.btv.PersistentCache.removeService = function removeService (serviceId, callback) {
    var handle;
    if (serviceId) {
        handle = CCOM.EPG.removeService(serviceId);
        if (handle && callback) {
            this.removeServiceCallbackLookup[handle] = callback;
        }
    }
    return handle;
};

/**
 * Removes all services and events from the cache
 * @method clearCache
 * @deprecated does nothing, don't use
 */
o5.platform.btv.PersistentCache.clearCache = function clearCache () {
    this.logDeprecated();
};

/**
 * Set if ISDB-T enabled or not
 * @method setIsISDBT
 * @param {Boolean} isdbtValue Set to true if it is ISDB-T
 */
o5.platform.btv.PersistentCache.setIsISDBT = function setIsISDBT (isdbtValue) {
    this.isISDBT = isdbtValue;
};

/**
 * Determines whether the persistent cache database is available
 * @method isDBAvailable
 * @return {Boolean} Returns true if persistent cache database is available, false otherwise.
 */
o5.platform.btv.PersistentCache.isDBAvailable = function isDBAvailable () {
    return CCOM.EPG ? true : false;
};

/**
 * Registers a callback to be invoked when the `servicesUpdated` event is fired
 * @method addEPGServicesUpdatedListener
 * @param {Function} listener Callback listener
 */
o5.platform.btv.PersistentCache.addEPGServicesUpdatedListener = function addEPGServicesUpdatedListener (listener) {
    CCOM.EPG.addEventListener("servicesUpdated", listener, false);
};

/**
 * Removes a callback previously registered for the `servicesUpdated` event
 * @method removeEPGServicesUpdatedListener
 * @param {Function} listener Callback listener
 */
o5.platform.btv.PersistentCache.removeEPGServicesUpdatedListener = function removeEPGServicesUpdatedListener (listener) {
    CCOM.EPG.removeEventListener("servicesUpdated", listener);
};

/**
 * Registers a callback to be invoked when the `eventsUpdated` event is fired
 * @method addEPGEventsUpdatedListener
 * @param {Function} listener Callback listener
 */
o5.platform.btv.PersistentCache.addEPGEventsUpdatedListener = function addEPGEventsUpdatedListener (listener) {
    CCOM.EPG.addEventListener("eventsUpdated", listener, false);
};

/**
 * Removes a callback previously registered for the `eventsUpdated` event
 * @method removeEPGEventsUpdatedListener
 * @param {Function} listener Callback listener
 */
o5.platform.btv.PersistentCache.removeEPGEventsUpdatedListener = function removeEPGEventsUpdatedListener (listener) {
    CCOM.EPG.removeEventListener("eventsUpdated", listener);
};

/**
 * Remove event OK listeners (addService, addEvent, removeExpiredEvents, removeService,
 * tagService, tagEvent)
 * @method removeEventOKListeners
 */
o5.platform.btv.PersistentCache.removeEventOKListeners = function removeEventOKListeners () {
    CCOM.EPG.removeEventListener("addServiceOK", this._addServiceOKListener, false);
    CCOM.EPG.removeEventListener("addEventOK", this._addEventOKListener, false);
    CCOM.EPG.removeEventListener("removeExpiredEventsOK", this._removeExpiredEventsOKListener, false);
    CCOM.EPG.removeEventListener("removeServiceOK", this._removeServiceOKListener, false);
    CCOM.EPG.removeEventListener("tagServiceOK", this._tagServiceOKListener, false);
    CCOM.EPG.removeEventListener("tagEventOK", this._tagEventOKListener, false);
    //CCOM.EPG.removeEventListener("beginBatchOK", this._beginBatchOKListener, false);
    //CCOM.EPG.removeEventListener("commitBatchOK", this._commitBatchOKListener, false);
    //CCOM.EPG.removeEventListener("cancelBatchOK", this._cancelBatchOKListener, false);
};

/**
 * Synchronously return an array of all the Tags stored for the specified serviceId
 * @method getTagsByServiceId
 * @param {String} serviceId Service id
 * @return {Array.<Object>} Returns an array of tag objects.
 * Each element of this list is an object with the following attributes:
 *
 *        languageCode {String} Three-character ISO 639 language code (may be null).
 *        tagId {String} Tag identifier (for example, “starRating”).
 *        tagValue {String} Tag value (for example, “5”).
 */
o5.platform.btv.PersistentCache.getTagsByServiceId = function getTagsByServiceId (serviceId) {
    return CCOM.EPG.getTagsByServiceId(serviceId);
};

/**
 * Synchronously return an array of all the Tags stored for the specified eventId
 * @method getTagsByEventId
 * @param {String} eventId Event id
 * @return {Array.<Object>} Returns an array of tag objects.
 * Each element of this list is an object with the following attributes:
 *
 *        languageCode {String} Three-character ISO 639 language code (may be null).
 *        tagId {String} Tag identifier (for example, “starRating”).
 *        tagValue {String} Tag value (for example, “5”).
 */
o5.platform.btv.PersistentCache.getTagsByEventId = function getTagsByEventId (eventId) {
    return CCOM.EPG.getTagsByEventId(eventId);
};

/**
 * Asynchronously add/update the 'promoImage' tag to the specified serviceId
 * @method setChannelLogo
 * @private
 * @async
 * @deprecated Don't use
 * @param {Object} mappedServiceObject Service object
 * @param {String} serviceId Service id
 */
o5.platform.btv.PersistentCache.setChannelLogo = function setChannelLogo (mappedServiceObject, serviceId) {
    if (mappedServiceObject.promoImage) {
        CCOM.EPG.tagService(serviceId, "promoImage", mappedServiceObject.promoImage);
    } else if (mappedServiceObject.technical && mappedServiceObject.technical.PromoImages && mappedServiceObject.technical.PromoImages.length) {
        CCOM.EPG.tagService(serviceId, "promoImage", mappedServiceObject.technical.PromoImages[0]);
    }
};

/**
 * Returns a copy of tvServiceTypesIds[]
 * @method getTvServicetypeIds
 * @private
 * @return {Array} Returns a copy of tvServiceTypesIds[]
 */
o5.platform.btv.PersistentCache.getTvServicetypeIds = function getTvServicetypeIds () {
    return this.tvServiceTypesIds.slice(0);
};

/**
 * Returns a copy of radioServiceTypesIds[]
 * @method getRadioServicetypeIds
 * @private
 * @return {Array} Returns a copy of radioServiceTypesIds[]
 */
o5.platform.btv.PersistentCache.getRadioServicetypeIds = function getRadioServicetypeIds () {
    return this.radioServiceTypesIds.slice(0);
};

/**
 * Register custom mapping function to be called in cacheService(). The custom mapping will be called
 * after the default mapping.
 * @method registerCustomServiceMappingFunc
 * @param {Function} func Custom mapping function
 * @param {Object} func.mapped Object to copy to
 * @param {Object} func.obj Object to copy from
 */
o5.platform.btv.PersistentCache.registerCustomServiceMappingFunc = function registerCustomServiceMappingFunc (func) {
    if (func instanceof Function) {
        this.customServiceMappingFunc = func;
    }
};

/**
 * Register custom mapping function to be called in cacheTagService(). The custom mapping will be called
 * after the default mapping.
 * @method registerCustomTagServiceMappingFunc
 * @param {Function} func Custom mapping function
 * @param {Object} func.mapped Object to copy to
 * @param {Object} func.obj Object to copy from
 */
o5.platform.btv.PersistentCache.registerCustomTagServiceMappingFunc = function registerCustomTagServiceMappingFunc (func) {
    if (func instanceof Function) {
        this.customTagServiceMappingFunc = func;
    }
};

/**
 * Register custom mapping function to be called in cacheEvent(). The custom mapping will be called
 * after the default mapping.
 * @method registerCustomEventMappingFunc
 * @param {Function} func Custom mapping function
 * @param {Object} func.mapped Object to copy to
 * @param {Object} func.obj Object to copy from
 */
o5.platform.btv.PersistentCache.registerCustomEventMappingFunc = function registerCustomEventMappingFunc (func) {
    if (func instanceof Function) {
        this.customEventMappingFunc = func;
    }
};

/**
 * Register custom mapping function to be called in cacheTagEvent(). The custom mapping will be called
 * after the default mapping.
 * @method registerCustomTagEventMappingFunc
 * @param {Function} func Custom mapping function
 * @param {Object} func.mapped Object to copy to
 * @param {Object} func.obj Object to copy from
 */
o5.platform.btv.PersistentCache.registerCustomTagEventMappingFunc = function registerCustomTagEventMappingFunc (func) {
    if (func instanceof Function) {
        this.customTagEventMappingFunc = func;
    }
};


// Add _init() to array for o5.$.init2() to call when O5 starts up.
o5.$.init2Callbacks.push(o5.platform.btv.PersistentCache._init);

// Uncomment to turn debugging on for PersistentCache object
// o5.log.setAll(o5.platform.btv.PersistentCache, true);
