const { readFile } = require('fs')
const { join } = require('path')
const GraphQLJSON = require('graphql-type-json')
const request = require('request-promise')

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


module.exports = {
    JSON: GraphQLJSON,
    Query: {
	autocomplete: (_, {value}, {db}) => db
	    .autocomplete(value)
	    .then( ([{autocompletions}]) => autocompletions),
	search: (_, {keyword, start, end, elections, offices, demographies}, {db}) =>
	    keyword ? db.search(
		keyword, start, end, elections, offices, demographies
	    ) : db.search_without_keyword(
		start, end, elections, offices, demographies
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
	candidateMap: (_, {race, candidate, level}, {db}) => {

	    const queries = {
		WARD: 'candidate_ward_map',
		PRECINCT: 'candidate_precinct_map'
	    }

	    const candidateID = `${race}+${candidate}`
	    
	    return db[queries[level]](candidateID)
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
	},
	geocode: (_, {street}, {db}) => geocode(street, db),
	zoneCandidateData: (_, {race, level, zone}, {db}) => {

	    const queries = {
		WARD: 'race_ward',
		PRECINCT: 'race_precinct'
	    }

	    return db[queries[level]](race, zone)
	},
	zoneDemographyData: (_, {id, level, zone}, {db}) => {

	    const queries = {
		WARD: 'demography_ward',
		PRECINCT: 'demography_precinct'
	    }

	    return db[queries[level]](id, zone)
	    .then(([ret]) => ret)
	},
	compareCandidate: (_, {id, candidate}, {db}) => {

	    const candidateID = `${id}+${candidate}`
	    return db['compare_candidate'](id, candidateID)
	},
	breakdown: (_, {id, level}, {db}) => {
            
        const queries= {
            WARD: 'race_ward_breakdown',
            PRECINCT: 'race_precinct_breakdown'
        }
        
        return db[queries[level]](id)
    },
	demographyMap: (_, {id, level}, {db}) => {

		const queries= {
            WARD: 'demography_ward_map',
            PRECINCT: 'demography_pct_map'
        }
        return db[queries[level]](id)
	    .then( ([map]) => map )
	},

	demographyLevels: (_, {id, level}, {db}) => {
		const queries ={
			WARD: 'demography_ward_measure',
			PRECINCT: 'demography_pct_measure'
		}
		return db[queries[level]](id).then(([result]) => result)
    },
}
}
