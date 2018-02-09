"use strict";
/*eslint-disable camelcase*/
$util.constants = {
    STAGING_MDS_URL: "http://10.15.23.171/metadata/delivery/FOXTEL",
    PTS_SERVER_URL : "http://203.17.26.91",
    PROD_SERVER_URL: "http://203.17.26.41",
    PTS_MDS_URL    : "http://203.17.26.91/metadata/delivery/FOXTEL",
    PROD_MDS_URL   : "http://203.17.26.41/metadata/delivery/FOXTEL",

	//FIXME                    : Should this below come from bootstrap?
	ROOT_NAV_NODE_ID: "CAT000000010",

	//Unknown URLs (taken from puck1 and other demos e.g MegaMix)
    DISCO_STAGING_URL   : "https://foxtel-staging-admin-0.digitalsmiths.net",
    DISCO_PRODUCTION_URL: "https://foxtel-prod-admin-0.digitalsmiths.net", // "https://foxtel-prod-elb.digitalsmiths.net",

    PRODUCTION_IMAGE_URL: "http://images1.resources.foxtel.com.au/",
    PTS_IMAGE_URL       : "http://test-images1.resources.foxtel.com.au/",

    PRODUCTION_CDSN: "62077771368", //YIXIN's iQ3 CDSN
    PTS_CDSN       : "544556676766677",
    OTT_URL        : "http://10.130.0.189/service.php",

    MINUTE_IN_MS: 60 * 1000,
    HOUR_IN_MS  : 60 * 60 * 1000,
    DAY_IN_MS   : 24 * 60 * 60 * 1000,

	//STB environment
    STB_ENVIRONMENT_IP         : "IP",
    STB_ENVIRONMENT_DVB        : "DVB",
    STB_ENVIRONMENT_HYBRID     : "HYBRID",
    STB_ENVIRONMENT_HYBRID_SI  : "HYBRID-SI",
    CONFIG_STB_ENVIRONMENT_TYPE: "stb.environment",
    CONFIG_STB_TUNER_TYPE      : "stb.tuner.type",

	CHANNEL_TYPE: {
		VIDEO: 1,
		RADIO: 2
	},
	DEFAUT_TOP_MENU: [
		{
            displayName: "HOME",
            id         : "1"
		},
		{
            displayName: "TV GUIDE",
            id         : "2"
		},
		{
            displayName: "LIBRARY",
            id         : "3"
		},
		{
            displayName: "ON DEMAND",
            id         : "4"
		},
		{
            displayName: "STORE",
            id         : "5"
		},
		{
            displayName: "APPS",
            id         : "6"
		},
		{
            displayName: "SEARCH",
            id         : "7"
		},
		{
            displayName: "SETTINGS",
            id         : "8"
		}
	],
	CHANNEL_CATEGORIES: [
		"genre_all",
		"genre_FTA",
		"genre_Entertainment",
		"genre_Movies",
		"genre_Sport",
		"genre_News & Documentaries",
		"genre_Kids & Family",
		"genre_Music & Radio",
		"genre_Special Interest",
		"genre_hd"
	],

	ICONS: {
		BLOCKED: "c"
	},

	AUDIO_LANGUAGE: {
		ara: "Arabic",
        yue: "Cantonese",
		cmn: "Mandarin",
		ces: "Czech",
		est: "Estonian",
		// TODO: FP1-158 There isn't an ISO-639 code for Family
		fam: "Family",
		fij: "Fijian",
		fra: "French",
		deu: "German",
		ell: "Greek",
		heb: "Hebrew",
		hun: "Hungarian",
		hin: "Hindi",
		ind: "Indonesian",
		ita: "Italian",
		jpa: "Japanese",
		kor: "Korean",
		mal: "Malayalam",
		pol: "Polish",
		por: "Portuguese",
		rus: "Russian",
		slk: "Slovak",
		spa: "Spanish",
		// TODO: FP1-158 There isn't an ISO-639 code for Taiwanese
		tai: "Taiwanese",
		tha: "Thai",
		tur: "Turkish",
		vie: "Vietnamese",
        chi: "Chinese",
        zho: "Chinese",
        cze: "Czech",
        dan: "Danish",
        eng: "English",
        fin: "Finnish",
        fre: "French",
        ger: "Germany",
        jpn: "Japanese",
        lav: "Latvian",
        lit: "Lithuanian",
        bac: "Northern Accent",
        nam: "Southern Accent",
        und: "Original",
        swe: "Swedish",
        off: "Off",
        nno: "Norwegian",
        tsm: "Turkish",
        slv: "Slovenian",
        ulk: "Ukrainian",
        abv: "Arabic",
        faz: "Farsi",
        bul: "Bulgarian",
        ron: "Romanian",
        srp: "Serbian",
        dse: "Dutch",
        aln: "Albanian",
        gkm: "Greek",
        svk: "Slovak",
        isl: "Icelandic",
        csq: "Croatian"
    },
	//Parental Control
    MAX_PIN_DIGITS                            : 4,
    MAX_PIN_ENTRY_ATTEMPTS                    : 3,
    PIN_DIALOG_SHOW_TIME                      : 60000,
    MASTER_EXPIRATION_TIME                    : 28800,
    CHANNEL_LOCK_STATUS_CACHE_LIMIT           : 300,
    CHANNEL_OR_PROGRAM_LOCK_STATUS_CACHE_LIMIT: 600,
    DEFAULT_PARENTAL_PIN                      : "1234",
    BLOCKED_PIN_DURATION                      : 10 * 60 * 1000,
    BLOCKED_PIN_TIMESTAMP                     : "pin.blocked.timeStamp",

	//settings
	TERRESTRIAL_CHANNEL_TUNED_NO: "terrestrial.channel.tuned",
	
	//wifi settings
	SIGNAL_STRENGTH: {
		POOR   : 1,
		AVERAGE: 2,
		HIGH   : 3
	},

	INTERNET_STATUS_OVERLAY_dISPLAY_MODE: {
		DHCP  : "DHCP",
		TCP_IP: "TCP_IP"
	}
};
/*eslint-enable camelcase*/
