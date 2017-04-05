import React from 'react'
import R from 'ramda'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { Tag, Select } from 'antd'
const Option = Select.Option
import BarGraph from './BarGraph'
import ScatterPlot from './ScatterPlot'
import withMutation from './Mutation.js'
import { selectGraph } from '../creators'
import { getScatterPlot } from'../selectors'

const ScatterPlotPage = ({history, path, graph, points, entities}) => (
    <div className="scatter-plot_page">
	<Select style={{ margin: '20px', width: 250 }}
		size="large"
		value={graph}
		onChange={value => history.push(`${path}/${value}`)}>
	    <Option value="votes">Percentage of Votes by Candidate</Option>
	    <Option value="turnout">Turnout vs Registered Voters By Ward</Option>
	</Select>
	<Route path="/races/:raceUri/graph/votes"
	       component={BarGraph}/>
	<Route path="/races/:raceUri/graph/turnout"
	       component={ScatterPlot}/>
    </div>
)

export default compose(
    connect(
	(state, props) => ({
	    path: `/races/${props.match.params.raceUri}/graph`,
	    ...props.match.params
	}),
	{query: selectGraph}
    ),
    withMutation({
	skip: R.eqProps('raceUri'),
	run: props => props.query(props)
    })
)(ScatterPlotPage)
