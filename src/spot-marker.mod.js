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
        getTimeSlice : getTimeSlice
        , createMark : createMark
        , addMarkEra : addMarkEra
        , printIt : printIt
    };

    function printIt (id) {
        db.findOne({_id:id}, function (e, rec) {
            console.log(rec);
        });
    }
    function genTimeSlice (age) {
        // Generate a slice of spot mark from spot mark information

    }
    function getTimeSlice (age) {
        return new Promise(function (resolve, reject) {
            db.find({type: 'spot-mark'}, function (e, spotMarks) {
                if (e) return reject(e);
                spotMarks = spotMarks.filter(function enoughDataToSpanTime (sm) {
                    return sm.positionTrack.length > 1;
                });
                if (!spotMarks.length) return reject('No data to slice');
                var relevantMarks = spotMarks
                    .filter(function (sm) {
                        var epochs = _.pluck(sm.positionTrack, 'epoch')
                            .sort()
                            .reduce(function (p, n) {
                                return age >= p && age <= n
                                    ? [p, n]
                                    : false;
                            }, -100000000);
                        console.log(epochs);
                    })
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
