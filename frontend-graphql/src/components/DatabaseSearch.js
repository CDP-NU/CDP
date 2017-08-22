import React from 'react'
import { Card, Tag, Collapse, Slider } from 'antd'
import Autocomplete from './Autocomplete'
import SearchResultMenu from './SearchResultMenu'

const {Panel} = Collapse
const {CheckableTag} = Tag


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

const demographyTags = [
    'Race',
    'Education',
    'Housing',
    'Percent in Poverty',
    'Total Population'
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
    demographies = [], 
    hasSubmittedSearch,
    searchResults,
    onKeywordChange,
    onYearRangeChange,
    onElectionChange,
    onOfficeChange,
    onDemographyChange,
    onKeywordTagClose,
    onElectionTagClose,
    onOfficeTagClose,
    onDemographyTagClose,
    onSearchResultClick
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
			    onChange={onYearRangeChange}/>
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
		    <Card title="Demography Category"
			  bordered={false}>
			<TagGroup tags={demographyTags}
				  selected={demographies}
				  onSelectionChange={onDemographyChange}/>
		    </Card>
		</Panel>
	    </Collapse>
	    {hasSubmittedSearch ?
	     <div className="search-tags">
		 {keyword !== '' ?
		  <Tag closable onClose={onKeywordTagClose}>{keyword}</Tag> :
		  null}
		  {createRemovableTags(elections, onElectionTagClose)}
		  {createRemovableTags(offices, onOfficeTagClose)}
		  {createRemovableTags(demographies, onDemographyTagClose)}
	     </div>
	     : null}
	</div>
	<SearchResultMenu results={searchResults}
			  onResultClick={onSearchResultClick}/>
    </div>
)

export default DatabaseSearch
