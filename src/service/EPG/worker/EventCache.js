/**
 * @class EventCache
 * EventCache - to cache events from MDS
 */

// TODO: remove this line (this is to prevent stubbed functions causing issues in build)
/* eslint no-unused-vars: off */

var cache = {};

/**
* @method clearCache
*/
function clearCache() {
	cache = {};
}

/**
* @method cacheEvents
*/
function cacheEvents(config) {
	// TODO: FP1-229 - Cache events here

	clearCache();
	self.postMessage({cmd: "cache:done", cache: cache}); // debug only pass cache
	// self.postMessage({cmd: "CacheDone"});
}

/**
* @method getWindow
*/
function getWindow(config) {
	var events = o5.platform.btv.EPG.getEventsByWindow(config.channels, config.startTime*1000, config.endTime*1000);

	self.postMessage({
		cmd: "window:done",
		events: events
	});
}

/**
* @method getCountWindow
*/
function getCountWindow(config) {
	var events = {},
		channels = config.channels,
		time = config.time,
		countAfter = config.countAfter,
		countBefore = config.countBefore;

	var events = [], 
		ev = o5.platform.btv.EPG.getEventByTime(config.channels[0], config.time);

	events.push(ev);
		
	for (i=0; i<config.countBefore; i++) {
		ev = getEventPrevious(ev.eventId);
		events.unshift(ev);
	}
	for (i=0; i<config.countAfter; i++) {
		ev = getEventNext(ev.eventId);
		events.push(ev);
	}

	self.postMessage({
		cmd: "countwindow:done",
		events: events
	});
}

/**
* @method messageReceived
*/
function messageReceived(e) {
	var cmd = e.data.cmd,
		config = e.data.config;

	switch (cmd) {
		case "cache":
			cacheEvents(config);
			break;
		case "window:get":
			getWindow(config);
			break;
		case "countwindow:get":
			getCountWindow(config);
			break;
	}
}

self.addEventListener("message", messageReceived);
