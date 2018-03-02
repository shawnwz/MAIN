/**
 * @class app.gui.controls.NetworkConnectionDetailsList
 */

app.gui.controls.NetworkConnectionDetailsList = function NetworkConnectionDetailsList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.NetworkConnectionDetailsList, app.gui.controls.SettingsList);


/**
 * @method _fetch
 */
app.gui.controls.NetworkConnectionDetailsList.prototype._fetch = function _fetch() {
    this.logEntry();
    // add listner to moniter ethernet
    this.superCall();
    this.logExit();
};

/**
 * @method _onKeyDown
 * @private
 * @param {Object} e
 */
app.gui.controls.NetworkConnectionDetailsList.prototype._onKeyDown = function _onKeyDown (e) {
    this.logEntry();
    var handled = false;
    this._footer = document.querySelector("#ctaSettingsMenu");
    switch (e.key) {
        case "Red":
              if (this._footer._hasId("ctaTCPIPSettings")) {
          		  $util.ControlEvents.fire(":tcpIPConfigDialog", "show");
          		  setTimeout(function() {
            		$util.ControlEvents.fire(":tcpIPConfigDialog", "setIndex", 0);
          			}, 70);
                  handled = true;
                } else {
                    handled = this.superCall(e);
                }
                break;
         case "Green":
                if (this._footer._hasId("ctaRenewDHCP")) {
          		$util.Events.fire("setDhcpStatus", true);
          		$util.ControlEvents.fire("app-settings:settingsDHCPRenewal", "show", $util.constants.INTERNET_STATUS_OVERLAY_DISPLAY_MODE.DHCP);
                    handled = true;
               } else {
                    handled = this.superCall(e);
                }
                break;
         default:
            handled = this.superCall(e);
            break;
    }
    if (handled === true) {
        e.stopImmediatePropagation();
    }
    this.logExit();
};
