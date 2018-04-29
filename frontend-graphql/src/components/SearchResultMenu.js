import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Card, Menu, Icon} from 'antd'
const SubMenu = Menu.SubMenu

const CandidateMenuTitle = () => (
    <span>
	<Icon type="user" />
	<span>Candidate Maps</span>
    </span>
)

//For later: build in the link level compare functionality for the candidate menu
const CandidateMenu = ({raceID, candidates, onSelect}) => (
    <Menu style={{width: '100%', display: 'block'}}
	  mode="inline" selectedKeys={[]}>
	<SubMenu key="sub1" title={<CandidateMenuTitle/>}>
	    {candidates.map(
		 ({name}, idx) => (
		     <Menu.Item key={idx}>
			 <Link to={`/race/${raceID}/maps/candidate/${idx + 1}/ward`}
			       onClick={onSelect}>{name}</Link>
		     </Menu.Item>
		 )
	     )}
	</SubMenu>
    </Menu>
)

const CompareLink = (id, race1, compare) => ((compare === true ) && (race1 !== undefined)) ? `/race/${race1}/compare/${id}/compare_bargraph` : `/race/${id}/maps/ward`

export const RaceCard = ({
    id,
    name,
    date,
    year,
    office,
    electionType,
    candidates,
    onSelect,
    compare,
    race1 
}) => (
    <Card title={<Link to={CompareLink(id, race1, compare)} onClick={onSelect}>{`${office} - ${year}`}</Link>}
	  bodyStyle={{ padding: 0 }}>
	<div style={{padding: '10px 16px'}}>
	    <p>{date}</p>
	    <p>{electionType}</p>
	    <p>{name}</p>
	</div>
	<CandidateMenu raceID={id}
		       candidates={candidates}
		       onSelect={onSelect}/>
    </Card>
)

const DemographyCard = ({
    measure,
    category,
    onSelect,
    compare
}) => (
    <Card title={<Link to={`/demography/${measure}`} onClick={onSelect}>{`${measure}`}</Link>}
	  bodyStyle={{ padding: 0 }}>
	<div style={{padding: '10px 16px'}}>
	    <p>{category}</p>
	</div>
    </Card>
)

const cards = {
    RACE: (race, onSelect, compare) => (
	<RaceCard {...race}  key={race.id} compare={compare} race1={window.location.pathname.split("/")[3]} 			     
        onSelect={onSelect}/>

    ),
    DEMOGRAPHY: (demography, onSelect, compare) => (
	<DemographyCard {...demography} key={demography.measure} compare={compare}
					onSelect={onSelect}/>
    )
}

const SearchResultMenu = ({results = [], onResultClick, compare}) => (
    <div>
	{results.map(
	     ({label, description}) => cards[label](description, onResultClick, compare)
	 )}
    </div>
)

export default withRouter(SearchResultMenu)
