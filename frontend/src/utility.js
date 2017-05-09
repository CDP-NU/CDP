import Rx from 'rxjs'
import { compose } from 'redux'
import * as actions from './actions'

//REMOVE tap IN PRODUCTION
/*export const tap = (...messages) => x => {
    console.log(...messages, x)
    console.log('one')
    return x
}*/

export const map = f => values => values.map(f)

export const isMobile = () => window
    .matchMedia("(max-width: 690px)")
    .matches

export const merge = (x, y) => ({...x, ...y})
export const mergeProps = x => y => ({...y, ...x})

export const prop = key => x => x[key]

export const eqByProps = (names, x, y) => names.every(
    name => x[name] === y[name]
)

export const pick = (keys, x) => keys.reduce(
    (result, key) => ({
	...result,
	[key]: x[key]
    }),
    {}
)


export const mapActions = [
    actions.REQUEST_RACE_WARD_MAP,
    actions.REQUEST_RACE_PRECINCT_MAP,
    actions.REQUEST_CANDIDATE_WARD_MAP,
    actions.REQUEST_CANDIDATE_PRECINCT_MAP
]

export const fetchOf = (requestName, resolver) => response$ => response$
    .map( responseData => ({
	...resolver(responseData),
	type: actions.FETCH,
	requestName
    }))
    .catch( ({status}) => Rx.Observable.of({
	type: actions.FAILED_REQUEST,
	data: {
	    requestName,
	    timestamp: Date.now(),
	    errorType: status === 404 ?
		       'not found' : 'generic'
	}
    }))


export const injectEntity = (type, reducer, callback) => (state, action) => {
    if(!state) { return reducer(state, action) }
    if(action.entities && action.entities[type]) {
	return callback(state, action.entities[type], action)
    }
    return reducer(state, action)
}

export const getEntitiesNotInState = compose(
    entities => entities.map( ({type}) => type ),
    entities => entities.filter( ({value}) => !value ),
    ({entityIDs, state}) => Object.keys(entityIDs).map(
	compose(
	    ([type, id]) => ({type, id, value: state[type][id]}),
	    entityType => [entityType, entityIDs[entityType]],
	)
    )
)



export const checkStateFor = (state, mapRequestToEntityIDs) => request$ => request$
    .pluck('request')
    .map( request => ({
	...request,
	neededEntities: getEntitiesNotInState({
	    entityIDs: mapRequestToEntityIDs(request),
	    state: state.getState()
	})
    }))
    .filter(({neededEntities}) => neededEntities.length > 0)


export const candidatesToHtml = map(
    ({name, color}) => ({
	color, value: name
    })
)

export const stdcatsToHtml = map( ({stdmin, stdmax, color}) => ({
    color,
    value: `${stdmin} - ${stdmax}%`
}))

