import { compose, mapProps, withStateHandlers, withProps, withHandlers } from 'recompose'
import { gql, graphql } from 'react-apollo'
import {DatabaseSearch, selectMin, selectMax }from './DatabaseSearch'
import withThrottledProps from './withThrottledProps'
import { withRouter } from 'react-router-dom'

/*
<DatabaseSearchContainer /> is just a wrapper for the sidebar <DatabaseSearch />.  I will walk through what each element in the compose function does.

withRouter: takes the history/URL component (necessary for compare)
withStateHandlers: changes to each filter (year, keyword, etc) are done through this.state not this.props since the sidebar doesn't need to re-render
	for each change.  The first clause is the base state and the second is a list of various state handlers (onChange functions).  When something 
	changes, for example the year range, it triggers an "onYearRangeChange" function which updates the state.
		stateDate, endDate, and onCompareChange are dependent on the compare value to prevent comparing incomparable deographies. selectMin and selectMax
		are there to prevent this.
withProps: maps a prop specifically for HasSubmittedSearch
withThrottledProps: prevents timeouts
graphQL: runs the actual query (searchQuery)
*/

const searchQuery = gql`
query Search($keyword: String, $start: String!, $end: String!, $elections: [String]!, $offices: [String]!, $demographies: [String]!) {
    search(keyword: $keyword, start: $start, end: $end, elections: $elections, offices: $offices, demographies: $demographies) {
        label
        description
    }
}`

export default compose(
    withRouter,
    withStateHandlers(
        ({location}) => ({
	    keyword: '',
	    startDate: `${selectMin(location.pathname)}/01/01`,
	    endDate: `${selectMax(location.pathname)}/12/31`,
	    elections: [],
	    offices: [],
	    demographies: [],
	    location,
        compare: "false"
	}),
	{
	    onKeywordChange: () => keyword => ({keyword}),
	    onYearRangeChange: () => ([start, end]) => ({
			startDate: `${start}/01/01`,
			endDate: `${end}/12/31`,
	    }),
	    onElectionChange: () => elections => ({elections}),
	    onOfficeChange: () => offices => ({offices}),
	    onDemographyChange: () => demographies => ({demographies}),
	    onKeywordTagClose: () => () => ({keyword: ''}),
	    onElectionTagClose: ({elections}) => name => ({
			elections: elections.filter( e => e !== name )
	    }),
	    onOfficeTagClose: ({offices}) => name => ({
			offices: offices.filter( o => o !== name )
	    }),
	    onDemographyTagClose: ({demographies}) => name => ({
			demographies: demographies.filter( d=> d !== name )
	    }),
        onCompareChange: ({compare, location}) => e => ({
        	startDate: (toString(e.target.value) === "true") ?  (`${selectMin(location.pathname)}/01/01`) : ( `2004/01/01` ),
        	endDate: (toString(e.target.value) === "true") ? (`${selectMax(location.pathname)}/12/31`) : ( `2018/12/31` ),
            compare: e.target.value
        }),
	    resetSearch: ({location}) => () => ({
			keyword: '',
		    startDate: `${selectMin(location.pathname)}/01/01`,
		    endDate: `${selectMax(location.pathname)}/12/31`,
		    elections: [],
		    offices: [],
		    demographies: [],
	        compare: "false"
	    })
	}),
    withProps( ({keyword, elections, offices, demographies, compare}) => ({
	hasSubmittedSearch: keyword ||
			    elections.length ||
			    offices.length ||
			    demographies.length ||
                            compare
    })),
    withThrottledProps(500, props => ({
		throttledKeyword: props.keyword,
		throttledStartDate: props.startDate,
		throttledEndDate: props.endDate,
		throttledElections: props.elections,
		throttledOffices: props.offices,
		throttledDemographies: props.demographies
    })),
    graphql(searchQuery, {
		skip: ({hasSubmittedSearch}) => !hasSubmittedSearch,
		options: (props) => ({
		    variables: {
			keyword: props.throttledKeyword,
			start: props.throttledStartDate,
			end: props.throttledEndDate,
			elections: props.elections,
			offices: props.throttledOffices,
			demographies: props.throttledDemographies
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
		startYear: parseInt(startDate.substr(0,4),10),
		endYear: parseInt(endDate.substr(0, 4), 10)
    })),
    withHandlers({
	onSearchResultClick: ({resetSearch}) => () => {
	    
	    const isMobile = window
		.matchMedia("(max-width: 800px)")
		.matches

	    if(isMobile) {
		resetSearch()
	    }},
    onClear: ({history, resetSearch}) => () => {
	    history.push(`/`)
	    resetSearch()
    }
    })
)(DatabaseSearch)
