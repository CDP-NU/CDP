import React from 'react'
import { Card, Tag, Collapse, Slider, Switch} from 'antd'
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
	     onClose={() => onClose(name)}>{name}</Tag >
    )
)

export const selectMin = (path) => { 
    const raceYear = (parseInt(path.substr(6,9),10))
    if (raceYear) {
        if (raceYear > 2014) {return 2015}
        else {return 2004}
    }
    else {return 2004}
}
export const selectMax = (path) => { 
    const raceYear = (parseInt(path.substr(6,9),10) )
    if (raceYear) {
        if (raceYear > 2014) {return 2018}
        else {return 2014}
    }
    else {return 2018}
}

export const DatabaseSearch = ({
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
    onSearchResultClick,
    onCompareChange,
    compare,
    match,
    location,
}) => (
    <div className="database-search">
	<div className="search-filters">
	    <Autocomplete onSearch={onKeywordChange}/>
            <div style={{position: 'inline-block'}}>
                <Switch style={{position: 'inline-block', width: '100%', zIndex: '1'}} onChange={onCompareChange} 
                        unCheckedChildren="Display One Race" checkedChildren="Compare Two Races"/>
                <Collapse style={{position: 'inline-block', width: '100%'}}>
                    <Panel header="Search Tools"
                           key="1">
                        <h4>Year Range</h4>
                        <p>{`${startYear} - ${endYear}`}</p>
                        { (compare == true) ?  
                                    <Slider range
                                    min={selectMin(location.pathname)}
                                    max={selectMax(location.pathname)}
                                    value={[startYear, endYear]}
                                    onChange={onYearRangeChange}/>                         
                            :
                            <Slider range
                                    min={2004}
                                    max={2018}
                                    value={[startYear, endYear]}
                                    onChange={onYearRangeChange}/>
                        }   
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
            </div>
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
                          compare={compare}
			  onResultClick={onSearchResultClick}/>
    </div>
)

