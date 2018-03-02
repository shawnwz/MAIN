"use strict";

$service.MDS.Editorial = (function Editorial() {

  /* global console: true*/

  /**
   * @method _fetchDummies
   */
  function _fetchDummies(node, token) {
    var url = "./service/MDS/Dummy/Editorials.json";
    console.log("Use dummy Editorials");
    return $util.fetchToken(url, $service.MDS.config.timeout, token);
  }


  /**
   * @method _fetchReal
   */
  function _fetchReal(node, token) {

    var config = {};

    if (!node.id) {
      console.warn("no id to fetch MDS editorial");
    }
// seems for some we must use VOD other BTV? is that correct or fiction?
//    if (false) {
//      config.command = $service.MDS.COMMANDS.EPG.editorial;
//    } else {
      config.command = $service.MDS.COMMANDS.VOD.editorial;
//    }

    if (node.technicalId) {
      config.filter = {
        "technical.id": node.technicalId,
        "locale": $service.MDS.config.locale
      };
    } else {
      config.filter = {
        "editorial.id": node.id,
        "locale": $service.MDS.config.locale
      };
    }
    config.fields = [ // get it all
    ];
    config.limit = 50;
    config.sort = [
      [ "programme.period.start", 1 ]
    ];

    return $service.MDS.Base.fetch(config, token);
  }


  /**
   * @method _fetchEditorial
   */
  function _fetchEditorial(node, token) {

    var fetch = $service.MDS.useDummyData ? _fetchDummies : _fetchReal;

    // if we failed to get the editorial, or if there is none found, we always resolve with
    // the node data we already have (so we return something)
    return fetch(node, token)
      .then(function (data) {
              return new Promise(function mapDataPromise(resolve/* , reject */) {
                if (data && data.editorials && data.editorials.length > 0) {
                  var cache = data.editorials.map($service.MDS.Map.editorial);
                  if (cache && cache.length > 1) { // we only expect exactly one
                    console.warn("Multiple Editorial from MDS: " + data.url);
                  }
                  resolve(cache);
                } else {
                  console.warn("Missing Editorial from MDS: " + data.url);
                  resolve([node]); // return node info
                }
              });
            });
  }

  /**
   * @method _fetchNotify
   * Fetches the episodes and will send an event
   */
  function _fetchNotify(node) {

    _fetchEditorial(node)
      .then(function(data) {
              console.log("service:MDS:editorial:fetched [" + data.length + "]");
              $util.Events.fire("service:MDS:editorial:fetched", data);
            })
      .catch(function (/* data */) {
              console.log("service:MDS:editorial:fetched [0]");
              $util.Events.fire("service:MDS:editorial:fetched", []);
            });
  }

  /**
   * @method init
   */
  function init() {
    // Fetches the episodes and will send an event
    $util.Events.on("service:MDS:editorial:fetch", _fetchNotify, this);
  }

  return {
    init: init,
    fetch: _fetchEditorial
  };

}());

