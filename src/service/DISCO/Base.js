"use strict";

$service.DISCO.Base = (function Base() {

    $service.DISCO.useDummyData = false; // NO NEED! $config.getConfigValue("disco.data.usedummy");

    $service.DISCO.sourceName = "DISCO";

    $service.DISCO.config = {
        url    :    $config.getConfigValue("network.server.assetsDisco.url"),
        locale :    $config.getConfigValue("network.server.mds.locale"),
        timeout:    $config.getConfigValue("network.server.mds.timeout") * 1000
    };

    $service.DISCO.COMMANDS = {
        DIDYOUMEAN   : "/sd/foxtel/taps/assets/search/spellcheck?prod=FOXTELIQ3&rid=SEARCH107",
        NODEASSETS   : "/sd/foxtel/cores/assets-foxtel/search?prod=FOXTELIQ3&fl=*",
        SEARCHIQ3    : "/sd/foxtel/taps/assets/search/prefix?prod=FOXTELIQ3",
        SEARCHPRESTO : "/sd/foxtel/taps/assets/search/prefix?prod=FOXTELPRESTO",
        POPULAR      : "/sd/foxtel/cores/assets-foxtel/search?prod=FOXTELIQ3&rid=POPULAR1&fx=*%3A*", //@hdk what is fx?
        MLT          : "/sd/foxtel/cores/assets-foxtel/search?prod=FOXTELIQ3&rid=MLT1",
        SUGGESTIQ3   : "/sd/foxtel/taps/assets/search/autosuggest?prod=FOXTELIQ3&rid=AUTO3&fl=*",
        SUGGESTPRESTO: "/sd/foxtel/cores/assets-foxtel/autoSuggest?prod=FOXTELPRESTO&rid=AUTO1&fl=*",
        GENERIC      : "&fxid=021b249b41458a01f7fa8379f6c271eea0d41d8cd98f00b204e9800998ecf8427e" +  // idm + aid + hwid (02=foxtel)
      "&hwid=d41d8cd98f00b204e9800998ecf8427e" + // hardcoded hardware id. Looks like the returned results are not affected by this id.
      "&idm=02" + // is Foxtel
      "&aid=1b249b41458a01f7fa8379f6c271eea0" + // CryptoJS.MD5($N.app.accountNumber).toString()
      "&device=xx-yy" +
      "&dclass=STB" +
      "&swver=00" +
      "&dpg=0" +
      "&ao=N" +
      "&BLOCKED=YES" +
      "&utcOffset=%2B1100" +
      "&REGION=af35b21540904fcaa3c049fcfd66b111" +
      "&dopt=[F0%3A11]"
    };

    /**
     * @method getDISCOUrl
     * @param {Object} config - configuration object
     * @param {String} config.command - command string (rid field)
     * @return {string} url - url to call
     */
    function _getDISCOUrl(config) {
        var command = config.command,
            filter = config.filter,
            fields = config.fields,
            limit = config.limit,
            offset = config.offset,
            sort = config.sort,
            url;

        if (command) {
            url = $service.DISCO.config.url + command + $service.DISCO.COMMANDS.GENERIC;

            if (filter) {
                url += "&" + filter;  // both fx= & rid=
            }
            if (limit) {
                url += "&limit=" + limit;
            }
            if (offset) {
                url += "&offset=" + offset;
            }
            if (fields && fields.length > 0) { // expect comma seperater list
                url += "&fp=" + fields.join(",");
            }
            if (sort && sort.length > 0) {
                url += "&sort=" + JSON.stringify(sort);
            }
        }
        return url;
    }

    /**
     * @method fetch
     * @param  {Object} config - configuration object - see getDISCOUrl for details
     */
    function fetch(config, token) {
        var url = _getDISCOUrl(config);
        console.log("DISCO fetch url: ", url);
        return $util.fetchToken(url, $service.DISCO.config.timeout, token);
    }

    /**
     * @method init
     */
    function init() {
        // TODO: FP1-232 - Initialise sign on and environment variables as appropriate here
    }

    return {
        init : init,
        fetch: fetch
    };
}());
