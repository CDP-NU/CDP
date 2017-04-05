import React from 'react'
import { Card, Tag, DatePicker, Collapse } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import R from 'ramda'
const RangePicker = DatePicker.RangePicker
const Panel = Collapse.Panel
const CheckableTag = Tag.CheckableTag
import Autocomplete from './Autocomplete'
import RaceMenu from './RaceMenu'
import moment from 'moment'
import { withState, withHandlers, flattenProp } from 'recompose'
import withMutation from './Mutation'
import { searchDatabase } from '../creators'
import { eqByProp, merge } from '../utility'

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
			       checked={R.contains(tag, selected)}
			       onChange={checked =>
				   onSelectionChange(
				       checked ?
				       [...selected, tag] :
				       R.reject(R.equals(tag), selected)
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
    dateRange,
    elections,
    offices,
    onKeywordChange,
    onDateChange,
    onElectionChange,
    onOfficeChange,
    onKeywordTagClose,
    onElectionTagClose,
    onOfficeTagClose
}) => (
    <div className="database-search">
	<div className="search-filters">
	    <Autocomplete onKeywordSubmit={onKeywordChange}/>
	    <Collapse style={{width: '100%'}}>
		<Panel header="Search Tools" key="1">
		    <RangePicker style={{marginBottom: '10px'}}
				 format="YYYY/MM/DD"
				 value={dateRange}
				 onChange={onDateChange}/>
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

	    {keyword || elections.length || offices.length ?
	     <div className="search-tags">
		 {keyword !== '' ?
		  <Tag closable onClose={onKeywordTagClose}>{keyword}</Tag> :
		  null}
		  {createRemovableTags(elections, onElectionTagClose)}
		  {createRemovableTags(offices, onOfficeTagClose)}
	     </div>
	     : null}
	</div>
	<RaceMenu/>
    </div>
)

export default compose(
    connect(
	null,
	{onChange: searchDatabase}
    ),
    withState(
	'searchForm',
	'submit',
	{
	    keyword: '',
	    dateRange: [moment('2000/01/01', 'YYYY/MM/DD'), moment()],
	    elections: [],
	    offices: []
	}
    ),
    withMutation({
	skipFirst: true,
	skip: eqByProp('searchForm'),
	run: ({searchForm, onChange}) => onChange(searchForm)
    }),
    withHandlers({
	onKeywordChange: ({submit}) => keyword =>
	    submit(merge({keyword})),
	onDateChange: ({submit}) => dateRange =>
	    submit(merge({dateRange})),
	onElectionChange: ({submit}) => elections =>
	    submit(merge({elections})),
	onOfficeChange: ({submit}) => offices =>
	    submit(merge({offices})),
	onKeywordTagClose: ({submit}) => () =>
	    submit(merge({keyword: ''})),
	onElectionTagClose: ({submit}) => name =>
	    submit(R.evolve({
		elections: R.reject(R.equals(name))
	    })),   
	onOfficeTagClose: ({submit}) => name =>
	    submit(R.evolve({
		offices: R.reject(R.equals(name))
	    }))	 
    }),
    flattenProp('searchForm')
)(DatabaseSearch)
