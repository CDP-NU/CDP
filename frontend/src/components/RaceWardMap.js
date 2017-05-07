import React from 'react'
import { compose, branch, renderNothing, renameProp } from 'recompose'
import withQuery from './Query'
import withSubscription from './Subscription'
import withWard from './Ward.js'
import HeatMap from './HeatMap'
import MapPopup from './MapPopup'
import { candidatesToHtml } from '../utility'
import * as actions from '../actions'

const RaceWardMap = ({
    race,
    candidates,
    geojson,
    colors,
    onClick,
    popup
}) => (
    <HeatMap mapKey={race}
	     zoneKey="ward"
	     geojson={geojson}
	     colors={colors}
	     onClick={onClick}
	     legend={candidatesToHtml(candidates)}>
	{popup ? <MapPopup {...popup}/> : null}
    </HeatMap>
)

export default compose(
    withQuery(
	actions.REQUEST_RACE_WARD_MAP,
	['race', 'geojson']
    ),
    withSubscription({
	candidates: 'race',
	raceWardMap: 'race',
	geojson: 'geojson'
    }),
    renameProp('raceWardMap', 'colors'),
    branch(
	({loading}) => loading,
	renderNothing
    ),
    withWard
)(RaceWardMap)
