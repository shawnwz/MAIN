
$config.addDefaultSettings({

	"dvb.scan.config": {
		value: {
			isDVBSEnabled : true,
			isDVBCEnabled : false,
			isDVBTEnabled : true,
			isISDBTEnabled: false
		},
		override: true
	},

	"dvb.scan.parameters": {
		value: {
			"MENDIP": {
				otherFrequenciesInUse: false,
				transmissionMode     : 1,
				guardInterval        : 0,
				LPCodeRate           : 1,
				HPCodeRate           : 1,
				hierarchy            : 0,
				constellation        : 2,
				hierarchyPriority    : 0,
				tunerBandwidth       : 0,
				endFrequency         : 858000,
				frequency            : 474000,
				networkId            : 1
			},
			"AUSTRALIAN_TEST_STREAM": {
				otherFrequenciesInUse: false,
				transmissionMode     : 1,
				guardInterval        : 2,
				LPCodeRate           : 1,
				HPCodeRate           : 1,
				hierarchy            : 0,
				constellation        : 2,
				hierarchyPriority    : 0,
				tunerBandwidth       : 1,
				endFrequency         : 230000,
				frequency            : 170000,
				networkId            : 1
			},
			"AUSTRALIAN_LIVE_TERRESTRIAL": {
				otherFrequenciesInUse: false,
				transmissionMode     : 1,
				guardInterval        : 1,
				LPCodeRate           : 2,
				HPCodeRate           : 2,
				hierarchy            : 0,
				constellation        : 2,
				hierarchyPriority    : 0,
				tunerBandwidth       : 1,
				endFrequency         : 0,
				frequency            : 226500,
				networkId            : 1
			},
			"Foxtel_LIVE_SATELLITE": {
				frequency      : 12136000,
				symbolRate     : 27800,
				fecInner       : 3,
				networkId      : 1,
				zoneId         : 0,
				lnbPolarization: 0,
				isDVBS2        : false,
				rollOff        : 2,
				modulation     : 1,
				lnbPower       : false,
				lnbNewFreq     : 10700000,
				lnbProfile     : "Profile1"
			}
		},
		override: true
	},

	/*
	 * {Object}
	 */
	"dvb.scan.LNB": {
		"Profile1": {
			'lnbLowFreq'   : "10700000",
			'lnbHighFreq'  : "10700000",
			'lnbSwitchFreq': "10700000",
			'lnbPower'     : {
				'option': "Off",
				'value' : false
			}
		},
		"Manual": {
			'lnbLowFreq'   : "9750000",
			'lnbHighFreq'  : "10600000",
			'lnbSwitchFreq': "11100000",
			'lnbPower'     : {
				'option': "On",
				'value' :  true
			}
		}
	},

	/*
	 * {string}
	 */
	"dvb.scan.LNB_PROFILE": {
		value   : "lnb.profile",
		override: true
	},

	/*
	 * {string}
	 */
	"dvb.scan.LNB_PROFILE_VALUE": {
		value   : "Profile1",
		override: true
	},

	/* {String}
	 */
	"dvb.scan.name": {
		value   : [ "AUSTRALIAN_LIVE_TERRESTRIAL", "Foxtel_LIVE_SATELLITE" ],
		override: true
	},

	/*
	 * {Number}
	 */
	"dvb.max.lcn.length": {
		value   : 4,
		override: true
	},

	/* sets the tuner Type
	 * {String}
	 * DVBC, (for DVBC tuner type)
	 * DVBS, (for DVBS tuner type)
	 * DVBT, (for DVBT tuner type)
	 * ISDBT, (for ISDBT tuner type)
	 */
	"stb.tuner.type": {
		value   : [ "DVBT", "DVBS" ],
		override: true
	},

	/*
	 * {Boolean}
	 */
	"use.fake.dvb.scan": {
		value   : false,
		override: true
	},

	/*
	 * {Boolean}
	 */

	"fail.fake.dvb.scan": {
		value   : false,
		override: true
	}

});
