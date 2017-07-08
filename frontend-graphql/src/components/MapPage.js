import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Icon } from 'antd'
import Map from './Map'
import Geocode from './Geocode'
import RaceMap from './RaceMap'
import CandidateMap from './CandidateMap'
import MapSelect from './MapSelect'
import MapPopup from './MapPopup'

const MapPage = ({
    url,
    history,
    raceID,
    raceGeoYear,
    candidates,
    geocodePopup,
    isRaceLoading,
    raceQueryError,
    onMapSelect,
    onGeocode,
}) =>  (
    <div className="map-page">
	<MapSelect url={url}
		   history={history}
		   candidates={candidates}
		   loading={isRaceLoading}
		   error={raceQueryError}/>
	<Map>
	    <div className="geocode_container" style={{}}>
		<p><Icon type="environment"/> Go to address</p>
		<Geocode onGeocode={onGeocode}/>
	    </div>
	    <Switch>
		<Route path="/race/:raceID/maps/ward"
		       render={() => (
			       <RaceMap raceID={raceID}
			                candidates={candidates}
			                year={raceGeoYear}
			                level="WARD"/>  
			   )}/>
		<Route path="/race/:raceID/maps/precinct"
		       render={() => (
			       <RaceMap raceID={raceID}
			                candidates={candidates}
			                year={raceGeoYear}
			                level="PRECINCT"/>  
			   )}/>
		<Route path="/race/:raceID/maps/candidate/:candidateID/ward"
		       render={({match: {params: {candidateID}}}) => (
			       <CandidateMap raceID={raceID}
				             candidateID={candidateID}
			                     year={raceGeoYear}
			                     level="WARD"/>  
			   )}/>
		<Route path="/race/:raceID/maps/candidate/:candidateID/precinct"
		       render={({match: {params: {candidateID}}}) => (
			       <CandidateMap raceID={raceID}
				             candidateID={candidateID}
			                     year={raceGeoYear}
			                     level="PRECINCT"/>  
			   )}/>
	    </Switch>
	    {geocodePopup ? <MapPopup {...geocodePopup}/> : null}
	</Map>
    </div>
)

export default MapPage 
