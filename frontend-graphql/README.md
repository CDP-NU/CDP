# Use antd in create-react-app

## Step by Step Documentation

- English: https://ant.design/docs/react/use-with-create-react-app
- 中文：https://ant.design/docs/react/use-with-create-react-app-cn

#### A note on Higher Order Components (HOCs)
This was one of the hardest parts of the website for me to understand, so I'm going to go into very elaborate detail here. HOCs allow for modularity, which is the key funciton of React.  We could just as easily explicitly call a component, but the React ideology is all about modularity, so we do this.

Our implimentation of HOCs follow the general formula: `compose(some modifiers)(Base component) = HOC`.  Let's say we have a very simple base component, like such:
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

For a more in depth explaination, let's take `GraphPage.js` as an example, which is called once by `App.js` (see below for how that is called).  The base component here is called ScatterPlotPage, which takes arguments `({raceID, graph, onGraphChange})`, and returns a `<div className="scatter-plot_page" />`.  
This is accomplished by:  `const ScatterPlotPage = ({raceID, graph, onGraphChange}) => (`
Note that for simplicity's sake, when we see arguments surrounded by curly braces (`{}`), those arguments are props and not plain old arguments.  Props are a React.js specific concept that is roughly an 'attribute'. 
You can see in the rest of ScatterPlotPage what these arguments do: `raceID` is passed to whatever component is rendered, `graph` is the result given by the dropdown menu (here called `<Select>`), and `onGraphChange` is a callback function.
    Quick note on callback functions: a callback function is a function that is called on an event.  It is defined as a constant or a variable.  In this case, when something changes, `onGraphChange` is called. Think of a callback as just a function with a name.
Right now, you could call ScatterPlotPage with the arguments `{raceID:0, graph:lorenzCurve, onGraphChange:changeToLorenzCurve}`, and when the lorenzCurve option is selected from the dropdown menu, a lorenzCurve would be generated with raceID=0.

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
)(ScatterPlotPage)
```
Is where things get interesting.  There are two things going on here: we're mapping props from the parent component with `mapProps` and defining function handlers `withHandlers`-- a fancy word for callback functions.  Let's break them down.
- `mapProps(...)` takes arguments `({match: {params}, ...props})` and returns `({...props, ...params})`.  Think of `...` as just meaning 'all of them'-- so return every prop and every param.  When App.js calls ScatterPlotPage, this function takes App's `match` prop, finds all of match's `param` props, and all the rest of the props in App, and passes them with the same name to ScatterPlotPage.
-  `withHandlers(onGraphChange: (...))` defines the onGraphChange callback we discussed above.  It takes the `raceID` and `history` props and the `graph` value and pushes a new URL with those variables.
These are then bound to ScatterPlotPage, and the 'enhanced' version of ScatterPlotPage is what is exported as default. 

### index.html
The website "begins" at public/index.html, which effectively does nothing.  The <head></head> tag contains metadata about the website.
Inside the `<body></body>` tag, there is a `<div id="root" />` tag, which is used for react DOM bindings.


### src/index.js

index.js is used to initialize the website.  There are two things going on here: initializing the apollo client and rendering the app.
The first block initializes the ApolloClient, used for graphql.  GraphQL will be explained later, probably in the backend.

```javascript
const client = new ApolloClient()
```


The second block, beginning with `ReactDOM.render(` does just that: renders the app.  React is a library used for fancy html stuff and the DOM (Document Object Model) allows javascript to access parts of the website like it would any other code object.  ReactDOM renders four things, three container components (you don't see them) and one presentational component (you see them).  These are nested.

```javascript
ReactDOM.render(
    <BrowserRouter basename="/database">
	<ApolloProvider client={client}>
	    <LocaleProvider locale={enUS}>
		<App/>
	    </LocaleProvider>
	</ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
)
```

  `<BrowserRouter basename="/database">` is a basis for the paths (URLs) used in the website
  `<ApolloProvider store={store} client={client}>` initializes graphql and the redux store
  `<LocaleProvider locale={enUS}>` makes sure the app is funcitoning in local conventions (date, time, etc)
  `<App />` is the actual app itself (imported from `./components/App.js`).

These are "appended" to `document.getElementByID('root')`, which finds the element `<div id="root">` we defined in index.html and appends those things to it.

#### other things in /src/:
- index.css : stylesheet for the main app.  Nothing important is in here
- map.js : the base leaflet map (this will be phased out-- this is why the first map displayed on the site looks different than the others)
- utility.js : other useful things for the website.  To be phased out.


## What more

- [antd](http://github.com/ant-design/ant-design/)
- [babel-plugin-import](http://github.com/ant-design/babel-plugin-import/)
- [less-loader](https://github.com/webpack/less-loader)
