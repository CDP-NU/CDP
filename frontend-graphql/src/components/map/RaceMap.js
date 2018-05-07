import { gql, graphql } from 'react-apollo'
import { compose, mapProps, branch, renderNothing, flattenProp, withPropsOnChange } from 'recompose'
import HeatMap from './HeatMap'

const raceMapQuery = gql`
query RaceMap($raceID: ID!, $year: Int!, $level: LEVEL!) {
    raceMapColors(id: $raceID, level: $level)
    geojson(year: $year, level: $level)
}`

export default compose(
    graphql(raceMapQuery),
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
