/**
 * The EPGEvent Object is returned by EPG queries that request data for a TV channel. `o5.platform.btv.EPGEventFactory`
 * is an example class that returns objects conforming to the structure defined here.
 *
 * @class o5.data.EPGEvent
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */
o5.data.EPGEvent = function EPGEvent (source)
{
	this._source = source;
};

/**
 * Enumeration of EPG event source.
 * @readonly
 * @static
 * @property {String} SOURCE
 */
o5.data.EPGEvent.SOURCE = {
    EIT: 		"E",
    SDP: 		"S",
    MDS: 		"S",
    GATEWAY: 	"G"
};

/**
 * The unique identifier for the event.
 * @property {String} eventId
 */

/**
 * The service that the events belong to.
 * @property {String} serviceId
 */

/**
 * The start time of the event in UTC milliseconds.
 * @property {Number} startTime
 */

/**
 * The end time of the event in UTC milliseconds.
 * @property {Number} endTime
 */

/**
 * The title of the event/program.
 * @property {String} title
 */

/**
 * A short description of the event.
 * @property {String} shortDesc
 */

/**
 * A full description of the event.
 * @property {String} longDesc
 */

/**
 * The id of the series.
 * @property {String} seriesId
 */

/**
 * The id of the episode.
 * @property {String} episodeId
 */

/**
 * The id of the season.
 * @property {String} seasonId
 */

/**
 * The name of the series.
 * @property {String} seriesName
 */

/**
 * Describes how the event is sourced, one of
 * `o5.data.EPGEvent.SOURCE` enumeration.
 * @property {String} sourceId
 */

/**
 * The definition of the event.
 * i.e. "SD", "HD", "3D"
 * @property {String} definition
 */

/**
 * The minimum age for allowed viewing.
 * @property {String} parentalRating
 */

/**
 * Event tag object or null if unavailable.
 * @property {Object} eventTags
 */

/**
 * Returns the URL of the promotional image for the event.
 * @property {String} promoImage
 */

/**
 * Indicates if the event can be NPVR recorded.
 * @property {Boolean} isnPvr
 */

/**
 * Defines if the event supports start over.
 * @property {Boolean} startOverSupport
 */

/**
 * Defines if the event supports catch up.
 * @property {Boolean} catchUpSupport
 */

/**
 * The year the event was filmed..
 * @property {String} year
 */
