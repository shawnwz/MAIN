/**
 * User Input Manager manages key events by capturing the event before being sent to the application
 * It can enforce rate control to improve the user experience by allowing consistent response to
 *  sequential key presses or when the user holds down any button for any period of time while
 *  giving time for the application code to respond to user input between sequential key events
 *
 * @class o5.gui.UserInputManager
 * @singleton
 *
 * @author lmayle
 */
o5.gui.UserInputManager = new (function UserInputManager ()
{
	this.eventQueue = [];

	// initializes with dummy event to avoid checking for nulls
	// should use KeyboardEvent constructor whenever we get a RTE that supports it
	this._lastKey = new Event('keydown');
	
	this._queueCheckInterval = null;
	this._queueCheckTimeout = null;
	this._maxQueueSize = 50;
}) ();

//o5.log.setAll(o5.gui.UserInputManager, true);

KeyboardEvent.prototype.toString = function toString ()
{
	return 'KeyboardEvent(' + (this.key || this.keyCode) + ')';
};

KeyboardEvent.prototype._stopImmediatePropagation = KeyboardEvent.prototype.stopImmediatePropagation;
KeyboardEvent.prototype.stopImmediatePropagation = function stopImmediatePropagation ()
{
	this.preventDefault();
	this._stopImmediatePropagation();
};

KeyboardEvent.prototype._stopPropagation = KeyboardEvent.prototype.stopPropagation;
KeyboardEvent.prototype.stopPropagation = function stopPropagation ()
{
	this.preventDefault();
	this._stopPropagation();
};


/**
 * @property {Number}
 * This number defines the rate in MS at which key events will be forwarded to application key event listeners
 * Any key event received from the OS with less spacing than this value will be queued and then forwarded after this amount of time
 * Recommended value is 100
 */
o5.gui.UserInputManager.rateControlMS = 100;


/**
 * @property {Number}
 * This number defines the maximum amount of time a key event will be kept in the queue, as a multiple of rateControlMS, after which the key event will be discarded
 * Recommended value is 2.5
 */
o5.gui.UserInputManager.rateControlTTL = 2.5; // allows 2 key events to be queued with some slack for processing delays

/**
 * @property {Number} keyRepeatTTL
 * @removed Not needed anymore
 */


o5.gui.UserInputManager._systemKeys = [];

/**
* @method _checkQueue
* @private
*/
o5.gui.UserInputManager._checkQueue = function _checkQueue ()
{
//	this.log(Date.now());
	
	if (this.eventQueue.length === 0)
	{
		if (this._queueCheckInterval)
			clearInterval(this._queueCheckInterval);

		this._queueCheckTimeout = null;
		this._queueCheckInterval = null;
	}

	var now = Date.now();

	try
	{
		var key;

		//eslint-disable-next-line no-cond-assign
		while (key = this.eventQueue.shift())
		{
			if ((now - key.timeStamp) > (this.rateControlTTL * this.rateControlMS))
			{
				this.logInfo('dropped stalled key event ' + key.key + ' after ' + (now - key.timeStamp) + ' ms');

				continue;
			}

			var e = new Event(key.type, {
				bubbles: key.bubbles,
				cancelable: key.cancelable
			});

			//doens't work with current webkit 11
			/*var e = new KeyboardEvent(key.type, {
				altKey: key.altKey,
				bubbles: key.bubbles,
	//			cancelBubble: key.cancelBubble,
				cancelable: key.cancelable,
				charCode: key.charCode,
	//			clipboardData: key.clipboardData,
				ctrlKey: key.ctrlKey,
	//			currentTarget: key.currentTarget,
	//			defaultPrevented: key.defaultPrevented,
				detail: key.detail,
	//			eventPhase: key.eventPhase,
				key: key.key,
				keyCode: key.keyCode,
	//			keyIdentifier: key.keyIdentifier,
	//			keyLocation: key.keyLocation,
	//			layerX: key.layerX,
	//			layerY: key.layerY,
				location: key.location,
				metaKey: key.metaKey,
	//			pageX: key.pageX,
	//			pageY: key.pageY,
	//			path: NodeList[0],
				repeat: key.repeat,
	//			returnValue: key.returnValue,
				shiftKey: key.shiftKey,
	//			srcElement: key.srcElement,
	//			target: key.target,
	//			timeStamp: key.timeStamp,
	//			type: key.type,
				view: key.view,
				which: key.which
			});*/

			e.altKey 			= key.altKey;
			e.ctrlKey 			= key.ctrlKey;
			e.delayed 			= true;
			e.key 				= key.key;
			e.keyCode 			= key.keyCode;
			e.location 			= key.location;
			e.repeat 			= key.repeat;
			e.repeatDuration 	= key.repeatDuration;
			e.shiftKey 			= key.shiftKey;
			
			e.toString = KeyboardEvent.prototype.toString;

//			Object.defineProperty(e, 'which', { value: key.which });
//			Object.defineProperty(e, 'keyCode', { value: key.keyCode });
//			Object.defineProperty(e, 'key', { value: key.key });
//			Object.defineProperty(e, 'delayed', { value: true });

			key.target.dispatchEvent(e);

			break;
		}
	}
	catch (err)
	{
		this.logError(err);
	}

	if (this.eventQueue.length > 0)
	{
		//using interval here because from now on the cycles will be at rateControlMS, this gives better precision
		if (!this._queueCheckInterval)
			this._queueCheckInterval = setInterval(this._checkQueue.bind(this), this.rateControlMS);
	}
	else
	{
		if (this._queueCheckInterval)
			clearInterval(this._queueCheckInterval);

		this._queueCheckTimeout = null;
		this._queueCheckInterval = null;
	}
};

