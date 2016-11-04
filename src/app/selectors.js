import { createSelector } from 'reselect'
import { getCandidateDictionary } from './entities/candidate.js'
import { getRace } from './entities/race.js'
import { getAutocompletions } from './entities/autocomplete.js'
import { getSearchResults } from './entities/search.js'


export {
    getCandidateDictionary, getRace,
    getAutocompletions, getSearchResults
}
