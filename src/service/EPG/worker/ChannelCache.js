/**
 * @class ChannelCache
 * @service
 * @worker
 * ChannelCache - to cache services from MDS and perform business logic on channel lineup
 */

self.importScripts(
	"../../../namespace.js",
	"../../MDS/Channel.js"
);

var channelCache = [];

/**
 * @method cacheDVBChannels
 */
function cacheChannels(config) {
	if (config && config.channels) {
		config.channels.forEach(function (channel) {
			channelCache.push(channel);
		});
	}
}

function fetchMDSChannels() {

}

/**
 * @method messageReceived
 */
function messageReceived(e) {
	var cmd = e.data.cmd,
		config = e.data.config;

	switch (cmd) {
		case "cache":
			cacheChannels(config);
			fetchMDSChannels();
			break;
		// case "window:get":
		// 	getWindow(config);
		// 	break;
		// case "countwindow:get":
		// 	getCountWindow(config);
		// 	break;
	}

	self.postMessage({cmd: "TestReceived", desc: "Over and out"});
}

self.addEventListener("message", messageReceived);
