import React from 'react'
import { gql, graphql } from 'react-apollo'
import { Collapse, Icon, Radio} from 'antd'
import { compose, mapProps, flattenProp, withPropsOnChange, branch, withHandlers, withStateHandlers, renderNothing } from 'recompose'
import Map from './Map'
import MapGeojson from './MapGeojson'
import Geocode from './Geocode'
import DemographyPopup from './DemographyPopup'
import _ from 'underscore'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const zoneKeys = {
    "WARD": 'ward',
    "PRECINCT": 'wpid'
}	

const demographyMapQuery = gql`
query DemographyMap($id: ID!, $level: LEVEL!) {
    demographyMap(id: $id, level: $level) {
        colors
        stdcats {
            color
            stdmin
            stdmax
        }
    } 
	geojson(year: 2015, level: $level)
}
`
const demographyLevels = gql`
	query($id:ID!) {
		ward: demographyLevels(id: $id, level: WARD)
		precinct: demographyLevels(id: $id, level: PRECINCT)
	}
`

const geocodeQuery = gql`
query Geocode($street: String!) {
    geocode(street: $street) {
	ward
	precinct
	lat
	lon
    }
}`

const DemographyMap = ({geojson, colors, legend, onClick, popup, onGeocode, onLevelChange, level, levels}) => (
    <Map className="map-container">
	    <div className="geocode_container" >
			<Collapse defaultActiveKey={['mapTools']} bordered={false} style={{backgroundColor:"transparent"}}>
			<Collapse.Panel header="Map Tools" key="mapTools" style={{color:"transparent"}}>
				<p><Icon type="environment"/> Go to address</p>
				<Geocode onGeocode={onGeocode}/>
				<RadioGroup style={{marginTop:10}}
					    value={level}
					    onChange={onLevelChange}>
				    <RadioButton disabled={levels.ward == null} value="WARD">Ward</RadioButton>
				    <RadioButton disabled={levels.precinct == null} value="PRECINCT">Precinct</RadioButton>
				</RadioGroup>
			</Collapse.Panel>
		    </Collapse>
		</div>
		<MapGeojson zoneKey={zoneKeys[level]}
			    geojson={geojson}
			    colors={colors}
				onClick={onClick}
			    legend={legend}/>
		{popup ? <DemographyPopup{...popup}/> : null}
    </Map>
)

export default compose(
    graphql(demographyMapQuery),
    flattenProp('data'),
    branch(
		({loading, error}) => loading || error,
		renderNothing
    ),
    withPropsOnChange(
		['geojson'],
		({geojson}) => ({
		    geojson: JSON.parse(geojson)
		})
    ),
    mapProps( ({demographyMap: {colors, stdcats}, ...props}) => {
		const legend = stdcats.map( ({stdmin, stdmax, color}) => ({
		    color,
		    value: `${stdmin} - ${stdmax}%`
		}))
		return {
		    ...props,
		    colors,
		    legend
		}
    }),
    withStateHandlers( {}, {
	    onClick: (_, {id, level}) => (latlng, zone) => ({
			popup: {
			    popupKey: Date.now(),
			    id,
			    level,
			    latlng,
			    zone
			}}),
		onGeocode: () => street => ({
		    geocodeRequest: {
			street,
			timestamp: Date.now()
		    }
	    })
	}),
	graphql(demographyLevels, {name: "levels"}),
    withHandlers({
		onLevelChange: ({id, history}) => ({target}) => 
		    history.push(`/demography/${id}/${target.value}/`)
    })
)(DemographyMap)
