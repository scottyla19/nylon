// var margin = { top: 20, right: 20, bottom: 30, left: 40 },
//   width = width - margin.left - margin.right,
//   height = height - margin.top - margin.bottom;

// // set the ranges
// var x = d3
//   .scaleBand()
//   .range([0, width])
//   .padding(0.1);
// var y = d3.scaleLinear().range([height, 0]);

// var rect = svg
//   .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// data.forEach(function(d) {
//   d.PPS = +d.PPS;
// });

// // Scale the range of the data in the domains
// x.domain(
//   data.map(function(d) {
//     return d.RANGE;
//   })
// );
// y.domain([
//   0,
//   d3.max(data, function(d) {
//     return d.shotRangeRatio;
//   })
// ]);
// rect
//   .selectAll(".bar")
//   .data(data)
//   .enter()
//   .append("rect")
//   .attr("class", "bar")
//   .attr("x", function(d) {
//     return x(d.RANGE);
//   })
//   .attr("width", x.bandwidth())
//   .attr("y", function(d) {
//     return y(d.shotRangeRatio);
//   })
//   .attr("height", function(d) {
//     return height - y(d.shotRangeRatio);
//   })
//   .style("fill","blue")
  
// // append the rectangles for the bar chart
// // rect
// //   .selectAll(".bar")
// //   .data(data)
// //   .enter()
// //   .append("rect")
// //   .attr("class", "bar")
// //   .attr("x", function(d) {
// //     return x(d.RANGE);
// //   })
// //   .attr("width", x.bandwidth())
// //   .attr("y", function(d) {
// //     return y(d.PPS);
// //   })
// //   .attr("height", function(d) {
// //     return height - y(d.PPS);
// //   });

  

// // add the x Axis
// rect
//   .append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x));

// // add the y Axis
// rect.append("g").call(d3.axisLeft(y));
var teams = [
    "ATL",
    "BOS",
    "BKN",
    "CHA",
    "CHI",
    "CLE",
    "DAL",
    "DEN",
    "DET",
    "GSW",
    "HOU",
    "IND",
    "LAC",
    "LAL",
    "MEM",
    "MIA",
    "MIL",
    "MIN",
    "NOP",
    "NYK",
    "OKC",
    "ORL",
    "PHI",
    "PHX",
    "POR",
    "SAC",
    "SAS",
    "TOR",
    "UTA",
    "WAS"
  ];
  var fillColors = [
    "#e0393e",
    "#007a33",
    "#000000",
    "#1D1160",
    "#ce1141",
    "#6F263D",
    "#00538c",
    "#0E2240",
    "#C8102E",
    "#006BB6",
    "#CE1141",
    "#002D62",
    "#C8102E",
    "#552583",
    "#5D76A9",
    "#98002E",
    "#00471B",
    "#0C2340",
    "#0C2340",
    "#006BB6",
    "#007AC1",
    "#0077C0",
    "#006BB6",
    "#1D1160",
    "#E03A3E",
    "#5A2D81",
    "#C4CED4",
    "#CE1141",
    "#002B5C",
    "#002B5C"
  ];
  
  var strokeColors = [
    "#C1D32F",
    "#ffffff",
    "#FFFFFF",
    "#00788C",
    "#000000",
    "#FFB81C",
    "#B8C4CA",
    "#FEC524",
    "#006BB6",
    "#FDB927",
    "#C4CED4",
    "#FDBB30",
    "#1D42BA",
    "#FDB927",
    "#12173F",
    "#F9A01B",
    "#EEE1C6",
    "#9EA2A2",
    "#C8102E",
    "#F58426",
    "#EF3B24",
    "#C4CED4",
    "#ED174C",
    "#E56020",
    "#000000",
    "#63727A",
    "#000000",
    "#B4975A",
    "#F9A01B",
    "#E31837"
  ];
  
  var fillScale = d3
    .scaleOrdinal()
    .domain(teams)
    .range(fillColors);
  
  var strokeScale = d3
    .scaleOrdinal()
    .domain(teams)
    .range(strokeColors);
  



var margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = width - margin.left - margin.right,
  height = height - margin.top - margin.bottom;

// set the ranges
var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);


var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// var rect = svg
//   .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
data.forEach(function(d, i, columns) {
console.log(JSON.stringify(columns, null, 4))
// Scale the range of the data in the domains
// x0.domain(
//   data.map(function(d) {
//     return d.RANGE;
//   })
// );
// x1.domain(
//   data.map(function(d) {
//     return d.TEAM_NAME;
//   })
// );
// y.domain([
//   0,
//   d3.max(data, function(d) {
//     return d.shotRangeRatio;
//   })
// ]);
var keys = Object.keys(columns[0]).slice(1)
console.log(keys)

  x0.domain(data.map(function(d) { return d.RANGE; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.RANGE) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return fillScale(d.key); })
      .style("stroke",function(D){return strokeScale(d.key)})

//   g.append("g")
//       .attr("class", "axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x0));

//   g.append("g")
//       .attr("class", "axis")
//       .call(d3.axisLeft(y).ticks(null, "s"))
//     .append("text")
//       .attr("x", 2)
//       .attr("y", y(y.ticks().pop()) + 0.5)
//       .attr("dy", "0.32em")
//       .attr("fill", "#000")
//       .attr("font-weight", "bold")
//       .attr("text-anchor", "start")
//       .text("Population");

//   var legend = g.append("g")
//       .attr("font-family", "sans-serif")
//       .attr("font-size", 10)
//       .attr("text-anchor", "end")
//     .selectAll("g")
//     .data(keys.slice().reverse())
//     .enter().append("g")
//       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

//   legend.append("rect")
//       .attr("x", width - 19)
//       .attr("width", 19)
//       .attr("height", 19)
//       .attr("fill", z);

//   legend.append("text")
//       .attr("x", width - 24)
//       .attr("y", 9.5)
//       .attr("dy", "0.32em")
//       .text(function(d) { return d; });
});
// rect
//   .selectAll(".bar")
//   .data(data)
//   .enter()
//   .append("rect")
//   .attr("class", "bar")
//   .attr("x", function(d) {
//     return x1(d.TEAM_NAME);
//   })
//   .attr("width", x1.bandwidth())
//   .attr("y", function(d) {
//     return y(d.shotRangeRatio);
//   })
//   .attr("height", function(d) {
//     return height - y(d.shotRangeRatio);
//   })
//   .style("fill","blue")
  
// append the rectangles for the bar chart
// rect
//   .selectAll(".bar")
//   .data(data)
//   .enter()
//   .append("rect")
//   .attr("class", "bar")
//   .attr("x", function(d) {
//     return x(d.RANGE);
//   })
//   .attr("width", x.bandwidth())
//   .attr("y", function(d) {
//     return y(d.PPS);
//   })
//   .attr("height", function(d) {
//     return height - y(d.PPS);
//   });

  


g
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x0));

// add the y Axis
g.append("g").call(d3.axisLeft(y));


