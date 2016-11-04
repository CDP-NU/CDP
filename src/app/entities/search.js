import { createSelector } from 'reselect'
import { FETCHED_SEARCH_RESULTS } from '../actions.js'

export default (state = [], action) => {
    switch(action.type) {
	case FETCHED_SEARCH_RESULTS:
	    return action.data.races
	default:
	    return state
    }
}

const getSearchResults = state => state.search

export {getSearchResults}
