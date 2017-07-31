import { compose, mapProps, withStateHandlers, withProps, withHandlers } from 'recompose'
import { gql, graphql } from 'react-apollo'
import DatabaseSearch from './DatabaseSearch'
import withThrottledProps from './withThrottledProps'

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
    withStateHandlers(
	{
	    keyword: '',
	    startDate: '2000/01/01',
	    endDate: '2017/12/31',
	    elections: [],
	    offices: []
	},
	{
	    onKeywordChange: () => keyword => ({keyword}),
	    onElectionChange: () => elections => ({elections}),
	    onOfficeChange: () => offices => ({offices}),
	    onYearRangeChange: () => ([start, end]) => ({
		startDate: `${start}/01/01`,
		endDate: `${end}/12/31`
	    }),
	    onKeywordTagClose: () => () => ({keyword: ''}),
	    onElectionTagClose: ({elections}) => name => ({
		    elections: elections.filter( e => e !== name)
	    }),
	    onOfficeTagClose: ({offices}) => name => ({
		    offices: offices.filter( o => o !== name)
	    }),
	    resetSearch: () => () => ({
		keyword: '',
		elections: [],
		office: []
	    })
	}
    ),
    withProps( ({keyword, elections, offices}) => ({
	hasSubmittedSearch: keyword ||
			    elections.length ||
			    offices.length
    })),
    withThrottledProps(500, props => ({
	throttledKeyword: props.keyword,
	throttledStartDate: props.startDate,
	throttledEndDate: props.endDate,
	throttledElections: props.elections,
	throttledOffices: props.offices
    })),
    graphql(searchQuery, {
	skip: ({hasSubmittedSearch}) => !hasSubmittedSearch,
	options: (props) => ({
	    variables: {
		keyword: props.throttledKeyword,
		start: props.throttledStartDate,
		end: props.throttledEndDate,
		elections: props.elections,
		offices: props.throttledOffices
	    }
	}),
	props: ({ownProps, data: {search}}) => ({
	    ...ownProps,
	    searchResults: search
	})
    }),
    mapProps(({
	startDate,
	endDate,
	...props
    }) => ({
	...props,
	startYear: parseInt(startDate.substr(0, 4), 10),
	endYear: parseInt(endDate.substr(0, 4), 10)
    })),
    withHandlers({
	onSearchResultClick: ({resetSearch}) => () => {
	    
	    const isMobile = window
		.matchMedia("(max-width: 800px)")
		.matches

	    if(isMobile) {
		resetSearch()
	    }
	}
    })
)(DatabaseSearch)
