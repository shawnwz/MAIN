/**
 * @class app.gui.controls.DialogPinEntryH
 */

app.gui.controls.DialogPinEntryH = function DialogPinEntryH () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.DialogPinEntryH, app.gui.controls.HtmlDialogContainer);

app.gui.controls.DialogPinEntryH.prototype.createdCallback = function createdCallback () {
//  this.logEntry();
  this.superCall();

  this._failedTexts = {
    1: "Oops! That's the wrong PIN. You have one more attempts. Enter your PIN or press back to cancel.",
    2: "Oops! That's the wrong PIN. You have two more attempts. Enter your PIN or press back to cancel.",
    3: "Oops! That's the wrong PIN. You have three more attempts. Enter your PIN or press back to cancel."
  };

  this._notificationTexts = {
    1: "Oops, incorrectPin. One attempts remaining.",
    2: "Oops, incorrectPin. Two attempts remaining."
  };

  this._dialogEntry = {
    title    : "Enter PIN",
    text     : "You'll need to enter your pin to get access here. If you've forgotten your pin give us a call on 131 999. Press back to cancel.",
    subText  : "",
    errorCode: "F0160"
  };

  this._dialogFailed = {
    title    : "Incorrect PIN",
    text     : "Oops! That's the wrong PIN. You have a few more attempts. Enter your PIN or press back to cancel.",
    subText  : "",
    errorCode: "F0161"
  };

  this._dialogBlocked = {
    title    : "PIN Blocked",
    text     : "Your PIN entry is now blocked for 10 minutes. Press back to cancel.",
    subText  : "",
    errorCode: "F0163"
  };

  this._dialogBlocked2 = {
    title    : "PIN Blocked",
    text     : "Your PIN entry is blocked for the next 10 minutes, please try back then. If you need help, give us a call on 131 999.",
    subText  : "",
    errorCode: "F0164"
  };

  this._attempts = 3;

  this._notification = this.ownerDocument.querySelector("#Oxy-Notifications");
  this._notificationTxt = this.ownerDocument.querySelector("#Oxy-Notifications-0");
  this._notificationTxt.innerHTML = "";
  this._cta = this.querySelector(".dialogCta span.txtBack");
//  this.logExit();
};


/**
 * @method attachedCallback
 */
app.gui.controls.DialogPinEntryH.prototype.attachedCallback = function attachedCallback () {
//  this.logEntry();
  this.superCall();
  var isPinBlocked = $service.settings.PinService.isPinBlocked(),
	  me = this;
  if (isPinBlocked) {
    this._dialog = this._dialogBlocked2;
  } else {
    this._dialog = this._dialogEntry;
  }
  $util.ControlEvents.fire(":dialogPinEntryH-pin", "debug", true);
  this.onControlEvent("verify", function (ctrl) {
    var enteredPin = ctrl.itemData,
      isPinCorrect = false;
    this._notification.className = "";
    this._notificationTxt.innerHTML = "";
    isPinCorrect = $service.settings.PinService.validatePin(enteredPin, "master", true);
    if (isPinCorrect) { //@hdk get real pin!!!
      console.log("right PIN!");
      $util.ControlEvents.fire(":dialogPinEntryH-pin", "correct");
      setTimeout(function() {
			if (me.parentControl) {
				$util.ControlEvents.fire(":dialogPinEntryH-pin", "readyToNavigate");
				me.parentControl.fireControlEvent("hide");
			}
		}, $util.constants.PIN_DIALOG_SHOW_TIME);
      } else {
      this._attempts--;
      if (this._attempts <= 0) {
        this.fireControlEvent("populate", this._dialogBlocked);
        //$util.ControlEvents.fire(":dialogPinEntryH-pin", "blocked");
        $service.settings.PinService.handleBlockPin();
        //if (this.parentControl) { // set focus to dialog, since pin entry will be hidden now
        //  this.parentControl.fireControlEvent("focus");
        //}
        this._cta.textContent = "Close";
        this.fireControlEvent("focus");
      } else {
        this._dialogFailed.text = this._failedTexts[this._attempts];
        this._notificationTxt.innerHTML = this._notificationTexts[this._attempts];
        this._notification.className = "show";
        this.fireControlEvent("populate", this._dialogFailed);
        $util.ControlEvents.fire(":dialogPinEntryH-pin", "incorrect");
      }
    }
  });

  this.onControlEvent("change", function (ctrl) {
    var enteredPin = ctrl.itemData;

    // if some digits: change "close" to "clear" in cta
    if (enteredPin.length === 0) {
      this._cta.textContent = "Close";
    } else {
      this._cta.textContent = "Clear";
    }

  });

//  this.logExit();
};

/**
 * @method _populate
 */
app.gui.controls.DialogPinEntryH.prototype._populate = function _populate (args) {
  this.logEntry();
  if (args && args.attempts) {
    this._attempts = args.attempts;
    this.superCall();
  } else {
    this.superCall(args);
  }
  this.logExit();
};

/**
 * @method _focus
 */
app.gui.controls.DialogPinEntryH.prototype._focus = function _focus () {
  this.logEntry();
  var isPinBlocked = $service.settings.PinService.isPinBlocked();
  if (isPinBlocked) {
    $util.ControlEvents.fire(":dialogPinEntryH-pin", "blocked");
    this.superCall();
  } else {
    $util.ControlEvents.fire(":dialogPinEntryH-pin", "focus");
  }

  this.logExit();
};

/**
 * @method _reset
 */
app.gui.controls.DialogPinEntryH.prototype._reset = function _reset () {
  this.logEntry();
  this.fireControlEvent("clear");
  this.fireControlEvent("populate", this._dialog);
  this.logExit();
};

/**
 * @method _show
 */
app.gui.controls.DialogPinEntryH.prototype._show = function _show () {
  this.logEntry();
  this.superCall();
  this._reset();
  this.logExit();
};

/**
 * @method _hide
 */
app.gui.controls.DialogPinEntryH.prototype._hide = function _hide () {
  this.logEntry();
  this._notification.className = "";
  this._notificationTxt.innerHTML = "";
  this._reset();
  this.superCall();
  this.logExit();
};

/**
 * @method _onKeyDown
 */
app.gui.controls.DialogPinEntryH.prototype._onKeyDown = function _onKeyDown () {
  this.logEntry();

  this.logExit();
};

