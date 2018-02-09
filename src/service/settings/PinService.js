$service.settings.PinService = (function PinService() {
	var timestamp;

	/**
	 * @method validatePin
	 * @param  {Object} config - configuration object - see getDISCOUrl for details
	 */
	function validatePin (pinNumber, pinType) {
		var	pinValidated = function (validated) {
				if (validated) {
					if ((pinType === 'master') && (!$N.platform.ca.ParentalControl.isCurrentUserMaster())) {
						o5.platform.ca.ParentalControl.setPolicyModifier([
							{ type: o5.platform.ca.ParentalControl.PolicyModifiers.TIMEOUT,
							data: $util.constants.MASTER_EXPIRATION_TIME
							}]);
					}
					//me._onUserAuthenticationSuccess();
					return true;
				}
				return false;
				
			},
			authenticationResult = false;
		switch (pinType) {
		case 'master':
			//o5.platform.ca.PINHandler.validateParentalPin(pinNumber, pinValidated, keepCurrentUser);
			 if (pinNumber === "1234") {
				 return true;
				}
				return false;
			//break;
		case 'ca':
			authenticationResult = o5.platform.ca.PINHandler.validateCAPurchasePin(pinNumber);
			pinValidated(authenticationResult);
			break;
		case 'install':
			//pinValidated(pinNumber === $N.app.Config.getConfigValue("first.install.pin"));
			break;
		case 'purchase':
			//uiPinValidation(this, pinNumber, pinValidated, true);
			break;
		case 'facebook':
			//uiPinValidation(this, pinNumber, pinValidated, false);
			break;
		default:
			o5.platform.ca.PINHandler.validatePurchasePin(pinNumber, pinValidated);
		}
	}

	/**
	 * @method handleBlockPin
	 * @param
	 */
	function handleBlockPin () {
		timestamp = Date.now() + $util.constants.BLOCKED_PIN_DURATION;
		o5.platform.system.Preferences.set($util.constants.BLOCKED_PIN_TIMESTAMP, timestamp.toString());
	}

	/**
	 * @method isPinBlocked
	 * @param
	 */
	function isPinBlocked () {
		var pinBlockedTime = Number(o5.platform.system.Preferences.get($util.constants.BLOCKED_PIN_TIMESTAMP)) || timestamp;
		return (Date.now() < pinBlockedTime);
	}

	/**
	 * @method init
	 * @param
	 */
	function init() {
		o5.platform.ca.PINHandler.init();
		o5.platform.ca.ParentalControl.init();
	}

	return {
		validatePin   : validatePin,
		handleBlockPin: handleBlockPin,
		isPinBlocked  : isPinBlocked,
		init          : init
	};
	
}());
