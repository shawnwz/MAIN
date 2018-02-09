/**
 * ProgressBar creates graphical representation of the progress of any event.
 *
 * Example markup for ProgressBar is:
 * 
 * 	<o5-progress-bar></o5-progress-bar>
 * 
 * See [Getting Started Guide](#!/jsduck/examples) to check ProgressBar example.
 * 
 * @class o5.gui.controls.ProgressBar
 * @extends o5.gui.controls.Control
 *
 * @author lmayle
 */
o5.gui.controls.ProgressBar = function ProgressBar () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.ProgressBar);

o5.gui.controls.ProgressBar.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	
	this._progressBox = this.ownerDocument.createElement("DIV");
	this._progressContainer = this;
	
	this.appendChild(this._progressBox);
	
	if (this.dataset.innerCssClass)
		this._progressBox.className = this.dataset.innerCssClass;
	else
		this._progressBox.className = 'progressInner';

	if (this.dataset.minimumValue)
		this._minimum = this.dataset.minimumValue;
	else
		this._minimum = 0;
	
	if (this.dataset.maximumValue)
		this._maximum = this.dataset.maximumValue;
	else
		this._maximum = 100;
	
    this._progress = 0;
    this._percentage = 0;
    this._orientation = o5.gui.controls.ProgressBar.HORIZONTAL;
    this.setProgress();
};

/**
 * Constant to denote the horizontal orientation of the progress bar
 * @property {String} HORIZONTAL
 * @readonly
 */
o5.gui.controls.ProgressBar.HORIZONTAL = "horizontal";

/**
 * Constant to denote the vertical orientation of the progress bar
 * @property {String} VERTICAL
 * @readonly
 */
o5.gui.controls.ProgressBar.VERTICAL = "vertical";


/**
 * Calculates the position of the progress bar based on the amount of progress made.
 * @method _getPosition
 * @private
 * @param {Number} progressValue The amount of progress made
 * @return {Number} The position of the progress bar.
 */
o5.gui.controls.ProgressBar.prototype._getPosition = function (progressValue)
{
    var total = (this._orientation === o5.gui.controls.ProgressBar.VERTICAL) ? this._progressContainer.clientHeight : this._progressContainer.clientWidth;
    
    if (progressValue < this._minimum)
    {
        progressValue = this._minimum;
    }
    
    if (progressValue > this._maximum)
    {
        progressValue = this._maximum;
    }
    
    this._percentage = Math.ceil(((progressValue - this._minimum) / (this._maximum - this._minimum)) * 100);
    
    return Math.ceil(this._percentage * total / 100);
};

/**
 * Calculates the position of the progress bar based on the amount of progress made.
 * @method _getScrollPosition
 * @private
 * @param {Number} progressValue The amount of progress made
 * @return {Number} The position of the progress bar.
 */
o5.gui.controls.ProgressBar.prototype._getScrollPosition = function (progressValue)
{
    var total = (this._orientation === o5.gui.controls.ProgressBar.VERTICAL) ? this.getHeight() : this.getWidth();

    if (progressValue < this._minimum)
    {
        progressValue = this._minimum;
    }
    if (progressValue > this._maximum)
    {
        progressValue = this._maximum;
    }
    this._percentage = (((progressValue - this._minimum) / (this._maximum - this._minimum)) * 100);
    return (this._percentage * total / 100);
};

/**
 * Initialised the progress bar.
 * @method init
 * @param {Number} min The minimum value of the progress bar.
 * @param {Number} max The maximum value of the progress bar.
 */
o5.gui.controls.ProgressBar.prototype.init = function init (min, max)
{
    if (min !== undefined && max !== undefined)
    {
        this.setMinimumValue(min);
        this.setMaximumValue(max);
    }
    else
    {
        throw "Exception: progressbar minimum and maximum values are not valid";
    }
};

/**
 * Initialised the progress bar.
 * @method initialise
 * @deprecated use init()
 * @param {Number} min The minimum value of the progress bar.
 * @param {Number} max The maximum value of the progress bar.
 */
o5.gui.controls.ProgressBar.prototype.initialise = function initialise (min, max)
{
	this.logDeprecated();
	
    this.init(min, max);
};

// eslint-disable-next-line valid-jsdoc, not to document the return value, this is for legacy support only
/**
 * Sets the orientation of the progress bar.
 * @method setOrientation
 * @param {String} orientation o5.gui.controls.ProgressBar.VERTICAL or o5.gui.controls.ProgressBar.HORIZONTAL
 */
o5.gui.controls.ProgressBar.prototype.setOrientation = function setOrientation (orientation)
{
    this._orientation = orientation;
    return this;
};

// eslint-disable-next-line valid-jsdoc, not to document the return value, this is for legacy support only
/**
 * Sets the minimum value of the progress bar.
 * @method setMinimumValue
 * @param {Number} minValue The minimum value of the progress bar.
 */
o5.gui.controls.ProgressBar.prototype.setMinimumValue = function setMinimumValue (minValue)
{
    this._minimum = minValue;
    return this;
};

// eslint-disable-next-line valid-jsdoc, not to document the return value, this is for legacy support only
/**
 * Sets the maximum value of the progress bar.
 * @method setMaximumValue
 * @param {Number} maxValue The maximum value of the progress bar.
 */
