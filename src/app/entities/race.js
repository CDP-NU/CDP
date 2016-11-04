//import { createSelector } from 'reselect'
import { SELECT_RACE, FETCHED_RACE } from '../actions.js'

export default (state = null, action) => {
    switch(action.type) {
	case SELECT_RACE:
	    return null
	case FETCHED_RACE:
	    return action.data.race
	default:
	    return state
    }
}

const getRace = state => state.race

export {getRace}
