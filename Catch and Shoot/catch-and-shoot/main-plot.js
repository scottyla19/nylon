var margin = { top: 20, right: 20, bottom: 20, left: 50 };
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;
svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + 2 * margin.bottom);

svg.append("rect")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + 2*margin.bottom)
    .attr("fill", "lightgrey");




var x = d3
  .scaleLinear()
  //.domain([0,d3.max(data, function(d) { return d.FGA; })])  //  d3.extent(data, function(d){return d.FGA})
  .domain(
    d3.extent(data, function(d) {
      return d.FGM;
    })
  )
  .range([0, width]);

var y = d3
  .scaleLinear()
  //.domain([0,d3.max(data, function(d) { return d.FGM; })])
  .domain(
    d3.extent(data, function(d) {
      return d.EFG;
    })
  )
  .range([height, 0]);

var size = d3
  .scaleLinear()
  //.domain(d3.extent(data, function(d){return d.EFG}))
  .domain([
    d3.max(data, function(d) {
      return d.FGA;
    }),
    d3.min(data, function(d) {
      return d.FGA;
    })
  ])
  .range([5, 10]);

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

var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

// var zoom = d3.zoom()
//     .scaleExtent([.5, 20])
//     .extent([[0, 0], [width, height]])
//     .on("zoom", zoomFunction);

// svg.attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .style("fill", "none")
//     .call(zoom);

var group = svg
  .append("g")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");

// //Inner Drawing Space
// var innerSpace = svg.append("g")
//     .attr("class", "inner_space")
//     .style("fill", "none")
//     .style("pointer-events", "zoom")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//     .call(zoom);

// // Draw Axis
// var gX = svg.append("g")
//     .attr("class", "axis axis--x")
//     .attr("transform", "translate("+margin.left +"," + height + ")")
//     .call(xAxis);

// var gY = svg.append("g")
//     .attr("class", "axis axis--y")
//     .attr("transform", "translate(" + margin.left + ",0)")
//     .call(yAxis);

// append zoom area
// var view = svg.append("rect")
//   .attr("class", "zoom")
//   .attr("width", width)
//   .attr("height", height)
//   .call(zoom)

// function zoomFunction(){
//   // create new scale ojects based on event
//   var new_xScale = d3.event.transform.rescaleX(x)
//   var new_yScale = d3.event.transform.rescaleY(y)

//   // update axes
//   gX.call(xAxis.scale(new_xScale));
//   gY.call(yAxis.scale(new_yScale));

//   // update circle
//   points.data(data)
//      .attr('cx', function(d) {return new_xScale(d.FGM)})
//      .attr('cy', function(d) {return new_yScale(d.EFG)});
// }

var points = group
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function(d) {
    return x(d.FGM);
  })
  .attr("cy", function(d) {
    return y(d.EFG);
  })
  .attr("r", 10) //function(d) {
  //   return size(d.FGA);
  // })
  .attr("fill", function(d) {
    return fillScale(d.TEAM);
  })
  .attr("stroke", function(d) {
    return strokeScale(d.TEAM);
  })
  .attr("d", function(d) {
    return d.PLAYER;
  }).style("opacity", function(d){ console.log(d.isSelected); if (!d.isSelected) {
    return 0.1
  }})
  .on("mouseover", function(d) {
    if (d.isSelected) {
    div
      .transition()
      .duration(200)
      .style("opacity", 0.9);
    div
      .html(
        d.PLAYER +
          "<br/> Makes: " +
          d.FGM +
          "<br/> Total Attemps: " +
          d.FGA +
          "<br/> EFG%: " +
          d.EFG
      )
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY - 28 + "px")
      .style("background-color",  fillScale(d.TEAM))
      .style("color", "white")//strokeScale(d.TEAM))
      .style("border", "3px solid " + strokeScale(d.TEAM));
    }
  })
  .on("mouseout", function(d) {
    div
      .transition()
      .duration(500)
      .style("opacity", 0);
  })
  .on("click", function() {
    Shiny.setInputValue("Player", d3.select(this).attr("d"), {
      priority: "event"
    });
  });

function make_x_gridlines() {
  return d3.axisBottom(x);
}

// gridlines in y axis function
function make_y_gridlines() {
  return d3.axisLeft(y);
}

var xAxis = group
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class", "axisWhite")
  .call(d3.axisBottom(x));

// Add the Y Axis
var yAxis = group
  .append("g")
  .attr("class", "axisWhite")
  .call(d3.axisLeft(y));

// svg
//   .append("g")
//   .attr("class", "grid")
//   //.attr("transform", "translate(0," + height + ")")
//   .call(
//     make_x_gridlines()
//       .tickSize(-height)
//       .tickFormat("")
//   )
//   .attr("transform", "translate(" + margin.left + "," + (height +margin.bottom) + ")");;

// add the Y gridlines
// svg
//   .append("g")
//   .attr("class", "grid")
//   .call(
//     make_y_gridlines()
//       .tickSize(-width)
//       .tickFormat("")
//   )
//   .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");;

/*xAxis.selectAll("line")
    .style("stroke", "white");

  xAxis.selectAll("path")
    .style("stroke", "white");

  xAxis.selectAll("text")
    .style("stroke", "white");


yAxis.selectAll("line")
    .style("stroke", "white");

  yAxis.selectAll("path")
    .style("stroke", "white");

  yAxis.selectAll("text")
    .style("stroke", "white");*/

svg
  .append("text")
  .attr(
    "transform",
    "translate(" + width / 2 + " ," + (height + margin.bottom + 30) + ")"
  )
  .style("text-anchor", "middle")
  .text("FGM")
  .style("fill", "black");

group
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - height / 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("EFG")
  .style("fill", "black");

svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  .style("fill", "white")
  .text("All Players with > 50 Catch and Shoot FGA");
