import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Map from './Map.js'
import ReusableDropdown from './ReusableDropdown.js'
import MapActionBar from './MapActionBar.js'
import pageStyle from './themes/mapPage.scss'
import dropdownTheme from './themes/candidateDropdown.scss'
import { getCandidateDictionary, getRace } from '../selectors.js'
import { mapRace, mapCandidate } from '../creators.js'

const countries = [
    { value: 'EN-gb', label: 'England' },
    { value: 'ES-es', label: 'Spain'},
    { value: 'TH-th', label: 'Thailand' },
    { value: 'EN-en', label: 'USA'}
]

const MapPage = ({raceName, candidates, level, onCandidateSelect, onMapActionClick}) => (
    <main className={pageStyle.main}>
	<ReusableDropdown theme={dropdownTheme}
			  label={`Choose candidate - ${raceName}`}
			  source={candidates}
			  onChange={onCandidateSelect}
			  value='EN-en'
			  auto/>
    	<Map/>
	<MapActionBar onMapActionClick={onMapActionClick}
		      level={level}/>
    </main>
)

class Container extends React.Component {
    constructor(props) {
	super(props)
	this.state = {level: 'ward', candidate: 0}
	this.onCandidateSelect = this.onCandidateSelect.bind(this)
	this.onMapActionClick = this.onMapActionClick.bind(this)
    }
    componentDidMount() {
    }
    onCandidateSelect(candidate) {
	this.setState({candidate}, this.recolorMap)
    }
    onMapActionClick(action) {
	switch(action) {
	    case 'level':
		this.setState({
		    level: this.state.level === 'ward' ?
			   'precinct' : 'ward'
		}, this.recolorMap)
		break
	}
    }
    recolorMap() {
	const {race, mapRace, mapCandidate} = this.props
	const {candidate, level} = this.state
	
	if(candidate === 0) {
	    mapRace(
		race.id, race.year, level
	    )
	}
	else {
	    mapCandidate(
		candidate, race.year, level
	    )
	}
    }
    render() {
	const {candidates, race, mapRace, mapCandidate} = this.props

	return <MapPage raceName={race ? race.name : ''}
        	        candidates={candidates}
	                level={this.state.level}
			onCandidateSelect={this.onCandidateSelect}
			onMapActionClick={this.onMapActionClick}/>
    }
}

export default connect(
    state => ({
	candidates: getCandidateDictionary(state),
	race: getRace(state)
    }),
    dispatch => bindActionCreators({
	mapRace, mapCandidate
    }, dispatch)
)(Container)
