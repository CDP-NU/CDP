import {createSelector} from 'reselect'
import { SELECT_RACE, FETCHED_RACE } from '../actions.js'

export default (state = [], action) => {
    switch(action.type) {
	case SELECT_RACE:
	    return []
	case FETCHED_RACE:
	    return action.data.candidates
	default:
	    return state
    }
}

const getCandidates = state => state.candidate

const getCandidateDictionary = createSelector(
    getCandidates,
    candidates => {
	const result = candidates.map(
	    ({id, name}) => ({
		value: id,
		label: name
	    })
	)
	return [
	    ...result,
	    {
		value: 0,
		label: 'All'
	    }
	]
    }
)

export {getCandidateDictionary}
