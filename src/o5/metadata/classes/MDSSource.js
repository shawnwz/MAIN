/**
 * @private Not for public use
 * @author lmayle
 */

o5.metadata.classes.MDSSource = class MDSSource extends o5.metadata.classes.Source
{
	constructor()
	{
		super();
		
		this.limit = 9999;
		
		this._definePropertiesMapping('node', o5.metadata.classes.MDSNode);
		
		this._channelClass = o5.metadata.classes.MDSChannel;
		this._programClass = o5.metadata.classes.MDSProgram;
	}
	
	
	
	/*
	 * Public properties
	 */



	/*
	 * Public methods
	 */

	

	/*
	 * Private properties
	 */



	/*
	 * Private methods
	 */
	_preLoad ()
	{
		this._loadNodes();
	}
	
	_loadChannels (async)
	{
		this.logEntry();
		
		this._channels = new o5.metadata.util.ChannelArray();
		
		var filter = {
			'locale': this.language
		};
		
		if(this.optionalChannelFilters)
		{
			Object.assign(filter, this.optionalChannelFilters);
		}
			
		var sort = [['editorial.tvChannel', 1]];
		
		this._xhr('/btv/services',
			'filter=' + JSON.stringify(filter) + '&limit=' + this.limit + '&fields=' + JSON.stringify(this._channelFieldsBase) + '&sort=' + JSON.stringify(sort),
			async, this._loadChannelsXHRLoaded);
	}

	_loadChannelsXHRLoaded (status, response, tag)
	{
		for (var i = 0, item; item = response.services[i]; ++i)
		{
			var svc = new o5.metadata.classes.MDSChannel();
			
			svc._source = this;
			svc._data = item;
			
			this._channels.push(svc);
		}
	}
	
	_loadNodes (async)
	{
		this.logEntry();
		
		this._nodes = new o5.metadata.util.ListArray();
		this._nodes.rootNodes = Object.create(null);
		
		var filter = {
			'locale': this.language
		};
		
		var sort = [['id', 1]];
		
		this._xhr('/vod/nodes',
			'filter=' + JSON.stringify(filter) + '&limit=' + this.limit + '&fields=' + JSON.stringify(this._nodeFieldsBase) + '&sort=' + JSON.stringify(sort),
			async, this._loadNodesXHRLoaded);
	}
	
	_loadNodesXHRLoaded (status, response, tag)
	{
		for (var i = 0, item; item = response.nodes[i]; ++i)
		{
			let node = new o5.metadata.classes.MDSNode();
			
			node._source = this;
			node._data = item;
			
			this._nodes.push(node);
		}
		
		for(let node of this._nodes)
		{
			if(node._data.parent)
			{
				var parent = this._nodes.byId[node._data.parent];
				
				node.parent = parent;
				
				parent.children[node._data.id] = node;
			}
			else
			{
				this._nodes.rootNodes[node._data.id] = node;
			}
		}
	}
	
	_loadEditorials (async)
	{
		this.logEntry();
		
		this._nodes = new o5.metadata.util.ListArray();
		this._nodes.rootNodes = Object.create(null);
		
		var filter = {
			'locale': this.language
		};
		
		var sort = [['id', 1]];
		
		this._xhr('/vod/nodes',
			'filter=' + JSON.stringify(filter) + '&limit=' + this.limit + '&fields=' + JSON.stringify(this._nodeFieldsBase) + '&sort=' + JSON.stringify(sort),
			async, this._loadNodesXHRLoaded);
	}
	
	_loadEditorialsXHRLoaded (status, response, tag)
	{
		debugger;
		
		for (var i = 0, item; item = response.nodes[i]; ++i)
		{
			let node = new o5.metadata.classes.MDSNode();
			
			node._source = this;
			node._data = item;
			
			this._nodes.push(node);
		}
		
		for(let node of this._nodes)
		{
			if(node._data.parent)
			{
				var parent = this._nodes.byId[node._data.parent];
				
				node.parent = parent;
				
				parent.children[node._data.id] = node;
			}
			else
			{
				this._nodes.rootNodes[node._data.id] = node;
			}
		}
	}
	
	_readAheadPrograms (channels, startTime, endTime, callback)
	{
		var pendingChannels = [];
		var loadedChannels = [];
		
		if(!channels)
		{
			channels = this.channels;
		}
		
		for(var channelId of channels)
		{
			var channel = channelId instanceof o5.metadata.classes.MDSChannel ? channelId : this.getChannelById(channelId);
			
			if(!channel._programs.length || !channel.programs.hasAllItemsForRange(startTime, endTime))
			{
				pendingChannels.push(channel.id);
			}
			else
			{
				loadedChannels.push(channel);
			}
		}
		
		if(pendingChannels.length)
		{
			var filter = {
				'serviceRef': { $in: pendingChannels},
				'period.end': { $gt: (startTime / 1000)},
				'period.start': { $lt: (endTime / 1000)},
				'locale': this.language
			};
			
			var fields = ['serviceRef',
			              'eventId',
			              'period.start',
			              'period.end',
			              'title'];
			
			var sort = [['serviceRef', 1],
			            ['period.start', 1]];
			
			this._xhr('/btv/programmes',
					'filter=' + JSON.stringify(filter) + '&limit=' + this.limit + '&fields=' + JSON.stringify(fields) + '&sort=' + JSON.stringify(sort),
					true, this._readAheadProgramsXHRLoaded, null, { callback, loadedChannels });
		}
		else
		{
			if(callback)
				callback(loadedChannels);
		}
	}

	_readAheadProgramsXHRLoaded (status, response, tag)
	{
		var retChannels = [];
		var retPrograms = [];
		
		var svc = null;
		
		for (var i = 0, item; item = response.programmes[i]; ++i)
		{
			var sid = item.serviceRef;
			
			if(!svc || sid != svc.id)
			{
				svc = this.getChannelById(sid);
				
				retChannels.push(svc);
			}
			
			item.period.end *= 1000;
			item.period.start *= 1000;
			
			svc.updateOrInsertProgram(item);
		}
		
		for(var channel of tag.loadedChannels)
		{
			retChannels.push(channel);
		}
		
		if(tag.callback)
			tag.callback(retChannels, retPrograms);
	}
	
	_xhrLoadEnd ()
	{
		this._onloadend.call(this._that,
				this.status,
				this.responseType === 'json' ? this.response : JSON.parse(this.response),
				this._tag);
	}	
	
	_xhrError ()
	{
		debugger;
	}
	
	_xhr (api, query, async, onloadend, onerror, tag)
	{
		var xmlhttp = new XMLHttpRequest();
		
		xmlhttp.open("GET", this.serverURL + '/metadata/delivery/' + this.provider + api + '?' + query, async || false);
		
		if(async)
			xmlhttp.responseType = 'json';
		else
			xmlhttp.overrideMimeType('application/json');
		
		xmlhttp._that = this;
		xmlhttp._tag = tag;
		xmlhttp._onloadend = onloadend;
		xmlhttp._onerror = onerror;
		xmlhttp.onloadend = this._xhrLoadEnd;
		xmlhttp.onerror = this._xhrError;
		
		xmlhttp.send();
	}
};




