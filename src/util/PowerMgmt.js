$util.PowerMgmt = (function () {
    "use strict";

    /**
     * Send the box to stand by and wake it up back when power key is pressed
     * @method powerKeyhandler
     * @return {void}
     */
    function powerKeyHandler() {
        if (CCOM && CCOM.Pwrmgr) {
            var powerManagerRespose = null,
                powerManagerUserMode = null,
                powerMgr = CCOM.Pwrmgr,
                outOfStandBy = "";
            if (powerMgr) {
                powerManagerRespose = powerMgr.userModeGet();
                powerManagerUserMode = powerManagerRespose.error ? false : powerManagerRespose.mode;
                if (powerManagerUserMode !== false) {
                    if (powerManagerUserMode === powerMgr.STANDBY_OFF) {
                        powerMgr.userModeSet(powerMgr.STANDBY_ON);
                    } else {
                        powerMgr.userModeSet(powerMgr.STANDBY_OFF);

                        outOfStandBy = $config.getConfigValue("settings.tv.guide.out.of.standby");
                        if (outOfStandBy === "homepage") {
                            $util.ControlEvents.fire("app-video", "stop");
                            //home page
                            $util.Events.fire("app:navigate:to", "home-menu");
                            $util.ControlEvents.fire("app-home-menu:portalMenu", "select", 0); // homeMenu view, home page
                        } else {
                            $util.ControlEvents.fire("app-player", "stop"); // this get last service and tune to
                            // last channel view
                            $util.Events.fire("app:navigate:to:default");
                        }
                    }
                }
            }
        }
    }

    /**
     * send the mode type the box currently in
     * @method getPowerMode
     * @return {Boolean} when standby mode
     */
    function getPowerMode() {
    	var powerMgr = CCOM.Pwrmgr,
    	    currentMode = powerMgr.userModeGet(),
            res = false;
    	if (currentMode === powerMgr.STANDBY_ON) {
    		res = true;
    	}
        return res;
    }
    return {
        handler     : powerKeyHandler,
        getPowerMode: getPowerMode
    };
}());
