import React from 'react'
import { Switch, Route } from 'react-router-dom'
import './App.css'
import MapPage from './MapPage'
import GraphPage from './GraphPage'
import DatabaseSearch from './DatabaseSearch'
import TopBar from './TopBar'
import cdp from './cdp.png'

export default () => (
    <div>
	<div className="sidebar">
	    <div className="sidebar_header">
		<a className="home-btn" href="http://cdp.northwestern.edu">
		    <img className="home-btn_logo" src={cdp}/>
		</a>
		<h3>Browse Database</h3>
	    </div>
	    <DatabaseSearch/>
	</div>
	<div className="main-content">
	    <Route path="/race/:race/:display"
		   component={TopBar}/>
	    <Switch>
		<Route path="/race/:race/maps"
		       component={MapPage}/>
		<Route path="/race/:race/graphs/:graph"
		       component={GraphPage}/>
	    </Switch>
	</div>
    </div>
)
