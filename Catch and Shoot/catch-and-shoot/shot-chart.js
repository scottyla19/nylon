// svg
// .append('image')
// .attr('xlink:href','https://twemoji.maxcdn.com/2/72x72/1f3c0.png')
// .attr('class', 'avengers')
//     .attr('height', '75')
//     .attr('width', '150')
//     .attr('x', '72')
//     .attr('y', '72')

//     svg
// .append('image')
// .attr('xlink:href','https://twemoji.maxcdn.com/2/72x72/1f9f1.png')
// .attr('class', 'avengers')
//     .attr('height', '75')
//     .attr('width', '150')
//     .attr('x', '72')
//     .attr('y', '72')

//     // svg
//     // .append('emoji')
//     // .attr('symbol', 'smile') // codes taken from http://www.emoji-cheat-sheet.com/ the enclosing :colons: aren't necessary
//     // // do all the standard d3 stuff
//     // .attr('width', 30)
//     // .attr('height', 30)
//     // .attr('x', function(d) {
//     //     return 50
//     // })
//     // .attr('y', function(d) {
//     //     return 50;
//     // })

//     // .style("fill", "url(#image)");

//     console.log(  twemoji.parse(twemoji.convert.fromCodePoint('274c')))

var sizeMultiplier = 13;
var margin = { top: 20, right: 20, bottom: 20, left: 20 };
width = 50 * sizeMultiplier; //- margin.left - margin.right;
height = 47 * sizeMultiplier; //   - margin.top - margin.bottom;
var centerX = margin.left / 2 + width / 2;

var missImg =""
var makeImg =""

svg.style("width", 1000).style("height", 1000);

var lineData = [
  [
    // border
    [margin.left, margin.top],
    [width, margin.top],
    [width, height],
    [margin.left, height],
    [margin.left, margin.top]
  ],
  [
    //left corner
    [margin.left + 3 * sizeMultiplier, margin.top],
    [margin.left + 3 * sizeMultiplier, margin.top + 14 * sizeMultiplier]
  ],
  [
    //right corner
    [width - 3 * sizeMultiplier, margin.top],
    [width - 3 * sizeMultiplier, margin.top + 14 * sizeMultiplier]
  ],
  [
    //key
    [margin.left / 2 + width / 2 - 8 * sizeMultiplier, margin.top],
    [
      margin.left / 2 + width / 2 - 8 * sizeMultiplier,
      margin.top + 19 * sizeMultiplier
    ],
    [
      margin.left / 2 + width / 2 + 8 * sizeMultiplier,
      margin.top + 19 * sizeMultiplier
    ],
    [margin.left / 2 + width / 2 + 8 * sizeMultiplier, margin.top]
  ]
];

//   var leftCorner3 = [
//     [margin.left + 45, margin.top],
//     [margin.left + 45, margin.top + 210],
//   ]
var lineGenerator = d3.line();
lineData.forEach(function(d, i) {
  var pathData = lineGenerator(d);

  svg
    .append("path")
    .attr("d", pathData)
    .style("fill", "none")
    .style("stroke", "black");
});
function drawArc(startAngle, endAngle, radius, cx, cy) {
  var arcGenerator = d3.arc();

  // Generate the path strin
  //   var rad = 2.02;
  var arcData = arcGenerator({
    startAngle: startAngle, //1.95707942809,
    endAngle: endAngle,
    innerRadius: radius,
    outerRadius: radius
  });

  // Create a path element and set its d attribute
  svg
    .append("g")
    .append("path")
    .attr("d", arcData)
    .attr("transform", "translate(" + cx + "," + cy + ")")
    .style("fill", "none")
    .style("stroke", "black");
}

