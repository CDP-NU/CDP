import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane
import './App.css'
import MapPage from './MapPage'
import GraphPage from './GraphPage'
import DatabaseSearch from './DatabaseSearch'
import TopBar from './TopBar'
import cdp from './cdp.png'

const HomeBtn = (
    <a className="home-btn" href="http://cdp.northwestern.edu">
	<img className="home-btn_logo" src={cdp}/>
    </a>
)

export default ({children}) => (
    <div>
	<div className="main-content">
	    <Route path="/races/:raceUri/:display"
		   component={TopBar}/>
	    <Switch>
		<Route path="/races/:raceUri/map/:name/:level"
		       component={MapPage}/>
		<Route path="/races/:raceUri/graph/:graph"
		       component={GraphPage}/>
	    </Switch>
	</div>
	<div className="sidebar">
	    <div className="sidebar_header">
		<a className="home-btn" href="http://cdp.northwestern.edu">
		    <img className="home-btn_logo" src={cdp}/>
		</a>
		<h3>Browse Database</h3>
	    </div>
	    <DatabaseSearch/>
	</div>
    </div>
)
