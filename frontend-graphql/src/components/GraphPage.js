import React from 'react' 
import { compose, mapProps, withHandlers } from 'recompose'
import { Switch, Route } from 'react-router-dom'
import { Select } from 'antd'
import BarGraph from './BarGraph'
import ScatterPlot from './ScatterPlot'

const {Option} = Select


const ScatterPlotPage = ({raceID, graph, onGraphChange}) => (
    <div className="scatter-plot_page">
	<Select style={{ margin: '20px', width: 250 }}
		size="large"
		value={graph}
		onChange={onGraphChange}>
	    <Option value="candidates">Percentage of Votes by Candidate</Option>
	    <Option value="turnout">Turnout vs Registered Voters By Ward</Option>
	</Select>
	<Switch>
	    <Route path="/race/:raceID/graphs/candidates"
		   render={() => <BarGraph raceID={raceID}/>}/>
	    <Route path="/race/:raceID/graphs/turnout"
		   render={() => <ScatterPlot raceID={raceID}/>}/>
	</Switch>
    </div>
)

export default compose(
    mapProps(({match: {params}, ...props}) => ({
	...props,
	...params,
    })),
    withHandlers({
	onGraphChange: ({raceID, history}) => graph =>
	    history.push(`/race/${raceID}/graphs/${graph}`)
    })
)(ScatterPlotPage)
