/**
 * @class LogConfig
 */
"use strict";

$util.LogConfig = (function () {

	var isInitialised = false,
		objectsToLog = [];

	/**
	 * @method initialise
	 */
	function initialise() {
		objectsToLog = [
//			o5.gui.controls.List,
//			app.gui.controls.HtmlTable,
//			app.gui.controls.HtmlFocusItem,
//			app.gui.controls.ChannelLogo,
//			app.gui.controls.SettingsScan,
//			app.gui.controls.SettingsConfigMenu,
//			app.gui.controls.SettingsConfigMenuRow,
//			app.gui.controls.SettingsToggle,
//			app.gui.controls.GridMenu,
//			app.gui.controls.Menu,
//			app.gui.controls.TileMosaicPageList,
//			app.gui.controls.TileMosaicPageListItem,
//			app.gui.controls.TileMosaicColumnList,
//			app.gui.controls.TileMosaicColumnListItem,
//			app.gui.controls.TileMosaicTileList,
//			app.gui.controls.TileMosaicTileListItem,
//			app.gui.controls.TileMosaicScrollbar,
//			app.gui.controls.Carousel,
//			app.gui.controls.CarouselList,
//			app.gui.controls.CarouselItem,
//			app.gui.controls.CarouselRow,
//			app.gui.controls.HomeMenuList,
//			app.gui.controls.HomeMenuListItem,
//			app.gui.controls.HomeSubMenuList,
//			app.gui.controls.HomeSubMenuListItem,
//			app.gui.controls.PortalMenuList,
//			app.gui.controls.PortalMenuListItem,
//			app.gui.controls.PortalBreadcrumb,
//			app.gui.controls.JumpoffList,
//			app.gui.controls.JumpoffListItem,
//			app.views.Surf,
//			app.gui.controls.SurfChannelList,
//			app.gui.controls.SurfEventsList,
//			app.gui.controls.SurfFutureEventsList,
//			app.gui.controls.SurfPastEventsList,
//			app.gui.controls.SurfChannelBox,
//			app.gui.controls.SurfChannelListItem,
//			app.gui.controls.SurfEventsListItem,
//			app.views.HomeMenu,
//			app.views.Guide,
//			app.gui.controls.GuideChannelList,
//			app.gui.controls.GuideChannelListItem,
//			app.gui.controls.GuideClock,
//			app.gui.controls.GuideNowNextGrid,
//			app.gui.controls.GuideNowNextGridCell,
//			app.gui.controls.GuideNowNextGridRow,
//			app.views.Settings,
//			app.views.Apps,
//			app.views.SearchQuery,
//			app.views.SearchFullQuery,
//			app.views.SearchCollection,
//			app.gui.controls.SearchNewButton,
//			app.gui.controls.SearchRecentList,
//			app.gui.controls.SearchRecentListItem,
//			app.gui.controls.SearchPopularList,
//			app.gui.controls.SearchPopularListItem,
//			app.gui.controls.SearchResultsList,
//			app.gui.controls.SearchResultsListItem,
//			app.gui.controls.SearchFullResultsList,
//			app.gui.controls.SearchFullResultsListItem,
//			app.views.Synopsis,
//			app.gui.controls.SynopsisCastTable,
//			app.gui.controls.SynopsisCastPanel,
//			app.gui.controls.SynopsisDetails,
//			app.gui.controls.SynopsisEpisodesList,
//			app.gui.controls.SynopsisEpisodePanel,
//			app.gui.controls.SynopsisMorelikethisPanel,
//			app.gui.controls.SynopsisNavmenuList,
//			app.gui.controls.SynopsisOverviewPanel,
//			app.gui.controls.SynopsisRating,
//			app.gui.controls.SynopsisStatusActionsList,
//			//app.gui.controls.SynopsisEpisodesListItem,
//			//app.gui.controls.SynopsisNavmenuListItem,
//			//app.gui.controls.SynopsisStatusActionsListItem,
		];
	}

	/**
	 * Enabled a particular log
	 * @method enableLogs
	 * @private
	 */
	function enableLogs(obj, n) {
		if (obj) {
			o5.log.setAll(obj, true);
		} else {
			console.error("module does not exist! index=" + n);
		}
	}

	/**
	 * Disables a particular log
	 * @method enableLogs
	 * @private
	 */
	function disableLogs(obj) {
		o5.log.setAll(obj, false);
	}

	/* Public API */
	return {

		/**
		 * This function should only be called after views are attached.
		 * @method enable
		 */
		enable: function () {
			if (!isInitialised) {
				initialise();
			}
			objectsToLog.forEach(enableLogs);
		},

		/**
		 * @method disable
		 */
		disable: function () {
			objectsToLog.forEach(disableLogs);
		}
	};
}());
