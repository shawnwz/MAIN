"use strict";
app.screenConfig.settings.CHANNEL_SCAN = {
    text           : "Channel Scan",
    footerClassList: ["ctaClose"],
    getMenu        : function getMenu() {
        return [
            {
                id    : "fullScan",
                text  : "settingsMenuTitleFullScan",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsFullScanView", "title": "settingsMenuTitleFullScan" }
                    }
                ]
            },
            {
                id    : "quickScan",
                text  : "settingsMenuTitleQuickScan",
                events: [
                    {
                        name: "settings:loadScreen",
                        data: {
                            screen: "START_SCAN",
                            type  : "QUICK" // TODO: FP1-175 Terrestrial Channels - Quick Scan - pass this type to the scan if required
                        }
                    }
                ]
            },
            {
                id    : "localChannelSources",
                text  : "settingsMenuTitleLocalChannelSources",
                events: []
            }
        ];
    }
};