drawArc(
  2.02,
  2 * Math.PI - 2.02,
  23.75 * sizeMultiplier,
  centerX,
  5.0 * sizeMultiplier
);
drawArc(
  0.5 * Math.PI,
  1.5 * Math.PI,
  6 * sizeMultiplier,
  centerX,
  19.0 * sizeMultiplier + margin.top
);
drawArc(
  0.5 * Math.PI,
  1.5 * Math.PI,
  4 * sizeMultiplier,
  centerX,
  4.0 * sizeMultiplier + margin.top
);
drawArc(
  0,
  2 * Math.PI,
  0.75 * sizeMultiplier,
  centerX,
  4 * sizeMultiplier + margin.top
);

  plotGraph()
  
 
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
function plotGraph() {

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

    d.imgID = "grump_avatar" + i;
  });

  // d3.selectAll("select").remove()

  var x = d3
    .scaleLinear()
    //.domain([0,d3.max(data, function(d) { return d.FGA; })])  //  d3.extent(data, function(d){return d.FGA})
    .domain(
      d3.extent(data, function(d) {
        return d.LOC_X;
      })
    )
    .range([margin.left, width]);

  var y = d3
    .scaleLinear()
    //.domain([0,d3.max(data, function(d) { return d.FGM; })])
    .domain(
      d3.extent(data, function(d) {
        return d.LOC_Y;
      })
    )
    .range([height, margin.top]);

  var group = svg
    .append("g")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");

  var points = group
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class","shotCircle")
    .attr("cx", function(d) {
      return width / 2 - margin.left / 2 + sizeMultiplier * (d.LOC_X / 10);
    })
    .attr("cy", function(d) {
      return (
        margin.top + 4 * sizeMultiplier + sizeMultiplier * (d.LOC_Y / 10.75)
      );
    })
    .attr("r", 10)
    // .attr("fill-opacity", function(d) {
    //     if (d.EVENT_TYPE === "Missed Shot" && options.emoji === "Open and Closed") {
    //       return "0";
    //     } else {
    //       return "1";
    //     }
    //   })
    .attr("fill-opacity", function(d) {
      if (d.EVENT_TYPE === "Missed Shot" && options.emoji ==="Open and Closed") {
        return "0";
      } else {
        return "1";
      }
    })
    .style("fill", function(d,i) {
        if (options.emoji ==="Open and Closed") {
            return "black"
        }else{
            return "url(#"+d.imgID+")"
        }
      
  })
  .style("stroke", function(d,i) {
    if (options.emoji ==="Open and Closed") {
        return "black"
    }else{
        return ""
    }})

  


var legendRange = [missImg, makeImg]

// var legendImgs = ["https://twemoji.maxcdn.com/2/72x72/274c.png","https://twemoji.maxcdn.com/2/72x72/1f9f1.png",
// "https://twemoji.maxcdn.com/2/72x72/2b55.png","https://twemoji.maxcdn.com/2/72x72/1f3c0.png", "black", "gray"]
var legendVals = d3.set(data.map( function(d) { return d.EVENT_TYPE } ) ).values()
      
   
      
      var legendVals1 = d3.scaleOrdinal()
          .domain(legendVals)
          .range([missImg,makeImg]);
      
     
      
      var svgLegned = svg.append("svg")
          .attr("width", width).attr("height", height)
          
      //D3 Vertical Legend//////////////////////////
      var legend = svgLegned.selectAll('.legend')
          .data(legendVals1.domain())
          .enter().append('g')
          .attr("class", "legends")
          .attr("transform", function (d, i) {
          {
              return "translate(50," + (i * 20 + height - 100 )+ ")"
          }
      })

      
      if (options.emoji === "Open and Closed") {
          legend.append('circle')
          .attr("cx", 10)
          .attr("cy", 10)
          .attr("r", 8)
          .attr("fill-opacity", function(d, i) {
              if (i == 0 ) {
                return "0";
              } else {
                return "1";
              }
            })
            .style("fill", "black")
          .style("stroke", "black")
         
          // })
      }else{
          legend
          .append('image')
          .attr('xlink:href',function (d, i) {
              return legendRange[i]
          })
          // .attr('class', 'avengers')
              .attr('height', '16')
              .attr('width', '16')
              .attr('x', 0)
              .attr('y', 0)
      }
      
      

      legend.append('text')
          .attr("x", 20)
          .attr("y", 16)
      //.attr("dy", ".35em")
      .text(function (d, i) {
          return d
      })
          .attr("class", "textselected")
          .style("text-anchor", "start")
          .style("font-size", 15)


}
