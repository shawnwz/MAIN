"use strict";

$util.fetch = function fetch (url, timeout, postData) {
  // wrap old function to new function
  var token = {}; // pass in dummy token
  return $util.fetchToken(url, timeout, token, postData);
};

$util.fetchToken = function fetchToken (url, timeout, token, postData) {

  return new Promise(function fetchPromise (resolve, reject) {

    var _timeout,
      _xhr = new XMLHttpRequest(),
      _token = token || {},
      i, _chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    /**
     * @method onProgress
     * @param  {Object} event - progress event
     */
    function onProgress (event) {
      if (event && event.lengthComputable) {
        _token.percentage = Math.round(event.loaded / event.total * 100);
        _token.status = "progress";
        if (typeof _token.progress === "function") {
          _token.progress(_token);
        }
        //console.log(_token.seed, "percent", _token.percentage);
      } else {
        //console.log(_token.seed, "cant get percentage", event);
      }
    }

    /**
     * @method onComplete
     * @param  {Object} event - complete event
     */
    function onComplete () {
      var response = JSON.parse(this.responseText);
      clearTimeout(_timeout);
      _token.status = "complete";
      _token.cancel = null; // can no longer cancel
      //console.log(_token.seed, "complete");
      if (response.error) {
        reject(response.error.code + ": " + response.error.message);
      } else {
        resolve(response);
      }
    }

    /**
     * @method onError
     * @param  {Object} event - error event
     */
    function onError (event) {
      var response = { "event": event };
      clearTimeout(_timeout);
      _token.status = "error";
      _token.cancel = null; // can no longer cancel
      console.log(_token.seed, "error", event);
      reject(response);
    }

    /**
     * @method onAbort
     * @param  {Object} event - abort event
     */
    function onAbort (event) {
      var response = { "event": event };
      clearTimeout(_timeout);
      _token.status = "aborted";
      _token.cancel = null; // can no longer cancel
      console.log(_token.seed, "aborted"/*, event*/);
      reject(response);
    }

    _xhr.addEventListener("progress", onProgress);
    _xhr.addEventListener("load", onComplete);
    _xhr.addEventListener("error", onError);
    _xhr.addEventListener("abort", onAbort);

    _token.url = url;
    _token.seed = Date.now();
    for (i = 0; i < 10; i++) {
      _token.seed += _chars.charAt(Math.floor(Math.random() * _chars.length));
    }
    _token.percentage = 0;
    _token.cancel = function() {
      _token.status = "cancelled";
      //console.log(_token.seed, "cancel");
      _xhr.abort(); // abort request
    };

    if (!postData) {
      _xhr.open("GET", url);
      _xhr.send();
    } else {
      _xhr.open("POST", url);
      _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      _xhr.send(postData);
    }

    if (timeout) {
      _timeout = setTimeout(function () {
        _token.status = "timed out";
        console.log(_token.seed, "timeout");
        _xhr.abort();
      }, timeout);
    }
  });
};
