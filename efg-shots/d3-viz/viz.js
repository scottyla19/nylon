var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 600- margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;



// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var recth = d3.scaleLinear().range([1,30])
var rectw = d3.scaleLinear().range([1,30])

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
var select = d3.select('body')
  .append('select')
      .attr('id','type-select')
      .style("position","absolute")
      .style("left", "10px")
   .style("top", "5px")
    .on('change',onchange)
    
// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
     }))
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


plotGraph("All")
function onchange() {
    selectValue = d3.select('#type-select').property('value')
    plotGraph(selectValue)
};
function filterJSON(json, key, value) {
    var result = [];
    json.forEach(function(val,idx,arr){
      if(val[key] == value){
      
        result.push(val)
      }
    })
    return result;
  }
// Get the data
function plotGraph(selectedVal){
  d3.csv('plot-data.csv')
  .then(function(data) {
    
      data.unshift({"SCORER_TYPE":"All"})
      var options = select
      .selectAll('option')
      .data(d3.map(data, function(d){return d.SCORER_TYPE;}).keys())
      .enter()
      .append("option")
      .text(function(d){return d;})
      data.pop()
        if (selectedVal != "All") {
            data =  filterJSON(data, "SCORER_TYPE",selectedVal)

        }
        console.log(data)
      data.forEach(function(d) {
        // d.PID = +d.PID;
        d.FGA_PG = +d.FGA_PG;
        d.EFG_PCT = +d.EFG_PCT; 
        d.UAST_PCT = +d.UAST_PCT; 
        d.RA_AST_PCT = 1-d.RA_AST_PCT; 
        d.VT_FGA_FREQ = +d.VT_FGA_FREQ;
        d.T_FGA_FREQ = +d.T_FGA_FREQ;
        d.O_FGA_FREQ = +d.O_FGA_FREQ;
        d.WO_FGA_FREQ = +d.WO_FGA_FREQ;
        d.NON_RA_PCT = +d.NON_RA_PCT
        
        });
        svg.selectAll("*").remove();
        var gradient = svg.append("defs")
        .selectAll("linearGradient")
        .data(data)
        .enter().append("linearGradient")
        .attr("id", function(d){ return "gradient-" + d.PID; })
          .attr("x1", "50%")
          .attr("y1", "100%")
          .attr("x2", "50%")
          .attr("y2", "0%")
          .attr("spreadMethod", "pad");
      
      gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#2dc937")
          .attr("stop-opacity", 1);
       
        gradient.append("stop")
          .attr("offset", (function(d) {return d.WO_FGA_FREQ*100 + "%"})) //d.WO_PCT
          .attr("stop-color", "#2dc937")
          .attr("stop-opacity", 1);
        gradient.append("stop")
          .attr("offset", function(d) {return (d.WO_FGA_FREQ*100+5) + "%"}) //d.WO_PCT + 5
          .attr("stop-color", "#ffff00  ")
          .attr("stop-opacity", 1);
        gradient.append("stop")
          .attr("offset", function(d) {return ((d.WO_FGA_FREQ+d.O_FGA_FREQ)*100) + "%"}) //d.WO_PCT + d.O_PCT 
          .attr("stop-color", "#ffff00  ")
          .attr("stop-opacity", 1);
        gradient.append("stop")
          .attr("offset", function(d) {return ((d.WO_FGA_FREQ+d.O_FGA_FREQ)*100+5) + "%"}) //d.WO_PCT + d.O_PCT +5
          .attr("stop-color", "#FFE100  ")
          .attr("stop-opacity", 1);
       gradient.append("stop")
          .attr("offset", function(d) {return ((d.WO_FGA_FREQ+d.O_FGA_FREQ+d.T_FGA_FREQ)*100) + "%"}) //d.WO_PCT + d.O_PCT + d.T_PCT
          .attr("stop-color", "#ffa500 ")
          .attr("stop-opacity", 1);
      gradient.append("stop")
          .attr("offset",  function(d) {return ((d.WO_FGA_FREQ+d.O_FGA_FREQ+d.T_FGA_FREQ)*100+5) + "%"}) //d.WO_PCT + d.O_PCT + d.T_PCT + 5
          .attr("stop-color", "#c00 ")
          .attr("stop-opacity", 1);
      gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#c00")
          .attr("stop-opacity", 1);
     var ydom = d3.extent(data, function(d) { return d.EFG_PCT; })
     ydom[0] -= .05
     ydom[1] += .05

     var xdom = d3.extent(data, function(d) { return d.FGA_PG; })
     xdom[0] -= 1
     xdom[1] += 1
      x.domain(xdom);
      y.domain(ydom);
    
      recth.domain(d3.extent(data, function(d) { return d.UAST_PCT; }))
      rectw.domain(d3.extent(data, function(d) { return d.RA_AST_PCT; }))
      // Add the scatterplot
        svg.selectAll("rect")
            .data(data)
            .enter().append("rect")
            //   .attr("r", 5)
            .attr("rx", function(d) { return d.UAST_PCT*5; })
            .attr("ry", function(d) { return d.RA_AST_PCT*5; })
            .attr("x", function(d) { return x(d.FGA_PG) - rectw(d.RA_AST_PCT)/2; })
            .attr("y", function(d) { return y(d.EFG_PCT); })
            .attr("height", function(d) { return d.UAST_PCT*30; })
            .attr("width", function(d) { return d.RA_AST_PCT*30; })
            .attr("fill-opacity","0.7")
            .style("fill", function(d) {return "url(#gradient-" + d.PID + ")";})
            .style("stroke","black")
            .style("stroke-width","1px")
            .on("mouseover", function(d) {		
            div.transition()		
                .duration(300)		
                .style("opacity", .9);		
            div.html(d.PLAYER + "<br/>"  
                    + "eFG%: " + d3.format(".3f")(d.EFG_PCT)+ "<br/>"
                    + "FGA PG: " + d3.format(".1f")(d.FGA_PG)+ "<br/>"
                    + "NON_RA%: " + d3.format(".1f")(d.RA_AST_PCT*100)+ "%<br/>"
                    + "UAST%: " + d3.format(".1f")(d.UAST_PCT*100)+ "%<br/>"
                    + "<span style='color:#c00'>Very Tight Freq: " + d3.format(".1f")(d.VT_FGA_FREQ*100)+ "%</span><br/>"
                    + "<span style='color:#ffa500'>Tight Freq: " + d3.format(".1f")(d.T_FGA_FREQ*100)+ "%</span><br/>"
                    + "<span style='color:#ffff00'>Open Freq: " + d3.format(".1f")(d.O_FGA_FREQ*100)+ "%</span><br/>"
                    + "<span style='color:#2dc937'>Wide Open Freq: " + d3.format(".1f")(d.WO_FGA_FREQ*100)+ "%</span><br/>")	
                // .style("left", (x(d.FGA_PG) + 80)+ "px")  
                .style("left", (d3.event.pageX + 15) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
            .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
            })
    
      
      
      // Add the X Axis
      svg.append("g")
            
          .attr("transform", "translate(0," + (height - 5)+ ")")
          .call(d3.axisBottom(x));
    
          svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.bottom - 5) + ")")
      .style("text-anchor", "middle")
      .attr("class","label-text")
      .text("FGA Per Game");
      
      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .attr("class","label-text")
      .style("text-anchor", "middle")
      .text("eFG%");   
         
    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 + (margin.top))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px")  
      .text("Traffic Light Graphic Delight");
      
      
    
      
  })
}

