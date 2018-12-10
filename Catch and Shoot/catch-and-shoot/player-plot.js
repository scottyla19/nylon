var margin = { top: 20, right: 20, bottom: 20, left: 50 };
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var select = d3.select('body')
  .append('select')
      .attr('id','type-select')
      .style("position","absolute")
      .attr("class","selectize-input")
      .style("left", margin.left + "px")
   .style("top", "300px")
   .style("width", "200px")
    .on('change',onchange)
    
  var selOptions = ["Open and Closed","Xs and Os","Bballs and Bricks"]
  var selectValue = selOptions[1]
  // plotGraph()
    function onchange() {
      selectValue = d3.select('#type-select').property('value')
      plotGraph()
     
      
  };

  var options = select
      .selectAll('option')
      .data(selOptions)
      .enter()
      .append("option")
      .text(function(d){return d;})
 
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
function plotGraph(){
var distanceMultilier = 6;

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
// function plotGraph(){
//   var margin = { top: 20, right: 20, bottom: 20, left: 50 };
// width = width - margin.left - margin.right;
// height = height - margin.top - margin.bottom;
  var circles = [];
  var distanceScale = d3
  .scaleLinear()
  .domain([0, 40])
  .range([0, 40]);
// var fillScale = d3
//   .scaleOrdinal()
//   .domain(teams)
//   .range(fillColors);

// var strokeScale = d3
//   .scaleOrdinal()
//   .domain(teams)
//   .range(strokeColors);
//svg.selectAll("*").remove();

//svg.style("fill","black")
svg
  .append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "lightgrey");

//  svg.append("circle")
//  .attr("cx",width / 2)
//  .attr("cy",height / 2)
//  .attr("r",distanceMultilier*30)
// //  .attr("fill-opacity","0.5")
// //  .attr("fill","#2dc937")
//  .style("stroke","#2dc937")
//  .style("stroke-width","3px");

svg
  .append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", distanceMultilier * distanceScale(22.5))
  .attr("fill-opacity", "0")
  //  .attr("strock","#cc3232")
  .style("stroke", "#2dc937")
  .style("stroke-width", "3px");
svg
  .append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", distanceMultilier * distanceScale(14))
  .attr("fill-opacity", "0")
  .attr("stroke", "#cc3232")
  //  .style("stroke","gray")
  .style("stroke-width", "3px");

