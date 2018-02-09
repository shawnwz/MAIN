/**
 * @class $service.settings.SystemDetails
 */
"use strict";

$service.settings.SystemDetails = (function SystemDetails () {
	return {

		/**
		 * @method getManufacturer
		 * @public
		 * @return {Object}
		 */
		getManufacturer: function getManufacturer () {
			return o5.platform.system.Device.getManufacturer();
		},

		/**
		 * @method getHardwareVersion
		 * @public
		 * @return {Object}
		 */
		getHardwareVersion: function getHardwareVersion () {
			return o5.platform.system.Device.getHardwareVersion();
		},

		/**
		 * @method getSoftwareVersion
		 * @public
		 * @return {Object}
		 */
		getSoftwareVersion: function getSoftwareVersion () {
			return o5.version.toString();
		},

		/**
		 * @method getSerialNumber
		 * @public
		 * @return {Object}
		 */
		getSerialNumber: function getSerialNumber () {
			return o5.platform.system.Device.getSerialNumber();
		},

		/**
		 * @method getOperatingSystemVersion
		 * @public
		 * @return {Object}
		 */
		getOperatingSystemVersion: function getOperatingSystemVersion () {
			return o5.platform.system.Device.getSoftwareVersion();
		},

		/**
		 * @method getCWEVersion
		 * @public
		 * @return {Object}
		 */
		getCWEVersion: function getCWEVersion () {
			return "Unknown";
		},

		/**
		 * @method getEPGSoftwareVersion
		 * @public
		 * @return {Object}
		 */
		getEPGSoftwareVersion: function getEPGSoftwareVersion() {
			return $N.app.Version.appVersion;
		}
	};
}());