/**
* @method _onKeyDown
* @param {KeyboardEvent} e The key event
* @private
*/
o5.gui.UserInputManager._onKeyDown = function _onKeyDown (e)
{
	var ko = this._systemKeys[e.keyCode] || (this._systemKeys[e.keyCode] = [ 'Unidentified' ]);
	
	if(e.key != undefined)
	{
		delete e.key;
		
		Object.defineProperty(e, 'key', { value: ko[e.shiftKey ? 1 : 0] } );
	}
	else
	{
		e.key = ko[e.shiftKey ? 1 : 0];
	}
	
    this.logDebug(e.keyCode + ' ' + e.altKey + ' ' + e.ctrlKey + ' ' + e.metaKey + ' ' + e.shiftKey + ' ' + e.keyIdentifier + ' ' + e.key + ' ' + e.timeStamp + 
    		' ' + e.repeat + ' ' + e.delayed + ' ' + (e.timeStamp - this._lastKey.timeStamp) + ' ' + this._lastKey.__released);
    
	if (ko.pressed)
	{
		if(e.repeat !== true && e.hasOwnProperty('repeat'))
			delete e.repeat;
		
		e.repeat = true;
		ko.repeating = true;
		e.repeatDuration = e.timeStamp - ko.pressedTime;
	}
	else
	{
		if(e.repeat !== false && e.hasOwnProperty('repeat'))
			delete e.repeat;
		
		e.repeat = false;
		ko.pressedTime = e.timeStamp;
		ko.pressed = true;
		ko.repeating = false;
	}

	if (this.eventQueue.length === 0)
	{
		if (!e.delayed)
		{
			if (((e.timeStamp - this._lastKey.timeStamp) >= this.rateControlMS * 0.9) || (this._lastKey.timeStamp > e.timeStamp))
			{
				this._lastKey = e;
				this._hdmiCecVolCtl (e.key);
				return;
			}
		}
	}
	else if (!e.delayed)
	{
		// this code is to workaround the issue with otvwebkit prioritizing AC animations over setTimeout used by the rate control logic
		if ((Date.now() - this._lastKey.timeStamp) >= this.rateControlMS * 0.9)
			this._checkQueue();
	}

	if (e.delayed)
	{
		this._lastKey = e;
		this._hdmiCecVolCtl (e.key);
		return;
	}

	if (this.eventQueue.length > this._maxQueueSize)
	{
		//something wrong, reset everything and release current key event
		this.logError('Events queue overflowing, clean and reset');

		if (this._queueCheckInterval)
			clearInterval(this._queueCheckInterval);

		this._queueCheckTimeout = null;
		this._queueCheckInterval = null;

		this.eventQueue.length = 0;

		this._lastKey = e;
		this._hdmiCecVolCtl (e.key);
		return;
	}

	this.eventQueue.push(e);

	e.stopImmediatePropagation();

	//using timeout here because the first cycle will likely be a fraction of rateControlMS
	if (!this._queueCheckTimeout && !this._queueCheckInterval)
	{
		this._queueCheckTimeout = setTimeout(this._checkQueue.bind(this), this.rateControlMS - (e.timeStamp - this._lastKey.timeStamp));
	
//		this.log(Date.now().toString() + ' ' + (this.rateControlMS - (e.timeStamp - this._lastKey.timeStamp)));
	}
};