o5.gui.controls.ProgressBar.prototype.setMaximumValue = function setMaximumValue (maxValue)
{
    this._maximum = maxValue;
    return this;
};

Object.defineProperty(o5.gui.controls.ProgressBar.prototype, "value",
{
	get: function getValue ()
	{
	    return this.getProgress();
	},
	set: function setValue (val)
	{
	    this.setProgress(val);
	}
});

// eslint-disable-next-line valid-jsdoc, not to document the return value, this is for legacy support only
/**
 * Sets the progress width within the progress bar and
 * sets the x co-ordinate to the start position if provided
 * @method setProgress
 * @param {Number} progress The amount of progress made.
 * @param {Number} start The position from where the progress bar should begin
 */
o5.gui.controls.ProgressBar.prototype.setProgress = function setProgress (progress, start)
{
    var startPosition = start ? this._getPosition(parseInt(start, 10)) : 0;
    var endPosition = progress ? this._getPosition(parseInt(progress, 10)) : 0;
    
    this._progress = Math.max(this._minimum, progress);
    this._progress = Math.min(this._maximum, progress) || 0; //force to 0 if NaN

    if (this._orientation === o5.gui.controls.ProgressBar.VERTICAL)
    {
        this._progressBox.style.width = '100%';
        this._progressBox.style.top = startPosition + 'px';
        this._progressBox.style.height = (endPosition - startPosition) + 'px';
    }
    else
    {
        this._progressBox.style.height = '100%';
        this._progressBox.style.left = startPosition + "px";
        this._progressBox.style.width = (endPosition - startPosition) + "px";
    }
    
    return this;
};

// eslint-disable-next-line valid-jsdoc, not to document the return value, this is for legacy support only
/**
 * Sets the progress width within the progress bar and
 * sets the x co-ordinate to the start position if provided
 * @method setScrollProgress
 * @param {Number} progress The amount of progress made.
 * @param {Number} start The position from where the progress bar should begin
 */
o5.gui.controls.ProgressBar.prototype.setScrollProgress = function setScrollProgress (progress, start)
{
    var startPosition = start ? this._getScrollPosition(start) : 0;
    var endPosition = this._getScrollPosition(progress);
    var height = null;
	var width = null;
	
    this._progress = Math.max(this._minimum, progress);
    this._progress = Math.min(this._maximum, progress);

    if (this._orientation === o5.gui.controls.ProgressBar.VERTICAL)
    {
        this._progressBox.style.width = this.offsetWidth + 'px';
        this._progressBox.style.top = startPosition + 'px';
        height = endPosition - startPosition;
        this._progressBox.style.height = (height > 3 ? height : 3) + 'px';
    }
    else
    {
    	this._progressBox.style.height = this.offsetHeight + 'px';
    	this._progressBox.style.left = startPosition + 'px';
        width = endPosition - startPosition;
        this._progressBox.style.width = (width > 3 ? width : 3) + 'px';
    }
    
    return this;
};

/**
 * Calculates the progress made as a percentage.
 * @method getProgressPercent
 * @return {Number} The progress made as a percentage.
 */
o5.gui.controls.ProgressBar.prototype.getProgressPercent = function getProgressPercent ()
{
    return this._percentage || 0;
};

/**
 * Retrieves the progress made.
 * @method getProgress
 * @return {Number} The progress made.
 */
o5.gui.controls.ProgressBar.prototype.getProgress = function getProgress ()
{
    return this._progress;
};

/**
 * Increments the progress bar by the given value
 * @method increment
 * @param {Number} value the amount to increment by
 */
o5.gui.controls.ProgressBar.prototype.increment = function increment (value)
{
    var currentPos = this.getProgress();

    value = value || 1;
    this.setProgress(currentPos + value);
};

/**
 * Decrements the progress bar by the given value
 * @method decrement
 * @param {Number} value the amount to decrement by
 */
o5.gui.controls.ProgressBar.prototype.decrement = function decrement (value)
{
    var currentPos = this.getProgress();

    value = value || 1;
    this.setProgress(currentPos - value);
};

/**
 * Sets the css class for the inner progress bar.
 * @method setInnerCssClass
 * @param {String} className The name of the CSS class to be applied.
 */
o5.gui.controls.ProgressBar.prototype.setInnerCssClass = function setInnerCssClass (className)
{
	this._progressBox.className = className;
};

/**
 * Sets the css class for the inner progress bar.
 * @method setOuterCssClass
 * @param {String} className The name of the CSS class to be applied.
 */
o5.gui.controls.ProgressBar.prototype.setOuterCssClass = function setOuterCssClass (className)
{
	this.className = className;
};

/**
 * Sets the css style for the inner progress bar.
 * @method setInnerCssStyle
 * @param {String} cssStyle The CSS style to be applied.
 */
o5.gui.controls.ProgressBar.prototype.setInnerCssStyle = function setInnerCssStyle (cssStyle)
{
	this._progressBox.style.cssText = cssStyle;
};

// eslint-disable-next-line valid-jsdoc, not to document the return value, this is for legacy support only
/**
 * Sets the rounding of the progress bar.
 * @method setRounding
 * @param {Object} rounding The new rounding value.
 */
o5.gui.controls.ProgressBar.prototype.setRounding = function setRounding (rounding)
{
	this.style.borderRadius = rounding + 'px';
	this._progressBox.style.borderRadius = rounding + 'px';
	
    return this;
};

