# Schematic of CDP website
## by Ethan Roubenoff
### Drafts 14 August 2017, 29 April 2018

This is a general schematic of the CDP website as it stands.  There are four components of the website: the frontend, the backend, the server and the database.  The first two are very clearly delineated but the latter are more or less one big thing.  In the frontend you will find presentational components (stuff you see).  The database holds the data in an easy-to-read format.  The frontend gives a command to the backend to ask the server to get some data from the database.

## Mac Installation Instructions

[Install postgres](https://postgresapp.com/)

Place the election dump (usually a .bak file) in an easy to access directory. See below for creating a database. [This is a generally useful link for help](https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb). Postgres is funky.  When you install it, there will be a default database called 'postgres' created AND a default role (in other words, a username) called 'postgres.'  Create a local username (usually postgres).  In bash, run the command `pg_restore -C -d postgres election_dump.bak`, where `election_dump.bak` is the dump file of the database. This command opens postgres database 'postgres' and then creates a new database named election5 or whatever was specificed in the dump.  This is crucial.

[Install Node and NPM](http://blog.teamtreehouse.com/install-node-js-npm-mac)

Navigate to a new folder and enter the command: `git pull <https://github.com/CDP-NU/CDP.git>` 

Navigate to CDP/frontend-graphql and enter `npm install`. Then, navigate to CDP/backend-graphql and enter `npm install` again.  You may need to run a `npm update -i` but be very careful regarding dependencies.

Navigate to CDP/backend-graphql/server.js and change the connectionString to be in the format: `const connectionString = 'postgres://[username]:[password]@localhost/[database name]'`.  Mine looks like `postgres://postgress:[my password]@localhost/election5`.  This is dependent on how you have the database configured.

## Running locally

Open Google Chrome and postgres. Then, navigate to CDP/backend-graphql and enter `nodemon start`. Next, open a new terminal tab/window and navigate to CDP/frontend-graphql. Enter `nodemon start`. Google Chrome should begin loading the site.  You need to keep both of these windows opwn.  Note, nodemon is a npm plugin that reboots the server when anything changes.  I find it very useful.


## Creating a production build to put on the server

The frontend uses [create-react-app-antd](https://github.com/ant-design/create-react-app-antd). This boilerpate is based on https://github.com/facebookincubator/create-react-app and provides hot-module-reloading, linting, minification, autoprefixer, webpack, babel, and other nice development tools. 

On your local machine, run the following commands: 
1. run `cd CDP/frontend-graphql`
2. run `npm run build`
3. run `mv build CDP/backend-graphql/public`
4. In `CDP/backend-graphql/server.js`:
 - Change the `connectionString` to `postgres://cdp:lakefill@localhost:5432/election5`
 - Uncomment the lines underneath `/*** IN PRODUCTION ***/`
 - Remove `CDP/backend-graphql/node_modules` if it exists
5. Move `CDP/backend-graphql` to the server.  Once you're in, `sudo -i` and move the folder to `root/current_site`.  Be sure to keep a version of the previous website in `site_archives`.
6. `ssh ` into the server and `cd` into the folder
7. run `npm install`
8. run `forever stopall`
9. run `NODE_ENV=production forever start server.js`

Common troubleshooting things: sometimes the command `forever stopall` doesn't actually stop everything.  If you're trying to load a new build and it keeps crashing, run a variant of `sudo killall node`.

## Creating a database

Navigate to the current database folder in the repo (currently `database8/`).  The file `database.sql` contains a sql script that will turn four .csv files (demography and race at the ward and precinct levels).  If you need to make a new version of the database make sure you save the current one.

Instructions for updating a database (by way of creating a new database):

1. create a copy of the current database folder and store as a .tar.gz
2. cd into new database folder
3. if needed, convert .dta files to .csv 
4. replace the relevant .csv files keeping the same names [wardALLshortr.csv, precinctALLshortr.csv, CDPDemographyACS2014Ward2015Stacked.csv].  Compare the new files with the old files— you may need to rearrange some columns.  NOTE that the sql file only works if the columns are in the exact same order as the old file!!
5. enter `source create.sh name-of-database` to populate a new database with the data
6. update `backend-graphql/server.js` to reflect the name of the new server, if different from current

Note: Do this all on your local machine first! Do not mess up the server. Option: copy this database folder onto your local machine, make sure it works, create a dump, copy the dump to the server and run the restore command
Note: pg_restore and pg_dump are really, really finnecky commands.  In order for them to work, there must be a postgres database already up and running on the server (which usually is true).  This is just a superuser database.  On the server it is called 'cdp'; on your local machine it may be called something different.  To check what databases are already up and running on your local machine, in terminal run:
```
psql
\l
```
and pick from any of the ones listed.
Note: You can name the new database anything you want.  In order to preserve continuity we call them "election#", where # is just the serial number we're on.  As of writing this, we're on "election5", and I will name the next one "election6", etc. When you create a backup of the database you can call it election5.tar.gz and current database (whatever it is called) should be in the "current_database" folder.


to create a dump of the database on the server (note that for these commands you need to use the role 'cdp' but on your local machine, use whatever your local superuser is; and there are no quotes around anything!!):
        `pg_dump -Fc 'name-of-database' -U 'cdp' -p 5432 --no-privileges --no-owner > election.bak`

to restore the dump to a server:
        `pg_restore -U ‘cdp’ -d ‘name-of-database’ -p 5432 database.bak`


# Frontend
We use [React](https://reactjs.org/) and [JSX](https://reactjs.org/docs/introducing-jsx.html) for the frontend.  We use a deeply nested component structure to organize the website, which I have found particularly useful for organization.  Maps are generated using [Leaflet](https://leafletjs.com/) and graphs using [D3](https://d3js.org/).

Instead of having a global state managed by Redux, we use conditional path rendering using [react-router](https://github.com/ReactTraining/react-router).  This means that the URL of the page is responsible for everything displayed (with the exception of the search results).  React-router will conditionally render components based off of certain parameters passed within a `<Switch />` statement, and pass those parameters to the rendered component.  It's really a very cool functionality and eliminates the need for something as clunky as Redux.  

#### A note on Higher Order Components (HOCs)
We wrap our components before using them.  This was one of the hardest parts of the website for me to understand, so I'm going to go into very elaborate detail here. HOCs allow for modularity, which is the key function of React.  We could just as easily explicitly call a component, but the React ideology is all about modularity, so we do this.

Our implementation of HOCs follow the general formula: `compose(some modifiers)(Base component) = HOC`.  Let's say we have a very simple base component, like such:
   ```javascript
   const BaseComponent = ({prop1, prop2}) => {console.log(prop1, prop2) return null}
   ```
   This component is a function, named BaseComponent, that takes in two props as arguments, prints them to the console, then returns null.  
   In order to correctly execute BaseComponent, we 'compose' it:
   ```javascript
   compose(
        mapProps(({prop1, prop2}) => {return {prop1, prop2}
        })
    )(BaseComponent)
    ```
   What this is effectively doing is taking `prop1` and `prop2` of the parent component and passing them as `prop1` and `prop2` to the BaseComponent.

For a more in depth explanation, let's take `GraphPage.js` as an example, which is called once by `App.js` (see below for how that is called).  The base component here is called GraphPage, which takes arguments `({raceID, graph, onGraphChange})`, and returns a `<div />`.  
    Note: for simplicity's sake, when we see arguments surrounded by curly braces (`{}`), those arguments are props and not plain old arguments. Props are a React.js specific concept that is roughly an 'attribute'. 

You can see in the rest of Graphpage what these arguments do: `raceID` is passed to whatever component is rendered, `graph` is the result given by the dropdown menu (here called `<Select>`), and `onGraphChange` is a callback function.

However, the next chunk of code: 
```javascript
export default compose(
    mapProps(({match: {params}, ...props}) => ({
        ...props,
        ...params,
    })),
    withHandlers({
        onGraphChange: ({raceID, history}) => graph =>
            history.push(`/race/${raceID}/graphs/${graph}`)
    })
)(GraphPage)
```
Is where things get interesting-- the composition.  There are two things going on here: we're mapping props from the parent component with `mapProps` and defining function handlers `withHandlers`-- a fancy word for callback functions.  Let's break them down.
- `mapProps(...)` takes arguments `({match: {params}, ...props})` and returns `({...props, ...prarams})`.  Think of `...` as just meaning 'all of them'-- so return every prop and every param.  When react-router in App.js calls GraphPage, it passes parameters to the GraphPage in `match.params`.  This function takes App's `match.params` and all the rest of the props in App, and passes them with the same name to GraphPage.
-  `withHandlers(onGraphChange: (...))` defines the onGraphChange callback we discussed above.  It takes the `raceID` and `history` props and the `graph` value and pushes a new URL with those variables.
These are then bound to GraphPage, and the 'enhanced' version of GraphPage is what is exported as default. 

# Backend
We use graphql for the backend.  Graphql is a framework for querying a database.  There are three important aspects of graphql:
-The graphql call on the frontend
-The schema
-The resolvers

A frontend component dispatches a call.  In a frontend component's `compose` statement, there will be a call that looks like `graphql(gql(...))`.  This calls graphql given the supplied parameters.  Let's break down an example from `BarGraph.js`.  The compose statement calls `graphql(candidateStatsQuery)`:
```javascript
const candidateStatsQuery = gql`
query CandidateStats($raceID: ID!) {
    race(id: $raceID) {
        id
        candidates {
            id
            name
            color
            pct
        }
    }
}`
```
The component prop `raceID` is automatically passed as the `raceID` parameter.  It is important that you are consistent with prop and parameter names!  This is a query named `CandidateStats`, which queries for `race` based off of the given parameter.

The schema describes the data structures involved in graphql. `race` is defined in `schema.js`'s `query` as taking in a `raceID` and returning an object type `Race`, which has the following properties: 
```javascript
type Race {
  id: ID!
  name: String
  date: String
  year: Int
  electionType: String
  office: String
  candidates: [Candidate]!
}
```
We only want the `id` and `candidates` for our purposes here.  

`Resolvers.js` is what links the query with the database.  The resolver for `race` looks like:
```javascript
race: (_, {id}, {db}) => db.race(id).then( ([race]) => race )
```
Resolvers are complicated.  I'll go through is bit by bit.
Arguments `(_, {id}, {db})`: `_` is the context (don't worry about it), `{id}` is the supplied `id` parameter from the call, and `{db}` is the database.  `db.race(id)` means run `race.sql` on `db` with argument `id` (note: the resolvers automatically recognize `.race` as referring to the corresponding sql script; you don't have to import it!).  `.then( ([race]) => race)` turns the array returned into an object.  

If you need data that is not currently available, you can write a sql script and put it in `.db`, write a schema for the format you need the data in (make sure you add a query!), write a resolver, and then write the actual `gql` query itself.  If you need a whole new table that doesn't exist in the database, you can add that table to `database.sql` and re-create the database with the new table.

# Component Tree
```
index.js
  |
<App />
  |----[Sidebar]
  |    <Switch>
  |       |
  |       |----<DatabaseSearchContainer /> 
  |                   |
  |                   |----<DatabaseSearch />
  |                               |
  |                               |----<SearchResultMenu />
  |
  |----[TopBar]
  |    <Switch>
  |       |                           |
  |       |----<HomeTopBar />         |
  |       |----<CompareTopBar />      |-- <Help />
  |       |----<DemographyTopBar />   |
  |       |----<TopBar />             |
  |
  |
  |----[Main Content]
          |
       <Switch>
          |----<MapPageContainer />
          |           |
          |           |----<MapPage />
          |                     |
          |                     |----<Map />
          |                             |
          |                         <Switch>                 
          |                             |----<RaceMap />      |----<HeatMap />
          |                             |----<CandidateMap /> |       |  
          |                                                           |----<MapGeojson />
          |----<GraphPage />
          |         |
          |         |----<BarGraph />
          |         |----<Breakdown />
          |         |----<Scatterplot />
          |
          |----<DemographyMap />
          |         |
          |         |----<Map />
          |                 |
          |                 |----<MapGeojson />
          |
          |----<ComparePage />
                    |
                  <Switch>
                    |----<CompareBarGraph />
                    |----<CompareCandidatesWrap />
                                  |
                                  |----|<CandidatesSelect /> |
                                       |<CompareCandidates />|







```











