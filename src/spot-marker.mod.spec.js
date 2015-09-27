/**
 * Created by ckelly on 27-9-2015.
 */
var spotMarker = require('./spot-marker.mod');

var spotData = [
    [
        { lon : 2, lat : 3, epoch : 2000 },
        { lon : 2, lat : 4, epoch : -100 },
        { lon : 3, lat : 3, epoch : -600 }
    ],
    [
        { lon : 2, lat : 3, epoch : 4000 },
        { lon : 2, lat : 3, epoch : -1000 },
        { lon : 5, lat : 1, epoch : -2000 },
        { lon : 5, lat : 1, epoch : -8000 },
        { lon : 50, lat : -31, epoch : -12000 },
    ]
];

var lastSpotId;
spotData.forEach(function (spots) {
    var spotId;

    insertNext(0);
    function insertNext(n) {
        if (!n) {
            spotMarker.createMark(spots[n])
                .then(function (data) {
                    // console.log('1');
                    spotId = data;
                    lastSpotId = spotId;
                    console.log(data);
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
    //spotMarker.printIt(lastSpotId);
    spotMarker.genTimeSlice(400)
        .then(function (slice) {
            console.log(slice);
        });

}, 2000);


