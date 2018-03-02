"use strict";

$service.MDS.Programme = (function Programme() {

  /**
   * @method _fetchDummy
   */
  function _fetchDummy(service, startTime, endTime, token) {
    var mainChannelId = service.mainChannelId;

    console.warn("Use dummy programmes [" + mainChannelId + "] from MDS");
    return $util.fetchToken("./service/MDS/Dummy/Events.json", $service.MDS.config.timeout, token)
        .then(function(data) {
                if (data && data.programmes && data.programmes.length > 0) {
                  var progStart = Math.floor((startTime / 1000) - (Math.random() * 3600));

                  data.programmes.forEach(function (programme) {
                    var duration = (programme.period.end - programme.period.start);
                    programme.period.start = progStart;
                    programme.period.end = progStart + duration;
                    programme.serviceRef = mainChannelId;
                    // programme.Title = "["+mainChannelId+"] "+i+" "+progStart;
                    programme.Description = "[" + mainChannelId + "] " + programme.Description;
                    programme.eventId = "X" + (progStart - 1484000000); // must be unique

                    progStart = programme.period.end;
                  });
                }
                return data;
              },
              function (data) {
                console.warn("Failed to get dummy MDS programmes: [" + data + "]");
                return [];
              }).then(function(data) {
                return data;
              },
              function (data) {
                console.warn("Failed to get offset dummy MDS programmes: [" + data + "]");
                return [];
              });

/*
    return $util.fetchToken("./service/MDS/Dummy/Event.json", $service.MDS.config.timeout, token)
              .then(function(data) {
                      var programmes = [];
                      if (data && data.programmes && data.programmes.length > 0) {
                        var programme = data.programmes[0];
                        var i = 0;
                        var progStart = Math.floor((startTime/1000) - (Math.random()*3600));
                        var progEnd = Math.floor((endTime/1000) - (Math.random()*3600));

                        while (progStart < progEnd) {
                          var duration = (programme.period.end - programme.period.start);
                          programme.period.start = progStart;
                          programme.period.end = progStart + duration;
                          programme.serviceRef = mainChannelId;
                          programme.Title = "["+mainChannelId+"] "+i+" "+progStart;
                          programme.Description = "["+mainChannelId+"] "+programme.Description;
                          programme.eventId = progStart;

                          progStart = programme.period.end;
                          programmes.push(programme);
                          i++;
                        }
                      }
                      return { "programmes": programmes };
                    },
                    function (data) {
                      console.warn("Failed to get dummy MDS programmes: ["+data+"]");
                      return [];
                    })
              .then(function(data) {
                      return data;
                    },
                    function (data) {
                      console.warn("Failed to get offset dummy MDS programmes: ["+data+"]");
                      return [];
                    })
*/
    }

  /**
   * @method _fetchData
   */
  function _fetchData(service, startTime, endTime, token) {

    var config = {};

    if (!service.mainChannelId) {
      console.warn("no serviceRef to fetch MDS programmes");
    }

    config.command = $service.MDS.COMMANDS.EPG.events;
    config.filter = {
        "serviceRef"  : service.mainChannelId,
        "period.start": {
        "$gt": Math.floor(startTime / 1000)
        },
        "period.end": {
        "$lt": Math.floor(endTime / 1000)
        },
        "locale": $service.MDS.config.locale
    };
    config.fields = [
    ];
    config.limit = 1000;
    config.sort = [
      [ "period.start", 1 ]
    ];

    return $service.MDS.Base.fetch(config, token);
  }

  /**
   * @method _cacheData
   */
  function _cacheData(data) {

    return new Promise(
      function (resolve, reject) {
        var programmes = [];
        if (data && data.programmes && data.programmes.length > 0) {
          data.programmes.forEach(function (programme) {
            var mapped = $service.MDS.Map.programme(programme);
            programmes.push(mapped);
          });
          resolve(programmes);
        } else {
          reject([]);
        }
      });
  }

  /**
   * @method _fetchProgrammes
   */
  function _fetchProgrammes(service, startTime, endTime, token) {
    var fetch = ($service.MDS.useFakeProgrammes) ? _fetchDummy : _fetchData;

    return fetch(service, startTime, endTime, token)
      .then(_cacheData,
          function (data) {
            console.warn("Failed to get MDS programmes for '" + service.mainChannelId + "' [" + data + "]");
            return [];
          }).then(function (data) {
            if (data && data.length > 0) {
              //console.log("Fetched "+data.length+" MDS programmes for '"+service.mainChannelId+"'");
            } else {
              console.log("No MDS programmes for '" + service.mainChannelId + "'");
            }
            return data;
          });
  }

  /**
   * @method _fetchNotify
   * Fetch all programmes for all given services
   */
  function _fetchNotify(services) {

    var promises = [];

    services.forEach(function(service) {
      promises.push(_fetchProgrammes(service));
    });

    Promise.all(promises).then(function(data) {
      console.log("service:MDS:programme:fetched");
      $util.Events.fire("service:MDS:programmes:fetched", data);
    }).catch(function (data) {
      console.warn("Failed to get MDS programmes: [" + data + "]");
    });
  }

  /**
   * @method fetchProgrammes
   * Will try to fetch programmes for given service
   */
  function fetchProgrammes(service, startTime, endTime, token) {

    return _fetchProgrammes(service, startTime, endTime, token)
      .then(function(data) {
          //console.log("Got programmes ["+service.mainChannelId+"] from MDS ["+data.length+"]");
          return data;
        }).catch(function () {
          console.warn("Failed to get programmes [" + service.mainChannelId + "] from MDS [0]");
          return [];
        });
  }

  /**
   * @method init
   */
  function init() {
    // this will fetch all programmes for given servicew and broadcast the "service:MDS:programmes:fetched" event when done
    $util.Events.on("service:MDS:programmes:fetch", _fetchNotify, this);
//    $util.Events.on("service:EPG:channels:fetched", _fetchNotify, this);
  }

  return {
    init : init,
    fetch: fetchProgrammes // fetch programmes for given service
  };
}());
