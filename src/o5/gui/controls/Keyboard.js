/**
 * Keyboard control is a subclass of {@link o5.gui.controls.FlexGrid} control which supports printable ASCII (alphanumberic characters and symbols) as well as multi-language character sets. 
 * The keyboard control is configured to handle navigation (up, down, left, right), input selection using OK key and handling space and backspace keystrokes.
 *
 * Example markup for Keyboard control is:
 *
 *     <o5-keyboard></o5-keyboard>
 *
 * The o5.gui.controls.Keyboard control internally uses {@link o5.gui.controls.KeyboardRow} which is subclass of {@link o5.gui.controls.FlexGridRow} 
 * and {@link o5.gui.controls.KeyboardCell} which is subclass of {@link o5.gui.controls.FlexGridCell}
 * 
 * {@img keyboard_panel1.png}
 * 
 * See [Getting Started Guide](#!/jsduck/examples) to check keyboard example.
 * 
 * @class o5.gui.controls.Keyboard
 * @extends o5.gui.controls.FlexGrid
 * 
 * @author kshipra
 */

o5.gui.controls.Keyboard = function Keyboard () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.Keyboard, o5.gui.controls.FlexGrid);

//o5.log.setAll(o5.gui.controls.Keyboard, true);

o5.gui.controls.Keyboard.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	this.logEntry();
	
	//temp
	this.cellTemplate = 'o5-keyboard-key';
	this.rowTemplate = 'o5-keyboard-row';
};



/*
 * Events
 */
/**
 * Fired when the cancel key is pressed.
 * 
 * Example :
 * 
 *  	function oncancel (e) { console.log("Optional code for 'Cancel' key press will go here.."); }
 * 
 * @event oncancel
 */
/**
 * Fired when the done key is pressed.
 * 
 * Example :
 * 
 * 		function onsubmit (e) { console.log("Optional code for 'Done' key press will go here.."); }
 * 
 * @event onsubmit
 */
/**
* Fired when the reset key is pressed.
* 
* Example :
* 
*  		function onreset (e) { console.log("Optional code for 'Reset' key press will go here.."); }
* 
* @event onreset
 */



/*
 * Public properties
 */
/**
 * Optional control for receiving output of the keyboard.
 * @property textControl
 * @type {o5.gui.controls.TextInput}
 */
Object.defineProperty(o5.gui.controls.Keyboard.prototype, 'textControl', {
	get: function () {

		return this._textControl;
		
	},
	set: function (val) {
		
		this._textControl = val;
	},
	enumerable: true
});


/**
 * Returns the currently selected keyboard key, otherwise returns null.
 * @property
 * @type {o5.gui.controls.KeyboardKey}
 */
Object.defineProperty(o5.gui.controls.Keyboard.prototype, 'selectedKey', {
	get: function () {
		if(this.selectedRow)
		{
			if(this.selectedRow.selectedCell)
				return this.selectedRow.selectedCell;
			else
				return null;
		}
		else
			return null;	
	}
});


/**
 * Changes the case of alphabets temporarily. By default the shift value is set to false.
 * @property
 * @type {Boolean}
 */
Object.defineProperty(o5.gui.controls.Keyboard.prototype, 'shift', {
	get: function () {

		return this._shift || false;
	},
	set: function (val) {

		this._shift = val;
		
		var shiftKey = this.querySelector(':scope > * > * > * > [data-key-value="Shift"]');
		
		if(val)
		{
			if(shiftKey)
				shiftKey.dataset.pressed = "";
			
			this._resetCase();
		}
		else
		{
			if(shiftKey)
				delete shiftKey.dataset.pressed;
			
			this._resetCase();
		}
	},
	enumerable: true
});


/**
 * Gets or sets the capslock value. By default the capslock value is set false i.e. off.
 * @property
 * @type {Boolean}
 */
Object.defineProperty(o5.gui.controls.Keyboard.prototype, 'capsLock', {
	get: function () {

		return this._capsLock || false;
	},
	set: function (val) {

		this._capsLock = val;
		
		var capsKey = this.querySelector(':scope > * > * > * > [data-key-value="CapsLock"]');
		
		if(val)
		{
			if(capsKey)
				capsKey.dataset.pressed = "";
			
			this._resetCase();
		}
		else
		{
			if(capsKey)
				delete capsKey.dataset.pressed;
			
			this._resetCase();
		}
	},
	enumerable: true
});


/**
 * Returns the array of keyboard panels.
 * @property
 * @type {Array}
 */
Object.defineProperty(o5.gui.controls.Keyboard.prototype, 'panels', {
	get: function () {

		return this._panels || [];
	},
	enumerable: true
});


/**
 * Gets or sets the current keyboad panel. By default the first panel in keyboard panels array is set as currentPanel.
 * @property
 * @type {Number}
 */
Object.defineProperty(o5.gui.controls.Keyboard.prototype, 'currentPanel', {
	get: function () {

		return this._currentPanel || 0;
	},
	set: function (val) {

		this._currentPanel = val;
		
		if(this._currentPanel >= this.panels.length)
			this._currentPanel = 0;
		
		this.deleteAllRows();
		
		this._loadPanel(this.panels[this._currentPanel]);
	},
	enumerable: true
});



/*
 * Public methods
 */
