/**
 * The EPGService Object is returned by EPG queries that request data for TV channels. `o5.platform.btv.EPGServiceFactory`
 * is an example class that returns objects conforming to the structure defined here.
 *
 * @class o5.data.EPGService
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */
o5.data.EPGService = function EPGService (source)
{
	this._source = source;
};

/**
 * Enumeration of service type.
 * @static
 * @property {Number} SERVICE_TYPE
 */
o5.data.EPGService.SERVICE_TYPE = {
    TV: 		 1,
    RADIO: 		 2,
    TELETEXT:    3,
    DATA: 		 4,
    OTHER: 		 5,
    TV_HD:     	17
};

/**
 * Enumeration of service delivery type.
 * @readonly
 * @static
 * @property {Number} DELIVERY_TYPE
 */
o5.data.EPGService.DELIVERY_TYPE = {
    DVB:     	1,
    IP:      	2,
    GATEWAY:	3
};

/**
 * The unique identifier for this service.
 * @property {String} serviceId
 */

/**
 *  The channel number to be presented to the user.
 *  @property {Number} logicalChannelNum
 */

/**
 * Describes the type of service, typically one of `o5.data.EPGService.SERVICE_TYPE`.
 * However, other values are possible as it is network configurable.
 * @property {Number|String} serviceType
 */

/**
 * Describes how the service is delivered, one of
 * `o5.data.EPGService.DELIVERY_TYPE` enumeration.
 * @property {Number} deliveryMethod
 */

/**
 * The name of the service to be presented to the user.
 * @property {String} serviceName
 */

/**
 * The source URI, used to tune to the service.
 * @property {String} uri
 */

/**
 * True if a user has access to this service as defined by their subscriptions.
 * @property {Boolean} isSubscribed
 */

/**
 * The identifier used to match the service to the conditional access system.
 * @property {String} casId
 */

/**
 * Service access permission (i.e. FREE).
 * @property {String} access
 */

/**
 * Service tag object or null if unavailable.
 * @property {Object} serviceTags
 */

/**
 * The minimum age required to watch this service.
 * @property {String} parentalRating
 */

/**
 * Service locale (language and region).
 * @property {String} locale
 */

/**
 * True if the channel supports start over events.
 * @property {Boolean} startOverSupport
 */

/**
 * True if the channel supports catch up events.
 * @property {Boolean} catchUpSupport
 */

/**
 * Indicates if the service is NPVR enabled. This property has precedence over the event level isnPvr property.
 * @property {Boolean} nPvrSupport
 */

/**
 * The URL of the channel logo.
 * @property {String} logo
 */