/**
* @method _onKeyPress
* @param {KeyboardEvent} e The key event
* @private
*/
o5.gui.UserInputManager._onKeyPress = function _onKeyPress (e)
{
//	e.key = this._systemKeys[e.keyCode] ? this._systemKeys[e.keyCode][e.shiftKey ? 1 : 0] : 'Unidentified';
};

/**
* @method _onKeyUp
* @param {KeyboardEvent} e The key event
* @private
*/
o5.gui.UserInputManager._onKeyUp = function _onKeyUp (e)
{
	var ko = this._systemKeys[e.keyCode] || (this._systemKeys[e.keyCode] = [ 'Unidentified' ]);
	
	this.eventQueue.length = 0;
	
	if(e.key != undefined)
	{
		delete e.key;
		
		Object.defineProperty(e, 'key', { value: ko[e.shiftKey ? 1 : 0] } );
	}
	else
	{
		e.key = ko[e.shiftKey ? 1 : 0];
	}
	
	if (ko.pressed)
	{
		if(ko.repeating)
		{
			if(e.repeat !== true && e.hasOwnProperty('repeat'))
				delete e.repeat;
			
			e.repeat = true;
			e.repeatDuration = e.timeStamp - ko.pressedTime;
			ko.repeating = false;
		}
		else
		{
			if(e.repeat === true && e.hasOwnProperty('repeat'))
				delete e.repeat;
			
			e.repeat = false;
		}
		
		ko.pressed = false;
		ko.pressedTime = null;
	}
	
    this.logDebug(e.keyCode + ' ' + e.altKey + ' ' + e.ctrlKey + ' ' + e.metaKey + ' ' + e.shiftKey + 
    		' ' + e.keyIdentifier + ' ' + e.key + ' ' + e.timeStamp + ' ' + e.repeat + ' ' + e.delayed + ' ' + (e.timeStamp - this._lastKey.timeStamp));
};

o5.gui.UserInputManager.test = function test (e)
{
	var a = Date.now();
	
	for(var i = 0; i < 10000; i++)
	{
		var e = new Event('keydown', {
			bubbles: true,
			cancelable: false
		});

		e.altKey 	= false;
		e.ctrlKey 	= false;
		e.delayed 	= true;
		e.key 		= "1";
		e.keyCode 	= 1;
		e.location 	= 0;
		e.repeat 	= false;
		e.shiftKey 	= false;

		document.getElementsByTagName('app-main-menu')[0].dispatchEvent(e);
	}
	
	console.log((Date.now()) - a);
};

document.addEventListener("keydown", o5.gui.UserInputManager._onKeyDown.bind(o5.gui.UserInputManager), true);
//document.addEventListener("keypress", o5.gui.UserInputManager._onKeyPress.bind(o5.gui.UserInputManager), true);
document.addEventListener("keyup", o5.gui.UserInputManager._onKeyUp.bind(o5.gui.UserInputManager), true);

//document.addEventListener("keydown", function(){ var start = Date.now(); console.log('start ' + start); setTimeout(function(){console.log('end ' + (Date.now() - start))}, 40); }, true);


