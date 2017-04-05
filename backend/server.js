const express = require('express');
const path = require('path');
const massive = require("massive");
const request = require('request');
const app = express();
var parser = require('body-parser');

app.use(express.static('public'))
app.use(parser.json())

const connectionString = process.env.CDP_CONNECTION_STRING
const massiveDb = massive.connectSync({connectionString: connectionString})
app.set('db', massiveDb);

const base = '/database/election'

app.post(`${base}/races/search/keyword`, (req, res) => {

    var keyword = req.body.keyword;
    var start = req.body.startDate;
    var end = req.body.endDate;
    var elections = req.body.elections;
    var offices = req.body.offices;

    var db = app.get('db');

    var sql = 'SELECT * FROM search_keyword($1, $2, $3, $4, $5)'

    db.run(sql, [keyword, start, end, elections, offices], (err, races) => {
	res.json(races)
    })
})

app.post(`${base}/races/search/filters`, (req, res) => {

    var start = req.body.startDate;
    var end = req.body.endDate;
    var elections = req.body.elections;
    var offices = req.body.offices; 

    var db = app.get('db');

    var sql = 'SELECT * FROM search_filter($1, $2, $3, $4)'

    db.run(sql, [start, end, elections, offices], (err, races) => {
	res.json(races)
    })
})

app.get(`${base}/races/autocomplete/:keyword`, (req, res) => {
    const keyword = req.params.keyword
    const db = app.get('db');

    const sql = 'SELECT get_autocompletions($1) autocompletions'

    db.run(sql, [keyword], (err, data) => {
	res.json(data[0])
    })
})

app.get(`${base}/uri/:uri/level/:level/winners`, (req, res) => {
    const {uri, level} = req.params
    const db = app.get('db');

    const sql = 'SELECT get_race_info_and_candidates(id) "uriInfo", get_race_winner_colors(id, $2) winners FROM get_race_at_uri($1) id'

    db.run(sql, [uri, level], (err, raceData) => {
	if(!err) {
	    const map = raceData[0] || {}
	    const {race, candidates} = map.uriInfo
	    const {candidateColors, zoneColors} = map.winners
	    race.candidates = candidates
	    res.json({
		race,
		candidateColors,
		zoneColors
	    })
	}
	else {
	    res.json({})
	}
    })
})


app.get(`${base}/uri/:uri/candidate/:candidate/level/:level/colors`, (req, res) => {
    const {uri, candidate, level} = req.params
    const db = app.get('db');

    const sql = 'SELECT get_race_info_and_candidates(id) "uriInfo", get_candidate_zone_colors(id, $2, $3) "candidateZones" FROM get_race_at_uri($1) id'

    db.run(sql, [uri, candidate, level], (err, data) => {

	if(!err) {
	    const map = data[0] || {}
	    const {race, candidates} = map.uriInfo
	    const {rangeColors, zoneColors} = map.candidateZones
	    race.candidates = candidates
	    res.json({
		race,
		rangeColors,
		zoneColors
	    })
	}
	else {
	    res.json({})
	}
    })
})

app.get("/database/election/graph/:uri/:level", (req, res) => {

    const {uri, level} = req.params
    const db = app.get('db')

    const sql = 'SELECT get_race_info_and_candidates(id) "uriInfo", get_race_winner_colors(id, $2) winners, get_zones(id, $2) zones FROM get_race_at_uri($1) id'

    db.run(sql, [uri, level], (err, data) => {
	if(!err) {
	    const map = data[0] || {}
	    const {zones} = map
	    const {race, candidates} = map.uriInfo
	    const {candidateColors, zoneColors} = map.winners
	    race.candidates = candidates
	    res.json({
		race,
		candidateColors,
		zoneColors,
		zones
	    })
	}
	else {
	    res.json({})
	}
    })  
})

app.get(`${base}/race/:race/level/:level/zone/:zone/candidates`, (req, res) => {
    const {race, level, zone} = req.params
    const db = app.get('db')

    const sql = 'SELECT get_candidate_results_for_zone($1, $2, $3) "zoneCandidates"'
    
    db.run(sql, [race, level, zone], (err, data) => {
	res.json(data[0])
    })
})

app.get(`${base}/geocode/:street`, (req, res) => {

    const street = req.params.street
    const census = 'https://geocoding.geo.census.gov/geocoder/locations/address?street='
    const rest = '&city=Chicago&state=IL&benchmark=Public_AR_Census2010&format=json'

    const getUrl = census + street + rest

    const db = app.get('db');

    request(getUrl, function (error, response, body) {
	if (!error && response.statusCode == 200) {
	    const data = JSON.parse(body)
	    const result = data.result
	    const addressMatches = result && result.addressMatches
	    const match = addressMatches && addressMatches[0]
	    const coordinates = match && match.coordinates

	    if(coordinates) {

		const sql = 'SELECT zone_at_coordinates($1, $2) loc'
		const latlng = [coordinates.y, coordinates.x]
		
		db.run(sql, [coordinates.y, coordinates.x], (err, data) => {
		    
		    const loc = data[0] && data[0].loc || {}

		    res.json({
			ward: loc.ward,
			precinct: loc.precinct,
			latlng
		    })
		})
	    }
	}
	else { res.json({}) }
    })
})

app.get(`${base}/boundary/:year/:level`, (req, res) => {

    const year = req.params.year
    const level = req.params.level

    const getGeojsonFileName = (year, level) => {
	if(year === '2003' &&
	   level === 'ward') {
	    return 'wards2003'
	}
	if(year === '2003' &&
	   level === 'precinct') {
	    return 'precincts2003'
	}
	if(year === '2015' &&
	   level === 'ward') {
	    return 'wards2015'
	}
	if(year === '2015' &&
	   level === 'precinct') {
	    return 'precincts2015'
	}
	return null
    }

    const name = getGeojsonFileName(year, level)

    if(name) {
	const loc = `./boundary/${name}.geojson`
	res.sendFile(path.join(__dirname, loc));
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