/*
 * Private properties
 */



/*
 * Private methods
 */






o5.metadata.classes.MDSSource.prototype._loadChannelData = function _loadChannelData (channel, async)
{
	this.logEntry();
	
	var filter = {
			'locale': this.language,
			'editorial.id': channel._data.editorial.id
		};
		
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", this.serverURL + '/metadata/delivery/' + this.provider + '/btv/services\
?filter=' + JSON.stringify(filter) + '\
&fields=' + JSON.stringify(this._channelFieldsAll), async || false);
	if(async)
		xmlhttp.responseType = 'json';
	else
		xmlhttp.overrideMimeType('application/json');
	xmlhttp.tag = this;
	xmlhttp.target = channel;
	xmlhttp.onloadend = this._loadChannelDataXHRLoaded;
	xmlhttp.send();
};

o5.metadata.classes.MDSSource.prototype._loadChannelDataXHRLoaded = function _loadChannelDataXHRLoaded (e)
{
	var ret = [];
	
	if(this.response)
	{
		var json = this.responseType === 'json' ? this.response : JSON.parse(this.response);
		
		this.target._data = json.services[0];;
	}
};


o5.metadata.classes.MDSSource.prototype._loadProgramListForChannel = function _loadProgramListForChannel (channel, async)
{
	this.logEntry();
	
	this._programs = [];
	
	var filter = {
		'serviceRef': channel.id,
		'locale': this.language
	};
	
	var fields = ['serviceRef',
	              'eventId',
	              'period.start',
	              'period.end',
	              'title'];
	
	var sort = [['period.start', 1]];
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", this.serverURL + '/metadata/delivery/' + this.provider + '/btv/programmes\
?filter=' + JSON.stringify(filter) + '\
&limit=' + this.limit + '\
&fields=' + JSON.stringify(fields) + '\
&sort=' + JSON.stringify(sort), async || false);
	if(async)
		xmlhttp.responseType = 'json';
	else
		xmlhttp.overrideMimeType('application/json');
	xmlhttp.tag = channel;
//	xmlhttp.callback = callback;
	xmlhttp.onloadend = this._loadProgramListForChannelXHRLoaded;
	xmlhttp.send();
};


o5.metadata.classes.MDSSource.prototype._loadProgramListForChannelXHRLoaded = function _loadProgramListForChannelXHRLoaded (e)
{
	var json = this.responseType === 'json' ? this.response : JSON.parse(this.response);
	
	for (var i = 0, item; item = json.programmes[i]; ++i)
	{
		this.tag.updateOrInsertProgram(item);
	}
};

