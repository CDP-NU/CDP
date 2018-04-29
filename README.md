# Schematic of CDP website
## by Ethan Roubenoff, 14 August 2017

This is a general schematic of the CDP website as it stands 

## Frontend

#### A note on Higher Order Components (HOCs)
This was one of the hardest parts of the website for me to understand, so I'm going to go into very elaborate detail here. HOCs allow for modularity, which is the key funciton of React.  We could just as easily explicitly call a component, but the React ideology is all about modularity, so we do this.

HOCs follow the general formula: `compose(some modifiers)(Base component) = HOC`.  Let's say we have a very simple base component, like such:
   `const BaseComponent = ({prop1, prop2}) => {console.log(prop1, prop2) return null}`
   This component is a function, named BaseComponent, that takes in two props as arguments, prints them to the console, then returns null.  
   In order to correctly execute BaseComponent, we 'compose' it:
   `compose(
        mapProps(({prop1, prop2}) => {return {prop1, prop2}
        })
    )(BaseComponent)`
   What this is effectively doing is taking `prop1` and `prop2` of the parent component and passing them as `prop1` and `prop2` to the BaseComponent.

For a more in depth explaination, let's take `GraphPage.js` as an example, which is called once by `App.js` (see below for how that is called).  The base component here is called ScatterPlotPage, which takes arguments `({raceID, graph, onGraphChange})`, and returns a `<div className="scatter-plot_page" />`.  
   `const ScatterPlotPage = ({raceID, graph, onGraphChange}) => (`
    Note: for simplicity's sake, when we see arguments surrounded by curly braces (`{}`), those arguments are props and not plain old arguments.  Props are a React.js specific concept that is roughly an 'attribute'. 
You can see in the rest of ScatterPlotPage what these arguments do: `raceID` is passed to whatever component is rendered, `graph` is the result given by the dropdown menu (here called `<Select>`), and `onGraphChange` is a callback function.
    Quick note on callback functions: a callback function is a function that is called on an event.  It is defined as a constant or a variable.  In this case, when something changes, `onGraphChange` is called. Think of a callback as just a function with a name.
Right now, you could call ScatterPlotPage with the arguments `{raceID:0, graph:lorenzCurve, onGraphChange:changeToLorenzCurve}`, and when the lorenzCurve option is selected from the dropdown menu, a lorenzCurve would be generated with raceID=0.

However, the next chunk of code: 
    `
    export default compose(
        mapProps(({match: {params}, ...props}) => ({
            ...props,
            ...params,
        })),
        withHandlers({
            onGraphChange: ({raceID, history}) => graph =>
                history.push(`/race/${raceID}/graphs/${graph}`)
        })
    )(ScatterPlotPage)
    `
Is where things get interesting.  There are two things going on here: we're mapping props from the parent component with `mapProps` and defining function handlers `withHandlers`-- a fancy word for callback functions.  Let's break them down.
- `mapProps(...)` takes arguments `({match: {params}, ...props})` and returns `({...props, ...prarams})`.  Think of `...` as just meaning 'all of them'-- so return every prop and every param.  When App.js calls ScatterPlotPage, this function takes App's `match` prop, finds all of match's `param` props, and all the rest of the props inApp, and passes them with the same name to ScatterPlotPage.
-  `withHandlers(onGraphChange: (...))` defines the onGraphChange callback we discussed above.  It takes the `raceID` and `history` props and the `graph` value and pushes a new URL with those variables.
These are then bound to ScatterPlotPage, and the 'enhanced' version of ScatterPlotPage is what is exported as default. 

### index.html
The website "begins" at public/index.html, which effectively does nothing.  The <head></head> tag contains metadata about the website.
Inside the `<body></body>` tag, there is a `<div id="root" />` tag, which is used for react DOM bindings.

cd src (change working directory to i~/frontend-graphql/src/)

### src/index.js
index.js is used to initialize the website.  There are two things going on here: initializing the client/redux store and rendering the app.
The first block initializes the ApolloClient, used for graphql, and the redux store used for managing global state.
···`const client` is the ApolloClient
···`const combined` is the combined reducers (reducers are part of redux)
···`export const store` is the redux store. The arguments are, in order: combined reducers, initial state (which is unused), middleware (which is only the devtools browser extension)

A note on redux: redux is a tool used to manage the global state of the application-- that is, a description of what is going on throughout the entire website.  Apollo/graphql has almost entirely supplanted the need for redux, however it is used to manage the display state of the wesbite.  Using redux, what is currently displayed on the page is stored as data so components can easily communicate with each other.  

GraphQL will be explained later, probably in the backend.