var nodes = [];
var links = [];
var defs = svg.append("svg:defs");
svg.selectAll(".icon").remove()


  data.forEach(function(d, i) {
    
    var imgURL = ""
    if (d.EVENT_TYPE === "Missed Shot") {
      if (selectValue === "Xs and Os") {
        imgURL = "https://twemoji.maxcdn.com/2/72x72/274c.png"
      }else if (selectValue === "Bballs and Bricks") {
        imgURL =  "https://twemoji.maxcdn.com/2/72x72/1f9f1.png"
      }else{
        
      }
      
    }else{

      if (selectValue === "Xs and Os") {
        imgURL = "https://twemoji.maxcdn.com/2/72x72/2b55.png"
      }else if (selectValue === "Bballs and Bricks") {
        imgURL =  "https://twemoji.maxcdn.com/2/72x72/1f3c0.png"
      }else{
        
      }
      // imgURL =  "https://twemoji.maxcdn.com/2/72x72/1f3c0.png"
      // // imgURL = "https://twemoji.maxcdn.com/2/72x72/2b55.png"
    }
    // imgURL =  "https://twemoji.maxcdn.com/2/72x72/1f3c0.png"
    //  imgURL = "https://twemoji.maxcdn.com/2/72x72/2b55.png"
    defs
      .append("svg:pattern")
      .attr("id", "grump_avatar" + i)
      .attr("class","icon")
      .attr("width", 16)
      .attr("height", 16)
      
      .attr("patternUnits", "objectBoundingBox")
      .append("svg:image")
      .attr("xlink:href",imgURL)
      .attr("width", 17)
      .attr("height", 17)
      .attr("x", 0)
      .attr("y", 0);
  
    if (nodes.length < 1) {
      nodes.push({ text: d.PLAYER_NAME, distance: 0 });
    }
    nodes.push({
      text: d.EVENT_TYPE + " " + d.SHOT_TYPE,
      distance: d.SHOT_DISTANCE,
      period: d.PERIOD,
      minutes: d.MINUTES_REMAINING,
      seconds: d.SECONDS_REMAINING,
      shotX: d.LOC_X,
      shotY: d.LOC_Y,
      gameDate: d.GAME_DATE,
      wl: d.WL,
      homeAway: d.HOMEAWAY,
      opponent: d.OPPONENT,
      game: d.DATE_OPPONENT,
      shotOutcome: d.EVENT_TYPE,
      imgID: "grump_avatar"+i
    });
  });

  for (let i = 1; i < nodes.length; i++) {
    links.push({
      source: 0,
      target: i,
      distance: distanceScale(nodes[i].distance)
    });
  }
  var simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceCollide().radius(6))
  
    .force(
      "r",
      forceRadial(function(d) {
        return distanceMultilier * d.distance;
      })
    )
    .on("tick", ticked);
  
  
  
  var group = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  
  
  
  var node = svg
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", function(d) {
      if (d.distance <= 0) {
        return 0;
      } else {
        return 8;
      }
    })
  
    .on("mouseover", function(d) {
      div
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div
        .html(
          d.text +
            "<br/> Game: " +
            d.game +
            "<br/> Period: " +
            d.period +
            " " +
            "Time: " +
            d.minutes +
            ":" +
            d.seconds +
            " <br/> Distance: " +
            d.distance +
            " FT"
        )
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    })
    // .attr("fill-opacity", function(d) {
    //   if (d.shotOutcome === "Missed Shot") {
    //     return "0";
    //   } else {
    //     return "1";
    //   }
    // })
    .style("fill", function(d,i) {
   
      return "url(#"+d.imgID+")"
  });
  //  .style("stroke","black")
  //  .style("fill", "url(https://twemoji.maxcdn.com/2/72x72/1f3c0.png)")
  
  function ticked() {
    // updateNodes()
    node
      .attr("cx", function(d) {
        return d.x + width / 2;
      })
      .attr("cy", function(d) {
        return height / 2 - d.y;
      });
  }








svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  .style("fill", "white")
  .text("Shot Board");

svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", height / 2 - distanceMultilier * 22.5 - 10)

  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  // .style("fill", "#2dc937")
  .text("3PT");

svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", height / 2 - distanceMultilier * 14 - 10)

  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  // .style("fill", "#cc3232")
  .text("LMR");

svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", height / 2 - 10)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  // .style("fill", "#F58426")
  .text("SMR");

function forceRadial(radius, x, y) {
  var nodes,
    strength = constant(0.1),
    strengths,
    radiuses;

  if (typeof radius !== "function") radius = constant(+radius);
  if (x == null) x = 0;
  if (y == null) y = 0;

  function force(alpha) {
    for (var i = 0, n = nodes.length; i < n; ++i) {
      var node = nodes[i],
        dx = node.x - x || 1e-6,
        dy = node.y - y || 1e-6,
        r = Math.sqrt(dx * dx + dy * dy),
        k = ((radiuses[i] - r) * strengths[i] * alpha) / r;
      node.vx += dx * k;
      node.vy += dy * k;
    }
  }

  function initialize() {
    if (!nodes) return;
    var i,
      n = nodes.length;
    strengths = new Array(n);
    radiuses = new Array(n);
    for (i = 0; i < n; ++i) {
      radiuses[i] = +radius(nodes[i], i, nodes);
      strengths[i] = isNaN(radiuses[i]) ? 0 : +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function(_) {
    (nodes = _), initialize();
  };

  force.strength = function(_) {
    return arguments.length
      ? ((strength = typeof _ === "function" ? _ : constant(+_)),
        initialize(),
        force)
      : strength;
  };

  force.radius = function(_) {
    return arguments.length
      ? ((radius = typeof _ === "function" ? _ : constant(+_)),
        initialize(),
        force)
      : radius;
  };

  force.x = function(_) {
    return arguments.length ? ((x = +_), force) : x;
  };

  force.y = function(_) {
    return arguments.length ? ((y = +_), force) : y;
  };

  return force;
}

function constant(x) {
  return function() {
    return x;
  };
}



}
