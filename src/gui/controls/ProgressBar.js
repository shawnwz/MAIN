/**
 * Example markup:
 *
 *     <app-progress-bar id="settingsScanProgress"></app-progress-bar>
 *
 * @class app.gui.controls.ProgressBar
 * @extends o5.gui.controls.Control
 */

app.gui.controls.ProgressBar = function ProgressBar() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.ProgressBar);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.ProgressBar.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	var scanBarFill = this.ownerDocument.createElement("div"),
		scanBarGlow = this.ownerDocument.createElement("div");

	scanBarFill.className = "progressFill";
	scanBarGlow.className = "progressGlow";

	scanBarFill.appendChild(scanBarGlow);
	this.appendChild(scanBarFill);

	this._progressBar = scanBarFill;
	this.logExit();
};

/**
 * @method updateProgress
 * @public
 * @return {Number} percent
 */
app.gui.controls.ProgressBar.prototype.updateProgress = function updateProgress(percent) {
	this.logEntry();
	this._progressBar.style.width = percent + "%";
	this.logExit();
};
