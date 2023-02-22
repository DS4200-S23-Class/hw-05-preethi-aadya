// Constants for the visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left:50, right:50, top:50, bottom:50};
const VIS_HEIGHT = FRAME_HEIGHT - (MARGINS.top + MARGINS.bottom);
const VIS_WIDTH = FRAME_WIDTH - (MARGINS.left + MARGINS.right);

// create a frame to add the svg in vis1 div
const FRAME1 = d3.select("#vis1")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// read in the scatter plot csv
d3.csv("data/scatter-data.csv").then((DATA) => {

    // Scaling the constants to map x and y values 
    const X_SCALE = d3.scaleLinear()
        .domain([0, 10])
        .range([0, VIS_WIDTH]);
    const Y_SCALE = d3.scaleLinear()
        .domain([10, 0])
        .range([0, VIS_HEIGHT]);


	// Plots the data points on to the scatter plot 
	FRAME1.selectAll("points")
        .data(DATA)
        .enter()
        .append("circle")
        .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); })
        .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top) ; })
        .attr("r", 6)
        .attr("class", "point");

	// Adds the axises to the scatter plot 
	FRAME1.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(X_SCALE).ticks(10))
        .attr("font-size", "30px");
	FRAME1.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
		.call(d3.axisLeft(Y_SCALE).ticks(10))
        .attr("font-size", "30px");

    // displays the last point clicked text 
    function pointClicked() {

        let xCoord = d3.select(this).attr("cx");
        let yCoord = d3.select(this).attr("cy");

        xCoord = Math.round(X_SCALE.invert(xCoord - MARGINS.left));
        yCoord = Math.round(Y_SCALE.invert(yCoord - MARGINS.top));
        
        document.getElementById("last_point").innerHTML = "Last Point Clicked: (" + xCoord + "," + yCoord + ")";

        this.classList.toggle('point-border');
    }

    // adds the new point the user inputs on to the plot 
    function addPoint() {
        let xCoord = document.getElementById("x-coord");
        let yCoord =  document.getElementById("y-coord");

        let x1 = xVal.value;
        let y1 = yVal.value;

        let x = (x *50);
        let y = 350-(y*30)

        FRAME1.append("circle")
            .attr("cx", (d) => { return (X_SCALE(x) + MARGINS.left); })
            .attr("cy", (d) => { return (Y_SCALE(y) + MARGINS.top) ; })
            .attr("r", 6)
            .attr("class", "point")
            .on("click", pointClicked);
    }
    
    // event listeners 
    d3.selectAll("#enter").on("click", addPoint);
    d3.selectAll(".point").on("click", pointClicked);
});




// create a frame to add the svg in vis2 div
const FRAME2 = d3.select("#vis2")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame"); 

// reads in the bar chart csv
d3.csv("data/bar-data.csv").then((DATA) => {
    
    // the max Y used for scaling
	const MAX_Y = d3.max(DATA, (d) => { return parseInt(d.amount); });

	const X_SCALE = d3.scaleBand()
        .domain(DATA.map(function(d) { return d.category; }))
        .range([0, VIS_WIDTH])
        .padding(.2);
	const Y_SCALE = d3.scaleLinear()
        .domain([(MAX_Y+1), 0])
        .range([0, VIS_HEIGHT]);

    // Plots onto the graph 
    FRAME2.selectAll("bars")  
        .data(DATA)
        .enter()       
        .append("rect")  
            .attr("x", (d) => { return X_SCALE(d.category) + MARGINS.left; }) 
            .attr("y", (d) => { return Y_SCALE(d.amount) +  MARGINS.top; })
            .attr("width", X_SCALE.bandwidth())
            .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE(d.amount); })
            .attr("class", "bar") 

	// Adds the axises to vis2
	FRAME2.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(X_SCALE).ticks(7))
		.attr("font-size", '15px');  
	FRAME2.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
		.call(d3.axisLeft(Y_SCALE).ticks(10))
		.attr("font-size", '15px');

	// Tooltip 
    const TOOLTIP = d3.select("#vis2")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

   
    // shows the tooltip 
    function hoverToolTip(){
        TOOLTIP.style("opacity", 1);
    }

    // hides the tooltip 
    function mouseOutToolTip(){
        TOOLTIP.style("opacity", 0);
    }

    // moves the tool tip
    function moveToolTip(event, d){
        TOOLTIP.html("Category " + d.category + "<br>Value: " + d.amount)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px");
    }

    // event listeners 
    d3.selectAll(".bar")
        .on("mouseover", hoverToolTip)
        .on("mouseleave", mouseOutToolTip)
        .on("mousemove", moveToolTip);
});  