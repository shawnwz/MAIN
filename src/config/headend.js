$config.addDefaultSettings({

	/*
	 * the fall back url of the SDP to get events. Use empty string as value to disable the fall back feature.
	 * {String}
	 */
	"network.server.qsp.fallbackUrl4Events": {
		value   : $util.constants.PTS_HEADEND_URL,
		override: true
	},

	/*
	 * the url of the SDP you wish to connect to
	 * {String}
	 */
	"network.server.qsp.url": {
		value   : $config.getConfigValue("use.production.sdp") ? $util.constants.PROD_SERVER_URL : $util.constants.PTS_SERVER_URL,
		override: true
	},

	/*
	 * the url of the MDS you wish to connect to
	 * {String}
	 */
	"network.server.mds.url": {
		value   : $config.getConfigValue("use.production.mds") ? $util.constants.PROD_MDS_URL : $util.constants.PTS_MDS_URL,
		override: true
	},

	/*
	 * the locale of MDS
	 * {String}
	 */
	"network.server.mds.locale": {
		value   : "en_AU",
		override: true
	},

	/*
	 * the timeout time for MDS requests in seconds
	 * {Number}
	 */
	"network.server.mds.timeout": {
		value   : 30,
		override: true
	},
	
	/*
	 * the url of the the content discovery to find the assets.
	 * {String}
	 */
	"network.server.assetsDisco.url": {
		// Disco should matches VOD metadata hence should match MDS server
		// Comment out selection below based on lack of access to Staging DISCO URL...
		value   : $util.constants.DISCO_PRODUCTION_URL, //$config.getConfigValue("use.production.disco") ? $util.constants.DISCO_PRODUCTION_URL : $util.constants.DISCO_STAGING_URL,
		override: true
	},

	"ott.url": {
		value   : $util.constants.OTT_URL,
		override: true
	},

	"network.server.qsp.path": {
		value   : "/hue-gateway/gateway/http/js",
		override: true
	},

	"network.server.qsp.CDSN": {
		value   : $config.getConfigValue("use.production.sdp") ? $util.constants.PRODUCTION_CDSN : $util.constants.PTS_CDSN,
		override: true
	},

	// this one should come from bootstrap, but the demo use this before bootstrap finish so hardcode it for now
	"network.server.publicAccessPoint": {
		// images server should matches VOD metadata hence should match MDS server
		value   : $config.getConfigValue("use.production.mds") ? $util.constants.PRODUCTION_IMAGE_URL : $util.constants.PTS_IMAGE_URL,
		override: true
	},

	//////////////////// Not sure these are used /////////////////
	"mds.service.provider.id": {
		value   : "FOXTEL",
		override: true
	},
	"mds.default.location": {
		value   : "en_au",
		override: true
	}

});
