/**
 * @private Not for public use
 * @author lmayle
 */

o5.metadata.classes.DVBSource = class DVBSource extends o5.metadata.classes.Source
{
	constructor()
	{
		super();
		
		this._channelClass = o5.metadata.classes.DVBChannel;
		
		this.channelPropertiesMapping = [
			[ 'id', 		'serviceId', 	Number, 	true  ],
			[ 'number', 	'channelKey', 	Number, 	true  ],
			[ 'name', 		'name', 		String, 	true  ],
			[ 'shortName', 	'name', 		String, 	false ],
			[ 'uri', 		'uri', 			String, 	true  ]
		];
		
		
		this._programClass = o5.metadata.classes.DVBProgram;
		
		this.programPropertiesMapping = [
			[ 'id', 		'eventId', 		Number, 	true  ],
			[ 'name', 		'title', 		String, 	true  ],
			[ 'startTime', 	'startTime', 	Number, 	true  ],
			[ 'endTime', 	'endTime', 		Number, 	true  ]
		];
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
		this._loadChannels();
		this._loadPrograms();
	}
	
	_loadChannels (async)
	{
		this.logEntry();
		
		this._channels = new o5.metadata.util.ChannelArray();
		
		var rs = CCOM.EPG.getServicesRSByQuery(this._channelFieldsBase.join(','), 'type in(1 , 2, 25)', 'serviceId');
		var svcs = rs.getNext(9999);
		
		for(var i = 0; i < svcs.length; i++)
		{
			var svc = new o5.metadata.classes.DVBChannel();
			
			svc.source = this;
			svc._data = svcs[i];
			
			this._channels.push(svc);
		}
		
		rs.reset();
		rs = null;
	}
	
	_loadPrograms (async)
	{
		for (let channel of this.channels)
		{
			channel._programs = new o5.metadata.util.ProgramArray();
			
			var rs = CCOM.EPG.getEventsRSByQuery('eventId, startTime, endTime, title',
					'serviceId = "' + channel.id + '"',
					'startTime');
			var evts = rs.getNext(9999);
			
			for(var i = 0; i < evts.length; i++)
			{
//				evts[i].startTime *= 1000;
//				evts[i].endTime *= 1000;
				
				channel._updateOrInsertProgram(evts[i]);
			}
			
			rs.reset();
			rs = null;
		}
	}

	_readAheadPrograms (channels, startTime, endTime, callback)
	{
		this.logEntry();
		
		var ret = [];
		
		for(var c = 0; c < channels.length; c++)
		{
			var svc = o5.metadata.getChannelById(channels[c]);
			
			svc._programs = new o5.metadata.util.ProgramArray();
			
			var rs = CCOM.EPG.getEventsRSByQuery('eventId, startTime, endTime, title',
					'serviceId = "' + svc.id + '" AND endTime >= ' + startTime + ' AND startTime <= ' + endTime,
					'startTime');
			var evts = rs.getNext(9999);
			
			for(var i = 0; i < evts.length; i++)
			{
//				evts[i].startTime *= 1000;
//				evts[i].endTime *= 1000;
				
				svc._updateOrInsertProgram(evts[i]);
			}
			
			rs.reset();
			rs = null;
			
			ret.push(svc);
		}
		
		if(callback)
			callback(ret);
	}
	
};



