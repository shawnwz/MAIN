"use strict";

$service.SDP.Base = (function Base() {
  $service.SDP.config = {
    base_url : $config.getConfigValue("network.server.qsp.url") + $config.getConfigValue("network.server.qsp.path"),
    timeout : $config.getConfigValue("network.server.mds.timeout") * 1000
  };

  function _request(service, method, postData, token) {

    if (!postData) {
      console.log("Error: not valid SDP request\n");
      return; //@hdk must return something!
    }
    var url = $service.SDP.config.base_url + "/" + service + "/" + method;

    return $util.fetchToken(url, $service.SDP.config.timeout, postData, token);
  }

  /**
   * @method init
   */
  function _init() {
    $service.SDP.FoxtelSignon.signon();
  }

    return {
        init: _init,
        request: _request
    };
}());
