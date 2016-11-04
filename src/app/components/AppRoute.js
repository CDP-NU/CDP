import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Route from 'react-router/lib/Route'
import Router from 'react-router/lib/Router'
import history from 'react-router/lib/browserHistory'
import SiteLayout from './SiteLayout.js'
import MapPage from './MapPage.js'
import SearchPage from './SearchPage.js'
import {selectRace, searchDatabase} from '../creators.js'

class AppRoute extends React.Component {
    constructor(props) {
	super(props)
	this.onEnterMapPage = this.onEnterMapPage.bind(this)
	this.onEnterSearchPage = this.onEnterSearchPage.bind(this)
	this.onSearchUrlChange = this.onSearchUrlChange.bind(this)
    }
    
    onEnterMapPage(nextState) {
	const {election, race} = nextState.params
	const selectRace = this.props.selectRace

	selectRace(election, race)
    }
    onEnterSearchPage(nextState) {
	this.searchDatabase(nextState)
    }
    mapUrlChanged(prevState, nextState) {
	const {election, race} = nextState.params
	//console.log('changed map', election, race)
    }
    onSearchUrlChange(prevState, nextState) {
	this.searchDatabase(nextState)
    }
    searchDatabase(nextState) {
	const keyword = nextState.location.query.keyword
	
	if(keyword) {
	    this.props.searchDatabase(keyword)
	}
    }
    render() {
	return (
	    <Router history={history}>
		<Route path="/"
		       component={SiteLayout}>
		    <Route path=":election/:race/map"
			   component={MapPage}
			   onEnter={this.onEnterMapPage}
			   onChange={this.mapUrlChanged}/>
		    <Route path="search"
			   component={SearchPage}
			   onEnter={this.onEnterSearchPage}
			   onChange={this.onSearchUrlChange}/>
		</Route>
	    </Router>
	)
    }
}

export default connect(
    null,
    dispatch => bindActionCreators({
	selectRace,
	searchDatabase
    }, dispatch)
)(AppRoute)
    
