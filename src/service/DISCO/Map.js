"use strict";

$service.DISCO.Map = (function Map () {

    /**
     * @method _getEditorialDefinition
     */
    function _getEditorialDefinition(item) {
        var relevantSchedule = (item.relevantSchedules && item.relevantSchedules.length > 0) ? item.relevantSchedules[0] : undefined,
            keywords = (relevantSchedule && relevantSchedule.Keywords) ? relevantSchedule.Keywords : undefined,
            keyword = (keywords && keywords.Keyword && keywords.Keyword.length > 0) ? keywords.Keyword : undefined,
            definition,
            i;

// or service.videoFormat ?
        for (i in keyword) {
            if (keyword[i].KeyName === "HighDefinition") {
                definition = (keyword[i].content === "true") ? "HD" : "SD";
                break;
            }
        }
        return definition;
    }


    /**
     * @method _getEditorialActors
     */
    function _getEditorialActors (item) {
        var metadata = (item.metadata) ? item.metadata : undefined,
            cast = (metadata && metadata.cast && metadata.cast.length > 0) ? metadata.cast : undefined,
            actors = [],
            i;

        for (i in cast) {
            if (cast[i].role === "actor" && cast[i].name) {
                actors.push(cast[i].name);
            }
        }
        return (actors.length > 0) ? actors : undefined;
    }


    /**
     * @method _getEditorialDirectors
     */
    function _getEditorialDirectors (item) {
        var metadata = (item.metadata) ? item.metadata : undefined,
            cast = (metadata && metadata.cast && metadata.cast.length > 0) ? metadata.cast : undefined,
            directors = [],
            i;

        if (metadata && metadata.directors) { // try to get it from directors field
            directors.push(metadata.directors);
        }
        if (directors.length === 0) { // try to get it from cast array
            for (i in cast) {
                if (cast[i].role === "director" && cast[i].name) {
                    directors.push(cast[i].name);
                }
            }
        }
        return (directors.length > 0) ? directors : undefined;
    }


    /**
     * @method _getGenre
     */
    function _getGenre (item) {
        var metadata = (item.metadata) ? item.metadata : undefined,
            genre = (metadata && metadata.genreName) ? metadata.genreName : (metadata && metadata.subGenreName ? metadata.subGenreName : null);

        return genre;
    }


    /**
     * @method _getChannelName
     */
    function _getChannelName (item) {
        var technical = (item.relevantSchedules && item.relevantSchedules.length) ? item.relevantSchedules[0] : null,
            channelId = (technical && technical.channelTag) ? technical.channelTag : null,
            channel = null;

        if (channelId && channelId !== "TVOD") {
            channel = $service.MDS.Channel.getForChannelId(channelId);
        }
        // Currently we are mapping genre below when we have no channel
        return channel ? channel.serviceName : _getGenre(item);
    }

    /**
     * @method _getImageUrl
     */
    function _getImageUrl (item) {
        var isMovie = (item.metadata && item.metadata.contentType === "MOVIE"),
            imageServer = $config.getConfigValue("network.server.publicAccessPoint"),
            sizeRestriction = (!isMovie) ? "?w=273" : "?h=321",
            fileName,
            imageUrl = (!isMovie) ? imageServer + "store2/mount1/17/placeholder-16x9-beam.png?w=273" :
                                    imageServer + "store2/mount1/17/placeholder-2x3-beam.png?h=321";

        if (item.images) {
            fileName = (!isMovie) ? item.images.default.landscape[0].URI : item.images.default.portrait[0].URI;

            if (fileName) {
                imageUrl = imageServer + fileName + sizeRestriction;
            }
        }
        return imageUrl;
    }

    function _getMatchedTitle (item) {
        var _escapeTerm = function (term) {
            if (typeof term !== 'string') {
                return term;
            }
            if ([ "and", "or", "not" ].indexOf(term.toLowerCase()) !== -1) { // escape special terms if they are stand alone
                return '"' + term + '"';
            }
            // remove last double quotes if there is an odd number
            var endQuotes = term.match(/\"*$/),
                _term = term;
            if (endQuotes.length > 0 && endQuotes[0].length % 2 === 1) {
                _term = term.substr(0, term.length - 1);
            }
            return _term.replace(/([-()\[\]{}+?*.$\^|,:#<!\\\"])/g, '\\$1');
        },
        pattern, title = "";
        pattern = new RegExp(decodeURI(_escapeTerm(item.term)), "gi");
        title = item.value;

        return title.replace(pattern, '<span class="searchHighlight">$&</span>');
    }

    /**
     * @method getRecentMap
     */
    function getRecentMap (item) {
        var mapped = {};

        mapped.title = item;
        return mapped;
    }


    /**
     * @method getDidyoumeanMap
     */
    function getDidyoumeanMap (item) {
            var mapped = {};

            mapped.title = item.value;
            mapped.match = item.value;
            mapped.command = item.command;
            mapped.term = item.term;

            return mapped;
    }

    /**
     * @method getSuggestedMap
     */
    function getSuggestedMap (item) {
        var mapped = {},
            assets,
            hits = (item.hits) ? item.hits : undefined;

        mapped.title = item.value;
        mapped.match = _getMatchedTitle(item);
        mapped.field = item.field;
        mapped.score = item.score;
        mapped.command = item.command;
        mapped.term = item.term;

        mapped.hitNb = 0;
        mapped.contentType = "TV_EPS";

        if (hits) {
            assets = (hits.assets) ? hits.assets : undefined;

            mapped.hitNb = hits.length;
            mapped.hits = hits.map($service.DISCO.Map.editorial);

            if (assets) {
                mapped.contentType = assets[0].contentType;
            }
        }

        if ([ "title", "episodeTitle", "eventTitle", "programEventTitle" ].indexOf(mapped.field) !== -1) {
            mapped.type = (mapped.contentType === "MOVIE") ? "Movie" : "TV Show";
        } else if (["cast.name"].indexOf(mapped.field) !== -1) {
            mapped.type = "Actor";
        } else if (["director"].indexOf(mapped.field) !== -1) {
            mapped.type = "Director";
        } else {
            console.warn("Use default resultType: Keyword: " + mapped.field);
            mapped.type = "Keyword";
        }

        if (mapped.command === "FOXTELIQ3") {
            mapped.from = "Foxtel";
        } else if (mapped.command === "FOXTELPRESTO") {
            mapped.from = "Presto";
        } else if (mapped.command === "YOUTUBE") {
            mapped.from = "YouTube";
        } else if (mapped.command === "IVIEW") {
            mapped.from = "iView";
        } else {
            mapped.from = "";
        }

        return mapped;
    }


    /**
     * @method getEditorialMap
     */
    function getEditorialMap (item) {
        var mapped = {},
            now = new Date().getTime(), // times are in milliseconds here
            metadata = (item.metadata) ? item.metadata : undefined,
            i, len,
            relevantSchedules = (item.relevantSchedules && item.relevantSchedules.length > 0) ? item.relevantSchedules : undefined;

//    mapped.channelLogo = $N.app.channelLcnTagMapper.getIconByTag(item.technicals[0].ServiceLongName);
//    mapped.image = !imgObj ? undefined : imgObj.url;
//    mapped.imageType = !imgObj ? undefined : imgObj.type;
//    mapped.promoImage = promoImgObj.url;
//    mapped.promoImgType = promoImgObj.type;
//    mapped.tileType = "VOD";
        mapped.source = $service.DISCO.sourceName;

        mapped.editorialId = item.id;
        mapped.id = item.id;

        mapped.channelName = _getChannelName(item);
        mapped.promo = _getImageUrl(item);
        mapped.definition = _getEditorialDefinition(item);
        mapped.actors = _getEditorialActors(item);
        mapped.directors = _getEditorialDirectors(item);
        mapped.genre = _getGenre(item); // foxtelUIAPIsUtil.getGenrefromDVBCategories(metadata.DvbCategories);

        if (metadata) {

            mapped.categories = metadata.category;
            mapped.contentType = metadata.contentType;
            if (typeof metadata.consumerAdvice === 'string') {
                mapped.contentWarning = metadata.consumerAdvice;
            }
            mapped.description = metadata.description ? metadata.description : undefined;
            mapped.dispSEpNum = metadata.displaySEpNum;
            mapped.duration = metadata.publishDuration;
            mapped.episodeNumber = metadata.episodeNumber;
            mapped.episodeTitle = metadata.episodeTitle;
            mapped.language = metadata.primaryLanguage;
            mapped.programId = metadata.programId;
            mapped.rating = metadata.classification;
            mapped.seasonNumber = metadata.seasonNumber;
            mapped.seriesRef = metadata.titleId;
            mapped.sortTitle = metadata.sortTitle;
            mapped.subTitles = metadata.isSubtitled;
            mapped.synopsis = metadata.longSynopsis ? metadata.longSynopsis : (metadata.shortSynopsis ? metadata.shortSynopsis : undefined);
            mapped.title = metadata.title;
            mapped.year = metadata.yearOfRelease;
        }

        if (relevantSchedules) {
            mapped.channel = relevantSchedules[0].channelTag;
            mapped.channelTag = relevantSchedules[0].channelTag;
            mapped.isClosedCaptioned = (relevantSchedules[0].hasClosedCaptions && relevantSchedules[0].hasClosedCaptions === "true");
            mapped.isHD = (relevantSchedules[0].isHighDefinition && relevantSchedules[0].isHighDefinition === "true");
            mapped.price = (relevantSchedules[0].price ? relevantSchedules[0].price : undefined);
            mapped.audioMode = relevantSchedules[0].audioType;
            mapped.progEndDate = relevantSchedules[0].endTime;
            mapped.progStartDate = relevantSchedules[0].startTime;
            mapped.type = relevantSchedules[0].offerType;

            // collect other programme times TODO: just future?
            mapped.programTimes = [];

            for (i = 0, len = relevantSchedules.length; i < len; i++) {
                mapped.programTimes.push({
                    "progStartDate": relevantSchedules[i].startTime,
                    "progEndDate"  : relevantSchedules[i].endTime,
                    "type"         : relevantSchedules[i].type,
                    "channelTag"   : relevantSchedules[i].channelTag
//                  "isCatchUp": programmes[i].isCatchUp,
//                  "isStartOver": programmes[i].isStartOver
                });
                // if we have no times yet: find the one which shows first (or is ongoing now)
                if (!mapped.progStartDate && !mapped.progEndDate) {
                    if (relevantSchedules[i].startTime > now || // in the future ...
                            relevantSchedules[i].endTime > now) { // ... or on now
                        mapped.progStartDate = relevantSchedules[i].startTime;
                        mapped.progEndDate = relevantSchedules[i].endTime;

                    }
                }
            }
        }

//      if (metadata) {
//
//          mapped.aspect = metadata.Aspect;
//          mapped.countries = metadata.Countries;
//          mapped.mainContentRef = metadata.mainContentRef;
//          mapped.technicalId = metadata.id;
//
//          mapped.multipleVersions = [];
//
//          if (multipleVersions) { // collect other multiple versions
//              for (var i in multipleVersions) {
//                  if (multipleVersions[i].products &&
//                          multipleVersions[i].products.length > 0 &&
//                          multipleVersions[i].products[0].price.value !== 0) {
//                      mapped.multipleVersions.push( {
//                          "definition": multipleVersions[i].Definition,
//                          "price":      multipleVersions[i].products[0].price.value.toFixed(2)
//                      });
//                  }
//              }
//          }
//
//          if (product) {
//              var voditem = (product.voditems && product.voditems.length > 0) ? product.voditems[0] : undefined;
//
//
//              if (voditem) {
//                  mapped.displayPriority = voditem.DisplayPriority;
//                  mapped.tileTagLine = voditem.CUST_TileTagLine;
//                  mapped.tileText = voditem.CUST_TileText;
//                  mapped.trailerId = voditem.contentRef;
//              }
//          }
//      }

        mapped.isScrubbed = false;
        mapped.isNotEntitled = false;

// if (false) { // disco: function (item, i) { Line 83075 App.js
//      imageBlocked = $service.Map.isBlocked({rating: ratingName, type: 'name', ratingType: "ADULT"});

//      mapped.index = i;
//      mapped.title = imageBlocked ? "Filtered Event" : mapped.title;
//      mapped.subtitle = imageBlocked ? "Filtered" : subtitle;
//      mapped.subtitle2 = channelName;
//      mapped.eventRatingBesideSubTitle2 = (channelName && ratingTitle) ? ratingTitle : '';
//      mapped.rating = ratingName;
//      mapped.image = imageBlocked ? $search.getDefaultImage(imageType) : imageUrl;
//      mapped.fallback = '';
//      mapped.counter = 0;
//      mapped.data = item;
//      mapped.isNotEntitled = (channel) ? !_obj.get(channel, 'isEntitled', false) : false;
//      mapped.isUserBlocked = false;
//      mapped.isRadio = false;
//      mapped.isKeep = false;
//      mapped.isCollection = false;
//      mapped.isError = false;
//      mapped.isRollup = false;
//      mapped.isSeriesLink = false;
//      mapped.isReminder = false;
//      mapped.isCc = schedItem ? (_obj.get(schedItem, 'hasClosedCaptions', false) && _mediaPlayer.areSubtitlesEnabled()) : _obj.get(vodSchedItem, 'hasClosedCaptions', false);
//      mapped.isCanPlay = (vodSchedItem && !schedItem);
//      mapped.isRecord = false;
//      mapped.isPlus30 = false;
//      mapped.isPaused = false;
//      mapped.isDownloading = false
//      mapped.badgesPromotionalText = playing ? "ON NOW" : '';
//      mapped.badgesBroadcastText = !playing && schedItem ? _app.relativeTime(schedItem.startTime) : '';
//      mapped.badgesPurchasedText = '';
//      mapped.badgesEventText = isPPV ? "RENTAL" : '',
//      mapped.badgesEventClassification = isPPV ? ratingTitle : '' //(pay per view) && ( metadata.classification) ? '(' + metadata.classification + ')' : ''
// }
        return $service.Map.generic(mapped);
    }

    /*!
    * This function extracts a properly formatted season/episode/title combination for display in the full search results
    *
    * @method _extractSeasonEpisodeDetails
    * @private
    * @param   {Object} item The entry we're parsing
    * @returns {String} A formatted string containing season, episode and title
    */
    function _extractSeasonEpisodeDetails(item) {
        var seasonEpisodeDetails = '';

        if (item.metadata) {
            if (item.metadata.seasonNumber) {
                seasonEpisodeDetails += ' S' + item.metadata.seasonNumber;
            }
            if (item.metadata.episodeNumber) {
                seasonEpisodeDetails += ' EP' + item.metadata.episodeNumber;
            }
            if (item.metadata.episodeTitle) {
                seasonEpisodeDetails += ' - ' + item.metadata.episodeTitle;
            }
        }
        return seasonEpisodeDetails;
    }

    /*!
    * This function generates the full title of the data asset, including the series and episode details.
    * It will also filter the title based on the current parental controls.
    *
    * @method _getFullTitle
    * @private
    * @param {Object} data The data asset
    * @returns {String} The title of the event
    */
    function _getFullTitle(data) {
        var relevantFields = [],
            result,
            hitCount,
            //ratingName,
            displaySeasonAndEpisode;

        // If this is a grouped set of results, we should have a hit count. This is important when working out
        // whether or not we display the Season and Episode details
        hitCount = data.hitCount || 0;

        // Check to see if rating is blocked for Adult Filtering
        //ratingName = data.metadata.classification;
        if (data.relevantFields) {
            relevantFields = data.relevantFields;
        }

        //if (relevantFields.indexOf('metadata.cast.name') === -1 &&
          //$enhancedEpg.isRatingBlocked({ rating: ratingName, type: 'name', ratingType: $enhancedEpg.RATING_TYPE_ADULT })) {
          //return _translate('adultFilterEventTitle');
        //}

        // We want season/episode details if:
        // a) We've groups of results, current group has 1 hit and it's not a movie
        // b) The current single "hit" item is not a movie (based on relevantFields)
        displaySeasonAndEpisode =
          (hitCount === 1 && data.metadata.contentType !== 'MOVIE') ||
          ((relevantFields.indexOf('metadata.title') !== -1 ||
          relevantFields.indexOf('metadata.episodeTitle') !== -1 ||
          relevantFields.indexOf('eventTitle') !== -1) && data.metadata.contentType !== 'MOVIE');

        result = data.relevantSchedules[0].eventTitle;

        // If it is an episode display season, episode and episode title
        if (displaySeasonAndEpisode) {
          result += _extractSeasonEpisodeDetails(data);
        }

        return result;
    }

    /**
     * @method getFullSearchMap
     */
    function getFullSearchMap (item) {
        var mapped,
            relevantFields = [];

        mapped = getEditorialMap(item);

        if (item.relevantFields) {
            relevantFields = item.relevantFields;
        }

        if (relevantFields.length > 0) {
            if (relevantFields.indexOf('metadata.cast.name') !== -1) {
                mapped.type = 'Actor';
            } else if (relevantFields.indexOf('metadata.director') !== -1) {
                mapped.type = 'Director';
            } else if (relevantFields.indexOf('metadata.title') !== -1 || relevantFields.indexOf('metadata.episodeTitle') !== -1 ||
                relevantFields.indexOf('eventTitle') !== -1) {
                mapped.type = (item.metadata.contentType === 'MOVIE') ? 'Movie' : 'TV Show';
            } else {
                mapped.type = 'Keyword';
            }
        } else {
            mapped.type = 'Keyword';
        }

        if (item.metadata) {
            item.value = _getFullTitle(item);
        }
    mapped.title = item.value;
        mapped.match = _getMatchedTitle(item);
        return mapped;
    }

    /**
     * @method init
     */
    function init () {
    }

    return {
        init      : init,
        editorial : getEditorialMap,
        recent    : getRecentMap,
        suggested : getSuggestedMap,
        didyoumean: getDidyoumeanMap,
        fullSearch: getFullSearchMap
    };
}());

