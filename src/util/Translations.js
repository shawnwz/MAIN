/**
 */

/**
 * @class Translations
 */
$util.Translations = (function () {
    "use strict";

    var _language = "",
        _isLoaded = false,
        _dictionary = {},
        _extensions = {};

    return {

        /**
         * Sets the current language and loads its translation file
         * @method setLanguage
         * @public
         * @param {String} language
         */
        setLanguage: function (language) {

            /* Dont clear previoulsy loaded dictionary until succesfully loaded.
             * This way we do not clear the current dictionary if the new one fails to load
             */

            var url = "./translations/" + language + ".json",
              me = this;

            $util.fetch(url, 3000).then(function(data) {
                            _language = language;
                            _isLoaded = true;
                            _dictionary = data;
                            //console.log("Loaded translations", data);
                            me.update(); // update the whole body
                        },
                        function(data) {
                            console.log("Failed to load new translations", data);
                        });
        },

        /**
         * Extend loaded dictionary with translation files of given URL
         * @method extend
         * @public
         * @param {String} url
         */
        extend: function (url) {

            /* Dont clear previoulsy loaded extension until succesfully loaded.
             * This way we do not clear the current extension if the new one fails to load
             */

            var me = this;

            $util.fetch(url, 3000).then(function(data) {
                            _extensions = data;
                            //console.log("Loaded translation extension", data);
                            me.update();
                        },
                        function(data) {
                            console.log("Failed to load extension", data);
                        });
        },

        /**
         * returns the currently set language
         * @method getLanguage
         * @public
         * @return {String} language
         */
        getLanguage: function () {
            return _language;
        },

        /**
         * returns the boolean of whether translations are loaded
         * @method isLoaded
         * @public
         * @return {Boolean} true/false
         */
        isLoaded: function () {
            return _isLoaded;
        },

        /**
         * Returns the translation of given key
         * @method translate
         * @public
         * @param {String} key
         * @return {String} value
         */
        translate: function (key) {
            var value = key; // by default just return the key
            if (_extensions[key] !== undefined) {
                value = _extensions[key];
            } else if (_dictionary[key] !== undefined) {
                value = _dictionary[key];
            }
            return value;
        },

        /**
         * Updates the current HTML with the loaded translations file
         * @method update
         * @public
         */
        update: function(elem) {
          // translate the currently loaded page
          var i,
            doc = elem || document.querySelector('body'),
            elems = doc ? doc.querySelectorAll("[data-i18n]") : [];
          for (i = 0; i < elems.length; i++) {
            if (elems[i].dataset.i18n) {
              elems[i].innerHTML = $util.Translations.translate(elems[i].dataset.i18n);
            }
          }
        },

        /**
         * Initialize the Translations module
         * @method init
         * @public
         */
        init: function () {

        }

    };
}());
