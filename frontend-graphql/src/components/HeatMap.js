import React from 'react'
import { withStateHandlers } from 'recompose'
import MapGeojson from './MapGeojson'
import CandidateDataPopup from './CandidateDataPopup'

const zoneKeys = {
    WARD: 'ward',
    PRECINCT: 'wpid'
}	

const HeatMap = ({
    level,
    geojson,
    colors,
    legend,
    onClick,
    popup
}) => (
    <MapGeojson zoneKey={zoneKeys[level]}
		geojson={geojson}
		colors={colors}
		legend={legend}
		onClick={onClick}>
	{popup ? <CandidateDataPopup {...popup}/> : null}
    </MapGeojson>
)

export default withStateHandlers({}, {
    onClick: (_, {raceID, level}) => (latlng, zone) => ({
	popup: {
	    popupKey: Date.now(),
	    raceID,
	    level,
	    latlng,
	    zone
	}
    })
})(HeatMap)
