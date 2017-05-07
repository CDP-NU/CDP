import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { compose, mapProps, withHandlers, flattenProp, withState, branch, renameProp} from 'recompose'
import { Icon } from 'antd'
import withQuery from './Query'
import withSubscription from './Subscription'
import Map from './Map'
import Geocode from './Geocode'
import RaceWardMap from './RaceWardMap'
import RacePrecinctMap from './RacePrecinctMap'
import CandidateWardMap from './CandidateWardMap'
import CandidatePrecinctMap from './CandidatePrecinctMap'
import MapSelect from './MapSelect'
import MapPopup from './MapPopup'
import * as actions from '../actions'

const geoYearOfRace = race => {
    const year = race.substr(0, 4)
    return year >= 2015 ? 2015 : 2003
}

const idOfWardGeojson = race => `wards${geoYearOfRace(race)}`
const idOfPrecinctGeojson = race => `precincts${geoYearOfRace(race)}`


const renderRaceWardMap = ({match: {params}, ...props}) => {

    const {race} = params
    const geojson = idOfWardGeojson(params.race)

    return <RaceWardMap race={race}
			geojson={geojson}/>
}

const renderRacePrecinctMap = ({match: {params}, ...props}) => {

    const {race} = params
    const geojson = idOfPrecinctGeojson(params.race)

    return <RacePrecinctMap race={race}
			    geojson={geojson}/>
}


const renderCandidateWardMap = ({match: {params}, ...props}) => {

    const {race, candidateNum} = params

    const candidate = `${race}+${candidateNum}`
    const geojson = idOfWardGeojson(params.race)

    return <CandidateWardMap race={race}
			     candidate={candidate}
			     geojson={geojson}/>
}

const renderCandidatePrecinctMap = ({match: {params}, ...props}) => {

    const {race, candidateNum} = params

    const candidate = `${race}+${candidateNum}`
    const geojson = idOfPrecinctGeojson(params.race)

    return <CandidatePrecinctMap race={race}
			     candidate={candidate}
			     geojson={geojson}/>
}

const MapPage = ({
    url,
    history,
    race,
    candidates,
    geocodePopup,
    isMapLoading,
    onMapSelect,
    onGeocode,
}) =>  (
    <div className="map-page">
	<MapSelect url={url}
		   history={history}
		   candidates={candidates}
		   loading={isMapLoading}/>
	<Map>
	    <div className="geocode_container" style={{}}>
		<p><Icon type="environment"/> Go to address</p>
		<Geocode onGeocode={onGeocode}/>
	    </div>
	    <Switch>
		<Route path="/race/:race/maps/ward"
		       render={renderRaceWardMap}/>
		<Route path="/race/:race/maps/precinct"
		       render={renderRacePrecinctMap}/>
		<Route path="/race/:race/maps/candidate/:candidateNum/ward"
		       render={renderCandidateWardMap}/>
		<Route path="/race/:race/maps/candidate/:candidateNum/precinct"
		       render={renderCandidatePrecinctMap}/>
	    </Switch>
	    {geocodePopup ? <MapPopup {...geocodePopup}/> : null}
	</Map>
    </div>
)

const geocodeToHtml = (street, ward, precinct) => {
    return `<h3>${street}</h3>` +
	   `<p>Ward: ${ward}<br/>` +
	   `Precinct: ${precinct}<br/>` +
	   '<small>Based on current (2015-) boundaries</small>' +
	   '</p>'
}

const withGeocodeRequest = compose(
    withState('geocodeRequest', 'setGeocode', null),
    branch(
	({geocodeRequest}) => geocodeRequest,
	compose(
	    flattenProp('geocodeRequest'),
	    withQuery(
		actions.REQUEST_GEOCODE,
		['street', 'timestamp']
	    ),
	    withSubscription(
		{geocode: 'street'},
		({street, geocode, timestamp}) => {
		    
		    if(geocode.notFound) {
			return null
		    }

		    const {lat, lon, ward, precinct} = geocode
			
		    return {
			geocodePopup: {
			    popupKey: timestamp,
			    html: geocodeToHtml(street, ward, precinct),
			    latlng: [lat, lon]
			}
		    }
		}   
	    ),
	    renameProp('loading', 'isGeocodeLoading')
	)
    )
)

export default compose(
    mapProps(({match, location, ...props}) => ({
	...props,
	...match.params,
	url: location.pathname
    })),
    withSubscription({
	race: 'race',
	candidates: 'race'
    }),
    renameProp('loading', 'isMapLoading'),
    withGeocodeRequest,
    withHandlers({
	onGeocode: ({setGeocode}) => street =>
	    setGeocode({street, timestamp: Date.now()})
    })
)(MapPage)
