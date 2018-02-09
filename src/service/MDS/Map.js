"use strict";

$service.MDS.Map = (function Map () {

	/**
	 * @method _getEditorialGenre
	 */
	function _getEditorialGenre (asset) {

		// foxtelUIAPIsUtil.getGenrefromDVBCategories(technical.DvbCategories[0]);

		var genre = (asset.Categories && asset.Categories.length) ? asset.Categories[0] : "",
			genreSplit;

		if (genre) {
			genreSplit = genre.split(" - ");
			genre = genreSplit[1];
		}
		return genre;
	}


	/**
	 * @method _getChannelName
	 */
	function _getEditorialChannelName (asset) {
		var technical = (asset.technicals && asset.technicals.length) ? asset.technicals[0] : undefined,
			channelTag = (technical && technical.ServiceLongName) ? technical.ServiceLongName : undefined,
			channel;

		if (channelTag && channelTag !== "TVOD") {
			channel = $service.MDS.Channel.getForChannelId(channelTag);
		}
		return channel ? channel.serviceName : _getEditorialGenre(asset);
	}


	/**
	 * @method _getImageUrl
	 */
	function _getEditorialImageUrl (asset) {
		var isMovie = (asset.ContentType === "MOVIE"),
			findImage = function findImage (elt, i, array) {
				if (!isMovie && elt.technicals[0].ImageType === "landscape") {
					return elt.technicals[0].media.Image_Basic.fileName;
				} else if (isMovie && elt.technicals[0].ImageType === "poster") {
					return elt.technicals[0].media.Image_Basic.fileName;
				}
			},
			imageServer = $config.getConfigValue("network.server.publicAccessPoint"),
			fileName = (asset.Images && asset.Images.length) ? asset.Images.map(findImage) : undefined,
			sizeRestriction = (isMovie) ? "?h=321" : "?w=273";

		if (!fileName) {
			//fileName = [(isMovie) ? "store2/mount1/17/placeholder-2x3-beam.png" : "store2/mount1/17/placeholder-16x9-beam.png"];
		}
		return (fileName) ? imageServer + fileName.join("") + sizeRestriction : null;
	}


	/**
	 * @method _getMultipleVersions
	 */
	function _getMultipleVersions (multipleVersions) {

		var mv = [],
			i;

		if (multipleVersions) { // collect other multiple versions
			for (i in multipleVersions) {
				if (multipleVersions[i].products &&
						multipleVersions[i].products.length > 0 &&
						multipleVersions[i].products[0].price.value !== 0) {
					mv.push({
						"definition": multipleVersions[i].Definition,
						"price"     : multipleVersions[i].products[0].price.value.toFixed(2)
					});
				}
			}
		}
		return mv;
	}

	/**
	 * @method getChannelMap
	 */
	function getChannelMap (item) {
		var mapped = {};

		mapped.source = $service.MDS.sourceName;

		mapped.id = item.technical.id;
		mapped.logicalChannelNum = item.technical.tvChannel; // logic for local number here later

		mapped.deliveryMethod = o5.data.EPGService.DELIVERY_TYPE.IP;
		mapped.serviceName = item.editorial.Title;
		mapped.serviceLongName = item.technical.longName;
		mapped.serviceShortName = item.technical.shortName;

		// mapped.isSubscribed = item.isSubscribed;
		// mapped.casId = item.naspCA;
		// mapped.access = item.access;

		mapped.parentalRating = item.editorial.Rating.code || null;
		mapped.locale = item.locale || null;
		mapped.startOverSupport = item.technical.startOverSupport || false;
		mapped.catchUpSupport = item.technical.catchUpSupport || false;

		mapped.mainChannelId = item.technical.mainChannelId;

		//@hdk give it a temp url
		//mapped.NetworkLocation = testSOList[i%len];  //@hdk See channel.js for this array
		//mapped.NetworkLocation = item.technical.NetworkLocation; //@hdk should we use this one??
		mapped.NetworkLocation = "tv://channel." + mapped.mainChannelId;

		var tempChanInfo = $service.EPG.lcnTagMapper.list[mapped.logicalChannelNum];

		if (tempChanInfo) {
			mapped.logo = tempChanInfo.logo;
			mapped.genres = tempChanInfo.genres;
		}

		// must haves for CCOM.EPG database
		mapped.serviceId = mapped.source + ":" + mapped.id;
		mapped.uri = mapped.NetworkLocation;

		// optionals for CCOM.EPG database
		mapped.type = item.technical.type === "BTV" ? 1 : 2; //@hdk Find actual type
		mapped.name = mapped.serviceName;
		mapped.channelKey = mapped.logicalChannelNum;

		return mapped; // edit$service.Map.generic(mapped);
	}

	/**
	 * @method getNodeMap
	 */
	function getNodeMap (item) {

		var mapped = {},
			imageServer = $config.getConfigValue("network.server.publicAccessPoint"),
			promoImage;

		mapped.source = $service.MDS.sourceName;

		mapped.id = item.id;
		mapped.displayName = item.Title;
		mapped.title = item.Title;
		mapped.parent = item.parent;
		mapped.children = item.children;
		mapped.recommendationQuery = item.RecommendationQuery;
		mapped.nodeLayoutInfo = item.NodeLayoutInfo;
		mapped.sortCriteria = item.CUST_SortCriteria;
		mapped.nodeOrder = item.nodeOrder;

		mapped._assets = [];
		mapped._collections = [];
		mapped._parentNode = null;
		mapped._subNodes = [];
		mapped._subNodesNb = 0;
		mapped._attached = false;

		mapped.isScrubbed = false;
		mapped.isNotEntitled = false;

		try { // try to map it back to MDS
			promoImage = JSON.parse(item.PromoImages[0]);
		} catch (e) {
			if (item.PromoImages && item.PromoImages[0].length && typeof item.PromoImages[0] === 'string') {
				// assume it is just a file (most likely an App node?
				promoImage = { file: item.PromoImages[0], type: "standard" };
			} else {
				// use the default
				promoImage = { file: "store2/mount1/17/placeholder-16x9-beam.png", type: "standard" };
			}
		}

		mapped.promo = imageServer + promoImage.file + "?w=273";
		mapped.promoType = promoImage.type;

		return $service.Map.generic(mapped);
	}

	/**
	 * @method getProgrammeMap
	 */
	function getEventMap (item) {

		var mapped = {},
			editorial = (item.editorial) ? item.editorial : undefined;

		// TODO: which to take from programme and which from the technical?
		// TODO: could we just call getEditorialMap()?

		mapped.source = $service.MDS.sourceName;

		mapped.actors = item.Actors;
		mapped.aspect = item.Aspect;
		mapped.audioMode = item.AudioMode;
		mapped.categories = item.Categories;
		mapped.channel = item.serviceRef;
//		mapped.channelName =
		mapped.channelTag = item.serviceRef;
		mapped.contentType = item.ContentType;
		mapped.contentWarning = item.ContentWarning;
		mapped.countries = item.Countries;
		mapped.definition = item.Definition;
		mapped.description = item.Description;
		mapped.directors = item.Directors;
//		mapped.displayPriority =
		mapped.dispSEpNum = item.CUST_DispSEpNum;
		mapped.duration = (item.period && item.period.duration) ? item.period.duration : undefined;
		mapped.editorialId = item.id;
		mapped.origEventId = item.eventId;
		mapped.genre = _getEditorialGenre(item);
		mapped.id = item.id;
		mapped.isCatchUp = item.isCatchUp;
		mapped.isStartOver = item.isStartOver;
		mapped.language = item.Language;
		mapped.mainContentRef = item.contentRef; // overwritten if there is a technical
		mapped.multipleVersions = []; // overwritten if there is a technical
//		mapped.price =
		mapped.progEndDate = (item.period && item.period.end) ? item.period.end * 1000 : undefined;
		mapped.programId = item.id;
		mapped.programTimes = [];
		mapped.progStartDate = (item.period && item.period.start) ? item.period.start * 1000 : undefined;
//		mapped.promo =
		mapped.rating = (item.Rating && item.Rating.code) ? item.Rating.code : "NC";
		mapped.sortTitle = item.CUST_SortTitle;
		mapped.subTitles = (item.Subtitles && item.Subtitles.length > 0) ? item.Subtitles[0] : undefined;
		mapped.synopsis = item.Synopsis;
//		mapped.tileTagLine =
//		mapped.tileText =
		mapped.title = item.Title;
		mapped.displayName = item.Title;
//		mapped.trailerId =
//		mapped.type =
		mapped.year = item.Year;

		if (editorial) {
			var technical = (editorial.technicals && editorial.technicals.length > 0) ? editorial.technicals[0] : undefined;

			mapped.episodeNumber = editorial.episodeNumber;
			mapped.episodeTitle = editorial.Episode;
			mapped.seasonNumber = editorial.CUST_SeasonNumber;
			mapped.seriesRef = editorial.seriesRef;

			if (technical) {
				mapped.mainContentRef = technical.mainContentRef;
				mapped.technicalId = technical.id;
				mapped.definition = technical.Definition;
				
				mapped.multipleVersions = _getMultipleVersions(editorial.technicals);
			}
		}

		// must haves for CCOM.EPG database
		mapped.startTime = mapped.progStartDate;
		mapped.endTime   = mapped.progEndDate;
		mapped.serviceId = mapped.source + ":" + mapped.channelTag;
		mapped.eventId   = mapped.serviceId + ":" + mapped.origEventId;

		// optionals for CCOM.EPG database
		mapped.parentalRating = mapped.rating;
		mapped.title = mapped.title;
		mapped.shortDesc = mapped.description;
		mapped.longDesc = mapped.synopsis;

		return $service.Map.generic(mapped);
	}

	/**
	 * @method getEditorialMap
	 */
	function getEditorialMap (item) {
		var mapped = {},
			now = Math.floor((new Date().getTime()) / 1000), // times are in seconds here
			technical = (item.technicals && item.technicals.length > 0) ? item.technicals[0] : undefined,
			programmes = (item.programmes && item.programmes.length > 0) ? item.programmes : undefined;

		mapped.source = $service.MDS.sourceName;

		mapped.id = item.id;
		mapped.editorialId = item.id;
		mapped.programId = item.id;

		// these will be overwritten if they are in the technical
		mapped.contentType = item.ContentType;
		mapped.rating = (item.Rating && item.Rating.code) ? item.Rating.code : "NC";
		mapped.seriesRef = item.seriesRef;
		mapped.title = item.Title;
		mapped.displayName = item.Title;

		mapped.channelName = _getEditorialChannelName(item);
		mapped.genre = _getEditorialGenre(item);
		mapped.promo = _getEditorialImageUrl(item);

		if (technical) {
			var product = (technical.products && technical.products.length > 0) ? technical.products[0] : undefined,
				multipleVersions = (technical.multipleVersions && technical.multipleVersions.length > 0) ? technical.multipleVersions : undefined;

			// overwrite these items if they are in the technical
			mapped.contentType = technical.ContentType ? technical.ContentType : mapped.contentType;
			mapped.rating = technical.Rating && technical.Rating.code ? technical.Rating.code : mapped.rating;
			mapped.seriesRef = technical.seriesRef ? technical.seriesRef : mapped.seriesRef;
	    	mapped.title = technical.Title ? technical.Title : mapped.title;

			mapped.actors = technical.Actors;
			mapped.aspect = technical.Aspect;
			mapped.audioMode = technical.AudioMode;
	    	mapped.categories = technical.Categories;
			mapped.channel = technical.ServiceLongName; // channelTag
	    	mapped.channelTag = technical.ServiceLongName;
			mapped.contentWarning = technical.ContentWarning;
			mapped.countries = technical.Countries;
			mapped.definition = technical.Definition;
			mapped.description = technical.Description;
	    	mapped.directors = technical.Directors;
			mapped.dispSEpNum = technical.CUST_DispSEpNum;
			mapped.duration = technical.duration;
			mapped.episodeNumber = technical.episodeNumber;
			mapped.episodeTitle = technical.Episode ? technical.Episode : technical.Title;
			mapped.language = technical.Language;
			mapped.mainContentRef = technical.mainContentRef;
			mapped.progEndDate = technical.progEndDate;
			mapped.progStartDate = technical.ProgrammeStartDate;
			mapped.seasonNumber = technical.CUST_SeasonNumber;
			mapped.sortTitle = technical.CUST_SortTitle;
			mapped.subTitles = technical.Subtitles;
			mapped.synopsis = technical.Synopsis;
			mapped.technicalId = technical.id;
	    	mapped.year = technical.Year;

			mapped.multipleVersions = _getMultipleVersions(multipleVersions);

			if (product) {
				var voditem = (product.voditems && product.voditems.length > 0) ? product.voditems[0] : undefined;

				mapped.price = (product.price && product.price.value) ? product.price.value : undefined;
				mapped.type = product.type;

				if (voditem) {
					mapped.displayPriority = voditem.DisplayPriority;
					mapped.tileTagLine = voditem.CUST_TileTagLine;
					mapped.tileText = voditem.CUST_TileText;
					mapped.trailerId = voditem.contentRef;
					mapped.isMainEvent = (voditem.PrivateMetadata !== undefined); // && (assetType === $mlc.ASSET_TYPE_BTV); // main item if a private metadata value exists
				}
			}
		}

		// collect other programme times TODO: just future?
		mapped.programTimes = [];

		if (programmes) {
			for (var i = 0, len = programmes.length; i < len; i++) {
				mapped.programTimes.push({
					"progStartDate": programmes[i].period.start * 1000,
					"progEndDate"  : programmes[i].period.end * 1000,
					"channelTag"   : programmes[i].serviceRef,
					"isCatchUp"    : programmes[i].isCatchUp,
					"isStartOver"  : programmes[i].isStartOver
				});
				// if we have no times yet: find the one which shows first (or is ongoing now)
				if (!mapped.progStartDate && !mapped.progEndDate) {
					if (programmes[i].period.start > now || // in the future ...
							programmes[i].period.end > now) { // ... or on now
						mapped.progStartDate = programmes[i].period.start * 1000;
						mapped.progEndDate = programmes[i].period.end * 1000;
					}
				}
			}
		}

// if (false) { // apps item: function(item, i) { Line 83201 App.js
// 		mapped.index = i;
// 		mapped.title = mapped.title;
// 		mapped.image = isRatingBlocked ? $search.getDefaultImage(item) : item.image;
// 		mapped.counter = 0;
// 		mapped.data = item;
// 		mapped.isScrubbed = (title === '');  // don't display gradient if no text on tile
// }
		mapped.isScrubbed = false;
		mapped.isNotEntitled = false;

// if (false) { // see sdp: function(item, ix) Line 82925 App.js
// 		imageBlocked = $service.Map.isBlocked({rating: ratingName, type: 'name' , ratingType: "ADULT"});

// 		mapped.index = ix;
// 		mapped.title = imageBlocked ? "Filtered Event" : mapped.title;
// 		mapped.subtitle = imageBlocked ? "Filtered" : subtitle;
// 		mapped.subtitle2 = imageBlocked ? "" : subtitle2;
// 		mapped.eventRatingBesideSubTitle2 = (subtitle2 && ratingTitle) ? ratingTitle : '';
// 		mapped.rating = ratingName;
// 		mapped.image = imageBlocked ? $search.getDefaultImage(orientation) : (typeof item.image === 'undefined' ? $mlc.getImageFromAsset(item) : item.image);
// 		mapped.fallback = ''; //no fallback is okay for sdp (apparently)
// 		mapped.counter = 0; //only rollups show numbers, it seems
// 		mapped.data = item;
// 		mapped.isNotEntitled = (channel) ? !_obj.get(channel, 'isEntitled', false) : false;
// 		mapped.isUserBlocked = (ratingName && $service.Map.isBlocked({ rating: ratingName, type: 'name' }));
// 		mapped.isRadio = false;
// 		mapped.isKeep = false;
// 		mapped.isError = false;
// 		mapped.isRollUp = false;
// 		mapped.isSeriesLink = false;
// 		mapped.isReminder = false;
// 		mapped.isCc = /-HearingImpaired/.test(_obj.get(item, "technicals.Subtitles", ""));
// 		mapped.isCanPlay = productType && assetType !== $mlc.ASSET_TYPE_BTV && !isMainEvent ? true : false; // show play icon if we have a product
// 		mapped.isRecord = false;
// 		mapped.isPlus30 = false;
// 		mapped.isPaused = false;
// 		mapped.isDownloading = false;
// 		mapped.isScrubbed = (title === '' && subtitle === '' && subtitle2 === '');
// 		mapped.badgesPromotionalText = CUST_TileTagLine;
// 		mapped.badgesBroadcastText = '';
// 		mapped.badgesPurchasedText = purchasedText;
// 		mapped.badgesEventText = isPPV ? "RENTAL" : (isMainEvent ? "MAIN EVENT" : "");
// 		mapped.badgesEventClassification = ((isPPV || isMainEvent) && ratingTitle) ? ratingTitle : '';
// }
		return $service.Map.generic(mapped);
	}


	/**
	 * @method init
	 */
	function init () {
	}

	return {
		init     : init,
		editorial: getEditorialMap,
		event    : getEventMap,
		programme: getEventMap,
		node     : getNodeMap,
		channel  : getChannelMap
	};
}());

