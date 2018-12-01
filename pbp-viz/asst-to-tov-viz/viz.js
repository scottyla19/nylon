var delayTime = 300;
var durationSpeed = 400;
var pid = 203915;
var pName = "Spencer Dinwiddie";
var offset = 300;
var astCount = 0;
var bpCount = 0;
var playSound = true;
var link, g, node;

var audioBad = new Audio("wobble-down-2.wav");
var audioGood = new Audio("8bit-coin-01.wav");

var margin = { top: 40, right: 10, bottom: 100, left: 10 },
  width = 660 - margin.left - margin.right,
  height = 1050 - margin.top - margin.bottom;

function changeSound() {
  var btn = d3.select("#soundBtn");
  playSound = !playSound;
  var myClass = "fas fa-volume-off fa-2x";
  if (playSound) {
    myClass = "fas fa-volume-up fa-2x";
  }
  btn.select("i").attr("class", myClass);
}

function plotThenRun(first, callback) {
  first();
  callback();
}

function startClicked() {
  var btn = d3.select("#startBtn").attr("disabled", "disabled");
  btn.style("color", "gray");
  runViz();
}

var select = d3
  .select("body")
  .append("select")
  .attr("id", "player-select")
  .on("change", onchange);

var svg = d3
  .select("#main")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var astCountText = svg
  .append("text")
  .attr("x", width - margin.right)
  .attr("y", 2 * margin.top)
  .attr("id", "ast-count-text")
  .style("text-anchor", "end")
  .text("Assist Count: " + astCount);

var bpCountText = svg
  .append("text")
  .attr("x", width - margin.right)
  .attr("y", 3 * margin.top)
  .attr("id", "to-count-text")
  .style("text-anchor", "end")
  .text("Bad Pass Count: " + bpCount);

var ratioText = svg
  .append("text")
  .attr("x", width - margin.right)
  .attr("y", 4 * margin.top)
  .attr("id", "ratio-text")
  .style("text-anchor", "end")
  .text(function(d) {
    if (bpCount < 1) {
      return "Ast/Bad Pass Ratio: ";
    } else {
      return "Ast/Bad Pass Ratio: " + (astCount / bpCount).toFixed(1);
    }
  });

var options = select.selectAll("option");
var optionsData = [];

d3.csv("player-data.csv").then(function(data) {
  data.forEach(function(d) {
    optionsData.push(d.PLAYER1_ID);
  });

  options
    .data(data)
    .enter()
    .append("option")
    .property("selected", function(d) {
      return d.PLAYER1_NAME === pName;
    })
    .text(function(d) {
      return d.PLAYER1_NAME;
    });
});

var treeData = {};
getAstNames();

function onchange() {
  astCount = 0;
  bpCount = 0;
  svg.selectAll("*").interrupt();
  d3.selectAll("svg").remove();
  // d3.selectAll("circle").remove()
  svg = d3
    .select("#main")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  astCountText = svg
    .append("text")
    .attr("x", width - margin.right)
    .attr("y", 2 * margin.top)
    .attr("id", "ast-count-text")
    .style("text-anchor", "end")
    .text("Assist Count: " + astCount);

  bpCountText = svg
    .append("text")
    .attr("x", width - margin.right)
    .attr("y", 3 * margin.top)
    .attr("id", "to-count-text")
    .style("text-anchor", "end")
    .text("Bad Pass Count: " + bpCount);

  ratioText = svg
    .append("text")
    .attr("x", width - margin.right)
    .attr("y", 4 * margin.top)
    .attr("id", "ratio-text")
    .style("text-anchor", "end")
    .text(function(d) {
      if (bpCount < 1) {
        return "Ast/Bad Pass Ratio: ";
      } else {
        return "Ast/Bad Pass Ratio: " + (astCount / bpCount).toFixed(1);
      }
    });
  var btn = d3.select("#startBtn").attr("disabled", null);
  btn.style("color", "white");

  var e = d3.select("#player-select").property("selectedIndex");
  var selpid = optionsData[e];
  selectValue = d3.select("#player-select").property("value");
  pid = parseInt(selpid);
  pName = selectValue;

  getAstNames();
}

