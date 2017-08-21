import React from 'react'
import { gql, graphql } from 'react-apollo'
import { compose, mapProps, flattenProp, withPropsOnChange, branch, renderNothing } from 'recompose'
import Map from './Map'
import MapGeojson from './MapGeojson'

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

const DemographyMap = ({geojson, colors, legend}) => (
    <Map className="map-container">
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
    })
)(DemographyMap)
