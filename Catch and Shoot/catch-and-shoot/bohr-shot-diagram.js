height = 450;
var margin = { top: 20, right: 20, bottom: 20, left: 50 };
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var missImg = "";
var makeImg = "";

// var selectValue

//     function onchange() {

//         selectValue= d3.select('#bohr-select').property('value')

//       plotGraph()

//   };
//   d3.selectAll("select").remove()
//   var select = d3.select('body')
//   .append('select')
//       .attr('id','bohr-select')
//       .style("position","absolute")
//       .attr("class","selectize-input")
//       .style("right", margin.right + "px")
//    .style("top", "200px")
//    .style("width", "200px")
//     .on('change',onchange)

//     var selOptions = ["Open and Closed","Xs and Os","Bballs and Bricks"]
//     selectValue = "Open and Closed"
plotGraph();
// select.selectAll("option").remove()
// var options = select
//   .selectAll('option')
//   .data(selOptions)
//   .enter()
//   .append("option")
//   .text(function(d){return d;})

var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

function plotGraph() {
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
  var fillScale = d3
    .scaleOrdinal()
    .domain(teams)
    .range(fillColors);

  var strokeScale = d3
    .scaleOrdinal()
    .domain(teams)
    .range(strokeColors);
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
    .attr("r", distanceMultilier * distanceScale(4))
    .attr("fill-opacity", "0")
    //  .attr("strock","#cc3232")
    .style("stroke", "#2dc937")
    .style("stroke-width", "3px");
  svg
    .append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", distanceMultilier * distanceScale(12))
    .attr("fill-opacity", "0")
    .attr("stroke", "#F58426")
    //  .style("stroke","gray")
    .style("stroke-width", "3px");
  svg
    .append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", distanceMultilier * distanceScale(20))
    .attr("fill-opacity", "0")
    .attr("stroke", "#cc3232")
    //  .style("stroke","gray")
    .style("stroke-width", "3px");

  svg
    .append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", distanceMultilier * distanceScale(28))
    .attr("fill-opacity", "0")
    //  .attr("strock","#cc3232")
    .style("stroke", "#2dc937")
    .style("stroke-width", "3px");

  var nodes = [];
  var links = [];
 
  if (options.emoji === "Xs and Os") {
    missImg = "https://twemoji.maxcdn.com/2/72x72/274c.png"
    makeImg = "https://twemoji.maxcdn.com/2/72x72/2b55.png"
  }else if (options.emoji === "Bballs and Bricks") {
    makeImg =  "https://twemoji.maxcdn.com/2/72x72/1f3c0.png"
    missImg =  "https://twemoji.maxcdn.com/2/72x72/1f9f1.png"
  }else if (options.emoji === "Splash and Thumbs Down") {
    makeImg =  "https://twemoji.maxcdn.com/2/72x72/1f4a6.png"
    missImg =  "https://twemoji.maxcdn.com/2/72x72/1f44e.png"
  }else if (options.emoji === "Okay and Facepalm") {
    makeImg =  "https://twemoji.maxcdn.com/2/72x72/1f44c.png"
    missImg =  "https://twemoji.maxcdn.com/2/72x72/1f926.png"
  }else if (options.emoji === "Thumbs Up and Nope") {
    makeImg =  "https://twemoji.maxcdn.com/2/72x72/1f44d.png"
    missImg =  "https://twemoji.maxcdn.com/2/72x72/1f6ab.png"
  }

  var defs = svg.append("svg:defs");
  svg.selectAll(".icon").remove()
  svg.selectAll(".shotCircle").remove()
  svg.selectAll(".legends").remove()
  
 

  data.forEach(function(d, i) {
    var imgURL = "";
    if (d.EVENT_TYPE === "Missed Shot") {
      
      imgURL = missImg
    } else { // made shot
     
      imgURL = makeImg
    }
    defs
      .append("svg:pattern")
      .attr("id", "grump_avatar" + i)
      .attr("class", "icon")
      .attr("width", 16)
      .attr("height", 16)

      .attr("patternUnits", "objectBoundingBox")
      .append("svg:image")
      .attr("xlink:href", imgURL)
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
      shotType: d.SHOT_TYPE,
      team: d.TEAM_ABRV,
      imgID: "grump_avatar" + i
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
        if (d.distance < 4) {
          return distanceMultilier * 4;
        } else if (d.distance >= 4 && d.distance < 15) {
          return distanceMultilier * 12;
        } else if (d.distance >= 4 && d.shotType === "2PT Field Goal") {
          return distanceMultilier * 20;
        } else if (d.distance >= 22 && d.shotType === "3PT Field Goal") {
          return distanceMultilier * 28;
        } else {
          return distanceMultilier * 30;
        }
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
        .style("background-color", fillScale(d.team))
        .style("border", "2px solid " + strokeScale(d.team))
        .style("color", strokeScale(d.team))
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    })
    .attr("fill-opacity", function(d) {
      if (
        d.shotOutcome === "Missed Shot" &&
        options.emoji === "Open and Closed"
      ) {
        return "0";
      } else {
        return "1";
      }
    })
    .style("fill", function(d, i) {
      if (options.emoji === "Open and Closed") {
        return "black";
      } else {
        return "url(#" + d.imgID + ")";
      }
    })
    .style("stroke", function(d, i) {
      if (options.emoji === "Open and Closed") {
        return "black";
      } else {
        return "";
      }
    });
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
    .attr("y", height / 2 - distanceMultilier * 4 - 5)

    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    //   .style("text-decoration", "underline")
    .style("fill", "#2dc937")
    .text("Rim");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - distanceMultilier * 12 - 5)

    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    //   .style("text-decoration", "underline")
    .style("fill", "#F58426")
    .text("SMR");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - distanceMultilier * 20 - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    //   .style("text-decoration", "underline")
    .style("fill", "#cc3232")
    .text("LMR");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - distanceMultilier * 28 - 5)

    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    //   .style("text-decoration", "underline")
    .style("fill", "#2dc937")
    .text("3PT");

  //   from https://bl.ocks.org/wcjohnson11/0e59422dda4f7f507f2403378528d721
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

  if (options.emoji === "Xs and Os") {
    missImg = "https://twemoji.maxcdn.com/2/72x72/274c.png";
    makeImg = "https://twemoji.maxcdn.com/2/72x72/2b55.png";
  } else if (options.emoji === "Bballs and Bricks") {
    makeImg = "https://twemoji.maxcdn.com/2/72x72/1f3c0.png";
    missImg = "https://twemoji.maxcdn.com/2/72x72/1f9f1.png";
  }

  var legendRange = [missImg, makeImg];

  // var legendImgs = ["https://twemoji.maxcdn.com/2/72x72/274c.png","https://twemoji.maxcdn.com/2/72x72/1f9f1.png",
  // "https://twemoji.maxcdn.com/2/72x72/2b55.png","https://twemoji.maxcdn.com/2/72x72/1f3c0.png", "black", "gray"]
  var legendVals = d3
    .set(
      data.map(function(d) {
        return d.EVENT_TYPE;
      })
    )
    .values();


  var legendVals1 = d3
    .scaleOrdinal()
    .domain(legendVals)
    .range([missImg, makeImg]);

  var svgLegned = svg
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //D3 Vertical Legend//////////////////////////
  var legend = svgLegned
    .selectAll(".legend")
    .data(legendVals1.domain())
    .enter()
    .append("g")
    .attr("class", "legends")
    .attr("transform", function(d, i) {
      {
        return "translate(50," + (i * 20 + 100) + ")";
      }
    });

  if (options.emoji === "Open and Closed") {
    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 8)
      .attr("fill-opacity", function(d, i) {
        if (i == 0) {
          return "0";
        } else {
          return "1";
        }
      })
      .style("fill", "black")
      .style("stroke", "black");

    // })
  } else {
    legend
      .append("image")
      .attr("xlink:href", function(d, i) {
        if (i == 0) {
          return missImg;
        } else {
          return makeImg;
        }
        // return legendRange[i];
      })
      // .attr('class', 'avengers')
      .attr("height", "16")
      .attr("width", "16")
      .attr("x", 0)
      .attr("y", 0);
  }

  legend
    .append("text")
    .attr("x", 20)
    .attr("y", 16)
    //.attr("dy", ".35em")
    .text(function(d, i) {
      if (i == 0) {
        return "Missed Shot";
      } else {
        return "Made Shot";
      }
    })
    .attr("class", "textselected")
    .style("text-anchor", "start")
    .style("font-size", 15);
}
