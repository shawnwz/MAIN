/**
 * This class manages EPG data: it retrieves and caches EPG data from DVB and IP streams. The channels
 * that are returned by this class conform to the object structure defined in EPGService.
 *
 * @class o5.platform.btv.EPG
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.EPG = new (function EPG () {
    this.DEFAULT_EXPIRED_EVENTS_TIME = 0;
    this.DEFAULT_EPG_CACHE_TIME_DURATION = 3 * 60 * 60 * 1000; // 3 hours
    this.DEFAULT_CHECK_EXPIRED_EVENTS_TIME = 30 * 60 * 1000;   // 30 minutes
    this.dvbChannelList = [];
    this.isdbChannelList = [];
    this.ipChannelList = [];
    this.catchUpChannelList = [];
    this.gatewayChannelList = [];
    this.subscribedChannelList = [];
    this.subscribedChannelListByServiceId = {};
    this.radioChannelList = [];
    this.videoChannelList = [];
    this.genreChannelList = {};
    this.allChannels = {};
    this.allChannelList = [];
    this.serviceIdArray = [];
    this.ipServiceIdTable = {};
    this.catchUpServiceIdTable = {};
    this.gatewayServiceIdTable = {};
    this.refreshCallbacks = [];
    this.epgRAMCache = undefined;
    this.useRAMCache = false;
    this.dataSourceSdp = undefined;
    this.genreList = [];
    this.tvServiceTypesIds = [];
    this.radioServiceTypesIds = [];

    this.cacheHouseKeepingRunning = false;
    this.expiredEventsTime = this.DEFAULT_EXPIRED_EVENTS_TIME;
    this.epgCacheTimeDuration = this.DEFAULT_EPG_CACHE_TIME_DURATION;
    this.checkForExpiredEventsTime = this.DEFAULT_CHECK_EXPIRED_EVENTS_TIME;

    this.epgRefreshTimeOut = null;
    this.EPG_REFRESH_DELAY = 5*1000; // EPG.refresh delay in ms when _onServiceUpdateCallback is fired

    this.isCatchUpEnabled = false;
    this.externalFetchEventsFunc = null;
    this.eventsFromExtSrcOnly = false; // flag to fetch events exclusively from external src instead of from PersistentCache or EPGCache
})();

/**
 * Enumeration of cache types
 * @readonly
 * @property {String} CACHE_TYPES
 * @property {String} CACHE_TYPES.Persistent PERSISTENT_CACHE
 * @property {String} CACHE_TYPES.RAM RAM_CACHE
 */
o5.platform.btv.EPG.CACHE_TYPES = {
    Persistent: 'PERSISTENT_CACHE',
    RAM: 'RAM_CACHE'
};

/**
 * @property {Number} DATA_SOURCES
 * @removed
 */

/**
 * Enumeration of data source types
 * @readonly
 * @property {String} DATA_SOURCE_TYPE
 * @property {String} DATA_SOURCE_TYPE.GATEWAY GATEWAY
 * @property {String} DATA_SOURCE_TYPE.SDP SDP
 */
o5.platform.btv.EPG.DATA_SOURCE_TYPE = {
    GATEWAY: 'GATEWAY',
    SDP: 'SDP'
};

/**
 * @method _compareLogicalChannelNum
 * @private
 * @param {Object} a EPG service object
 * @param {Object} b EPG service object
 * @return {Number} Returns channel number difference
 */
o5.platform.btv.EPG._compareLogicalChannelNum = function _compareLogicalChannelNum (a, b) {
    return a.logicalChannelNum - b.logicalChannelNum;
};

/**
 * Returns an array of all services from CCOM, sorted from ascending channel number.
 * @method _getServicesArrayFromCCOM
 * @private
 * @return {Array} An array of service objects
 */
o5.platform.btv.EPG._getServicesArrayFromCCOM = function _getServicesArrayFromCCOM () {
    this.logDebug("loading services...");
    var i, j,
        services = o5.platform.btv.PersistentCache.getServices(),
        servicesLength,
        newProperty,
        newValue,
        channelInfoFromTag;

    // Service tags are also mapped in EPGServiceFactory.mapArray()
    services = o5.platform.btv.EPGServiceFactory.mapArray(services);

    return services;
};

/**
 * Helper method for refresh()
 * @method _populateGenreList
 * @private
 */
o5.platform.btv.EPG._populateGenreList = function _populateGenreList () {
    var i,
        j,
        resultList,
        serviceId;

    this.genreList = o5.platform.btv.PersistentCache.getGenreList();

    for (i = 0; i < this.genreList.length; i++) {
        if (this.genreList[i].userByte) {
            resultList = o5.platform.btv.PersistentCache.getGenreServices(this.genreList[i].userByte);
            this.genreChannelList[this.genreList[i].userByte] = [];
            for (j = 0; j < resultList.length; j++) {
                serviceId = resultList[j].serviceId;
                this.genreChannelList[this.genreList[i].userByte].push(this.allChannels[serviceId]);
            }
        }
    }
};

/**
 * Helper method which takes an array of EPG events and adds dummy events where required.
 * @method _augmentEventArrayWithDummyEvents
 * @private
 * @param {Array} events An array of EPG events
 * @param {Number} startTime The start time of the event window
 * @param {Number} endTime The end time of the event window
 * @param {String} serviceId The service id to be used when creating dummy EPG events
 * @param {Function} getDummyEvent The method used to create the dummy events
 * @return {Array} An array of event objects without event gaps
 */
o5.platform.btv.EPG._augmentEventArrayWithDummyEvents =
function _augmentEventArrayWithDummyEvents (events, startTime, endTime, serviceId, getDummyEvent) {
    var eventArray = [],
        i,
        event,
        next,
        eventsLength = events ? events.length : 0;
    if (eventsLength > 0) {
        if (events[0].startTime > startTime) {
            eventArray.push(getDummyEvent(serviceId, startTime, events[0].startTime));
        }
        for (i = 0; i < eventsLength; i++) {
            event = events[i];
            next = events[i + 1];
            eventArray.push(event);
            if (next && event.endTime < next.startTime) {
                eventArray.push(getDummyEvent(serviceId, event.endTime, next.startTime));
            }
        }
        if (event.endTime < endTime) {
            eventArray.push(getDummyEvent(serviceId, event.endTime, endTime));
        }
    } else {
        eventArray.push(getDummyEvent(serviceId, startTime, endTime));
    }
    return eventArray;
};

/**
 * Helper method to return a list of service ids from the
 * given array of channels
 * @method _createServiceIdArray
 * @private
 * @param {Array.<Object>} chanArray Array of service objects
 * @return {Array} Returns an array of service ids
 */
o5.platform.btv.EPG._createServiceIdArray = function _createServiceIdArray (chanArray) {
    var serviceIds = [],
        i;
    for (i = 0; i < chanArray.length; i++) {
        serviceIds.push(chanArray[i].serviceId);
    }
    return serviceIds;
};

/**
 * Creates and executes a ResultSet and registers the callback.
 * @method executeResultSet
 * @removed
 */

/**
 * Set periodic timer to clean RAM cache
 * @method _setCacheHouseKeeping
 * @private
 */
o5.platform.btv.EPG._setCacheHouseKeeping = function _setCacheHouseKeeping () {
    var me = this;

    if (!this.cacheHouseKeepingRunning) {
        this.cacheHouseKeepingRunning = true;
        setInterval(function () {
            me.epgRAMCache.removeEventsOlderThan(Date.now() - me.expiredEventsTime);
            me.epgRAMCache.removeEventsNewerThan(Date.now() + me.epgCacheTimeDuration);
        }, me.checkForExpiredEventsTime);
    }
};

