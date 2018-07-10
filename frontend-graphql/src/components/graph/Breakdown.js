import React from 'react'
import * as d3 from 'd3'
import { compose, branch, renderNothing, flattenProp } from 'recompose' 
import { gql, graphql } from 'react-apollo'
import '../css/MainContent.css'

//Ethan used square.github.io/intro-to-d3/examples for this!!

const breakdownQuery = gql`
query breakdown($raceID: ID!) {
    breakdown(id:$raceID, level: WARD)
    raceWardStats(id:$raceID) {
        registeredVoters
        turnout
    }
    race(id:$raceID) {
        id
        candidates {
            id
            name
            color
        }
    }
}
`


const wrap = (text, width) => {
    text.each(function() {
	var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
	while (word = words.pop()) {
	    line.push(word)
	    tspan.text(line.join(" "))
	    if (tspan.node().getComputedTextLength() > width) {
		line.pop()
		tspan.text(line.join(" "))
		line = [word]
		tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word)
	    }
	}
    })
}

const Legend = ({candidates = []}) => (
    <div className="scatter-plot_legend" style={{}}>
	Winning Candidate:
	{candidates.map( ({name, color}) => 
	    <div key={name}><i style={{background: color}}></i>{name}</div>
	 )}
    </div>
)

const loadD3 = (data = []) => {

    //data comes in as a huge array; each entry in the data is one candidate per ward.  So if there are 20 wards and 2 candidates, there will be 40 elements in the array.

    //create and array 'candidates' that is an array of the candidates (also will be the z axis)
    let candidates = [];
    data.race.candidates.forEach(function(candidate) {
        candidates.push(candidate.name)
    });

    //turn the data into a nested array that is better for our uses. Each object in the array follows the format:  
    //      {ward: int, candidate0pct: int, candidate1pct: int...}
    
    //wards is an array with just the ward numbers
    let wards = [...new Set(data.breakdown.map(item=>item.ward))];



    let wardData = [];
    for(let i=0; i<wards.length; i++) {
        let obj = {};
        obj.ward = wards[i];
        wardData.push(obj);
    };
    
    //the following code makes the height of the bar the  total votes cast, broken down by candidate.
    //
    data.breakdown.forEach(function(element){
        for(let i = 0; i < wardData.length; i++){
            if (wardData[i].ward === element.ward) {
                let can = element.candidate;
                wardData[i][can] = element.votes; 
            }
        }
        
    });


    //now let's get to drawing!!
    
    const stack = d3.stack()
		    .keys(candidates);
    const stacked = stack(wardData);
    const maxY = d3.max(stacked, function(d) {
        return d3.max(d, function(d) {
            return d[1];
        });
    }); 

    const margin = {top:10, right:10, bottom:90, left: 80};
    const width = 960 - margin.left - margin.right; 
    const height = 600 - margin.top - margin.bottom;
    const svgWidth = width+margin.left + margin.right;
    const svgHeight = height+margin.top + margin.bottom;

    const yScale = d3.scaleLinear()
		     .range([height, 0])
		     .domain([0, (maxY*1.1)]);

    const xScale = d3.scaleBand() 
		     .rangeRound([0, width])
		     .padding(0.25) 
		     .domain(wards);

    const xAxis = d3.axisBottom()
		    .scale(xScale)
        .tickValues( xScale.domain().filter((d,i) => { 
            return !(i%5)
          })
        );
    
    
    const yAxis = d3.axisLeft()
		    .scale(yScale)
		    .ticks(5)

    const svg = d3.select("#breakdown");
    svg.selectAll('*').remove()


    //svgContainer is the element we're appending the layers to
    const svgContainer = svg 
        .append('div')
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
	.classed("svg-content-responsive", true)
	.append("g").attr("class", "container")
	.attr("transform", "translate("+ margin.left +","+ margin.top +")")

    
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    
    //each layer corresponds to a candidate.  Each rect in the layer is the percent that candidate got in that ward
    const layers = svgContainer.selectAll('g.layer')
			       .data(stacked, d => d.key)
			       .enter()
			       .append('g')
			       .attr('class', 'layer')
			       .attr('width', svgWidth)
			       .attr('fill', d => data.race.candidates[d.index].color);

    layers.selectAll('rect')
          .data(d => d)
          .enter()
          .append('rect')
          .attr('x', d => xScale(d.data.ward))
          .attr('width', width/wards.length - 5)
          .attr('y', d => yScale(d[1]))
          .attr('height', d => yScale(d[0]) - yScale(d[1]));
    /*
       .on("mouseover", functiion(d) {
       div.transition()
       .duration(200)
       .style("opacity", 9);
       div.html(d.votes + "votes");
       })
       .on("mouseout", function(d) {
       div.transition()
       .duration(500)
       .style("opacity", 500)
       }); 
     */

    svgContainer.append("g")			
		.attr("class", "grid")
		.call( d3.axisLeft(yScale)
			 .ticks(5)
			 .tickSize(-width)
			 .tickFormat("")
		);

    // the axes

    const xAxis_g = svgContainer.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + (height) + ")")
				.call(xAxis)
				.selectAll("text")
				.call(wrap, xScale.bandwidth()*2);
    

    const yaxis_g = svgContainer.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6).attr("dy", ".71em");

    // Controls the text labels at the top of each bar. Partially repeated in the resize() function below for responsiveness.
    svgContainer.selectAll(".text")  		
		.data(data)
		.enter()
		.append("text")
		.attr("class","label")
		.attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
		.attr("y", d => yScale(d.pct) + 1)
		.attr("dy", ".7em")
		.text(d => `${d.pct}%`);

    //y axis label
    svgContainer.append("text")
            		.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            		.attr("transform", "translate("+ (-60) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            		.text("Number of Votes");
    //x axis label 
    svgContainer.append("text")
                .attr("text-anchor", "middle")
		            .attr("transform", "translate("+ (width/2) +","+(height + 50)+ ")")    
                .text("Ward");


}


class Breakdown extends React.Component {

    componentDidMount() {
	loadD3(this.props.data)
    }

    componentWillReceiveProps(next) {
	if(this.props.data!== next.data) {
	    loadD3(next.data)
	}
    }
    

    shouldComponentUpdate() {
	return false
    }
    


    render() {
	return (
            <div id="breakdown_wrap">
                <div id="breakdown" />
                <Legend candidates={this.props.data.race.candidates}/>
            </div>
	)
    }
}

export default compose(
    graphql(breakdownQuery),
    flattenProp('data'),
    branch (
        ({loading, error}) => loading || error,
        renderNothing
    )
)(Breakdown)
