var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var axisgb = 0.2    // 20% Please work

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//  sVG wrapper

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
chartGroup.append("text")             
  .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (margin.top/2) + ")")
  .style("text-anchor", "middle")
  .text("HealthCare access vs Poverty");


var datapath = "assets/data/";
var datafile = "data.csv";
d3.csv(datapath+datafile).then(function(census_data) {

  //  Parsing data
    parseData(census_data);


    var xScale = d3.scaleLinear()
      .domain([(1-axisgb) * d3.min(census_data, d => d["poverty"]),
               (1+axisgb) * d3.max(census_data, d => d["poverty"])])
      .range([0, width]);

    var yScale = d3.scaleLinear()
      .domain([(1-axisgb) * d3.min(census_data, d => d["healthcare"]),
               (1+axisgb) * d3.max(census_data, d => d["healthcare"])])
      .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale)
                    

    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("poverty");


    chartGroup.append("g").call(leftAxis);
    chartGroup.append("g")
    .append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 0-margin.left/2)
    .attr("x", 0-(height/2))
    .style("color", "black")
    .style("text-anchor", "middle")
    .text("healthcare")


  // Add a scale for bubble size
  // Add circles

  stateCircles = svg.append('g')
    .selectAll(".stateCircle")
    .data(census_data)
    .enter()
    .append("g")

  stateCircles
      .append("circle")
      .attr("cx", d => xScale(d["poverty"]))
      .attr("cy", d => yScale(d["healthcare"]))
      .attr("r", 15 )
      .style("opacity", "0.7")
      .classed("stateCircle", true)

  stateCircles
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr("x", d => xScale(d["poverty"]))
    .attr("y", d => yScale(d["healthcare"]))
    .style('font-size', "12px")
    // .attr('fill-opacity', 0)
    // .attr('fill', 'red')
    .text(d => d["abbr"])
    .classed('stateText', true)

});

var intcols = ["id", "income", "incomeMoe"];
var strcols = ["state", "abbr"];
var floatcols = ["poverty", "povertyMoe", "age", "ageMoe", "healthcare", "healthcareLow", "healthecareHigh", 
                "obesity", "obesityLow", "obesityHigh", "smokes", "smokesLow", "smokesHigh"];
function parseData(census_data) {
  census_data.forEach(function(state) {
    var keys= Object.keys(state);
    
  keys.forEach(function(key) {
      if (inArray(intcols, key)) {
          state[key] = parseInt(state[key]);
      }
      else if (inArray(floatcols, key)) {
          state[key] = parseFloat(state[key])
      };
    });
  })
};
function inArray(arr, val) {
  return arr.indexOf(val) !== -1
};