/**
 * @method _getSDPServiceData
 * @private
 * @async
 * @param {String} [locale=en_gb] The user's locale.
 * @param {Number} [refreshInterval=12] Time in hours after which EPG data must be refreshed.
 * @param {Number} [maxDays=7] Number of days for which EPG data must be fetched.
 * @param {Number} [fetchDuration=2] Time in hours for which EPG data must be fetched.
 * @return {Boolean} Returns true if successful, otherwise, false.
 */
o5.platform.btv.EPG._getSDPServiceData = function _getSDPServiceData (locale, refreshInterval, maxDays, fetchDuration) {
    var me = this,
        sdp,
        myLocale = locale || "en_gb",
        refreshInt = refreshInterval || 12,
        maximumDays = maxDays || 7,
        fetchDur = fetchDuration || 2,
        accountId,
        filter,
        processSuccess,
        processFailure;

    if (!(this.dataSourceSdp && this.dataSourceSdp.sdp &&
          this.dataSourceSdp.sdp.IPDataLoader && this.dataSourceSdp.sdp.MetadataService)) {
        this.logError("sdp object is ill defined!");
        return false;
    }
    sdp = this.dataSourceSdp.sdp;

    processSuccess = function (response) {
        var i,
            channels = [];
        if (response && response.length > 0) {
            for (i = 0; i < response.length; i++) {
                channels.push({ serviceId: response[i]._data.editorial.id });
            }
            me.setSubscribedChannels(channels);
        }
        sdp.IPDataLoader.loadIPData();
    };

    processFailure = function (response) {
        sdp.IPDataLoader.loadIPData();
    };

    // Always get the channels first. Otherwise NPVR annotate may not happen correctly.
    sdp.IPDataLoader.init({
        locale: myLocale,
        refreshInterval: refreshInt,
        maxDays: maximumDays,
        forceRAMCache: this.dataSourceSdp.forceRAMCache,
        cacheEvents: this.dataSourceSdp.cacheEvents,
        fetchDuration: fetchDur
    });

    accountId = sdp.MetadataService.getAccountPackegeId();
    filter = {
        "technical.productRefs": { $in: [accountId] }
    };

    sdp.MetadataService.getEPGData(this, processSuccess, processFailure,
        sdp.MetadataService.RequestType.Channels, filter, [[ "Title", 1 ]], null);
    setInterval(function () {
        sdp.IPDataLoader.loadIPData();
    }, refreshInt * 3600 * 1000);

    return true;
};

/**
 * Callback to refresh service list when onServiceUpdate is triggered from CCOM.EPG.
 * It uses a timer to delay EPG.refresh by 5 seconds. Timer is restarted if another
 * callback is triggered within the 5 seconds window.
 * events, the timer would be restarted.
 * @method _onServiceUpdateCallback
 * @private
 */
o5.platform.btv.EPG._onServiceUpdateCallback = function _onServiceUpdateCallback () {
    var me = o5.platform.btv.EPG;

    if (me.epgRefreshTimeOut !== null) {
        clearTimeout(me.epgRefreshTimeOut);
        me.logDebug("_onServiceUpdateCallback() clearTimeout");
    }

    me.logDebug("_onServiceUpdateCallback() setTimeout");

    me.epgRefreshTimeOut = setTimeout(function () {
        o5.platform.btv.EPG.refresh();
        me.epgRefreshTimeOut = null;
        me.logDebug("_onServiceUpdateCallback() EGP refreshed");
    }, me.EPG_REFRESH_DELAY);
};

/**
 * Called by o5.$.init2() when O5 starts up.
 * @method _init
 * @private
 */
o5.platform.btv.EPG._init = function _init () {
    // Don't use 'this' as this is called by o5.$.init2()
    var me = o5.platform.btv.EPG;
    me.epgRAMCache = o5.platform.btv.EPGCache;
    me.tvServiceTypesIds = o5.platform.btv.PersistentCache.getTvServicetypeIds();
    me.radioServiceTypesIds = o5.platform.btv.PersistentCache.getRadioServicetypeIds();
};

/**
 * Initializes the EPG class.
 * @method init
 * @param {Object} [configuration] Optional configuration object containing the following properties:
 * @param {Boolean} [configuration.isCatchUpEnabled=false] Is catchup enabled
 * @param {Number} [configuration.expiredEventsTime=0] Time in milliseconds. Events older than
 * (current time - expiredEventsTime) will be removed from EPGCache. For example, if expiredEventsTime=0,
 * all events end time older than current time will be removed.
 * @param {Number} [configuration.epgCacheTimeDuration=10800000 (3 hours)] Time in milliseconds.
 * Events newer than (current time + epgCacheTimeDuration) will be removed from EPGCache.
 * For example, if epgCacheTimeDuration=10800000, all events end time greater than
 * (current time + 3hrs) will be removed.
 * @param {Number} [configuration.checkForExpiredEventsTime=1800000 (30 minutes)] Milliseconds interval to
 * check and clean cache.
 */
o5.platform.btv.EPG.init = function init (configuration) {
    if (configuration) {
        this.isCatchUpEnabled = configuration.isCatchUpEnabled || false;

        this.expiredEventsTime = configuration.expiredEventsTime || this.DEFAULT_EXPIRED_EVENTS_TIME;
        this.epgCacheTimeDuration = configuration.epgCacheTimeDuration || this.DEFAULT_EPG_CACHE_TIME_DURATION;

        this.checkForExpiredEventsTime = configuration.checkForExpiredEventsTime || this.checkForExpiredEventsTime;
    }

    // Register callback when service list in CCOM database is updated
    o5.platform.btv.PersistentCache.addEPGServicesUpdatedListener(this._onServiceUpdateCallback);

    this.refresh();
};

/**
 * Initialises the EPG class.
 * @method initialise
 * @deprecated use init()
 */
o5.platform.btv.EPG.initialise = function initialise () {
    this.logDeprecated();

    this.init();
};

/**
 * Updates all cached service lists such as DVB, IP, subscribed, genre lists. This method is called
 * during init(). The application should not call this method unless new services are added to persistent
 * or RAM cache.
 * <pre>
 * [Performance Warning]
 * This method may take some time to complete depending on the number of services available in the
 * database and the service types to query for. This method should only be called once at start up.
 * After that, use registerSvlUpdateCallback() to register for callback when services get updated
 * in the database.
 * </pre>
 *
 * @method refresh
 */
