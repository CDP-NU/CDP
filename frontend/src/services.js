import Rx from 'rxjs'
import { ajax } from 'rxjs/observable/dom/ajax';
import R from 'ramda'
import {
    fetchedAutocompletions,
    fetchedSearchResults,
    fetchedRaceMap,
    fetchedCandidateMap,
    fetchedZoneResults,
    fetchedGeocode,
    fetchedGeojson,
    fetchedGraph
} from './creators'

const base = '/database/election'

const post = (url, body) => ajax({
    url,
    method: 'POST',
    body,
    headers: {
	"Content-Type": 'application/json; charset=utf-8', responseType: 'json'
    }
}).pluck('response')


export const fetchAutocompletions = keyword => ajax
    .getJSON(`${base}/races/autocomplete/${keyword}`)
    .map(fetchedAutocompletions)
    
export const fetchSearchResults = (
    {keyword, startDate, endDate, elections, offices}
) =>
    post(
	`${base}/races/search/keyword`,
	{
	    keyword,
	    startDate,
	    endDate,
	    elections,
	    offices
	}
    )
    .map(fetchedSearchResults)

export const fetchSearchResultsWithoutKeyword = (
    {startDate, endDate, elections, offices}
) => 
    post(
	`${base}/races/search/filters`,
	{
	    startDate,
	    endDate,
	    elections,
	    offices
	}
    )
    .map(fetchedSearchResults)

export const fetchRaceMap = ({raceUri, level, id, geojson}) => ajax
    .getJSON(
	`${base}/uri/${raceUri}/level/${level}/winners`
    )
    .map(
	R.compose(
	    fetchedRaceMap,
	    R.merge({raceUri, level, id, geojson})
	)
    )

export const fetchCandidateMap = ({raceUri, candidate, level, id, geojson}) => ajax
    .getJSON(
	`${base}/uri/${raceUri}/candidate/${candidate}/level/${level}/colors`
    )
    .map(
	R.compose(
	    fetchedCandidateMap,
	    R.merge({raceUri, candidate, level, id, geojson})
	)
    )

export const fetchZoneResults = ({race, level, latlng, zone}) => ajax
    .getJSON(
	`${base}/race/${race}/level/${level}/zone/${zone}/candidates`
    )
    .map(
	R.compose(
	    fetchedZoneResults,
	    R.merge({race, latlng, level, zone})
	)
    )

export const fetchGeocode = ({street}) => ajax
    .getJSON(
	`${base}/geocode/${street}`
    )
    .map(
	R.compose(
	    fetchedGeocode,
	    R.merge({street})
	)
    )

export const fetchGeojson = ({geoYear: year, level}) => ajax
    .getJSON(
	`${base}/boundary/${year}/${level}`
    )
    .map(
	R.compose(
	    fetchedGeojson,
	    R.merge({year, level}),
	    R.objOf('json')
	)
    )

export const fetchGraph = ({raceUri, level, id, geojson}) => ajax
    .getJSON(
	`${base}/graph/${raceUri}/${level}`
    )
    .map(
	R.compose(
	    fetchedGraph,
	    R.merge({raceUri, level, id, geojson})
	)
    )
