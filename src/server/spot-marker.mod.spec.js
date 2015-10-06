/**
 * Created by ckelly on 27-9-2015.
 */
var spotMarker = require('./spot-marker.mod');


var lastSpotId;
spotData.forEach(function (spots) {
    var spotId;

    insertNext(0);
    function insertNext(n) {
        if (!n) {
            spotMarker.createMark(spots[n])
                .then(function (data) {
                    spotId = data;
                    lastSpotId = spotId;
                    insertNext(n+1);
                });
        } else {
            if (n < spots.length)
                spotMarker.addMarkEra(spotId, spots[n])
                    .then(function () {
                        insertNext(n+1);
                    });
        }
    }
});

setTimeout(function (d) {
    var eras = [-50000, -2000, -1000, -500, -100, 0, 200, 300, 400, 800, 1200, 2500, 10000];

    var sliceData = [];
    var remaining = eras.length;


    eras.forEach(function (era) {
        spotMarker.genTimeSlice(era)
            .then(function (slice) {
                console.log(slice)
                slice.era = era;
                sliceData.push(slice);
                if (!--remaining) {
                    console.log('==============================');
                    sliceData.forEach(function (sl) {
                        console.log(
                            (sl.era + '        ').substring(0, 8) +
                            sl
                            .sort()
                            .map(function (s) {return s.id})
                            .join(' ')
                        );
                    });
                }
            });
    });
}, 2000);
