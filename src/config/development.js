$config.addDefaultSettings({
	
	/*
	 * when value is true will use development urls
	 * {String}
	 */
	"development.mode": {
		value   : true,
		override: true
	},

	"use.production.mds": {
		value   : true,
		override: true
	},

	"use.production.sdp": {
		value   : false,
		override: true
	},

	"use.production.disco": {
		value   : true,
		override: true
	},

	"use.fake.events": {
		value   : false,
		override: true
	},

	"use.dummy.mds": {
		value   : false,
		override: true
	},

	/*
	 * if useProdSDP and useProdMDS is mismatched,
	 * we need to get have the right account number that synchronized with the metadata server that we are connecting to
	 * {String}
	 */
	"hard.coded.accountNumber": {
		value   : "11024014", //"47774777",
		override: true
	},

	// NOT SURE ABOUT THESE SETTINGS //
	/*
	 * when value is true will use the real mac address of the STB, else will use hard-coded mac address set by hard.coded.mac
	 * {String}
	 */
	"use.real.mac": {
		value   : "false",
		override: true
	},

	/*
	 * if use.real.mac is false this value will be used for the mac address
	 * {String}
	 */
	"hard.coded.mac": {
		//value: "28-BE-9B-DE-AD-14",
		//Foxtel_UI
		value   : "00-05-9E-00-00-18", //from MLC test tool
		override: true
	}
});
