import * as actions from './actions'
import { injectEntity } from './utility'

export const autocompletions = injectEntity(
    'autocompletions',
    (state = {}) => state,
    (_, autocompletions, {data: {keyword}}) => ({
	current: autocompletions
    })
)

export const searchResults = injectEntity(
    'searchResults',
    (state = {}) => state,
    (_, searchResults, {data: {timestamp}}) => ({
	current: searchResults
    })
)



export const race = injectEntity(
    'race',
    (state = {}) => state,
    (state, {id, ...race}) => ({
	...state,
	[id]: {
	    id,
	    ...race
	}
    })
)

export const candidates = injectEntity(
    'candidates',
    (state = {}) => state,
    (state, candidates, {data: {race}}) => ({
	...state,
	[race]: candidates
    })
)



export const raceWardMap = injectEntity(
    'raceWardMap',
    (state = {}) => state,
    (state, map, {data: {race}}) => ({
	...state,
	[race]: map
    })
)

export const racePrecinctMap = injectEntity(
    'racePrecinctMap',
    (state = {}) => state,
    (state, map, {data: {race}}) => ({
	...state,
	[race]: map
    })
)
/* [[ward: 3, registeredVoters: 21020, turnout: 0.02]] */
export const raceWardStats = injectEntity(
    'raceWardStats',
    (state = {}) => state,
    (state, stats, {data: {race}}) => ({
	...state,
	[race]: stats
    })
)



export const candidateWardMap = injectEntity(
    'candidateWardMap',
    (state = {}) => state,
    (state, map, {data: {candidate}}) => ({
	...state,
	[candidate]: map
    })
)

export const candidatePrecinctMap = injectEntity(
    'candidatePrecinctMap',
    (state = {}) => state,
    (state, map, {data: {candidate}}) => ({
	...state,
	[candidate]: map
    })
)


export const geojson = injectEntity(
    'geojson',
    (state = {}) => state,
    (state, geojson, {data: {geojson: id}}) => ({
	...state,
	[id]: geojson
    })
)

export const geocode = injectEntity(
    'geocode',
    (state = {}) => state,
    (state, geocode, {data: {street}}) => ({
	[street]: geocode
    })
)


const appendCandidateToPopup = (
    html, {name, votes, pct}
) => `${html}<br/> ${name}: ${votes} votes, ${pct}%`

export const ward = injectEntity(
    'ward',
    (state = {}) => state,
    (state, candidates, {data: {timestamp, ward}}) => ({
	[timestamp]: candidates.reduce(
	    appendCandidateToPopup,
	    `<h3>Ward: ${ward}</h3>`
	)
    })
)

export const precinct = injectEntity(
    'precinct',
    (state = {}) => state,
    (state, candidates, {data: {timestamp, wpid}}) => {
	const precinct = wpid % 1000
	const ward = (wpid - precinct) / 1000
	return {
	    [timestamp]: candidates.reduce(
		appendCandidateToPopup,
		`<h3>Ward: ${ward}, Precinct: ${precinct}</h3>`
	    )
	}
    }
)


export const failedRequests = (state = {}, action) => {
    switch(action.type) {
	case actions.FAILED_REQUEST:
	    const {requestName, errorType, timestamp} = action.data
	    return {
		...state,
		[requestName]: {
		    request: requestName,
		    type: errorType,
		    timestamp
		}
	    }
	default:
	    return state
    }
}