/**
 * Inserts keys in keyboard panel. Takes n number of arguments where each argument is a keyboard panel data in the form of array of javascript objects. 
 * 
 * Each keyboard panel data is array of all keyboard rows data of the panel. And each keyboard row data is an array of all the keyboard keys data of that row. 
 * 
 * Example of JavaScript object format :
 * 
 * 	panel1 = [ [ { value : "A" } , { value : "B" } , { value : "C" } ], [ { value : "D" } , { value : "E" } , { value : "F" } ], [ { value : "Canel" } , { value : "Shift" } , { value : "Space" } ] ]; 
 * 
 * Example of function call : 
 * 
 * 	keyboard.insertKeys(panel1, panel2);
 * 
 * You can give as many panel input as argument as you want.
 * 
 * The following key values have special meaning:
 * 
 * 	CapsLock: Used to activate caps lock
 * 
 * 	Shift: Used to temporary change case
 * 
 * 	Space: white space
 * 
 * 	Backspace: back space
 * 
 * 	Cancel: triggers cancel event
 * 
 * 	Submit: triggers submit event
 * 
 * 	Reset: Clears the text control and triggers reset event
 * 
 * 	
 * @method insertKeys
 * @param {Array} panel1
 * @param {Array} [panel2]
 * @param {Array} [etc]
 */
o5.gui.controls.Keyboard.prototype.insertKeys = function insertKeys (panel1, panel2, etc)
{
	this.logEntry();
	
	delete this._panel;
	this._panels = [];
	
	for (var i = 0; i < arguments.length; i++)
	{
		this._panels.push(arguments[i])
	}
	
	this.currentPanel = 0;
};


/**
 * Switch among different keyboard panels.
 * @method switchPanel
 */
o5.gui.controls.Keyboard.prototype.switchPanel = function switchPanel ()
{
	this.logEntry(this.panels.length + " " + this.currentPanel);
	
	if(this.panels.length > 1)
	{
		this.currentPanel++;
	}
};


/*
 * Private properties
 */
/*
 * Private methods
 */
o5.gui.controls.Keyboard.prototype._onKeyDown = function _onKeyDown (e)
{
	this.logInfo(e.keyCode + ' ' + e.timeStamp);
	
	this.superCall(e);
	
	if(e.defaultPrevented)
		return;
	
	if(this.textControl)
	{
		switch(e.key)
		{
		case 'Ok':
			var kv = this.selectedKey;
			
			switch (kv.value)
			{
				case 'CapsLock':
					this.capsLock = !this.capsLock;
					break;
					
				case 'Shift':
					this.shift = !this.shift;
					break;
				
				case 'Space':
					if(this.shift)
						this.shift = false;
					
					this.textControl.value += " ";
					
					break;
					
				case 'Backspace':
					this.textControl.value = this.textControl.value.slice(0,-1);
					
					if(this.shift)
						this.shift = false;
					
					break;
					
				case 'Cancel':
					this.dispatchEvent(new Event("cancel", { bubbles: false, cancelable: true }));
					break;
				
				case 'Submit':
					this.dispatchEvent(new Event("submit", { bubbles: false, cancelable: true }));
					break;
					
				case 'Reset':
					this.textControl.value = "";
					
					if(this.shift)
						this.shift = false;
					
					this.dispatchEvent(new Event("reset", { bubbles: false, cancelable: true }));
					break;
					
				default:
					this.textControl.value += kv.value;
				
					if(this.shift)
						this.shift = false;
					
					break;
			}
			e.preventDefault();
			
			break;
			
		case 'Backspace':
			
			this.textControl.value = this.textControl.value.slice(0,-1);
			
			if(this.shift)
				this.shift = false;
			
			break;
		}
	}
};


o5.gui.controls.Keyboard.prototype._loadPanel = function _loadPanel (panel)
{
	for(var j = 0; j < panel.length; j++)
	{
		var row = this.insertRow();
			
		for(var k = 0; k < panel[j].length; k++) 
		{
			var cell = row.insertCell();
			
			cell.value = panel[j][k].value;
			
			if(panel[j][k].textContent)
			{
				cell.textContent = panel[j][k].textContent;
			}
			else
			{
				cell.textContent = panel[j][k].value;
			}
		}
	}
	
	this.selectRow(0, true);
	
	//this will reset these keys to its previous state
	this.shift = this.shift;
	this.capsLock = this.capsLock;
};


o5.gui.controls.Keyboard.prototype._resetCase = function _resetCase ()
{
	if(this._shift)
	{
		if(this._capsLock)
		{
			this._toLowerCase();
		}
		else
		{
			this._toUpperCase();
		}
	}
	else
	{
		if(this._capsLock)
		{
			this._toUpperCase();
		}
		else
		{
			this._toLowerCase();
		}
	}
};

o5.gui.controls.Keyboard.prototype._toUpperCase = function _toUpperCase ()
{
	for(var j = 0; j < this.children[0].childElementCount - 1; j++)
	{
		for(var k = 0; k < this.children[0].children[j].children[0].childElementCount - 1; k++) 
		{
			var key = this.children[0].children[j].children[0].children[k];
			
			if(key.value.length === 1)
			{
				key.value =  key.value.toUpperCase();
				key.textContent =  key.textContent.toUpperCase();
			}
		}
	}
};

o5.gui.controls.Keyboard.prototype._toLowerCase = function _toLowerCase ()
{
	for(var j = 0; j < this.children[0].childElementCount - 1; j++)
	{
		for(var k = 0; k < this.children[0].children[j].children[0].childElementCount - 1; k++) 
		{
			var key = this.children[0].children[j].children[0].children[k];
			
			if(key.value.length === 1)
			{
				key.value =  key.value.toLowerCase();
				key.textContent =  key.textContent.toLowerCase();
			}
		}
	}
};

