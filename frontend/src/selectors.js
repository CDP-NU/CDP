import R from 'ramda'
import { createSelector, createStructuredSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import {
    onUpdate,
    generateMapId
} from './utility'

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize, R.equals
)

export const getAutocompletions = R.prop('autocompletions')
export const getSearchResults = R.path(['searchResults', 'items'])
export const getPopup = R.prop('popup')

const getMapId = R.compose(
    generateMapId,
    R.path(['match', 'params'])
)

const getRace = R.useWith(
    (races, id) => races[id],
    [R.prop('races'), R.path(['match', 'params', 'raceUri'])]
)

export const getRacePath = R.compose(
    onUpdate(R.props(['date', 'electionType', 'name'])),
    getRace,
)

export const getMap = R.useWith(
    (maps, id) => maps[id],
    [R.prop('maps'), getMapId]
)


const getRaceCandidates = R.converge(
    (race = {}, allCandidates) => R.map(
	id => allCandidates[id],
	R.propOr([], 'candidates', race)
    ),
    [getRace, R.prop('candidates')]
)

export const getBarGraphCandidates = createDeepEqualSelector(
    getRaceCandidates,
    R.project(['name', 'votePct'])
)

export const getMapList = createDeepEqualSelector(
    getRaceCandidates,
    R.prepend({id: 'aggregate', name: 'Aggregate'})
)
	
export const getMapName = R.useWith(
    (candidates, name) =>
	name === 'aggregate' ? name : R.path([name, 'name'], candidates),
    [R.prop('candidates'), R.path(['match', 'params', 'name'])]
)


export const getScatterPlotZones = createSelector(
    R.compose(onUpdate(R.prop('zones')), getMap),
    R.compose(onUpdate(R.prop('zoneColors')), getMap),
    (zones = [], zoneColors = {}) => R.map(
	({zone, voters, turnout}) => [
	    voters,
	    turnout * 100,
	    R.propOr('#fff', zone, zoneColors)
	],
	zones
    )
)

export const getScatterPlot = createStructuredSelector({
    entities: R.compose(
	onUpdate(R.prop('legendEntities')),
	getMap
    ),
    points: getScatterPlotZones
})


const getMapGeojson = R.converge(
    (map = {}, geojsons) => R.path([map.geojson, 'json'], geojsons),
    [getMap, R.prop('geojsons')]
)

export const getHeatMap = createSelector(
    getMap,
    getMapGeojson,
    R.useWith(
	onUpdate(R.merge),
	 [
	     onUpdate(
		({race, level, zoneColors, legendEntities}) => ({
		    mapMetaData: {race, level},
		    zoneColors,
		    legendEntities,
		    zoneKey: level === 'precinct' ? 'wpid' : 'ward'
		}),
	    ),
	    onUpdate(R.objOf('geojson'))
	]
    )
)