o5.gui.UserInputManager._systemKeys[    3] = ['Cancel'];
o5.gui.UserInputManager._systemKeys[    8] = ['Backspace'];
o5.gui.UserInputManager._systemKeys[    9] = ['Tab'];
o5.gui.UserInputManager._systemKeys[   12] = ['Clear'];
o5.gui.UserInputManager._systemKeys[   13] = ['Ok'];
o5.gui.UserInputManager._systemKeys[   16] = ['Shift'];
o5.gui.UserInputManager._systemKeys[   17] = ['Control'];
o5.gui.UserInputManager._systemKeys[   18] = ['Alt'];
o5.gui.UserInputManager._systemKeys[   19] = ['Pause'];
o5.gui.UserInputManager._systemKeys[   20] = ['CapsLock'];
o5.gui.UserInputManager._systemKeys[   27] = ['Escape'];
o5.gui.UserInputManager._systemKeys[   32] = [' '];
o5.gui.UserInputManager._systemKeys[   33] = ['PageUp'];
o5.gui.UserInputManager._systemKeys[   34] = ['PageDown'];
o5.gui.UserInputManager._systemKeys[   35] = ['End'];
o5.gui.UserInputManager._systemKeys[   36] = ['Home'];
o5.gui.UserInputManager._systemKeys[   37] = ['ArrowLeft'];
o5.gui.UserInputManager._systemKeys[   38] = ['ArrowUp'];
o5.gui.UserInputManager._systemKeys[   39] = ['ArrowRight'];
o5.gui.UserInputManager._systemKeys[   40] = ['ArrowDown'];
o5.gui.UserInputManager._systemKeys[   41] = ['Ok'];
o5.gui.UserInputManager._systemKeys[   44] = ['PrintScreen'];
o5.gui.UserInputManager._systemKeys[   45] = ['Insert'];
o5.gui.UserInputManager._systemKeys[   46] = ['Delete'];
o5.gui.UserInputManager._systemKeys[   47] = ['Help'];
o5.gui.UserInputManager._systemKeys[   48] = ['0',                  ')'];
o5.gui.UserInputManager._systemKeys[   49] = ['1',                  '!'];
o5.gui.UserInputManager._systemKeys[   50] = ['2',                  '@'];
o5.gui.UserInputManager._systemKeys[   51] = ['3',                  '#'];
o5.gui.UserInputManager._systemKeys[   52] = ['4',                  '$'];
o5.gui.UserInputManager._systemKeys[   53] = ['5',                  '%'];
o5.gui.UserInputManager._systemKeys[   54] = ['6',                  '^'];
o5.gui.UserInputManager._systemKeys[   55] = ['7',                  '&'];
o5.gui.UserInputManager._systemKeys[   56] = ['8',                  '*'];
o5.gui.UserInputManager._systemKeys[   57] = ['9',                  '('];
o5.gui.UserInputManager._systemKeys[   65] = ['a',                  'A'];
o5.gui.UserInputManager._systemKeys[   66] = ['b',                  'B'];
o5.gui.UserInputManager._systemKeys[   67] = ['c',                  'C'];
o5.gui.UserInputManager._systemKeys[   68] = ['d',                  'D'];
o5.gui.UserInputManager._systemKeys[   69] = ['e',                  'E'];
o5.gui.UserInputManager._systemKeys[   70] = ['f',                  'F'];
o5.gui.UserInputManager._systemKeys[   71] = ['g',                  'G'];
o5.gui.UserInputManager._systemKeys[   72] = ['h',                  'H'];
o5.gui.UserInputManager._systemKeys[   73] = ['i',                  'I'];
o5.gui.UserInputManager._systemKeys[   74] = ['j',                  'J'];
o5.gui.UserInputManager._systemKeys[   75] = ['k',                  'K'];
o5.gui.UserInputManager._systemKeys[   76] = ['l',                  'L'];
o5.gui.UserInputManager._systemKeys[   77] = ['m',                  'M'];
o5.gui.UserInputManager._systemKeys[   78] = ['n',                  'N'];
o5.gui.UserInputManager._systemKeys[   79] = ['o',                  'O'];
o5.gui.UserInputManager._systemKeys[   80] = ['p',                  'P'];
o5.gui.UserInputManager._systemKeys[   81] = ['q',                  'Q'];
o5.gui.UserInputManager._systemKeys[   82] = ['r',                  'R'];
o5.gui.UserInputManager._systemKeys[   83] = ['s',                  'S'];
o5.gui.UserInputManager._systemKeys[   84] = ['t',                  'T'];
o5.gui.UserInputManager._systemKeys[   85] = ['u',                  'U'];
o5.gui.UserInputManager._systemKeys[   86] = ['v',                  'V'];
o5.gui.UserInputManager._systemKeys[   87] = ['w',                  'W'];
o5.gui.UserInputManager._systemKeys[   88] = ['x',                  'X'];
o5.gui.UserInputManager._systemKeys[   89] = ['y',                  'Y'];
o5.gui.UserInputManager._systemKeys[   90] = ['z',                  'Z'];
o5.gui.UserInputManager._systemKeys[   93] = ['Menu'];
o5.gui.UserInputManager._systemKeys[   96] = ['0'];
o5.gui.UserInputManager._systemKeys[   97] = ['1'];
o5.gui.UserInputManager._systemKeys[   98] = ['2'];
o5.gui.UserInputManager._systemKeys[   99] = ['3'];
o5.gui.UserInputManager._systemKeys[  100] = ['4'];
o5.gui.UserInputManager._systemKeys[  101] = ['5'];
o5.gui.UserInputManager._systemKeys[  102] = ['6'];
o5.gui.UserInputManager._systemKeys[  103] = ['7'];
o5.gui.UserInputManager._systemKeys[  104] = ['8'];
o5.gui.UserInputManager._systemKeys[  105] = ['9'];
o5.gui.UserInputManager._systemKeys[  112] = ['F1'];
o5.gui.UserInputManager._systemKeys[  113] = ['F2'];
o5.gui.UserInputManager._systemKeys[  114] = ['F3'];
o5.gui.UserInputManager._systemKeys[  115] = ['F4'];
o5.gui.UserInputManager._systemKeys[  116] = ['F5'];
o5.gui.UserInputManager._systemKeys[  117] = ['F6'];
o5.gui.UserInputManager._systemKeys[  118] = ['F7'];
o5.gui.UserInputManager._systemKeys[  119] = ['F8'];
o5.gui.UserInputManager._systemKeys[  120] = ['F9'];
o5.gui.UserInputManager._systemKeys[  121] = ['F10'];
o5.gui.UserInputManager._systemKeys[  122] = ['F11'];
o5.gui.UserInputManager._systemKeys[  123] = ['F12'];
o5.gui.UserInputManager._systemKeys[  144] = ['NumLock'];
o5.gui.UserInputManager._systemKeys[  145] = ['ScrollLock'];
o5.gui.UserInputManager._systemKeys[  166] = ['Back'];
o5.gui.UserInputManager._systemKeys[  167] = ['Forward'];
o5.gui.UserInputManager._systemKeys[  171] = ['Favorites'];
o5.gui.UserInputManager._systemKeys[  172] = ['Home'];
o5.gui.UserInputManager._systemKeys[  173] = ['Mute'];
o5.gui.UserInputManager._systemKeys[  174] = ['VolumeDown'];
o5.gui.UserInputManager._systemKeys[  175] = ['VolumeUp'];
o5.gui.UserInputManager._systemKeys[  176] = ['TrackNext'];
o5.gui.UserInputManager._systemKeys[  177] = ['TrackPrevious'];
o5.gui.UserInputManager._systemKeys[  178] = ['Stop'];
o5.gui.UserInputManager._systemKeys[  179] = ['PlayPause'];
o5.gui.UserInputManager._systemKeys[  180] = ['LaunchMail'];
o5.gui.UserInputManager._systemKeys[  186] = [';',                  ':'];
o5.gui.UserInputManager._systemKeys[  187] = ['=',                  '+'];
o5.gui.UserInputManager._systemKeys[  188] = [',',                  '<'];
o5.gui.UserInputManager._systemKeys[  189] = ['-',                  '_'];
o5.gui.UserInputManager._systemKeys[  190] = ['.',                  '>'];
o5.gui.UserInputManager._systemKeys[  191] = ['/',                  '?'];
o5.gui.UserInputManager._systemKeys[  192] = ['`',                  '~'];
o5.gui.UserInputManager._systemKeys[  219] = ['[',                  '{'];
o5.gui.UserInputManager._systemKeys[  220] = ['\\',                 '|'];
o5.gui.UserInputManager._systemKeys[  221] = [']',                  '}'];
o5.gui.UserInputManager._systemKeys[  222] = ['\\',                 '"'];
o5.gui.UserInputManager._systemKeys[  250] = ['Play'];
o5.gui.UserInputManager._systemKeys[  251] = ['ZoomToggle'];
o5.gui.UserInputManager._systemKeys[  403] = ['Red'];
o5.gui.UserInputManager._systemKeys[  404] = ['Green'];
o5.gui.UserInputManager._systemKeys[  405] = ['Yellow'];
o5.gui.UserInputManager._systemKeys[  406] = ['Blue'];
o5.gui.UserInputManager._systemKeys[  409] = ['Power'];
o5.gui.UserInputManager._systemKeys[  412] = ['Rewind'];
o5.gui.UserInputManager._systemKeys[  414] = ['Eject'];
o5.gui.UserInputManager._systemKeys[  416] = ['Record'];
o5.gui.UserInputManager._systemKeys[  417] = ['FastForward'];
o5.gui.UserInputManager._systemKeys[  418] = ['PlaySpeedUp'];
o5.gui.UserInputManager._systemKeys[  419] = ['PlaySpeedDown'];
o5.gui.UserInputManager._systemKeys[  427] = ['ChannelUp'];
o5.gui.UserInputManager._systemKeys[  428] = ['ChannelDown'];
o5.gui.UserInputManager._systemKeys[  457] = ['Info'];
o5.gui.UserInputManager._systemKeys[  458] = ['Guide'];
o5.gui.UserInputManager._systemKeys[  460] = ['Subtitle'];
o5.gui.UserInputManager._systemKeys[  601] = ['Exit'];
o5.gui.UserInputManager._systemKeys[61468] = ['DVR'];
o5.gui.UserInputManager._systemKeys[61479] = ['TV'];
o5.gui.UserInputManager._systemKeys[61495] = ['Audio'];
o5.gui.UserInputManager._systemKeys[61540] = ['ArrowLeftUp'];
o5.gui.UserInputManager._systemKeys[61541] = ['ArrowLeftDown'];
o5.gui.UserInputManager._systemKeys[61542] = ['ArrowRightUp'];
o5.gui.UserInputManager._systemKeys[61543] = ['ArrowRightDown'];

