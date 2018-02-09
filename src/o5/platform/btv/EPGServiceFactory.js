/**
 * EPGServiceFactory maps EPG service object(s) retrieved from CCOM to that
 * defined in o5.data.EPGService
 *
 * @class o5.platform.btv.EPGServiceFactory
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.btv.EPGServiceFactory = new (function EPGServiceFactory () {
    this.customProperties = [];
    this.customMappingFunc = null;
})();

/**
 * Map service tags to O5.js format. Often time, the service tags vary from network to network. If the service
 * tags differ from what is defined in this method, the application should override this method.
 * @method _mapServiceTag
 * @private
 * @param {Object} mapped Mapped (JS) service object
 */
o5.platform.btv.EPGServiceFactory._mapServiceTag = function _mapServiceTag (mapped) {
    mapped.parentalRating = (mapped.serviceTags && mapped.serviceTags.rating) ? mapped.serviceTags.rating : null;
    mapped.locale = (mapped.serviceTags && mapped.serviceTags.locale) ? mapped.serviceTags.locale : null;
    mapped.startOverSupport = (mapped.serviceTags && mapped.serviceTags.startOverSupport) ? mapped.serviceTags.startOverSupport : false;
    mapped.catchUpSupport = (mapped.serviceTags && mapped.serviceTags.catchUpSupport) ? mapped.serviceTags.catchUpSupport : false;
    mapped.nPvrSupport = (mapped.serviceTags && mapped.serviceTags.nPvrSupport) ? mapped.serviceTags.nPvrSupport : false;
    mapped.logo = (mapped.serviceTags && mapped.serviceTags.promoImage) ? mapped.serviceTags.promoImage : null;
};

/**
 * Retrieves the specified tag object or value for the given serviceId.
 * Tagging refers to the concept of adding enhanced metadata to existing Service or Event entries.
 * Retrieving tag for service allows the application to access extra metadata that is not accessible in
 * `mapObject`. There is no standard format, as it is network configurable.
 * @method _getTagForService
 * @private
 * @param {String} serviceId Unique service identifier
 * @param {String} [tag] Optional tag field name
 * @return {Object|String|Number} Returns tag object if `tag` is unspecified. Otherwise, the tag value if found.
 * If nothing is found, null is returned.
 */
o5.platform.btv.EPGServiceFactory._getTagForService = function _getTagForService (serviceId, tag) {
    var tags = CCOM.EPG.getTagsByServiceId(serviceId),
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
 * Maps a service object from the platform to that defined in o5.data.EPGService.
 * If the service properties differ from what is defined in this method, the application should call
 * registerCustomMappingFunc() to mapping more properties at the end of mapObject().
 * @method mapObject
 * @param {Object} obj Service object to be mapped
 * @param {Boolean} [skipServiceTags=false] Optional parameter to skip querying and mapping of service tags
 * @return {Object} Mapped service object
 */
o5.platform.btv.EPGServiceFactory.mapObject = function mapObject (obj, skipServiceTags) {
    if (!obj) {
        return null;
    }

    var mapped = new o5.data.EPGService(obj),
        i, prop,
        customPropLength = this.customProperties.length;

    mapped.serviceId = obj.serviceId;
    mapped.logicalChannelNum = obj.channelKey;
    mapped.serviceType = obj.type;
    mapped.deliveryMethod = o5.data.EPGService.DELIVERY_TYPE.DVB;
    mapped.serviceName = obj.name;
    mapped.uri = obj.uri;
    mapped.isSubscribed = obj.isSubscribed;
    mapped.casId = obj.naspCA;
    mapped.access = obj.access;

    if (!skipServiceTags) {
        mapped.serviceTags = this._getTagForService(obj.serviceId) || null;
    } else {
        mapped.serviceTags = null;
    }
    this._mapServiceTag(mapped);

    /* Legacy support, to be removed... */
    mapped.channelKey = mapped.logicalChannelNum;
    mapped.name = mapped.serviceName;
    mapped.type = mapped.serviceType;
    mapped.naspCA = mapped.casId;
    mapped.promoImage = mapped.logo;
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
 * Maps an array of service objects from the platform to that defined in
 * o5.data.EPGService
 * @method mapArray
 * @param {Array.<Object>} array Array of service objects to be mapped
 * @param {Boolean} [skipServiceTags=false] Optional parameter to skip querying and mapping of service tags
 * @return {Object} Mapped array of service objects
 */
o5.platform.btv.EPGServiceFactory.mapArray = function mapArray (array, skipServiceTags) {
    var i,
        mapped,
        mappedArray = [];

    if (array && array.length) {
        for (i = 0; i < array.length; i++) {
            mapped = this.mapObject(array[i], skipServiceTags);
            mappedArray.push(mapped);
        }
    }

    return mappedArray;
};

/**
 * Add custom service properties to be mapped in mapObject()
 * @method setCustomProperties
 * @deprecated use registerCustomMappingFunc()
 * @param {Array.<String>} customPropertyArray Array of custom property string
 */
o5.platform.btv.EPGServiceFactory.setCustomProperties = function setCustomProperties (customPropertyArray) {
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
o5.platform.btv.EPGServiceFactory.registerCustomMappingFunc = function registerCustomMappingFunc (func) {
    if (func instanceof Function) {
        this.customMappingFunc = func;
    }
};

// uncomment to turn debugging on for EPGServiceFactory object
// o5.log.setAll(o5.platform.btv.EPGServiceFactory, true);
