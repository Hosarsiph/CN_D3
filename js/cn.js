//Map dimensions (in pixels)
var width = 800,
    height = 600;

//Map projection
var projection = d3.geo.mercator()
    .scale(4071.955836782945)
    .center([-97.0543401779538,17.486943068278542]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geo.path()
    .projection(projection);

//Create an SVG
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

//Create choropleth scale
var color = d3.scale.quantize()
    .domain([0,1.000000130318469])
    .range(d3.range(8).map(function(i) { return "q" + i + "-8"; }));

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomed);

svg.call(zoom);


//Create a tooltip, hidden at the start
var tooltip = d3.select("#map").append("div").attr("class","tooltip");

// d3.select('#slider11').call(d3.slider().scale(d3.time.scale().domain([new Date(1984,1,1), new Date(2014,1,1)])).axis(d3.svg.axis()).snap(true).value(new Date(2000,1,1)));

d3.select('#slider11').call(d3.slider().scale(d3.time.scale().domain([new Date(1984,1,1), new Date(2014,1,1)])).axis(d3.svg.axis()).snap(true).value(new Date(2000,1,1)));

function slider() {
  var propiedades = document.getElementById("status").value;
  d3.json("data/CN.topojson",function(error,geodata) {
    if (error) return console.log(error); //unknown error, check the console
    //Create a path for each map feature in the data
    // var attrb = ["Pro_CN_T1", "Prop_CN_T2", "Prop_CN_T3", "Prop_CN_T4", "Prop_CN_T5"];
    var sld = features.selectAll("path")
      .data(topojson.feature(geodata,geodata.objects.collection).features) //generate features from TopoJSON
      sld.enter()
      .append("path")
      sld.attr("d",path)
      sld.transition()
      .attr("class", function(d) {
                      var valor = d.properties[propiedades];
                      return (typeof color(valor) == "string" ? color(valor) : "");
                      })
      sld.exit().remove()
      .on("mouseover",showTooltip)
      .on("mousemove",moveTooltip)
      .on("mouseout",hideTooltip)
      .on("click",clicked);
  });

}


// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {
}


//Update map on zoom/pan
function zoomed() {
  features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
}


//Position of the tooltip relative to the cursor
var tooltipOffset = {x: 5, y: -25};

//Create a tooltip, hidden at the start
function showTooltip(d) {
  moveTooltip();

  tooltip.style("display","block")
      .text(d.properties.NOM_MUN);
}

//Move the tooltip to track the mouse
function moveTooltip() {
  tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
  tooltip.style("display","none");
}
