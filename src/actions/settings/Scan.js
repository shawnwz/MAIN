/**
 * @class Scan
 */
$actions.settings.Scan = (function Scan() {

	var scanner = null,
		useFakeDvbScan = null,
		failFakeDvbScan = null,

		scanTunnerTypes = null,
		scanTunnerIndex = null;

	/**
	 * Perform a DVBT scan
	 * @method doScan
	 * @private
	 */
	function doScan() {
		var networkType = scanner.NetworkType[scanTunnerTypes[scanTunnerIndex]];
		$util.ControlEvents.fire("app-video", "stop");
		if (scanTunnerIndex === scanTunnerTypes.length - 1) {
			scanner.setScanCompleteCallback($util.Events.fire.bind(null, "settings:scan:complete"));
			scanner.setScanFailureCallback($util.Events.fire.bind(null, "settings:scan:failed"));
		}
		scanner.setScanProgressCallback($util.Events.fire.bind(null, "settings:scan:progress"));
		scanner.startScan(networkType, $config.getConfigValue("dvb.scan.parameters")[$config.getConfigValue("dvb.scan.name")[scanTunnerIndex]]);
	}

	/**
	 * Perform a fake successful DVBT scan
	 * @method doFakeScan
	 * @private
	 */
	function doFakeScan() {
		var progressInfo = {
			percentComplete: 0,
			totalServices  : 0
		};

		/**
		 * @method fakeScan
		 * @private
		 */
		function fakeScan() {
			if (progressInfo.percentComplete === 100) {
				$util.Events.fire("settings:scan:progress", progressInfo);
				$util.Events.fire("settings:scan:complete");
			} else {
				progressInfo.percentComplete += 10;
				progressInfo.totalServices += Math.floor(Math.random() * (12 - 3) + 3);
				$util.Events.fire("settings:scan:progress", progressInfo);
				if (failFakeDvbScan && progressInfo.percentComplete > 20) {
					$util.Events.fire("settings:scan:failed");
				} else {
					setTimeout(fakeScan, 2000);
				}
			}
		}

		setTimeout(fakeScan, 2000);

	}

	/**
	 * @method scan
	 */
	function scan() {
		if (!useFakeDvbScan) {
			doScan();
		} else {
			doFakeScan();
		}
	}

	function scanCompleteListener() {
		var len = scanTunnerTypes.length,
			scanSplash;

		if (scanTunnerIndex < len - 1) {
			$util.Events.fire("settings:scan:enableAutomatic");
			scanTunnerIndex++;
			setTimeout(scan, 1000);
		} else {
			scanTunnerIndex = 0;
			scanSplash = document.getElementById("firstInstallSplash");
			if (scanSplash) {
				$util.ControlEvents.fire("app-home-menu", "fetch");
				$util.Events.fire("app:navigate:to", "home-menu");
				document.body.removeChild(scanSplash);
			}
		}
	}

	/* Public API */
	return {

		/**
		 * @method init
		 */
		init: function () {
			$service.scan.DVBScanUtil.initialise();

			CCOM.SINetwork.addEventListener("onScanComplete", scanCompleteListener.bind(this));

			scanner = o5.platform.system.Scan;
			scanTunnerTypes = $config.getConfigValue("stb.tuner.type");
			scanTunnerIndex = 0;

			useFakeDvbScan = ($config.getConfigValue("use.fake.dvb.scan") === true);
			failFakeDvbScan = ($config.getConfigValue("fail.fake.dvb.scan") === true);
			$util.Events.on("settings:scan:scan", scan);
			$util.Events.on("settings:scan:cancel", scanner.cancelScan, scanner);
			$util.Events.on("settings:scan:enableAutomatic", scanner.enableAutomaticScanning, scanner);

			var scanComplete = o5.platform.system.Preferences.get("installation.complete"),
				firstInstallSplash = document.createElement("div");

			firstInstallSplash.id = "firstInstallSplash";
			firstInstallSplash.className = "scanSplash";
			document.body.appendChild(firstInstallSplash);
			if (scanComplete !== true && scanComplete !== "true") {

				setTimeout(function() {
					scan();
					o5.platform.system.Preferences.set("installation.complete", true);
			    }, 30 * 1000);
			} else {
				setTimeout(function() {
					$util.Events.fire("settings:scan:complete");
					document.body.removeChild(document.getElementById("firstInstallSplash"));
			    }, 1500);
			}
		}
	};
}());
