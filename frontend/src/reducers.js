import R from 'ramda'
import {
    AUTOCOMPLETE,
    UPDATE_AUTOCOMPLETIONS,
    CLEAR_AUTOCOMPLETIONS,
    SEARCH_DATABASE,
    UPDATE_SEARCH_RESULTS,
    SELECT_RACE_MAP,
    SELECT_CANDIDATE_MAP
} from './actions'

const createEntityReducer = (name, onUpdate) => (state = {}, action) => {

    const entities = R.path(['entities', name], action)
    return entities ? onUpdate(state, entities) : state
}
	

export const autocompletions = (state = [], action) => {
    switch(action.type) {
	case AUTOCOMPLETE:
	    return R.isEmpty(state) ? [' '] : state
	case UPDATE_AUTOCOMPLETIONS:
	    return R.defaultTo(
		[' '], action.entities.autocompletions
	    )
	case SEARCH_DATABASE:
	case CLEAR_AUTOCOMPLETIONS:
	    return []
	default:
	    return state
    }
}

export const searchResults = (state = {
    timestamp: undefined,
    items: []
}, action) => {
    switch(action.type) {
	case UPDATE_SEARCH_RESULTS:
	    return action.entities.searchResults
	case SELECT_RACE_MAP:
	case SELECT_CANDIDATE_MAP:
	    return action.data.isMobile ? {
		...state,
		items: []
	    } : state
	default:
	    return state
    }
}



export const races = createEntityReducer('races', R.merge)
export const candidates = createEntityReducer('candidates', R.merge)
export const maps = createEntityReducer('maps', R.merge)
export const geojsons = createEntityReducer('geojsons', R.merge)
export const popup = createEntityReducer('popup', (_, next) => next)
