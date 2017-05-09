import { composeWithDevTools } from 'redux-devtools-extension' /* REMOVE IN PRODUCTION !!! */
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { ajax } from 'rxjs/observable/dom/ajax';
import * as epics from './epics'
import * as reducers from './reducers'

const getParamsFromEntities = ([first, ...rest]) => rest.reduce(
    (result, entity) => `${result}&${entity}=true`,
    `${first}=true`
)

const base = '/database/election'

const getFile = url => ajax.getJSON(base + url)

const getJSON = (url, entities = []) => {

    const loc = entities.length > 0 ?
		`${url}?${getParamsFromEntities(entities)}` :
		url
    
    return ajax.getJSON(base + loc).pluck('data')
}

const post = (url, body) => ajax({
    url: base + url,
    method: 'POST',
    body,
    headers: {
	"Content-Type": 'application/json; charset=utf-8', responseType: 'json'
    }
}).pluck('response', 'data')


    

const rootEpic = combineEpics(
    epics.autocomplete,
    epics.search,
    epics.raceWardMap,
    epics.raceWardGraph,
    epics.racePrecinctMap,
    epics.candidateWardMap,
    epics.candidatePrecinctMap,
    epics.geojson,
    epics.geocode,
    epics.ward,
    epics.precinct
)

const epicMiddleware = createEpicMiddleware(
    rootEpic,
    {dependencies: {getFile, getJSON, post}}
)


const rootReducer = combineReducers(reducers)

//DEVELOPMENT
const store = createStore(
    rootReducer,
    {},
    composeWithDevTools( 
	applyMiddleware(
	    epicMiddleware
	)
    )
)

//PRODUCTION
/*
const store = createStore(
    rootReducer,
    {},
    applyMiddleware(epicMiddleware)
)
*/

export default store
