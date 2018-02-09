/**
 * @class app.gui.controls.SurfChannelBox
 */

app.gui.controls.SurfChannelBox = function SurfChannelBox () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.SurfChannelBox);

/**
 * @method createdCallback
 */
app.gui.controls.SurfChannelBox.prototype.createdCallback = function createdCallback () {
	this.superCall();
	this._logo = this.querySelector('#surfScanChannelBoxLogo');
	this._name = this.querySelector('#surfScanChannelBoxName');
	this._favIcon = this.querySelector('.iconFavSelected');
	this._audioIcon = this.querySelector('.iconAudio');
	this._channelNumber = this.querySelector('.channelNumber');
	this._logoTimeout = null;
};

/**
 * @method attachedCallback
 */
app.gui.controls.SurfChannelBox.prototype.attachedCallback = function attachedCallback () {
	if (this.id) {
		$util.ControlEvents.on("app-surf:surfScanChanList", "change", this._populate, this);
	}
};

/**
 * @method _populate
 */
app.gui.controls.SurfChannelBox.prototype._populate = function _populate (ctrl) {
	var selectedItem = ctrl.selectedItem,
		channel = selectedItem ? selectedItem.itemData : null,
		logo,
		me = this;

	if (channel) {
		switch ($config.getConfigValue("settings.tv.guide.channel.name.display")) {
			case "logo":
				if (channel.logo && channel.logo !== "" && channel.logo !== "undefined") { //@hdk fix this! Other places wont check for the "undefined" string!
					this.classList.add("imgLogo");
	  				this._name.textContent = "";
					logo = "url(" + channel.logo + ")";
				} else {
					this.classList.remove("imgLogo");
	  				this._name.textContent = channel.serviceName;
					logo = null;
				}
				break;
			case "text":
				if (channel.serviceName && channel.serviceName !== "" && channel.serviceName !== "undefined") { //@hdk fix this! Other places wont check for the "undefined" string!
					this.classList.remove("imgLogo");
	  				this._name.textContent = channel.serviceName;
					logo = null;
				} else {
					this.classList.add("imgLogo");
	  				this._name.textContent = "";
					logo = "url(" + channel.logo + ")";
				}
				break;
			default:
				break;
		}

		if (this._logoTimeout) { // previous timeout still going (must be fast scrolling)
			clearTimeout(this._logoTimeout);
	  	this._logo.style.backgroundImage = logo ? "url('" + channel.logo + "')" : "";
			this._logo.classList.remove("out");
		} else { // slow scrolling, fade logo out and back in when timer fires
			this._logo.classList.add("out");
		}
		this._logoTimeout = setTimeout(function () {
	  		me._logo.style.backgroundImage = logo ? "url('" + channel.logo + "')" : "";
			me._logo.classList.remove("out");
			me._logoTimeout = null;
		}, 100);

		//this._channelNumber.textContent = channel.logicalChannelNum;

		// <!-- surfScanChannelBox: class helpers [fav, locked, radio]-->
		if (channel.favorite) {
			this.classList.add("fav");
		} else {
			this.classList.remove("fav");
		}
		if (channel.isSubscribed) {
			this._channelNumber.textContent = channel.logicalChannelNum;
			this.classList.remove("locked");
		} else {
			this._channelNumber.textContent = "";
			this.classList.add("locked");
		}
		if (channel.type === $util.constants.CHANNEL_TYPE.RADIO) { //@hdk TODO this doesnt work! type="BTV"
			this.classList.add("radio");
		} else {
			this.classList.remove("radio");
		}
	}
};

