import { gql, graphql } from 'react-apollo'
import { compose, mapProps, branch, renderNothing, withPropsOnChange } from 'recompose'
import HeatMap from './HeatMap'

const candidateMapQuery = gql`
query CandidateMap($raceID: ID!, $candidateID: Int!, $level: LEVEL!) {
    candidateMap(race: $raceID, candidate: $candidateID, level: $level) {
        colors
        stdcats {
            color
            stdmin
            stdmax
        }
    }  
}`

const geojsonQuery = gql`
query Geojson($year: Int!, $level: LEVEL!) {
    geojson(year: $year, level: $level)
}`


export default compose(
    graphql(candidateMapQuery, {name: 'mapQuery'}),
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
    mapProps( ({candidateMap: {colors, stdcats}, ...props}) => {

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
)(HeatMap)
