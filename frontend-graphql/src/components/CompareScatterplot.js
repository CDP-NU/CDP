import React from 'react'
import * as d3 from 'd3'
import { renameProp, compose, branch, withProps, renderNothing, mapProps, withHandlers, flattenProp } from 'recompose' 
import { gql, graphql } from 'react-apollo'
import { Select } from 'antd'
//import './css/App.css'
import './css/CompareScatterPlot.css'
import _ from 'underscore'
import { Switch, Route } from 'react-router-dom'


const scatterPlotQuery = gql`
query ScatterPlot($raceID: ID!) {
    race(id: $raceID) {
        id
	candidates {
	    id
	    name
	    color
	}
    }
    raceMapColors(id: $raceID, level: WARD)
    raceWardStats(id: $raceID) {
	ward
	registeredVoters
	turnout
    }
}`
const scatterPlotQuery2 = gql`
query ScatterPlot($raceID2: ID!) {
    race(id: $raceID2) {
        id
	candidates {
	    id
	    name
	    color
	}
    }
    raceMapColors(id: $raceID2, level: WARD)
    raceWardStats(id: $raceID2) {
	ward
	registeredVoters
	turnout
    }
}`

const loadD3 = (race1, race2) => {
    
    const margin = {top: 20, right: 15, bottom: 60, left: 60}
    const width = 960 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    const svgWidth = width + margin.right + margin.left
    const svgHeight = height + margin.top + margin.bottom
    
    /*
    const race1_x = d3.scaleLinear()
		.domain([0, d3.max(race1, d => d[0] )])
		.range([ 0, width ])
    
    const race1_y = d3.scaleLinear()
    		.domain([0, d3.max(race1, d => d[1] )])
    		.range([ height, 0 ])

    const race2_x = d3.scaleLinear()
		.domain([0, d3.max(race2, d => d[0] )])
		.range([ 0, width ])
    
    const race2_y = d3.scaleLinear()
    		.domain([0, d3.max(race2, d => d[1] )])
    		.range([ height, 0 ])
                */

    const x = d3.scaleLinear()
                .domain([0, d3.max([ d3.max(race1, d => d[0]), d3.max(race2, d => d[0])])])
                .range([0, width])

    const y = d3.scaleLinear()
                .domain([0, d3.max([ d3.max(race1, d => d[1]), d3.max(race2, d => d[1])])])
                .range([height, 0])

    const scatterplot = d3.select('#scatterplot')

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
		    .text('Registered voters in each ward');


    const yAxis = d3.axisLeft()
		    .scale(y)

    main.append('text')
		    .attr('transform', 'rotate(-90)')
		    .attr('y', 0 - margin.left)
		    .attr('x', 0 - (height / 2))
		    .attr('dy', '1em')
		    .style('text-anchor', 'middle')
		    .text('Turnout Percentage');     

    main.append('g')
	.attr('transform', 'translate(0,0)')
	.attr('class', 'main axis date')
	.call(yAxis)


    const g = main.append('svg:g');
    
    const tooltip= d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    g.selectAll('scatter-dots')
     .data(race1)
     .enter().append('svg:circle')
     .attr('cx', d => x(d[0]))
     .attr('cy', d => y(d[1]))
     .attr('fill', d => d[2])
     .attr('r', 8)
    .on("mouseover", d => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Ward: " + d[3] + "<br/>" + "Registered Voters: " + d[0] + "<br>" +  "Turnout Pct: " + Math.floor(d[1]) + "%") 
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })

    g.selectAll('scatter-dots')
     .data(race2)
     .enter().append('svg:circle')
     .attr('cx', d => x(d[0]))
     .attr('cy', d => y(d[1]))
     .attr('fill', d => d[2])
     .attr("stroke-width", 4)
     .attr("stroke", "black")
     .attr('r', 8)
    .on("mouseover", d => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Ward: " + d[3] + "<br/>" + "Registered Voters: " + d[0] + "<br>" +  "Turnout Pct: " + Math.floor(d[1]) + "%") 
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })


}

const Legend = ({race1_candidates, race2_candidates}) => (
    <div className="scatter-plot_legend" style={{}}>
	Winning Candidate:
	{race1_candidates.map( ({name, color}) => 
	    <div key={name}><i style={{background: color}}></i>{name}</div>
	 )}
	Winning Candidate:
	{race2_candidates.map( ({name, color}) => 
	    <div key={name}><i style={{background: color, borderStyle: "solid", borderColor: "black"}}></i>{name}</div>
	 )}
    </div>
)

const CandidateScatterPlot = ({race1_candidates, race1_zones, race2_candidates, race2_zones}) => (
    <div className="scatter-plot_wrap">
	<CompareScatterPlot points_race1={race1_zones} points_race2={race2_zones}/>
	<Legend race1_candidates={race1_candidates} race2_candidates={race2_candidates}/>
    </div>
)
    
class CompareScatterPlot extends React.Component {

    componentDidMount() {
	loadD3(this.props.points_race1, this.props.points_race2)
    }

    componentWillReceiveProps(next) {
	if((this.props.points_race1 !== next.points_race1) || (this.props.points_race2 !== next.points_race2) ) {
	    loadD3(next.points_race1, next.points_race2)
	}
    }
    
    shouldComponentUpdate() {
	return false
    }

    render() {
	return (
	    <div id="scatterplot"/>
	)
    }
}
export default compose(
    mapProps(({raceID, raceID2, ...props}) => {
	return {
            ...props,
            raceID,
            raceID2,
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
    withProps(
	({race1, race2}) => {
            return {
	    race1_candidates: race1.race.candidates, 
	    race2_candidates: race2.race.candidates, 
	    race1_zones: race1.raceWardStats.map(
		({ward, registeredVoters, turnout}) => [
		    registeredVoters,
		    turnout * 100,
		    race1.raceMapColors[ward] ? race1.raceMapColors[ward] : '#fff',
                    ward
		]
	    ),
	    race2_zones: race2.raceWardStats.map(
		({ward, registeredVoters, turnout}) => [
		    registeredVoters,
		    turnout * 100,
		    race2.raceMapColors[ward] ? race2.raceMapColors[ward] : '#fff', 
                    ward
		]
	    )
	}}
    )
)(CandidateScatterPlot)

