# Chicago Democracy Project Database

## Mac Installation

[Install postgres](https://postgresapp.com/)
Place the election dump in (usually a .bak file) in an easy to access directory. [This is a generally useful link for help.](https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb)
Postgres is funky.  When you install it, there will be a default database called 'postgres' created AND a default role (in other words, a username) called 'postgres.'  Create a local username
In bash, run the command `pg_restore -C -d postgres election_dump.bak`, where `election_dump.bak` is the dump file of the database. This command opens postgres databse 'postgres' and then creates a new database named election5 or whatever was specificed in the dump.  This is crucial.

[Install Node and NPM](http://blog.teamtreehouse.com/install-node-js-npm-mac)

`git clone https://github.com/cory17/CDP.git`

Navigate to CDP/frontend-graphql and enter `npm install`. Then,
navigate to CDP/backend-graphql and enter `npm install` again

Navigate to CDP/backend-graphql/server.js and change the connectionString to be in the format: `const connectionString = 'postgres://[username]:[password]@localhost/[database name]'`.  Mine looks like `postgres://postgress:[my password]@localhost/election5`.

## Running locally

Open Google Chrome and postgres. Then, navigate to CDP/backend and enter `npm start`. Next, open a new terminal tab/window and navigate to CDP/frontend. Enter `npm start`. Google Chrome should begin loading the site. 


## Create-React-App boilerplate

The frontend uses [create-react-app-antd](https://github.com/ant-design/create-react-app-antd). This boilerpate is based on https://github.com/facebookincubator/create-react-app and provides hot-module-reloading, linting, minification, autoprefixer, webpack, babel, and other nice development tools. In order to create a production build of the app, enter `npm run build`. The production files will be located in frontend/build

# Front end 

## File Structure
The front end source files are located in frontend/src. The entry file is index.js. [The components folder](https://github.com/cory17/CDP/tree/master/frontend/src/components) holds all of the React components. The "actions" file contains [redux](http://redux.js.org) actions, "epics.js" contains [Redux Observable epics](https://redux-observable.js.org), "reducers.js" contains Redux reducers, and "storeConfiguration.js" is where the Redux store is configured with epics and reducers. "map.js" provides an interface to Leaflet and is passed via context from "Map.js" to its child components. 

## Fetch data flow example
The data flow for fetching is generally: Query -> request-action -> epic -> fetch-action -> reducer -> Subscription

For example, here's the RaceWardMap component
```javascript
const RaceWardMap = ({
    race,
    candidates,
    geojson,
    colors,
    onClick,
    popup
}) => (
    <HeatMap mapKey={race}
	     zoneKey="ward"
	     geojson={geojson}
	     colors={colors}
	     onClick={onClick}
	     legend={candidatesToHtml(candidates)}>
	{popup ? <MapPopup {...popup}/> : null}
    </HeatMap>
)
```
It is wrapped in the following [HOC](https://facebook.github.io/react/docs/higher-order-components.html) prior to being exported

```javascript

export default compose(
    withQuery(
	actions.REQUEST_RACE_WARD_MAP,
	['race', 'geojson']
    ),
    withSubscription({
	candidates: 'race',
	raceWardMap: 'race',
	geojson: 'geojson'
    }),
    renameProp('raceWardMap', 'colors'),
    branch(
	({loading}) => loading,
	renderNothing
    ),
    withWard
)(RaceWardMap)
```

"withQuery" wraps everything in a Query component. The arguments to "withQuery" indicate that the component will dispatch a "REQUEST_RACE_WARD_MAP" action whenever the "race" or "geojson" props change. The action will have a "request" property with the values of the "race" and "geojson" props. The "geojson" epic fetches the geojson and the "raceWardMap" epic fetches the race data. Here's the raceWardMap epic:

```javascript
export const raceWardMap = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_RACE_WARD_MAP)
    .let(
	checkStateFor(state, ({race}) => ({
	    race,
	    candidates: race,
	    raceWardMap: race
	}))
    ).switchMap(
	({race, neededEntities}) => getJSON(
	    `/race/${race}/wards/map`, neededEntities
	).let(fetchOf(
	    actions.REQUEST_RACE_WARD_MAP,
	    entities => ({
		data: {race},
		entities
	    })
	))
    )
```

"checkStateFor" will lookup the state of the "race", "candidates", and "raceWardMap" reducers for the requested race. If all the values are cached, no request will be made and the epic will not progress further. Otherwise, the needed entities, along with the key/value pairs from the request object, will be passed to the ["switchMap" operator](https://www.learnrxjs.io/operators/transformation/switchmap.html). The backend will only fetch the entities specified in "neededEntities". Once the data is fetched, it will be passed to the reducers and then the redux state will be updated with the new values. Any component wrapped in a Subscription (via "withSubscription") will be updated with the new data


