import { gql, graphql } from 'react-apollo'
import { compose, mapProps, flattenProp, branch, renderNothing, withPropsOnChange } from 'recompose'
import HeatMap from './HeatMap'

const candidateMapQuery = gql`
query CandidateMap($raceID: ID!, $candidateID: Int!, $year: Int, $level: LEVEL!) {
    candidateMap(race: $raceID, candidate: $candidateID, level: $level) {
        colors
        stdcats {
            color
            stdmin
            stdmax
        }
    }  
    geojson(year: $year, level: $level)
}`


export default compose(
    graphql(candidateMapQuery),
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
