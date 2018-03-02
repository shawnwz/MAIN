/**
 * @class LaunchAppUtil
 */
$actions.app.LaunchAppUtil = (function LaunchAppUtil() {

    function launchWebApp(uuid) {
        console.log("_launchWebApp: launching " + uuid);
        var portParam,
            appInfo = {
                        "appId" : "",
                        "author": "",
                        "args"  : ""
                    };

        if (uuid === "NAGRAYouTubehtml") {
            portParam = CCOM.ConfigManager.getValue("/system/opentv/DIAL/dialPort").keyValue;
            appInfo.appId = "YouTube";
            appInfo.author = "NAGRA";
            appInfo.args  =  "?launch=menu&additionalDataUrl=http%3A%2F%2Flocalhost%3A" + portParam + "%2Fapps%2FYouTube%2Fdial_data";

        } else if (uuid === "NAGRAiViewhtml") {

            appInfo.appId  = "iView"; // Please check the appid
            appInfo.author = "NAGRA";
            appInfo.args   =  "";
        }
        //eslint-disable-next-line new-cap
        $actions.app.OTVControlApp.LaunchInstalledApp(appInfo);
    }
    function lanchApp(data) {
        this.logEntry();

        //console.log("APP LAUNCH DISABLED");
        //return;
        var title = data ? data.title : null;
        console.log("APP LAUNCH title" + title);
        if (title === null) {
            // something not right... nothing selected
        } else if (title === "SBS OnDemand") {
            console.log("launch SBS OD");
        } else if (title === "YouTubeTV") {
            console.log("launch YouTube");
            launchWebApp("NAGRAYouTubehtml", "https://www.youtube.com/tv");
        } else if (title === "ABC iView") {
            console.log("launch iView");
            launchWebApp("NAGRAiViewhtml", "http://tv.iview.abc.net.au/iq.php");
        } else if (title === "NETFLIX") {
            console.log("launch Netflix");
            //eslint-disable-next-line new-cap
            $actions.app.OTVControlApp.LaunchNetFlix();
        }
        this.logExit();
    }
       // Public API

    return {

    /**
     * @method init
     * @public
     */
        init: function () {
			$util.Events.on("app:launch", lanchApp);
        }

    };
}());
