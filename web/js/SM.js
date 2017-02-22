/*

Science Museum hackathon

*/

// Prevents jQuery and D3 clashing
jQuery.noConflict();



window.setInterval(function () {
    queryAPI();
}, 100);

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

    //console.log(data);

    var title = data.attributes.summary_title,
        minDate = data.attributes.lifecycle.creation[0].date[0].earliest,
        maxDate = data.attributes.lifecycle.creation[0].date[0].latest,
        imgUrl = "http://smgco-images.s3.amazonaws.com/media/" + data.attributes.multimedia[0].processed.large.location,
        imgThumb = data.attributes.multimedia[0].processed.large_thumbnail.location,
        objNumb = data.id;

    /************************
    	Visualise Images
    *************************/

    var dateSpan = maxDate - minDate;
    var averageDate = minDate + (dateSpan * Math.random());
    var fallLock = {};
    var fadeLock = {};

    var images;

    if (objNumb != "co84660") {
        var images = main.append('svg:image')
            .attr('xlink:href', imgUrl)
            .attr('id', title)
            .attr('opacity', 0)
            .call(rectDimensions);
    };


    images.call(fall).call(fadeIn);

    function fall(path) {
        d3.select(fallLock).transition()
            .duration(function () {

                return (10000 + ((highestDate - averageDate) * 50));
            })
            .tween("attr:y", function () {
                var i = d3.interpolateString("-100", "1500");
                return function (t) {
                    path.attr("y", i(t));
                };
            })
            .remove();
    }

    function fadeIn(path) {
        d3.select(fadeLock).transition()
            .delay(3000)
            .duration(function () {
                return (2000);
            })
            .tween("attr:opacity", function () {
                var i = d3.interpolateString("0", "0.8");
                return function (t) {
                    path.attr("opacity", i(t));
                };
            });
    }

    function rectDimensions() {
        this.attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('x', function () {
                return x(averageDate);
            })
            .attr('y', -100);
    }
}



// images.on('mouseover', function(d) { 
//             d3.select(this).transition("fall")
//             .duration(50)            
//           })

var random = Math.random();
var imageWidth = (10 * random) + 100;
var imageHeight = imageWidth * (321 / 212);

var lowestDate = 10;
var highestDate = 2017;

var margin = {
        top: 10,
        right: 40,
        bottom: 0,
        left: 50
    },
    width = 1300,
    height = 5000;

///Scales
var x = d3.scale.pow().exponent(10)
    .domain([lowestDate, highestDate])
    .range([0, width]);

var chart = d3.select('#visualisationWrapper')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('id', 'chart');

var axisWrapper = d3.select('#axisDiv')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('id', 'axisWrapper');

var xaxisWrapperInner = d3.select('#axisWrapper')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + 10 + ')')
    .attr('width', width)
    .attr('height', height);

var main = d3.select('#chart')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + 10 + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main');

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickValues([1000, 1500, 1700, 1800, 1900, 2000, 2017])
    .tickFormat(d3.format("d"))
    .tickSize(10, 0, 0);

function drawxAxis() {
    xaxisWrapperInner.append('g')
        .attr('class', 'xaxis')
        .attr('transform', "translate(0," + 0 + ")")
        .attr('opacity', 1)
        .call(xAxis);
}
drawxAxis();