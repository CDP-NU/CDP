import React from 'react'
import { compose, mapProps, withState, withHandlers, flattenProp, withProps, branch, defaultProps } from 'recompose'
import { Card, Tag, Collapse, Slider } from 'antd'
import Autocomplete from './Autocomplete'
import RaceMenu from './RaceMenu'
import withQuery from './Query'
import withSubscription from './Subscription'
import { REQUEST_SEARCH_RESULTS } from '../actions'
import { tap, mergeProps  } from '../utility'

const Panel = Collapse.Panel
const CheckableTag = Tag.CheckableTag


const electionTags = [
    'Democratic Primary',
    'Republican Primary',
    'General',
    'Municipal General',
    'Municipal Runoffs',
    'Special',
    'Special Primary',
    'Other Primary'
]

const officeTags = [
    'President',
    'U.S. Senate',
    'U.S. House of Representatives',
    'Governor',
    'State Senate',
    'State General Assembly',
    'Judicial',
    'Mayor',
    'Aldermanic',
    'Ward Committee',
    'Registered Voters',
    'Ballot Measure',
    'Total Ballots Cast',
    'Other'
]


const TagGroup = ({tags = [], selected = [], onSelectionChange}) => (
    <div>
	{tags.map(
	     tag => (
		 <CheckableTag key={tag}
			       checked={selected.includes(tag)}
			       onChange={checked =>
				   onSelectionChange(
				       checked ?
				       [...selected, tag] :
				       selected.filter( t => t !== tag )
				   )}>
		     {tag}
		 </CheckableTag>
	     )
	 )}
    </div>
)

const createRemovableTags = (tags, onClose) => tags.map(
    name => (
	<Tag key={name}
	     className="search-tag"
	     closable
	     onClose={() => onClose(name)}>{name}</Tag>
    )
)

const DatabaseSearch = ({
    keyword,
    elections,
    offices,
    startYear,
    endYear,
    showSearchResults,
    searchResults,
    onKeywordChange,
    onElectionChange,
    onOfficeChange,
    onStartYearChange,
    onEndYearChange,
    onKeywordTagClose,
    onElectionTagClose,
    onOfficeTagClose
}) => (
    <div className="database-search">
	<div className="search-filters">
	    <Autocomplete onSearch={onKeywordChange}/>
	    <Collapse style={{width: '100%'}}>
		<Panel header="Search Tools"
		       key="1">
		    <h4>Year Range</h4>
		    <p>{`${startYear} - ${endYear}`}</p>
		    <Slider range
			    min={2000}
			    max={2017}
			    value={[startYear, endYear]}
			    onChange={onStartYearChange}/>
		    <Card  title="Election Type"
			   bordered={false}>
			<TagGroup tags={electionTags}
				  selected={elections}
				  onSelectionChange={onElectionChange}/>
		    </Card>
		    <Card title="Office"
			  bordered={false}>
			<TagGroup tags={officeTags}
				  selected={offices}
				  onSelectionChange={onOfficeChange}/>
		    </Card>
		</Panel>
	    </Collapse>

	    {showSearchResults ?
	     <div className="search-tags">
		 {keyword !== '' ?
		  <Tag closable onClose={onKeywordTagClose}>{keyword}</Tag> :
		  null}
		  {createRemovableTags(elections, onElectionTagClose)}
		  {createRemovableTags(offices, onOfficeTagClose)}
	     </div>
	     : null}
	</div>
	<RaceMenu races={searchResults}/>
    </div>
)

export default compose(
    withState('searchForm', 'setSearchForm', {
	keyword: '',
	startDate: "2000/01/01",
	endDate: "2017/12/31",
	elections: [],
	offices: []
    }),
    withProps( ({searchForm: {keyword, elections, offices}}) => ({
	showSearchResults: keyword ||
			   elections.length > 0 ||
			   offices.length > 0
    })),
    branch(
	({showSearchResults}) => showSearchResults,
	compose(
	    withQuery(REQUEST_SEARCH_RESULTS, ['searchForm']),
	    defaultProps({current: 'current'}),
	    withSubscription({searchResults: 'current'})
	)
    ),
    withHandlers({
	onKeywordChange: ({searchForm, setSearchForm}) => keyword => 
	    setSearchForm(mergeProps({keyword})),
	onElectionChange: ({setSearchForm}) => elections =>
	    setSearchForm(mergeProps({elections})),
	onOfficeChange: ({setSearchForm}) => offices =>
	    setSearchForm(mergeProps({offices})),
	onStartYearChange: ({setSearchForm}) => ([start, end]) => 
	    setSearchForm(mergeProps({
		startDate: `${start}/01/01`,
		endDate: `${end}/12/31`
	    })),
	onEndYearChange: ({setSearchForm}) => year =>
	    setSearchForm(mergeProps({endDate: `${year}/12/31`})),
	onKeywordTagClose: ({setSearchForm}) => () =>
	    setSearchForm(mergeProps({keyword: ''})),
	onElectionTagClose: ({setSearchForm}) => name =>
	    setSearchForm(({elections, ...form}) => ({
		...form,
		elections: elections.filter( e => e !== name)
	    })),
	onOfficeTagClose: ({setSearchForm}) => name =>
	    setSearchForm(({offices, ...form}) => ({
		...form,
		offices: offices.filter( o => o !== name)
	    }))
    }),
    flattenProp('searchForm'),
    mapProps(({startDate, endDate, ...props}) => ({
	...props,
	startYear: parseInt(startDate.substr(0, 4), 10),
	endYear: parseInt(endDate.substr(0, 4), 10)
    }))
)(DatabaseSearch)
