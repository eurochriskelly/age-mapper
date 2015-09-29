/**
 * Created by ckelly on 27-9-2015.
 */
var DataStore = require('nedb');
var Promise = require('q').Promise;
var db = new DataStore({filename : './tmpdb', autoload : true});
var _ = require('lodash');

var SpotMarker = function () {
    "use strict";

    return {
        genTimeSlice : genTimeSlice
        , createMark : createMark
        , addMarkEra : addMarkEra
    };

    function getTimeSlice (age) {
        // Generate a slice of spot mark from spot mark information
        // 1. check if it exists
        // 2. otherwise generated
        // 3. return
    }
    function genTimeSlice (age) {
        return new Promise(function (resolve, reject) {
            db.find({type: 'spot-mark'}, function (e, spotMarks) {
                if (e) return reject(e);
                spotMarks = spotMarks.filter(function enoughDataToSpanTime (sm) {
                    return sm.positionTrack.length > 1;
                });
                if (!spotMarks.length) return reject('No data to slice');

                var relevantMarks = spotMarks
                    .map(function (sm) {
                        sm.epochs = _.pluck(sm.positionTrack, 'epoch')
                            .sort(function (a,b) { return a - b;})
                            .filter(function (epoch, i, lst) {
                                var greaterThanPrev = age >= (i ? lst[i-1] : -Infinity) && age < epoch
                                var lessThanNext = i !== lst.length-1
                                    ? ((age >= epoch) && (age < lst[i+1]))
                                    : false;
                                return greaterThanPrev || lessThanNext;
                            });
                        return sm;
                    })
                    .filter(function agesThatSpan (sm) {
                        return sm.epochs.length === 2;
                    })
                    .map(function removeIrrelevantMarks (sm) {
                        var p1 = _.findWhere(sm.positionTrack, { epoch : sm.epochs[0] });
                        var p2 = _.findWhere(sm.positionTrack, { epoch : sm.epochs[1] });
                        var factor = age/ (sm.epochs[1]-sm.epochs[0]);
                        return [
                            { lat : p1.lat, lon : p1.lon, factor: factor, id : sm._id },
                            { lat : p2.lat, lon : p2.lon }
                        ]
                    })
                    .map(function inferPoint (segment) {
                        var factor = segment[0].factor;
                        return {
                            id : segment[0].id,
                            lon : segment[0].lon + ((segment[1].lon - segment[0].lon) * factor),
                            lat : segment[0].lat + ((segment[1].lat - segment[0].lat) * factor)
                        };
                    });
                resolve(relevantMarks);

            });
        });
    }
    function createMark (spec) {
        return new Promise(function (resolve, reject) {
            var x = db.insert({
                type : 'spot-mark',
                positionTrack : [spec]
            }, function (e, p) {
                if (e) return reject(e);
                resolve(p._id);
            });
        });
    }
    function addMarkEra (id, spec) {
        return new Promise(function (resolve, reject) {
            spec.inserted = true;
            db.findOne({_id : id}, function (e, d) {
                if (e) return reject(e);
                d.positionTrack.push(spec);
                db.update({_id:id}, d, {upsert:true}, function () {
                    if (e) reject(e);
                    resolve();
                });
            });
        });
    }
}();

module.exports = SpotMarker;
