import React from 'react'
import * as d3 from 'd3'
import { renameProp, compose, branch, withProps, renderNothing, mapProps, withHandlers, flattenProp } from 'recompose' 
import { gql, graphql } from 'react-apollo'
import { Select } from 'antd'
import '../css/MainContent.css'
import _ from 'underscore'
import { Switch, Route } from 'react-router-dom'


const scatterPlotQuery = gql`
query ScatterPlot($raceID: ID!, $selectedCandidate_race1: Int!)
 {
    race(id: $raceID) {
        id
	candidates {
	    id
	    name
	    color
            pct
	}
        electionType
        office
        date
        year
        name
    }      
    compareCandidate(id: $raceID, candidate: $selectedCandidate_race1)
}`
const scatterPlotQuery2 = gql`
query ScatterPlot($raceID2: ID!, $selectedCandidate_race2: Int!) {
    race(id: $raceID2) {
        id
	candidates {
	    id
	    name
	    color
            pct
	}
        electionType
        office
        date
        year
        name
    }
    compareCandidate(id: $raceID2, candidate: $selectedCandidate_race2)
}`

const loadD3 = (race1, race2) => {

    console.log(race1, race2)
    // Only displays dots where a candidates is voted for in that ward for both elections.  Future version could include allwards
    const wards = _.intersection(race1.compareCandidate.map(item=>item.ward), race2.compareCandidate.map(item=>item.ward))
    const data = _.map(wards, w => {return { ward:w,
                                    r1:_.findWhere(race1.compareCandidate, {ward:w}).pct, 
                                    r2:_.findWhere(race2.compareCandidate, {ward:w}).pct }})
    

    const margin = {top: 20, right: 15, bottom: 60, left: 60}
    // const width = 960 - margin.left - margin.right
    // const height = 500 - margin.top - margin.bottom

    // const svgWidth = width + margin.right + margin.left
    // const svgHeight = height + margin.top + margin.bottom
    const svgWidth = 960
    const svgHeight = 800  
    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom
    

    const x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, width])

    const y = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0])

    const scatterplot = d3.select('#compare_scatterplot')

    scatterplot.selectAll('*').remove()
    
    const chart = scatterplot
    	.append('div')
	.classed('svg-container', true)
	.append('svg:svg')
    	.attr('preserveAspectRatio', 'xMinYMin meet')
	.attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
	.classed('svg-content-responsive', true)
	.attr('class', 'chart')

    const main = chart.append('g')
		      .attr('transform', `translate(${margin.left}, ${margin.top})`)
		      .attr('width', width)
		      .attr('height', height)
		      .attr('class', 'main')   
    
    const xAxis = d3.axisBottom()
		    .scale(x)


    main.append('g')
		    .attr('transform', `translate(0, ${height})`)
		    .attr('class', 'main axis date')
		    .call(xAxis)

    main.append("text")             
		    .attr('transform', `translate(${width/2}, ${height + margin.top + 20})`)
		    .style('text-anchor', 'middle')
		    .text('Candidate: ' + race1.compareCandidate[0]["name"] + ", Race: " + race1.race.name + ", Date: " + race1.race.date);


    const yAxis = d3.axisLeft()
		    .scale(y)

    main.append('text')
		    .attr('transform', 'rotate(-90)')
		    .attr('y', 0 - margin.left)
		    .attr('x', 0 - (height / 2))
		    .attr('dy', '1em')
		    .style('text-anchor', 'middle')
		    .text('Candidate: ' + race2.compareCandidate[0]["name"] + ", Race: " + race2.race.name + ", Date: " + race2.race.date);

    main.append('g')
	.attr('transform', 'translate(0,0)')
	.attr('class', 'main axis date')
	.call(yAxis)


    const g = main.append('svg:g');
    
    const tooltip= d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    g.selectAll('scatter-dots')
     .data(data)
     .enter().append('svg:circle')
     .attr('cx', d => x(d.r1))
     .attr('cy', d => y(d.r2))
     .attr('fill', 'black')
     .attr('r', 8)
    .on("mouseover", d => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Ward: " + d.ward + "<br/>" +  "Candidate: " + race1.compareCandidate[0]["name"]  + "<br>Race: " + race1.race.name + "<br>Votes: " + d.r1 + "%<br>" +
                                                        "Candidate: " + race2.compareCandidate[0]["name"]  + "<br>Race: " + race2.race.name + "<br>Votes: " + d.r2 + "%<br>") 
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
}


    
class CompareCandidates extends React.Component {

    componentDidMount() {
	loadD3(this.props.race1, this.props.race2)
    }

    componentWillReceiveProps(next) {
	if((this.props.race1 !== next.race1) || (this.props.race2 !== next.race2) ) {
	    loadD3(next.race1, next.race2)
	}
    }

    shouldComponentUpdate() {
	return false
    }

    render() {
	return (
            <div>
                <div id="compare_scatterplot"/>
            </div>
	)
    }
}

export default compose(
    mapProps(({raceID, raceID2, ...props})=> {
	return {
            raceID,
            raceID2,
            ...props,
	}
    }),
    graphql(scatterPlotQuery),
    renameProp('data', 'race1'),
    graphql(scatterPlotQuery2),
    renameProp('data', 'race2'),
    branch(
	({race1, race2}) => race1.loading || race1.error || race2.loading || race2.error,
	renderNothing
    ),
)(CompareCandidates)

