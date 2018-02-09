"use strict";

$util.fetch = function fetch (url, timeout, postData) {

	return new Promise(function fetchPromise (resolve, reject) {

		var abortTimeout,
			xhr = new XMLHttpRequest();

		/**
		 * @method progress
		 * @param  {Object} event - progress event
		 */
		function progress (event) {
			// console.log("progress! :)");
			if (event.lengthComputable) {
				// var percentComplete = Math.round(event.loaded / event.total * 100);
				// console.log("percentComplete" + percentComplete);
			} else {
				// console.log("cant get percentage :(");
			}
		}

		/**
		 * @method progress
		 * @param  {Object} event - progress event
		 */
		function complete () {
			var response = JSON.parse(this.responseText);

			response.url = url; // added to match requests with responses
			clearTimeout(abortTimeout);
			//console.log("The transfer is complete");
			//console.log(event);
			if (response.error) {
				reject(response.error.code + ": " + response.error.message);
			} else {
				resolve(response);
			}
		}

		/**
		 * @method progress
		 * @param  {Object} event - progress event
		 */
		function failed (event) {
			var response = {
				"event": event,
				"url"  : url // added to match requests with responses
			};

			console.log("The transfer failed");
			console.log(event);
			reject(response);
		}

		/**
		 * @method progress
		 * @param  {Object} event - progress event
		 */
		function cancelled (event) {
			var response = {
				"event": event,
				"url"  : url // added to match requests with responses
			};

			console.log("The transfer is cancelled");
			console.log(event);
			reject(response);
		}

		xhr.addEventListener("progress", progress);
		xhr.addEventListener("load", complete);
		xhr.addEventListener("error", failed);
		xhr.addEventListener("abort", cancelled);


		if (!postData) {
			xhr.open("GET", url);
			xhr.send();
		} else {
			xhr.open("POST", url);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			xhr.send(postData);
		}

		abortTimeout = setTimeout(function abortFetchTimeout () {
			xhr.abort();
		}, timeout);

	});
};
