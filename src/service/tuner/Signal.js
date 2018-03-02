/**
 * @class $service.tuner.Signal
 */
"use strict";

$service.tuner.Signal = (function Signal () {
  var isSignalAvaliable = true,
   playerTuner = null;

	function signalLostListner() {
		isSignalAvaliable = false;
		//Todo
	}

	function singalGainListner() {
		isSignalAvaliable = true;
		// TOdo
	}

	function init(tuner) {
		playerTuner = tuner;
		tuner.registerQosDegradedListener(signalLostListner);
		tuner.registerQosImprovedListener(singalGainListner);
	}
	
	function getSignalStatus() {
		return isSignalAvaliable;
	}
	
	function getTuner() {
		return playerTuner;
	}
	return {
		init : init,
		getSignalStatus : getSignalStatus,
		getTuner : getTuner
	};
}());
