/**
 * @class $service.settings.Bluetooth
 */
"use strict";

$service.settings.Bluetooth = (function Bluetooth() {

	/**
	 * @method  isBatteryLevelGood
	 * @private
	 * @param {Number} percentage
	 * @return {Boolean}
	 */
	function isBatteryLevelGood(percentage) {
		// TODO: FP1-159 - Advanced Settings - Bluetooth Remote
		var BatteryPercentage = percentage || 0,
			isBatteryPercentageSafe = false;
		if (BatteryPercentage) {
			isBatteryPercentageSafe = true;
		} else {
			isBatteryPercentageSafe = false;
		}
		return isBatteryPercentageSafe;
	}

	return {

		/**
		 * @method getOnOffOptions
		 * @public
		 * @return {Object}
		 */
		getOnOffOptions: function getOnOffOptions() {
			return [
				{
					value: true,
					text : "On"
				},
				{
					value: false,
					text : "Off"
				}
			];
		},

		/**
		 * @method getBluetoothRemoteBatteryLevel
		 * @public
		 * @return {Object}
		 */
		getBluetoothRemoteBatteryLevel: function getBluetoothRemoteBatteryLevel() {
			// TODO: FP1-159 - Advanced Settings - Bluetooth Remote
			var percentage = 55;
			return {
				percentage: percentage,
				quality   : isBatteryLevelGood(percentage)
			};
		},

		/**
		 * @method getBluetoothRemoteMacAddress
		 * @public
		 * @return {String}
		 */
		getBluetoothRemoteMacAddress: function getBluetoothRemoteMacAddress() {
			// TODO: FP1-159 - Advanced Settings - Bluetooth Remote
			return "90:B1:1C:76:4D:34";
		}

	};

}());
