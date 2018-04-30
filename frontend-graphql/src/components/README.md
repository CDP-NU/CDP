# Components
Components is where the real meat of the frontend happens.  I will walk through it all.

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
```                 
                            Index.js
                            App.js
                           /       \
                    sidebar         main-content
     DatabaseSearchContainer        Switch
                                /      |       \
                    MapPageContainer GraphPage  ComparePage
```
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

