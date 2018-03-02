"use strict";

$service.DISCO.Asset = (function Asset() {

  /* global console: true */
  var _leavedLayouts = ["menu_node", "epg_collection_node", "epg_overview"];

  /**
   * @param String catalogueNodeId
   */
  function _fetchData(node) {
    var config = {};

    if (!node || !node.recommendationQuery) {
      console.warn("no RecommendationQuery to fetch DISCO asset");
    }

    config.command = $service.DISCO.COMMANDS.NODEASSETS;
    config.filter = node.recommendationQuery;

    config.fields = [
      "images.default.landscape.URI",
      "images.default.portrait.URI",
      "metadata.cast",
      "metadata.category",
      "metadata.classification",
      "metadata.consumerAdvice",
      "metadata.contentType",
      "metadata.description",
      "metadata.episodeNumber",
      "metadata.episodeTitle",
      "metadata.isSubtitled",
      "metadata.longSynopsis",
      "metadata.programId",
      "metadata.seasonNumber",
      "metadata.shortSynopsis",
      "metadata.subGenreName",
      "metadata.title",
      "metadata.titleId",
      "metadata.yearOfRelease",
      "relevantSchedules.audioType",
      "relevantSchedules.channelTag",
      "relevantSchedules.endTime",
      "relevantSchedules.hasClosedCaptions",
      "relevantSchedules.isHighDefinition",
      "relevantSchedules.offerType",
      "relevantSchedules.startTime",
      "relevantSchedules.type"
    ];
    config.limit = 100;
    config.sort = node.sortCriteria ? node.sortCriteria : [];

    return $service.DISCO.Base.fetch(config);
  }

  /**
   * @method _cacheData
   */
  function _cacheData(data, node) {
    if (data) {
      node._url = data.url;
      if (data.hits) {
        node._assets = []; // make sure they are blanked
        data.hits.forEach(function(item) {
          var mapped = $service.DISCO.Map.editorial(item);
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

    return _fetchData(node)
      .then(function(data) {
              return _cacheData(data, node);
            },
            function (data) {
              console.warn("Failed to get DISCO assets for '" + node.displayName + "' [" + data + "]");
              return  [];
            })
      .then(function (data) {
              if (node._assets && node._assets.length > 0) {
                // console.log("Fetched " + node._assets.length + " DISCO assets for '" + node.displayName + "'");
              } else {
                // console.log("No DISCO assets for '" + node.displayName + "': " + node._url);
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
          nodes[nodeId].recommendationQuery !== undefined &&
          nodes[nodeId].nodeLayoutInfo) {
        if (_leavedLayouts.indexOf(nodes[nodeId].nodeLayoutInfo.toLowerCase()) !== -1) {
          promises.push(_fetchNode(nodes[nodeId]));
        }
      }
    }

    Promise.all(promises)
      .then(function(/* data */) {
              console.log("service:DISCO:asset:fetched");
              $util.Events.fire("service:DISCO:asset:fetched", nodes);
            })
      .catch(function (data) {
              console.warn("Failed to get DISCO assets: [" + data + "]");
            });
  }

  /**
   * @method fetchAssets
   * Will try to fetch cached assets and will fetch new assets if there are none cached
   */
  function fetchAssets(node) {

    return _fetchNode(node)
      .then(function(/* data */) {
              console.log("Got node assets [" + node.id + "] from DISCO [" + node._assets.length + "]");
              return node._assets;
            },
            function (data) {
              console.warn("Failed to get node assets [" + node.id + "] from DISCO [0]", data);
              return [];
            });
  }

  /**
   * @method init
   */
  function init() {
    // this will fetch and cache all assets of all nodes and broadcast the "service:DISCO:asset:fetched" event when done
    $util.Events.on("service:DISCO:asset:fetch", _fetchNotify, this);
  }

  return {
    init: init,
    fetch: fetchAssets // fetch assets for given node
  };
}());

