const express = require('express')
const path = require('path')
const massive = require('massive')
const request = require('request')
const app = express()
const parser = require('body-parser')

app.use(express.static('public'))
app.use(parser.json())

const connectionString = CDP_DATABASE_STRING

const massiveDb = massive.connectSync({connectionString: connectionString})
app.set('db', massiveDb)

const base = '/database/election'


const createDbHandler = (res, params, config) => (err, dbResponse) => {

    const {
	defaultOnEmptyResponse,
	single = true,
	select
    } = config
    
    if(err) {
	console.log('err', err, 'response',  dbResponse)
	res.sendStatus(500)
    }
    else if(!dbResponse.length) {
	if(defaultOnEmptyResponse) {
	    res.json({data: defaultOnEmptyResponse})
	}
	else {
	    res.sendStatus(404)
	}
    }
    else {
	if(single) {

	    const [dbData] = dbResponse
	    
	    if(select) {

		const requestedEntities = select.filter(
		    name => params[name]
		)
		
		const entityData = requestedEntities.reduce(
		    (entities, name) => Object.assign(
			{}, entities, {[name]: dbData[name]}
		    ),
		    {}
		)

		res.json({data: entityData})
	    }
	    else {
		res.json({data: dbData})
	    }
	}
	else {
	    res.json({data: dbResponse})
	}
    }
}

const useDbHandler = (url, callback, config = {}) => {

    const {method = 'GET'} = config
    
    const loc = base + url
    
    switch (method) {
	case 'GET':
	    app.get(loc, (req, res) => callback(
		req.params,
		app.get('db'),
		createDbHandler(res, req.query, config),
		res
	    ))
	    break
	case 'POST':
	    app.post(loc, (req, res) => callback(
		req.body,
		app.get('db'),
		createDbHandler(res, {}, config),
		res
	    ))
	    break
	default:
	    break
    }
}


useDbHandler(
    '/autocomplete/:keyword',
    ({keyword}, db, handler) => db.autocomplete(keyword, handler),
    {defaultOnEmptyResponse: {autocompletions: []}}
)

useDbHandler(
    '/search',
    (
	{
	    keyword,
	    startDate: start,
	    endDate: end,
	    elections,
	    offices
	},
	db,
	handler
    ) => keyword ?
       db.search([keyword, start, end, elections, offices], handler) :
       db.search_without_keyword([start, end, elections, offices], handler),
    {
	method: 'POST',
	single: false,
	defaultOnEmptyResponse: []
    }
)


useDbHandler(
    '/race/:slug/wards/map',
    ({slug}, db, handler) =>  { db.get_race_ward_map(slug, handler) },
    {select: ['race', 'candidates', 'raceWardMap']}
)

useDbHandler(
    '/race/:slug/wards/graph',
    ({slug}, db, handler) => db.get_race_ward_graph(slug, handler),
    {select: ['race', 'candidates', 'raceWardMap', 'raceWardStats']}
)

useDbHandler(
    '/race/:slug/precincts/map',
    ({slug}, db, handler) => db.get_race_precinct_map(slug, handler),
    {select: ['race', 'candidates', 'racePrecinctMap']}
)


useDbHandler(
    '/race/:slug/ward/:ward',
    ({slug, ward}, db, handler) => db.race_ward([slug, ward], handler),
    {single: false}
)

useDbHandler(
    '/race/:slug/precinct/:wpid',
    ({slug, wpid}, db, handler) => db.race_precinct([slug, wpid], handler),
    {single: false}
)



useDbHandler(
    '/candidate/:slug/wards/map',
    ({slug}, db, handler) => db.get_candidate_ward_map(slug, handler),
    {select: ['race', 'candidates', 'candidateWardMap']}
)

useDbHandler(
    '/candidate/:slug/precincts/map',
    ({slug}, db, handler) => db.get_candidate_precinct_map(slug, handler),
    {select: ['race', 'candidates', 'candidatePrecinctMap']}
)



useDbHandler(
    '/geocode/:street',
    ({street}, db, handler, res) => {

	const census = 'https://geocoding.geo.census.gov/geocoder/locations/address?street='
	const rest = '&city=Chicago&state=IL&benchmark=Public_AR_Census2010&format=json'

	const getUrl = census + street + rest

	request(getUrl, function (error, response, body) {
	    if (!error && response.statusCode == 200) {

		const data = JSON.parse(body)
		const {result = {}} = data
		const {addressMatches = []} = result 
		const [match = {}] = addressMatches 
		const {coordinates} = match

		if(coordinates) {
		    const latlng = [coordinates.y, coordinates.x]
		    db.geocode(latlng, handler)
		}
		else {
		    res.json({data: {notFound: true}})
		}
	    }
	    else { res.json({data: {notFound: true}}) }
	})
    },
    {defaultOnEmptyResponse: {notFound: true}}
)


app.get(`${base}/geojson/:geojson`, (req, res) => {

    const {geojson: id} = req.params

    const geojsons = {
	wards2003: 'wards2003',
	wards2015: 'wards2015',
	precincts2003: 'precincts2003',
	precincts2015: 'precincts2015'
    }

    const name = geojsons[id]

    if(name) {
	const loc = `./boundary/${name}.geojson`
	res.sendFile(path.join(__dirname, loc))
    }
    else {
	res.sendStatus(404)
    }
})

/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});*/


const port = 8080;


app.listen(port, (err) => {
    if (err) {
	console.log(err);
	return;
    }

    console.log(' --------------------------------------');
    console.log(`    Local: http://0.0.0.0:${port}`);
    console.log(' --------------------------------------');
});
