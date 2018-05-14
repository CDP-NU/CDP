import React from 'react'
import MapSelect from './MapSelect'
import { Route, Redirect, Switch } from 'react-router-dom'
import { Icon, Collapse } from 'antd'
import Map from './Map'
import Geocode from './Geocode'
import RaceMap from './RaceMap'
import CandidateMap from './CandidateMap'
import MapPopup from './MapPopup'

const MapPage = ({
    url,
    history,
    raceID,
    raceGeoYear,
    candidates,
    geocodePopup,
    isRaceLoading,
    onMapSelect,
    onGeocode,
}) =>  (
    <div className="map-page">
	<Map className="map-container">
		<div className="geocode_container" >
			<Collapse defaultActiveKey={['mapTools']} bordered={false} style={{backgroundColor:"transparent"}}>
			<Collapse.Panel header="Map Tools" key="mapTools" style={{color:"transparent"}}>
				<p><Icon type="environment"/> Go to address</p>
				<Geocode onGeocode={onGeocode}/>
			    <MapSelect style={{}} 
	                                        url={url}
			                        history={history}
			                        candidates={candidates}
			                        loading={isRaceLoading}/> 
			</Collapse.Panel>
		    </Collapse>
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
	        <Redirect to={`/?err=404&err_url=${url}`}/>
	    </Switch>
	    {geocodePopup ? <MapPopup {...geocodePopup}/> : null}
	</Map>
    </div>
)

export default MapPage 
