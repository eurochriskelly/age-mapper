/**
 * Created by ckelly on 27-9-2015.
 */
var DataStore = require('nedb');
var Promise = require('q').Promise;
var db = new DataStore({filename : './tmpdb', autoload : true});
var driftSlicer = require('drift-slicer');
var spotMarker = require('spot-marker');
var _ = require('lodash');

var SpotMarker = function () {
    "use strict";
    
    var SPOT_MARKS = [];

    activate();
    return {
        getTimeSlice : getTimeSlice
        
    };

    function getTimeSlice (age) {
        // Generate a slice of spot mark from spot mark information
        // 1. check if it exists
        // 2. otherwise generated
        // 3. return
        return _genTimeSlice(age);            
    }
    function _genTimeSlice (age) {
        return new Promise(function (resolve, reject) {
            db.find({type: 'spot-mark'}, function (e, spotMarks) {
                if (e) return reject(e);
                
                driftSlicer.timeSlice(age)
                    .then(function (timeSlice) {
                        console.log(timeSlice);
                    });
            });
        });
    }
    function saveMarks (data) {
        var remaining = data.length;
        data.forEach(function (d) {
            db.update({_id : d.id}, d, {upsert:true}, function () {
                if (e) reject(e);
                resolve();
            });
        });
    }
    function activate () {
        
        
            
        db.findOne({_id : id}, function (e, d) {
            if (e) return reject(e);
            
        });
    }
    
}();

module.exports = SpotMarker;
