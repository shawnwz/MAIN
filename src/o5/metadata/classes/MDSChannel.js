/**
 * @private Not for public use
 * @author lmayle
 */

o5.metadata.classes.MDSChannel = class MDSChannel extends o5.metadata.classes.Channel
{
	constructor()
	{
		super();
		
		this._programs = new o5.metadata.util.ProgramArray();
	}
};

/*
 * Public properties
 */


Object.defineProperty(o5.metadata.classes.MDSChannel.prototype, "programs", {
	get: function get () {

		if(!this._programs.length)
		{
			this._source._loadProgramListForChannel(this);
		}

		return this._programs;
	}
});



/*
 * Public methods
 */


o5.metadata.classes.MDSChannel.prototype.updateOrInsertProgram = function updateOrInsertProgram (programData)
{
	var evt = this.getProgramById(programData.eventId);
	
	if(evt)
	{
		evt._data = programData;
	}
	else
	{
		var obj = new o5.metadata.classes.MDSProgram();
		
		obj.channel = this;
		obj.eventId = programData.eventId;
		obj._data = programData;

		this._programs.push(obj);
	}
};


/*
 * Private properties
 */



/*
 * Private methods
 */