// Disable ESLint complexity because this API may be refactored in the future to remove several category types
// eslint-disable-next-line complexity
o5.platform.btv.EPG.refresh = function refresh () {
    var services,
        channel,
        i, j, k,
        cachedChannels;
    // Re-initialise the hashes and lists as they may have already been populated earlier
    this.dvbChannelList = [];
    this.isdbChannelList = [];
    this.ipChannelList = [];
    this.catchUpChannelList = [];
    this.gatewayChannelList = [];
    this.subscribedChannelList = [];
    this.subscribedChannelListByServiceId = {};
    this.radioChannelList = [];
    this.videoChannelList = [];
    this.genreChannelList = {};
    this.allChannels = {};
    this.serviceIdArray = [];
    this.ipServiceIdTable = {};
    this.catchUpServiceIdTable = {};
    this.gatewayServiceIdTable = {};

    //services = this._getServicesArrayFromCCOM();
    services = $service.MDS.Channel.getAllChannels();
    cachedChannels = this.epgRAMCache.getServices();
    if (cachedChannels && cachedChannels.length > 0) {
        services = services.concat(cachedChannels);
        services = services.sort(this._compareLogicalChannelNum);
    }
    this.allChannelList = services;

    // populate the hashes and lists afresh
    for (i = 0; i < this.allChannelList.length; i++) {
        channel = this.allChannelList[i];
        this.allChannels[channel.serviceId] = channel;
        this.serviceIdArray.push(channel.serviceId);
        if ((channel.uri) && (channel.uri.substring(0, 6) === 'dvb://' || (channel.uri.substring(0, 5) === 'tv://' && channel.uri.indexOf("isdbt") <= -1))) {
            this.dvbChannelList.push(channel);
            this.subscribedChannelList.push(channel);
            this.subscribedChannelListByServiceId[channel.serviceId] = channel;
            channel.isSubscribed = true;
        }
        if ((channel.uri) && (channel.uri.substring(0, 7) === 'dlna://')) {
            this.gatewayChannelList.push(channel);
            this.gatewayServiceIdTable[channel.serviceId] = channel;
        }
        if ((channel.uri) && (channel.uri.substring(0, 7) === 'http://')) {
            this.ipChannelList.push(channel);
            this.ipServiceIdTable[channel.serviceId] = channel;
            if (channel.isSubscribed) {
                this.subscribedChannelList.push(channel);
                this.subscribedChannelListByServiceId[channel.serviceId] = channel;
            }
            if (this.isCatchUpEnabled && channel.catchUpSupport) {
                this.catchUpChannelList.push(channel);
                this.catchUpServiceIdTable[channel.serviceId] = channel;
            }
        }
        if ((channel.uri) && (channel.uri.indexOf("isdbt") > -1)) {
            this.isdbChannelList.push(channel);
            this.subscribedChannelList.push(channel);
            this.subscribedChannelListByServiceId[channel.serviceId] = channel;
            channel.isSubscribed = true;
        }
        for (k = this.tvServiceTypesIds.length - 1; k >= 0; k--) {
            if (channel.serviceType === this.tvServiceTypesIds[k]) {
                this.videoChannelList.push(channel);
            }
        }
        for (k = this.radioServiceTypesIds.length - 1; k >= 0; k--) {
            if (channel.serviceType === this.radioServiceTypesIds[k]) {
                this.radioChannelList.push(channel);
            }
        }
    }

    // Populate Genre Channels
    this._populateGenreList();

    for (j = 0; j < this.refreshCallbacks.length; j++) {
        this.refreshCallbacks[j].callbackFunction.call(this.refreshCallbacks[j].caller);
    }
};

/**
 * Sort events in the order of the given serviceIds. Note that it may not be sorted by startTime.
 * If events are already sorted by startTime, the returned resulting array will also be sorted by
 * startTime.
 * @method sortEventsByInputServiceIds
 * @param {Array} serviceIds Array of service ids to sort by
 * @param {Array} events Array of events
 * @return {Array.<Object>} Sorted array of EPG event objects
 */
o5.platform.btv.EPG.sortEventsByInputServiceIds = function sortEventsByInputServiceIds (serviceIds, events) {
    var i,
        length = serviceIds.length || 0,
        serviceTable = {},
        eventsArray = [],
        resultEventsArray = [];

    if (length <= 1)
        return events;

    for (i = 0; i < length; i++) {
        serviceTable[serviceIds[i]] = [];
    }

    // Put events in hashmap
    for (i = 0; i < events.length; i++) {
        eventsArray = serviceTable[events[i].serviceId];
        if (eventsArray) {
            eventsArray.push(events[i]);
        }
    }

    // Convert hashmap to array
    for (i = 0; i < length; i++) {
        eventsArray = serviceTable[serviceIds[i]];
        if (eventsArray) {
            resultEventsArray = resultEventsArray.concat(eventsArray);
        }
    }

    return resultEventsArray;
};

/**
 * Check for event gaps
 * @method checkEventGap
 * @param {Array} serviceIds Array of serviceIds to check against
 * @param {Array} events Array of sorted events by ascending startTime and grouped together
 * by serviceId. The order of the service ids must be the same as serviceIds.
 * @param {Number} startTime Time in UTC milliseconds
 * @param {Number} endTime Time in UTC milliseconds
 * @param {Boolean} [quickCheck=false] If true, performs a quick check. If there is a gap, it returns
 * serviceIds.
 * @return {Array} Returns an array of missing events' service ids. Overlapping events are not gaps.
 * The order of the service ids are the same as serviceIds.
 */
// Disable ESLint complexity to avoid regression.
// eslint-disable-next-line complexity
o5.platform.btv.EPG.checkEventGap = function checkEventGap (serviceIds, events, startTime, endTime, quickCheck) {
    var s, i,
        serviceIdsLength = serviceIds.length,
        eventsLength = events.length,
        prevEventIdx,
        currStartTime,
        eventsGapServiceIdTable = {},
        eventsGapServiceIdArray = [];

    if (!events || eventsLength === 0) {
        return serviceIds;
    }

    // Quick check
    if (quickCheck && (events[0].startTime > startTime || events[eventsLength-1].endTime < endTime)) {
        return serviceIds;
    }

    currStartTime = startTime;
    for (s = 0, i = 0; s < serviceIdsLength; s++) {
        prevEventIdx = i;

        for ( ; i < eventsLength; i++) {
            if (serviceIds[s] !== events[i].serviceId) {
                // Check the endTime at the tail of the serviceId
                if (i === 0 || (events[i-1].endTime < endTime)) {
                    if (quickCheck)
                        return serviceIds;
                    else
                        eventsGapServiceIdTable[serviceIds[s]] = true;
                }
                currStartTime = startTime;
                break;
            }

            if (events[i].startTime <= currStartTime) {
                currStartTime = events[i].endTime;
            } else {
                if (quickCheck)
                    return serviceIds;
                else
                    eventsGapServiceIdTable[serviceIds[s]] = true;
            }
        }

        // Check for missing service ids after events ended
        if (prevEventIdx === i) {
            if (quickCheck)
                return serviceIds;
            else
                eventsGapServiceIdTable[serviceIds[s]] = true;
        }
    }

    // Check last event end time
    if (serviceIds[serviceIdsLength-1] === events[eventsLength-1].serviceId &&
        events[eventsLength-1].endTime < endTime) {
        if (quickCheck)
            return serviceIds;
        else
            eventsGapServiceIdTable[serviceIds[serviceIdsLength-1]] = true;
    }

    // eventsGapServiceIdArray must be in same order as serviceIds
    for (s = 0; s < serviceIdsLength; s++) {
        if (eventsGapServiceIdTable[serviceIds[s]] === true) {
            eventsGapServiceIdArray.push(serviceIds[s]);
        }
    }

    return eventsGapServiceIdArray;
};

/**
 * Merge two sorted event arrays. The two arrays must have events grouped together by serviceId
 * and the serviceId are in the same order.
 * @method mergeSortedEvents
 * @param {Array} serviceIds Array of service ids that the events are grouped and ordered by
 * @param {Array} fromEvents Event array sorted by ascending startTime and grouped together
 * by serviceId.
 * @param {Array} toEvents Event array sorted by ascending startTime and grouped together
 * by serviceId. If there are duplicating events (in terms of startTime and endTime), the events
 * in this array takes precedence.
 * @return {Array} Returns merged event array
 */
