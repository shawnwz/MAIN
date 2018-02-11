/**
 * @class Event
 */
"use strict";

$service.EPG.Event = (function Event () {

	var _batchOngoing = false;

	/**
	 * generate count place holder events for given timeslot
	 */
	function _getPlaceHolderEvents (service, startTime, stopTime, count) {
		var promise,
			holderCount = count;

		if (!service || !service.serviceId  || !startTime) { // invalid: reject
			promise = Promise.reject([]);
		} else {
			promise = new Promise(function (resolve, reject) {

				var events = [],
					duration = 3600 * 1000, // two hours placeholders
					serviceId = service.serviceId,
					progStart = startTime - (startTime % (3600 * 1000)), // round to last whole hr
	
					__getEvent = function (eventId, progStartTime) {
						return {
							channel      : serviceId,
							channelTag   : serviceId,
							contentType  : "TV_NO_EPS",
							description  : $util.Translations.translate("epgNoEventDescription"),
							displayName  : $util.Translations.translate("epgNoEventName"),
							synopsis     : $util.Translations.translate("epgNoEventSynopsis"),
							title        : $util.Translations.translate("epgNoEventTitle"),
							duration     : duration,
							eventId      : eventId,
							id           : eventId,
							progStartDate: progStartTime,
							progEndDate  : progStartTime + duration,
							programId    : eventId,
							serviceId    : "BID",
							source       : "MDS",
							sourceId     : "E"
						};
					};
								
				// if have starttime and stoptime, create evente between times
				if (startTime > 0 && stopTime > 0 && startTime < stopTime) {
					while (progStart < stopTime) {
						events.push(__getEvent("ID" + serviceId + progStart, progStart));
						progStart += duration;
					}
				} else if (holderCount > 0) {
					// if count positive: create place holders after given start time
					while (holderCount > 0) {
						events.push(__getEvent("ID" + serviceId + progStart, progStart));
						progStart += duration;
						holderCount--;
					}
				} else if (holderCount < 0) {
					// if count negative: create place holders before given start time
					while (holderCount < 0) {
						progStart -= duration;
						events.unshift(__getEvent("ID"  + serviceId + progStart, progStart));
						holderCount++;
					}
				}
				if (events && events.length > 0) {
					resolve(events.map($service.Map.generic));
				} else {
					reject([]);
				}
			});
		}
		return promise;
	}

	/**
	 * @method _cacheEvents
	 */
	function _cacheEvents (service, data) {
		var promise,
			failedNb = 0,
			okayNb = 0;

		if (!service || !service.serviceId  || !data || data.length === 0) { // invalid (dont reject, it will never succeed)
			promise = Promise.resolve(data);
		} else {
			promise = new Promise(function (resolve, reject) {
				o5.platform.btv.PersistentCache.beginBatch();

				data.forEach(function (programme) {
					programme.serviceId = service.serviceId; // add serviceId

					o5.platform.btv.PersistentCache.cacheEvent({
							_data: programme
						},
						function countCallBack (arg) {
							if (arg === 1 || arg === true) {
								okayNb++;
							} else {
								failedNb++;
							}
							if (okayNb + failedNb >= data.length) {
								resolve(okayNb);
							}
						}
					);
				});
			}).then(function (okayNum) {
				o5.platform.btv.PersistentCache.commitBatch();
				console.log("Cached " + okayNum + " of " + data.length + " programmes for " + service.serviceId + " in Persistent cache");
				return data;
			},
			function (result) {
				o5.platform.btv.PersistentCache.cancelBatch();
				console.warn("Failed to CACHE programme for [" + service.serviceId + "] from MDS", result);
				return data;
			});
		}
		return promise;
	}

	/**
	 * get 36hrs of events for given service from MDS and cache it
	 */
	function _getMDSEvents (service, startTime, stopTime) {
		var promise,
			progStartTime,
			progStopTime;

		if ($service.MDS.useDummyData) { // dont use real query
			promise = Promise.reject([]);
		} else if (!service || !service.serviceId || !startTime) { // invalid: reject
			promise = Promise.reject([]);
		} else {
			progStartTime = startTime - (12 * 3600 * 1000);
			progStopTime = (stopTime ? stopTime : startTime) + (24 * 3600 * 1000);

			promise = $service.MDS.Programme.fetch(service, progStartTime, progStopTime).then(function (data) { // got it: cache it
				console.log("Got " + data.length + " programmes for [" + service.serviceId + "] from MDS");
				return _cacheEvents(service, data);
			},
			function (data) { // failed to fetch from MDS
				console.warn("Failed to get programmes for [" + service.serviceId + "] from MDS", data);
				return [];
			});
		}
		return promise;
	}

	/**
	 * get events for given timeslot from Persistent Cache
	 */
	function _getCachedEventsByTime (service, startTime, stopTime) {
		var promise;

		if (!service || !service.serviceId  || !startTime || !stopTime || (stopTime < startTime)) { // invalid (dont reject, it will never succeed)
			promise = Promise.resolve([]);
		} else {
			promise = new Promise(function (resolve, reject) {
				var events = o5.platform.btv.PersistentCache.getEventByTime(service.serviceId, startTime, stopTime);

				if (events && events.length > 0) {
					// console.log("_getCachedEventsByTime(): "+events.length);
					resolve(events);
				} else {
					reject([]);
				}
			});
		}
		return promise;
	}

	function _getMDSEventsByTime (data, startTime, stopTime) {
		var promise;

		if (!data || !startTime || !stopTime || (stopTime < startTime)) { // invalid (dont reject, it will never succeed)
			promise = Promise.resolve([]);
		} else {
			promise = new Promise(function (resolve, reject) {
				var events = [],
					length = data.length;

				for (var i = 0; i < length; i++) {
					if (data[i].startTime <  stopTime && data[i].endTime > startTime) {
						events.push(data[i]);
					}
				}

				if (events && events.length > 0) {
					// console.log("_getCachedEventsByCount(): "+events.length);
					resolve(events);
				} else {
					reject([]);
				}
			});
		}
		return promise;
	}

	/**
	 * get number of events for given time from Persistent Cache
	 */
	function _getCachedEventsByCount (service, time, count) {
		var promise;

		if (!service || !service.serviceId || !time || !count) { // invalid (dont reject, it will never succeed)
			promise = Promise.resolve([]);
		} else {
			promise = new Promise(function (resolve, reject) {
				var events = o5.platform.btv.PersistentCache.getEventByCount(service.serviceId, time, count);

				if (events && events.length > 0) {
					// console.log("_getCachedEventsByCount(): "+events.length);
					resolve(events);
				} else {
					reject([]);
				}
			});
		}
		return promise;
	}

	function _getMDSEventsByCount (data, time, count) {
		var promise;

		if (!data || !time || !count) { // invalid (dont reject, it will never succeed)
			promise = Promise.resolve([]);
		} else {
			promise = new Promise(function (resolve, reject) {
				var events = [],
					length = data.length,
					i = 0;

				if (count < 0) {
					for (i = 0; (i < length && events.length < Math.abs(count)); i++) {
						if (data[i].endTime <=  time) {
							events.push(data[i]);
						}
					}
				} else if (count > 0) {
					for (i = 0; (i < length && events.length < count); i++) {
						if (data[i].endTime >  time) {
							events.push(data[i]);
						}
					}
				}

				if (events && events.length > 0) {
					// console.log("_getCachedEventsByCount(): "+events.length);
					resolve(events);
				} else {
					reject([]);
				}
			});
		}
		return promise;
	}

	/**
	 * Try to get events from Persistent Cache and if that fails get them from MDS and cache them. Then try to get them from cache again
	 */
	function getEventsByTime (service, startTime, stopTime, withHolder) {
		var promise;

		if (!service || !service.serviceId  || !startTime || !stopTime || (stopTime < startTime)) { // invalid: reject
			promise = Promise.reject([]);
		} else {
			promise = _getCachedEventsByTime(service, startTime, stopTime).then(function (data) { // got cached events: done
				// console.log("Got "+data.length+" programmes for ["+service.serviceId+"] from Persistent cache");
				return data;
			},
			function (data) { // no cached events: try to fetch from MDS

				console.warn("Failed to get programmes for [" + service.serviceId + "] from Persistent cache: try MDS");
				return _getMDSEvents(service, startTime, stopTime).then(function (data) { // got MDS events and they are cached: try cache again
							//console.log("Cached "+data.length+" programmes for ["+service.serviceId+"] in Persistent cache");
							return _getMDSEventsByTime(data, startTime, stopTime);
						}).catch(function (data) { // most likely MDS didnt have the events either
							console.warn("Failed to get newly cached programmes for [" + service.serviceId + "] in Persistent cache", data);
							return [];
						});

			}).then(function (data) {
				if (data.length === 0) { // final step: did we get any events?
					if (withHolder) {
						console.warn("No events: get placeholder events for [" + service.serviceId + "]");
						return _getPlaceHolderEvents(service, startTime, stopTime, -1);
					}
				}
				return data;
			}).catch(function (data) {
				console.warn("Catch: Failed to get programmes for [" + service.serviceId + "]", data);
				return [];
			});
		}
		return promise;
	}
	
	/**
	 * Try to get events from Persistent Cache and if that fails get them from MDS and cache them. Then try to get them from cache again
	 */
	function getEventsByCount (service, time, count, withHolder) {
		var promise;

		if (!service || !service.serviceId || !time || !count) { // invalid (dont reject, it will never succeed)
			promise = Promise.resolve([]);
		} else {
			promise = _getCachedEventsByCount(service, time, count).then(function (data) { // got cached events: done
				// console.log("Got "+data.length+" programmes for ["+service.serviceId+"] from Persistent cache");
				return data;
			},
			function(data) { // no cached events: try to fetch from MDS

				console.warn("Failed to get programmes for [" + service.serviceId + "] from Persistent cache: try MDS");
				return _getMDSEvents(service, time).then(function (data) { // got MDS events and they are cached: try cache again
							console.log("Cached " + data.length + " programmes for [" + service.serviceId + "] in Persistent cache");
							return _getMDSEventsByCount(data, time, count);
						}).catch(function (data) { // most likely MDS didnt have the events either
							console.warn("Failed to get newly cached programmes for [" + service.serviceId + "] in Persistent cache", data);
							return [];
						});

			}).then(function (data) {
				if (data.length === 0) { // final step: did we get any events?
					if (withHolder) {
						console.warn("No events: get placeholder events for [" + service.serviceId + "]");
						return _getPlaceHolderEvents(service, time, -1, count);
					}
				}
				return data;
			}).catch(function (data) {
				console.warn("Catch: Failed to get programmes for [" + service.serviceId + "]", data);
				return [];
			});
		}
		return promise;
	}

	/**
	 * @method init
	 */
	function init () {
		// register custom mapping function which maps everything back which was removed
		o5.platform.btv.EPGEventFactory.registerCustomMappingFunc(function (mapped, obj) {
			for (var key in obj) {
		        if (obj.hasOwnProperty(key)/* && !mapped.hasOwnProperty(key)*/) {
		        	mapped[key] = obj[key];
		        }
			}
			$service.Map.generic(mapped);
		});

		o5.platform.btv.PersistentCache.registerCustomEventMappingFunc(function (mapped, obj) {

		});
	}

	return {
		init   : init,
		byTime : getEventsByTime,
		byCount: getEventsByCount
	};
}());
