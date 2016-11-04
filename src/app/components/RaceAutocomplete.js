import React from 'react'
import { browserHistory } from 'react-router'
import Autocomplete from 'react-toolbox/lib/Autocomplete'
import autocompleteTheme from './themes/raceAutocomplete.scss'
import { requestAutocompletions, searchDatabase } from '../creators.js'
import { getAutocompletions } from '../selectors.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


class RaceAutocomplete extends React.Component {

    constructor(props) {
	super(props)
	this.state = {
	    keyword: ''
	}
	this.changeKeyword = this.changeKeyword.bind(this)
	this.loadAutocompletions = this.loadAutocompletions.bind(this)
    }

    changeKeyword(keyword) {
	this.setState({keyword}, () =>
	    browserHistory.push(`/search?keyword=${keyword}`)
	)
    }

    loadAutocompletions() {
	const {completions, requestAutocompletions} = this.props
	if(completions.length === 0) {
	    requestAutocompletions()
	}
    }

    render() {
	return (
	    <Autocomplete theme={autocompleteTheme}
			  label="Search race or candidate"
			  value={this.state.keyword}
			  source={this.props.completions}
			  multiple={false}
			  allowCreate={true}
			  onChange={this.changeKeyword}
			  onFocus={this.loadAutocompletions}/>
	)
    }
}

export default connect(
    state => ({
	completions: getAutocompletions(state)
    }),
    dispatch => bindActionCreators({
	requestAutocompletions
    }, dispatch)
)(RaceAutocomplete)
