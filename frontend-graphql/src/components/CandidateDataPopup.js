import { gql, graphql } from 'react-apollo'
import { compose, flattenProp, branch, renderNothing,  mapProps } from 'recompose'
import MapPopup from './MapPopup'

const popupQuery = gql`
query Popup($raceID: ID!, $level: LEVEL!, $zone: Int!) {
    zoneCandidateData(race: $raceID, level: $level, zone: $zone) {
	name
	votes
	pct
    }
}`

const appendCandidateToPopup = (
    html, {name, votes, pct}
) => `${html}<br/> ${name}: ${votes} votes, ${pct}%`

const popups = {
    WARD: (ward, candidates) => candidates.reduce(
	appendCandidateToPopup,
	`<h3>Ward: ${ward}</h3>`
    ),
    PRECINCT:  (wpid, candidates) => {
	const precinct = wpid % 1000
	const ward = (wpid - precinct) / 1000
	return candidates.reduce(
	    appendCandidateToPopup,
	    `<h3>Ward: ${ward}, Precinct: ${precinct}</h3>`
	)
    }
}

const CandidatePopup = compose(
    graphql(popupQuery),
    flattenProp('data'),
    branch(
	({loading, error}) => loading || error,
	renderNothing
    ),
    mapProps( ({zoneCandidateData, level, zone, popupKey, latlng}) => ({
	popupKey,
	html: popups[level](zone, zoneCandidateData),
	latlng
    })),
)(MapPopup)

export default CandidatePopup