// Disable ESLint complexity to avoid regression.
// eslint-disable-next-line complexity
o5.platform.btv.EPG.mergeSortedEvents = function mergeSortedEvents (serviceIds, fromEvents, toEvents) {
    var s, f, t,
        serviceIdsLength = serviceIds.length,
        fromEventsLength = fromEvents.length,
        toEventsLength = toEvents.length,
        resultArray = [];

    if (!fromEvents || fromEventsLength === 0) {
        return toEvents;
    }
    if (!toEvents || toEventsLength === 0) {
        return fromEvents;
    }

    for (s = 0, f = 0, t = 0; s < serviceIdsLength; ) {

        if (f < fromEventsLength && t < toEventsLength &&
            serviceIds[s] === fromEvents[f].serviceId && serviceIds[s] === toEvents[t].serviceId) {

            if (fromEvents[f].startTime >= toEvents[t].startTime) {
                // Drop event if they overlap in the same serviceId
                if (resultArray.length === 0 ||
                    toEvents[t].startTime >= resultArray[resultArray.length-1].endTime ||
                    toEvents[t].serviceId !== resultArray[resultArray.length-1].serviceId) {
                    resultArray.push(toEvents[t]);
                }

                if (fromEvents[f].startTime === toEvents[t].startTime ||
                    fromEvents[f].endTime <= toEvents[t].endTime) {
                    f++;
                }
                t++;
            } else {
                // Drop event if they overlap in the same serviceId
                if (resultArray.length === 0 ||
                    fromEvents[f].startTime >= resultArray[resultArray.length-1].endTime ||
                    fromEvents[f].serviceId !== resultArray[resultArray.length-1].serviceId) {
                    resultArray.push(fromEvents[f]);
                }

                if (toEvents[t].endTime <= fromEvents[f].endTime) {
                    t++;
                }
                f++;
            }

        } else if (f < fromEventsLength && serviceIds[s] === fromEvents[f].serviceId) {
            // Drop event if they overlap in the same serviceId
            if (resultArray.length === 0 ||
                fromEvents[f].startTime >= resultArray[resultArray.length-1].endTime ||
                fromEvents[f].serviceId !== resultArray[resultArray.length-1].serviceId) {
                resultArray.push(fromEvents[f]);
            }
            f++;
        } else if (t < toEventsLength && serviceIds[s] === toEvents[t].serviceId) {
            // Drop event if they overlap in the same serviceId
            if (resultArray.length === 0 ||
                toEvents[t].startTime >= resultArray[resultArray.length-1].endTime ||
                toEvents[t].serviceId !== resultArray[resultArray.length-1].serviceId) {
                resultArray.push(toEvents[t]);
            }
            t++;
        } else {
            s++;
        }
    }

    return resultArray;
};

/**
 * Gets all channels
 *
 * @method getAllChannels
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getAllChannels = function getAllChannels () {
    return this.allChannelList;
};

/**
 * Removes all services in the persistent and RAM cache.
 * <pre>
 * [Performance Warning]
 * This method may take some time to complete depending on the number of services available in the
 * database.
 * </pre>
 *
 * @method removeAllChannels
 */
o5.platform.btv.EPG.removeAllChannels = function removeAllChannels () {
    var i,
        allChannelListLength = this.allChannelList.length;
    for (i = 0; i < allChannelListLength; i++) {
        o5.platform.btv.PersistentCache.removeService(this.allChannelList[i].serviceId);
    }

    if (this.useRAMCache) {
        this.epgRAMCache.clearCache();
    }
};

/**
 * Gets all channels sorted by logical channel number
 *
 * @method getAllChannelsOrderedByChannelNumber
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getAllChannelsOrderedByChannelNumber = function getAllChannelsOrderedByChannelNumber () {
    if (this.allChannelList.length > 0) {
        var tmpArray = this.allChannelList.slice(0);
        return tmpArray;
    } else {
        return [];
    }
};

/**
 * Gets a list of DVB channels sorted by logical channel number
 *
 * @method getDVBChannelsOrderedByChannelNumber
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getDVBChannelsOrderedByChannelNumber = function getDVBChannelsOrderedByChannelNumber () {
    if (this.dvbChannelList.length > 0) {
        var tmpArray = this.dvbChannelList.slice(0);
        return tmpArray;
    } else {
        return [];
    }
};

/**
 * Gets a list of ISDB channels sorted by logical channel number
 *
 * @method getISDBChannelsOrderedByChannelNumber
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getISDBChannelsOrderedByChannelNumber = function getISDBChannelsOrderedByChannelNumber () {
    if (this.isdbChannelList.length > 0) {
        var tmpArray = this.isdbChannelList.slice(0);
        return tmpArray;
    } else {
        return [];
    }
};

/**
 * Gets a list of IP channels sorted by logical channel number
 *
 * @method getIPChannelsOrderedByChannelNumber
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getIPChannelsOrderedByChannelNumber = function getIPChannelsOrderedByChannelNumber () {
    if (this.ipChannelList.length > 0) {
        return this.ipChannelList.slice(0);
    } else {
        return [];
    }
};

/**
 * Gets a list of gateway channels sorted by logical channel number
 *
 * @method getGatewayChannelsOrderedByChannelNumber
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getGatewayChannelsOrderedByChannelNumber = function getGatewayChannelsOrderedByChannelNumber () {
    if (this.gatewayChannelList.length > 0) {
        var tmpArray = this.gatewayChannelList.slice(0);
        return tmpArray;
    } else {
        return [];
    }
};

/**
 * Gets a list of subscribed channels sorted by logical channel number
 *
 * @method getSubscribedChannelsOrderedByChannelNumber
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getSubscribedChannelsOrderedByChannelNumber = function getSubscribedChannelsOrderedByChannelNumber () {
    var tmpArray = this.subscribedChannelList.slice(0);
    return tmpArray;
};

/**
 * Gets a map of subscribed channels with serviceIds as keys and channel objects as values
 *
 * @method getSubscribedChannelsOrderedByServiceId
 * @return {Object} Map of subscribed channels with serviceIds as keys and channel objects as values
 */
o5.platform.btv.EPG.getSubscribedChannelsOrderedByServiceId = function getSubscribedChannelsOrderedByServiceId () {
    return this.subscribedChannelListByServiceId;
};

/**
 * Gets a list of radio channels sorted by logical channel number
 *
 * @method getRadioChannelsOrderedByChannelNumber
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getRadioChannelsOrderedByChannelNumber = function getRadioChannelsOrderedByChannelNumber () {
    return this.radioChannelList.slice(0);
};

/**
 * Gets a list of video channels sorted by logical channel number
 *
 * @method getVideoChannelsOrderedByChannelNumber
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getVideoChannelsOrderedByChannelNumber = function getVideoChannelsOrderedByChannelNumber () {
    return this.videoChannelList.slice(0);
};


/**
 * Gets a list of channels based on genre sorted by logical channel number
 *
 * @method getGenreChannelsOrderedByChannelNumber
 * @param {String} genreId Genre id
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getGenreChannelsOrderedByChannelNumber = function getGenreChannelsOrderedByChannelNumber (genreId) {
    if (this.genreChannelList[genreId]) {
        var tmpArray = this.genreChannelList[genreId].slice(0);
        return tmpArray;
    } else {
        return [];
    }
};

/**
 * Gets a list of channels for selected genre
 *
 * @method getChannelsByGenre
 * @param {String} genreId Genre id
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getChannelsByGenre = function getChannelsByGenre (genreId) {
    return this.genreChannelList[genreId];
};

/**
 * Returns a service Id array that has been ordered using the logical channel number
 * @method getGenreServiceIdArraySortedByLCN
 * @param {String} genreId Genre id
 * @return {Array} List of service ids
 */
o5.platform.btv.EPG.getGenreServiceIdArraySortedByLCN = function getGenreServiceIdArraySortedByLCN (genreId) {
    var chanArray = this.getGenreChannelsOrderedByChannelNumber(genreId);
    return this._createServiceIdArray(chanArray);
};

/**
 * Returns the list of Genre stored on refresh
 *
 * @method getStoredGenreList
 * @return {Array.<Object>} Array of genre containing userByte
 */
o5.platform.btv.EPG.getStoredGenreList = function getStoredGenreList () {
    return this.genreList;
};

/**
 * Gets a list of all IP channels
 *
 * @method getIPChannels
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getIPChannels = function getIPChannels () {
    return this.ipChannelList;
};

/**
 * Gets a list of all Catchup channels
 *
 * @method getCatchupChannels
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getCatchupChannels = function getCatchupChannels () {
    return this.catchUpChannelList;
};

/**
 * Gets a list of service ids of IP channels
 * @method getIPServiceIdArray
 * @removed use getIPServiceIdTable
 */

/**
 * Gets a list of service ids of catchup channels
 * @method getCatchupServiceIdArray
 * @removed use getCatchupServiceIdTable
 */

/**
 * Gets a map of IP channels with serviceIds as keys and channel objects as values
 * @method getIPServiceIdTable
 * @return {Object} Map of IP channels with serviceIds as keys and channel objects as values
 */
