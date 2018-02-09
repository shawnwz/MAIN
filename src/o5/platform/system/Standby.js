/**
 * This class contains methods that put the device into standby mode or wake it from a standby mode.
 * It makes use of a SystemStandby event listener and a SystemWake event listener for when the device
 * is put into and out of standby mode respectively.
 * Callers can register listeners and perform any activities when the class goes into Standby mode.
 *
 * @class o5.platform.system.Standby
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.system.Standby = new (function Standby () {})();

/**
 * @method init
 * @deprecated Does nothing
 */
o5.platform.system.Standby.init = function init () {
    this.logDeprecated();
};

/**
 * Determines whether the device is in standby mode.
 * @method isInStandbyMode
 * @return {Boolean} Returns true if the device is in standby mode, otherwise false.
 */
o5.platform.system.Standby.isInStandbyMode = function isInStandbyMode () {
    var isStandBy = false;
    /*  CCOM.Pwrmgr enum value:
        STANDBY_OFF value="0"
        STANDBY_ON  value="1"
        LOW_POWER   value="2"
    */
    var res = CCOM.Pwrmgr.userModeGet();

    if (!res.error && res.status === 0) {
        isStandBy = (res.mode === CCOM.Pwrmgr.STANDBY_ON);
    }
    return isStandBy;
};

/**
 * Registers a callback function to be invoked when the device goes into standby mode or
 * returns (wake up) from standby mode.
 * @method registerStandbyListener
 * @param {Function} callbackFunction Callback function to be invoked when device goes into
 * standby mode or returns (wake up) from standby mode.
 * @param {Object} callbackFunction.e Return object
 * @param {Number} callbackFunction.e.pwrmgrMode Indicates the mode of standby entered.
 * The type of standby mode is:
 * <ul>
 * <li>0 STANDBY_OFF (i.e. wakes up)</li>
 * <li>1 STANDBY_ON</li>
 * <li>2 LOW_POWER</li>
 * </ul>
 */
o5.platform.system.Standby.registerStandbyListener = function registerStandbyListener (callbackFunction) {
    this.logEntry();
    CCOM.Pwrmgr.addEventListener("onPwrmgrModeChanged", callbackFunction, false);
    this.logExit();
};

/**
 * Unregisters a previously registered callback function from the standby mode event.
 * @method unregisterStandbyListener
 * @param {Function} callbackFunction Callback function to be unregistered
 */
o5.platform.system.Standby.unregisterStandbyListener = function unregisterStandbyListener (callbackFunction) {
    this.logEntry();
    CCOM.Pwrmgr.removeEventListener("onPwrmgrModeChanged", callbackFunction, false);
    this.logExit();
};

/**
 * @method registerWakeListener
 * @deprecated Use registerStandbyListener() to receive callback for standby and wake
 * @param {Function} callbackFunction Callback function to be invoked
 */
o5.platform.system.Standby.registerWakeListener = function registerWakeListener (callbackFunction) {
    this.logEntry();
    CCOM.System.addEventListener("onSystemWake", callbackFunction, false);
    this.logExit();
};

/**
 * @method unregisterWakeListener
 * @deprecated This method is deprecated because registerWakeListener() is deprecated
 * @param {Function} callbackFunction Callback function to be invoked
 */
o5.platform.system.Standby.unregisterWakeListener = function unregisterWakeListener (callbackFunction) {
    this.logEntry();
    CCOM.System.removeEventListener("onSystemWake", callbackFunction, false);
    this.logExit();
};

/**
 * Set the device to standby mode
 * @method standby
 * @return {Boolean} Returns true if setting is successful, otherwise false.
 */
o5.platform.system.Standby.standby = function standby () {
    this.logInfo("started");
    var result = true,
        ret;
    if (!this.isInStandbyMode()) {
        ret = CCOM.Pwrmgr.userModeSet(CCOM.Pwrmgr.STANDBY_ON);
        if (ret && ret.status === 0) {
            result = true;
        } else {
            result = false;
        }
    }
    this.logInfo("standby", "completed");
    return result;
};

/**
 * Set the device to wake up from standby mode
 * @method wake
 * @return {Boolean} Returns true if setting is successful, otherwise false.
 */
o5.platform.system.Standby.wake = function wake () {
    this.logInfo("started");
    var result = true,
        ret;
    if (this.isInStandbyMode()) {
        ret = CCOM.Pwrmgr.userModeSet(CCOM.Pwrmgr.STANDBY_OFF);
        if (ret && ret.status === 0) {
            result = true;
        } else {
            result = false;
        }
    }
    this.logInfo("completed");
    return result;
};

// uncomment to turn debugging on for Standby object
// o5.log.setAll(o5.platform.system.Standby, true);
