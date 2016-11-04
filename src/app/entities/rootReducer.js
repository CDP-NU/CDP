import {combineReducers} from 'redux'
import autocomplete from './autocomplete.js'
import search from './search.js'
import race from './race.js'
import candidate from './candidate.js'

export default combineReducers({
    autocomplete,
    search,
    race,
    candidate
})
