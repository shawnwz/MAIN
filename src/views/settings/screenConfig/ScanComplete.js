"use strict";
app.screenConfig.settings.SCAN_COMPLETE = {
    getMenu: function getMenu() {
        return [
            {
                id    : "viewGuide",
                text  : "settingsMenuScanResultsGuide",
                events: [
                    {
                        name: "settings:scan:reset"
                    },
                    {
                        name: "app:navigate:to",
                        data: "surf"
                    }
                ]
            },
            {
                id    : "scanAgain",
                text  : "settingsMenuScanResultsAgain",
                events: [
                    {
                        name: "settings:scan:reset"
                    },
                    {
                        name: "settings:scan:rescan"
                    }
                ]
            }
        ];
    }
};
