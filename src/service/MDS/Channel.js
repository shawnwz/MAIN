"use strict";

$service.MDS.Channel = (function Channel() {

	/* global console: true*/

	var _cache = {}, testSOList;
	var cachedChannels = [];

	var testSOList = [ //@hdk: temp only!!!
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON149191/ON149191.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON155470/ON155470.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON156318/ON156318.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON161690/ON161690.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON167295/ON167295.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON168750/ON168750.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON172225/ON172225.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON174590/ON174590.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON175789/ON175789.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON176758/ON176758.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON182984/ON182984.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON185574/ON185574.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON185599/ON185599.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON185601/ON185601.ism/manifest",
		"http://test-vod-st1.content.foxtel.com.au/mount1/nagradrop/hdvod/ON185602/ON185602.ism/manifest"
	];

	/**
	 * @method _fetchDummies
	 */
	function _fetchDummies() {
		var url = "./service/MDS/Dummy/Channels.json";
		console.log("Use dummy channels");
		return $util.fetch(url, $service.MDS.config.timeout);
	}
	

	/**
	 * @method _fetchData
	 */
	function _fetchData() {

		var config = {};

		config.command = $service.MDS.COMMANDS.EPG.services;
		config.filter = {
			"technical.deviceType": "iQ3-HD",
			"technical.shortName" : {
				"$regex": "_SO$"
			},
			"technical.NetworkLocation": {
				"$regex": "^http"
			}
		};
		config.fields = [
			"locale",
			"editorial.id",
			"editorial.provider",
			"editorial.Title",
			"editorial.Rating",
			"technical.drmId",
			"technical.catchUpSupport",
			"technical.tvChannel",
			"technical.id",
			"technical.type",
			"technical.Title",
			"technical.mainChannelId",
			"technical.NetworkLocation",
			"technical.Categories"
		];
		config.limit = 9999;

		return $service.MDS.Base.fetch(config);
	}

	/**
	 * @method _mapData
	 */
	function _mapData(data) {
		return new Promise(function mapDataPromise(resolve, reject) {
			if (data && data.services && data.services.length > 0) {
				resolve(data.services.map($service.MDS.Map.channel));
			} else {
				reject([]);
			}
		});
	}


	/**
	 * @method _cacheService
	 */
	function _cacheService(service) {
		return new Promise(function(resolve, reject) {
			o5.platform.btv.PersistentCache.cacheService({
					_data: service
				},
				function(arg) {
					if (arg === true || arg === 1) {
						resolve();
					} else {
						reject(arg);
					}
				}
			)
		});
	}
	
	/**
	 * @method _cacheData
	 */
	function _cacheData(data) {
		var promise = null,
			promises = [];

		cachedChannels = [];

	  o5.platform.btv.PersistentCache.beginBatch();

		if (data && data.length > 0) {
			data.forEach(function (service, i, array) {
				cachedChannels.push(service);
				promises.push(_cacheService(service));
			});
		}

		return Promise.all(promises)
			.then(function (allData) {
							o5.platform.btv.PersistentCache.commitBatch();
							console.log("cached " + data.length + " channels from MDS");
							return data;
						},
						function(data) {
                            o5.platform.btv.PersistentCache.cancelBatch();
							console.log("Failed to cache channels from MDS", data);
							return [];
						});
	}
	
	/**
	 * @method _fetchChannelsNfy
	 */
	function _fetchChannelsNfy() {

		var fetch = $service.MDS.useDummyData ? _fetchDummies : _fetchData;

		fetch()
			.then(_mapData,
						function(data) {
							console.log("Failed to fetch channels from MDS", data);
							return [];
						})
			.then(_cacheData,
						function(data) {
							console.log("Failed to map channels from MDS", data);
							return [];
						})
			.then(function(data) {
							console.log("service:MDS:channel:fetched");
							$util.Events.fire("service:MDS:channel:fetched", data);
						},
						function(data) {
							console.log("Failed to cache channels from MDS", data);
							return [];
						});
	}

	
	/**
	 * @method init
	 */
	function init() {
		$util.Events.on("service:MDS:channel:fetch", _fetchChannelsNfy, this);

		// register custom mapping function which maps everything back which was removed
		o5.platform.btv.EPGServiceFactory.registerCustomMappingFunc(function(mapped, obj) {
			for (var key in obj) {
        if (obj.hasOwnProperty(key)/* && !mapped.hasOwnProperty(key)*/) {
					mapped[key] = obj[key];
        }
			}
		});
	}


	/**
	 * @method getForChannelId
	 * @param {String} channelId
	 * @return {Object} channel
	 */
	function getForChannelId(channelId) {
		return _cache[channelId] || null;
	}

	function getAllChannels() {
		return cachedChannels;
	}

	return {
		init           : init,
		getForChannelId: getForChannelId,
		getAllChannels: getAllChannels
	};
}());

