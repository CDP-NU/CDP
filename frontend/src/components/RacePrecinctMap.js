import React from 'react'
import { compose, renameProp, branch, renderNothing } from 'recompose'
import withQuery from './Query'
import withSubscription from './Subscription'
import withPrecinct from './Precinct'
import HeatMap from './HeatMap'
import MapPopup from './MapPopup'
import { candidatesToHtml } from '../utility'
import * as actions from '../actions'

const RacePrecinctMap = ({
    race,
    candidates,
    geojson,
    colors,
    onClick,
    popup
}) => (
    <HeatMap mapKey={race}
	     zoneKey="wpid"
	     geojson={geojson}
	     colors={colors}
	     onClick={onClick}
	     legend={candidatesToHtml(candidates)}>
	{popup ? <MapPopup {...popup}/> : null}
    </HeatMap>
)


export default compose(
    withQuery(
	actions.REQUEST_RACE_PRECINCT_MAP,
	['race', 'geojson']
    ),
    withSubscription({
	candidates: 'race',
	racePrecinctMap: 'race',
	geojson: 'geojson'
    }),
    renameProp('racePrecinctMap', 'colors'),
    branch(
	({loading}) => loading,
	renderNothing
    ),
    withPrecinct
)(RacePrecinctMap)
