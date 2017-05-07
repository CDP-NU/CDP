import React from 'react' 
import { compose, mapProps, withHandlers } from 'recompose'
import { Route } from 'react-router-dom'
import { Select } from 'antd'
const Option = Select.Option
import BarGraph from './BarGraph'
import ScatterPlot from './ScatterPlot'


const ScatterPlotPage = ({graph, onGraphChange}) => (
    <div className="scatter-plot_page">
	<Select style={{ margin: '20px', width: 250 }}
		size="large"
		value={graph}
		onChange={onGraphChange}>
	    <Option value="candidates">Percentage of Votes by Candidate</Option>
	    <Option value="turnout">Turnout vs Registered Voters By Ward</Option>
	</Select>
	<Route path="/race/:race/graphs/candidates"
	       component={BarGraph}/>
	<Route path="/race/:race/graphs/turnout"
	       component={ScatterPlot}/>
    </div>
)

export default compose(
    mapProps(({match: {params}, ...props}) => ({
	...props,
	...params,
    })),
    withHandlers({
	onGraphChange: ({race, history}) => graph =>
	    history.push(`/race/${race}/graphs/${graph}`)
    })
)(ScatterPlotPage)
