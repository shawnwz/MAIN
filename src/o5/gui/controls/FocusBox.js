/**
 * FocusBox element sometimes used by other controls like 
 * the {@link o5.gui.controls.List}, {@link o5.gui.controls.FlexGrid}, {@link o5.gui.controls.GridGuide}, {@link o5.gui.controls.Keyboard} etc.
 *
 * This is usually used as a base class for customized focus boxes
 *
 * Example markup for FocusBox is:
 * 
 * 	<o5-focus-box></o5-focus-box>
 * 
 * FocusBox can be used as html data attribute as:
 * 
 * 	data-focus-box="o5-focus-box"
 * 
 * @class o5.gui.controls.FocusBox
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 */

o5.gui.controls.FocusBox = function FocusBox () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.FocusBox);

//o5.log.setAll(o5.gui.controls.FocusBox, true);

o5.gui.controls.FocusBox.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
};

o5.gui.controls.FocusBox.prototype.moveTo = function moveTo (left, top, width, height, el, skipAnimation)
{
	this.logEntry();
	
	this.queueReflowPrep(this._movePrep, { left: left, top: top, width: width, height: height, el: el, skipAnimation: skipAnimation });
};

o5.gui.controls.FocusBox.prototype._movePrep = function _movePrep (tag)
{
	this.logEntry();
	
	var cs = getComputedStyle(this);
	
	if(cs.width.includes('px'))
	{
		var px = parseInt(cs.width);
		
		if(px)
		{
			tag.left += tag.width / 2 - px / 2;
			tag.width = 'initial';
		}
	}
	
	if(cs.height.includes('px'))
	{
		var px = parseInt(cs.height);
		
		if(px)
		{
			tag.top += tag.height / 2 - px / 2;
			tag.height = 'initial';
		}
	}
	
	if (this._useACLayers)
	{
		tag.css = '-webkit-transform: translate3d(' + tag.left + 'px, ' + tag.top + 'px, 0); ' +
			'width: ' + tag.width + 'px; height: ' + tag.height + 'px; ';
	}
	else
	{
		tag.css = '-webkit-transform: translate(' + tag.left + 'px, ' + tag.top + 'px); ' +
			'width: ' + tag.width + 'px; height: ' + tag.height + 'px; ';
	}
	
	this.queueReflowSet(this._moveSet, tag);
};

o5.gui.controls.FocusBox.prototype._moveSet = function _moveSet (tag)
{
	this.logEntry();
	
	if (this.style.display)
	{
		this.style.display = '';
	}
	if (this._animate && this._animationDurationMS && !tag.skipAnimation)
	{
		this.style.transition = "-webkit-transform " + this._animationDurationMS + "ms linear";
	}
	else
	{
		this.style.transition = '';
	}
	this.style.cssText += tag.css;
};
