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

var margin = { top: 20, right: 20, bottom: 40, left: 40 },
  width = 1200 - margin.left - margin.right,
  height = height - margin.top - margin.bottom;

// set the ranges
var x0 = d3
  .scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1);

var x1 = d3.scaleBand().padding(0.05);

var y = d3.scaleLinear().rangeRound([height, 0]);

 svg.append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom);

svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "darkgrey");

svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.selectAll("g").remove();
var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

data.forEach(function(d, i, columns) {
  var keys = Object.keys(columns[0]).slice(2);
  var allStats = Object.keys(columns[0]).slice(1);
  var allStr = Object.keys(columns[0]).slice(1, 2);
  var nbaAvg = allStr.map(function(key) {
    return { key: key, value: d[key], range: d.RANGE };
  });

  x0.domain(
    data.map(function(d) {
      return d.RANGE;
    })
  );
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([
    0,
    d3.max(data, function(d) {
      return d3.max(allStats, function(key) {
        return d[key];
      });
    })
  ]).nice();

  g.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d) {
      return "translate(" + x0(d.RANGE) + ",0)";
    })
    .selectAll("rect")
    .data(function(d) {
      return keys.map(function(key) {
        return { key: key, value: d[key] };
      });
    })
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return x1(d.key);
    })
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("width", x1.bandwidth())
    .attr("height", function(d) {
      return height - y(d.value);
    })
    .attr("fill", function(d) {
      return fillScale(d.key);
    })
    .on("mouseover", function(d) {
      var htmlStr = "Team: " +  d.key +  "<br/> % of shots at range: %" + (Math.floor(d.value * 10000) / 100).toFixed(1)
      if (options.stat === "Points per shot (PPS)") {
        htmlStr = "Team: " +  d.key +  "<br/> PPS: " +  d.value.toFixed(2)
      }
      div
        .transition()
        .duration(200)
        .style("opacity", 1);
      div
        .html(htmlStr)
        .style("background-color", fillScale(d.key))
        .style("border", "2px solid " + strokeScale(d.key))
        .style("color", strokeScale(d.key))
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    })
    .style("stroke", function(d) {
      return strokeScale(d.key);
    });
  var counter = 0;
  svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .selectAll("g")
    .data(nbaAvg)
    .enter()

    .append("line") // attach a line
    .style("stroke", "lime") // colour the line
    .attr("x1", function(d) {
      return 0;
    })
    .attr("y1", function(d) {
      //console.log(JSON.stringify(d));
      return y(d.value);
    })
    .attr("x2", function(d) {
      return x0.bandwidth();
    })
    .attr("y2", function(d) {
      return y(d.value);
    })
    .attr("id", function(d) {
      return "avg-line-" + d.range;
    })
    .attr("transform", function(d) {
      return "translate(" + x0(d.range) + ",0)";
    })
    .on("mouseover", function(d) {
      var htmlStr = "NBA Average " +  " : %" + (Math.floor(d.value * 10000) / 100).toFixed(1)
      if (options.stat === "Points per shot (PPS)") {
        htmlStr = "NBA Average PPS " + d.value.toFixed(2)
      }
      div
        .transition()
        .duration(200)
        .style("opacity", 1);
      div
        .html(htmlStr)
        .style("background-color", "#17408B")
        .style("border", "2px solid " + "#C9082A")
        .style("color", "#fff")
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    })
});

g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x0))
  .selectAll("text")	
            .style("text-anchor", "middle")
           
            .attr("transform", function(d) {
                return "translate(0,22)"
                });
g.append("g")
  .attr("transform", "translate(0," + (height) + ")")
  .call(d3.axisBottom(x1).tickSize(0))
  .selectAll("text")	
            .style("text-anchor", "start")
            // .attr("dx", ".1em")
            .attr("dy", "-.04em")
            .attr("transform", function(d) {
                return "rotate(90)" 
                });


// add the y Axis
g.append("g").call(d3.axisLeft(y))

g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", ".8em")
      .style("text-anchor", "middle")
      .text(options.stat);      
      
var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      // .attr("transform", function(d, i) { return "translate(0," + i  + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 20)
      .attr("height", 5)
      .attr("fill", "lime");

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 5)
      .attr("dy", "0.32em")
      .text("NBA Average");
