/**
 * ContentProgressBar extends ProgressBar by adding additional meta information, such as labels
 * and a graphical position marker.
 *
 * The position marker is defined using the setPlayHead method, and should be provided with a mark-up
 * reference (i.e. this could be an external mark-up file with an anchor to a definition within the file).
 *
 * Example Markup :
 *
 *     <o5-content-progress-bar></o5-content-progress-bar>
 *
 * @class o5.gui.controls.ContentProgressBar
 * @extends o5.gui.controls.ProgressBar
 *
 * @author lmayle
 */

o5.gui.controls.ContentProgressBar = function ContentProgressBar () {};
o5.gui.controls.Control.registerO5Control(o5.gui.controls.ContentProgressBar, o5.gui.controls.ProgressBar);

o5.gui.controls.ContentProgressBar.prototype.createdCallback = function createdCallback ()
{
	this.superCall();
	
    this._startLabel = this.ownerDocument.createElement('o5-label');
    this.appendChild(this._startLabel);
    
	this._progressContainer = this.ownerDocument.createElement("DIV");
	this.appendChild(this._progressContainer);
	
	this._progressContainer.appendChild(this._progressBox);
	
    this._positionMarker = this.ownerDocument.createElement('o5-image');
    this._progressContainer.appendChild(this._positionMarker);
    
    this._endLabel = this.ownerDocument.createElement('o5-label');
    this.appendChild(this._endLabel);
    
    this._startLabelPadding = 5 * $N.gui.GUIObject.prototype.resolutionFactor;
    this._endLabelPadding = 12 * $N.gui.GUIObject.prototype.resolutionFactor;
    this._DEFAULT_Y_OFFSET = -10 * $N.gui.GUIObject.prototype.resolutionFactor;

    this._startLabel.className = 'progressTextStart';

    this._endLabel.className = 'progressTextEnd';
};

/**
 * Sets the text label content at the beginning of the progress bar.
 * @method setStartLabel
 * @param {String} text The text to appear at the beginning of the progress bar.
 */
o5.gui.controls.ContentProgressBar.prototype.setStartLabel = function setStartLabel (text)
{
    this._startLabel.setText(text);
};

/**
 * Sets the text label content at the end of the progress bar.
 * @method setEndLabel
 * @param {String} text The text to appear at the end of the progress bar.
 */
o5.gui.controls.ContentProgressBar.prototype.setEndLabel = function setEndLabel (text)
{
    this._endLabel.setText(text);
};

/**
 * Sets the padding for the endLabel
 * @method setEndLabelPadding
 * @param {Number} value sets The X Padding before the label and after the progress bar.
 */
o5.gui.controls.ContentProgressBar.prototype.setEndLabelPadding = function setEndLabelPadding (value)
{
    this._endLabelPadding = value;
    this._endLabel.setX(parseInt(this.getWidth(), 10) + this._endLabelPadding);
};

/**
 * Sets the padding for the startLabel
 * @method setStartLabelPadding
 * @param {Number} value sets The X Padding of the start label before the progress bar.
 */
o5.gui.controls.ContentProgressBar.prototype.setStartLabelPadding = function setStartLabelPadding (value)
{
    this._startLabelPadding = value;
    this._startLabel.setX(-this._startLabelPadding);
};

/**
 * Sets the position at which the marker is located.
 * @method setMarkerPosition
 * @param {Number} value The position at which the marker is to be placed.
 */
o5.gui.controls.ContentProgressBar.prototype.setMarkerPosition = function setMarkerPosition (value)
{
    this._positionMarker.style.left = ((this._getPosition(value) || 0) * 100 / this._progressContainer.clientWidth) + '%';
};

/**
 * Sets the position at which the marker is located.
 * @method setMarkerYPosition
 * @param {Number} YPos The position at which the marker is to be placed.
 */
o5.gui.controls.ContentProgressBar.prototype.setMarkerYPosition = function setMarkerYPosition (YPos)
{
    this._positionMarker.setY(YPos);
};

/**
 * Gets the position at which the marker is located.
 * @method getMarkerPosition
 * @param {Number} Ypos The position at which the marker is to be placed.
 */

o5.gui.controls.ContentProgressBar.prototype.getMarkerPosition = function getMarkerPosition (value)
{
    return this._getPosition(value);
};

/**
 * Hides the position marker
 * @method hidePositionMarker
 */
o5.gui.controls.ContentProgressBar.prototype.hidePositionMarker = function hidePositionMarker ()
{
    this._positionMarker.hide();
};

/**
 * Shows the position marker
 * @method showPositionMarker
 */
o5.gui.controls.ContentProgressBar.prototype.showPositionMarker = function showPositionMarker ()
{
    this._positionMarker.show();
};

/**
 * Sets the icon that is used to denote the play head.  The passed href should be the path to
 * an image file.
 * @method setPlayHead
 * @param {String} href file location
 */
o5.gui.controls.ContentProgressBar.prototype.setPlayHead = function setPlayHead (href)
{
    this._positionMarker.setUrl(href);
};
