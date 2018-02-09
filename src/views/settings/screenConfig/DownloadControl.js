"use strict";
var downloadBufferSizeOptions = $service.settings.IpNetwork.getDownloadBufferSizeOptions(),
	downloadBufferSizeIndex = 0,
	downloadBufferSizeValue = 0,
	bandwidthQualityOptions = $service.settings.IpNetwork.getBandwidthQualityOptions(),
	bandwidthQualityIndex = 0,
	bandwidthQualityValue = 0,
	getdownloadBufferSizeOptions = function() {
		downloadBufferSizeOptions.some(function (element, index) {
			if (element.value === $config.getConfigValue("settings.ipnetwork.download.buffer.size")) {
				downloadBufferSizeIndex = index;
				downloadBufferSizeValue = element.value;
				return true;
			}
		});
	},
	getbandwidthQualityOptions = function() {
		bandwidthQualityOptions.some(function (element, index) {
			if (element.value === $config.getConfigValue("settings.ipnetwork.bandwidth.quality")) {
				bandwidthQualityIndex = index;
				bandwidthQualityValue = element.value;
				return true;
			}
		});
	};

getdownloadBufferSizeOptions();
getbandwidthQualityOptions();

app.screenConfig.settings.DOWNLOAD_CONTROL = {
	text       : "settingsMenuDownloadControlTitle",
	defaultitem: {
		settingsMenuDownloadControlDownloadBufferSize: "small",
		settingsMenuDownloadControlBandwidthQuality  : "best"
	},
	saveditem: {
		settingsMenuDownloadControlDownloadBufferSize: downloadBufferSizeValue,
		settingsMenuDownloadControlBandwidthQuality  : bandwidthQualityValue
	},
	currentitem: {
		settingsPinEntryForClassifiedProgram       : downloadBufferSizeValue,
		settingsMenuDownloadControlBandwidthQuality: bandwidthQualityValue
	},
	resetDefaults  : "settings:downloadControl:resetDefaults",
	undoChanges    : "settings:downloadControl:undoChanges",
	footerClassList: [ "ctaClose", "ctaResetDefaults" ],
	getMenu        : function getMenu() {
		getdownloadBufferSizeOptions();
		getbandwidthQualityOptions();
		app.screenConfig.settings.DOWNLOAD_CONTROL.saveditem.settingsMenuDownloadControlDownloadBufferSize = downloadBufferSizeValue;
		app.screenConfig.settings.DOWNLOAD_CONTROL.saveditem.settingsMenuDownloadControlBandwidthQuality = bandwidthQualityValue;
		
		return [
			{
				id  : "settingsMenuDownloadControlDownloadBufferSize",
				text: "settingsDownloadControlBufferSize",
				data: {
					type: "settingsToggle",
					get : function get() {
						return downloadBufferSizeOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return downloadBufferSizeIndex;
					},
					events: [
						{
							name: "settings:downloadControl:setDownloadBufferSize"
						}
					]
				}
			},
			{
				id  : "settingsMenuDownloadControlBandwidthQuality",
				text: "settingsDownloadControlBandwidthQuality",
				data: {
					type: "settingsToggle",
					get : function get() {
						return bandwidthQualityOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return bandwidthQualityIndex;
					},
					events: [
						{
							name: "settings:downloadControl:setBandwidthQuality"
						}
					]
				}
			}
		];
	}
};
