import React from 'react'
import * as d3 from 'd3'
import { Modal } from 'antd'
import { compose, flattenProp, branch, renderNothing, withPropsOnChange, renderComponent } from 'recompose'
import { gql, graphql } from 'react-apollo'
import '../css/MainContent.css'

//http://bl.ocks.org/bunkat/2595950
//https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e text labels

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

const loadD3 = (data = []) => {
    
    const margin = {top: 20, right: 15, bottom: 60, left: 60}
    const width = 960 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    const svgWidth = width + margin.right + margin.left
    const svgHeight = height + margin.top + margin.bottom
    
    const x = d3.scaleLinear()
		.domain([0, d3.max(data, d => d[0] )])
		.range([ 0, width ])
    
    const y = d3.scaleLinear()
    		.domain([0, d3.max(data, d => d[1] )])
    		.range([ height, 0 ])

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
    
    g.selectAll('scatter-dots')
     .data(data)
     .enter().append('svg:circle')
     .attr('cx', d => x(d[0]))
     .attr('cy', d => y(d[1]))
     .attr('fill', d => d[2])
     .attr('r', 8)
}

class ScatterPlot extends React.Component {

    componentDidMount() {
	loadD3(this.props.points)
    }

    componentWillReceiveProps(next) {
	if(this.props.points !== next.points) {
	    loadD3(next.points)
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


const Legend = ({candidates = []}) => (
    <div className="scatter-plot_legend" style={{}}>
	Winning Candidate:
	{candidates.map( ({name, color}) => 
	    <div key={name}><i style={{background: color}}></i>{name}</div>
	 )}
    </div>
)


const CandidateScatterPlot = ({candidates, zones}) => (
    <div className="scatter-plot_wrap">
	<ScatterPlot points={zones}/>
	<Legend candidates={candidates}/>
    </div>
)

class NoDataModal extends React.Component {

    modal 

    componentDidMount() {
	this.modal = Modal.error({
	    title: 'Turnout data not available for this race'
	})
    }

    render() { return null }

    componentWillUnmount() {
	this.modal.destroy()
    }
}

export default compose(
    graphql(scatterPlotQuery),
    flattenProp('data'),
    branch(
	({loading, error}) => loading || error,
	renderNothing
    ),
    withPropsOnChange(
	['raceID'],
	({race, raceMapColors: colors, raceWardStats: stats}) => ({
	    candidates: race.candidates,
	    hasTurnoutData: stats.some( ({turnout}) => turnout > 0 ),
	    zones: stats.map(
		({ward, registeredVoters, turnout}) => [
		    registeredVoters,
		    turnout * 100,
		    colors[ward] ? colors[ward] : '#fff'
		]
	    )
	})
    ),
    branch(
	({hasTurnoutData}) => !hasTurnoutData,
	renderComponent(NoDataModal)
    )
)(CandidateScatterPlot)
