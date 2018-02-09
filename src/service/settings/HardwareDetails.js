/**
 * @class $service.settings.HardwareDetails
 */
"use strict";

$service.settings.HardwareDetails = (function HardwareDetails() {
    return {

        /**
         * @method getBrowserUptime
         * @public
         * @return {Object}
         */
        getBrowserUptime: function getBrowserUptime() {
            var upTimeInMs = Date.now() - $config.getConfigValue("settings.browser.start.time"),
                days = Math.floor(upTimeInMs / $util.constants.DAY_IN_MS),
                hours = Math.floor((upTimeInMs % $util.constants.DAY_IN_MS) / $util.constants.HOUR_IN_MS),
                minutes = Math.floor((upTimeInMs % $util.constants.HOUR_IN_MS) / $util.constants.MINUTE_IN_MS),
                seconds = Math.round((upTimeInMs % $util.constants.MINUTE_IN_MS / 1000));
            return {
                text: ((days > 0) ? "" + days + " days " : "") +
                    ((hours < 10) ? "0" : "") + hours + "h:" +
                    ((minutes < 10) ? "0" : "") + minutes + "m:" +
                    ((seconds < 10) ? "0" : "") + seconds + "s"
            };
        },

        /**
         * @method getHdmiConnectivity
         * @public
         * @return {Object}
         */
        getHdmiConnectivity: function getHdmiConnectivity() {
            // TODO - FP1-161 - Advanced Settings - Hardware Details:
            // o5.platform.output.AV.isHDOutputAvailable() currently returns error, use CCOM directly for now
            return {
                text: (CCOM.System.hdmiState === CCOM.System.HDMI_STATE_CONNECTED) ? "yes" : "no"
            };
        },

        /**
         * @method getHdcpStatus
         * @public
         * @return {Object}
         */
        getHdcpStatus: function getHdcpStatus() {
            if ($service.settings.AV.isHdcpStatusAuthenticated()) {
                return {
                    text: "hdcp_status_success"
                };
            }
            return {
                text: "hdcp_status_failed"
            };

        },

        /**
         * @method getNativeResolution
         * @public
         * @return {Object}
         */
        getNativeResolution: function getNativeResolution() {
            // CCOM.System.hdmiVideoFormat is a bitmask value, need to work out the highest resolution.
            var hdmiCapList = CCOM.System.hdmiVideoFormat,
                closestPower = Math.pow(2, Math.ceil(Math.log(hdmiCapList) / Math.log(2))),
                hdmiCap = (closestPower > hdmiCapList) ? closestPower / 2 : closestPower,
                nativeResolution = "";

            switch (hdmiCap) {
                case CCOM.System.HDMI_VIDEO_FORMAT_480I:
                    nativeResolution = "480i";
                    break;
                case CCOM.System.HDMI_VIDEO_FORMAT_480P:
                    nativeResolution = "480p";
                    break;
                case CCOM.System.HDMI_VIDEO_FORMAT_576I:
                    nativeResolution = "576i";
                    break;
                case CCOM.System.HDMI_VIDEO_FORMAT_576P:
                    nativeResolution = "576p";
                    break;
                case CCOM.System.HDMI_VIDEO_FORMAT_720P:
                    nativeResolution = "720p";
                    break;
                case CCOM.System.HDMI_VIDEO_FORMAT_1080I:
                    nativeResolution = "1080i";
                    break;
                case CCOM.System.HDMI_VIDEO_FORMAT_1080P:
                    nativeResolution = "1080p";
                    break;
                case CCOM.System.HDMI_VIDEO_FORMAT_2160P:
                    nativeResolution = "2160p";
                    break;
                case CCOM.System.HDMI_VIDEO_FORMAT_4320P:
                    nativeResolution = "4320p";
                    break;
                default:
                    nativeResolution = "unkown";
                    break;
            }

            return {
                text: nativeResolution
            };
        }

    };
}());

