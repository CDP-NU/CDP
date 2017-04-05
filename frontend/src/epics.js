import Rx from 'rxjs'
import R from 'ramda'
import { combineEpics } from 'redux-observable'
import {
    AUTOCOMPLETE,
    CLEAR_AUTOCOMPLETIONS,
    SEARCH_DATABASE,
    SELECT_RACE_MAP,
    SELECT_CANDIDATE_MAP,
    SELECT_ZONE,
    GEOCODE,
    SELECT_GRAPH
} from './actions'
import {
    clearAutocompletions
} from './creators'

const isNotCached = state => path => !R.path(path, state.getState())


const requestAutocompletions = (action$, _, {fetchAutocompletions}) => action$ 
    .ofType(AUTOCOMPLETE)
    .pluck('data', 'keyword')
    .debounceTime(300)
    .switchMap(keyword => {

	const getStream = R.ifElse(
	    R.compose(R.gte(R.__, 2), R.length, R.trim),
	    fetchAutocompletions,
	    R.always(Rx.Observable.of(clearAutocompletions()))
	)

	return getStream(keyword)
	    .takeUntil(action$.ofType(CLEAR_AUTOCOMPLETIONS))
    })
    
const requestSearchResults = (
    action$, _, {fetchSearchResults, fetchSearchResultsWithoutKeyword}
) => action$
    .ofType(SEARCH_DATABASE)
    .pluck('data')
    .switchMap(
	R.ifElse(
	    R.compose(R.isEmpty, R.prop('keyword')),
	    fetchSearchResultsWithoutKeyword,
	    fetchSearchResults
	)
    )


const requestRaceMap = (action$, state, {fetchRaceMap}) => action$
    .ofType(SELECT_RACE_MAP)
    .pluck('data')
    .filter(R.compose(
	isNotCached(state),
	R.pair('maps'),
	R.prop('id')
    ))
    .switchMap(fetchRaceMap)

const requestCandidateMap = (action$, state, {fetchCandidateMap}) => action$
    .ofType(SELECT_CANDIDATE_MAP)
    .pluck('data')
    .filter(R.compose(
	isNotCached(state),
	R.pair('maps'),
	R.prop('id')
    ))
    .switchMap(fetchCandidateMap)


const requestGeojson = (action$, state, {fetchGeojson}) => action$
    .ofType(SELECT_RACE_MAP, SELECT_CANDIDATE_MAP)
    .pluck('data')
    .filter(R.compose(
	isNotCached(state),
	R.pair('geojsons'),
	R.prop('geojson')
    ))
    .switchMap(fetchGeojson)


const requestGeocode = (action$, _, {fetchGeocode}) => action$
    .ofType(GEOCODE)
    .pluck('data')
    .switchMap(fetchGeocode)

const requestZoneResults = (action$, _, {fetchZoneResults}) => action$
    .ofType(SELECT_ZONE)
    .pluck('data')
    .switchMap(data => fetchZoneResults(data)
	.takeUntil(action$
	    .ofType(
		SELECT_RACE_MAP,
		SELECT_CANDIDATE_MAP
	    )
	)
    )


const requestGraph = (action$, state, {fetchGraph}) => action$
    .ofType(SELECT_GRAPH)
    .pluck('data')
    .filter(R.compose(
	isNotCached(state),
	({id}) => ['maps', id, 'zones']
    ))
    .switchMap(fetchGraph)

export default combineEpics(
    requestAutocompletions,
    requestSearchResults,
    requestRaceMap,
    requestCandidateMap,
    requestGeojson,
    requestGeocode,
    requestZoneResults,
    requestGraph
)


