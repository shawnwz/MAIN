/**
 * Preferences is a singleton utility class for manipulating with a CCOM.ConfigManager. It contains methods to set and get
 * application preferences which may be as simple as a string or a number, or as complicated as an array of JS objects.
 *
 * @class o5.platform.system.Preferences
 * @singleton
 * 
 * @deprecated This is a legacy API from the old JSFW and will be replaced by newer APIs with a future O5.js version
 */

o5.platform.system.Preferences = new (function Preferences () {
    // Callback hashmap for 'onValueChanged' (key=key path, value=array of registered callbacks)
    this._callbackList = {};
    this._jsfwPrefsPrefix = "/applications/shared/";
})();

/**
 * @method _onChangeHandler
 * @private
 * @param {Object} e Event object returned from `onValueChanged` event.
 */
o5.platform.system.Preferences._onChangeHandler = function _onChangeHandler (e) {
    var i,
        callbacks,
        me = o5.platform.system.Preferences;

    if (me._callbackList[e.keyPath]) {
        callbacks = me._callbackList[e.keyPath];
        for (i = 0; i < callbacks.length; i++) {
            callbacks[i].callback.call(callbacks[i].context, e.keyValue);
        }
    }
};

/**
 * Helper function to remove a specified value from a serialized JavaScript array. Removing value from
 * array of objects does not work. It only works on arrays of strings, numbers, and booleans.
 * @method _removeFromPrefsArray
 * @private
 * @param {String} preference Key path to configuration
 * @param {Object} value Value to be removed from the array
 * @return {Object} Returns an object containing the following properties:
 *
 *        removed {Boolean} True if one or more elements were removed from configuration
 *        newArray {Array} Array returned from configuration with elements removed if matching values are found
 */
o5.platform.system.Preferences._removeFromPrefsArray = function _removeFromPrefsArray (preference, value) {
    var prefObject = CCOM.ConfigManager.getValue(preference),
        storedArray,
        i,
        arrayLength,
        isElementRemoved = false;

    try {
        storedArray = prefObject.error ? [] : JSON.parse(prefObject.keyValue);
    } catch (e) {
        storedArray = [];
    }

    if (storedArray && typeof storedArray === 'object' && storedArray.hasOwnProperty('length')) {
        for (i = 0, arrayLength = storedArray.length; i < arrayLength; i++) {
            if (storedArray[i] === value) {
                storedArray.splice(i, 1);
                isElementRemoved = true;
                break;
            }
        }
    }

    return {
        removed: isElementRemoved,
        newArray: storedArray
    };
};

/**
 * Prepend "/applications/shared/" to form an absolute key path
 * @method _parsePreference
 * @private
 * @param {String} preference Key path to be prepend
 * @return {String} Returns prepended key path
 */
o5.platform.system.Preferences._parsePreference = function _parsePreference (preference) {
    return this._jsfwPrefsPrefix + preference;
};

/**
 * This method is required to initialize the event listener required by the preferences object
 * when the CCOM object becomes available. Must be called prior to using this class.
 * @method init
 */
o5.platform.system.Preferences.init = function init () {
    this.logInfo("init", "Initialising Preferences...");
    CCOM.ConfigManager.addEventListener('onValueChanged', this._onChangeHandler);
};

/**
 * @method initialise
 * @deprecated Use init()
 */
o5.platform.system.Preferences.initialise = function initialise () {
    this.logDeprecated();
    this.init();
};

/**
 * Retrieves a specified preference value that was previously saved by `set`. To retrieve objects and arrays
 * that was saved by `setPreferenceObject`, use `getPreferenceObject`.
 * @method get
 * @param {String} preference Key path to configuration
 * @param {Boolean} [absolute=false] Set to true if preference is an absolute path. If false, `preference`
 * will prepend with /applications/shared/.
 * @return {String|Number|Boolean} Returns the key value or undefined if not found. The return type is the same
 * as when it was saved by `set`.
 */
