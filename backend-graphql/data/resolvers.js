import { readFile } from 'fs'
import { join } from 'path'
import GraphQLJSON from 'graphql-type-json'
import request from 'request-promise'

const getFile = path => new Promise(
    (resolve, reject) => {
	readFile(path, 'utf8', (error, result) => {
	    if (error) {
		reject(error)
	    } else {
		resolve(result)
	    }
	})
    }
)

async function geocode(street, db) {

    const census = 'https://geocoding.geo.census.gov/geocoder/locations/address?street='
    const rest = '&city=Chicago&state=IL&benchmark=Public_AR_Census2010&format=json'

    const getUrl = census + street + rest

    let body = await request(getUrl)

    const data = JSON.parse(body)
    const {result = {}} = data
    const {addressMatches = []} = result
    const [match = {}] = addressMatches
    const {coordinates} = match

    if(coordinates) {
	const latlng = [coordinates.y, coordinates.x]

	const response = await db.geocode(latlng)
	const [geocode] = response
	return geocode
    }
    else {
	return null
    }
}


export default {
    JSON: GraphQLJSON,
    Query: {
	autocomplete: (_, {value}, {db}) => db
	    .autocomplete(value)
	    .then( ([{autocompletions}]) => autocompletions),
	search: (_, {keyword, start, end, elections, offices}, {db}) =>
	    keyword ? db.search(
		keyword, start, end, elections, offices
	    ) : db.search_without_keyword(
		start, end, elections, offices
	    ),
	race: (_, {id}, {db}) => db
	    .race(id)
	    .then( ([race]) => race ),
	raceMapColors: (_, {id, level}, {db}) => {

	    const queries = {
		WARD: 'race_ward_colors',
		PRECINCT: 'race_precinct_colors'
	    }

	    return db[queries[level]](id)
		.then( ([{colors}]) => colors)
	},
	raceWardStats: (_, {id}, {db}) => db
	    .race_ward_stats(id)
	    .then( ([{stats}]) => stats ),
	candidateMap: (_, {id, level}, {db}) => {

	    const queries = {
		WARD: 'candidate_ward_map',
		PRECINCT: 'candidate_precinct_map'
	    }

	    return db[queries[level]](id)
		.then( ([map]) => map )
	},
	geojson: (_, {year, level}) => {

	    const years = {
		2003: '2003',
		2015: '2015'
	    }

	    const levels = {
		WARD: 'wards',
		PRECINCT: 'precincts'
	    }

	    const yearString = years[year]
	    const levelString = levels[level]

	    return yearString && levelString ? getFile(join(
		__dirname,
		`/boundary/${levelString}${yearString}.geojson`
	    )) : null
	} ,
	geocode: (_, {street}, {db}) => geocode(street, db)
    }
}