o5.platform.btv.EPG.getIPServiceIdTable = function getIPServiceIdTable () {
    return this.ipServiceIdTable;
};

/**
 * Gets a map of catchup channels with serviceIds as keys and channel objects as values
 * @method getCatchupServiceIdTable
 * @return {Object} Map of catchup channels with serviceIds as keys and channel objects as values
 */
o5.platform.btv.EPG.getCatchupServiceIdTable = function getCatchupServiceIdTable () {
    return this.catchUpServiceIdTable;
};

/**
 * Gets a list of all GATEWAY channels
 *
 * @method getGatewayChannels
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getGatewayChannels = function getGatewayChannels () {
    return this.gatewayChannelList;
};

/**
 * Gets a map of gateway channels with serviceIds as keys and channel objects as values
 * @method getGatewayServiceIdTable
 * @return {Object} Map of gateway channels with serviceIds as keys and channel objects as values
 */
o5.platform.btv.EPG.getGatewayServiceIdTable = function getGatewayServiceIdTable () {
    return this.gatewayServiceIdTable;
};

/**
 * Gets a list of all DVB channels
 *
 * @method getDVBChannels
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getDVBChannels = function getDVBChannels () {
    return this.dvbChannelList;
};

/**
 * Gets a list of all ISDB channels
 *
 * @method getISDBChannels
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getISDBChannels = function getISDBChannels () {
    return this.isdbChannelList;
};

/**
 * Gets a list of radio channels
 *
 * @method getRadioChannels
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getRadioChannels = function getRadioChannels () {
    return this.radioChannelList.slice(0);
};

/**
 * Gets a list of video channels
 *
 * @method getVideoChannels
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getVideoChannels = function getVideoChannels () {
    return this.videoChannelList;
};

/**
 * @method setSubscribedChannels
 * @removed
 */

/**
 * Gets a list of all channels that the user is subscribed to
 * @method getSubscribedChannels
 * @return {Array.<Object>} List of EPG service objects
 */
o5.platform.btv.EPG.getSubscribedChannels = function getSubscribedChannels () {
    return this.subscribedChannelList;
};

/**
 * Returns an EPGService matched by its logical channel number
 * <pre>
 * [Performance Warning]
 * It is more efficient to call getChannelByServiceId() if service id is known.
 * </pre>
 *
 * @method getChannelByLCN
 * @param {Number} channelNumber Logical channel number of the requested channel
 * @return {Object} EPG service object, or null if no matching channel is found
 */
o5.platform.btv.EPG.getChannelByLCN = function getChannelByLCN (channelNumber) {
    var retService = null,
        serviceId = '';
    for (serviceId in this.allChannels) {
        if (this.allChannels.hasOwnProperty(serviceId)) {
            if (this.allChannels[serviceId] && this.allChannels[serviceId].logicalChannelNum === channelNumber) {
                retService = this.allChannels[serviceId];
                break;
            }
        }
    }
    return retService;
};

/**
 * Returns a channel matching the given service id
 * @method getChannelByServiceId
 * @param {String} serviceId Service id of the channel that we're interested in
 * @return {Object} EPG service object, or null if no matching channel is found
 */
o5.platform.btv.EPG.getChannelByServiceId = function getChannelByServiceId (serviceId) {
    return this.allChannels[String(serviceId)];
};

/**
 * Returns the channel matching the URI given
 * <pre>
 * [Performance Warning]
 * It is more efficient to call getChannelByServiceId() if service id is known.
 * </pre>
 *
 * @method getChannelByServiceURI
 * @param {String} uri URI of the required channel
 * @return {Object} EPG service object, or null if no matching channel is found
 */
o5.platform.btv.EPG.getChannelByServiceURI = function getChannelByServiceURI (uri) {
    var numberOfChannels,
        i;
    if (uri) {
        numberOfChannels = this.allChannelList.length;
        for (i = 0; i < numberOfChannels; i++) {
            if (this.allChannelList[i].uri && this.allChannelList[i].uri === uri) {
                return this.allChannelList[i];
            }
        }
    }
    return null;
};

/**
 * Returns the channel matching the specified event
 *
 * @method getChannelByEventId
 * @param {String} eventId Event id
 * @return {Object} EPG service object, or null if no matching channel is found
 */
o5.platform.btv.EPG.getChannelByEventId = function getChannelByEventId (eventId) {
    var event = this.getEventById(eventId);
    if (event) {
        return this.allChannels[event.serviceId];
    }
    return null;
};

/**
 * Gets events in the list of specified channels that are within the given time bounds.
 * <pre>
 * [Performance Warning]
 * This method may take some time to complete depending on the number of service ids and time window
 * duration. Specifying properties with few properties could shorten this method execution time.
 * </pre>
 *
 * @method getEventsByWindow
 * @param {Array} serviceIds Array of service ids that we're interested in
 * @param {Number} startTime Time in UTC milliseconds
 * @param {Number} endTime Time in UTC milliseconds
 * @param {String} [properties] Optional parameter that lists the desired properties to query for.
 * By default, all properties including tag events will be queried. Specifying the properties may potentially
 * reduce the time to retrieve the data. Only non tag event property names are queried if this parameter is set.
 * @return {Array.<Object>} Array of EPG event objects
 */
o5.platform.btv.EPG.getEventsByWindow = function getEventsByWindow (serviceIds, startTime, endTime, properties) {
    var events,
        cachedEvents = [],
        skipEventTags = (properties !== undefined) ? true : false;

    this.logDebug("startTime: " + startTime + ", endTime: " + endTime + ", properties: " + properties);

    // Get events from persistent cache
    events = o5.platform.btv.PersistentCache.getEventsByWindow(
                serviceIds, Math.floor(startTime), Math.floor(endTime), properties);

    if (events.error === undefined) {
        events = o5.platform.btv.EPGEventFactory.mapArray(events, skipEventTags);
        // Need to sort events by serviceIds
        events = this.sortEventsByInputServiceIds(serviceIds, events);
    } else {
        events = [];
    }

    // Get events from RAM cache
    if (this.useRAMCache && (this.checkEventGap(serviceIds, events, startTime, endTime, true)).length) {
        // EPGCache already sort events by serviceIds
         cachedEvents = this.epgRAMCache.getEventsByWindow(serviceIds, startTime, endTime);
        if (cachedEvents.length) {
            events = this.mergeSortedEvents(serviceIds, cachedEvents, events);
        }
    }

    return events;
};

/**
 * Gets the event with the matching id
 *
 * @method getEventById
 * @param {String} eventId Event id
 * @return {Object} EPG event object
 */
o5.platform.btv.EPG.getEventById = function getEventById (eventId) {
    var event;
    this.logDebug("eventId: " + eventId);

    event = o5.platform.btv.PersistentCache.getEventById(eventId);

    if (this.useRAMCache && !event) {
        event = this.epgRAMCache.getEventById(eventId);
    }
    return event;
};

/**
 * Gets the current event on the given channel
 *
 * @method getCurrentEventForService
 * @param {String} serviceId Service id of the channel we're interested in
 * @return {Object} EPG event object
 */
o5.platform.btv.EPG.getCurrentEventForService = function getCurrentEventForService (serviceId) {
    var currentEvent;
    this.logDebug("serviceId: " + serviceId);

    currentEvent = o5.platform.btv.PersistentCache.getEventCurrent(serviceId);

    if (this.useRAMCache && !currentEvent) {
        currentEvent = this.epgRAMCache.getEventCurrent(serviceId);
    }
    return currentEvent;
};

/**
 * Returns the events on the specified serviceId and time
 * @method getEventByTime
 * @param {String} serviceId Service id
 * @param {Number} time Time in UTC milliseconds
 * @param {String} [properties] Optional parameter that lists the desired properties to query for.
 * Default value is "eventId, serviceId, startTime, endTime, parentalRating, title, shortDesc, longDesc".
 * Specifying the properties may potentially reduce the time to retrieve the data. Only non tag event
 * property names are queried if this parameter is set.
 * @return {Object} Returns mapped EPG event or undefined if not found.
 */
