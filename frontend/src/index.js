import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import './index.css';
import App from './components/App'
import store from './storeConfiguration'

/*
import { compose, mapProps, withState, branch, renderComponent, withHandlers } from 'recompose'
import withQuery from './components/Query'
import withSubscription from './components/Subscription'
import { REQUEST_SEARCH_RESULTS } from './actions'

const Child = props => {
    console.log('child', props)
    return (
	<div>
	    <h3>Child: {props.keyword}</h3>
	    {props.loading && props.timeOfLastRequest ? ( <h3> LOADING LOADING... </h3> ) : null
		}
	</div>
    )
}

const Error = () => (
    <h3>WARNING WARING ERROR</h3>
)

const WrappedChild = compose(
    withQuery(
	REQUEST_SEARCH_RESULTS,
	['searchForm'],
	{skipFirst: true, associatedQuery: 'autocomplete'}
    ),
    withSubscription(
	{
	    autocompletions: 'keyword',
	    searchResults: 'timeOfLastRequest'
	},
	props => {
	    console.log('loaded', props)
	    return {lol: Date.now()}
	}
    ),
    branch(
	({error}) => error,
	renderComponent(Error)
    )
)(Child)

const Parent = props => {
   // console.log('parent', props)
    return (
	<div>
	    <h3>This is the parent</h3>
	    <WrappedChild race="2016-03-15+5010"
			  candidate="2016-03-15+5010+1"
			  searchForm={props.searchForm}
			  keyword={props.searchForm.keyword}/>
	    <input type="text" value={props.searchForm.keyword} onChange={props.onChange}/>
	</div>
    )
}

const WrappedParent = compose(
    withState('searchForm', 'setSearchForm', {
	keyword: "Obama",
	startDate: "2005/01/01",
	endDate: "2010/01/01",
	elections: [],
	offices: ["President"]
    }),
    withHandlers({
	onChange: ({setSearchForm, searchForm}) => e =>
	    setSearchForm({...searchForm, keyword: e.target.value})
    })
)(Parent)
*/


ReactDOM.render(
    <Provider store={store}>
	<LocaleProvider locale={enUS}>
	    <BrowserRouter basename="/database">
		<App/>
	    </BrowserRouter>
	</LocaleProvider>
    </Provider>,
  document.getElementById('root')
)
