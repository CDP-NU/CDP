import React from 'react'
import R from 'ramda'
import { compose } from 'redux'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import { withState } from 'recompose'
import './BarGraph.css'
import withMutation from './Mutation'
import { getBarGraphCandidates } from '../selectors'

//http://cagrimmett.com/til/2016/04/26/responsive-d3-bar-chart.html
//https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
//http://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js

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


const loadD3 = (data = []) => {

    const margin = {top:10, right:10, bottom:90, left:80}

    const width = 960 - margin.left - margin.right

    const height = 500 - margin.top - margin.bottom

    const xScale = d3.scaleBand()
		   .rangeRound([0, width])
		   .padding(0.03)

    const yScale = d3.scaleLinear()
		   .range([height, 0])


    const xAxis = d3.axisBottom()
		  .scale(xScale)
		  .ticks(5)
    
    
    const yAxis = d3.axisLeft()
		  .scale(yScale)
		  .ticks(5)

    const svgWidth = width+margin.left + margin.right
    const svgHeight = height+margin.top + margin.bottom

    const bargraph = d3.select("#bargraph")


    bargraph.selectAll('*').remove()

    const svgContainer = bargraph
	.append('div')
	.classed('bargraph_svg-container', true)
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
	.classed("bargraph_svg-content-responsive", true)
	.append("g").attr("class", "container")
	.attr("transform", "translate("+ margin.left +","+ margin.top +")")

    xScale.domain(data.map( d => d.name ))
    yScale.domain([0, 100])


    svgContainer.append("g")			
       .attr("class", "grid")
       .attr("transform", "translate(0," + height + ")")
		.call( d3.axisBottom(xScale)
			 .ticks(5)
			 .tickSize(-height)
			 .tickFormat("")
		)

    svgContainer.append("g")			
	.attr("class", "grid")
		.call( d3.axisLeft(yScale)
			 .ticks(5)
			 .tickSize(-width)
			 .tickFormat("")
		)
    
    //xAxis. To put on the top, swap "(height)" with "-5" in the translate() statement. Then you'll have to change the margins above and the x,y attributes in the svgContainer.select('.x.axis') statement inside resize() below.
    const xAxis_g = svgContainer.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + (height) + ")")
			      .call(xAxis)
			      .selectAll("text")
			      .call(wrap, xScale.bandwidth())
    

    const yAxis_g = svgContainer.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
			      .attr("y", 6).attr("dy", ".71em")
			      //.style("text-anchor", "end").text("Number of Applicatons")
     

    svgContainer.selectAll(".bar")
  		.data(data)
  		.enter()
  		.append("rect")
  		.attr("class", "bar")
  		.attr("x", d => xScale(d.name) )
  		.attr("width", xScale.bandwidth())
  		.attr("y", d => yScale(d.votePct) )
  		.attr("height", d => height - yScale(d.votePct))




    // Controls the text labels at the top of each bar. Partially repeated in the resize() function below for responsiveness.
    svgContainer.selectAll(".text")  		
		.data(data)
		.enter()
		.append("text")
		.attr("class","label")
		.attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
		.attr("y", d => yScale(d.votePct) + 1)
		.attr("dy", ".75em")
				.text(d => `${d.votePct}%`)

    svgContainer.append("text")
				.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
				.attr("transform", "translate("+ (-50) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
				.text("Percentage of Total Votes");
}


class BarGraph extends React.Component {

    componentDidMount() {
	this.props.onBargraphChange(true)
    }

    shouldComponentUpdate() {
	return false
    }
    
    render() {
	return (
	    <div id="bargraph" />
	)
    }
}

export default compose(
    connect(
	(state, props) => ({
	    entities: getBarGraphCandidates(state, props)
	})
    ),
    withState('bargraph', 'onBargraphChange', false),
    withMutation({
	skip: ({bargraph, entities}, prev) =>
	    !bargraph || !entities || (entities === prev.entities && prev.bargraph),
	run: ({entities}) => loadD3(entities)
    })
)(BarGraph)