o5.platform.btv.EPG.getEventByTime = function getEventByTime (serviceId, time, properties) {
    var event;
    this.logDebug("serviceId: " + serviceId + ", time: " + time + ", properties:" + properties);

    event = o5.platform.btv.PersistentCache.getEventByTime(serviceId, time, properties);

    if (this.useRAMCache && !event) {
        event = this.epgRAMCache.getEventByTime(serviceId, time);
    }
    return event;
};

/**
 * Gets the event starting immediately after the current one on the given channel
 *
 * @method getNextEventForService
 * @param {String} serviceId Service id of the channel we're interested in
 * @return {Object} EPG event object
 */
o5.platform.btv.EPG.getNextEventForService = function getNextEventForService (serviceId) {
    var event = this.getCurrentEventForService(serviceId),
        eventId = event ? event.eventId : null,
        nextEvent;
    this.logDebug("serviceId: " + serviceId + ", eventId: " + eventId);

    nextEvent = eventId ? o5.platform.btv.PersistentCache.getEventNext(eventId) : null;

    if (this.useRAMCache && !nextEvent && eventId) {
        nextEvent = this.epgRAMCache.getEventNext(eventId);
    }
    return nextEvent;
};

/**
 * @method getPreviousEventForService
 * @removed
 */

/**
 * Returns the event showing immediately after a specified event on the same service
 * @method getEventNext
 * @async
 * @param {String} eventId Event id
 * @return {Object} EPG event object
 */
o5.platform.btv.EPG.getEventNext = function getEventNext (eventId) {
    var nextEvent = o5.platform.btv.PersistentCache.getEventNext(eventId);
    if (this.useRAMCache && !nextEvent) {
        nextEvent = this.epgRAMCache.getEventNext(eventId);
    }
    return nextEvent;
};

/**
 * Returns the event showing immediately before a specified event on the same service
 * @method getEventPrevious
 * @param {String} eventId Event id
 * @return {Object} EPG event object
 */
o5.platform.btv.EPG.getEventPrevious = function getEventPrevious (eventId) {
    var previousEvent = o5.platform.btv.PersistentCache.getEventPrevious(eventId);
    if (this.useRAMCache && !previousEvent) {
        previousEvent = this.epgRAMCache.getEventPrevious(eventId);
    }
    return previousEvent;
};

/**
 * Returns a list of service IDs sorted by ascending logical channel numbers
 *
 * @method getServiceIdArray
 * @return {Array} List of service ids
 */
o5.platform.btv.EPG.getServiceIdArray = function getServiceIdArray () {
    return this.serviceIdArray || [];
};

/**
 * Get events in a time window for the given serviceId.
 * If there are gaps between events, then dummy events are created using the given `getDummyEvent` function.
 * <pre>
 * [Performance Warning]
 * This method may take some time to complete depending on the time window duration. Specifying properties with
 * few properties could shorten this method execution time.
 * </pre>
 *
 * @method getEventsForChannelWithDummyEvents
 * @param {String} serviceId Service id
 * @param {Number} startTime Time in UTC milliseconds
 * @param {Number} endTime Time in UTC milliseconds
 * @param {Function} getDummyEvent A dummy event generator function which returns a dummy event object with at least
 * the following fields: serviceId, startTime, endTime, title, eventId
 * @param {String} getDummyEvent.defaultServiceId Service id of the dummy event
 * @param {Number} getDummyEvent.defaultStartTime Start time of the dummy event
 * @param {Number} getDummyEvent.defaultEndTime End time of the dummy event
 * @param {String} [properties] Optional parameter that lists the desired properties to query for.
 * By default, all properties including tag events will be queried. Specifying the properties may potentially
 * reduce the time to retrieve the data. Only non tag event property names are queried if this parameter is set.
 * @return {Array} An array of event objects
 */
o5.platform.btv.EPG.getEventsForChannelWithDummyEvents =
function getEventsForChannelWithDummyEvents (serviceId, startTime, endTime, getDummyEvent, properties) {
    var eventsForService = this.getEventsByWindow([serviceId], startTime, endTime, properties);
    eventsForService = this._augmentEventArrayWithDummyEvents(
                        eventsForService, startTime, endTime, serviceId, getDummyEvent);
    return eventsForService;
};

/**
 * Same as getEventsForChannelWithDummyEvents()
 * @method getEventsForGridRow
 * @deprecated use getEventsForChannelWithDummyEvents
 */
o5.platform.btv.EPG.getEventsForGridRow = o5.platform.btv.EPG.getEventsForChannelWithDummyEvents;

/**
 * Get events in a time window for the given array of serviceIds.
 * If there are gaps between events, then dummy events are created using the given `getDummyEvent` function.
 * @method fetchEventsForGridPage
 * @param {Array} serviceIds Array of service ids
 * @param {Number} startTime Time in UTC milliseconds
 * @param {Number} endTime Time in UTC milliseconds
 * @param {Function} getDummyEvent A dummy event generator function which returns a dummy event object with at least
 * the following fields: serviceId, startTime, endTime, title, eventId
 * @param {String} getDummyEvent.defaultServiceId Service id of the dummy event
 * @param {Number} getDummyEvent.defaultStartTime Start time of the dummy event
 * @param {Number} getDummyEvent.defaultEndTime End time of the dummy event
 * @param {Function} callback Callback function to return the fetched events
 * @param {Array} callback.result Array of events without any gap
 * @param {String} [properties] Optional parameter that lists the desired properties to query for.
 * By default, all properties including tag events will be queried. Specifying the properties may potentially
 * reduce the time to retrieve the data. Only non tag event property names are queried if this parameter is set.
 */
o5.platform.btv.EPG.fetchEventsForGridPage =
function fetchEventsForGridPage (serviceIds, startTime, endTime, getDummyEvent, callback, properties) {
    var me = this;

    // Returned events by fetchEventsByWindow are sorted by ascending startTime and grouped by serviceIds in the same order
    function fetchEventsByWindowCallback(events) {
        var i, e,
            eventsLength = events.length,
            tempArray = [],
            resultAugmentedEvents = [];

        for (i = 0, e = 0; (i < serviceIds.length); i++) {
            tempArray = [];
            for (; e < eventsLength; e++) {
                if (serviceIds[i] === events[e].serviceId) {
                    tempArray.push(events[e]);
                } else {
                    break;
                }
            }
            // Even if tempArray==[], fill that serviceId with dummy events
            resultAugmentedEvents.push(me._augmentEventArrayWithDummyEvents(
                tempArray, startTime, endTime, serviceIds[i], getDummyEvent));
        }

        callback(resultAugmentedEvents);
    }

    if (callback !== undefined && serviceIds.length) {
        this.fetchEventsByWindow(serviceIds, startTime, endTime, fetchEventsByWindowCallback, properties);
    }
};

/**
 * Returns the EPGService object for the currently tuned channel
 * <pre>
 * [Performance Warning]
 * It is more efficient to call getChannelByServiceId() if service id is known.
 * </pre>
 *
 * @method getCurrentlyTunedChannel
 * @param {Object} tuner An instance of the Tuner object. This is available from the Player object.
 * @param {Function} tuner.getCurrentUri This method must exist in the object.
 * @return {Object} EPG service object or null if not found
 */
o5.platform.btv.EPG.getCurrentlyTunedChannel = function getCurrentlyTunedChannel (tuner) {
    var currentUri = tuner.getCurrentUri(),
        i,
        numberOfChannels = this.allChannelList.length;
    if (currentUri) {
        for (i = 0; i < numberOfChannels; i++) {
            if (this.allChannelList[i].uri && this.allChannelList[i].uri === currentUri) {
                return this.allChannelList[i];
            }
        }
    }
    return null;
};

