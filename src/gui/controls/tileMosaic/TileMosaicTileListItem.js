/**
 * @class app.gui.controls.TileMosaicTileListItem
 */

app.gui.controls.TileMosaicTileListItem = function TileMosaicTileListItem() {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.TileMosaicTileListItem, o5.gui.controls.ListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.TileMosaicTileListItem.prototype.createdCallback = function createdCallback() {
	this.logEntry();
	this.superCall();

	this.className = "tile";

	this._data = null;

	this.logExit();
};


/**
 * @property itemData
 * @public
 * @type {Object} itemData
 */
Object.defineProperty(app.gui.controls.TileMosaicTileListItem.prototype, "itemData", {
	get: function get() {
		return this._data;
	},
	set: function set(data) {
		var html = "", title, subTitle, subTitle2, eventText, now,
		dataReady = false;

		this._data = data;
		this.classList.add(data.tileType);

		if (data.isScrubbed === true) {
			this.classList.add('scrubbed');
		}
		if (data.isNotEntitled === true) {
			this.classList.add('notEntitled');
		}

		this.dataset.tileId = data.id;

		if (data.promo && typeof data.promo === 'string') {
			this.style.backgroundImage = "url('" + data.promo + "')";
		}

		html += '<div class="tileShadow"></div>';
		html += '<div class="tileGradient"></div>';

		if (data.isScrubbed !== true) {

			title = data.title || '';
			subTitle = data.subtitle || '';
			subTitle2 = (data.subtitle2 || '') + ' ' + (data.eventRatingBesideSubTitle2 || '');
			eventText = (data.badgesEventText || data.badgesEventClassification) ? (data.badgesEventText || '') + (data.badgesEventClassification || '') : '';

			html += '<div class="tileText ' + (data.badgesBroadcastText || data.badgesPurchasedText || data.badgesPromotionalText ? 'offset' : '') + '">';
				html += '<div class="tileLocked"></div>';

				if (data.eventRatingBesideSubTitle2) {
					data.eventRatingBesideSubTitle2 = ' <span>' + data.eventRatingBesideSubTitle2 + '</span>';
				}
				if (data.badgesEventClassification) {
					data.badgesEventClassification = ' <span>' + data.badgesEventClassification + '</span>';
				}
				if (title) {
					html += '<div class="tileTitle ' + ((!subTitle && !subTitle2 && !eventText) ? 'tileBottomText' : '') + '">' + title + '</div>';
				}
				if (subTitle) {
					html += '<div class="subTitle ' + ((!subTitle2 && !eventText) ? 'tileBottomText' : '') + '">' + subTitle + '</div>';
				}
				if (subTitle2) {
					html += '<div class="subTitle2 ' + ((!eventText) ? 'tileBottomText' : '') + '">' + subTitle2 + '</div>';
				}
				if (eventText) {
					html += '<div class="tileGreenTextBar">' + eventText + '</div>';
				}
			html += '</div>';
		}

		html += '<div class="tileFocusedBar"></div>';

		html += '<div class="tileBadgeTextWrapper">'; //@hdk see _getTextAndBadgesHtml()
			if (data.badgePromotionalText || data.badgeBroadcastText || data.badgePurchasedText) {
				if (data.badgePromotionalText) {
					html += '<div class="tileRedTextBar">' + data.badgePromotionalText + '</div>';
				}
				if (data.badgeBroadcastText) {
					html += '<div class="tileBlackTextBar">' + data.badgeBroadcastText + '</div>';
				}
				if (data.badgePurchasedText) {
					html += '<span class="tileBlackTextBarRight">' + data.badgePurchasedText + '</span>';
				}
			} else if (!data.isCollection) {
				if (data.progStartDate && data.progEndDate) {
					now = Date.now() / 1000;
					if (data.isOnNow === true) {
						html += '<div class="tileRedTextBar">ON NOW</div>';
					} else if (data.progStartDate <= (now + 5 * 3600)) { // starts in next 5 hours
						html += '<div class="tileBlackTextBar">' + data.progStartDateText + '</div>';
					}
				} else if (data.tileTagLine !== undefined && data.tileTagLine && data.title !== data.tileTagLine) {
					html += '<div class="tileRedTextBar">' + data.tileTagLine + '</div>';
				}
			}
			html += '<div class="toTheLeft">';
				if (data.isCollection === true) {
					html += '  <span class="badge collection"></span>';
				}
			html += '</div>';
		html += '</div>';

		html += '<div class="tileIcons">';
			if (data.iscc === true/* && _mediaPlayer.areSubtitlesEnabled()*/) {
				html += '<div class="tileCC cc">cc</div>';
			}
			if (data.iscanPlay === true) {
				html += '<div class="tileCanPlay canPlay"></div>';
			}
			if (data.isCounter === true) {
				html += '<div class="tileCounter counter">' + data.iscounter + '</div>';
			}
			if (data.isRecord === true) {
				html += '<div class="tileRecord record">R</div>';
			}
			if (data.isRadio === true) {
				html += '<div class="tileRadio radio"></div>';
			}
			if (dataReady && data.isCollection === true) { // already has an icon above
				html += '<div class="tileCollection collection"></div>';
			}
			if (data.isDownloading === true) {
				html += '<div class="tileDownloading downloading spinner"></div>';
			}
			if (data.isPaused === true) {
				html += '<div class="tilePaused paused"></div>';
			}
			if (data.isSeriesLink === true) {
				html += '<div class="tileSeriesLink seriesLink"></div>';
			}
			if (data.isKeep === true) {
				html += '<div class="tileKeep keep">K</div>';
			}
			if (data.isPlus30 === true) {
				html += '<div class="tilePlus30 plus30">+30</div>';
			}
			if (data.isReminder === true)  	 {
				html += '<div class="tileReminder reminder"></div>';
			}
			if (data.isRollUp === true) {
				html += '<div class="tileRollUp rollUp"></div>';
			}
		html += '</div>';

		html += '<div class="tileDarkOverlay"></div>';

/*
		if (data.error instanceof Array && data.error.length > 0 && !data.noErrorText) {
			error = _generateErrorMessage(data.error);
			html += '<div class="tileErrorText">';
				html += '<div class="tileErrorTitle">' + (error.title || '') + '</div>';
				html += '<div class="tileErrorDesc">' + (error.message || '') + '</div>';
			html += '</div>';
		}
*/
		this.innerHTML = html;
	}
});

/**
 * @method _onSelect
 * @public
 */
app.gui.controls.TileMosaicTileListItem.prototype._onSelect = function _onSelect() {
	this.logEntry();
	this.classList.add("focused");
	this.logExit();
};

/**
 * @method _onDeselect
 */
app.gui.controls.TileMosaicTileListItem.prototype._onDeselect = function _onDeselect() {
	this.logEntry();
	this.classList.remove("focused");
	this.logExit();
};

