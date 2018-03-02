"use strict";

$service.DISCO.Morelikethis = (function Morelikethis() {

  /* global console: true */

  /**
   * @param String catalogueNodeId
   */
  function _fetchData(asset) {
    var config = {};

    if (!asset.editorialId) {
      console.warn("no editorialId to fetch DISCO Morelikethis");
    }

    config.command = $service.DISCO.COMMANDS.MLT;
    config.filter = "mlt=" + asset.editorialId;

//    config.filter = {
//    };
    config.fields = [
//      "metadata.programId",
      "metadata.title",
      "metadata.contentType",
//      "metadata.subGenreName",
      "metadata.classification",
//      "relevantSchedules.channelTag",
      "images.default.landscape.URI",
      "images.default.portrait.URI",
//      "metadata.shortSynopsis",
//      "relevantSchedules.isHighDefinition",
//      "relevantSchedules.isWidescreen",
//      "relevantSchedules.audioType",
//      "metadata.isSubtitled",
//      "relevantSchedules.hasClosedCaptions",
//      "metadata.publishDuration",
//      "metadata.yearOfRelease",
      "metadata.seasonNumber",
      "metadata.episodeNumber",
//      "metadata.episodeTitle",
//      "metadata.genreId",
//      "metadata.subGenreId",
//      "metadata.consumerAdvice",
//      "metadata.cast",
//      "metadata.titleId",
//      "metadata.displaySEpNum",
//      "relevantSchedules.startTime",
//      "relevantSchedules.endTime",
//      "relevantSchedules.type",
//      "relevantSchedules.id",
//      "relevantSchedules.offerType",
//      "relevantSchedules.seriesLink",
//      "hits.metadata.sourceTitle",
//      "hits.id",
      "metadata.category"
    ];
    config.limit = 10;
//    config.sort = [
//      ["hits.metadata.sortTitle", 1]
//    ];

    return $service.DISCO.Base.fetch(config);
  }


  /**
   * @method _mapData
   */
  function _mapData(data) {
    return new Promise(function mapDataPromise(resolve, reject) {
      if (data && data.hits) {
        var cache = data.hits.map($service.DISCO.Map.editorial);
        resolve(cache);
      } else {
        reject();
      }
    });
  }

  /**
   * @method _fetchAssets
   */
  function _fetchAssets(node) {

    return _fetchData(node)
      .then(_mapData,
            function(data) {
              console.warn("Failed to fetch episodes from MDS: " + data);
              return [];
            });
  }

  /**
   * @method _fetchNotify
   * Fetches the assets and will send an event
   */
  function _fetchNotify(node) {

    _fetchAssets(node)
      .then(function(data) {
              console.log("service:DISCO:Morelikethis:fetched [" + data.length + "]");
              $util.Events.fire("service:DISCO:Morelikethis:fetched", data);
            })
      .catch(function (/* data */) {
              console.log("service:DISCO:Morelikethis:fetched [0]");
              $util.Events.fire("service:DISCO:Morelikethis:fetched", []);
            });
  }

  /**
   * @method init
   */
  function init() {
    $util.Events.on("service:DISCO:Morelikethis:fetch", _fetchNotify, this);
  }

  return {
    init: init,
    fetch: _fetchAssets
  };
}());

