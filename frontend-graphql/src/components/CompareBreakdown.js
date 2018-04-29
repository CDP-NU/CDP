import React from 'react'
import * as d3 from 'd3'
import { compose, branch, renameProp, renderNothing, mapProps, withHandlers, flattenProp } from 'recompose' 
import { gql, graphql } from 'react-apollo'
import { Select } from 'antd'
import './css/CompareBreakdown.css'
import { Switch, Route } from 'react-router-dom'
import _ from 'underscore'

const compareQuery=gql`
query compare($raceID: ID!) {
    breakdown(id:$raceID, level: WARD)
    race(id: $raceID) {
        id
        candidates {
            id
            name
            color
        }
    }
}`
const compareQuery2=gql`
query compare($raceID2: ID!) {
    breakdown(id:$raceID2, level: WARD)
    race(id: $raceID2) {
        id
        candidates {
            id
            name
            color
        }
    }
}`

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
// loadRace takes in the race breakdown and turns it into an object, with fields "candidates" (an array of candidates), "wards" (an array of wards), and "wardData" (an array of the data).

const loadRace = (data) => {

    let candidates = [];
    data.race.candidates.forEach(function(candidate) {
        candidates.push(candidate.name)
    });

    let wards = [...new Set(data.breakdown.map(item=>item.ward))];

    let wardData = [];
    for(let i=0; i<wards.length; i++) {
        let obj = {};
        obj.ward = wards[i];
        wardData.push(obj);
    };
    

    data.breakdown.forEach(function(element){
        for(let i = 0; i < wardData.length; i++){
            if (wardData[i].ward === element.ward) {
                let can = element.candidate;
                wardData[i][can] = element.votes; 
            }
        }
        
    });
    const stack = d3.stack()
        .keys(candidates);
    const stacked = stack(wardData);
    const maxY = d3.max(stacked, function(d) {
        return d3.max(d, function(d) {
            return d[1];
        });
    });


    const ret = {
        "data": data,
        "candidates": candidates,
        "wards" : wards,
        "wardData" : wardData,
        "stacked": stacked,
        "maxY": maxY,
        "colors" : _.union(data.race.candidates, i => i.colors)
    }

    console.log(ret)
    
    return ret
}

const loadD3 = (race1, race2) => {

    _.each(race1.wardData, (element) => (_.extend(element, {race:"race1"})))
    _.each(race2.wardData, (element) => (_.extend(element, {race:"race2"})))

    const data = _.union(
        race1.data,
        race2.data
    )

    const candidates = _.union(
        race1.candidates,
        race2.candidates
    )
    
    const wards = (_.union(
        race1.wards,
        race2.wards
    )).sort((a, b) => (a-b))

    const wardData = _.sortBy((_.union(
        race1.wardData,
        race2.wardData
    )), 'ward')


    const stacked = _.union(
        race1.stacked,
        race2.stacked
    )

    const maxY = Math.max(race1.maxY, race2.maxY)


    console.log("wardData" ,wardData)

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
		    .ticks(5)
    
    
    const yAxis = d3.axisLeft()
		    .scale(yScale)
		    .ticks(5)

    const svg = d3.select("#compareBreakdown");
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

    //cross hatching for race2
    /*
    svgContainer.append('defs')
      .append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)
      .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#000000')
        .attr('stroke-width', 1);
        */

    const barWidth = width/(1.5* wards.length ) - 5
    
    //each layer corresponds to a candidate.  Each rect in the layer is the percent that candidate got in that ward
    const layers_r1 = svgContainer.selectAll('g.layer')
        .data(race1.stacked, d => d.key)
        .enter()
        .append('g')
        .attr('class', 'layer')
        .attr('width', svgWidth)
        .attr('fill', d => race1.data.race.candidates[d.index].color);

    layers_r1.selectAll('rect')
        .data(d => d)
        .enter()
            .append('rect')
                .attr('x', d => xScale(d.data.ward))
                .attr('width', barWidth )
                .attr('y', d => yScale(d[1]))
                .attr('height', d => yScale(d[0]) - yScale(d[1]));

    svgContainer.append("g")			
	.attr("class", "grid")
	.call( d3.axisLeft(yScale)
		 .ticks(5)
		 .tickSize(-width)
		 .tickFormat("")
	)

    /*
    const layers_r2 = svgContainer.selectAll('g.layer')
        .data(race2.stacked, d => d.key)
        .enter()
        .append('g')
        .attr('class', 'layer')
        .attr('width', svgWidth)
        .attr('fill', d => race2.data.race.candidates[d.index].color)

    layers_r2.selectAll('rect')
        .data(d => d)
        .enter()
            .append('rect')
                .attr('x', d => (xScale(d.data.ward) + barWidth ) ) //offset by one bar width
                .attr('width', barWidth )  
                .attr('y', d => yScale(d[1]))
                .attr('height', d => yScale(d[0]) - yScale(d[1]))
             //   .attr('fill', 'url(#diagonalHatch)');

    svgContainer.append("g")			
	.attr("class", "grid")
	.call( d3.axisLeft(yScale)
		 .ticks(5)
		 .tickSize(-width)
		 .tickFormat("")
	)
        */
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
				.attr("transform", "translate("+ (width/2) +","+(height + 50)+ ")")    // text is drawn off the screen top left, move down and out and rotate
                                .text("Ward");


}


class CompareBreakdown extends React.Component {

    componentDidMount() {
        loadD3(loadRace(this.props.race1), loadRace(this.props.race2))
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
            <div id="compareBreakdown" />
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
    graphql(compareQuery),
    renameProp('data', 'race1'),
    graphql(compareQuery2),
    renameProp('data', 'race2'),
    branch(
	({race1, race2}) => race1.loading || race1.error || race2.loading || race2.error,
	renderNothing
    ),
)(CompareBreakdown)

