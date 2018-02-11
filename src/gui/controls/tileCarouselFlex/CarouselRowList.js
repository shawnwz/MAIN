/**
 * @class app.gui.controls.CarouselRowList
 */

app.gui.controls.CarouselRowList = function CarouselRowList () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.CarouselRowList, app.gui.controls.HtmlFlexList);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.CarouselRowList.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();

    this.animate = true;
    this.orientation = "Horizontal";
    this._wrapped = true; // can be reset in populate if not a lot of items

    this.itemTemplate = "app-carousel-row-list-item";

    var parent = this.parentElement;
    if (parent) {
        this.id = "carouselListRow" + parent.dataset.index;
    }
    this._listElem.classList.add("carouselListRow-List");
    this._focusWindow.classList.add("carouselListRow-ListFocus");

    //this._text = this.querySelector('.text');

    this.logExit();
};

/**
 * @method _populate
 * @public
 */
app.gui.controls.CarouselRowList.prototype._populate = function _populate (assets, index) {
    this.logEntry();
    var wrapCount = (assets[0].contentType === "MOVIE" ? 8 : 6),
        isManageTeamLink = false,
        isSeeAll = $config.getConfigValue("settings.tv.guide.see.all"), // No this configuration now
        isWithTextCarousel = isManageTeamLink || isSeeAll, // Manage Team Link or See All
        endOfCarouselIndicatorUrl = "./images/common/" + (assets[0].contentType === "MOVIE" ? "EndOfCarousel-Portrait.png" : "EndOfCarousel-Landscape.png"),
        endOfCarouselIndicatorAsset = {};

    // populate the tiles in each row
    this._wrapped = (assets.length > wrapCount);

    if (this._wrapped && !isWithTextCarousel && !assets[assets.length - 1].isEndOfCarouselIndicator) {
        endOfCarouselIndicatorAsset.isEndOfCarouselIndicator = true;
        endOfCarouselIndicatorAsset.promo = endOfCarouselIndicatorUrl;
        assets.push(endOfCarouselIndicatorAsset);
    }
    this.superCall(assets, index || (this._selectedItem ? this._selectedItem.itemIndex : index));

    this.logExit();
};


/**
 * @class app.gui.controls.CarouselRowListItem
 */

app.gui.controls.CarouselRowListItem = function CarouselRowListItem () {};
o5.gui.controls.Control.registerAppControl(app.gui.controls.CarouselRowListItem, app.gui.controls.HtmlListItem);

/**
 * @method createdCallback
 * @private
 */
app.gui.controls.CarouselRowListItem.prototype.createdCallback = function createdCallback () {
    this.logEntry();
    this.superCall();
    var tmpl = document.getElementById("carouselCellTemplate");
    this.appendChild(tmpl.content.cloneNode(true));

    this.className = "tile";

    this.logExit();
};


/**
 * @method onSelect
 */
app.gui.controls.CarouselRowListItem.prototype._onSelect = function _onSelect () {
    this.logEntry();
    var that,
        carouselListItem = null,
        carouselListItemSelected = null,
        viewWindow = null,
        viewWindowActive = null,
        componentMenu = null,
        component = null;

    this.superCall();

    that = this;
    carouselListItem = that;
    viewWindow = that;
    while ((viewWindow = viewWindow.parentElement) && (viewWindow.nodeName !== 'O5-VIEW-WINDOW')) {
        //
    }
    if (viewWindow && viewWindow.childElementCount === 1) {
        viewWindowActive = Array.prototype.slice.call(viewWindow.children[0].attributes).find(function(item) {
                //console.log(item.name + ': '+ item.value);
                return (item.name === "active");
        });

        // only set footer to active view
        if (viewWindowActive) {
            while ((carouselListItem = carouselListItem.parentElement) && (carouselListItem.nodeName !== 'APP-CAROUSEL-LIST-ITEM')) {
                //
            }
            if (carouselListItem) {
                    carouselListItemSelected = Array.prototype.slice.call(carouselListItem.attributes).find(function(item) {
                        //console.log(item.name + ': '+ item.value);
                        return (item.name === "selected");
                    });

                    //only set the footer to seleted carousel
                    if (carouselListItemSelected) {
                            componentMenu = document.querySelector('#portalMenu');
                            component = (componentMenu && componentMenu.selectedItem) ? componentMenu.selectedItem.itemData : null;
                            if (component && component.displayName) {
                                $util.ControlEvents.fire("app-home:ctaHome", "fetch", { "component": component, "carousel": carouselListItem.itemData, "content": this.itemData });
                            }
                    }
            }
        }
    }

    this.logExit();
};