async function getAstNames() {
  d3.select("#title").text(pName + " Ast-to-TOV Tree");
  var myDat = [];
  d3.csv("short-pbp-2017-18.csv")
    .then(function(data) {
      var astOnly = data.filter(function(d) {
        if (d["AST_BY_PID"] == pid) {
          return d;
        }
      });
      var uniNames = d3
        .map(astOnly, function(d) {
          return d.PLAYER1_NAME;
        })
        .keys();
      uniNames.forEach(function(d) {
        myDat.push({ name: d });
      });
    })
    .then(function(data2) {
      treeData = {
        name: "Player",
        children: [
          {
            name: "Turnovers",
            children: [
              { name: "BP_Live" },
              { name: "BP_Dead" },
              { name: "LB_Live" },
              { name: "LB_Dead" },
              { name: "Off_Foul" },
              { name: "Violation" }
            ]
          },
          {
            name: "Assists",
            children: myDat
          }
        ]
      };
      offset = (50 * myDat.length) / 3;
      // console.log(50*myDat.length/3)
    })
    .then(function(data3) {
      plotGraph();
    });
}

async function plotGraph() {
  console.log("plotGraph");
  astCount = 0;
  bpCount = 0;
  // declares a tree layout and assigns the size
  var treemap = d3.tree().nodeSize([50, 300]);

  //  assigns the data to a hierarchy using parent-child relationships
  var nodes = d3.hierarchy(treeData);

  // maps the node data to the tree layout
  nodes = treemap(nodes);

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin

  g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (width + margin.right) / 2 +
        "," +
        (height + margin.bottom) / 2 +
        ")"
    );

  // adds the links between the nodes
  link = g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", function(d) {
      if (d.parent.data.name == "Assists") {
        return (
          "M" +
          -d.y / 3 +
          "," +
          (d.x - offset) +
          "C" +
          -(d.y + d.parent.y) / 6 +
          "," +
          (d.x - offset) +
          " " +
          -(d.y + d.parent.y) / 6 +
          "," +
          (d.parent.x - offset - 40) +
          " " +
          -d.parent.y / 5 +
          "," +
          0
        );
      } else if (d.data.name == "Assists") {
        return (
          "M" +
          -d.y / 5 +
          "," +
          d.parent.x +
          "C" +
          -(d.y + d.parent.y) / 6 +
          "," +
          d.parent.x +
          " " +
          -(d.y + d.parent.y) / 6 +
          "," +
          d.parent.x +
          " " +
          -d.parent.y / 5 +
          "," +
          d.parent.x
        );
      } else if (d.data.name == "Turnovers") {
        return (
          "M" +
          d.y / 5 +
          "," +
          d.parent.x +
          "C" +
          (d.y + d.parent.y) / 6 +
          "," +
          d.parent.x +
          " " +
          (d.y + d.parent.y) / 6 +
          "," +
          d.parent.x +
          " " +
          d.parent.y / 5 +
          "," +
          d.parent.x
        );
      } else {
        return (
          "M" +
          d.y / 3 +
          "," +
          (d.x + offset) +
          "C" +
          (d.y + d.parent.y) / 6 +
          "," +
          (d.x + offset) +
          " " +
          (d.y + d.parent.y) / 6 +
          "," +
          (d.parent.x + offset + 40) +
          " " +
          d.parent.y / 5 +
          "," +
          0
        );
      }
    });

  // adds each node as a group
  node = g
    .selectAll(".node")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("g")
    .attr("class", function(d) {
      return "node" + (d.children ? " node--internal" : " node--leaf");
    })
    .attr("transform", function(d) {
      if (d.data.name == "Assists") {
        return "translate(" + -d.y / 4 + "," + (d.x - offset - 40) + ")";
      } else if (d.parent.data.name == "Assists") {
        return "translate(" + -d.y / 3 + "," + (d.x - offset) + ")";
      } else if (d.depth < 1) {
        return "translate(" + d.y + "," + d.x + ")";
      } else if (d.data.name == "Turnovers") {
        return "translate(" + d.y / 4 + "," + (d.x + offset + 35) + ")";
      } else if (d.parent.data.name == "Turnovers") {
        return "translate(" + d.y / 3 + "," + (d.x + offset) + ")";
      }
    });

  // adds the text to the node
  node
    .append("text")
    .attr("dy", ".15em")
    .attr("x", function(d) {
      if (d.data.name == "Assists") {
        return 0;
      }
    })
    .attr("y", function(d) {
      if (d.data.name == "Assists") {
        return 0;
      }
    })

    .style("text-anchor", function(d) {
      return "middle";
    })
    .text(function(d) {
      return d.data.name;
    });
}
function runViz() {
  d3.csv("short-pbp-2017-18.csv").then(function(data) {
    //,,,,,,,AST_TO_PID,,TO_TYPE,,,SHIFTED_PERSON1_TYPE,,

    var filteredData = data.filter(function(d) {
      if (d["AST_BY_PID"] == pid) {
        d["STAT_TYPE"] = "AST";
        return d;
      } else if (d["TO_PID"] == pid) {
        d["STAT_TYPE"] = "TO";
        return d;
      }
    });

    var defs = svg.append("svg:defs");
    filteredData.forEach(function(d, i) {
      var imgURL = ""
      if (d.STAT_TYPE == "AST") {
        imgURL =  "basketball.png"//"http://icons.iconarchive.com/icons/custom-icon-design/flatastic-10/256/Sport-basketball-icon.png";
      } else {
        imgURL =  "clipboard-coach.png"//"https://www.svgrepo.com/show/82319/clipboard-outline.svg";
      }
      defs
        .append("svg:pattern")
        .attr("id", "dot-img-" + d.STAT_TYPE)
        .attr("width", 32)
        .attr("height", 32)
        // .attr("patternUnits", "userSpaceOnUse")
        .append("svg:image")
        .attr("xlink:href", imgURL )
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", 2)
        .attr("y", 0);
    });

    var circles = svg
      .selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("id", function(d, i) {
        return "pt-" + i;
      })
      .attr("class", function(d, i) {
        return "cluster-" + d.STAT_TYPE;
      })
      .attr("cx", width / 2)
      .attr("cy", (height + margin.bottom) / 2)
      .attr("r", 16)
      .style("fill", function(d) {
        return "url(#dot-img-" + d.STAT_TYPE + ")";
      });

    trans();
    function trans() {
      var transforms = [];
      svg
        .selectAll("circle")
        .transition()
        .delay(function(d, i) {
          return delayTime * i;
        })
        .duration(durationSpeed)
        .attrTween("transform", function(d, i, a) {
          if (d.STAT_TYPE == "AST") {
            return translateAlong(link._groups[0][1]);
          } else if (d.STAT_TYPE == "TO") {
            return translateAlong(link._groups[0][0]);
          }
        })
        .on("end", function(d, i, a) {
          if (d.STAT_TYPE == "AST") {
            astCount++;
            d3.selectAll("#ast-count-text").text("Assist Count: " + astCount);
            d3.selectAll("#ratio-text").text(function(d) {
              if (bpCount < 1) {
                return "Ast/Bad Pass Ratio: ";
              } else {
                return "Ast/Bad Pass Ratio: " + (astCount / bpCount).toFixed(1);
              }
            });
            if (playSound) {
              audioGood.play();
            }

            var uniAstTo = d3
              .map(filteredData, function(d) {
                return d.AST_TO_PID;
              })
              .keys();
            uniAstTo = uniAstTo.filter(val => val);
            var ind = uniAstTo.indexOf(d.AST_TO_PID);

            transition2(
              d3.select(this).attr("id"),
              ind + 8,
              d3.select(this).attr("class")
            );
          } else if (d.STAT_TYPE == "TO") {
            if (playSound) {
              audioBad.play();
            }

            if (d.TO_TYPE == "bad-pass-live") {
              bpCount++;
              d3.selectAll("#to-count-text").text("Bad Pass Count: " + bpCount);
              d3.selectAll("#ratio-text").text(function(d) {
                if (bpCount < 1) {
                  return "Ast/Bad Pass Ratio: ";
                } else {
                  return (
                    "Ast/Bad Pass Ratio: " + (astCount / bpCount).toFixed(1)
                  );
                }
              });

              transition2(
                d3.select(this).attr("id"),
                2,
                d3.select(this).attr("class")
              );
            } else if (d.TO_TYPE == "bad-pass-dead") {
              bpCount++;
              d3.selectAll("#to-count-text").text("Bad Pass Count: " + bpCount);
              d3.selectAll("#ratio-text").text(function(d) {
                if (bpCount < 1) {
                  return "Ast/Bad Pass Ratio: ";
                } else {
                  return (
                    "Ast/Bad Pass Ratio: " + (astCount / bpCount).toFixed(1)
                  );
                }
              });
              transition2(
                d3.select(this).attr("id"),
                3,
                d3.select(this).attr("class")
              );
            } else if (d.TO_TYPE == "lost-ball-live") {
              transition2(
                d3.select(this).attr("id"),
                4,
                d3.select(this).attr("class")
              );
            } else if (d.TO_TYPE == "lost-ball-dead") {
              transition2(
                d3.select(this).attr("id"),
                5,
                d3.select(this).attr("class")
              );
            } else if (d.TO_TYPE == "off-foul") {
              transition2(
                d3.select(this).attr("id"),
                6,
                d3.select(this).attr("class")
              );
            } else if (d.TO_TYPE == "violation") {
              transition2(
                d3.select(this).attr("id"),
                7,
                d3.select(this).attr("class")
              );
            }
          }
        });
      function transition2(pt, index, cls) {
        if (index > 7) {
          d3.select("#" + pt)
            .attr("class", cls + "done")
            .transition()
            .duration(durationSpeed)

            .attrTween("transform", function(d, i, t) {
              return translateAlong(link._groups[0][index]);
            })
            .on("end", jitter);
        } else {
          d3.select("#" + pt)
            .attr("class", cls + "done")
            .transition()
            .duration(durationSpeed)

            .attrTween("transform", function(d, i, t) {
              return translateAlong(link._groups[0][index]);
            })
            .on("end", jitter2);
        }
      }
    }

    function jitter() {
      var self = d3.select(this);
      var string = self.attr("transform");
      var translate = string
        .substring(string.indexOf("(") + 1, string.indexOf(")"))
        .split(",");
      var result = translate.reduce(function(prev, curr) {
        return prev.concat(curr.split(" ").map(Number));
      }, []);
      var randx = randomIntFromInterval(-120, -50);
      var randy = randomIntFromInterval(-12, 12);

      self.attr(
        "transform",
        "translate(" + (result[0] + randx) + "," + (result[1] + randy) + ")"
      );
    }
    function jitter2() {
      var self = d3.select(this);
      var string = self.attr("transform");
      var translate = string
        .substring(string.indexOf("(") + 1, string.indexOf(")"))
        .split(",");
      var result = translate.reduce(function(prev, curr) {
        return prev.concat(curr.split(" ").map(Number));
      }, []);
      var randx = randomIntFromInterval(50, 130);
      var randy = randomIntFromInterval(-12, 12);

      self.attr(
        "transform",
        "translate(" + (result[0] + randx) + "," + (result[1] + randy) + ")"
      );
    }

    function randomIntFromInterval(min, max) {
      return Math.random() * (max - min + 1) + min;
    }

    function translateAlong(path) {
      var l = path.getTotalLength() * 2;
      // return function(d, i, a) {
      return function(t) {
        var p = path.getPointAtLength(l - t * l);
        return "translate(" + p.x + "," + p.y + ")";
      };
      // };
    }
  });
}