/**
 * Returns a service Id array that has been ordered using the logical channel number
 * @method getServiceIdArraySortedByLCN
 * @return {Array} An array of service ids sorted by ascending logical channel numbers
 */
o5.platform.btv.EPG.getServiceIdArraySortedByLCN = function getServiceIdArraySortedByLCN () {
    var chanArray = this.getAllChannelsOrderedByChannelNumber(),
        serviceIds = [],
        i,
        chanArrayLength = chanArray.length;
    for (i = 0; i < chanArrayLength; i++) {
        serviceIds.push(chanArray[i].serviceId);
    }
    return serviceIds;
};

/**
 * Returns a DVB service Id array that has been ordered using the logical channel number
 * @method getDVBServiceIdArraySortedByLCN
 * @return {Array} Sorted DVB service id array
 */
o5.platform.btv.EPG.getDVBServiceIdArraySortedByLCN = function getDVBServiceIdArraySortedByLCN () {
    var chanArray = this.getDVBChannelsOrderedByChannelNumber();
    return this._createServiceIdArray(chanArray);
};

/**
 * Returns a ISDB service Id array that has been ordered using the logical channel number
 * @method getISDBServiceIdArraySortedByLCN
 * @return {Array} Sorted ISDB service id array
 */
o5.platform.btv.EPG.getISDBServiceIdArraySortedByLCN = function getISDBServiceIdArraySortedByLCN () {
    var chanArray = this.getISDBChannelsOrderedByChannelNumber();
    return this._createServiceIdArray(chanArray);
};

/**
 * Returns a Gateway service Id array that has been ordered using the logical channel number
 * @method getGatewayServiceIdArraySortedByLCN
 * @return {Array} Sorted Gateway service id array
 */
o5.platform.btv.EPG.getGatewayServiceIdArraySortedByLCN = function getGatewayServiceIdArraySortedByLCN () {
    var chanArray = this.getGatewayChannelsOrderedByChannelNumber();
    return this._createServiceIdArray(chanArray);
};

/**
 * Returns an IP service Id array that has been ordered using the logical channel number
 * @method getIPServiceIdArraySortedByLCN
 * @return {Array} Sorted IP service id array
 */
o5.platform.btv.EPG.getIPServiceIdArraySortedByLCN = function getIPServiceIdArraySortedByLCN () {
    var chanArray = this.getIPChannelsOrderedByChannelNumber();
    return this._createServiceIdArray(chanArray);
};

/**
 * Returns a subscribed service Id array that has been ordered using the logical channel number
 * @method getSubscribedServiceIdArraySortedByLCN
 * @return {Array} Sorted subscribed service id array
 */
o5.platform.btv.EPG.getSubscribedServiceIdArraySortedByLCN = function getSubscribedServiceIdArraySortedByLCN () {
    var chanArray = this.getSubscribedChannelsOrderedByChannelNumber();
    return this._createServiceIdArray(chanArray);
};

/**
 * Returns a radio service Id array that has been ordered using the logical channel number
 * @method getRadioServiceIdArraySortedByLCN
 * @return {Array} Sorted radio service id array
 */
o5.platform.btv.EPG.getRadioServiceIdArraySortedByLCN = function getRadioServiceIdArraySortedByLCN () {
    var chanArray = this.getRadioChannelsOrderedByChannelNumber();
    return this._createServiceIdArray(chanArray);
};

/**
 * Returns a TV service Id array that has been ordered using the logical channel number
 * @method getVideoServiceIdArraySortedByLCN
 * @return {Array} Sorted TV service id array
 */
o5.platform.btv.EPG.getVideoServiceIdArraySortedByLCN = function getVideoServiceIdArraySortedByLCN () {
    var chanArray = this.getVideoChannelsOrderedByChannelNumber();
    return this._createServiceIdArray(chanArray);
};

/**
 * Asynchronous version of getEventsByWindow()
 * @method fetchEventsByWindow
 * @async
 * @param {Array} serviceIds Array of service ids that we're interested in
 * @param {Number} startTime Start time in milliseconds
 * @param {Number} endTime End time in milliseconds
 * @param {Function} callback Callback function to be invoked
 * @param {Array} callback.resultArray Array of event objects
 * @param {String} properties Optional parameter that lists the desired properties to query for.
 * By default, all properties including tag events will be queried. Specifying the properties may potentially
 * reduce the time to retrieve the data. Only non tag event property names are queried if this parameter is set.
 */
o5.platform.btv.EPG.fetchEventsByWindow = function fetchEventsByWindow (serviceIds, startTime, endTime, callback, properties) {
    var me = this,
        events = [];

    function externalFetchEventFuncCallback(newEvents) {
        if (newEvents) {
            this.logDebug("externalFetchEventFuncCallback() newEvents.length: " + newEvents.length +
                ", events.length: " + events.length);

            // Skip mapping because newEvents should already be in the same format as events.
            if (me.useRAMCache) {
                o5.platform.btv.EPGCache.cacheEvents(newEvents, null, true);
            }

            events = me.mergeSortedEvents(serviceIds, newEvents, events);
        }
        callback(events);
    }

    if (callback !== undefined) {
        setTimeout(function () {
            if (!me.eventsFromExtSrcOnly) {
                events = me.getEventsByWindow(serviceIds, startTime, endTime, properties);
            }

            if (me.externalFetchEventsFunc) {
                var gapsServiceIds = me.checkEventGap(serviceIds, events, startTime, endTime);
                if (gapsServiceIds.length) {
                    this.logDebug("fetchEventsByWindow() calling externalFetchEventsFunc()" +
                        ", gapsServiceIds.length: " + gapsServiceIds.length);
                    me.externalFetchEventsFunc(gapsServiceIds, startTime, endTime, externalFetchEventFuncCallback);
                } else {
                    callback(events);
                    return;
                }
            } else {
                callback(events);
                return;
            }
        }, 1);
    }
};

/**
 * Asynchronous version of getCurrentEventForService()
 * @method fetchCurrentEventForService
 * @async
 * @param {String} serviceId Service id of the channel we're interested in
 * @param {Function} callback Callback function to be invoked
 * @param {Object} callback.result EPG event object
 */
o5.platform.btv.EPG.fetchCurrentEventForService = function fetchCurrentEventForService (serviceId, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getCurrentEventForService(serviceId));
        }, 1);
    }
};

/**
 * Asynchronous version of getNextEventForService()
 * @method fetchNextEventForService
 * @async
 * @param {String} serviceId Service id of the channel we're interested in
 * @param {Function} callback Callback function to be invoked
 * @param {Object} callback.result EPG event object
 */
o5.platform.btv.EPG.fetchNextEventForService = function fetchNextEventForService (serviceId, callback) {
    var me = this;
    if (callback !== undefined) {
        setTimeout(function () {
            callback(me.getNextEventForService(serviceId));
        }, 1);
    }
};

/**
 * @method fetchPreviousEventForService
 * @removed
 */

/**
 * @method fetchEventsForChannelWithDummyEvents
 * @removed
 */

/**
 * Determines if a given service represents a radio channel
 *
 * @method isRadioChannel
 * @param {Object} service EPG service object
 * @return {Boolean} True if the service is a radio channel
 */
