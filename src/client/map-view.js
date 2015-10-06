/**
 * Created by ckelly on 4-10-2015.
 */

var d3Map = {};

d3Map.create = function (el, props, state) {
    var svg = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('width', props.width)
        .attr('width', props.height);

    svg.append('g')
        .attr('class', 'd3-points');

    this.update(el, state);
};


d3Map.update = function (el, state) {
    // for now just draw the points.
    // soon: clear points. update zoom, etc.
    this._drawPoints(el, state.data);
};

d3Map.destroy = function () {
    // clean up goes here
};

d3Map._drawPoints = function () {

};