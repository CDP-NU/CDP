import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Modal, Button, Checkbox} from 'antd'
import './css/App.css'
import MapPageContainer from './map/MapPageContainer'
import DemographyMap from './map/DemographyMap'
import GraphPage from './graph/GraphPage'
import DatabaseSearchContainer from './sidebar/DatabaseSearchContainer'
import TopBar from './topbar/TopBar'
import CompareTopBar from './topbar/CompareTopBar'
import Map from './map/Map'
import cdp from './cdp.png'
import ComparePage from './compare/ComparePage'

class NoMatch extends React.Component {

    componentDidMount() {
	Modal.error({
	    title: 'Error: content not found'
	})
    }

    render() {
	return <Map className="home-page_map"/>
    }
}

const DemographyTopBar = ({
    title
}) => (
    <div className="top-bar">
	<h3>{title}</h3>
    </div>
)

//<Route path="/:type/:raceID/" children={(props) => (<DatabaseSearchContainer {...props} />) }/>

const App = () => (
    <div>
	<div className="sidebar">
	    <div className="sidebar_header">
		<a className="home-btn"
		   href="http://cdp.northwestern.edu">
		    <img className="home-btn_logo"
			 src={cdp}/>
		</a>
		<h3><a href="http://cdp.northwestern.edu/database">Browse Database</a></h3>
		<a className="sidebar_help-btn"
		   href="http://cdp.northwestern.edu/index.php/chicago-elections-database-help">
		    Help
		</a>
	    </div>
	    <DatabaseSearchContainer/>
	</div>
	<div className="main-content">
            <Switch>
                <Route path="/race/:raceID/compare/:raceID2/"
                       render={ ({history, match: {params}}) => (
                              <CompareTopBar history={history} params={params}/>
                       )}/>
                <Route path="/race/:raceID/:display"
                       component={TopBar}/>
                <Route path="/demography/:id"
                       render={ ({match: {params}}) => (
                              <DemographyTopBar title={params.id}/>
                       )}/>
            </Switch>
	    <Switch>
		<Route path="/race/:raceID/maps"
		       component={MapPageContainer}/>
                <Route path="/race/:raceID/compare/:raceID2/:compare"
                       component={ComparePage} />
		<Route path="/race/:raceID/:graph"
		       component={GraphPage}/>
		<Route path="/demography/:id"
		       render={ ({match: {params}}) => (
			      <DemographyMap id={params.id}/>
			   )}/>
		<Route path="/"
		       exact={true}
		       render={({location}) =>
			   location.search.match(/err=([^&]*)/) ?
					     <NoMatch/> :
					     <Map className="home-page_map"/> 

			      }/>

	    </Switch>
	</div>
    </div>
)

export default App

