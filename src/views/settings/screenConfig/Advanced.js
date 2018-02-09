"use strict";
app.screenConfig.settings.ADVANCED = {
    text           : "advancedSettings",
    footerClassList: ["ctaClose"],
    handleAction   : function () {
	var  _pinEntered = '',
	     _INSTALLER_PIN = "0611",
	     _numericSequenceTimer = null,
	     _KEY_SEQUENCE_TIMEOUT = "5000";
	return {
	    _showInstaller     : false,
	    _handleNumericEntry: function(key) {
		    _pinEntered += key;
		    this._showInstaller = false;
		    if (_pinEntered.length === 4) {
		      //  Show the installer menu
		      this._showInstaller = (_pinEntered === _INSTALLER_PIN);
		      _pinEntered = '';
		    }
		    _numericSequenceTimer = setTimeout(this._clearNumericSequence, _KEY_SEQUENCE_TIMEOUT);
		    return true;
	    },
	    _clearNumericSequence: function() {
		    if (_numericSequenceTimer !== null) {
		      clearTimeout(_numericSequenceTimer);
		      _numericSequenceTimer = null;
		    }
		    this._showInstaller = false;
		    _pinEntered = '';
	    }
	};
    },
    getMenu: function getMenu() {
        return [
            {
                id    : "pictureSettings",
                text  : "settingsMenuTitlePictureSettings",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsPictureView", "title": "settingsMenuTitlePictureSettings" }
                    }
                ]
            },
            {
                id    : "audioAndLanguageSettings",
                text  : "settingsMenuTitleAudioLanguageSettings",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsAudioLanguageView", "title": "settingsMenuTitleAudioLanguageSettings" }
                    }
                ]
            },
            {
                id    : "bluetoothRemoteSettings",
                text  : "settingsMenuTitleBluetoothRCSettings",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsBluetoothView", "title": "settingsMenuBluetoothTitle" }
                    }
                ]
            },
            {
                id    : "systemDetails",
                text  : "settingsMenuTitleSystemDetails",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsSystemDetailsView", "title": "settingsMenuTitleSystemDetails" }
                    }
                ]
            },
            {
                id    : "signalTest",
                text  : "settingsMenuTitleSignalTest",
                events: []
            },
            {
                id    : "hddStatus",
                text  : "settingsMenuHDDStatus",
                events: []
            },
            {
                id    : "hardwareDetails",
                text  : "settingsMenuTitleHardwareDetails",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsHardwareDetailsView", "title": "settingsMenuTitleHardwareDetails" }
                    }
                ]
            },
            {
                id    : "licences",
                text  : "settingsMenuTitleLicences",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsInfoView", "title": "settingsMenuTitleLicences", "footerClassList": ["ctaClose"] }
                    },
                    {
                        name: "settings:fetchLicences"
                    }
                ]
            },
            {
                id    : "installerSetup",
                isHide: true,
                text  : "Installer Setup",
                events: [
                    {
                        "name": "scr:navigate:to",
                        "data": { "id": "settingsInstallerSettingsMenu", "title": "installerSatelliteTitle", "footerClassList": ["ctaClose"] }
                    }
                ]
            }
        ];
    }
};