//likely running on a desktop RTE
if(!('application/ccom_html' in navigator.mimeTypes))
{
	o5.gui.UserInputManager._systemKeys[   33] = ['ChannelUp']; 	// PageUp
	o5.gui.UserInputManager._systemKeys[   34] = ['ChannelDown']; 	// PageDown
	
	o5.gui.UserInputManager._systemKeys[  187] = ['VolumeUp'];		// = (+)
	o5.gui.UserInputManager._systemKeys[  189] = ['VolumeDown'];	// -
	o5.gui.UserInputManager._systemKeys[  219] = ['Mute']; 			// [
	
	o5.gui.UserInputManager._systemKeys[  112] = ['Red']; 			// F1
	o5.gui.UserInputManager._systemKeys[  113] = ['Green']; 		// F2
	o5.gui.UserInputManager._systemKeys[  114] = ['Yellow']; 		// F3
	o5.gui.UserInputManager._systemKeys[  115] = ['Blue']; 			// F4
	
	o5.gui.UserInputManager._systemKeys[    8] = ['Back']; 			// Backspace
	o5.gui.UserInputManager._systemKeys[   88] = ['Exit']; 			// x
	o5.gui.UserInputManager._systemKeys[   77] = ['Menu']; 			// m
	o5.gui.UserInputManager._systemKeys[   71] = ['Guide']; 		// g
	o5.gui.UserInputManager._systemKeys[   80] = ['Power']; 		// p
	o5.gui.UserInputManager._systemKeys[   73] = ['Info']; 			// i
	
	o5.gui.UserInputManager._systemKeys[   82] = ['DVR'];			// r
	o5.gui.UserInputManager._systemKeys[   70] = ['Favorites'];		// f
	o5.gui.UserInputManager._systemKeys[   65] = ['Audio'];			// a
	o5.gui.UserInputManager._systemKeys[   83] = ['Subtitle'];		// s
	
	o5.gui.UserInputManager._systemKeys[  412] = ['Rewind']; 		// RW track multimedia key
	o5.gui.UserInputManager._systemKeys[  179] = ['PlayPause']; 	// Play/Pause track multimedia key
	o5.gui.UserInputManager._systemKeys[  417] = ['FastForward']; 	// FF track multimedia key
	o5.gui.UserInputManager._systemKeys[  417] = ['FastForward']; 	// FF track multimedia key
	o5.gui.UserInputManager._systemKeys[  176] = ['TrackNext']; 	// Next track multimedia key
	o5.gui.UserInputManager._systemKeys[  177] = ['TrackPrevious']; // Previous track multimedia key

	o5.gui.UserInputManager._systemKeys[  116] = ['Rewind']; 		// F5
	o5.gui.UserInputManager._systemKeys[  117] = ['Stop'];			// F6
	o5.gui.UserInputManager._systemKeys[  118] = ['Pause']; 		// F7
	o5.gui.UserInputManager._systemKeys[  119] = ['Play']; 			// F8
	o5.gui.UserInputManager._systemKeys[  120] = ['FastForward']; 	// F9
	o5.gui.UserInputManager._systemKeys[  121] = ['Record'];		// F10
	o5.gui.UserInputManager._systemKeys[  122] = ['TrackPrevious']; // F11
	o5.gui.UserInputManager._systemKeys[  123] = ['TrackNext']; 	// F12
}




