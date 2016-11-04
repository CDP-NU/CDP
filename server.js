const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config');
const internalIp = require('internal-ip');
const express = require('express');
const webpack = require('webpack');
const path = require('path');
const massive = require("massive");
const request = require('request');
const app = express();
const compiler = webpack(config);

const middleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  silent: false,
  stats: { color: true }
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));

const connectionString = 'postgres://cdp:lakefill@localhost/election'
const massiveDb = massive.connectSync({connectionString: connectionString})
app.set('db', massiveDb);



app.get("/election/searchraces/:keyword", (req, res) => {
    const keyword = req.params.keyword
    const db = app.get('db');

    db.search_races(keyword, (err, races) => {
	res.json(err ? err : races)
    })
})

app.get("/election/raceinfo/:election_url/:race_url/:level", (req, res) => {
    const {election_url, race_url, level} = req.params
    const db = app.get('db');

    db.race_info(election_url, race_url, (err, raceInfo) => {
	if(!err) {
	    const race = raceInfo[0].id
	    console.log('h', race, level)
	    db.race_heat_map(race, level, (err, heatMap) => {
		res.json(err ? err : {
		    raceInfo: raceInfo[0],
		    heatMap: heatMap[0]
		})
	    })
	}
	else {
	    res.json(err)
	}
    })
})

app.get("/election/candidateheatmap/:candidate/:level", (req, res) => {
    const {candidate, level} = req.params
    const db = app.get('db');

    db.candidate_heat_map(candidate, level, (err, heatMap) => {
	res.json(err ? err : heatMap[0])
    })
})

app.get("/election/raceheatmap/:race/:level", (req, res) => {
    const {race, level} = req.params
    const db = app.get('db');

    db.race_heat_map(race, level, (err, heatMap) => {
	res.json(err ? err : heatMap[0])
    })
})

app.get("/boundary/:year/:level", (req, res) => {
    
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

app.get("/election/keywords",function(request, response){

    const db = app.get('db');

    db.keywords((err, res) =>{
	response.json(
	    err ? err :
	    res.map( row => row.race_keyword)
	)
    })
});


app.get("/election/geocode/:street", (req, res) => {

    const street = req.params.street
    const census = 'https://geocoding.geo.census.gov/geocoder/locations/address?street='
    const rest = '&city=Chicago&state=IL&benchmark=Public_AR_Census2010&format=json'

    const getUrl = census + street + rest

    request(getUrl, function (error, response, body) {
	if (!error && response.statusCode == 200) {
	    const data = JSON.parse(body)
	    const result = data.result
	    const addressMatches = result && result.addressMatches 
	    const match = addressMatches && addressMatches[0] 
	    const coordinates = match && match.coordinates
	    res.json(coordinates)
	}
	else { res.json({}) }
    })
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './src/www/index.html'));
});


const port = 8080;
const ip = internalIp.v4();

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(' --------------------------------------');
  console.log(`    Local: http://0.0.0.0:${port}`);
  console.log(` External: http://${ip}:${port}`);
  console.log(' --------------------------------------');
});

