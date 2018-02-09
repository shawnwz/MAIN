/**
 * This class takes care of authenticating users with PINs, be they managed locally by an
 * application on the STB, or managed by the Conditional Access subsystem (card-less or card-based).
 * Client applications will typically need to call validateParentalPin method for authentication.
 * It's expected that applications will supply the UI necessary to capture PIN entry.
 *
 * The term 'local' PIN is used to refer to PINs cached locally on the STB.
 *
 * Some methods have dependencies on o5.platform.ca.ParentalControl, therefore, it is recommended
 * to call o5.platform.ca.ParentalControl.init() right after o5.platform.ca.PINHandler.init().
 *
 * @class o5.platform.ca.PINHandler
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.ca.PINHandler = new (function PINHandler () {
    this._SDP_USER_PIN = "sdp.user.pin";
    this._SDP_SLAVE_PIN = "sdp.slave.pin";
    this._MAXIMUM_PIN_LENGTH_PATH = "/users/preferences/userauth/maxPinLen";
    this._MAXIMUM_PIN_RETRIES_PATH = "/users/preferences/userauth/maxTrials";
    this._LOCK_TIME_PATH = "/users/preferences/userauth/lockDurationSec";
    this._MASTER_PIN_ERROR_NAME = "PinOrCurrentUserIsMaster";
    this._MASTER_PIN_PATH = "/users/preferences/userauth/pin/master/pinValue";
    this._currentUserPin = "";
    this._cachedMasterPin = "1234";
    this._userAuth = null;
    // Create event 'masterUserAuthenticated' for o5.platform.ca.ParentalControl to listen to
    // This event listener is registered in o5.platform.ca.ParentalControl.init()
    // This event is triggered in o5.platform.ca.PINHandler.validateParentalPin()
    this._authenticatedEvent = window.document.createEvent("Event");
    this._authenticatedEvent.initEvent("masterUserAuthenticated", true, true);
    this._authenticatedEvent.data = {};
})();

/**
 * Initializes the PIN handler
 *
 * @method init
 */
o5.platform.ca.PINHandler.init = function init () {
    this.logEntry();
    this._userAuth = CCOM.UserAuth;
    // Retrieve master PIN from configman and save to _cachedMasterPin
    this.getMasterPin();
    this.logExit();
};

/**
 * Returns the cached SDP PINs
 *
 * @method getAccountPins
 * @deprecated Application should manage SDP PINs
 * @return {Array} First element is the master PIN, second is the slave PIN
 */
o5.platform.ca.PINHandler.getAccountPins = function getAccountPins () {
    this.logEntry();
    return [ this.getAccountMasterPin(), this.getAccountSlavePin() ];
};

/**
 * Returns the cached SDP Master PIN
 *
 * @method getAccountMasterPin
 * @deprecated Application should manage SDP PINs
 * @return {String} Master PIN
 */
o5.platform.ca.PINHandler.getAccountMasterPin = function getAccountMasterPin () {
    this.logEntry();
    return o5.platform.system.Preferences.get(this._SDP_USER_PIN);
};

/**
 * Stores the (cached) SDP Master PIN in ConfigMan
 *
 * @method setAccountMasterPin
 * @deprecated Application should manage SDP PINs
 * @param {String} newPin New master PIN
 * @return {Boolean} True if the PIN was successfully stored, false otherwise
 */
o5.platform.ca.PINHandler.setAccountMasterPin = function setAccountMasterPin (newPin) {
    this.logEntry();
    return o5.platform.system.Preferences.set(this._SDP_USER_PIN, newPin);
};

/**
 * Returns the cached SDP Slave (VOD Purchase) PIN
 *
 * @method getAccountSlavePin
 * @deprecated Application should manage SDP PINs
 * @return {String} Slave PIN
 */
o5.platform.ca.PINHandler.getAccountSlavePin = function getAccountSlavePin () {
    this.logEntry();
    return o5.platform.system.Preferences.get(this._SDP_SLAVE_PIN);
};

/**
 * Stores the (cached) SDP Slave PIN in ConfigMan
 *
 * @method setAccountSlavePin
 * @deprecated Application should manage SDP PINs
 * @param {String} newPin New slave PIN
 * @return {Boolean} True if the PIN was stored successfully; false otherwise
 */
o5.platform.ca.PINHandler.setAccountSlavePin = function setAccountSlavePin (newPin) {
    this.logEntry();
    return o5.platform.system.Preferences.set(this._SDP_SLAVE_PIN, newPin);
};

/**
 * Sets the master pin in UAM to the given pin
 *
 * @method setLocalMasterPin
 * @async
 * @param {String} newPin The new master PIN
 * @param {Function} [callback] Optional callback function. Called once pin change call completes. True parameter is passed
 * to callback if call succeeds, false is passed if fails
 * @param {Boolean} callback.isChanged True if successful or false for failure.
 */
