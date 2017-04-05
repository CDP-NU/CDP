import R from 'ramda'
import { normalize, schema } from 'normalizr'
import { generateMapId, geojsonIdFromMap } from './utility'

const candidate = new schema.Entity('candidates')

const race = new schema.Entity(
    'races',
    {candidates: [candidate]},
    {
	idAttribute: 'uri',
	processStrategy: ({uri, ...race}) => ({
	    ...race,
	   id: uri
	})
    }
)

export const aggregateMap = new schema.Entity(
    'maps',
    {race},
    {
	processStrategy: ({candidateColors, ...map}) => ({
	    ...map,
	    mapType: 'race',
	    legendEntities: candidateColors
	})
    }
)

export const candidateMap = new schema.Entity(
    'maps',
    {race},
    {
	processStrategy: ({candidate, rangeColors, ...map}) => ({
	    ...map,
	    mapType: 'candidate',
	    legendEntities: rangeColors.map(
		({minPct, maxPct, color}) =>
		    ({color, value: `${minPct} - ${maxPct}%`})
	    ),
	})		    
    }
)


export default schema => data => normalize(data, schema)
