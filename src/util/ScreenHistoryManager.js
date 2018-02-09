/**
 * @class ScreenHistoryManager
 * This class manage navigation history within single view
 */
"use strict";

$util.ScreenHistoryManager = (function () {
	var _historyStack = [],
		_viewElement;

	/**
	 * @method _updateHistory
	 * @param {Object} currentScreen
	 */
	function _updateHistory(currentScreen) {
		var i;
		for (i = 0; i < _historyStack.length; i++) {
			if (currentScreen.id === _historyStack[i].id) {
				_historyStack.splice(i, 1);
			}
		}
		_historyStack.push(currentScreen);
	}

	/**
	 * @method _navigateTo
	 * @param {String} id
	 * @param {Object} data to create new screen
	 */
	function _navigateTo(data) {
		var currentScrData = _viewElement.getCurrentScreenInfo(),
			currentScreen =  JSON.parse(JSON.stringify(currentScrData));
		$util.Events.fire("scr:passivate");
		$util.Events.fire("scr:activate", data);
		_updateHistory(currentScreen);
		//_historyStack.push(currentScreen);
	}

	/**
	 * @method _navigateWithoutHistoryTo
	 * @param {String} id
	 * @param {Object} data to create new screen
	 */
	function _navigateWithoutHistoryTo(data) {
		$util.Events.fire("scr:passivate");
		$util.Events.fire("scr:activate", data);
	}

	/**
	 * @method _clearHistory
	 */
	function _clearHistory() {
		_historyStack = [];
	}

	/**
	 * @method isScrHistoryAvaliable
	 */
	function isScrHistoryAvaliable() {
		return (_historyStack.length > 0);
	}

	/**
	 * @method _navigateToPreviousScreen
	 */
	function _navigateToPreviousScreen() {
		var previousScr = _historyStack.pop();
		$util.Events.fire("scr:passivate");
		$util.Events.fire("scr:activate", previousScr);
	}

	/**
	 * @method _registerEvent
	 */
	function _registerEvent() {
		$util.Events.on("scr:navigate:to", _navigateTo);
		$util.Events.on("scr:navigateWithoutHistory:to", _navigateWithoutHistoryTo);
		$util.Events.on("scr:clearHistory", _clearHistory);
		$util.Events.on("scr:back", _navigateToPreviousScreen);

	}

	/**
	 * @method _unregisterEvent
	 */
	function _unregisterEvent() {
		$util.Events.remove("scr:navigate:to", _navigateTo);
		$util.Events.remove("scr:navigateWithoutHistory:to", _navigateWithoutHistoryTo);
		$util.Events.remove("scr:clearHistory", _clearHistory);
		$util.Events.remove("scr:back", _navigateToPreviousScreen);
	}

	/**
	 * @method activate
	 */
	function activate(viewElememt) {
		_viewElement = viewElememt;
		_registerEvent();
	}

	/**
	 * @method passivate
	 */
	function passivate() {
		_viewElement = null;
		_clearHistory();
		_unregisterEvent();
	}

	/**
	 * @method init
	 */
	function init() {
	//	_registerEvent();
	}

	/* Public API */
	return {
		init                 : init,
		activate             : activate,
		passivate            : passivate,
		isScrHistoryAvaliable: isScrHistoryAvaliable };
}());
