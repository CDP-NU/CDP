import React from 'react' 
import { compose, mapProps, withHandlers } from 'recompose'
import { Route, Redirect, Switch } from 'react-router-dom'
import { Select } from 'antd'
import BarGraph from './BarGraph'
import ScatterPlot from './ScatterPlot'
import Breakdown from './Breakdown'

const {Option} = Select


const GraphPage= ({raceID, graph, url, onGraphChange}) => (
    <div className="scatter-plot_page">
	<Switch>
	    <Route path="/race/:raceID/candidates"
		   render={() => <BarGraph raceID={raceID}/>}/>
	    <Route path="/race/:raceID/turnout"
		   render={() => <ScatterPlot raceID={raceID}/>}/>
	    <Route path="/race/:raceID/breakdown"
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
)(GraphPage)
