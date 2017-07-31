import React from 'react' 
import { compose, mapProps, withHandlers } from 'recompose'
import { Route, Redirect, Switch } from 'react-router-dom'
import { Select } from 'antd'
import BarGraph from './BarGraph'
import ScatterPlot from './ScatterPlot'
import Breakdown from './Breakdown'

const {Option} = Select


const ScatterPlotPage = ({raceID, graph, url, onGraphChange}) => (
    <div className="scatter-plot_page">
	<Select style={{ margin: '20px', width: 250 }}
		size="large"
		value={graph}
		onChange={onGraphChange}>
	    <Option value="candidates">Percentage of Votes by Candidate</Option>
	    <Option value="turnout">Turnout vs Registered Voters By Ward</Option>
	    <Option value="breakdown">Breakdown of Election</Option>
	</Select>
	<Switch>
	    <Route path="/race/:raceID/graphs/candidates"
		   render={() => <BarGraph raceID={raceID}/>}/>
	    <Route path="/race/:raceID/graphs/turnout"
		   render={() => <ScatterPlot raceID={raceID}/>}/>
	    <Route path="/race/:raceID/graphs/breakdown"
                   render={() => <Breakdown raceID={raceID}/>}/>
	    <Redirect to={`/?err=404&err_url=${url}`}/>
	</Switch>
    </div>
)

export default compose(
    mapProps(({match, location, ...props}) => ({
	...props,
	...match.params,
	url: location.pathname
    })),
    withHandlers({
	onGraphChange: ({raceID, history}) => graph =>
	    history.push(`/race/${raceID}/graphs/${graph}`)
    })
)(ScatterPlotPage)