o5.platform.system.Preferences.get = function get (preference, absolute) {
    var pref = absolute ? preference : this._parsePreference(preference),
        returnValue = CCOM.ConfigManager.getValue(pref);
    this.logDebug("get", "path " + pref);
    if (returnValue && !returnValue.error) {
        return returnValue.keyValue;
    }
    return undefined;
};

/**
 * Stores a specified preference value. Useful for storing strings, numbers, and booleans. To store objects,
 * arrays, and array of objects, use `setPreferenceObject`.
 * @method set
 * @param {String} preference Key path to configuration
 * @param {String|Number|Boolean} value Value to be saved in configuration
 * @param {Boolean} [absolute=false] Set to true if preference is an absolute path. If false, `preference`
 * will prepend with /applications/shared/.
 * @return {Boolean} Returns true if the value was saved successfully, otherwise false.
 */
o5.platform.system.Preferences.set = function set (preference, value, absolute) {
    var pref = absolute ? preference : this._parsePreference(preference),
        retValue = false;
    this.logDebug("set", "path " + pref);
    if (value ||
        (typeof value === 'number' && value === 0) ||
        (typeof value === 'boolean' && value === false) ||
        (typeof value === 'string' && value === "")) {
        retValue = CCOM.ConfigManager.setValue(pref, value);
    }
    return (retValue && !retValue.error);
};

/**
 * Retrieves a specified preference value as a JavaScript object or array that was previously saved by
 * `setPreferenceObject`.
 * @method getPreferenceObject
 * @param {String} preference Key path to configuration
 * @param {Boolean} [absolute=false] Set to true if preference is an absolute path. If false, `preference`
 * will prepend with /applications/shared/.
 * @return {Object|Array} Returns an object or array if found or null if failed.
 */
o5.platform.system.Preferences.getPreferenceObject = function getPreferenceObject (preference, absolute) {
    var pref = absolute ? preference : this._parsePreference(preference),
        prefValue = CCOM.ConfigManager.getValue(pref);
    this.logDebug("getPreferenceObject", "path " + pref);
    try {
        return (typeof prefValue.error === "undefined") ? JSON.parse(prefValue.keyValue) : null;
    } catch (e) {
        return null;
    }
};

/**
 * Stores a specified preference value. Useful for storing objects, arrays, and array of objects.
 * Uses `JSON` to serialize the object before saving to configuration.
 * @method setPreferenceObject
 * @param {String} preference Key path to configuration
 * @param {Object} value Value to be set
 * @param {Boolean} [absolute=false] Set to true if preference is an absolute path. If false, `preference`
 * will prepend with /applications/shared/.
 * @return {Boolean} Returns true if the value was saved successfully, otherwise false.
 */
o5.platform.system.Preferences.setPreferenceObject = function setPreferenceObject (preference, value, absolute) {
    var pref = absolute ? preference : this._parsePreference(preference),
        retValue = false;
    this.logDebug("setPreferenceObject", "path " + pref);
    if (value && typeof value === 'object') {
        retValue = CCOM.ConfigManager.setValue(pref, JSON.stringify(value));
    }
    return (retValue && !retValue.error);
};

/**
 * Removes a specified preference
 *
 * @method deletePreference
 * @param {String} preference Key path to be removed
 * @param {Boolean} [absolute=false] Set to true if preference is an absolute path. If false, `preference`
 * will prepend with /applications/shared/.
 * @return {Boolean} Returns true if the value was removed successfully, otherwise false.
 */
o5.platform.system.Preferences.deletePreference = function deletePreference (preference, absolute) {
    var pref = absolute ? preference : this._parsePreference(preference),
        retValue = CCOM.ConfigManager.unsetValue(pref);
    this.logDebug("delete", "path " + pref);
    return (retValue && !retValue.error);
};

/**
 * Removes a specified preference subtree
 * @method deletePreferenceSubtree
 * @param {String} preference Subtree key path to be removed
 * @param {Boolean} [absolute=false] Set to true if preference is an absolute path. If false, `preference`
 * will prepend with /applications/shared/.
 */
