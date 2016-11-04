import { spawn } from 'redux-saga/effects'
import leafSaga from './leafSaga.js'
import autocompleteSaga from './autocompleteSaga.js'
import searchSaga from './searchSaga.js'

export default function* root() {
    yield spawn(leafSaga)
    yield spawn(autocompleteSaga)
    yield spawn(searchSaga)
}
