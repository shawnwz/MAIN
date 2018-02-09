/**
 * @class $service.settings.ViewRestrictions
 */
"use strict";

$service.settings.ViewRestrictions = (function ViewRestrictions() {

    return {

        /**
         * @method getRatingOptions
         * @public
         * @return {Object}
         */
        getRatingOptions: function getRatingOptions() {
            return [
                {
                    value: "ratingR",
                    text : "ratingR"
                },
                {
                    value: "none",
                    text : "none"
                },
                {
                    value: "ratingPG",
                    text : "ratingPG&+"
                },
                {
                    value: "ratingM",
                    text : "ratingM&+"
                },
                {
                    value: "ratingMA",
                    text : "ratingMA15&+"
                },
                {
                    value: "ratingAV",
                    text : "ratingAV&+"
                }
            ];
        },

        /**
         * @method getYesNoOptions
         * @public
         * @return {Object}
         */
        getYesNoOptions: function getYesNoOptions() {
            return [
                {
                    value: false,
                    text : "no"
                },
                {
                    value: true,
                    text : "yes"
                }
            ];
        }
    };
}());

