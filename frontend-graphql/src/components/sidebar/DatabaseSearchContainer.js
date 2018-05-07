import { compose, mapProps, withStateHandlers, withProps, withHandlers } from 'recompose'
import { gql, graphql } from 'react-apollo'
import {DatabaseSearch, selectMin, selectMax }from './DatabaseSearch'
import withThrottledProps from './withThrottledProps'
import { withRouter } from 'react-router-dom'

const searchQuery = gql`
query Search($keyword: String, $start: String!, $end: String!, $elections: [String]!, $offices: [String]!, $demographies: [String]!) {
    search(keyword: $keyword, start: $start, end: $end, elections: $elections, offices: $offices, demographies: $demographies) {
        label
        description
    }
}`

	    //startDate: '2000/01/01',
	    //endDate: '2017/12/31',
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
        compare: false
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
        onCompareChange: ({compare, location}) => value => ({

        	startDate: (value === true) ?  (`${selectMin(location.pathname)}/01/01`) : ( `2004/01/01` ),
        	endDate: (value === true) ? (`${selectMax(location.pathname)}/12/31`) : ( `2018/12/31` ),
            compare: value
        }),
	    resetSearch: () => () => ({
		keyword: '',
		elections: [],
		office: []
	    })
	}
    ),
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
	    }
	}
    })
)(DatabaseSearch)
