"use strict";

$service.DISCO.Search = (function Search () {

    /* global console: true */
    var _JOINCHAR = "|";

    /**
     * _fetchData
     */
    function _fetchData (command, limit, term, param) {
        var config = {};

        if (term !== undefined && !term) { // resolve an empty list
            return new Promise(function (resolve/* , reject */) {
                console.warn("Unable to search with empty term");
                resolve([]);
            });
        }

        config.command = command;
        if (term) {
            config.filter = "fx=" + term;
        }

        if (limit) {
            config.limit = limit;
        }
        config.offset = 0; //set 0 as default value
        if (param) {
            if (param.filter) {
               if (param.filter === "searchFilterALL") {
                      config.filter += "&rid=SEARCH1";
               } else if (param.filter === "searchFilterMOVIE") {
                      config.filter += "&rid=SEARCH102";
               } else if (param.filter === "searchFilterTVSHOW") {
                      config.filter += "&rid=SEARCH103";
               } else if (param.filter === "searchFilterPEOPLE") {
                      config.filter += "&rid=SEARCH104";
               } else if (param.filter === "searchFilterKEYWORD") {
                      config.filter += "&rid=SEARCH105";
               }
            }

            if (param.offset) {
                config.offset = param.offset;
            }
        }

//      config.filter = {
//      };
        config.fields = [
//      "metadata.programId",
//      "metadata.title",
//      "metadata.contentType",
//      "metadata.subGenreName",
//      "metadata.classification",
//      "relevantSchedules.channelTag",
//      "images.default.landscape.URI",
//      "images.default.portrait.URI",
//          "metadata.shortSynopsis",
//          "relevantSchedules.isHighDefinition",
//          "relevantSchedules.isWidescreen",
//          "relevantSchedules.audioType",
//          "metadata.isSubtitled",
//          "relevantSchedules.hasClosedCaptions",
//          "metadata.publishDuration",
//          "metadata.yearOfRelease",
//      "metadata.seasonNumber",
//      "metadata.episodeNumber",
//          "metadata.episodeTitle",
//          "metadata.genreId",
//          "metadata.subGenreId",
//          "metadata.consumerAdvice",
//          "metadata.cast",
//      "metadata.category",
//          "metadata.titleId",
//          "metadata.displaySEpNum",
//          "relevantSchedules.startTime",
//          "relevantSchedules.endTime",
//          "relevantSchedules.type",
//          "relevantSchedules.id",
//          "relevantSchedules.offerType",
//          "relevantSchedules.seriesLink",
//          "hits.metadata.sourceTitle",
//          "hits.id"
            ];

        if (param && param.fields) {
            config.fields.push(param.fields);
        }

//      config.sort = [
//          ["hits.metadata.sortTitle", 1]
//      ];

        return $service.DISCO.Base.fetch(config);
    }

    /**
     * @method _mergeResults
     */
    function _mergeResults (data) {
        var merged = [];
        if (data) {
            data.forEach(function (items) {
                merged = merged.concat(items);
            });
        }
        return merged;
    }

    /**
     * @method _addRecentSearch
     */
    function _addRecentSearch (term) {
        if (term) {
            var index,
                terms = null;

            if (window.localStorage) {
                if (window.localStorage.recentSearches) {
                    terms = window.localStorage.recentSearches.split(_JOINCHAR);
                }
            }

            if (terms) { // next one
                index = terms.indexOf(term);
                if (index !== -1) { // remove current search if it already exists
                    terms.splice(index, 1);
                }
                terms.unshift(term); // add new term in first location
                window.localStorage.recentSearches = terms.slice(0, 16).join(_JOINCHAR); //store 16 elements
            } else { // first one
                window.localStorage.recentSearches = term;
            }
        }
    }

    function _clearRecentSearch () {
        if (window.localStorage) {
            if (window.localStorage.recentSearches) {
                window.localStorage.recentSearches = "";
            }
        }
    }

    /**
     * Recent
     */
    function _fetchRecentData () {
        return new Promise(function (resolve, reject) {
            if (window.localStorage.recentSearches) {
                var data = window.localStorage.recentSearches.split(_JOINCHAR);
                resolve(data);
            } else {
                reject([]);
            }
        });
    }

    function _mapRecentData (data) {
        return new Promise(function mapDataPromise (resolve, reject) {
            if (data) {
                var cache = data.map($service.DISCO.Map.recent);
                resolve(cache);
            } else {
                reject([]);
            }
        });
    }

    function fetchRecent () {
        return _fetchRecentData().then(_mapRecentData,
                function (data) {
                    console.log("Unable to fetch recent from DISCO: " + data);
                    return [];
            }).then(function (data) {
                console.log("Got recent from DISCO [" + data.length + "]");
                return data;
            },
            function (data) {
                console.log("Failed to map recent from DISCO: " + data);
                return [];
            });
    }

    /**
     * Popular
     */
    function _mapPopularData(data) {
        return new Promise(function mapDataPromise (resolve, reject) {
            if (data && data.hits) {
                var cache = data.hits.map($service.DISCO.Map.editorial);
                resolve(cache);
            } else {
                reject([]);
            }
        });
    }

    function fetchPopular(nb) {
        return _fetchData($service.DISCO.COMMANDS.POPULAR, nb).then(_mapPopularData,
                function (data) {
                    console.log("Unable to fetch popular from DISCO: " + data);
                    return [];
                }).then(function (data) {
                    console.log("Got popular from DISCO [" + data.length + "]");
                    return data;
                },
                function (data) {
                    console.warn("Failed to map popular from DISCO: " + data);
                    return [];
                });
    }


    /**
     * Did you mean
     */
    function fetchDidyoumean (term, offset) {
        var param = { "offset": offset, "fields": ["suggestedSpellings"] };

        return _fetchData($service.DISCO.COMMANDS.DIDYOUMEAN, 25, term, param).then(function (data) {
                var cache = [];
                if (data && data.suggestedSpellings) {
                    data.suggestedSpellings.forEach(function (value) {
                        var item = {};
                        item.command = "DIDYOUMEAN";
                        item.term = term;
                        item.value = value;
                        cache.push($service.DISCO.Map.didyoumean(item));
                    });
                }
                return cache;
            },
            function (data) {
                console.warn("Unable to fetch didyoumean from DISCO: " + data);
                return [];
            }).then(function (data) {
                console.log("Got didyoumean from DISCO [" + data.length + "]");
                return data;
            },
            function (data) {
                console.warn("Failed to map didyoumean from DISCO: " + data);
                return [];
            });
    }

    /**
     * Suggested
     */
    function _fetchSuggested (command, term, offset) {
        var commands = {
                "FOXTELIQ3"   : $service.DISCO.COMMANDS.SUGGESTIQ3,
                "FOXTELPRESTO": $service.DISCO.COMMANDS.SUGGESTPRESTO
            },
            param = { "offset": offset };

        return _fetchData(commands[command], 25, term, param).then(function (data) {
                var cache = [];
                if (data && data.terms) {
                    data.terms.forEach(function (item) {
                        item.command = command;
                        item.term = term;
                        cache.push($service.DISCO.Map.suggested(item));
                    });
                }
                return cache;
            },
            function (data) {
                console.warn("Unable to fetch suggested from DISCO: " + data);
                return [];
            }).then(function (data) {
                console.log("Got suggested from DISCO [" + command + "] [" + data.length + "]");
                return data;
            },
            function (data) {
                console.warn("Failed to map suggested from DISCO: " + data);
                return [];
            });
    }

    function fetchSuggested (term, offset) {

        var promises = [];

        promises.push(_fetchSuggested("FOXTELIQ3", term, offset));
        promises.push(_fetchSuggested("FOXTELPRESTO", term, offset));

        return Promise.all(promises).then(function(data) {
                    var cache = _mergeResults(data);
                    console.log("Got suggested from DISCO [" + cache.length + "]");
                    return cache;
                }).catch(function (data) {
                    console.warn("Failed to get suggested from DISCO: " + data);
                    return [];
                });
    }

    /**
     * Search
     */
    function _fetchSearch (command, term, filter, offset) {
        var commands = {
                "FOXTELIQ3"   : $service.DISCO.COMMANDS.SEARCHIQ3,
                "FOXTELPRESTO": $service.DISCO.COMMANDS.SEARCHPRESTO
            },
            param = { "filter": filter, "offset": offset };

        return _fetchData(commands[command], 25, term, param).then(function (data) {
                        var cache = [];

                        if (data && data.hits) {
                            data.hits.forEach(function (item) {
                                item.command = command;
                                item.term = term;
                                cache.push($service.DISCO.Map.fullSearch(item));
                            });
                        }
                        return cache;
                    },
                    function (data) {
                        console.warn("Unable to fetch search from DISCO: " + data);
                        return [];
                }).then(function (data) {
                        console.log("Got search from DISCO [" + command + "] [" + data.length + "]");
                        return data;
                    },
                    function (data) {
                        console.warn("Failed to map search from DISCO: " + data);
                        return [];
                });
    }

    function fetchSearch (term, filter, offset) {
        var promises = [];

        promises.push(_fetchSearch("FOXTELIQ3", term, filter, offset));
        promises.push(_fetchSearch("FOXTELPRESTO", term, filter, offset));

        return Promise.all(promises).then(function (data) {
                    var cache = _mergeResults(data);

                    console.log("Got search from DISCO [" + cache.length + "]");
                    return cache;
                }).catch(function (data) {
                    console.warn("Failed to get search from DISCO: " + data);
                    return [];
                });
    }

    /**
     * @method init
     */
    function init () {
    }

    return {
        init       : init,
        popular    : fetchPopular,
        recent     : fetchRecent,
        suggested  : fetchSuggested,
        search     : fetchSearch,
        didyoumean : fetchDidyoumean,
        add        : _addRecentSearch,
        clear      : _clearRecentSearch
    };
}());

