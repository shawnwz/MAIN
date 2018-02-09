"use strict";

$service.MDS.Asset = (function Asset() {

	/* global console: true*/
	var _leavedLayouts = [ "menu_node", "epg_collection_node", "epg_overview" ];

	/**
	 * @method _fetchDummy
	 */
	function _fetchDummy(node) {

		console.warn("Use dummy node assets [" + node.id + "] from MDS");
		return $util.fetch("./service/MDS/Dummy/Assets.json", $service.MDS.config.timeout).then(function(allData) {
					var data = [];
					for (var i = 0, len = allData.length; i < len; i++) {
						if (allData[i].nodeId && allData[i].nodeId === node.id) {
							data = allData[i];
							break;
						}
					}
					return data;
				},
				function (data) {
					console.warn("Failed to get dummy MDS assets");
				});
		}

	/**
	 * @method _fetchData
	 */
	function _fetchData(node) {

		var config = {};

		if (!node.id) {
			console.warn("no id to fetch MDS asset");
		}

		config.command = $service.MDS.COMMANDS.VOD.editorial;
		config.filter = {
			"voditem.node": {
				"$in": [node.id]
			},
			"voditem.publishToEndUserDevices": true,
			"isValid"                        : true,
			"isVisible"                      : true,
			"locale"                         : $service.MDS.config.locale
		};
		config.fields = [
			"editorial.Title",
			"editorial.Images",
			"editorial.ContentType",
			"editorial.Categories",
			"editorial.Rating",
			"editorial.CUST_SortTitle",
			"editorial.seriesRef",
			"editorial.CUST_SeasonNumber",
			"editorial.episodeNumber",
			"technical.ServiceLongName",
			"voditem.node" ];
		config.limit = 100;
		config.sort = node.sortCriteria ? node.sortCriteria :
			[
				[ "voditem.DisplayPriority", 1 ],
				[ "editorial.CUST_SortTitle", 1 ],
				[ "editorial.CUST_SeasonNumber", 1 ],
				[ "editorial.episodeNumber", 1 ]
			];

		return $service.MDS.Base.fetch(config);
	}

	/**
	 * @method _cacheData
	 */
	function _cacheData(data, node) {
		if (data) {
			node._url = data.url;
			if (data.editorials) {
				node._assets = []; // make sure they are blanked
				data.editorials.forEach(function(item, j, array) {
					var mapped = $service.MDS.Map.editorial(item);
					node._assets.push(mapped);
				});
			}
		}
		return data;
	}

	/**
	 * @method _fetchNode
	 */
	function _fetchNode(node) {
		var fetch = ($service.MDS.useDummyData) ? _fetchDummy : _fetchData;

		return fetch(node).then(function(data) {
					return _cacheData(data, node);
				},
				function (data) {
					console.warn("Failed to get MDS assets for '" + node.displayName + "' [" + data + "]");
					return [];
				}).then(function (data) {
					if (node._assets && node._assets.length > 0) {
						// console.log("Fetched "+node._assets.length+" MDS assets for '"+node.displayName+"'");
					} else {
						// console.log("No MDS assets for '"+node.displayName+"': "+node._url);
					}
					return data;
				});
	}

	/**
	 * @method _fetchNotify
	 * Fetch all assets for all given nodes
	 */
	function _fetchNotify(nodes) {

		var promises = [],
			nodeId;

		for (nodeId in nodes) {
			if (nodes[nodeId]._attached === true &&
					nodes[nodeId].recommendationQuery === undefined &&
					nodes[nodeId].nodeLayoutInfo) {
				if (_leavedLayouts.indexOf(nodes[nodeId].nodeLayoutInfo.toLowerCase()) !== -1) {
					promises.push(_fetchNode(nodes[nodeId]));
				}
			}
		}

		Promise.all(promises).then(function(data) {
			console.log("service:MDS:asset:fetched");
			$util.Events.fire("service:MDS:asset:fetched", nodes);
		}).catch(function (data) {
			console.warn("Failed to get MDS assets: [" + data + "]");
		});
	}

	/**
	 * @method fetchAssets
	 */
	function fetchAssets(node) {

		return _fetchNode(node).then(function(data) {
				console.log("Got node assets [" + node.id + "] from MDS [" + node._assets.length + "]");
				return node._assets;
			},
			function (data) {
				console.warn("Failed to get node assets [" + node.id + "] from MDS [0]");
				return [];
			});
	}

	/**
	 * @method init
	 */
	function init() {
		// this will fetch and cache all assets of all nodes and broadcast the "service:MDS:asset:fetched" event when done
		$util.Events.on("service:MDS:asset:fetched", _fetchNotify, this);
	}

	return {
		init : init,
		fetch: fetchAssets // fetch assets for given node
	};
}());