o5.platform.ca.PINHandler.setLocalMasterPin = function setLocalMasterPin (newPin, callback) {
    this.logEntry();
    var me = o5.platform.ca.PINHandler;
    var masterPinChanged;
    if (!callback) {
        callback = function (isChanged) {};
    }
    masterPinChanged = function (e) {
        me._userAuth.removeEventListener("changeMasterPinOK", masterPinChanged);
        me._userAuth.removeEventListener("changeMasterPinFailed", masterPinChanged);
        if (e.error) {
            me.logDebug("setLocalMasterPin() failed!");
            callback(false);
            return;
        } else {
            me.logDebug("setLocalMasterPin() successful!");
            me._cachedMasterPin = newPin;
            callback(true);
            return;
        }
    };
    this._userAuth.addEventListener("changeMasterPinOK", masterPinChanged);
    this._userAuth.addEventListener("changeMasterPinFailed", masterPinChanged);
    this._userAuth.changeMasterPin(this._cachedMasterPin, newPin);
    this.logExit();
};

/**
 * Validates if the given PIN is Master PIN. o5.platform.ca.ParentalControl.init() and
 * o5.platform.ca.ParentalControl.enableAuthentication() must be called prior to this method for
 * keepCurrentUser to work properly.
 *
 * @method validateParentalPin
 * @async
 * @param {String} enteredPin PIN to be validated
 * @param {Function} [callback] Optional callback to run once validation is complete
 * @param {Boolean} callback.isValidated Returns true if given PIN is master PIN
 * @param {String} callback.errorName If given PIN is not master PIN, this returns the error name.
 * This call causes the system to enforce a network security policy based on the number of retries in a
 * given period of time. If pin is looked up more than N times in a period P without a successful match,
 * system rejects further attempts until a time out passes.
 * @param {Boolean} [keepCurrentUser=false] If true, it will not change the current user. If false, it will
 * change the current user to master user. This parameter is only used when the given PIN is validated as
 * master PIN.
 */
o5.platform.ca.PINHandler.validateParentalPin = function validateParentalPin (enteredPin, callback, keepCurrentUser) {
    this.logEntry();
    var me = o5.platform.ca.PINHandler;
    var masterPinValidated,
        errorName;
    if (!callback) {
        callback = function (isValidated) {};
    }
    masterPinValidated = function (e) {
        me._userAuth.removeEventListener("queryUserProfileOK", masterPinValidated);
        me._userAuth.removeEventListener("queryUserProfileFailed", masterPinValidated);
        if (e.error && e.error.name === me._MASTER_PIN_ERROR_NAME) {
            // If enteredPin is master PIN...
            me._cachedMasterPin = enteredPin;
            if (!keepCurrentUser) {
                window.document.dispatchEvent(me._authenticatedEvent);
            }
            callback(true);
            return;
        } else {
            if (e.error && e.error.name) {
                errorName = e.error.name;
            }
            callback(false, errorName);
            return;
        }
    };
    this._userAuth.addEventListener("queryUserProfileOK", masterPinValidated);
    this._userAuth.addEventListener("queryUserProfileFailed", masterPinValidated);
    this._userAuth.queryUserProfile(enteredPin, null);
    this.logExit();
};

/**
 * Validates a PIN against slave pin.
 * Multiple users are not supported until OTV5.1
 * so just validated against master pin for OTV5.0
 *
 * @method validatePurchasePin
 * @deprecated Use validateParentalPin()
 * @async
 * @param {String} enteredPin PIN to be validated
 * @param {Function} [callback] Optional callback to run once validation is complete
 * @param {Boolean} callback.isValidated True if successful or false for failure.
 * @param {Boolean} callback.errorName  Error name is set if false.
 */
o5.platform.ca.PINHandler.validatePurchasePin = function validatePurchasePin (enteredPin, callback) {
    this.logEntry();
    this.validateParentalPin(enteredPin, callback);
    this.logExit();
};

/**
 * Validates a PIN against CA's PPV PIN
 *
 * @method validateCAPurchasePin
 * @deprecated
 * @param {String} enteredPin PIN to be validated
 * @return {Number} Status code from CA (see CCOM-CA 1.2 documentation for valid codes)
 */
o5.platform.ca.PINHandler.validateCAPurchasePin = function validateCAPurchasePin (enteredPin) {
    this.logEntry();
    this.logExit();
    return -8; // CA.CA_STATUS_INVALID
};

/**
 * Sets the PIN of the user identified with the oldPin to the newPin
 *
 * @method setUserPin
 * @deprecated  only supported in OTV5.1
 * @param {String} newPin new user pin
 * @param {String} oldPin old user pin
 */
