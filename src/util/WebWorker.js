/**
 * Wrapper for workers to set up and process messages
 * @method WebWorker
 * @constructor
 * @param  {String} uri - relative path to worker
 */
"use strict";

$util.WebWorker = function WebWorker(uri) {
	this._worker = new Worker(uri, window.location.href);
	this._worker.addEventListener("message", this._receiveMessage.bind(this), false);
};

/**
 * @method _receiveMessage
 * @param  {Object} e - message object
 */
$util.WebWorker.prototype._receiveMessage = function _receiveMessage(e) {
	if (e.data) {
		this.receiveMessage(e.data.cmd, e.data);
	}
};

/**
 * Send a message to the worker
 * @method sendMessage
 * @param  {String} cmd - Command to send
 * @param  {Object} config - Configuration parameters for command
 */
$util.WebWorker.prototype.sendMessage = function sendMessage(cmd, config) {
	this._worker.postMessage({
		cmd   : cmd,
		config: config
	});
};

/**
 * @method receiveMessage
 * @param  {String} cmd - Command to send
 * @param  {Object} config - Configuration parameters for command
 * @abstract
 */
$util.WebWorker.prototype.receiveMessage = function receiveMessage(cmd, config) {
	throw new Error("No receiveMessage implemented cmd:" + cmd +  " config: " + JSON.strinfify(config, null, 0));
};
