var delayTime = 300;
var durationSpeed = 400;
var pid = 2544;

var pName = "LeBron James"
var margin = { top: 40, right: 10, bottom: 100, left: 10 },
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var select = d3
  .select("body")
  .append("select")
  .attr("id", "player-select")
  .on("change", onchange);


  var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
var options = select.selectAll("option");
var myDat = [];

d3.csv("player-data.csv").then(function(data) {
  data.forEach(function(d) {
    myDat.push(d.PLAYER1_ID);
  });

  options
    .data(data)
    .enter()
    .append("option")
    .property("selected", function(d) {
      return d.PLAYER1_NAME === "LeBron James";
    })
    .text(function(d) {
      return d.PLAYER1_NAME;
    });
});



plotGraph()
function onchange() {
    svg.selectAll("*").interrupt();
    d3.select("svg").remove();
    svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    
  var e = d3.select("#player-select").property("selectedIndex");
  var selpid = myDat[e];
  selectValue = d3.select("#player-select").property("value");
  pid = parseInt(selpid);
  pName = selectValue;
  
  plotGraph()
  //    console.log(selectValue, selpid)
}

function plotGraph(){
  var treeData = {
    name: pName,
    children: [
      {
        name: "Shooting",
        children: [
          { name: "2FG-Makes" },
          { name: "2FG-Misses" },
          { name: "3FG-Makes" },
          { name: "3FG-Misses" },
          { name: "FT-Makes" },
          { name: "FT-Misses" }
        ]
      },
      {
        name: "Assists"
        //   children: [
        //     { name: "Player 1" },
        //     { name: "Player 2" },
        //     { name: "Player 3" },
        //     { name: "Player 4" },
        //     { name: "Player 5" },
        //     { name: "Player 6" },
        //     { name: "Player 7" },
        //     { name: "Player 8" }
        //   ]
      },
      {
        name: "Turnovers"
        //   children: [
        //     { name: "BP_Live" },
        //     { name: "BP_Dead" },
        //     { name: "LB_Live" },
        //     { name: "LB_Dead" },
        //     { name: "Off_Foul" },
        //     { name: "Violation" }
        //   ]
      },
      {
        name: "Rebounds",
        children: [{ name: "OREB" }, { name: "DREB" }]
      },
      {
        name: "Steals"
      },
      {
        name: "Blocks"
      },
      {
        name: "Fouls"
      }
    ]
  };

  // var data = [{ x: 100, y: 100 }, { x: 100, y: 200 }, { x: 300, y: 300 }];
  // set the dimensions and margins of the diagram
  
  var points = [
    [width / 2, 0],
    [width / 5, 200],
    [(2 * width) / 5, 200],
    [(3 * width) / 5, 200],
    [(4 * width) / 5, 200]
  ];
  // declares a tree layout and assigns the size
  var treemap = d3.tree().size([width, height]);

  //  assigns the data to a hierarchy using parent-child relationships
  var nodes = d3.hierarchy(treeData);

  // maps the node data to the tree layout
  nodes = treemap(nodes);

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  
    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // adds the links between the nodes
  var link = g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", function(d) {
      return (
        "M" +
        d.x +
        "," +
        d.y +
        "C" +
        d.x +
        "," +
        (d.y + d.parent.y) / 2 +
        " " +
        d.parent.x +
        "," +
        (d.y + d.parent.y) / 2 +
        " " +
        d.parent.x +
        "," +
        d.parent.y
      );
    });

  // adds each node as a group
  var node = g
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("g")
    .attr("class", function(d) {
      return "node" + (d.children ? " node--internal" : " node--leaf");
    })
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  // adds the text to the node
  node
    .append("text")
    .attr("dy", ".15em")
    .attr("x", function(d) {
      return d.depth <= 1 ? 0 : -5;
    })
    .attr("y", function(d) {
      return d.depth <= 1 ? -10 : 0;
    })
    .attr("transform", function(d) {
      return d.depth <= 1 ? "rotate(0)" : "rotate(90)";
    })
    .style("text-anchor", function(d) {
      return d.depth <= 1 ? "middle" : "end";
    })
    .text(function(d) {
      return d.data.name;
    });

  d3.csv("short-pbp-2017-18.csv").then(function(data) {
    //,,,,,,,AST_TO_PID,,TO_TYPE,,,SHIFTED_PERSON1_TYPE,,
  console.log(pid)
    var filteredData = data.filter(function(d) {
      if (d["MISS_3PT_PID"] == pid) {
        d["STAT_TYPE"] = "3PT-Miss";
        return d;
      } else if (d["MAKE_3PT_PID"] == pid) {
        d["STAT_TYPE"] = "3PT-Make";
        return d;
      } else if (d["MISS_2PT_PID"] == pid) {
        d["STAT_TYPE"] = "2PT-Miss";
        return d;
      } else if (d["MAKE_2PT_PID"] == pid) {
        d["STAT_TYPE"] = "2PT-Make";
        return d;
      } else if (d["MISS_FT_PID"] == pid) {
        d["STAT_TYPE"] = "FT-Miss";
        return d;
      } else if (d["MAKE_FT_PID"] == pid) {
        d["STAT_TYPE"] = "FT-Make";
        return d;
      } else if (d["AST_BY_PID"] == pid) {
        d["STAT_TYPE"] = "AST";
        return d;
      } else if (d["BLK_PID"] == pid) {
        d["STAT_TYPE"] = "BLK";
        return d;
      } else if (d["STL_PID"] == pid) {
        d["STAT_TYPE"] = "STL";
        return d;
      } else if (d["OREB_PID"] == pid) {
        d["STAT_TYPE"] = "OREB";
        return d;
      } else if (d["TO_PID"] == pid) {
        d["STAT_TYPE"] = "TO";
        return d;
      } else if (d["DREB_PID"] == pid) {
        d["STAT_TYPE"] = "DREB";
        return d;
      } else if (d["PF_PID"] == pid) {
        d["STAT_TYPE"] = "PF";
        return d;
      }
    });
    console.log(filteredData)
    //   var quarter = svg.selectAll('text')
    //   .data(filteredData)
    //   .enter()
    //   .append('text')
    //   .attr('x', 100)
    //   .attr('y', 199)
    //   .attr('fill', '#000')
    //   .text(function(d) {console.log("quarter"); return d.period })

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
      .attr("cx", margin.left)
      .attr("cy", margin.top)
      .attr("r", 4);
    // .attr("transform", "translate(" + points[0] + ")");
    trans();
    function trans() {
      var transforms = [];
      svg
        .selectAll("circle")
        //   .data(filteredData)
        //   .enter()
        //   .append("circle")
        .transition()
        .delay(function(d, i) {
          // console.log("here");
          return delayTime * i;
        })
        .duration(durationSpeed)
        .attrTween("transform", function(d, i, a) {
          if (d.STAT_TYPE.includes("Make") || d.STAT_TYPE.includes("Miss")) {
            return translateAlong(link._groups[0][0]);
          } else if (d.STAT_TYPE == "AST") {
            return translateAlong(link._groups[0][1]);
          } else if (d.STAT_TYPE == "TO") {
            return translateAlong(link._groups[0][2]);
          } else if (d.STAT_TYPE.includes("REB")) {
            return translateAlong(link._groups[0][3]);
          } else if (d.STAT_TYPE == "STL") {
            return translateAlong(link._groups[0][4]);
          } else if (d.STAT_TYPE == "BLK") {
            return translateAlong(link._groups[0][5]);
          } else if (d.STAT_TYPE == "PF") {
            return translateAlong(link._groups[0][6]);
          } else {
          }
        })
        .on("end", function(d, i, a) {
          if (d.STAT_TYPE == "2PT-Make") {
            transition2(
              d3.select(this).attr("id"),
              7,
              d3.select(this).attr("class")
            );
          } else if (d.STAT_TYPE == "2PT-Miss") {
            transition2(
              d3.select(this).attr("id"),
              8,
              d3.select(this).attr("class")
            );
          } else if (d.STAT_TYPE == "3PT-Make") {
            transition2(
              d3.select(this).attr("id"),
              9,
              d3.select(this).attr("class")
            );
          } else if (d.STAT_TYPE == "3PT-Miss") {
            transition2(
              d3.select(this).attr("id"),
              10,
              d3.select(this).attr("class")
            );
          } else if (d.STAT_TYPE == "FT-Make") {
            transition2(
              d3.select(this).attr("id"),
              11,
              d3.select(this).attr("class")
            );
          } else if (d.STAT_TYPE == "FT-Miss") {
            transition2(
              d3.select(this).attr("id"),
              12,
              d3.select(this).attr("class")
            );
          } else if (d.STAT_TYPE == "OREB") {
            transition2(
              d3.select(this).attr("id"),
              13,
              d3.select(this).attr("class")
            );
          } else if (d.STAT_TYPE == "DREB") {
            transition2(
              d3.select(this).attr("id"),
              14,
              d3.select(this).attr("class")
            );
          } else if ((d.STAT_TYPE == "AST") || (d.STAT_TYPE == "TO") ||(d.STAT_TYPE == "STL") ||(d.STAT_TYPE == "BLK") ||(d.STAT_TYPE == "PF") ){
            transition2(
              d3.select(this).attr("id"),
              -1,
              d3.select(this).attr("class")
            );
          }
        });
      function transition2(pt, index, cls) {
        if (index < 0) {
            console.log(pt)
            jitter(pt)
        //   d3.select("#" + pt)
        //     .attr("class", cls + "done")
        //     .transition()
        //     .duration(durationSpeed)
        //     .on("end", jitter2); //jitter(d3.select("#"+pt).attr('class')))
        } else {
          d3.select("#" + pt)
            .attr("class", cls + "done")
            .transition()
            .duration(durationSpeed)

            .attrTween("transform", function(d, i, t) {
              return translateAlong(link._groups[0][index]);
            })
            .on("end", jitter2); //jitter(d3.select("#"+pt).attr('class')))
        }
      }
    }

    function jitter(thePoint) {     
        
        var stuff = d3.select("#"+thePoint);
        var string = stuff.attr("transform");
        console.log(stuff)
        var translate = string
          .substring(string.indexOf("(") + 1, string.indexOf(")"))
          .split(",");
        var result = translate.reduce(function(prev, curr) {
          return prev.concat(curr.split(" ").map(Number));
        }, []);
        var randx = randomIntFromInterval(-30, 30);
        var randy = randomIntFromInterval(0, 90);
  
        stuff.attr(
          "transform",
          "translate(" + (result[0] + randx) + "," + (result[1] + randy) + ")"
        );
      }
    function jitter2() {
      var self = d3.select(this);
      var string = self.attr("transform");
      console.log(self)
      var translate = string
        .substring(string.indexOf("(") + 1, string.indexOf(")"))
        .split(",");
      var result = translate.reduce(function(prev, curr) {
        return prev.concat(curr.split(" ").map(Number));
      }, []);
      var randx = randomIntFromInterval(-30, 30);
      var randy = randomIntFromInterval(0, 90);

      self.attr(
        "transform",
        "translate(" + (result[0] + randx) + "," + (result[1] + randy) + ")"
      );
    }

    function randomIntFromInterval(min, max) {
      return Math.random() * (max - min + 1) + min;
    }
    //   function jitter(jclass){
    //     var dat = d3.selectAll("."+jclass)
    //     .enter()

    //     var simulation = d3.forceSimulation(dat)
    //         .force('charge', d3.forceManyBody().strength(5))
    //         .force('center', d3.forceCenter(width / 2, height / 2))
    //         .force('collision', d3.forceCollide().radius(4))
    //         // .on('tick', ticked(jclass,dat));

    //   }
    // Returns an attrTween for translating along the specified path element.
    // Notice how the transition is slow for the first quarter of the aniimation
    // is fast for the second and third quarters and is slow again in the final quarter
    // This is normal behavior for d3.transition()
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
