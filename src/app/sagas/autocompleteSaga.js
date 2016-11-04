import axios from 'axios'
import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { fetchAutocompletions } from './fetch.js'
import { fetchedAutocompletions } from '../creators.js'


function* handleAutocomplete() {
    const {data} = yield call(fetchAutocompletions)
    yield put(fetchedAutocompletions(data))
}

export default function* watchAutocomplete() {
    yield takeLatest(
	'REQUEST_AUTOCOMPLETIONS',
	handleAutocomplete
    )
}


