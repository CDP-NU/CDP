import React from 'react'
import { Switch, Route } from 'react-router-dom'
import './css/App.css'
import MapPageContainer from './MapPageContainer'
import GraphPage from './GraphPage'
import DatabaseSearchContainer from './DatabaseSearchContainer'
import TopBar from './TopBar'
import cdp from './cdp.png'

const App = () => (
    <div>
	<div className="sidebar">
	    <div className="sidebar_header">
		<a className="home-btn" href="http://cdp.northwestern.edu">
		    <img className="home-btn_logo" src={cdp}/>
		</a>
		<h3>Browse Database</h3>
	    </div>
	    <DatabaseSearchContainer/>
	</div>
	<div className="main-content">
	    <Route path="/race/:raceID/:display"
		   component={TopBar}/>
	    <Switch>
		<Route path="/race/:raceID/maps"
		       component={MapPageContainer}/>
		<Route path="/race/:raceID/graphs/:graph"
		       component={GraphPage}/>
	    </Switch>
	</div>
    </div>
)

export default App
