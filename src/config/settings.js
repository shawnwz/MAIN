
$config.addDefaultSettings({

	/*
	 * {Object}
	 */
	"settings.view.theme": {
		value   : "Rel8",
		override: false
	},

	/*
	 * {Object}
	 */
	"settings.home.scrollbar.timeout": {
		value   : "2000",
		override: false
	},

	/*
	 * {Object}
	 */
	"settings.browser.start.time": {
		value   : Date.now(),
		override: true
	},

	/*
	 * {Object}
	 */
	"settings.browser.reboot.times": {
		value   : -1,
		override: false
	},

	/*
	 * {Object}
	 */
	"settings.av.spdif.delay.options": {
		value: {
			count: 21,
			step : 10
		},
		override: false
	},

	/*
	 * {Int}
	 */
	"settings.av.spdif.attenuation": {
		value   : 0,
		override: false
	},

	/*
	 * {String}
	 */
	"settings.ipnetwork.download.buffer.size": {
		value   : "small",
		override: false
	},

	/*
	 * {String}
	 */
	"settings.ipnetwork.bandwidth.quality": {
		value   : "best",
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.privacy.content.recommendations": {
		value   : false,
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.privacy.suggestions": {
		value   : true,
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.notifications.ip.video.usage.warning.enable": {
		value   : true,
		override: false
	},

	/*
	 * {String}
	 */
	"settings.notifications.delete.confirmation": {
		value   : "unviewed",
		override: false
	},

	/*
	 * {Int}
	 */
	"settings.notifications.reminder.advanced.time": {
		value   : 60,
		override: false
	},

	/*
	 * {Int}
	 */
	"settings.notifications.banner.timeout": {
		value   : 10,
		override: false
	},

	/*
	 * {String}
	 */
	"settings.notifications.hdcp.warning.settings": {
		value   : "allWarnings",
		override: false
	},

	/*
	 * {Number}
	 */
	"settings.notifications.channel-entry.timeout": {
		value   : 10,
		override: false
	},

	/*
	 * {Number}
	 */
	"settings.notifications.channel-entry-tune.timeout": {
		value   : 3,
		override: false
	},

	/*
	 * {String}
	 */
	"settings.viewrestrictions.pin.entry.for.classified.program": {
		value   : "ratingR",
		override: false
	},

	/*
	 * {String}
	 */
	"settings.viewrestrictions.hide.info.posters.for.classified.program": {
		value   : "ratingR",
		override: false
	},

	/*
	 * {String}
	 */
	"settings.viewrestrictions.pin.entry.for.non.classified.program": {
		value   : false,
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.tv.guide.background.vision": {
		value   : true,
		override: false
	},

	/*
     * {String}
     */
    "settings.tv.guide.pip.audio": {
        value   : true,
        override: false
    },

    /*
     * {String}
     */
    "settings.tv.guide.background.audio": {
        value   : true,
        override: false
    },

    /*
	 * {String}
	 */
	"settings.tv.guide.pip.scan": {
		value   : true,
		override: false
	},

	/*
	 * {String}
	 */
	"settings.tv.guide.channel.name.display": {
		value   : "logo",
		override: false
	},

	/*
	 * {Float}
	 */
	"settings.tv.guide.grid.pixels": {
		value   : (233 / 30),
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.tv.guide.now.and.next": {
		value   : true,
		override: false
	},

	/*
	 * {String}
	 */
	"settings.tv.guide.out.of.standby": {
		value   : "lastViewedChannel",
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.tv.guide.instant.rewind": {
		value   : true,
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.tv.guide.engery.saving.mode": {
		value   : "high",
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.pinControl.purchase": {
		value   : false,
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.pinControl.keptProgrammes": {
		value   : false,
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.pinControl.ipVideo": {
		value   : false,
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.bluetooth.capsense": {
		value   : false,
		override: false
	},

	/*
	 * {Object}
	 */
	"settings.tcpIp.IpConfig": {
		value   : true,
		override: false
	},

	/*
	 * {Object}
	 */
	"settings.tcpIp.IpAddress": {
		value   : "0.0.0.0",
		override: false
	},

	/*
	 * {Object}
	 */
	"settings.tcpIp.subnetMask": {
		value   : "0.0.0.0",
		override: false
	},

	/*
	 * {Object}
	 */
	"settings.tcpIp.defaultGateway": {
		value   : "0.0.0.0",
		override: false
	},

	/*
	 * {Object}
	 */
	"settings.tcpIp.primaryDns": {
		value   : "0.0.0.0",
		override: false
	},

	/*
	 * {Object}
	 */
	"settings.tcpIp.secondaryDns": {
		value   : "0.0.0.0",
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.installer.lnb.power": {
		value   : true,
		override: false
	},

	/*
	 * {Boolean}
	 */
	"settings.installer.lnb.frequencyCommand": {
		value   : false,
		override: false
	},

	/*
	 * {String}
	 */
	"settings.installer.lnb.highBandLowFrequency": {
		value   : "10.7",
		override: false
	}
});
