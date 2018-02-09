"use strict";

$service.MDS.Episode = (function Episode () {

	/* global console: true*/

	/**
	 * @method _fetchCached
	 */
	function _fetchCached (editorial) {
		// TODO: should we grab officially cached data here? or fall back to another server? E.g PROD vs PTS?
		return new Promise(function _fetchCachedPromise (resolve, reject) {
			console.warn("fetch cached episodes from MDS not implemented");
			resolve([]);
		});
	}


	/**
	 * @method _fetchBTV
	 */
	function _fetchBTV (editorial) {
		var promise,
			config = {},
			url = "./service/MDS/Dummy/btvEpisodes.json";
	
		if (!editorial.seriesRef) {
			console.warn("no seriesRef to fetch MDS btvEpisodes");
		}

		if ($service.MDS.useDummyData) {
			console.log("Use dummy btvEpisodes");
			promise = $util.fetch(url, $service.MDS.config.timeout);

		} else {
	
			config.command = $service.MDS.COMMANDS.EPG.editorial;
			config.filter = {
				"technical.seriesRef": editorial.seriesRef,
				"locale"             : $service.MDS.config.locale
			};
			config.fields = [];
			config.limit = 50;
			config.sort = [
				[ "editorial.CUST_SeasonNumber", 1 ],
				[ "editorial.episodeNumber", 1 ],
				[ "programme.period.start", 1 ]
			];
	
			promise = $service.MDS.Base.fetch(config);
		}
		
		return promise;
	}

	/**
	 * @method _fetchVOD
	 */
	function _fetchVOD (editorial) {
		var promise,
			config = {},
			url = "./service/MDS/Dummy/vodEpisodes.json";

		if (!editorial.seriesRef) {
			console.warn("no seriesRef to fetch MDS vodEpisodes");
		}

		if ($service.MDS.useDummyData) {

			console.log("Use dummy vodEpisodes");

			promise = $util.fetch(url, $service.MDS.config.timeout);

		} else {
	
			config.command = $service.MDS.COMMANDS.VOD.editorial;
			config.filter = {
				"technical.seriesRef"            : editorial.seriesRef,
				"voditem.publishToEndUserDevices": true,
				"isValid"                        : true,
				"isVisible"                      : true,
				"locale"                         : $service.MDS.config.locale
			};
			config.fields = [];
			config.limit = 50;
			config.sort = [
				[ "editorial.CUST_SeasonNumber", 1 ],
				[ "editorial.episodeNumber", 1 ],
				[ "programme.period.start", 1 ]
			];
	
			promise = $service.MDS.Base.fetch(config);
		}

		return promise;
	}
	

	/**
	 * @method _mapData
	 */
	function _mapData (data) {
		return new Promise(function mapDataPromise (resolve, reject) {
			if (data && data.editorials && data.editorials.length > 0) {
				var cache = data.editorials.map($service.MDS.Map.editorial);

				resolve(cache);
			} else {
				resolve([]);
			}
		});
	}


	/**
	 * @method _mergeData
	 */
	 // TODO: this function works, however sometimes there are two entries which are the same episode (nb and season) 
	 // but have a different it. So they end up in the list twice
	function _mergeData (data) {
		var mergedData = [],
			found, i, j, k, len;
			
		if (data[1].length === 0) { // only have one: take it
			mergedData = data[0];
		} else if (data[0].length === 0) { // only have one: take it
			mergedData = data[1];
		} else { // have both: merge them
			for (i = 0, len = data[0].length; i < len; i++) {
				found = false;
				for (j = (data[1].length - 1); j >= 0; j--) { // backwards so we can remove
					if (data[0][i].id === data[1][j].id) { // same id: merge
						for (k in data[1][j]) {
							if (data[1][j][k] !== undefined) { // have something...
								if (data[0][i][k] === undefined) { // .. which first array doesnt have... 
									data[0][i][k] = data[1][j][k]; // ... take it
								} else if (data[0][i][k] !== data[1][j][k]) { // which first array has too, but differs
									// console.warn("Data mismatch for "+k+" '"+data[0][i][k]+"' != '"+data[1][j][k]+"'");
								}
							}
						}
						data[1].splice(j, 1);
						break;
					}
				}
				mergedData.push(data[0][i]); // add merged item
			}
			for (i = 0, len = data[1].length; i < len; i++) {
				mergedData.push(data[1][i]); // add remainder items 
			}
		}
		return mergedData;
	}
	
	/**
	 * @method fetchEpisodes
	 */
	function fetchEpisodes (editorial) {

		var promises = [];

		promises.push(
			_fetchBTV(editorial).then(_mapData,
				function (data) {
					console.warn("Failed to fetch btvEpisodes from MDS: " + data);
					return _fetchCached();
			})
		);

		promises.push(
			_fetchVOD(editorial).then(_mapData,
				function (data) {
					console.warn("Failed to fetch vodEpisodes from MDS: " + data);
					return _fetchCached();
			})
		);
		
		return Promise.all(promises).then(_mergeData,
				function (data) {
					console.warn("Failed to fetch episodes from MDS: " + data);
					return [];
				});
	}

	/**
	 * @method _fetchNotify
	 * Fetches the episodes and will send an event
	 */
	function _fetchNotify () {

		fetchEpisodes().then(function (data) {
				console.log("service:MDS:episode:fetched [" + data.length + "]");
				$util.Events.fire("service:MDS:episode:fetched", data);
			}).catch(function (data) {
				console.log("service:MDS:episode:fetched [0]");
				$util.Events.fire("service:MDS:episode:fetched", []);
			});
}

	/**
	 * @method init
	 */
	function init () {
		$util.Events.on("service:MDS:episode:fetch", _fetchNotify, this);
	}

	return {
		init : init,
		fetch: fetchEpisodes
	};

}());

