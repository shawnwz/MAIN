/**
 * @class app.gui.controls.SurfCallToActionList
 */

app.gui.controls.SurfCallToActionList = function SurfCallToActionList() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfCallToActionList, app.gui.controls.CallToActionList);

/**
 * @method createdCallback
 */
app.gui.controls.SurfCallToActionList.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();
  this._miniSynopsis = document.querySelector('#surfScanMiniSynopsis');
	this.logExit();
};

/**
 * @method _fetch
 */
app.gui.controls.SurfCallToActionList.prototype._fetch = function _fetch(programme) {
	this.logEntry();
	var items = [],
		synopsisVisible,
		dataReady = false;

	if (programme) {

		synopsisVisible = this._miniSynopsis.visible;

		items.push("ctaUpDown");

		if (dataReady) { // channelType === _TYPE_PVR_VOD) { // only if VOD
			items.push("ctaInfo");
			items.push("ctaJumpTo");
			items.push("ctaOptions");
		}

		if (programme.isEndCell !== true) { // && channelType === _TYPE_TV) { // for TV & RADIO

			if (dataReady) { // _shouldShowOrderAction(curEvent)) {
				items.push("ctaOrder");
			}
			if (synopsisVisible) {
				items.push("ctaFullDetails");
			} else if (programme.isRadio !== true) {
				items.push("ctaInfo");
			}
			items.push("ctaOptions");

			//remove record cta button
			/*
			if (programme.isOnNow === true) { // _currentView === _VIEW_NOW) {
				if (false) { // getRecCta(programme, getRecordings() OR curEvent.getRecordingStatus()) {
					items.push("ctaRecordOptions");
				} else {
					items.push("ctaRecord");
				}
			} else if (programme.isCatchUp === true) { // && isConnected && !programme.isFiller && )) {
				 // items.push("ctaRecord");
				if (false) { // dlAction && downloadState !== null && downloadState !== $pullVOD.STATE_COMPLETE) { //Currently downloading
					items.push("ctaCancel");
				} else if (false) { // Download not initiated
					items.push("ctaRecord");
				}
			}
			*/
			if (programme.isMovie !== true) { //  && isConnected && !programme.isFiller) {
				if (programme.isOnNow === true && programme.isStartOver === true) { // _currentView === _VIEW_NOW && channel.isEntitled) {
					items.push("ctaStartOver");
				} else if (programme.isReverse === true && programme.isCatchUp === true) { // _currentView === _VIEW_REVERSE) {
					items.push("ctaWatchNow");
				}
			}
		}
	}

	this.fireControlEvent("populate", items);
	this.fireControlEvent("show");

	this.logExit();
};
