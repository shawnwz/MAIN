/**
 * Flexible Menu Control, it is a subclass of o5.gui.controls.List with the following differences:
 * 
 * - If no template element is provided, the generic o5-menu-item will be used
 *
 * Example markup for Menu is:
 * 
 * 	<o5-menu>
 * 		<template></template>
 * 	</o5-menu>
 * 
 * @class o5.gui.controls.Menu
 * @extends o5.gui.controls.List
 * @author lmayle
 */

o5.gui.controls.Menu = function Menu () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.Menu, o5.gui.controls.List);

// o5.log.setAll(o5.gui.controls.Menu, true);

o5.gui.controls.Menu.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	
	this.itemTemplate = 'o5-menu-item';
};

/*
 * Public properties
 */
/*
 * Public methods
 */
/**
 * Inserts a new menu item with the optional callbacks
 * 
 * @method insertMenuItem
 * @return {o5.gui.controls.MenuItem} The new menu item
 */
o5.gui.controls.Menu.prototype.insertMenuItem = function insertMenuItem (label, selectionCallback, activationCallback, clickedCallback)
{
	var item = this.insertItem();
	
	item.textContent = label;
	item.onselect = selectionCallback;
	item.onactivate = activationCallback;
	item.onclick = clickedCallback;
	
	return item;
};

/**
 * Inserts a new menu item associated to an O5.js View
 * 
 * @method insertViewMenuItem
 * @return {o5.gui.controls.MenuItem} The new menu item
 */
o5.gui.controls.Menu.prototype.insertViewMenuItem = function insertViewMenuItem (label, targetView, previewOnSelection)
{
	var item = this.insertItem();
	
	item.textContent = label;
	item.targetView = targetView;
	item.previewOnSelection = previewOnSelection === true ? true : false;
	
	return item;
};




/*
 * Private properties
 */



/*
 * Private methods
 */
o5.gui.controls.Menu.prototype._onKeyDown = function _onKeyDown (e)
{
	this.logInfo(e.keyCode + ' ' + e.timeStamp);
	
	this.superCall(e);
	
	if (e.defaultPrevented)
		return;

	switch (e.key)
	{
//	case 'ArrowLeft':
//		if (this._orientation === 'v')
//		{
//			e.preventDefault();
//		}
//		break;
	case 'ArrowRight':
		if (this._orientation === 'v')
		{
			var item = this.selectedItem;
			
			if (item)
			{
				if (item.targetView)
				{
					o5.gui.ViewManager.open(item.targetView);
					e.preventDefault();
				}
				if (item.onclick)
				{
					item.onclick();
					e.preventDefault();
				}
			}
		}
		break;
//	case 'ArrowUp':
//		if (this._orientation === 'h')
//		{
//			e.preventDefault();
//		}
//		break;
	case 'ArrowDown':
		if (this._orientation === 'h')
		{
			var item = this.selectedItem;
			
			if (item)
			{
				if (item.targetView)
				{
					o5.gui.ViewManager.open(item.targetView);
					e.preventDefault();
				}
				if (item.onclick)
				{
					item.onclick();
					e.preventDefault();
				}
			}
		}
		break;
	case 'Ok':
		
		var item = this.selectedItem;
		
		if (item)
		{
			if (item.targetView)
			{
				o5.gui.ViewManager.open(item.targetView);
				e.preventDefault();
			}
			if (item.onclick)
			{
				item.onclick();
				e.preventDefault();
			}
		}
			
		break;
	default:
	}

};