o5.platform.ca.PINHandler.setUserPin = function setUserPin (newPin, oldPin) {
    this.logEntry();
    this.logExit();
};

/**
 * Sets the default master pin to the given newDefaultPin
 *
 * @method setDefaultMasterPin
 * @deprecated Does nothing, use setLocalMasterPin() to set master PIN
 * @param {String} newDefaultPin Default master pin
 */
o5.platform.ca.PINHandler.setDefaultMasterPin = function setDefaultMasterPin (newDefaultPin) {
    this.logDeprecated();
};

/**
 * Sets the maximum number of digits a pin number can contain. Need to reboot the
 * system for this change to take affect.
 * @method setMaximumPinLength
 * @param {Number} length Maximum number of digits a pin number
 */
o5.platform.ca.PINHandler.setMaximumPinLength = function setMaximumPinLength (length) {
    this.logEntry();
    CCOM.ConfigManager.setValue(this._MAXIMUM_PIN_LENGTH_PATH, length);
    this.logExit();
};

/**
 * Sets the maximum number of times the user can enter an invalid PIN
 * before they are unable to try again after the time set in the
 * `setIdleTimeAfterInvalidPinEntries` call has expired
 *
 * @method setMaximumPinRetries
 * @param {Number} retries Maximum number of times
 */
o5.platform.ca.PINHandler.setMaximumPinRetries = function setMaximumPinRetries (retries) {
    this.logEntry();
    CCOM.ConfigManager.setValue(this._MAXIMUM_PIN_RETRIES_PATH, retries);
    this.logExit();
};

/**
 * Gets the maximum number of times the user can enter an invalid PIN
 * before they are unable to try again after the time set in the
 * `setIdleTimeAfterInvalidPinEntries` call has expired
 *
 * @method getMaximimumPinRetries
 * @return {Object} Returns an object with the following attribute:
 *
 *        keyValue {Number} Maximum Pin retries
 */
o5.platform.ca.PINHandler.getMaximimumPinRetries = function getMaximimumPinRetries () {
    this.logEntry();
    return CCOM.ConfigManager.getValue(this._MAXIMUM_PIN_RETRIES_PATH);
};

/**
 * Sets the time to wait before a user can re-enter a PIN number
 * after they have incorrectly entered the PIN the amount of times
 * set in the setMaximumPinRetries call
 *
 * @method setLockTimeAfterInvalidPinEntries
 * @param {Number} time Number of seconds to lock the user out
 */
o5.platform.ca.PINHandler.setLockTimeAfterInvalidPinEntries = function setLockTimeAfterInvalidPinEntries (time) {
    this.logEntry();
    CCOM.ConfigManager.setValue(this._LOCK_TIME_PATH, time);
    this.logExit();
};

/**
 * Gets the time to wait before a user can re-enter a PIN number
 * after they have incorrectly entered the PIN the amount of times
 * @method getLockTimeAfterInvalidPinEntries
 * @return {Object} Returns an object with the following attribute:
 *
 *        keyValue {Number} Max lock time in seconds or undefined if not found
 */
o5.platform.ca.PINHandler.getLockTimeAfterInvalidPinEntries = function getLockTimeAfterInvalidPinEntries () {
    this.logEntry();
    return CCOM.ConfigManager.getValue(this._LOCK_TIME_PATH);
};

/**
 * Determines the identity of the user using the PIN entered
 * @method isPinCurrentUser
 * @param {String} userPin User Identified
 * @return {Boolean} True if the entered PIN authenticates the current user; false otherwise
 */
o5.platform.ca.PINHandler.isPinCurrentUser = function isPinCurrentUser (userPin) {
    this.logEntry();
    return userPin === this._currentUserPin ? true : false;
};

/**
 * Returns the current master pin
 * @method getMasterPin
 * @return {String} Master pin
 */
o5.platform.ca.PINHandler.getMasterPin = function getMasterPin () {
    this.logEntry();
    // CCOM.UserAuth stores encrypted master PIN in this configman path
    this._cachedMasterPin = CCOM.ConfigManager.getValue(this._MASTER_PIN_PATH).keyValue || this._cachedMasterPin;
    return this._cachedMasterPin;
};

/**
 * Returns the current master pin
 * @method getLocalMasterPin
 * @deprecated Use getMasterPin()
 * @return {String} Master pin
 */
o5.platform.ca.PINHandler.getLocalMasterPin = function getLocalMasterPin () {
    this.logDeprecated();
    return this.getMasterPin();
};

// uncomment to turn debugging on for PINHandler object
// o5.log.setAll(o5.platform.ca.PINHandler, true);
