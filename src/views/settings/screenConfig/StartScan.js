"use strict";
app.screenConfig.settings.START_SCAN = {
    text           : "Scan",
    footerClassList: ["ctaClose"],
    getMenu        : function getMenu() {
        return [
            {
                id    : "startScan",
                text  : "settingsMenuStartScan",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsScanningView", "title": "settingsMenuTitleFullScan" }
                    },
                    {
                        name: "settings:startScan"
                    }
                ],
                data: {
                    avoidSettingsTitleUpdate: true
                }
            }
        ];
    }
};
