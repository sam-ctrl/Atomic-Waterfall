/*

Science Museum hackathon

*/

// Prevents jQuery and D3 clashing
jQuery.noConflict();

window.setInterval(function () {
    queryAPI();
}, 250);

function queryAPI() {
    var request = new XMLHttpRequest();

    request.addEventListener('load', function (e) {

        JSON.parse(this.responseText).data.forEach(function (data) {

            var data = data;
            generateVis(data);

        });

    });

    // Get 1 random object on display in the Science Museum
    request.open('GET', 'http://collection.sciencemuseum.org.uk/search/objects?filter%5Bhas_image%5D=true&filter%5Bmuseum%5D=Science%20Museum&page%5Bsize%5D=50&page%5Btype%5D=search&random=1');

    request.setRequestHeader('accept', 'application/json');

    request.send();
}

function generateVis(data) {

    console.log(data);

    var title = data.attributes.summary_title,
        minDate = data.attributes.lifecycle.creation[0].date[0].earliest,
        maxDate = data.attributes.lifecycle.creation[0].date[0].latest,
        imgUrl = "http://smgco-images.s3.amazonaws.com/media/" + data.attributes.multimedia[0].processed.large.location,
        imgThumb = data.attributes.multimedia[0].processed.large_thumbnail.location;

    /************************
    	Visualise Images
    *************************/

    var dateSpan = maxDate - minDate;
    var averageDate = minDate + (dateSpan * Math.random());

    var images = main.append('svg:image')
        .attr('xlink:href', imgUrl)
        .call(rectDimensions);

    images.transition()
        .duration(function () {
            return (10000 + ((highestDate - averageDate) * 50));
        })
        .attr('y', 1500);

    function rectDimensions() {
        this.attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('x', function () {
                return x(averageDate);
            })
            .attr('y', -200);
    }

}

var random = Math.random();
var imageWidth = (10 * random) + 100;
var imageHeight = imageWidth * (321 / 212);

var lowestDate = 10;
var highestDate = 2017;

var margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    width = 1300,
    height = 5000;

///Scales
var x = d3.scale.pow().exponent(10)
    //.base([10])
    .domain([lowestDate, highestDate])
    .range([0, width]);

var chart = d3.select('#visualisationWrapper')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('id', 'chart');

var main = d3.select('#chart')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + 10 + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main');

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(function (d) {
        return x.tickFormat(4, d3.format("d"))(d)
    })
    .tickSize(6, 0, 0);

function drawxAxis() {
    main.append('g')
        .attr('class', 'xaxis')
        .attr('transform', "translate(0," + 0 + ")")
        .attr('opacity', 1)
        .call(xAxis);
}
drawxAxis();