The second block, beginning with `ReactDOM.render(` does just that: renders the app.  React is a library used for fancy html stuff and the DOM (Document Object Model) allows javascript to access parts of the website like it would any other code object.  ReactDOM renders four things, three container components (you don't see them) and one presentational component (you see them).  These are nested.

  `<BrowserRouter basename="/database">` is a basis for the paths (URLs) used in the website
  `<ApolloProvider store={store} client={client}>` initializes graphql and the redux store
  `<LocaleProvider locale={enUS}>` makes sure the app is funcitoning in local conventions (date, time, etc)
  `<App />` is the actual app itself.

These are "appended" to `document.getElementByID('root')`, which finds the element `<div id="root">` we defined in index.html and appends those things to it.

#### other things in /src/:
- actions.js : actions for redux
- index.css : stylesheet for the main app.  Nothing important is in here
- map.js : the base leaflet map
- reducers.js : reducers for redux (the core of redux)
- utility.js : other useful things for the website.  To be phased out.

cd components (working directory: ~/frontend-graphql/src/components)

### Components is where the real meat of the frontend happens

### App.js
App.js is the first thing rendered (in index.js, it just calls it up.)  When called, App immediately calls its render method, which returns two divs (for simplicity's sake, sub-elemnts are listed as sublists, not nested div tags: 
-  `<div className="sidebar">` : the sidebar container
    `<div className="sidebar_header">` : the sidebar header, with the home button, and "Browse Database" text
    `<DatabaseSearchContainer />` : the component used to search the database.  See below for further explaination.
-  `<div className="main-conentent">`
    `<Route path="/race/:raceID/:display component = {TopBar}>"` : the topbar.  The Route element means 'if we reach this path, render the top bar.'  We will always reach this path (there is no conditional part yet)
    `<Switch>` : think of this as an if statement.  If any of the following routes are true, render the following component:
      This part is fairly self explainatory: if the route is x, render component y.
Note: in `<Route>` components, any part of the `path` beginning with `:` is a variable and passed to the rendered ('child') component.  For example, if `path= "/race/raceA/compare/raceB"`, the ComparePage component will be rendered, and raceID and raceID2 will be passed to ComparePage with values raceA and raceB, respectively.

So far, our component tree is:
`                        
                            Index.js
                            App.js
                           /       \
                    sidebar         main-content
     DatabaseSearchContainer        Switch
                                /      |       \
                    MapPageContainer GraphPage  ComparePage
`
We `export default App`, which is picked up by Index.js.

### MapPageContainer
Mostly a container for the map page, as the name suggests.  Runs graphql queries to get the candidates for a race (`raceCandidatesQuery`) and a geocode (`geocodeQuery`).  Binds the following to MapPage:
- props: RaceID (from match.params), raceYear, raceGeoYear, url, and history
- graphql raceCandidatesQuery
- withState geocoderequest
- graphql geocodeQuery 
- withHandlers onGeocode

What this does: takes the props from the App component, queries the database for candidates, sets the react state to the given geocode, queries the database for that geocode, and defines a callback for handling a geocode.  These are then passed to MapPage.

### MapPage
Takes in a whole bunch of props, that are all passed to it by MapPageContainer.  Based on what the current URL is-- either broken down by ward or precinct, or either of those for a specific candidate, it renders a RaceMap, as defined in RaceMap.js.

### RaceMap
Queries the database for a map and geojson, maps some props to relevant props, keeps the prop listening for changes to the geojson, then maps the colors in the database to the raceMap.  All of this is passed to HeatMap.

### HeatMap
HeatMap is the actual color we see on the map.  

### Map
A wrapper for leaflet.

Wow, that was a lot.  Here's our component tree now:
`                        
                            Index.js
                            App.js
                           /       \
                    sidebar         main-content
     DatabaseSearchContainer        Switch
                                /           |       \
                    MapPageContainer    GraphPage  ComparePage
                            |
                        <Map>
                        MapPage
                        RaceMap
                        HeatMap
                        </Map>
`
### GraphPage
GraphPage, confusingly enough, actually renders a component called ScatterPlotPage.  The mechanics of GraphPage were described above in the part about HOC, so I won't go into too much detail there.  GraphPage is more or less a container that, given the URL of the page, either renders a BarGraph, ScatterPlot, or Breakown.  All three of these more or less follow the same pattern.
Thing to note: in clauses with `<Route path=/race/:raceID/graphs/candidatesrender{() => BarGraph race={raceID}}`, a couple of things to note: any part of the path beginning with `:` can be accessed as a prop in either of two ways.
- Like it is in the above example: Bargraph is rendered with race value raceID.
- In BarGraph, the parent prop `match.raceID` could be mapped to the child component's prop `raceID`.  

### BarGraph, ScatterPlot, and Breakdown
I'm going to use BarGraph for the example here since it's the most straightforward, but they all follow the same logic.

These components are called with a specific raceID, which is passed to the component's raceID prop.  So for each of these components, there is a raceID prop with the value of the current race displayed. These components, oddly enough, work from the bottom of the document up.  Let's start at `compose(`:
- First, runs a graphQL query on the raceID prop that was passed to it.  Returns whatever data is needed for the specific component.  GraphQL, unless told to do otherwise, will put all returned data in a prop called `data`.  How convenient!  
- Next, flatten that `data` prop.  This turnes a nested array into a flat array.  
- Branch: basically if the component is loading or there's a problem, don't render the component until it's resolved. 
- mapProps: take the race.candidates prop passed in from data and just call it candidates.
These are used to enhance the `BarGraph` component, which is largely a container component.

Here's the BarGraph component broken down: 
- `componentDidMount`: if it successfully did mount with no issues, call the loadD3 function with the `candidates` prop as an argument.
- `componentWillRecieveProps`: if the component's `candidates` prop changes, loadD3 with this updated prop.  I don't think this is called very often.
- `componentShouldUpdate`: no, it shouldn't.  The data isn't dynamic.
- `render()` if all goes well, the component renders a `<div id="bargraph />`.  
Now, these aren't necessarily called in this order.  GraphPage explicitly calls BarGraph's `render` method, so the first thing it does is render the div, then calls loadD3.  Reminder that BarGraph has at this point already been enhanced by the `compose` function. 

Now, `loadD3` basically takes in whatever data you pass it, and renders the graph accordingly.  It's would take too long to explain the d3 functionality here, so I'm giong to just markup the files itself explaining what's going on.

One key line from each `loadD3` function is: `const bargraph = d3.select("#bargraph")`-- this allows d3 to append the graph to the `<div id="bargraph" />` already rendered.`

### ComparePage
