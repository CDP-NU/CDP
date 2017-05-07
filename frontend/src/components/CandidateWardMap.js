import React from 'react'
import { compose, flattenProp, branch, renderNothing } from 'recompose'
import withQuery from './Query'
import withSubscription from './Subscription'
import withWard from './Ward.js'
import HeatMap from './HeatMap'
import { stdcatsToHtml } from '../utility'
import * as actions from '../actions'
import MapPopup from './MapPopup'

const CandidateWardMap = ({
    race,
    candidate,
    geojson,
    colors,
    legend: stdcats,
    onClick,
    popup
}) => (
    <HeatMap mapKey={candidate}
	     zoneKey="ward"
	     geojson={geojson}
	     colors={colors}
	     onClick={onClick}
	     legend={stdcatsToHtml(stdcats)}>
	{popup ? <MapPopup {...popup}/> : null}
    </HeatMap>
)

export default compose(
    withQuery(
	actions.REQUEST_CANDIDATE_WARD_MAP,
	['race', 'candidate', 'geojson']
    ),
    withSubscription({
	candidateWardMap: 'candidate',
	geojson: 'geojson'
    }),
    branch(
	({loading}) => loading,
	renderNothing
    ),
    flattenProp('candidateWardMap'),
    withWard
)(CandidateWardMap)
