"use strict";
//eslint-disable-next-line no-unused-vars
var Launch = (function () {

    var viewsToLoad = [
			{ id: "video",             timeout: 0,    path: "views/video/video.html",                          cacheStrategy: "alwaysLoaded", isDefault: true },
			{ id: "home-menu",         timeout: 600000, path: "views/homeMenu/homeMenu.html",                   cacheStrategy: "alwaysLoaded" },
			{ id: "guide",             timeout: 600000, path: "views/guide/guide.html",                     		 cacheStrategy: "alwaysLoaded" },
			{ id: "player",            timeout: 600000, path: "views/player/player.html",                       cacheStrategy: "alwaysLoaded" },
			{ id: "surf",              timeout: 600000, path: "views/surf/surf.html",                           cacheStrategy: "alwaysLoaded" },
			{ id: "synopsis",          timeout: 600000, path: "views/synopsis/synopsis.html",                   cacheStrategy: "alwaysLoaded" },
			{ id: "searchCollection",  timeout: 600000, path: "views/searchCollection/searchCollection.html",   cacheStrategy: "alwaysLoaded" },
			{ id: "searchFullQuery",   timeout: 600000, path: "views/searchFullQuery/searchFullQuery.html",     cacheStrategy: "alwaysLoaded" },
			{ id: "searchQuery",       timeout: 600000, path: "views/searchQuery/searchQuery.html",             cacheStrategy: "alwaysLoaded" },
			{ id: "settings",          timeout: 600000, path: "views/settings/settings.html",                   cacheStrategy: "alwaysLoaded" },
			{ id: "home",              timeout: 600000, path: "views/home/home.html",                           cacheStrategy: "alwaysLoaded" },
			{ id: "library",           timeout: 600000, path: "views/library/library.html",                     cacheStrategy: "alwaysLoaded" },
			{ id: "apps",              timeout: 600000, path: "views/apps/apps.html",                           cacheStrategy: "alwaysLoaded" },
			{ id: "store",             timeout: 600000, path: "views/store/store.html",                         cacheStrategy: "alwaysLoaded" },
			{ id: "onDemand",          timeout: 600000, path: "views/onDemand/onDemand.html",                   cacheStrategy: "alwaysLoaded" },
			{ id: "homeTvGuide",       timeout: 600000, path: "views/homeTvGuide/homeTvGuide.html",             cacheStrategy: "alwaysLoaded" },
			{ id: "homeSearch",        timeout: 600000, path: "views/homeSearch/homeSearch.html",               cacheStrategy: "alwaysLoaded" },
			{ id: "homeSetting",       timeout: 600000, path: "views/homeSetting/homeSetting.html",             cacheStrategy: "alwaysLoaded" }
		],
		attachedViewCount = 0,
		defaultView = viewsToLoad.reduce(function (acc, view) {
			return (view.isDefault) ? view : acc;
		}, null);

	/**
	 * @method initActions
	 * @private
	 */
	function initActions () {
		$actions.Navigate.init();
		$actions.EPG.Channel.init();
		$actions.settings.AV.init();
		$actions.settings.Scan.init();
		$actions.settings.IpNetwork.init();
		$actions.settings.Notifications.init();
		$actions.settings.Privacy.init();
		$actions.settings.TvGuide.init();
		$actions.settings.ChannelBlocking.init();
		$actions.settings.PinControl.init();
		$actions.settings.ViewRestrictions.init();
		$actions.app.OTVControlApp.init();
		$actions.app.LaunchAppUtil.init();
	}

	/**
	 * @method initServices
	 * @private
	 */
	function initServices () {

		$service.SDP.Base.init();

		$service.EPG.Event.init();
		$service.EPG.Channel.init();

		$service.MDS.Base.init();
		$service.MDS.Map.init();
		$service.MDS.Node.init();
		$service.MDS.Asset.init();
		$service.MDS.Channel.init();
		$service.MDS.Episode.init();
		$service.MDS.Programme.init();
		$service.MDS.Editorial.init();

		$service.DISCO.Base.init();
		$service.DISCO.Map.init();
		$service.DISCO.Asset.init();
		$service.DISCO.Search.init();
		$service.DISCO.Morelikethis.init();
		$service.settings.WifiService.init();
		$service.settings.PinService.init();
		$service.settings.FavouriteService.init();
		$service.settings.NetworkTestService.init();
	}

	/**
	 * @method init
	 * @private
	 */
	function logSystemDetails () {
		console.log("******************************************************************************************************************************************");
		console.log("Hardware version: " + $service.settings.SystemDetails.getHardwareVersion());
		console.log("OS version: " + $service.settings.SystemDetails.getOperatingSystemVersion().substring(0, 28));
		console.log("Software version: " + $service.settings.SystemDetails.getSoftwareVersion());
		console.log("EPG version: " + $service.settings.SystemDetails.getEPGSoftwareVersion());
		console.log("******************************************************************************************************************************************");
	}

	/**
	 * @method init
	 * @private
	 */
	function init () {
		$config.init();
		o5.platform.system.Preferences.init();
		//@HdK o5.platform.btv.EPG.init();
		o5.platform.system.Scan.initialise($config.getConfigValue("dvb.scan.config"));
		$config.saveConfigValue("settings.browser.reboot.times", $config.getConfigValue("settings.browser.reboot.times") + 1);

		$util.Translations.init();
		$util.Translations.setLanguage("en_AU");
		$util.Translations.extend("./translations/en_AUplus.json");

		logSystemDetails();
		initActions();
		setTimeout(function () {
			initServices();
		}, 50);
	}

	/**
	 * @method loadViews
	 * @private
	 */
	function loadViews () {
		var themeName = $config.getConfigValue("settings.view.theme");

		document.querySelector('body').className = themeName + "Theme";

		// append css for views and register them
		viewsToLoad.forEach(function (view) {
			o5.gui.ViewManager.registerViewTimeout(view.id, view.path, o5.gui.ViewManager.CacheStrategy[view.cacheStrategy], view.timeout);
		});
		if (defaultView) {
			o5.gui.ViewManager.defaultView = defaultView.id;
		}
	}

	/**
	 * @method attachedViewListener
	 * @private
	 */
	function attachedViewListener () {
		attachedViewCount++;
		if (attachedViewCount === viewsToLoad.length) {
			$util.Events.remove("app:view:attached", attachedViewListener);
			$util.Events.fire("app:boot");
		}
	}

	/**
	 * @method bootApp
	 * @private
	 */
	function bootApp () {
		$util.LogConfig.enable();
		// Video context remains hidden even though its the default context if we don't open it first
		// $util.Events.fire("app:navigate:to:default");
		o5.gui.ViewManager.open("video");
		if (o5.platform.system.Preferences.get("installation.complete")) {
			$util.ControlEvents.fire("app-home-menu", "fetch");
			$util.Events.fire("app:navigate:to", "home-menu");
		}
	}

	/**
	 * @method createEvents
	 * @private
	 */
	function createEvents () {
		$util.Events.on("app:view:attached", attachedViewListener);
		$util.Events.once("app:boot", bootApp);

		$util.ControlEvents.on("app", "navigate:to", function (data) {
			$util.Events.fire("app:navigate:to", data);
		}, this);
	}

	return {

		/**
		 * @method load
		 * @public
		 */
		load: function load () {
			init();
			createEvents();
			loadViews();
		}
	};

}());

document.addEventListener("keydown", $util.defaultKeyHandler, false);
