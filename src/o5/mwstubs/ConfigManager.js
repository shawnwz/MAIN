/**
 * Stub for ConfigManager: CCOM.ConfigManager, a singleton added since v5.0.0
 * @ignore
 */
CCOM.ConfigManager = new (function ConfigManager()
{
	//"use strict";
	this._MY_NAME_SPACE = "CCOM.ConfigManager";
	this.ver = CCOM.stubs.getCurrentMWVersion();
	this._id = CCOM.stubs.uuid();
	this._EVENT_ON_VALUE_CHANGED = "onValueChanged";
	this._supportedEvents = [ this._EVENT_ON_VALUE_CHANGED ];

	this.notifyKeyPaths = [];
	this.getValue = function(prefKey)
	{
		if (CCOM.stubs.stbData.configman.files)
		{
			var file, node;

			CCOM.stubs.stbData.configman.files.every(function(item)
			{
				var path = '/' + prefKey.replace(/\/([^\/]+)/g, '/*[@name=\'$1\']');

				node = item.XML.evaluate(path, item.XML, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

				return node == null;
			});

			if (node)
			{
				switch (node.attributes.type.value)
				{
				case 'string':
					return {
						keyValue : node.firstElementChild.textContent
					};
				case 'int':
					return {
						keyValue : parseInt(node.attributes.value.value)
					};
				case 'bool':
					switch (node.attributes.value.value)
					{
					case 'true':
						return {
							keyValue : true
						};
					case 'false':
						return {
							keyValue : false
						};
					default:
						throw ('argh');
					}
				case 'list':
					switch (node.attributes.ltype.value)
					{
					case 'int':
						var values = [];

						for (var li = node.firstElementChild; li; li = li.nextElementSibling)
						{
							values.push(parseInt(li.attributes.value.value));
						}

						return {
							keyValue : values
						};

					case 'string':
						var values = [];

						for (var li = node.firstElementChild; li; li = li.nextElementSibling)
						{
							values.push(li.firstElementChild.textContent);
						}

						return {
							keyValue : values
						};

					default:
						throw ('argh');
					}
				case 'pair':
					return {
						error : {
							domain : "CCOM.ConfigManager",
							name : "OperationFailed",
							message : "Not included"
						}
					};

				default:
					throw ('argh');
				}
			}
			return {
				error : {
					domain : "CCOM.ConfigManager",
					name : "OperationFailed",
					message : "Not included"
				}
			};
		}
		else if (CCOM.stubs.stbData.configman.data.hasOwnProperty(prefKey))
		{
			return {
				keyValue : CCOM.stubs.stbData.configman.data[prefKey]
			};
		}
		else
		{
			this.logInfo("Operation failed because the requested key was not found");
			return {
				error : {
					domain : "CCOM.ConfigManager",
					name : "KeyNotFound",
					message : "Operation failed because the requested key was not found"

				}
			};
		}
	};
	this.setValue = function(prefKey, prefValue)
	{	
		if (CCOM.stubs.stbData.configman.files)
		{
			this.logWarning("This API has not been implemented yet!");
			return {
				error : {
					domain : "com.opentv.CCOM",
					name : "Failed",
					message : "Not implemented yet"
				}
			};
		}
		else
		{
			var event;

			if (typeof prefValue === "string" || typeof prefValue === "number" || typeof prefValue === "boolean")
			{
				CCOM.stubs.stbData.configman.data[prefKey] = prefValue;
				this.notifyKeyPaths.forEach(function(key)
				{
					if (prefKey.indexOf(key) === 0)
					{
						event = {
							target : this,
							listenPath : key,
							keyPath : prefKey,
							keyValue : prefValue
						};
						CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ON_VALUE_CHANGED, event);
					}
				});
				return {};
			}
		}
		this.logInfo("Attempted to set preference value that was not a string, number, or boolean");
		return {
			error : {
				domain : "CCOM.ConfigManager",
				name : "KeyNotSet",
				message : "Attempted to set preference value that was not a string, number, or boolean"
			}
		};
	};
	this.unsetValue = function(prefKey)
	{
		var event;

		delete CCOM.stubs.stbData.configman.data[prefKey];

		this.notifyKeyPaths.forEach(function(key)
		{
			if (prefKey.indexOf(key) === 0)
			{
				event = {
					target : this,
					listenPath : key,
					keyPath : prefKey,
					keyValue : null
				};
				CCOM.stubs.raiseEvent(this._id, this._MY_NAME_SPACE, this._EVENT_ON_VALUE_CHANGED, event);
			}
		});

		return {};
	};
	this.addEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.addEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	this.removeEventListener = function(event, callback)
	{
		if (this._supportedEvents.indexOf(event) === -1)
		{
			return CCOM.stubs.ERROR_INVALID_EVENT;
		}
		return CCOM.stubs.removeEventListener(this._id, this._MY_NAME_SPACE, event, callback);
	};
	this.getSubtree = function(prefKey)
	{
		var ret = {}, property;

		for (property in CCOM.stubs.stbData.configman.data)
		{
			if (CCOM.stubs.stbData.configman.data.hasOwnProperty(property))
			{
				if (property.indexOf(prefKey) === 0)
				{
					ret[property] = CCOM.stubs.stbData.configman.data[property];
				}
			}
		}
		return {
			keyValuePairs : ret
		};
	};
	this.addNotify = function(prefKey)
	{
		if (this.notifyKeyPaths.indexOf(prefKey) === -1)
		{
			this.notifyKeyPaths.push(prefKey);
		}
		return {};
	};
	this.createEncryptionKey = function(encryptionData)
	{
		this.logWarning("This API has not been supported yet!");
		return {
			error : {
				domain : "CCOM.ConfigManager",
				name : "OperationFailed",
				message : "Not supported"
			}
		};
	};
	this.deleteEncryptionKey = function(encryptionID)
	{
		this.logWarning("This API has not been supported yet!");
		return {
			error : {
				domain : "CCOM.ConfigManager",
				name : "OperationFailed",
				message : "Not supported"
			}
		};
	};
	this.getEntries = function(dirPath)
	{
		this.logWarning("This API has not been supported yet!");
		return {
			error : {
				domain : "CCOM.ConfigManager",
				name : "NoMemory",
				message : "Not supported"
			}
		};
	};
	this.removeNotify = function(prefKey)
	{
		var i;

		for (i = 0; i < this.notifyKeyPaths.length; i++)
		{
			if (this.notifyKeyPaths[i] === prefKey)
			{
				this.notifyKeyPaths.splice(i, 1);
				return {};
			}
		}

		this.logInfo("No notification request found for the specified key or subtree");
		return {
			error : {
				domain : "CCOM.ConfigManager",
				name : "PathNotUnregd",
				message : "No notification request found for the specified key or subtree"
			}
		};
	};
	this.setEncryptedValue = function(keyPath, keyValue)
	{
		return {};
	};
})();
