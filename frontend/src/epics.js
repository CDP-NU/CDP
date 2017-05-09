import * as actions from './actions'
import { mapActions, checkStateFor, fetchOf} from './utility'

export const autocomplete = (action$, _, {getJSON}) => action$ 
    .ofType(actions.REQUEST_AUTOCOMPLETIONS)
    .pluck('request', 'keyword')
    .debounceTime(300)
    .filter(keyword => !!keyword.trim() && keyword.length > 2)
    .switchMap(
	keyword => getJSON(`/autocomplete/${keyword}`)
	    .let(fetchOf(
		actions.REQUEST_AUTOCOMPLETIONS,
		entities => ({
		    data: {keyword},
		    entities
		})
	    ))
    )

export const search = (action$, _, {post}) => action$ 
    .ofType(actions.REQUEST_SEARCH_RESULTS)
    .pluck('request')
    .throttleTime(200)
    .switchMap(
	({timestamp, searchForm}) => post(`/search`, searchForm)
	    .let(fetchOf(
		actions.REQUEST_SEARCH_RESULTS,
		searchResults => ({
		    data: {timestamp, searchForm},
		    entities: {searchResults}
		})
	    ))
    )



export const raceWardMap = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_RACE_WARD_MAP)
    .let(
	checkStateFor(state, ({race}) => ({
	    race,
	    candidates: race,
	    raceWardMap: race
	}))
    ).switchMap(
	({race, neededEntities}) => getJSON(
	    `/race/${race}/wards/map`, neededEntities
	).let(fetchOf(
	    actions.REQUEST_RACE_WARD_MAP,
	    entities => ({
		data: {race},
		entities
	    })
	))
    )

export const raceWardGraph = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_RACE_WARD_GRAPH)
    .let(
	checkStateFor(state, ({race}) => ({
	    race,
	    candidates: race,
	    raceWardMap: race,
	    raceWardStats: race
	}))
    ).switchMap(
	({race, neededEntities}) => getJSON(
	    `/race/${race}/wards/graph`, neededEntities
	).let(fetchOf(
	    actions.REQUEST_RACE_WARD_GRAPH,
	    entities => ({
		data: {race},
		entities
	    })
	))
    )

export const racePrecinctMap = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_RACE_PRECINCT_MAP)
    .let(
	checkStateFor(state, ({race}) => ({
	    race,
	    candidates: race,
	    racePrecinctMap: race
	}))
    ).switchMap(
	({race, neededEntities}) => getJSON(
	    `/race/${race}/precincts/map`, neededEntities
	).let(fetchOf(
	    actions.REQUEST_RACE_PRECINCT_MAP,
	    entities => ({
		data: {race},
		entities
	    })
	))
    )

export const candidateWardMap = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_CANDIDATE_WARD_MAP)
    .let(
	checkStateFor(state, ({race, candidate}) => ({
	    race,
	    candidates: race,
	    candidateWardMap: candidate
	}))
    ).switchMap(
	({race, candidate, neededEntities}) => getJSON(
	    `/candidate/${candidate}/wards/map`, neededEntities
	).let(fetchOf(
	    actions.REQUEST_CANDIDATE_WARD_MAP,
	    entities => ({
		data: {race, candidate},
		entities
	    })
	))
    )

export const candidatePrecinctMap = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_CANDIDATE_PRECINCT_MAP)
    .let(
	checkStateFor(state, ({race, candidate}) => ({
	    race,
	    candidates: race,
	    candidatePrecinctMap: candidate
	}))
    ).switchMap(
	({race, candidate, neededEntities}) => getJSON(
	    `/candidate/${candidate}/precincts/map`, neededEntities
	).let(fetchOf(
	    actions.REQUEST_CANDIDATE_PRECINCT_MAP,
	    entities => ({
		data: {race, candidate},
		entities
	    })
	))
    )



export const geojson = (action$, state, {getFile}) => action$
    .ofType(...mapActions)
    .let(
	checkStateFor(state, ({geojson}) => ({
	    geojson
	}))
    ).switchMap(
	({geojson: id}) => getFile(`/geojson/${id}`)
	    .let(fetchOf(
		actions.REQUEST_GEOJSON,
		geojson => ({
		    data: {geojson: id},
		    entities: {geojson}
		})
	    ))
    )

export const geocode = (action$, _, {getJSON}) => action$
    .ofType(actions.REQUEST_GEOCODE)
    .pluck('request', 'street')
    .switchMap(
	street => getJSON(`/geocode/${street}`)
	    .let(fetchOf(
		actions.REQUEST_GEOCODE,
		geocode => ({
		    data: {street},
		    entities: {geocode}
		})
	    ))
    )

export const ward = (action$, _, {getJSON}) => action$
    .ofType(actions.REQUEST_WARD)
    .pluck('request')
    .switchMap( ({timestamp, race, ward}) => getJSON(`/race/${race}/ward/${ward}`)
	.let(fetchOf(
	    actions.REQUEST_WARD,
	    data => ({
		data: {timestamp, race, ward},
		entities: {ward: data}
	    })
	))
	.takeUntil(action$.ofType(...mapActions))
    )

export const precinct = (action$, _, {getJSON}) => action$
    .ofType(actions.REQUEST_PRECINCT)
    .pluck('request')
    .switchMap(
	({timestamp, race, wpid}) => getJSON(`/race/${race}/precinct/${wpid}`)
	    .let(fetchOf(
		actions.REQUEST_PRECINCT,
		data => ({
		    data: {timestamp, race, wpid},
		    entities: {precinct: data}
		})
	    ))
	    .takeUntil(action$.ofType(...mapActions))
    )
