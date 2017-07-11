import { compose, mapProps, withState, withHandlers, withProps } from 'recompose'
import { gql, graphql } from 'react-apollo'
import DatabaseSearch from './DatabaseSearch'
import withThrottledProp from './withThrottledProp'

const searchQuery = gql`
query Search($keyword: String, $start: String!, $end: String!, $elections: [String]!, $offices: [String]!) {
    search(keyword: $keyword, start: $start, end: $end, elections: $elections, offices: $offices) {
	id
	name
	date
	year
	electionType
	office
	candidates {
	    id
	    name
	}
    }
}`

export default compose(
    withState('searchForm', 'setSearchForm', {
	keyword: '',
	start: '2000/01/01',
	end: '2017/12/31',
	elections: [],
	offices: []
    }),
    withThrottledProp('searchForm', 500),
    withProps( ({searchForm: {keyword, elections, offices}}) => ({
	hasSubmittedSearch: keyword ||
			    elections.length ||
			    offices.length
    })),
    graphql(searchQuery, {
	skip: ({hasSubmittedSearch}) => !hasSubmittedSearch,
	options: ({throttled}) => ({
	    variables: throttled
	}),
	props: ({ownProps, data}) => ({
	    ...ownProps,
	    ...data
	})
    }),
    withHandlers({
	onKeywordChange: ({searchForm, setSearchForm}) => keyword => 
	    setSearchForm(state => ({...state, keyword})),
	onElectionChange: ({setSearchForm}) => elections =>
	    setSearchForm(state => ({...state, elections})),
	onOfficeChange: ({setSearchForm}) => offices =>
	    setSearchForm(state => ({...state, offices})),
	onStartYearChange: ({setSearchForm}) => ([start, end]) => 
	    setSearchForm(state => ({
		...state,
		start: `${start}/01/01`,
		end: `${end}/12/31`
	    })),
	onEndYearChange: ({setSearchForm}) => year =>
	    setSearchForm(state => ({
		...state,
		end: `${year}/12/31`
	    })),
	onKeywordTagClose: ({setSearchForm}) => () =>
	    setSearchForm(state => ({...state, keyword: ''})),
	onElectionTagClose: ({setSearchForm}) => name =>
	    setSearchForm(({elections, ...state}) => ({
		...state,
		elections: elections.filter( e => e !== name)
	    })),
	onOfficeTagClose: ({setSearchForm}) => name =>
	    setSearchForm(({offices, ...state}) => ({
		...state,
		offices: offices.filter( o => o !== name)
	    }))
    }),
    mapProps(({
	searchForm: {start, end, ...form},
	search,
	...props
    }) => ({
	...props,
	...form,
	searchResults: search,
	startYear: parseInt(start.substr(0, 4), 10),
	endYear: parseInt(end.substr(0, 4), 10)
    }))
)(DatabaseSearch)
