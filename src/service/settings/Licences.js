/**
 * @class $service.settings.Notifications
 */
"use strict";

$service.settings.Licences = (function Licences() {
    var licencesText = "";

    return {

        /**
         * @method getfoxtelLicences
         * @public
         * @return {Object}
         */
        getfoxtelLicences: function getfoxtelLicences() {
            if (licencesText === "") {
              licencesText = $util.Translations.translate("settingsMenuLicencesText");
            }
            return licencesText;
        }
    };
}());

