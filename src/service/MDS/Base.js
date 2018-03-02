"use strict";

$service.MDS.Base = (function Base() {

  $service.MDS.useDummyData = $config.getConfigValue("use.dummy.mds");
  $service.MDS.useFakeProgrammes = $config.getConfigValue("use.fake.events");

  $service.MDS.sourceName = "MDS";

  $service.MDS.config = {
    url           : $config.getConfigValue("network.server.mds.url"),
    locale        : $config.getConfigValue("network.server.mds.locale"),
    timeout       : $config.getConfigValue("network.server.mds.timeout") * 1000,
    assetCacheSize: 2000,
    assetCacheAge : (5 * 60 * 1000) /* refresh cache every 5 mins */
  };

  $service.MDS.COMMANDS = {
    EPG: {
      services : "btv/services",
      editorial: "btv/editorials",
      events   : "btv/programmes"
    },
    VOD: {
      nodes    : "vod/nodes",
      editorial: "vod/editorials",
      product  : "vod/products"
    }
  };

  /**
   * @method _getUrl
   * @param {Object} config - configuration object
   * @param {String} config.command - command string - taken from $service.MDS.COMMANDS
   * @param {Object} config.filter - object representing the filter to be applioed
   * @param {Array} config.fields - string array of fields to return
   * @param {Number} config.limit - number of records to limit to
   * @param {Number} config.offset - number of records to offset by
   * @return {string} url - url to call
   */
  function _getUrl(config) {
    var command = config.command,
      filter = config.filter,
      fields = config.fields,
      limit = config.limit,
      offset = config.offset,
      sort = config.sort,
      url;

    if (command) {
      url = $service.MDS.config.url + "/" + command;

      if (!filter.locale) {
        filter.locale = $service.MDS.config.locale;
      }
      if (filter) { //@hdk the ? below always expect a filter! So why check if there is a filter?
        url += "?filter=" + JSON.stringify(filter);
      }
      if (limit) {
        url += "&limit=" + limit;
      }
      if (offset) {
        url += "&offset=" + offset;
      }
      if (fields) {
        url += "&fields=" + JSON.stringify(fields);
      }
      if (sort && sort.length > 0) {
        url += "&sort=" + JSON.stringify(sort);
      }
    }
    return url;
  }

  /**
   * @method fetch
   * @param  {Object} config - configuration object - see _getUrl for details
   */
  function fetch(config, token) {
    var url = _getUrl(config);
    // console.log("fetch url: ", url);
    return $util.fetchToken(url, $service.MDS.config.timeout, token);
  }

  /**
   * @method init
   */
  function init() {
    // TODO: FP1-68 - Initialise sign on and environment variables as appropriate here
  }

  return {
    init : init,
    fetch: fetch
  };
}());

