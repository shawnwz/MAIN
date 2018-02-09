/**
 * CCOM 3.9 Stubs
 * The CCOM.stubs object is the extra object only exists in CCOM Stubs.
 * @ignore
 */
CCOM = new (function CCOMStubs() { })();
CCOM.stubs = new (function stubs()
{
	"use strict";
	this._CCOM_STUBS_VERSION = "3.9";
	this.MW_VER_5_1_3 = "5.1.3";
	this.MW_VER_5_1_4 = "5.1.4";
	this.MW_VER_5_1_5 = "5.1.5";
	this.MW_VER_5_2_0 = "5.2.0";
	this.MW_VER_5_2_1 = "5.2.1";
	this.MW_VER_5_2_2 = "5.2.2";
	this.MW_VER_5_2_3 = "5.2.3";
	this.MW_VER_5_2_4 = "5.2.4";

	this._supportedMWVersions = [ this.MW_VER_5_1_4, this.MW_VER_5_2_0, this.MW_VER_5_2_1, this.MW_VER_5_2_2, this.MW_VER_5_2_3, this.MW_VER_5_2_4 ];

	// by default we emulate the latest MW version
	this._currentMWVersion = this.MW_VER_5_2_4;
	// default delay for raising events, in milliseconds
	this._EVENT_DELAY_MS = 20;

	this.ERROR_NOT_REGISTERED = {
		error : {
			domain : "com.opentv.ccom",
			name : "HandlerNotRegistered",
			message : "The handler is not registered."
		}
	};

	this.ERROR_INVALID_CALLBACK = {
		error : {
			domain : "com.opentv.ccom",
			name : "InvalidArguments",
			message : "The callback is invalid."
		}
	};

	this.ERROR_INVALID_EVENT = {
		error : {
			domain : "com.opentv.ccom",
			name : "InvalidArguments",
			message : "The event is invalid."
		}
	};

	this.SUCCESS = {};

	/**
	 * The internal object this._eventListeners is a single container for all event listeners on all CCOM stubs objects. In the container,
	 * each event-emitting object is a key-value pair, where the "key" is a string identifing the object, and the "value" is an
	 * one-dimensional array of registered callback functions. e.g., the container may look like:
	 *  { "1234.CCOM.AIM.addOK" : [callback1, callback2], "1234.CCOM.AIM.deleteOK" : [callback] }
	 *
	 * The "key" is composed of 3 parts: - the object uuid, e.g., "1234" - the object name space, e.g.: "CCOM.AIM" - the event name, e.g.,
	 * "addOk"
	 *
	 * The "uuid" is used to handle cases where multiple instances (e.g., players) may exist at the same time (although most of the CCOM
	 * objects are singletons). This implies that each object in CCOM stubs has its own uuid. The uuid is private to each object, and
	 * CCOM.stubs.uuid() is supposed to return one once called.
	 */

	this._eventListeners = [];
	this._getPropName = function(uuid, namespace, event)
	{
		return uuid + "." + namespace + "." + event;
	};

	/**
	 * utilities
	 */
	// get universal unique id (in string)
	this.uuid = (function(init)
	{
		var _id = init;

		return function()
		{
			_id += 1;
			return _id.toString();
		};
	}(2014));

	// get universal unique handle
	this.getHandle = (function()
	{
		var _handle = 0;

		return function()
		{
			_handle += 1;
			return _handle;
		};
	}());

	this.CCOM_stub_files = [ "AIM.js", "ApplicationController.js", "Application.js", "ApplicationManager.js", "ApplicationTime.js",
			"Bluetooth.js", "ConditionalAccess.js", "ConfigManager.js", "ControlCenter.js", "EPG.js", "HomeNetworking.js", "IpNetwork.js",
			"MediaLibrary.js", "Player.js","PlayerManager.js", "RTEWindow.js", "ResultSet.js", "Scheduler.js", "SINetwork.js", "SoftwareUpgradeManager.js",
			"System.js", "UserAuth.js", "WindowManager.js", "DRM.js", "HomeNetworkingSrs.js", "Notify.js", "PowerManager.js", "Watcher.js",
			"DSMCC.js","ConditionalAccess2nagra.js"

	];

	/**
	 * This is a CCOM stubs internal function to be called by each objects, not to be called by applications.
	 *
	 * @param {String}
	 *            event The event name prefixed with object's name space. e.g., "CCOM.AIM.onNew"
	 * @param {String}
	 *            uuid The uuid of the object listening to
	 * @param {String}
	 *            namespace The name space of the object
	 * @param {Function}
	 *            callback The callback function of the event from the object
	 * @return ???
	 */
	this.addEventListener = function(uuid, namespace, event, callback)
	{

		/**
		 * note: each individual object should check the "event" parameter before call this one, as the object knows the exact details of
		 * the events it suports. it's also assumed that each object has its own proper uuid and namespace. i.e., we don't check "uuid",
		 * "namespace", and "event" parameters here.
		 */
		var prop = this._getPropName(uuid, namespace, event);
		// "callback" parameter is checked here in common

		if (!callback)
		{
			return this.ERROR_INVALID_CALLBACK;
		}
		if (this._eventListeners[prop] === undefined)
		{
			this._eventListeners[prop] = [];
		}
		this._eventListeners[prop].push(callback);

		/**
		 * The CCOM document said three ways for return: a. No return, unless an error is generated b. Returns: 0 - Success 1 - Unsupported
		 * event 2 - Bad argument (eventHandler is null, or eventName is null) c. RETURN DETAILS: ...... An empty return object indicates
		 * success
		 *
		 * WHICH ONE WHOULD WE FOLLOW?
		 */
		return this.SUCCESS;
	};

	this.removeEventListener = function(uuid, namespace, event, callback)
	{
		var i, hit = false, prop = this._getPropName(uuid, namespace, event), listeners = this._eventListeners[prop];
		// "callback" parameter is checked here in common

		if (!callback)
		{
			return this.ERROR_INVALID_CALLBACK;
		}
		if (!listeners)
		{
			return this.ERROR_NOT_REGISTERED;
		}
		for (i = 0; i < listeners.length; i += 1)
		{
			if (listeners[i] === callback)
			{
				listeners.splice(i, 1);
				hit = true;
			}
		}
		if (!hit)
		{
			return this.ERROR_NOT_REGISTERED;
		}
		return this.SUCCESS;
	};

	this.raiseEvent = function(uuid, namespace, event, parameter, delay)
	{
		window.setTimeout(function()
		{
			var prop = this._getPropName(uuid, namespace, event), listeners = this._eventListeners[prop];

			if (listeners)
			{
				listeners.forEach(function(hook)
				{
					hook(parameter);
				});
			}
		}.bind(this), delay || this._EVENT_DELAY_MS);
	};

	/*
	 * Load CCOM stub files one by one synchronously @method loadStubs @param {String} path for loading the CCOM stubs files @param
	 * {Function} callback function when done
	 */
	this.loadStubs = function(path, doneCallback)
	{
		var index = 0;
		var load_file_synchronously = function()
		{
			if (index < this.CCOM_stub_files.length)
			{
				var script = document.createElement("script");

				script.type = "text/javascript";
				script.src = path + this.CCOM_stub_files[index];
				script.onload = load_file_synchronously;
				index++;
				document.getElementsByTagName('head')[0].appendChild(script);
			}
			else if (doneCallback)
			{
				doneCallback();
			}
		}.bind(this);

		load_file_synchronously();
	};

	Object.defineProperty(this, 'log', {
		value : function(msg)
		{
			if (window.console && window.console.log)
			{
				window.console.log("[CCOM.stub.log] " + msg);
			}
		}
	});

	this.getVersion = function()
	{
		return this._CCOM_STUBS_VERSION;
	};

	this.getSupportedMWVersions = function()
	{
		return this._supportedMWVersions;
	};

	this.getCurrentMWVersion = function()
	{
		return this._currentMWVersion;
	};

	this.require = function(ver)
	{
		if (-1 === this._supportedMWVersions.indexOf(ver))
		{
			return false;
		}
		this._currentMWVersion = ver;
		return true;
	};


	this._copyDataOver = function(left, right)
	{
		/*for(var key of Object.keys(right))
		{
			left[key] = right[key];
		}*/

		var keys = Object.keys(right);

		for (var i = 0; i < keys.length; i++)
		{
			left[keys[i]] = right[keys[i]];
		}
	};


	this.setSTBData = function(data)
	{
		if(this.stbData)
			this._copyDataOver(this.stbData, data);
		else
			this.stbData = data;

		this.stbData.loaded = false;

		this.stbData._loadingCounter = 0;

		this.stbData.init();

		this.stbData.path = document.currentScript.attributes.src.value;
		this.stbData.path = this.stbData.path.substr(0, this.stbData.path.lastIndexOf('/') + 1);

		if (this.stbData.epg.dbFile)
		{
			var xhr = new XMLHttpRequest();

			xhr.open('GET', this.stbData.path + this.stbData.epg.dbFile, true);
			xhr.responseType = 'arraybuffer';
			xhr.stbData = this.stbData;

			xhr.onload = function(e)
			{
				if (!e.loaded)
				{
					throw 'failed to load file stubs data file';
				}
				this.stbData.epg.db = new SQL.Database(new Uint8Array(this.response));
				//this.stbData.epg.prepDB(this.stbData, this.stbData.epg.db);

				this.stbData.epg.db.exec("CREATE TEMP VIEW ServiceGenreDVB AS " +
						" SELECT serviceId_Key, " +
						" GenreLookup.level1 AS contentNibbleLevel1, " +
						" GenreLookup.level2 AS contentNibbleLevel2, " +
						" GenreLookup.level3 AS userByte, " +
						" languageCode, genre, siNetworkType, " +
						" CASE siNetworkType >> 8 " +
						" WHEN 1 THEN 'DVB.ORG' " +
						" WHEN 2 THEN 'ARIB.ORG' " +
						" WHEN 3 THEN 'ATSC.ORG' " +
						" WHEN 4 THEN 'ABNT.ORG.BR' " +
						" END AS namespace " +
						" FROM GenreLookup,ServiceGenre " +
						" ON (GenreLookup.level1=ServiceGenre.level1) " +
						" AND (GenreLookup.level2 IS NULL OR GenreLookup.level2=ServiceGenre.level2) " +
						" AND (GenreLookup.level3 IS NULL OR GenreLookup.level3=ServiceGenre.level3) ");

				this.stbData.loaded = (--this.stbData._loadingCounter) <= 0;
			};

			this.stbData._loadingCounter++;
			xhr.send();
		}

		if (this.stbData.tasksJobs.dbFile)
		{
			var xhr = new XMLHttpRequest();

			xhr.open('GET', this.stbData.path + this.stbData.tasksJobs.dbFile, true);
			xhr.responseType = 'arraybuffer';
			xhr.stbData = this.stbData;

			xhr.onload = function(e)
			{
				if (!e.loaded)
				{
					throw 'failed to load file stubs data file';
				}
				this.stbData.tasksJobs.db = new SQL.Database(new Uint8Array(this.response));
				this.stbData.tasksJobs.prepDB(this.stbData, this.stbData.tasksJobs.db);
				this.stbData.loaded = (--this.stbData._loadingCounter) <= 0;
			};

			this.stbData._loadingCounter++;
			xhr.send();
		}

		if (this.stbData.configman.files)
		{
			this.stbData.configman.files.forEach(function(file)
			{
				var xhr = new XMLHttpRequest();

				xhr.open('GET', this.stbData.path + file.name, false);
				xhr.stbData = this.stbData;
				xhr.onload = function(e)
				{
					if (!e.loaded)
					{
						throw 'failed to load file stubs data file';
					}
					file.XML = this.responseXML;
					this.stbData.loaded = (--this.stbData._loadingCounter) <= 0;
				};
				this.stbData._loadingCounter++;
				xhr.send();
			},this);
		}
		if (!this.stbData._loadingCounter)
		{
			this.stbData.loaded = true;
		}
	};

	this.setSTBProfile =  function (profile) {
        	this.stb = profile;

        	this.stb.init();

        	this.stb.path = document.currentScript.attributes['src'].nodeValue;
        	this.stb.path = this.stb.path.substr(0, this.stb.path.lastIndexOf('/') + 1);

        	if(this.stb.epg.dbFile)
        	{
	            var xhr = new XMLHttpRequest();
	            xhr.open('GET', this.stb.path + this.stb.epg.dbFile, true);
	            xhr.responseType = 'arraybuffer';
	            xhr.stb = this.stb;

	            xhr.onload = function() {
	            	this.stb.epg.db = new SQL.Database(new Uint8Array(this.response));
	            	this.stb.epg.prepDB(this.stb, this.stb.epg.db);
	            };

	            xhr.send();
        	}

        	if(this.stb.tasksJobs.dbFile)
        	{
	            var xhr = new XMLHttpRequest();
	            xhr.open('GET', this.stb.path + this.stb.tasksJobs.dbFile, true);
	            xhr.responseType = 'arraybuffer';
	            xhr.stb = this.stb;

	            xhr.onload = function() {
	            	this.stb.tasksJobs.db = new SQL.Database(new Uint8Array(this.response));
	            	this.stb.tasksJobs.prepDB(this.stb, this.stb.tasksJobs.db);
	            };

	            xhr.send();
        	}

    	    if(this.stb.configman.files)
    	    {
    	    	this.stb.configman.files.forEach(function(file){
        	        var xhr = new XMLHttpRequest();
        	        xhr.open('GET', profile.path + file.name, false);
        	        xhr.onload = function(e) {
        	        	file.XML = this.responseXML;
        	        };
        	        xhr.send();
        	    });
    	    }
        };

	this.stbData = null;

})();




if(!window.gc) // some legacy apps did this which doesn't work with NW or Chrome
	window.gc = function () { "use strict"; };

