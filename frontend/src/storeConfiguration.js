import { composeWithDevTools } from 'redux-devtools-extension' /* REMOVE IN PRODUCTION !!! */
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import epics from './epics'
import * as services from './services'
import * as reducers from './reducers'

const epicMiddleware = createEpicMiddleware(
    epics,
    {dependencies: services}
)

const rootReducer = combineReducers(reducers)

const store = createStore(
    rootReducer,
    {},
    composeWithDevTools(
	applyMiddleware(
	    epicMiddleware
	)
    )
)

export default store
