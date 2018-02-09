$service.MDS.Node = (function Node () {
	"use strict";

	/* global console: true*/

	var _rootNode = null,
		_NodesCache = [], // raw nodes
		_NodesCacheNb = 0,
		_screenNodes = {}, // lookup for first level based on displayName
		_assetsCache = [],
		//_assetsCacheSize = 0,
		_removeApps = [ "Sky News Local", "Fox Sports News", "Foxtel Tunes", "Sky News Weather Active", "Sky News Multiview" ],
		_appendApps = [
			$service.Map.generic({ title: "YouTubeTV", channelName: "OnDemand", promo: "./images/apps/youtube-icon.png", contentType: "TV_EPS", nodeLayoutInfo: "EPG_APPS_16x9", source: "APPS" }),
			$service.Map.generic({ title: "ABC iView", channelName: "OnDemand", promo: "./images/apps/iview-icon.png",   contentType: "TV_EPS", nodeLayoutInfo: "EPG_APPS_16x9", source: "APPS" })
			//$service.Map.generic({ title: "NETFLIX",   channelName: "OnDemand", promo: "./images/apps/netflix-icon.png", contentType: "TV_EPS", nodeLayoutInfo: "EPG_APPS_16x9", source: "APPS" }),
			//$service.Map.generic({ title: "SBS OnDemand",     channelName: "OnDemand", promo: "http://aas-api.cloud.accedo.tv/file/993/logo.jpeg",                            contentType: "TV_EPS", nodeLayoutInfo: "EPG_APPS_16x9", source: "APPS" }),
			//$service.Map.generic({ title: "Rockswap",         channelName: "Games",    promo: "http://aas-api.cloud.accedo.tv/file/988/icon.png",                             contentType: "TV_EPS", nodeLayoutInfo: "EPG_APPS_16x9", source: "APPS" }),
			//$service.Map.generic({ title: "Associated Press", channelName: "News",     promo: "https://pbs.twimg.com/profile_images/636220339513655296/vqjefC3B_200x200.png", contentType: "TV_EPS", nodeLayoutInfo: "EPG_APPS_16x9", source: "APPS" }),
		];

	/**
	 * @method _fetchDummies
	 */
	function _fetchDummies () {
		var url = "./service/MDS/Dummy/Nodes.json";

		console.log("Use dummy nodes");
		return $util.fetch(url, $service.MDS.config.timeout);
	}

	/**
	 * @method _fetchRefresh
	 */
	function _fetchRefresh () {

		var config = {};

		config.command = $service.MDS.COMMANDS.VOD.nodes;
		config.filter = {
			// "CUST_PublishStartTime":{"$lte":"1468452540"},
			// "CUST_PublishEndTime":{"$gt":"1468452540"},
			// TODO: Replace the PublishStart and EndTime as these are required. Need to know the window.
			"CUST_PreviewOnly": "false",
			"locale"          : $service.MDS.config.locale
		};
		config.fields = [
			"id",
			"Title",
			"parent",
			"children",
			"RecommendationQuery",
			"PromoImages",
			"nodeOrder",
			"NodeLayoutInfo",
			"CUST_SortCriteria"
		];
		config.limit = 3000;
		config.sort = [[ "nodeOrder", 1 ]];

		//console.log("config=" + JSON.stringify(config, null, 2));

		return $service.MDS.Base.fetch(config);
	}

	/**
	 * @method _fetchCached
	 */
	function _fetchCached () {
		return new Promise(function (resolve, reject) {
			if (_rootNode && _rootNode._subNodes && _rootNode._subNodesNb) {
				resolve(_rootNode);
			} else {
				console.warn("Unable to get cached nodes from MDS (not yet cached)");
				reject([]);
			}
		});
	}

	
	/**
	 * @method _appendCustom
	 */
	function _appendCustom (data) {
		var url = "./service/MDS/Dummy/CustomNodes.json";

		return $util.fetch(url, $service.MDS.config.timeout).then(function (customData) {
			var i, j, clen, dlen;
			if (customData && customData.nodes && customData.nodes.length > 0) {
				for (i = 0, clen = customData.nodes.length; i < clen; i++) {
					data.nodes.push(customData.nodes[i]);
					data.total_records++;

					// add custom node to the children
					for (j = 0, dlen = data.nodes.length; j < dlen; j++) {
						if (data.nodes[j].id == customData.nodes[i].parent) {
							data.nodes[j].children.push(customData.nodes[i].id);
							break; // only need one
						}
					}
				}
			}
			return data;
		}, function (customData) {
			// ignore failures, perhaps no file there
			return data;
		});
	}
	/**
	 * @method _mapData
	 */
	function _mapData (data) {
		return new Promise(function (resolve, reject) {
			if (data && data.nodes && data.nodes.length > 0) {
				_NodesCache = [];
				_NodesCacheNb = data.nodes.length;
				for (var i = 0; i < _NodesCacheNb; i++) {
					_NodesCache[data.nodes[i].id] = $service.MDS.Map.node(data.nodes[i]);
				}
				resolve(_NodesCache);
			} else {
				reject();
			}
		});
	}


  /**
    This method builds the node tree structure out of MLC catalogue nodes
    @method _buildMenu
    @param {object} nodes - MLC Catalogue nodes
    @return {object} structure object
   **/
  function _buildMenu (nodes) {

		function _markSubNodesAttached (node) {
			node._attached = true;
			for (var nodeId in node._subNodes) {
				var subNode = node._subNodes[nodeId];

				if (subNode) {
					subNode._attached = true;
					if (subNode._subNodesNb > 0) {
						_markSubNodesAttached(subNode);
					}
				}
			}
		}

    var rootNodeId = $util.constants.ROOT_NAV_NODE_ID,
			nthNodeId, nthNode, subNode;

		_rootNode = null;
		_screenNodes = [];

		if (nodes && rootNodeId && nodes[rootNodeId]) {

			_rootNode = nodes[rootNodeId];

			// walk through all nodes and link parents and children
			for (nthNodeId in nodes) {
				nthNode = nodes[nthNodeId];

				if (nthNode) {
//					// if we have a parent: add this node as a subnode of the parent
//					var parentNode = nodes[nthNode.parent];
//					if (parentNode) {
//						//parentNode._subNodes.push(nthNode);
//					}

					nthNode._firstSubNode = null;

					// add all the children's nodes
					for (var i = 0, len = nthNode.children.length; i < len; ++i) {
						var nthChildNodeId = nthNode.children[i],
							nthChildNode = nodes[nthChildNodeId];

						if (nthChildNode && nthChildNode.nodeLayoutInfo) {
							if (nthNode._firstSubNode === null) { // no first child yet
								if (nthChildNode.nodeLayoutInfo.toLowerCase() === "menu_node") {
									nthNode._firstSubNode = nthChildNode; // first existsing child
								}
							}

							if (nthChildNode.parent === nthNodeId) {  // direct child
								nthChildNode._parentNode = nthNode;
								if (nthChildNode.isCollection === true) { // collection node: push it to the collections
									nthNode._collections.push(nthChildNode);
									nthChildNode._attached = true;
								} else if (nthNode.isApplication === true && nthChildNode.isApplication === true) { // parent application node: push it to the assets
									if (_removeApps.indexOf(nthChildNode.displayName) === -1) {
										nthNode._assets.push(nthChildNode);
										nthChildNode._attached = true;
									}
								} else {
									nthNode._subNodes[nthChildNodeId] = nthChildNode;
									nthNode._subNodesNb++;
								}
							}
						}
					}

					// sort the subNodes based on nodeOrder
					var i, key, tuples = [];
					for (key in nthNode._subNodes) {
						tuples.push([key, nthNode._subNodes[key]]);
					}
					tuples.sort(function(a, b) {
						return a[1].nodeOrder - b[1].nodeOrder;
					});
					nthNode._subNodes = []
					for (i = 0; i < tuples.length; i++) {
						nthNode._subNodes[tuples[i][0]] = tuples[i][1];
					}

					if (nthNode.isApplication === true) { // application node: append some apps
						//@hdk Note: this assumes there is only one apps node, otherwise below code will run for all apps nodes
						nthNode._assets = nthNode._assets.concat(_appendApps);
					}
				}
			}

			_markSubNodesAttached(_rootNode);

			// populate the first left of each node (subNode which has no subNodes)
			for (nthNodeId in nodes) {
				nthNode = nodes[nthNodeId];

				subNode = nthNode;
				while (subNode._firstSubNode) {
					subNode = subNode._firstSubNode;
				}
				nthNode._firstLeftNode = subNode;
			}

			if (_rootNode && _rootNode._subNodes && _rootNode._subNodesNb) {

				for (nthNodeId in _rootNode._subNodes) {
					nthNode = _rootNode._subNodes[nthNodeId];

					var name = nthNode.displayName.toLowerCase();
					_screenNodes[name] = nthNode;

					// should we have jumpoffs for this screen? We do if there is more than one level of subnodes
					nthNode._hasJumpOffs = false;
					for (nthChildNodeId in nthNode._subNodes) {
						var nthChildNode = nthNode._subNodes[nthChildNodeId];
						if (nthChildNode._subNodes && nthChildNode._subNodesNb > 0) {
							nthNode._hasJumpOffs = true; // found one of the subNodes which has subNodes: yes to jumpoffs
							break;
						}
					}
				}
			}
		}

	  return _rootNode;
  }


	/**
	 * @method _buildStructure
	 */
	function _buildStructure (nodes) {
		return new Promise(function (resolve, reject) {
			if (nodes) {
				resolve(_buildMenu(nodes));
			} else {
				reject();
			}
		});
	}

	/**
	 * @method _fetchNew
	 * Fetches new nodes from MDS and updates cache
	 */
	function _fetchNew () {
		var fetch = $service.MDS.useDummyData ? _fetchDummies : _fetchRefresh;

		return fetch().then(_appendCustom).then(_mapData).then(_buildStructure);
}

	/**
	 * @method _fetchNodes
	 * Will try to fetch cached nodes and will fetch new nodes if there are none cached
	 */
	function fetchNodes () {

		return _fetchCached().then(function (data) {
					console.log("Got cached nodes from MDS [" + _NodesCacheNb + "]");
					return data;
				}, _fetchNew); // failed to get cached: fetch new
	}

	/**
	 * @method _fetchNotify
	 * Fetches the nodes and will send an event. Always fetches new nodes (not cached)
	 */
	function _fetchNotify () {

		_fetchNew().then(function () {
			console.log("service:MDS:node:fetched [" + _NodesCacheNb + "]");
			$util.Events.fire("service:MDS:node:fetched", _NodesCache);
		}).catch(function () {
			console.log("service:MDS:node:fetched [0]");
			$util.Events.fire("service:MDS:node:fetched", []);
		});
	}

	/**
	 * @method _fetchCachedAssets
	 */
	function _fetchCachedAssets (node) {
		return new Promise(function (resolve, reject) {
			var now = (new Date()).getTime(),
				maxAge = $service.MDS.config.assetCacheAge,
				age = node._assetsCacheTime ? (now - node._assetsCacheTime) : 0;
			if (node && node._assets && node._assets.length > 0) {
				if (age < maxAge) {
					console.log("Got cached node assets [" + node.id + "] [" + node._assets.length + "] (age:" + Math.floor(age / 1000) + " secs)");
					resolve(node._assets);
				} else {
					console.warn("Unable to get cached node assets [" + node.id + "] from (stale:" + Math.floor((age - maxAge) / 1000) + " secs)");
					reject([]);
				}
			} else {
				console.warn("Unable to get cached node assets [" + node.id + "] from (not yet cached)");
				reject([]);
			}
		});
	}

	/**
	 * @method fetchAssets
	 * Will try to get cached assets and will fetch new assets if there are none cached
	 */
	function _updateAssetsCache (node) {

		return new Promise(function (resolve, reject) {
			if (node && node._assets && node._assets.length > 0) {
				var maxSize = $service.MDS.config.assetCacheSize,
					currentSize = _assetsCache.reduce(function (acc, nthNode) { return (acc + nthNode._assets.length); }, 0),
					newSize = currentSize + node._assets.length;

				// remove the node's asset from cache if they have been added before
				_assetsCache.forEach(function (nthNode) {
					if (nthNode.id === node.id) {
						newSize -= nthNode._assets.length;
						console.log("assetsCache delete the duplicate node: id is: " + nthNode.id);
						_assetsCache.splice(_assetsCache.indexOf(nthNode), 1);
					}
				});

				console.log("assetsCache contains " + _assetsCache.length + " nodes and " + currentSize + " assets (add " + node._assets.length + " assets)");

				if (node._assets.length > maxSize) {
					// just this one is already too big: clear whole cache and add it anyway...
					console.error("Allocated cache size too small for node [" + node.id + "] assets [" + maxSize + "<" + node._assets.length + "]! increase cacheSize!");

					_assetsCache.forEach(function (nthNode) {
						nthNode._assets = [];
						nthNode._assetsCacheTime = 0;
					});
					_assetsCache = [];
					newSize = node._assets.length;

				} else if (newSize > maxSize) {
					//  added one pushes it over: remove first (oldest) entry until we have anough space
					while (newSize > maxSize) {
						console.log("   remove assets from cache [" + node.id + "]");
						var nthNode = _assetsCache[0];
						newSize -= nthNode._assets.length;
						nthNode._assets = [];
						nthNode._assetsCacheTime = 0;
						_assetsCache.splice(0, 1);
					}
					console.log("   reducedSize = " + newSize);

				} else { // still fits: just add it

				}

				//_assetsCacheSize = newSize;
				node._assetsCacheTime = (new Date()).getTime();
				_assetsCache.push(node);
			}
			resolve(node._assets);
		});
	}

	/**
	 * @method fetchAssets
	 * Will try to get cached assets and will fetch new assets if there are none cached
	 */
	function fetchAssets(node) {

		/* //@hdk Should we use node._firstLeftNode here?
		 * we do that now in the tile screen. In the Tile screen we know thats what we want,
		 * but would we always want that?
		 */
		// node = node._firstLeftNode;

		return _fetchCachedAssets(node).then(function (assets) {
					return assets;
				},
				function () {
					var service = node.recommendationQuery ? $service.DISCO : $service.MDS;

					return service.Asset.fetch(node).then(function (assets) {
								if (node._collections && node._collections.length > 0) {
									console.log("prepend " + node._collections.length + " collections to node assets [" + node.id + "]");
									node._assets = node._collections.concat(assets);
								}
								return node._assets;
							},
							function (data) {
								console.log("Failed to get node assets [" + node.id + "]", data);
								return [];
							}).then(function (data) {
								return _updateAssetsCache(node);
							},
							function (data) {
								console.log("Failed to update the node cache [" + node.id + "]", data);
								return [];
							});
				});
	}

	/**
	 * @method getScreenNode
	 */
	function getScreenNode (node) {
		return new Promise(function (resolve, reject) {
			var name = node.displayName.toLowerCase();

			if (_screenNodes && _screenNodes[name]) {
				resolve(_screenNodes[name]);
			} else {
				reject([]);
			}
		});
	}

	/**
	 * @method getMenu
	 */
	function getMenu () {
		return (_rootNode && _rootNode._subNodes && _rootNode._subNodesNb) ? _rootNode._subNodes : null;
	}

	/**
	 * @method getMenu
	 */
	function getNode (nodeId) {
		return (_NodesCache && _NodesCache[nodeId]) ? _NodesCache[nodeId] : null;
	}

	/**
	 * @method init
	 */
	function init () {
		// this will fetch all nodes and broadcast the "service:MDS:node:fetched" event when done
		$util.Events.on("service:MDS:node:fetch", _fetchNotify, this);
	}

	return {
		init      : init,
		fetch     : fetchNodes, // fetch all nodes and build menu structure
		getMenu   : getMenu, // get first level of menu (subNodes of root)
		getNode   : getNode, // get a node based on its id
		screenNode: getScreenNode, // get node based on node displayName
		assets    : fetchAssets // read from cache or fetch assets for given node
	};
}());
