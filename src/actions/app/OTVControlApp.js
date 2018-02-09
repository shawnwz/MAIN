/*global GlobalKeysInterceptor,*/
/**
 * @class OTVControlApp
 */
// delete this file when o5js multiple applications lifecycle management is ready
$actions.app.OTVControlApp = (function OTVControlApp() {
    var currentApp = null,
        _isThruKeyPress,
        //isNetflixSuspended = true,  // DO NOT CHANGE isNetflixSuspended = true;
        handleChannelKeyObj = {
            "handle"    :  0,
            "keycode"   :  0,
            "serviceObj":  {}
        },
        _stealAllKeys = {
            STEAL_EXIT_KEYCODE   : 601,
            STEAL_POWER_KEYCODE  : 409,
            STEAL_VOLUP_KEYCODE  : 175,
            STEAL_VOLDOWN_KEYCODE: 174,
            STEAL_MUTE_KEYCODE   : 173,
            STEAL_RED_KEYCODE    : 403,
            STEAL_CHUP_KEYCODE   : 427,
            STEAL_CHDN_KEYCODE   : 428
        },
        _stealAllKeysCode = [
            _stealAllKeys.STEAL_POWER_KEYCODE,
            _stealAllKeys.STEAL_VOLUP_KEYCODE,
            _stealAllKeys.STEAL_VOLDOWN_KEYCODE,
            _stealAllKeys.STEAL_MUTE_KEYCODE,
            _stealAllKeys.STEAL_RED_KEYCODE,
            _stealAllKeys.STEAL_CHUP_KEYCODE,
            _stealAllKeys.STEAL_CHDN_KEYCODE,
            _stealAllKeys.STEAL_EXIT_KEYCODE
        ],
        _stealKeys = [],
        CCOMApplicationObject = CCOM.Application,
        CCOMApplicationManagerObject = CCOM.ApplicationManager,
        CCOMApplicationControllerObject = CCOM.ApplicationController,
        CCOMAppinfoManagerObject = CCOM.AppinfoManager,
        CCOMPwrmgrObj = CCOM.Pwrmgr,
        isPrevrequestComplete = 1,
        // DO NOT CHANGE isPrevrequestComplete VALUE 1
        installedApps = [],
        obj = {},
        NETFLIX_APP_ID = "Netflix";

    function controlAppTrace(s) {
        console.log(s);
    }

    // function getPNService(channelsToJump) {
    //     var service,
    //         controller = $N.apps.core.ContextManager.getDefaultContext().getController(),
    //         channelIndex,
    //         serviceObj = {},
    //         epgUtil = $N.app.epgUtil,
    //         servicesArray = controller.getServicesArray(),
    //         servicesArrayLength = servicesArray.length,
    //         currentServiceId = controller.getServiceIndex(controller.getCurrentServiceId());
    //     controlAppTrace("#####################getPNService controller.getCurrentServiceId() ########################" + controller.getCurrentServiceId());
    //     if (o5.platform.btv.EPG.isChannelListPopulated()) {
    //         //channelIndex = currentServiceId || 0;
    //         channelIndex = channelIndex + channelsToJump;
    //         if (channelIndex > servicesArrayLength - 1) {
    //             channelIndex = 0;
    //         } else if (channelIndex < 0) {
    //             channelIndex = servicesArrayLength - 1;

    //         }
    //         service = servicesArray[channelIndex];
    //         controlAppTrace("#####################getPNService service.serviceId ########################" + service.serviceId);
    //         serviceObj = epgUtil.getServiceById(service.serviceId);
    //         serviceObj.hideBanner = false;
    //         handleChannelKeyObj.serviceObj = serviceObj;

    //         /*controller.handleTuneRequest(serviceObj);
    //         if (o5.gui.ViewManager.getActiveContext().getId() !== "ZAPPER") {
    //              controlAppTrace("################################### navigate  to  ZAPPER ################################### = " + service.serviceId);
    //             o5.gui.ViewManager.navigate("ZAPPER", serviceObj);

    //         }*/
    //     }
    // }

    function setInstalledApps(applist) {
        installedApps.push(applist);
    }

    function resumeNetflixFromStandBy() {
        var returnValue, appId = {
            "applicationId": "Netflix",
            "producerId"   : "NAGRA"
        };
        controlAppTrace("##################### resumeNetflixFromStandBy ########################");
        returnValue = CCOMApplicationManagerObject.requestAppState(appId, CCOMApplicationObject.STATE_APP_FOCUSED, null);
        if (returnValue.error) {
            controlAppTrace("##################### resumeNetflixFromStandBy failed isPrevrequestComplete = 1 ########################");
            isPrevrequestComplete = 1;
        }
        controlAppTrace("returnValue----resumeNetflixFromStandBy--------------" + JSON.stringify(returnValue));
    }

    function suspendNetflixInStandBy() {
        var returnValue, appId = {
                "applicationId": "Netflix",
                "producerId"   : "NAGRA"
            },
            state = CCOMApplicationObject.STATE_APP_FOCUSED,
            additionalArgs = {
                "reason": "standbyOn"
            };
        controlAppTrace("##################### suspendNetflixInStandBy ########################");


        returnValue = CCOMApplicationManagerObject.requestAppState(appId, state, additionalArgs);
        if (returnValue.error) {
            controlAppTrace("##################### suspendNetflixInStandBy failed isPrevrequestComplete = 1 ########################");
            isPrevrequestComplete = 1;
        }
        controlAppTrace("returnValue----suspendNetflixInStandBy--------------" + JSON.stringify(returnValue));
    }

    function launchNetFlixInSuspendMode(reason) {

        /*if( !isNetflixSuspended ){
            controlAppTrace("#####################Launching launchNetFlixInSuspendMode in Progress ########################");
            return ;
        }*/
        var returnValue, appId = {
                "applicationId": "Netflix",
                "producerId"   : "NAGRA"
            },
            state = CCOMApplicationObject.STATE_APP_SUSPEND,
            additionalArgs = {
                "appendArgs": "-Q source_type=2"
            };
        controlAppTrace("#####################Launching launchNetFlixInSuspendMode ########################");
        if (reason === false) {
            controlAppTrace("#####################Launching launchNetFlixInSuspendMode from appstore util########################");
            return;
        }


        returnValue = CCOMApplicationManagerObject.requestAppState(appId, state, additionalArgs);
        if (returnValue.error) {
            controlAppTrace("#####################Launching launchNetFlixInSuspendMode failed isPrevrequestComplete = 1 ########################");
            isPrevrequestComplete = 1;
            //$N.app.AppStore.hideLoadingIcon();
        }
        controlAppTrace("returnValue----launchNetFlixInSuspendMode--------------" + JSON.stringify(returnValue));


    }

    function removeNetflixAppinfoByQueryHandler() {
        //eslint-disable-next-line
        CCOMAppinfoManagerObject.removeEventListener("getAppinfoByQueryOK", netflixAppinfoByQueryOKHandler);
        //eslint-disable-next-line
        CCOMAppinfoManagerObject.removeEventListener("getAppinfoByQueryFailed", netflixAppinfoByQueryFailedHandler);
    }

    function netflixAppinfoByQueryOKHandler(e) {
        controlAppTrace("netflixAppinfoByQueryOKHandler---- --------------" + JSON.stringify(e));
        var i;

        installedApps = (e && e.applicationInfo) ? e.applicationInfo : null;
        for (i = 0; i < installedApps.length; i++) {
            if (installedApps[i].APP_ID === NETFLIX_APP_ID) {
                controlAppTrace("Netflix is available Hence changing Feature config as true---- --------------");
                // $N.app.NetflixUtil.initialise();
                //$N.app.Features.setFeatureEnabledValue("NetFlixApp", true);

                launchNetFlixInSuspendMode();
                break;
            } else {
                controlAppTrace("Netflix not available Hence changing Feature config as false---- --------------");
                // $N.app.Features.setFeatureEnabledValue("NetFlixApp", false);

            }
        }
        removeNetflixAppinfoByQueryHandler();

    }

    function netflixAppinfoByQueryFailedHandler(e) {
        controlAppTrace("netflixAppinfoByQueryFailedHandler---- --------------" + JSON.stringify(e));
        controlAppTrace("Netflix not available Hence changing Feature config as false---- --------------");
        // $N.app.Features.setFeatureEnabledValue("NetFlixApp", false);
        removeNetflixAppinfoByQueryHandler();

    }



    function launchInstalledApp(appInfo) {
        if (appInfo.appId === "IFL") {
            //  o5.gui.ViewManager.navigate(o5.gui.ViewManager.getNavigationLink("FEELINGLUCKY"), {}, function () {}, true);
        } else {

            var appObject = {
                    "applicationId": appInfo.appId,
                    "producerId"   : appInfo.author
                },
                args = {
                    "appendArgs": appInfo.args
                },
                returnValue;
            if (!isPrevrequestComplete) {
                controlAppTrace("----------------------launchInstalledApp handling  previous request ----:" + JSON.stringify(currentApp));
                return;
            }
            isPrevrequestComplete = 0;
            //$N.app.AppStore.showLoadingIcon();

            //currentApp = appInfo;
            controlAppTrace("----------------------launch App----:" + JSON.stringify(appInfo));
            returnValue = CCOMApplicationManagerObject.requestAppState(appObject, CCOMApplicationManagerObject.STATE_APP_FOCUSED, args);
            if (returnValue.error) {
                isPrevrequestComplete = 1;
                //  $N.app.AppStore.hideLoadingIcon();
            }
            controlAppTrace("returnValue----launchApp--------------" + JSON.stringify(returnValue));
        }
    }

    function destroyCurrentApp() {
        if (currentApp) {
            var appObject = {
                    "applicationId": currentApp.appId,
                    "producerId"   : currentApp.author
                },
                args = {
                    "appendArgs": currentApp.args
                };
            controlAppTrace("####################### destroyCurrentApp : currentApp :##############################" + JSON.stringify(currentApp));
            CCOMApplicationManagerObject.requestAppState(appObject, CCOMApplicationManagerObject.STATE_APP_DESTROYED, args);
        } else {
            controlAppTrace("####################### destroyCurrentApp : currentApp is null##############################");
        }
    }

    function hideCurrentApp() {

        if (currentApp) {
            var appObject = {
                    "applicationId": currentApp.appId,
                    "producerId"   : currentApp.author
                },
                args = {
                    "appendArgs": currentApp.args
                };
            controlAppTrace("####################### hideCurrentApp : currentApp :##############################" + JSON.stringify(currentApp));


            CCOMApplicationManagerObject.requestAppState(appObject, CCOMApplicationManagerObject.STATE_APP_BLURRED, args);

        } else {
            controlAppTrace("####################### hideCurrentApp : currentApp is null##############################");
        }
    }

    function activateCurrentApp() {
        if (currentApp) {
            var appObject = {
                    "applicationId": currentApp.appId,
                    "producerId"   : currentApp.author
                },
                args = {
                    "appendArgs": currentApp.args
                };
            controlAppTrace("####################### activateCurrentApp : currentApp :##############################" + JSON.stringify(currentApp));
            CCOMApplicationManagerObject.requestAppState(appObject, CCOMApplicationManagerObject.STATE_APP_FOCUSED, args);
        } else {
            controlAppTrace("####################### activateCurrentApp : currentApp is null##############################");
        }
    }

    function onPwrmgrModeChangedHandler(e) {
        controlAppTrace("#####################OTVControlApp onPwrmgrModeChangedHandler ########################" + JSON.stringify(e));
        switch (e.pwrmgrMode) {
            case CCOMPwrmgrObj.STANDBY_OFF:
                controlAppTrace("#####################OTVControlApp onPwrmgrModeChangedHandler e.pwrmgrMode=STANDBY_OFF ########################");
                if (currentApp) {
                    if (_isThruKeyPress) {
                        _isThruKeyPress = 0;
                        if (NETFLIX_APP_ID === currentApp.appId) {
                            resumeNetflixFromStandBy();
                        } else {
                            activateCurrentApp();
                        }
                    }
                }
                break;
            case CCOMPwrmgrObj.STANDBY_ON:
                controlAppTrace("#####################OTVControlApp onPwrmgrModeChangedHandler e.pwrmgrMode=STANDBY_ON ########################");
                if (currentApp) {
                    if (NETFLIX_APP_ID === currentApp.appId) {
                        suspendNetflixInStandBy();
                    } else {
                        hideCurrentApp();
                    }
                }
                break;
            case CCOMPwrmgrObj.LOW_POWER:
                controlAppTrace("#####################OTVControlApp onPwrmgrModeChangedHandler e.pwrmgrMode=LOW_POWER ########################");
                break;
            default:
                controlAppTrace("#####################OTVControlApp onPwrmgrModeChangedHandler SOME OTHER VALUE ########################");
        }
    }

    /*Once key code is finalized please call this api from key hander $N.app.OTVControlApp.launchNetFlixThruHotkey()  */

    function launchNetFlixThruHotkey() {
        controlAppTrace("#####################Launching launchNetFlixThruHotkey ########################");
        var returnValue, appId = {
                "applicationId": "Netflix",
                "producerId"   : "NAGRA"
            },
            state = CCOMApplicationObject.STATE_APP_FOCUSED,
            additionalArgs = {
                "appendArgs": "-Q source_type=1"
            };
        if (!isPrevrequestComplete) {
            controlAppTrace("----------------------launchNetFlixThruHotkey handling  previous request ---isPrevrequestComplete =0-:" + JSON.stringify(currentApp));
            return;
        }
        isPrevrequestComplete = 0;
        returnValue = CCOMApplicationManagerObject.requestAppState(appId, state, additionalArgs);
        if (returnValue.error) {
            controlAppTrace("#####################launchNetFlixThruHotkey  failed isPrevrequestComplete=1 ########################");
            isPrevrequestComplete = 1;
        }
        controlAppTrace("returnValue------------------" + JSON.stringify(returnValue));
    }

    function launchNetFlix() {
        controlAppTrace("#####################Launching LaunchNetFlix ########################");
        var returnValue, appId = {
                "applicationId": "Netflix",
                "producerId"   : "NAGRA"
            },
            state = CCOMApplicationObject.STATE_APP_FOCUSED,
            additionalArgs = {
                "appendArgs": "-Q source_type=2"
            };
        if (!isPrevrequestComplete) {
            controlAppTrace("----------------------launchInstalledApp handling  previous request ---isPrevrequestComplete =0-:" + JSON.stringify(currentApp));
            return;
        }
        //  $N.app.AppStore.showLoadingIcon();
        isPrevrequestComplete = 0;
        //currentApp = {"appId":"Netflix","author":"NAGRA","args":"-Q source_type = 2"};
        returnValue = CCOMApplicationManagerObject.requestAppState(appId, state, additionalArgs);


        if (returnValue.error) {
            controlAppTrace("#####################Launching LaunchNetFlix failed isPrevrequestComplete=1 ########################");
            isPrevrequestComplete = 1;
            //$N.app.AppStore.hideLoadingIcon();
        }
        controlAppTrace("returnValue----LaunchNetFlix--------------" + JSON.stringify(returnValue));
    }

    // function onApplicationGotFocus() {
    //     var controller = $N.apps.core.ContextManager.getDefaultContext().getController(),
    //         epgUtil,
    //         currentShowingServiceId,
    //         serviceObj;
    //     if (handleChannelKeyObj.handle) {
    //         controlAppTrace("################################### onApplicationGotFocus handleTuneRequest CH +/- Keys ################################### = ");
    //         handleChannelKeyObj.handle = 0;
    //         controller.handleTuneRequest(handleChannelKeyObj.serviceObj);
    //         if (o5.gui.ViewManager.getActiveContext().getId() !== "MEDIAPLAYER") {
    //             controlAppTrace("################################### navigate MEDIAPLAYER to  ZAPPER ################################### ");
    //             $N.app.epgUtil.storeChannelToPrefs(handleChannelKeyObj.serviceObj.serviceId);
    //             $N.apps.core.ContextManager.navigateToDefaultContext();
    //             document.getElementById("ZAPPER").style.opacity = "1";
    //         }
    //         return;
    //     }
    //     epgUtil = $N.app.epgUtil;
    //     //previousShowingServiceId = epgUtil.getPreviousChannelFromPrefs(),
    //     currentShowingServiceId = epgUtil.getChannelFromPrefs();
    //     serviceObj = {};
    //     //isRequestApplication = false;
    //     // if (previousShowingServiceId === currentShowingServiceId) {
    //     //   previousShowingServiceId = epgUtil.getSecondPreviousChannelFromPrefs();
    //     //}
    //     //if (updateBanner) {
    //     //  controller.updateBanner(epgUtil.getServiceById(previousShowingServiceId));
    //     //} else {
    //     //  controller.updateBannerAndTuneIfNeeded(epgUtil.getServiceById(previousShowingServiceId));
    //     //}
    //     serviceObj = epgUtil.getServiceById(currentShowingServiceId);
    //     controlAppTrace("################################### onApplicationGotFocus handleTuneRequest ################################### = " + currentShowingServiceId);
    //     serviceObj.hideBanner = false;
    //     controller.handleTuneRequest(serviceObj);
    //     if (o5.gui.ViewManager.getActiveContext().getId() === "MEDIAPLAYER") {
    //         controlAppTrace("################################### navigate MEDIAPLAYER to  ZAPPER ################################### = " + currentShowingServiceId);
    //         o5.gui.ViewManager.navigate("ZAPPER", serviceObj);
    //     }
    // }

    function onSetAppStateHandler(e) {
        controlAppTrace("################################### onSetAppStateHandler e ###################################" + JSON.stringify(e));
    }

    function onRequestStateHandler(e) {
        controlAppTrace("################################### onRequestStateHandler e###################################" + JSON.stringify(e));
    }

    function onStateChangedHandler(e) {
        controlAppTrace("################################### onStateChangedHandler e ###################################" + JSON.stringify(e));
    }

    function onStateTransitionHandler(e) {
        controlAppTrace("################################### onStateTransitionHandler e ###################################" + JSON.stringify(e));

    }

    function suspendNetflix() {
        controlAppTrace("################################### suspendNetflix STEAL_CHUP_KEYCODE /STEAL_CHDN_KEYCODE Suspend( Netflix )###################################");
        launchNetFlixInSuspendMode("CH KEYS");
    }

    function onBorrowedInputHandler(e) {
        var key, powerManagerUserMode, ret;
        controlAppTrace("################################### Handling onBorrowedInputHandler ###################################" + JSON.stringify(e));
        if (e.input.eventType !== 1) {
            controlAppTrace("################################### Handling onBorrowedInputHandler KEY PRESS RELEASE reject the notification ###################################" + JSON.stringify(e));
            return;
        }
        controlAppTrace("################################### Handling onBorrowedInputHandler KEY PRESS DOWN  Handling key progress ###################################" + JSON.stringify(e));



        switch (e.input.keyCode) {

            case _stealAllKeysCode.STEAL_POWER_KEYCODE:
                key = "power";
                break;
            case _stealAllKeysCode.STEAL_VOLUP_KEYCODE:
                key = "volup";
                break;
            case _stealAllKeysCode.STEAL_VOLDOWN_KEYCODE:
                key = "voldown";
                break;
            case _stealAllKeysCode.STEAL_MUTE_KEYCODE:
                key = "mute";
                break;
            default:
                key = "none";
        }
        if (e.input.keyCode !== _stealAllKeysCode.STEAL_POWER_KEYCODE) {

            if ((e.input.keyCode === _stealAllKeysCode.STEAL_EXIT_KEYCODE || e.input.keyCode === _stealAllKeysCode.STEAL_RED_KEYCODE) && (currentApp && (currentApp.appId === "Metrological" || currentApp.appId === "YouTube"))) {
                controlAppTrace("################################### Handling onBorrowedInputHandler KEY PRESS EXIT/RED COLOR BUTTON destroyCurrentApp( Metrological )###################################" + JSON.stringify(e));
                destroyCurrentApp();
                return;
            }
            if ((e.input.keyCode === _stealAllKeysCode.STEAL_CHUP_KEYCODE || e.input.keyCode === _stealAllKeysCode.STEAL_CHDN_KEYCODE) && (currentApp && currentApp.appId === "Netflix")) {
                controlAppTrace("################################### Handling onBorrowedInputHandler STEAL_CHUP_KEYCODE /STEAL_CHDN_KEYCODE Suspend( Netflix )###################################" + JSON.stringify(e));
                handleChannelKeyObj.handle = 1;
                handleChannelKeyObj.keycode = e.input.keyCode;
                if (e.input.keyCode === _stealAllKeysCode.STEAL_CHUP_KEYCODE) {
                    //getPNService(1);
                } else {
                    //getPNService(-1);
                }

                /*if(suspendNetflixTimer)
                {
                    clearTimeout(suspendNetflixTimer);
                    suspendNetflixTimer=null;
                }*/
                //suspendNetflixTimer = setTimeout(
                suspendNetflix();
                return;
            }

            controlAppTrace("Handling VOL +/- MUTE ");
            GlobalKeysInterceptor.keyHandler(key);

            /*if (GlobalKeysInterceptor) {

            }*/
        }
        if (key === 'power') { // Handle power key
            if (currentApp === null) {
                controlAppTrace("############################### HANDLING POWER KEY SOME THING WRONG SHOULD NOT COME HERE ###############################");
                return;
            }

            ret = CCOMPwrmgrObj.userModeGet();

            controlAppTrace(" Handling POWER KEY onBorrowedInputHandler CCOMPwrmgrObj CCOMPwrmgrObj.userModeGet()  JSON.stringify(powerManagerUserMode) = " + JSON.stringify(ret));



            if (!ret.error && ret.status === 0) {
                controlAppTrace(" Handling POWER KEY onBorrowedInputHandler CCOMPwrmgrObj CCOMPwrmgrObj.userModeGet() ret.status = SUCCESS  " + JSON.stringify(ret));

            } else {
                controlAppTrace(" Handling POWER KEY onBorrowedInputHandler CCOMPwrmgrObj CCOMPwrmgrObj.userModeGet() ret.status = FAILURE hence return " + JSON.stringify(ret));
                return;

            }

            powerManagerUserMode = ret.mode;


            if (powerManagerUserMode === CCOMPwrmgrObj.LOW_POWER) {
                controlAppTrace(" Handling POWER KEY onBorrowedInputHandler powerManagerUserMode === CCOMPwrmgrObj.LOW_POWER  Changeing the state to CCOMPwrmgrObj.STANDBY_ON");
                ret = CCOMPwrmgrObj.userModeSet(CCOMPwrmgrObj.STANDBY_ON);
                controlAppTrace(" Handling POWER KEY onBorrowedInputHandler powerManagerUserMode === CCOMPwrmgrObj.LOW_POWER  Changeing the state to CCOMPwrmgrObj.STANDBY_ON ret = " + JSON.stringify(ret));
                return;
            }

            if (powerManagerUserMode === CCOMPwrmgrObj.STANDBY_OFF) {

                controlAppTrace(" Handling POWER KEY onBorrowedInputHandler CCOMPwrmgrObj. Current status powerManagerUserMode === CCOMPwrmgrObj.STANDBY_OFF " + JSON.stringify(ret));

                /* if (o5.platform.system.Preferences.get($N.app.constants.STANDBY_SET)) {
                    // $N.app.PowerManagementUtil.clearLowPowerModeTimer();
                    // $N.app.PowerManagementUtil.clearStandByTimer();
                    // controlAppTrace(" Handling POWER KEY onBorrowedInputHandler CCOMPwrmgrObj. LOW POWER MODE IS SET HENCE LOW_POWER ret" + JSON.stringify(ret));
                     ret = CCOMPwrmgrObj.userModeSet(CCOMPwrmgrObj.LOW_POWER);
                     controlAppTrace(" Handling POWER KEY onBorrowedInputHandler CCOMPwrmgrObj.LOW_POWER ret" + JSON.stringify(ret));
                 } else {*/
                controlAppTrace(" Handling POWER KEY onBorrowedInputHandler CCOMPwrmgrObj.STANDBY_ON ret" + JSON.stringify(ret));
                ret = CCOMPwrmgrObj.userModeSet(CCOMPwrmgrObj.STANDBY_ON);
                controlAppTrace(" Handling POWER KEY onBorrowedInputHandler CCOMPwrmgrObj.STANDBY_ON ret" + JSON.stringify(ret));
                //}
            } else {
                controlAppTrace(" Handling POWER KEY onBorrowedInputHandler CCOMPwrmgrObj. Current status powerManagerUserMode !== CCOMPwrmgrObj.STANDBY_OFF " + JSON.stringify(ret));
                ret = CCOMPwrmgrObj.userModeSet(CCOMPwrmgrObj.STANDBY_OFF);
                _isThruKeyPress = 1;
                controlAppTrace(" Handling POWER KEY onBorrowedInputHandler CCOMPwrmgrObj.STANDBY_OFF ret" + JSON.stringify(ret));
            }
        }
    }
    function getFoxtelAppMetaData() {
        var metadata = {
            "APP_ID": "FoxtelUIPuck",
            "AUTHOR": "UIMS"
        };
        return metadata;
    }
    // function resumeGravity() {
    //     var gravityAppMetaData = getFoxtelAppMetaData(),
    //         gravityObject = {
    //             "appId":  gravityAppMetaData.APP_ID,
    //             "author": gravityAppMetaData.AUTHOR,
    //             "args":   ""
    //         };
    //     launchInstalledApp(gravityObject);
    // }

    function filterExitKey(key) {
        return key !== _stealAllKeysCode.STEAL_EXIT_KEYCODE;
    }

    function filterCHKeys(key) {
        return (key !== _stealAllKeysCode.STEAL_CHUP_KEYCODE && key !== _stealAllKeysCode.STEAL_CHDN_KEYCODE);
    }

    function onAppStateChangedHandler(e) {
        controlAppTrace("################################### onAppStateChangedHandler e ###################################" + JSON.stringify(e));
        var gravityAppMetaData = getFoxtelAppMetaData(),
            i,
            len,
            lastTunedServiceId,
            channelToTune;

        switch (e.requesterId) {
            case CCOMApplicationManagerObject.REQUESTER_APPLICATION:
                controlAppTrace("################################### onAppStateChangedHandler CCOMApplicationManagerObject.REQUESTER_APPLICATION ###################################");
                break;
            case CCOMApplicationManagerObject.REQUESTER_APPMGR:
                controlAppTrace("################################### onAppStateChangedHandler CCOMApplicationManagerObject.REQUESTER_APPMGR ###################################");
                if (e.appId.applicationId === gravityAppMetaData.APP_ID) {
                    if (e.newState !== CCOMApplicationManagerObject.STATE_APP_FOCUSED) {
                        controlAppTrace("################################### onAppStateChangedHandler CCOMApplicationManagerObject.REQUESTER_APPMGR stopPlayback ###################################");
                        //  $N.app.fullScreenPlayer.stopPlayback(); // TODO Foxtel TEAM: Need to play stop. Find the equivalent
                        $util.ControlEvents.fire("app-video", "stop");
                    } else {
                        lastTunedServiceId = o5.platform.system.Preferences.get("tv.currentServiceId");
                        channelToTune = $service.EPG.Channel.getByServiceId(lastTunedServiceId) || $service.EPG.Channel.get()[0];
                        if (channelToTune) {
                            $util.ControlEvents.fire("app-video", "setSrc", channelToTune, true);
                        }
                    }
                }
                break;
            case CCOMApplicationManagerObject.REQUESTER_CONTROLAPP:
                controlAppTrace("################################### onAppStateChangedHandler CCOMApplicationManagerObject.REQUESTER_CONTROLAPP ###################################");

                if (e.appId.applicationId === gravityAppMetaData.APP_ID) {
                    if (e.newState !== CCOMApplicationManagerObject.STATE_APP_FOCUSED) {
                        controlAppTrace("################################### onAppStateChangedHandler CCOMApplicationManagerObject.REQUESTER_CONTROLAPP stopPlayback ###################################");
                        // $N.app.fullScreenPlayer.stopPlayback(); // TODO Foxtel TEAM: Need to play stop. Find the equivalent
                    }
                }
                break;
            case CCOMApplicationManagerObject.REQUESTER_DIAL:
                controlAppTrace("################################### onAppStateChangedHandler CCOMApplicationManagerObject.REQUESTER_DIAL ###################################");
                break;
            case CCOMApplicationManagerObject.REQUESTER_SELF:
                controlAppTrace("################################### onAppStateChangedHandler CCOMApplicationManagerObject.REQUESTER_SELF ###################################");
                controlAppTrace("################################### onAppStateChangedHandler in CCOMApplicationManagerObject.REQUESTER_SELF and removeEventListener onBorrowedInput ###################################");
                break;
            case CCOMApplicationManagerObject.REQUESTER_SERVICE:
                controlAppTrace("################################### onAppStateChangedHandler CCOMApplicationManagerObject.REQUESTER_SERVICE ###################################");
                break;
            case CCOMApplicationManagerObject.REQUESTER_USER:
                controlAppTrace("################################### onAppStateChangedHandler CCOMApplicationManagerObject.REQUESTER_USER ###################################");
                break;
            case CCOMApplicationManagerObject.REQUESTER_WATCHER:
                controlAppTrace("################################### onAppStateChangedHandler CCOMApplicationManagerObject.REQUESTER_WATCHER ###################################");
                break;
            default:
                break;
        }
        if (e.newState === CCOMApplicationManagerObject.STATE_APP_FOCUSED) {
            controlAppTrace("################################### Launch successful onAppStateChangedHandler CCOMApplicationObject.STATE_APP_FOCUSED ###################################");
            if (e.appId.applicationId !== gravityAppMetaData.APP_ID) {
                len = installedApps[0].length;
                currentApp = null;
                if (e.appId.applicationId === "Netflix") {
                    controlAppTrace("################################### Launch Netflix successful onAppStateChangedHandler addEventListener _stealKeys without exit key ###################################");
                    //isNetflixSuspended = false;
                    _stealKeys = _stealAllKeys.filter(filterExitKey);
                } else {
                    controlAppTrace("################################### Launch successful onAppStateChangedHandler addEventListener _stealKeys with exit key  ###################################");
                    _stealKeys = _stealAllKeys.filter(filterCHKeys);
                }
                controlAppTrace("################################### Launch successful onAppStateChangedHandler addEventListener onBorrowedInput ###################################");
                CCOMApplicationObject.addEventListener("onBorrowedInput", onBorrowedInputHandler);
                CCOMApplicationObject.borrowKeysFromFocus(_stealKeys);
                $N.app.AppStore.hideLoadingIcon();
                for (i = 0; i < len; i++) {
                    if (installedApps[0][i].appId === e.appId.applicationId) {
                        obj.appId = e.appId.applicationId;
                        obj.author = e.appId.producerId;
                        obj.args = installedApps[0][i].args;
                        currentApp = obj;
                        controlAppTrace("################################### Launch successful currentApp =  ###################################" + JSON.stringify(currentApp));
                        break;
                    }
                }
            } else {
                controlAppTrace("################################### Launch successful onAppStateChangedHandler removeEventListener onBorrowedInput ###################################");
                CCOMApplicationObject.needKeysInFocus(_stealKeys);
                currentApp = null;
                // $N.app.AppStore.hideLoadingIcon();
                CCOMApplicationObject.removeEventListener("onBorrowedInput", onBorrowedInputHandler);
                // onApplicationGotFocus(); // TODO Foxtel TEAM: . Find the equivalent. The current code will tune last watch service.
            }
        } else if (e.newState === CCOMApplicationManagerObject.STATE_APP_BLURRED && (e.appId.applicationId === "YouTube" || e.appId.applicationId === "Metrological")) {

            if (currentApp.appId === "YouTube") {

                controlAppTrace("################################### Destroy YouTube e.newState === CCOMApplicationManagerObject.STATE_APP_BLURRED  ###################################");

            } else {
                controlAppTrace("################################### Destroy Metrological e.newState === CCOMApplicationManagerObject.STATE_APP_BLURRED  ###################################");

            }
            destroyCurrentApp();
        } else if (e.newState === CCOMApplicationManagerObject.STATE_APP_SUSPEND && e.appId.applicationId === "Netflix") {
            controlAppTrace("################################### Netflix in STATE_APP_SUSPEND  ################################### = ");
            //isNetflixSuspended = true;
        }
        controlAppTrace("###################################  onRequestAppStateHandler reset to original state isPrevrequestComplete = 1; ###################################");
        isPrevrequestComplete = 1;
    }

    function onRequestAppStateHandler(e) {
        controlAppTrace("################################### onRequestAppStateHandler e ###################################" + JSON.stringify(e));
        //onAppStateChanged
        switch (e.status) {
            case CCOMApplicationManagerObject.STATUS_FAILED:
                controlAppTrace("################################### onRequestAppStateHandler CCOMApplicationManagerObject.STATUS_FAILED: ###################################");
                break;
            case CCOMApplicationManagerObject.STATUS_FAILED_APP_NOT_FOUND:
                controlAppTrace("################################### onRequestAppStateHandler CCOMApplicationManagerObject.STATUS_FAILED_APP_NOT_FOUND: ###################################");
                break;
            case CCOMApplicationManagerObject.STATUS_FAILED_APP_NOT_RESPONDING:
                controlAppTrace("################################### onRequestAppStateHandler CCOMApplicationManagerObject.STATUS_FAILED_APP_NOT_RESPONDING: ###################################");
                break;
            case CCOMApplicationManagerObject.STATUS_FAILED_APP_NOT_SUPPORTED:
                controlAppTrace("################################### onRequestAppStateHandler CCOMApplicationManagerObject.STATUS_FAILED_APP_NOT_SUPPORTED: ###################################");
                break;
            case CCOMApplicationManagerObject.STATUS_FAILED_INVALID_METADATA:
                controlAppTrace("################################### onRequestAppStateHandler CCOMApplicationManagerObject.STATUS_FAILED_INVALID_METADATA: ###################################");
                break;
            case CCOMApplicationManagerObject.STATUS_FAILED_INVALID_PARAM:
                controlAppTrace("################################### onRequestAppStateHandler CCOMApplicationManagerObject.STATUS_FAILED_INVALID_PARAM: ###################################");
                break;
            case CCOMApplicationManagerObject.STATUS_FAILED_PERMISSION_DENIED:
                controlAppTrace("################################### onRequestAppStateHandler CCOMApplicationManagerObject.STATUS_FAILED_PERMISSION_DENIED: ###################################");
                break;
            case CCOMApplicationManagerObject.STATUS_FAILED_REQUEST_DENIED:
                controlAppTrace("################################### onRequestAppStateHandler CCOMApplicationManagerObject.STATUS_FAILED_REQUEST_DENIED: ###################################");
                break;
            case CCOMApplicationManagerObject.STATUS_FAILED_RTE_ERROR:
                controlAppTrace("################################### onRequestAppStateHandler CCOMApplicationManagerObject.STATUS_FAILED_RTE_ERROR: ###################################");
                break;
            default:
                break;
        }
        if (e.status !== CCOMApplicationManagerObject.STATUS_SUCCESS) {

            controlAppTrace("################################### onRequestAppStateHandler e.status!== CCOMApplicationManagerObject.STATUS_SUCCESS isPrevrequestComplete = 1 ###################################");
            isPrevrequestComplete = 1;
            //isNetflixSuspended = true;
        }
    }

    function onAppStateRequestedHandler(e) {
        var powerManagerUserMode = CCOMPwrmgrObj.userModeGet(),
            state;
        controlAppTrace("################################### onAppStateRequestedHandler e ###################################" + JSON.stringify(e));
        if (e.requestedState === CCOMApplicationControllerObject.STATE_APP_FOCUSED) {

            if (!powerManagerUserMode.error && powerManagerUserMode.status === 0) {
                if (powerManagerUserMode.mode === CCOMPwrmgrObj.STANDBY_ON) {
                    //CCOMPwrmgrObj.userModeSet(CCOMPwrmgrObj.STANDBY_OFF);
                    if (e.requesterId === CCOMApplicationControllerObject.REQUESTER_DIAL || e.requesterId === CCOMApplicationControllerObject.REQUESTER_SERVICE) {
                        controlAppTrace("################################### onAppStateRequestedHandler powerManagerUserMode === CCOMPwrmgrObj.STANDBY_ON  to  REQUESTER is DIAL and STANDBY_OFF###################################" + JSON.stringify(powerManagerUserMode));

                        CCOMPwrmgrObj.userModeSet(CCOMPwrmgrObj.STANDBY_OFF);
                        //activateCurrentApp();
                    } else {
                        controlAppTrace("################################### onAppStateRequestedHandler powerManagerUserMode === CCOMPwrmgrObj.STANDBY_ON  to  DENY REQUEST ###################################" + JSON.stringify(powerManagerUserMode));

                        CCOMApplicationControllerObject.processRequest(e.requestHandle, CCOMApplicationControllerObject.RESULT_DENIED);
                        return;
                    }
                }

            } else {
                controlAppTrace("################################### onAppStateRequestedHandler powerManagerUserMode === FAILURE ###################################" + JSON.stringify(powerManagerUserMode));


            }
        }

        //onAppStateChanged
        switch (e.requesterId) {
            case CCOMApplicationControllerObject.REQUESTER_APPLICATION:
                controlAppTrace("################################### onAppStateRequestedHandler CCOMApplicationControllerObject.REQUESTER_APPLICATION ###################################");
                state = CCOMApplicationControllerObject.RESULT_GRANTED;
                break;
            case CCOMApplicationControllerObject.REQUESTER_APPMGR:
                controlAppTrace("################################### onAppStateRequestedHandler CCOMApplicationControllerObject.REQUESTER_APPMGR ###################################");
                state = CCOMApplicationControllerObject.RESULT_GRANTED;
                break;
            case CCOMApplicationControllerObject.REQUESTER_CONTROLAPP:
                controlAppTrace("################################### onAppStateRequestedHandler CCOMApplicationControllerObject.REQUESTER_CONTROLAPP ###################################");
                state = CCOMApplicationControllerObject.RESULT_GRANTED;
                break;
            case CCOMApplicationControllerObject.REQUESTER_DIAL:
                controlAppTrace("################################### onAppStateRequestedHandler CCOMApplicationControllerObject.REQUESTER_DIAL ###################################");
                state = CCOMApplicationControllerObject.RESULT_GRANTED;
                break;
            case CCOMApplicationControllerObject.REQUESTER_SELF:
                controlAppTrace("################################### onAppStateRequestedHandler CCOMApplicationControllerObject.REQUESTER_SELF ###################################");
                state = CCOMApplicationControllerObject.RESULT_GRANTED;
                break;
            case CCOMApplicationControllerObject.REQUESTER_SERVICE:
                controlAppTrace("################################### onAppStateRequestedHandler CCOMApplicationControllerObject.REQUESTER_SERVICE ###################################");
                state = CCOMApplicationControllerObject.RESULT_GRANTED;
                break;
            case CCOMApplicationControllerObject.REQUESTER_USER:
                controlAppTrace("################################### onAppStateRequestedHandler CCOMApplicationControllerObject.REQUESTER_USER ###################################");
                state = CCOMApplicationControllerObject.RESULT_GRANTED;
                break;
            case CCOMApplicationControllerObject.REQUESTER_WATCHER:
                controlAppTrace("################################### onAppStateRequestedHandler CCOMApplicationControllerObject.REQUESTER_WATCHER ###################################");
                state = CCOMApplicationControllerObject.RESULT_GRANTED;
                break;
            default:
                break;
        }

        // isPrevrequestComplete = 0;
        $N.app.AppStore.showLoadingIcon();
        if (installedApps.length) {
            CCOMApplicationControllerObject.processRequest(e.requestHandle, state);
        } else {
            controlAppTrace("################################### onAppStateRequestedHandler e , Rejecting request , Please wait till gravity is up . ###################################" + JSON.stringify(e));
            CCOMApplicationControllerObject.processRequest(e.requestHandle, CCOMApplicationControllerObject.RESULT_DENIED);
        }

    }

    function isPrevrequestCompleteStatus(kill) {
        if (kill) {

            isPrevrequestComplete = 1;
        }
        return isPrevrequestComplete;
    }


    function destroyApp(launchRequest) {
        if (CCOM.ApplicationManager.isApplicationRunning(launchRequest)) {
            CCOM.ApplicationManager.destroyApplication(launchRequest);
        return true;
    }
        console.log("warning: destroyApp was called when not running!");
        return false;
    }

    function init() {
        controlAppTrace("Control App init started");

        CCOMApplicationObject = CCOM.Application;
        CCOMApplicationManagerObject = CCOM.ApplicationManager;
        CCOMApplicationControllerObject = CCOM.ApplicationController;
        CCOMAppinfoManagerObject = CCOM.AppinfoManager;
        CCOMPwrmgrObj = CCOM.Pwrmgr;

        var returnValue = CCOMApplicationObject.registerAsControlApplication(),
            r,
            result,
            applist = [ {
                    "appId":  "YouTube",
                    "uuId" :  "NAGRAYouTubehtml",
                    "name" :  "YouTube",
                    "args" :  "?launch=menu&additionalDataUrl=http%3A%2F%2Flocalhost%3A</system/opentv/DIAL/dialPort-ValueFromOTV5ConfigDB>%2Fapps%2FYouTube%2Fdial_data"
                }, {
                    "appId":  "Netflix",
                    "uuId" :  "NAGRANetflixnative",
                    "name" :  "Netflix",
                    "args" :  "-Q source_type=2"
                }, {
                    "appId":  "iView",
                    "uuId" :  "NAGRAiViewhtml",
                    "name" :  "iView",
                    "args" :  null
                }, {
                    "appId":  "_FoxtelPuck1_",
                    "uuId" :  "foxtel",
                    "name" :  "foxtel",
                    "args" :  null
                }

            ];
        controlAppTrace("CCOMApplicationObject.registerAsControlApplication returns " + returnValue.status);
        if (returnValue.status === true) {
            r = CCOMPwrmgrObj.userWakeReasonGet();
            CCOMApplicationControllerObject.addEventListener("onAppStateRequested", onAppStateRequestedHandler); // Need to handled GRANT or DENY based on LPM state -DONE
            CCOMApplicationControllerObject.addEventListener("onSetAppState", onSetAppStateHandler); // NOT Handled anything
            CCOMApplicationObject.addEventListener("onRequestState", onRequestStateHandler); // NOT Handled anything
            CCOMApplicationObject.addEventListener("onStateChanged", onStateChangedHandler); // NOT Handled anything
            CCOMApplicationObject.addEventListener("onStateTransition", onStateTransitionHandler); // NOT Handled anything
            CCOMApplicationManagerObject.subscribeAppStateChangedEvents();
            CCOMApplicationManagerObject.addEventListener("onAppStateChanged", onAppStateChangedHandler); // DONE
            CCOMApplicationManagerObject.addEventListener("onRequestAppState", onRequestAppStateHandler); // DONE but unused
            CCOMPwrmgrObj.addEventListener("onPwrmgrModeChanged", onPwrmgrModeChangedHandler);

            controlAppTrace("Control App init CCOMPwrmgrObj.userWakeReasonGet() r= " + JSON.stringify(r));
            if ((r.status === 0) && (r.wake_reason === CCOMPwrmgrObj.STB_WAKE_REASON_SCHEDULED || r.wake_reason === CCOMPwrmgrObj.STB_WAKE_REASON_WOL)) {
                controlAppTrace("Control App init CCOMPwrmgrObj.userWakeReasonGet() [ CCOMPwrmgrObj.STB_WAKE_REASON_SCHEDULED or CCOMPwrmgrObj.STB_WAKE_REASON_WOL] = " + JSON.stringify(r));
                CCOMPwrmgrObj.userModeSet(CCOMPwrmgrObj.STANDBY_ON);
            }
            //_stealKeys = _stealAllKeys.slice(0);
            CCOMAppinfoManagerObject.addEventListener("getAppinfoByQueryOK", netflixAppinfoByQueryOKHandler);
            CCOMAppinfoManagerObject.addEventListener("getAppinfoByQueryFailed", netflixAppinfoByQueryFailedHandler);
            result = CCOMAppinfoManagerObject.getAppinfoByQuery("UUID, UID, APP_ID, AUTHOR, START_ARG, AUTHOR_HREF", "APP_ID='Netflix'", null, 1);
            controlAppTrace("CCOMAppinfoManagerObject.getAppinfoByQuery returns " + result);
            setInstalledApps(applist);
            controlAppTrace('Control App init() successful');
        } else {
            controlAppTrace('Control App init() failed');
        }
    }
    return {

        /**
         * Method to initialise the control application
         * @method init
         * @param none
         * @return none
         */
        init: init,

        /**
         * Main method to launch the application
         * @method launchApp
         * @param {String} appId The appId of the application
         * @return none
         */
        LaunchInstalledApp         :  launchInstalledApp,
        LaunchNetFlixInSuspendMode :  launchNetFlixInSuspendMode,
        isPrevrequestCompleteStatus:  isPrevrequestCompleteStatus,
        LaunchNetFlix              :  launchNetFlix,
        launchNetFlixThruHotkey    :  launchNetFlixThruHotkey,
        setInstalledApps           :  setInstalledApps,
        destroyApp                 :  destroyApp

    };
}());
