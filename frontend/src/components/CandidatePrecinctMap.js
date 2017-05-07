import React from 'react'
import { compose, flattenProp, branch, renderNothing } from 'recompose'
import withQuery from './Query'
import withSubscription from './Subscription'
import withPrecinct from './Precinct.js'
import HeatMap from './HeatMap'
import MapPopup from './MapPopup'
import { stdcatsToHtml } from '../utility'
import * as actions from '../actions'

const CandidatePrecinctMap = ({
    race,
    candidate,
    geojson,
    colors,
    legend: stdcats = [],
    onClick,
    popup
}) => (
    <HeatMap mapKey={candidate}
	     zoneKey="wpid"
	     geojson={geojson}
	     colors={colors}
	     onClick={onClick}
	     legend={stdcatsToHtml(stdcats)}>
	{popup ? <MapPopup {...popup}/> : null}
    </HeatMap>
)


export default compose(
    withQuery(
	actions.REQUEST_CANDIDATE_PRECINCT_MAP,
	['race', 'candidate', 'geojson']
    ),
    withSubscription({
	candidatePrecinctMap: 'candidate',
	geojson: 'geojson'
    }),
    branch(
	({loading}) => loading,
	renderNothing
    ),
    flattenProp('candidatePrecinctMap'),
    withPrecinct
)(CandidatePrecinctMap)
