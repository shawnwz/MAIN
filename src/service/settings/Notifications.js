/**
 * @class $service.settings.Notifications
 */
"use strict";

$service.settings.Notifications = (function Notifications() {

    return {

        /**
         * @method getReminderAdvancedTimeOptions
         * @public
         * @return {Object}
         */
        getReminderAdvancedTimeOptions: function getReminderAdvancedTimeOptions() {
            return [
                {
                    id   : "reminderAdvancedTime30s",
                    value: 30,
                    text : "30 " + $util.Translations.translate("shortSeconds")
                },
                {
                    id   : "reminderAdvancedTime60s",
                    value: 60,
                    text : "60 " + $util.Translations.translate("shortSeconds")
                },
                {
                    id   : "reminderAdvancedTime90s",
                    value: 90,
                    text : "90 " + $util.Translations.translate("shortSeconds")
                }
            ];
        },

        /**
         * @method getDeleteConfirmationOptions
         * @public
         * @return {Object}
         */
        getDeleteConfirmationOptions: function getDeleteConfirmationOptions() {
            return [
                {
                    id   : "deleteConfirmationUnviewed",
                    value: "unviewed",
                    text : "unviewed"
                },
                {
                    id   : "deleteConfirmationAll",
                    value: "all",
                    text : "all"
                },
                {
                    id   : "deleteConfirmationNone",
                    value: "none",
                    text : "none"
                }
            ];
        },

        /**
         * @method getIpVideoUsageWarningOptions
         * @public
         * @return {Object}
         */
        getIpVideoUsageWarningOptions: function getIpVideoUsageWarningOptions() {
            return [
                {
                    value: true,
                    text : "on"
                },
                {
                    value: false,
                    text : "off"
                }
            ];
        },

        /**
         * @method getDownloadNotificationReminderOptions
         * @public
         * @return {Object}
         */
        getDownloadNotificationReminderOptions: function getDownloadNotificationReminderOptions() {
            return [
                {
                    id   : "dlNotiReminderReady",
                    value: "ready",
                    text : "ready"
                },
                {
                    id   : "dlNotiReminderDownloaded",
                    value: "downloaded",
                    text : "downloaded"
                },
                {
                    id   : "dlNotiReminderNone",
                    value: "none",
                    text : "none"
                }
            ];
        },

        /**
         * @method getBannerTimeoutOptions
         * @public
         * @return {Object}
         */
        getBannerTimeoutOptions: function getBannerTimeoutOptions() {
            return [
                {
                    id   : "bannerTimeout1Sec",
                    value: 1,
                    text : "1 " + $util.Translations.translate("shortSeconds")
                },
                {
                    id   : "bannerTimeout5Sec",
                    value: 5,
                    text : "5 " + $util.Translations.translate("shortSeconds")
                },
                {
                    id   : "bannerTimeout10Sec",
                    value: 10,
                    text : "10 " + $util.Translations.translate("shortSeconds")
                }
            ];
        },

        /**
         * @method getBannerTimeoutOptions
         * @public
         * @return {Object}
         */
        getHdcpWarningSettingsOptions: function getHdcpWarningSettingsOptions() {
            return [
                {
                    id   : "hdcpWarningSettingsAll",
                    value: "allWarnings",
                    text : "allWarnings"
                },
                {
                    id   : "hdcpWarningSettingsNo",
                    value: "noWarnings",
                    text : "noWarnings"
                },
                {
                    id   : "hdcpWarningSettingsDisable",
                    value: "disableOnly",
                    text : "disableOnly"
                }
            ];
        }

    };
}());