o5.platform.system.Preferences.deletePreferenceSubtree = function deletePreferenceSubtree (preference, absolute) {
    var pref = absolute ? preference : this._parsePreference(preference),
        prefSubtree = CCOM.ConfigManager.getSubtree(pref).keyValuePairs,
        prefKeyArray = prefSubtree ? Object.keys(prefSubtree) : [],
        i,
        arrayLength;
    for (i = 0, arrayLength = prefKeyArray.length; i < arrayLength; i++) {
        CCOM.ConfigManager.unsetValue(prefKeyArray[i]);
    }
};

/**
 * Removes a specified value from a serialized JavaScript array that was previously saved by
 * `setPreferenceObject`. Removing value from array of objects does not work. It only works on arrays
 * of strings, numbers, and booleans.
 * @method removeValueFromArray
 * @param {String} preference Key path to configuration
 * @param {Object} value Value to be removed from the array
 * @param {Boolean} [absolute=false] Set to true if preference is an absolute path. If false, `preference`
 * will prepend with /applications/shared/.
 * @return {Boolean} Returns true if the value was found and removed successfully, otherwise false.
 */
o5.platform.system.Preferences.removeValueFromArray = function removeValueFromArray (preference, value, absolute) {
    var pref = absolute ? preference : this._parsePreference(preference),
        retValue = false,
        returnValue = this._removeFromPrefsArray(pref, value);
    this.logDebug("removeValueFromArray", "path " + pref);
    if (returnValue && returnValue.removed) {
        retValue = CCOM.ConfigManager.setValue(pref, JSON.stringify(returnValue.newArray));
    }
    return (retValue && !retValue.error);
};

/**
 * Watches the specified preference, and invokes the supplied callback in the supplied
 * context when the value of the preference changes. The new value of the preference is
 * passed to the callback in its invocation.
 * @method monitorValue
 * @param {String} preference The key path to be monitored
 * @param {Function} changeCallback Callback function to be invoked when the value of the preference changes
 * @param {Function} callbackContext The context in which the callback function will be invoked
 * @param {Boolean} [absolute=false] Set to true if preference is an absolute path. If false, `preference`
 * will prepend with /applications/shared/.
 * @return {Boolean} Returns true if successful, otherwise false.
 */
o5.platform.system.Preferences.monitorValue = function monitorValue (preference, changeCallback, callbackContext, absolute) {
    var pref = absolute ? preference : this._parsePreference(preference),
        retValue = false;
    this.logDebug("monitorValue", "path " + pref);
    if (changeCallback) {
        if (!this._callbackList[pref]) {
            this._callbackList[pref] = [];
        }
        this._callbackList[pref].push({
            callback: changeCallback,
            context: callbackContext
        });
        retValue = CCOM.ConfigManager.addNotify(pref);
    }

    return (retValue && !retValue.error);
};

/**
 * Stops monitoring the specified preference, and unlinks the associated callback from the preference.
 * @method unmonitorValue
 * @param {String} preference The key path to be unmonitored
 * @param {Function} changeCallback Callback function that needs to be removed
 * @param {Object} callbackContext The context in which the callback function was invoked
 * @param {Boolean} [absolute=false] Set to true if preference is an absolute path. If false, `preference`
 * will prepend with /applications/shared/.
 * @return {Boolean} Returns true if successful, otherwise false.
 */
o5.platform.system.Preferences.unmonitorValue = function unmonitorValue (preference, changeCallback, callbackContext, absolute) {
    var pref = absolute ? preference : this._parsePreference(preference),
        retValue = false,
        i,
        len;
    this.logDebug("unmonitorValue", "path " + pref);
    if (pref && this._callbackList[pref] && this._callbackList[pref].length !== 0) {
        for (i = 0, len = this._callbackList[pref].length; i < len; i++) {
            if (this._callbackList[pref][i].callback === changeCallback && this._callbackList[pref][i].context === callbackContext) {
                this._callbackList[pref].splice(i, 1);
                break;
            }
        }
        retValue = CCOM.ConfigManager.removeNotify(pref);
    }
    return (retValue && !retValue.error);
};

// uncomment to turn debugging on for Preferences object
//o5.log.setAll(o5.platform.system.Preferences, true);
