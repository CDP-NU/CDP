import { gql, graphql } from 'react-apollo'
import { compose, mapProps, branch, renderNothing, withPropsOnChange } from 'recompose'
import HeatMap from './HeatMap'

const raceMapQuery = gql`
query RaceMap($raceID: ID!, $level: LEVEL!) {
    raceMapColors(id: $raceID, level: $level)
}`

const geojsonQuery = gql`
query Geojson($year: Int!, $level: LEVEL!) {
    geojson(year: $year, level: $level)
}`

export default compose(
    graphql(raceMapQuery, {name: 'mapQuery'}),
    graphql(geojsonQuery, {name: 'geoQuery'}),
    mapProps( ({mapQuery, geoQuery, ...props}) => ({
	...props,
	...mapQuery,
	...geoQuery,
	loading: mapQuery.loading || geoQuery.loading,
	error: mapQuery.error || geoQuery.error
    })),
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
    mapProps( ({raceMapColors, candidates, ...props}) => {

	const legend = candidates.map(
	    ({name, color}) => ({
		color, value: name
	    })
	)
	
	return {
	    ...props,
	    colors: raceMapColors,
	    legend
	}
    })
)(HeatMap)
