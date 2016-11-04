import { throttle } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { SEARCH_DATABASE, FETCHED_SEARCH_RESULTS } from '../actions.js'
import { fetchedSearchResults } from '../creators.js'
import { fetchSearchResults } from './fetch.js'



function* handleSearch({data: {keyword}}) {
    const {data: races} = yield call(
	fetchSearchResults, keyword
    )
    yield put(fetchedSearchResults(races))
}

export default function* watchSearch() {
    yield throttle(
	500, SEARCH_DATABASE, handleSearch
    )
}

    
