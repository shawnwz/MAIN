"use strict";
var resolutionOptions = $service.settings.AV.getResolutionOptions(),
	resolutionIndex = 0,
	resolutionValue = 0,
	aspectModeOptions = $service.settings.AV.getAspectModesOptions(),
	aspectModeIndex = 0,
	// eslint-disable-next-line no-unused-vars
	aspectModeValue = 0,
	hdcpStatus,

	/*themeOptions = $service.settings.AV.getThemeOptions(),
	themeIndex = 0;*/

	getResolutionIndex = function () {
        var auto = o5.platform.system.Preferences.get("/users/preferences/autoResolution", true);
        if (auto) {
            resolutionIndex = 0;
            resolutionValue = "auto";
            return true;
        }
        resolutionOptions.some(function (element, index) {
            var resolution = o5.platform.output.AV.getResolution();
            if (element.value === resolution) {
                if (resolution === "auto") {
                    // TODO: need to handle business logic for auto resolution
                    // FP1-157 Advanced Settings - Picture Settings
                    return true;
                }
                resolutionIndex = index;
                resolutionValue = element.value;
                return true;
            }
        });
    },
	getAspectModeIndex = function () {
		aspectModeOptions.some(function (element, index) {
			if (element.value === o5.platform.output.AV.getHDVideoAspectMode()) {
				aspectModeIndex = index;
				aspectModeValue = element.value;
				return true;
			}
		});
	};
getResolutionIndex();
getAspectModeIndex();
app.screenConfig.settings.PICTURE = {
	component      : "settingsConfig",
    text           : "pictureSettings",
	defaultitem    : { settingsMenuPictureHDOutput: "auto", settingsMenuPicture43: aspectModeValue },
	saveditem      : { settingsMenuPictureHDOutput: resolutionValue, settingsMenuPicture43: aspectModeValue },
	currentitem    : { settingsMenuPictureHDOutput: resolutionValue, settingsMenuPicture43: aspectModeValue },
	resetDefaults  : "settings:picture:resetDefaults",
	undoChanges    : "settings:picture:undoChanges",
	footerClassList: [ "ctaClose", "ctaResetDefaults" ],
	getMenu        : function getMenu() {
		getResolutionIndex();
		getAspectModeIndex();
		app.screenConfig.settings.PICTURE.saveditem.settingsMenuPictureHDOutput = resolutionValue;
		app.screenConfig.settings.PICTURE.saveditem.settingsMenuPicture43 = aspectModeValue;

		/*themeOptions.some(function (element, index) {
			if (element.value === $config.getConfigValue("settings.view.theme")) {
				themeIndex = index;
				return true;
			}
		});*/

		return [
			{
				id  : "settingsMenuPictureHDOutput",
                text: "settingsMenuPictureHDOut",
				data: {
					type: "settingsToggle",
					get : function get() {
						return resolutionOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return resolutionIndex;
					},
					events: [
						{
							name: "settings:av:setResolution"
						}
					]
				}
			},
			{
				id  : "settingsMenuPictureHDCP",
                text: "settingsMenuPictureHDCP",
				data: {
					type        : "settingsText",
					isSelectable: false,
					get         : function get() {
						return {
                            text : ($service.settings.AV.isHdcpStatusAuthenticated()) ? "hdcp_status_success" : "hdcp_status_failed",
							value: hdcpStatus
						};
					},
					events: []
				}
			},
			{
				id  : "settingsMenuPicture43",
                text: "settingsMenuPicture43",
				data: {
					type: "settingsToggle",
					get : function get() {
						return aspectModeOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return aspectModeIndex;
					},
					events: [
						{
							name: "settings:av:setHDVideoAspectMode"
						}
					]
				}
			}/*,
			{
				id  : "settingsMenuPictureTheme",
                text: "",
				data: {
					type: "settingsToggle",
					get : function get() {
						return themeOptions;
					},
					getSelectedIndex: function getSelectedIndex() {
						return themeIndex;
					},
					events: [
						{
							name: "settings:av:setTheme"
						}
					]
				}
			}*/
		];
	}
};
