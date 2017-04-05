import React from 'react'
import { compose } from 'redux'
import R from 'ramda'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import { withState } from 'recompose'
import withMutation from './Mutation'
import { selectGraph } from '../creators'
import { getScatterPlot } from'../selectors'

//http://bl.ocks.org/bunkat/2595950
//https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e text labels


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
    		  .attr("preserveAspectRatio", "xMinYMin meet")
		  .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
		  .classed("svg-content-responsive", true)
		  .attr('class', 'chart')

    const main = chart.append('g')
		    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		    .attr('width', width)
		    .attr('height', height)
		    .attr('class', 'main')   
    
    const xAxis = d3.axisBottom()
		  .scale(x)

    main.append('g')
	.attr('transform', 'translate(0,' + height + ')')
		    .attr('class', 'main axis date')
	.call(xAxis)

    main.append("text")             
		    .attr("transform",
			  "translate(" + (width/2) + " ," + 
                            (height + margin.top + 20) + ")")
		    .style("text-anchor", "middle")
		    .text("Registered voters in each ward");


    const yAxis = d3.axisLeft()
		    .scale(y)

    main.append("text")
		    .attr("transform", "rotate(-90)")
		    .attr("y", 0 - margin.left)
		    .attr("x",0 - (height / 2))
		    .attr("dy", "1em")
		    .style("text-anchor", "middle")
		    .text("Turnout Percentage");     

    main.append('g')
	.attr('transform', 'translate(0,0)')
	.attr('class', 'main axis date')
	.call(yAxis)

    const g = main.append("svg:g");
    
    g.selectAll("scatter-dots")
     .data(data)
     .enter().append("svg:circle")
     .attr("cx", d => x(d[0]))
     .attr("cy", d => y(d[1]))
     .attr('fill', d => d[2])
     .attr("r", 8)
}

class ScatterPlot extends React.Component {

    componentDidMount() {
	this.props.onScatterplotChange(true)
    }

    shouldComponentUpdate() {
	return false
    }

    render() {
	return (
	    <div id="scatterplot"
		 style={{}} />
	)
    }
}


const Legend = ({entities = []}) => (
    <div className="scatter-plot_legend" style={{}}>
	Winning Candidate:
	{entities.map( ({color, value}) => 
	    <div key={value}><i style={{background: color}}></i>{value}</div>
	 )}
    </div>
)


const Wrapper = ({points, entities, onScatterplotChange}) => (
    <div className="scatter-plot_wrap">
	<ScatterPlot points={points}
		     onScatterplotChange={onScatterplotChange}/>
	<Legend entities={entities}/>
    </div>
)

export default compose(
    connect(getScatterPlot),
    withState('scatterplot', 'onScatterplotChange', false),
    withMutation({
	skip: ({scatterplot, points}, prev) =>
	    !scatterplot || !points || (points === prev.points && prev.scatterplot),
	run: ({points}) => loadD3(points)
    })
)(Wrapper)
