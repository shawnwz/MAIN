"use strict";

$service.Map = (function Map () {

	/*
		mapped.actors =
		mapped.aspect =
		mapped.audioMode =
		mapped.categories =
		mapped.channel =
		mapped.channelName =
		mapped.channelTag =
		mapped.contentType =
		mapped.contentWarning =
		mapped.contentWarningText =
		mapped.countries =
		mapped.definition =
		mapped.description =
		mapped.directors =
		mapped.displayPriority =
		mapped.dispSEpNum =
		mapped.duration =
		mapped.editorialId =
		mapped.episodeNumber =
		mapped.episodeTitle =
		mapped.eventId =
		mapped.genre =
		mapped.id =
		mapped.isCatchUp =
		mapped.isClosedCaptioned =
		mapped.isDolby =
		mapped.isHD =
		mapped.isWidescreen =
		mapped.isInFuture =
		mapped.isMovie =
		mapped.isOnNow =
		mapped.isReverse =
		mapped.isStartOver =
		mapped.isSubtitled =
		mapped.isYesterday =
		mapped.isToday =
		mapped.isTomorrow =
		mapped.language =
		mapped.mainContentRef =
		mapped.multipleVersions =
		mapped.price =
		mapped.progEndDate =
		mapped.progEndDateText =
		mapped.programId =
		mapped.programTimes =
		mapped.progress =
		mapped.progStartDate =
		mapped.progStartDateText =
		mapped.promo =
		mapped.rating =
		mapped.ratingImage =
		mapped.seasonNumber =
		mapped.seriesRef =
		mapped.sortTitle =
		mapped.subTitles =
		mapped.synopsis =
		mapped.technicalId =
		mapped.tileTagLine =
		mapped.tileText =
		mapped.title =
		mapped.titleText =
		mapped.trailerId =
		mapped.type =
		mapped.year =
	*/

	/**
	 * @method _getTitleText
	 */
	function _getTitleText (mapped) {
		var title;
		
		if (mapped.progStartDate && mapped.progEndDate) {
			
			var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
				startTime = new Date(parseInt(mapped.progStartDate, 10)),
				day = startTime.getDate().toString(),
				month = monthNames[startTime.getMonth()];

			if (day === '1' || day === '21' || day === '31') {
				day += 'st ';
			} else if (day === '2' || day === '22') {
				day += 'nd ';
			} else if (day === '3' || day === '23') {
				day += 'rd ';
			} else {
				day += 'th ';
			}
			
			if (mapped.isOnNow === true) {
				title = 'On Now: ';
			} else if ($util.DateTime.isToday(mapped.progStartDate)) {
				title = 'Today: ';
			} else {
				title = day + month + ', ';
			}

			title += $util.DateTime.timeText(mapped.progStartDate) + ' - ' + $util.DateTime.timeText(mapped.progEndDate);

		} else if (mapped.price) { // have no times but have a price: PPV
			title = "Pay Per View";
		} else {
			title = "";
		}
		return title;
	}

  function _getDispSEpNum (value) {
    return (
      ((typeof value === 'string') && (value.toLowerCase() === 'true')) ||
      ((typeof value === 'boolean') && (value === true)) ||
      ((typeof value === 'undefined')) // assume yes
    );
  }

	/**
	 * This function takes some raw data and
	 * attempts to work out the 'destiny' of
	 * the tile. i.e. what kind of tile will
	 * it turn out to be.
	 *
	 * @method identifyTileType
	 * @param  {Object} mapped The raw data to be identified.
	 * @return {String}      A tile type, if a type can't be identified it will default to a 'standard' tile.
	 */
  function _getTileType (mapped) {
		
		if (mapped.tileType) { // already done
			return mapped.tileType;
		}
		
		if (mapped.source && mapped.contentType) {
			if (mapped.source === $service.MDS.sourceName) {
				return (mapped.contentType === 'MOVIE') ? "tall" : "standard";
			} else if (mapped.source === $service.DISCO.sourceName) {
				return (mapped.contentType === 'MOVIE') ? "tall" : "standard";
			}
		}

		// collection tile
		if (mapped.isCollection === true) {

			if (mapped.promoType === 'square') {
				return "promo";
			} else if (false) { // technicals[0].products[0].voditems[0].CUST_UsePromoSquareImage
				return "promo";
			} else {
				return (mapped.promo && mapped.promoType === 'promoPoster') ? "tall" : "standard";
			}
		}

		if (mapped.nodeLayoutInfo === "EPG_CHANNEL_PAGE_LAYOUT") { //@hdk to check!
			return "square";
		}

		if (false && mapped.source) { //@hdk TODO
			if (mapped.source === "rented") {
				return ("asset.ContentType" === 'MOVIE') ? "tall" : "standard";
			} else if (mapped.source === "recorded") {
				return ("customFields.Category" === 'MOVIE') ? "tall" : "standard";
			} else if (mapped.source === "scheduled") {
				return ("customFields.Category" === 'MOVIE') ? "tall" : "standard";
			}
		}

		return "standard";
	}

	function _getParentalRating (rating) {
		var _ratingsType = [ "none", "ratingPG", "ratingM", "ratingMA", "ratingAV", "ratingR" ],
			i = 0;

		if (rating) {
			for (i = 0; i < _ratingsType.length; i++) {
				if (_ratingsType[i].toLowerCase() === rating.toString().toLowerCase()) {
					return i;
				}
			}
		}
		
		return -1;
		}
		
	function isBlocked (programRating, savedRating) {
		var _ratingsTransLookup = {
				"g"     : "ratingPG",
				"pg"    : "ratingPG",
				"pg/pgr": "ratingPG",
				"m"     : "ratingM",
				"ma"    : "ratingMA",
				"ma15+" : "ratingMA",
				"av"    : "ratingAV",
				"r"     : "ratingR"
			},
			_itemRatingIndex,
			_savedRatingIndex;

		if (programRating === undefined) {
			return false;
		}

		//_itemRatingIndex = _getParentalRating(_ratingsTransLookup[programRating.toString().toLowerCase()]);
		_itemRatingIndex = _getParentalRating(_ratingsTransLookup[programRating.toString().toLowerCase()] || "none");
		_savedRatingIndex = _getParentalRating(savedRating);

		if (_itemRatingIndex >= _savedRatingIndex) {
			return true;
		}
		
		return false;
	}
	
	/**
	 * @method getGenericMapped
	 */
	function getGenericMapped(mapped) {

		var now = new Date().getTime(), // times are in milliseconds here!
			_arrReplace = function (src, dest) {
				if (typeof src === 'string') {
					src = src.split(' ');
				}
				if (src) {
					var res = [];
					for (var i = 0; src && i < src.length; i++) {
						res[i] = dest[src[i]];
					}
					return (res.length > 0 ? res : src).join(', ');
				} else {
					return "no content warning";
				}
			},
			_contentWarningLookup = {
				"a" :  "Adult Themes",
				"d" :  "Drug Use",
				"h" :  "Horror",
				"l" :  "Coarse Language",
				"m" :  "Medical",
				"n" :  "Nudity",
				"o" :  "Other",
				"s" :  "Sex",
				"t" :  "Themes",
				"v" :  "Violence",
				"w" :  "War Footage",
				"st":  "Supernatural Themes",
				"ab":  "Animal Butchery"
		},
		_ratingsLookup = {
				"g"     : "rating-g.png",
				"pg"    : "rating-pg.png",
				"pg/pgr": "rating-pg.png",
				"m"     : "rating-m.png",
				"ma"    : "rating-ma.png",
				"ma15+" : "rating-ma.png",
				"av"    : "rating-av.png",
				"r"     : "rating-r.png"
			},
			_tileSizes = {
				"link"    : { "width": 273, "height": 153, "perColumn": 2  },
				"promo"   : { "width": 315, "height": 315, "perColumn": 1  },
				"square"  : { "width": 153, "height": 153, "perColumn": 2  },
				"standard": { "width": 273, "height": 153, "perColumn": 2  },
				"tall"    : { "width": 212, "height": 315, "perColumn": 1  }
			},
			channel = o5.platform.btv.EPG.getChannelByServiceURI("tv://channel." + mapped.channelTag),
			_pinRequiredRating = $config.getConfigValue("settings.viewrestrictions.pin.entry.for.classified.program");
			//_hideInfoRating = $config.getConfigValue("settings.viewrestrictions.hide.info.posters.for.classified.program");

		// make sure we have these legacy duplicates //@hdk to remove later??
		mapped.channel = mapped.channel || mapped.channelTag;
		mapped.progEndDate = mapped.progEndDate || mapped.endTime;
		mapped.progStartDate = mapped.progStartDate || mapped.startTime;
		mapped.endTime = mapped.endTime || mapped.progEndDate;
		mapped.startTime = mapped.startTime || mapped.progStartDate;
		mapped.rating = mapped.rating || mapped.parentalRating;
		mapped.description = mapped.description || mapped.shortDesc;
		mapped.synopsis = mapped.synopsis || mapped.longDesc;

		// make sure these are arrays
		mapped.actors = (typeof mapped.actors === "string") ? mapped.actors.split("|") : mapped.actors;
		mapped.categories = (typeof mapped.categories === "string") ? mapped.categories.split("|") : mapped.categories;
		mapped.contentWarning = (typeof mapped.contentWarning === "string") ? mapped.contentWarning.split("|") : mapped.contentWarning;
		mapped.countries = (typeof mapped.countries === "string") ? mapped.countries.split("|") : mapped.countries;
		mapped.directors = (typeof mapped.directors === "string") ? mapped.directors.split("|") : mapped.directors;
		mapped.multipleVersions = (typeof mapped.multipleVersions === "string") ? mapped.multipleVersions.split("|") : mapped.multipleVersions;
		mapped.programTimes = (typeof mapped.programTimes === "string") ? mapped.programTimes.split("|") : mapped.programTimes;
		
		// make sure these booleans
		mapped.isCatchUp = (mapped.isCatchUp === 1 || mapped.isCatchUp === true);
		mapped.isStartOver = (mapped.isStartOver === 1 || mapped.isStartOver === true);
		
		if (typeof mapped.source === 'string' && mapped.source.startsWith("PC:")) { // from Persistance Cache
			mapped.source.replace("PC:", "");
		} else if ($service.MDS.useDummyData) {
			mapped.title = "*" + mapped.title;
			mapped.episodeTitle = "*" + mapped.episodeTitle;
			mapped.synopsis = "*" + mapped.synopsis;
			mapped.description = "*" + mapped.description;
		}

		mapped.isDolby = (mapped.audioMode && mapped.audioMode.toUpperCase().trim() === 'SURROUND');
		mapped.isHD = (mapped.definition && mapped.definition.toUpperCase().trim() === 'HD');
		mapped.isWidescreen = (mapped.aspect && mapped.aspect.toUpperCase().trim() === 'WIDESCREEN');
		mapped.isSubtitled = (mapped.subTitles !== undefined);
		mapped.isClosedCaptioned = mapped.subTitles && (mapped.subTitles.indexOf('-HearingImpaired') !== -1);
		mapped.isMovie = (mapped.contentType && mapped.contentType.toUpperCase().trim() === "MOVIE");
		mapped.isCollection = (mapped.nodeLayoutInfo === "EPG_COLLECTION_NODE");
		mapped.isApplication = (mapped.nodeLayoutInfo === "MENU_APPS" || mapped.nodeLayoutInfo === "EPG_APPS_16x9"); // node or asset level
		mapped.isRadio = (channel && channel.type === $util.constants.CHANNEL_TYPE.RADIO);

		//@hdk TODO check for adult filter on some texts and override them
		
		mapped.dispSEpNum = _getDispSEpNum(mapped.dispSEpNum);

		if (!mapped.editorialId) {
			mapped.editorialId = mapped.mainContentRef;
		}

		if (mapped.progStartDate && mapped.progEndDate) {

			mapped.isOnNow = (mapped.progStartDate && mapped.progEndDate && mapped.progStartDate <= now && mapped.progEndDate > now);
			mapped.isInFuture = (mapped.progStartDate && mapped.progStartDate > now);
			mapped.isYesterday = $util.DateTime.isYesterday(mapped.progStartDate);
			mapped.isToday = $util.DateTime.isToday(mapped.progStartDate);
			mapped.isTomorrow = $util.DateTime.isTomorrow(mapped.progStartDate);
			mapped.isReverse = (mapped.progEndDate < now);

			if (!mapped.duration/* || isNaN(mapped.duration)*/) {
				mapped.duration = (mapped.progEndDate - mapped.progStartDate);
			}
			if (mapped.isOnNow === true) {
				// dont use duration here, we might not have it
				mapped.progress = Math.floor((100 * (now - mapped.progStartDate)) / (mapped.progEndDate - mapped.progStartDate));
			}

			mapped.progStartDateText = $util.DateTime.timeText(mapped.progStartDate);
			mapped.progEndDateText = $util.DateTime.timeText(mapped.progEndDate);
		}

		if (mapped.contentWarning) {
			mapped.contentWarningText = _arrReplace(mapped.contentWarning, _contentWarningLookup);
		} else {
			mapped.contentWarningText = "";
		}

		if (mapped.rating) {
			mapped.ratingImage = _ratingsLookup[mapped.rating.toString().toLowerCase()];
			mapped.ratingBlocked = isBlocked(mapped.rating, _pinRequiredRating);
		}

		mapped.titleText = _getTitleText(mapped);
	 	mapped.tileType = _getTileType(mapped);
	 	mapped.tileSize = _tileSizes[mapped.tileType] ? _tileSizes[mapped.tileType] : _tileSizes.standard;

	 	if (mapped.accessible === undefined) {
	 		mapped.accessible = true;
	 	}

		return mapped;
	}

	/**
	 * @method init
	 */
	function init () {
	}

	return {
		init   : init,
		generic: getGenericMapped
	};
}());

