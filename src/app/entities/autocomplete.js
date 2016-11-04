import {createSelector} from 'reselect'
import { FETCHED_AUTOCOMPLETIONS } from '../actions.js'

export default (state = [], action) => {
    switch(action.type) {
	case FETCHED_AUTOCOMPLETIONS:
	    return action.data.completions
	default:
	    return state
    }
}

const getAutocompletions = state => state.autocomplete

export { getAutocompletions }