/**
* Uses HDMI CEC to control the volume of other devices. It is important to note that not all
* CEC commands are implemented by all devices. It is not common for TVs to have the audio 
* controls implemented.  Audio controls are more often handled by Audio/Video Receivers (AVR). 
* The expected configuration is to have the set-top box plugged into the AVR and then the AVR 
* plugged into the TV.
* @method _hdmiCecVolCtl
* @param {String} key The name of the keyboard key that has been pressed.
* @private
*/
o5.gui.UserInputManager._hdmiCecVolCtl = function _hdmiCecVolCtl (key)
{
	this.logEntry();
	
	if(key != 'Mute' && key != 'VolumeUp' && key != 'VolumeDown')
		return;
	
	var ignoreDevices = [CCOM.System.HDMI_LOGICAL_ADDR_TUNER_1];

	if(!this._hdmiConnectedDevices)
	{
		// This CCOM call is taking about 1 second to complete.  
		this.logDebug('Registering for hdmi events');
		
		this._hdmiConnectedDevices = CCOM.System.getHdmiCecConnectedDevices();    
		
		CCOM.System.addEventListener('onHdmiEvent',	this._onHdmiEvent.bind(this));
	}

	if(this._hdmiConnectedDevices.error)
	{
		this.logError("CCOM.System.getHdmiCecConnectedDevices() returned error: " + this._hdmiConnectedDevices.error.message); 	
	}
	else
	{
		var cmd = 0x44; // CEC cmd User Control Pressed
		var data = [];

		switch (key){
		case 'Mute':
			data[0] = 0x43; // CEC User Control code MUTE
			break;
		case 'VolumeUp':
			data[0] = 0x41; // CEC User Control code VOLUME UP
			break;
		case 'VolumeDown':
			data[0] = 0x42; // CEC User Control code VOLUME DOWN
			break;
		}

		if(data.length == 0)
			return;
		
		for(var i = 0; i < this._hdmiConnectedDevices.deviceNumber; i++)
		{
			var skip = false;
			for(var j = 0; j < ignoreDevices.length; j++)
			{
				if(ignoreDevices[j] == this._hdmiConnectedDevices.deviceAddrs[i].logicalAddress)
				{
					skip = true;
				}
			}
			if(skip)
			{
				continue;
			}
			CCOM.System.sendHdmiCecCommand(this._hdmiConnectedDevices.deviceAddrs[i].logicalAddress, cmd, data, data.length);
		}
	}
};

/**
* This event is fired when there is a change in the sink status.
* @method _onHdmiEvent
* @param {Object} e - The event information.
* @param {Object} e.target - Object on which the event handler was registered.
* @param {Number} e.eventType - The HDMI sink status.
* @private
*/
o5.gui.UserInputManager._onHdmiEvent = function _onHdmiEvent (e)
{
    this.logEntry('HDMI event ' + e.eventType);
    
    if(e.eventType === CCOM.System.HDMI_EVENT_SINK_CONNECTED ||
       e.eventType === CCOM.System.HDMI_EVENT_TOPOLOGY_CHANGED)
    {
	    this.logDebug('Getting CEC connected devices');
	    
        this._hdmiConnectedDevices = CCOM.System.getHdmiCecConnectedDevices();
    }
};

/**
 * @class KeyboardEvent
 * O5.js customizes or adds the following properties to the standard KeyboardEvent
 */

/**
 * @property {String} key
 * key holds the key value of the key pressed following HTML5 standards
 * @readonly
 */

/**
 * @property {String} repeat
 * true if the key has been pressed based on sequence of key down and key up events
 * @readonly
 */

/**
 * @property {Number} repeatDuration
 * Number of milliseconds since this key has been pressed uninterruptedly
 * @readonly
 */