o5.platform.btv.EPG.isRadioChannel = function isRadioChannel (service) {
    var i;

    if (service) {
        for (i = this.radioServiceTypesIds.length - 1; i >= 0; i--) {
            if (service.serviceType === this.radioServiceTypesIds[i]) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Registers a callback method that will be invoked whenever the `refresh` method of this class
 * is called.
 *
 * @method registerRefreshCallback
 * @param {Function} callback Callback function to be invoked
 * @param {Object} context The calling context
 */
o5.platform.btv.EPG.registerRefreshCallback = function registerRefreshCallback (callback, context) {
    if (callback && context) {
        this.refreshCallbacks.push({
            callbackFunction: callback,
            caller: context
        });
    }
};

/**
 * Unregisters the callback that was registered using `registerRefreshCallback`
 *
 * @method unregisterRefreshCallback
 * @param {Function} callback Callback function to be removed
 * @param {Object} context The calling context
 */
o5.platform.btv.EPG.unregisterRefreshCallback = function unregisterRefreshCallback (callback, context) {
    if (callback) {
        var i;
        for (i = 0; i < this.refreshCallbacks.length; i++) {
            if (this.refreshCallbacks[i].callbackFunction === callback && this.refreshCallbacks[i].caller === context) {
                this.refreshCallbacks.splice(i, 1);
            }
        }
    }
};

/**
 * Registers a callback method that will be invoked whenever the service update method of this class
 * is called.
 *
 * @method registerSvlUpdateCallback
 * @param {Function} callback Callback function to be invoked
 */
o5.platform.btv.EPG.registerSvlUpdateCallback = function registerSvlUpdateCallback (callback) {
    o5.platform.btv.PersistentCache.addEPGServicesUpdatedListener(callback);
};

/**
 * Unregister the callback that was registered using `registerSvlUpdateCallback`
 *
 * @method unregisterSvlUpdateCallback
 * @param {Function} callback Callback function to be removed
 */
o5.platform.btv.EPG.unregisterSvlUpdateCallback = function unregisterSvlUpdateCallback (callback) {
    o5.platform.btv.PersistentCache.removeEPGServicesUpdatedListener(callback);
};

/**
 * @method monitorStartOfEvents
 * @removed
 */

/**
 * @method unmonitorStartOfEvents
 * @removed
 */

/**
 * @method setEventStartCallback
 * @deprecated Don't use, does nothing
 */
o5.platform.btv.EPG.setEventStartCallback = function setEventStartCallback () {
    this.logDeprecated();
};

/**
 * @method populateChannelLogos
 * @deprecated Don't use, does nothing
 */
o5.platform.btv.EPG.populateChannelLogos = function populateChannelLogos () {
    this.logDeprecated();

};

/**
 * Checks to see if any services are available yet
 * @method isChannelListPopulated
 * @return {Boolean} True if the service list has been populated
 */
o5.platform.btv.EPG.isChannelListPopulated = function isChannelListPopulated () {
    if (this.allChannelList.length > 0) {
        return true;
    } else {
        return false;
    }
};

/**
 * @method getEventPromoImage
 * @deprecated Don't use, does nothing
 */
o5.platform.btv.EPG.getEventPromoImage = function getEventPromoImage () {
    this.logDeprecated();
};

/**
 * @method augmentEventArrayWithDummyEvents
 * @removed goto private API
 */

/**
 * If requestExtSrc is true, fetchEventsByWindow() will only fetch events from external source
 * instead of from PersistentCache or EPGCache.
 * @method setEventsFromMDS
 * @param {Boolean} requestExtSrc If true, fetchEventsByWindow() will only fetch events from external
 * source instead of from PersistentCache or EPGCache. Application needs to call
 * registerExternalFetchEventsFunc() before fetching events.
 */
o5.platform.btv.EPG.setEventsFromMDS = function setEventsFromMDS (requestExtSrc) {
    this.eventsFromExtSrcOnly = requestExtSrc;
};

/**
 * Register external fetch events function to be called in fetchEventsByWindow().
 * The new events returned in func.callback.events should already be mapped and in the
 * same format as PersistentCache and EPGCache.
 * @method registerExternalFetchEventsFunc
 * @param {Function} func External fetch events function
 * @param {Array} func.serviceIds Array of service ids to fetch events
 * @param {Number} func.startTime startTime Start time in milliseconds
 * @param {Number} func.endTime End time in milliseconds
 * @param {Function} func.callback Callback to be called with fetched events
 * @param {Array} func.callback.events Callback to be called with fetched events
 */
o5.platform.btv.EPG.registerExternalFetchEventsFunc = function registerExternalFetchEventsFunc (func) {
    if (func instanceof Function) {
        this.externalFetchEventsFunc = func;
    }
};

/**
 * @method getMappedEventForSplitSI
 * @deprecated Don't use
 * @param {Object} eventObject EPG event object
 * @param {String} serviceId Service id
 * @return {Object} Returns mapped object
 */
o5.platform.btv.EPG.getMappedEventForSplitSI = function getMappedEventForSplitSI (eventObject, serviceId) {
    var mappedObj = {};
    if (eventObject.eventId) {
        mappedObj.eventId = serviceId.concat(parseInt(eventObject.eventId, 10).toString(16)); //eventObject.eventId.toString();
        mappedObj.serviceId = serviceId;
        mappedObj.sourceId = o5.data.EPGEvent.SOURCE.MDS;
        mappedObj.startTime = eventObject.period.start * 1000;
        mappedObj.endTime = eventObject.period.end * 1000;
        mappedObj.title = eventObject.Title;
        mappedObj.shortDesc = eventObject.Description;
        mappedObj.longDesc = eventObject.Synopsis;
        mappedObj.parentalRating = eventObject.Rating.precedence;
        mappedObj.privateRating = eventObject.Rating.precedence;
    }
    return mappedObj;
};

/**
 * Register data source. This must be called before using getIPServiceData().
 * @method registerDataSource
 * @param {Object} dataSource Data source object
 * @param {String} sourceType Source type, be one of `DATA_SOURCE_TYPE`
 * @param {String} [cacheType=RAM] Cache type, be one of `CACHE_TYPES`
 * @param {Boolean} [cacheEvents=true] Enable/disable caching of events
 */
o5.platform.btv.EPG.registerDataSource = function registerDataSource (dataSource, sourceType, cacheType, cacheEvents) {
    var ramCache = false,
        cacheEvent = true;

    if (cacheType === this.CACHE_TYPES.RAM) {
        ramCache = true;
        this.useRAMCache = true;
        // Set this only if RAM caching is enabled
        this._setCacheHouseKeeping();
    }

    if (typeof cacheEvents === "boolean") {
        cacheEvent = cacheEvents;
    }

    if (sourceType === this.DATA_SOURCE_TYPE.SDP) {
        this.dataSourceSdp = {
            sdp: dataSource,
            forceRAMCache: ramCache,
            cacheEvents: cacheEvent
        };
    }
};

/**
 * Get IP service data from a registered data source. registerDataSource() should be called prior
 * to calling this.
 * @method getIPServiceData
 * @param {String} sourceType Source type, be one of `DATA_SOURCE_TYPE`
 * @param {Object} [configuration] Configuration depending on the source type
 * @param {String} [configuration.locale=en_gb] The user's locale.
 * @param {Number} [configuration.refreshInterval=12] Time in hours after which EPG data must be refreshed.
 * @param {Number} [configuration.maxDays=7] Number of days for which EPG data must be fetched.
 * @param {Number} [configuration.fetchDuration=2] Time in hours for which EPG data must be fetched.
 * @return {Boolean} Returns true if successful, otherwise false.
 */
o5.platform.btv.EPG.getIPServiceData = function getIPServiceData (sourceType, configuration) {

    if (sourceType === this.DATA_SOURCE_TYPE.SDP) {
        var locale = "en_gb",
            refreshInterval = 12,
            maxDays = 7,
            fetchDuration = 2;

        if (configuration) {
            locale = configuration.locale || locale;
            refreshInterval = configuration.refreshInterval || refreshInterval;
            maxDays = configuration.maxDays || maxDays;
            fetchDuration = configuration.fetchDuration || fetchDuration;
        }

        return this._getSDPServiceData(locale, refreshInterval, maxDays, fetchDuration);
    }

    return false;
};


// Add _init() to array for o5.$.init2() to call when O5 starts up.
o5.$.init2Callbacks.push(o5.platform.btv.EPG._init);

// Uncomment to turn debugging on for EPG object
// o5.log.setAll(o5.platform.btv.EPG, true);