/**
 * @property channel
 * @public
 * @type {Object} channel
 */
Object.defineProperty(app.gui.controls.CarouselRowListItem.prototype, "itemData", {
    get: function get () {
        return this._data;
    },
    set: function set (data) {
        this._data = data;

        var html = "",
            imageNotAvailable = false,
            me = this,
            isLiner = false,
            title, subTitle, subTitle2, eventText, dateString, nowDate, next8Days0am, pashText, isEpisodic,
            getTimeoutFactor, internalCallback, updateProgressIndicator,
            dataNotReady = true;

        this._data = data;

        this.classList.add(data.tileType);

        if (data.isEndOfCarouselIndicator === true && data.promo && typeof data.promo === 'string') {
            this.style.backgroundImage = "url('" + data.promo + "')";
            this._emptyClass = "endOfCarousel-unavailable";
            this.classList.add(this._emptyClass);
            this.innerHTML = "";
            return;
        }

        if (data.isScrubbed === true) {
            this.classList.add('scrubbed');
        }
        if (data.isNotEntitled === true) {
            this.classList.add('notEntitled');
        }
        if (data.startTime && data.endTime) {
            isLiner = true; // ?
        }

        this.dataset.tileId = data.id;

        if (data.promo && typeof data.promo === 'string') {
            this.style.backgroundImage = "url('" + data.promo + "')";
            imageNotAvailable = data.promo.indexOf("placeholder") >= 0;
        } else {
            imageNotAvailable = true;
        }

        html += '<div class="tileShadow"></div>';
        html += '<div class="tileGradient"></div>';

        if (imageNotAvailable /*data.isScrubbed !== true*/) {
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

        if (imageNotAvailable) {
            if (isLiner) { //Liner
                html += '<div class="tileChannelName">';
                html += '<h1>' + data.channelName + '</h1></div>';
            } else { // on demand or store
                this.style.backgroundImage = "./images/common/NoImage-Landscape.png";
            }

        }
        html += '<div class="tileFocusedBar"></div>';

        html += '<div class="tileBadgeTextWrapper">'; //@hdk see _getTextAndBadgesHtml()
            html += '<div class="toTheLeft">';
                if (data.progStartDate && data.progEndDate) {

                    /*if (data.isOnNow === true) {
                        html += '<div class="tileRedTextBar">ON NOW</div>';
                    } else */
                    if (data.progStartDate > Date.now()) { // in future
                        nowDate = (new Date());
                        next8Days0am = (new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 8, 0, 0, 0));

                        if ($util.DateTime.isSameDay(data.progStartDate, Date.now())) { //same day - "3:30pm"
                            dateString = '<span class="lowercase">' + $util.DateTime.timeText(data.progStartDate) + '</span>';
                        } else if (data.progStartDate > Date.now() && data.progStartDate < next8Days0am) { //next 7 days - "Mon 10:30am"
                            dateString = $util.DateTime.weekDayTextShort(data.progStartDate) + ' <span class="lowercase">' + $util.DateTime.timeText(data.progStartDate) + '</span>';
                        } else { //after 7 days - "Mon 13 Apr"
                            dateString = $util.DateTime.dateTextShort(data.progStartDate);
                        }
                        html += '<div class="tileBlackTextBar">' + dateString + '</div>';
                    }
                } else if (data.pash !== undefined) { //not sure the pash data structure
                    pashText = null;
                    switch (data.pash) {
                        case "1":
                            pashText = $util.Translations.translate("pashText1");
                            break;
                        case "2":
                            pashText = $util.Translations.translate("pashText2");
                            break;
                        case "2a":
                            pashText = $util.Translations.translate("pashText2a");
                            break;
                        case "2b":
                            pashText = $util.Translations.translate("pashText2b");
                            break;
                        case "3":
                        case "3a":
                            pashText = $util.Translations.translate("pashText3a");
                            break;
                        case "3b":
                            pashText = $util.Translations.translate("pashText3b");
                            break;
                        default:
                            break;
                    }
                    html += '<div class="tileBlackTextBar">' + pashText + '</div>';
                }
            html += '</div>';
            html += '<div class="toTheRight">';

                /*
                if (data.iscc === true) { // if (data.iscc === true && _mediaPlayer.areSubtitlesEnabled()) {
                    html += '<div class="badge tileCC cc">cc</div>';
                }
                if (data.isCanPlay === true) {
                    html += '<div class="badge tileCanPlay canPlay"></div>';
                }
                if (data.isCounter === true) {
                    html += '<div class="badge tileCounter counter">' + data.iscounter + '</div>';
                }
                if (data.isRecord === true) {
                    html += '<div class="badge tileRecord record">R</div>';
                }
                if (data.isRadio === true) {
                    html += '<div class="badge tileRadio radio"></div>';
                }
                if (false && data.isCollection === true) { // already has an icon above
                    html += '<div class="badge tileCollection collection"></div>';
                }
                if (data.isDownloading === true) {
                    html += '<div class="badge tileDownloading downloading spinner"></div>';
                }
                if (data.isPaused === true) {
                    html += '<div class="badge tilePaused paused"></div>';
                }
                if (data.isSeriesLink === true) {
                    html += '<div class="badge tileSeriesLink seriesLink"></div>';
                }
                if (data.isKeep === true) {
                    html += '<div class="badge tileKeep keep">K</div>';
                }
                if (data.isPlus30 === true) {
                    html += '<div class="badge tilePlus30 plus30">+30</div>';
                }
                if (data.isReminder === true)    {
                    html += '<div class="badge tileReminder reminder"></div>';
                }
                if (data.isRollUp === true) {
                    html += '<div class="badge tileRollUp rollUp"></div>';
                }
                */
                if (data.isNotEntitled === true) {
                    html += '<div class="badge tileNotEntitled notEntitled"></div>';
                }

                /*
                if (data.seriesRef && data.isRecord === true) {
                    html += '<div class="badge tileSeriesLink seriesLink"></div>';
                }
                if (data.isRecord === true) {
                    html += '<div class="badge tileRecord isRecord"></div>';
                }*/
                if (data.isClosedCaptioned === true) {
                    html += '<div class="badge tileCC isCC"></div>';
                }

                /*
                if (data.isMainEvent === true && data.isRecord === true) {
                    html += '<div class="badge tileBooked isBooked"></div>';
                }*/
                if (data.isStoreToRent === true) {
                    html += '<div class="badge tileRent isRent"></div>';
                }
            html += '</div>';
        html += '</div>';

        html += '<div class="tileDarkOverlay"></div>';

		// show the progress indicator
        if (dataNotReady && data.isOnNow === true) { // if (data.isPlayable) { // data structure is not clear for the pragramme is playable or not
            html += '<div class="tileProgressIndicator">';
                html += '<div class="tileProgress">';
                    html += '<div class="tileBar" id=tileBar_' + data.id + '></div>';
                html += '</div>';
            html += '</div>';

            setTimeout(function () {
                var elem = document.getElementById('tileBar_' + me._data.id),
                    width = 0,
                    isContinueUpdate = true;

                if (!elem || !elem.style) {
                    return;
                }

                if (isLiner) {
                    updateProgressIndicator = function() {
                        var current = (new Date().getTime());
                        if (me._data.isOnNow && (current >= me._data.startTime) && (current < me._data.endTime)) {
                            width = ((current - me._data.startTime) / (me._data.endTime - me._data.startTime)) * 100;
                        } else if (current >= me._data.endTime) {
                            isContinueUpdate = false;
                            width = 100;
                        } else {
                            width = 0;
                        }
                        elem.style.width = width + '%';
                    };
                    updateProgressIndicator();
                    // want to use a different timeout: when the programme is on now, then update the indicator 5s (?)
                    // else if the programme is in furture, then update the indicator 5 minutes
                    getTimeoutFactor = function() {
                        var current = (new Date().getTime());
                        if ((current < me._data.startTime) && (me._data.startTime - current >= 5 * 60 * 1000)) {
                            return 5 * 60 * 1000;
                        }
                        return 5 * 1000;
                    };
                    internalCallback = function() {
                        if (isContinueUpdate === true) {
                            window.setTimeout(internalCallback, getTimeoutFactor());
                            updateProgressIndicator();
                        }
                    };
                    window.setTimeout(internalCallback, getTimeoutFactor());
                } else { // on demand
                    // another issue is that: if the homeMenu view if overlap by other views, such as video view (play the vod should use the video view)
                    // and when from the video view back to the homeMenu view, the progress indicator should updated
                    // this is not implemented
                    //var duration, watched;
                    //here we should get the duration and the watched time of the programme
                    //width = (watched / duration) * 100;
                    elem.style.width = width + '%';
                }
            }, 100);
        }

        html += '<div class="playIconWrapper"></div>';
        if (!isLiner && !data.isCollection) {
            isEpisodic = true; //not sure the requirement
            if (isEpisodic || data.isMovie) {
                this.classList.add("continueWatching");
            }
        }

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
