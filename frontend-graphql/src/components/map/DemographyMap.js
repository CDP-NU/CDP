import React from 'react'
import { gql, graphql } from 'react-apollo'
import { Collapse, Icon, Radio} from 'antd'
import { compose, mapProps, flattenProp, withPropsOnChange, branch, withHandlers, withStateHandlers, renderNothing } from 'recompose'
import Map from './Map'
import MapGeojson from './MapGeojson'
import Geocode from './Geocode'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const demographyMapQuery = gql`
query DemographyMap($id: ID!) {
    demographyMap(id: $id) {
        colors
        stdcats {
            color
            stdmin
            stdmax
        }
    }  
    geojson(year: 2015, level: WARD)
}`
const geocodeQuery = gql`
query Geocode($street: String!) {
    geocode(street: $street) {
	ward
	precinct
	lat
	lon
    }
}`

const DemographyMap = ({geojson, colors, legend, onGeocode, onLevelChange, level}) => (
    <Map className="map-container">
    <div className="geocode_container" >
			<Collapse defaultActiveKey={['mapTools']} bordered={false} style={{backgroundColor:"transparent"}}>
			<Collapse.Panel header="Map Tools" key="mapTools" style={{color:"transparent"}}>
				<p><Icon type="environment"/> Go to address</p>
				<Geocode onGeocode={onGeocode}/>
				<RadioGroup style={{marginTop:10}}
					    value={level}
					    onChange={onLevelChange}>
				    <RadioButton value="ward">Ward</RadioButton>
				    <RadioButton value="precinct">Precinct</RadioButton>
				</RadioGroup>
			</Collapse.Panel>
		    </Collapse>
		</div>
	<MapGeojson zoneKey="ward"
		    geojson={geojson}
		    colors={colors}
		    legend={legend}/>
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
    withStateHandlers({}, {
	onGeocode: () => street => ({
	    geocodeRequest: {
		street,
		timestamp: Date.now()
	    }
	})
    }),
    withHandlers({
		onLevelChange: ({id, history}) => ({target}) => 
		    history.push(`/demography/${id}/${target.value}/`)
    })
)(DemographyMap)
