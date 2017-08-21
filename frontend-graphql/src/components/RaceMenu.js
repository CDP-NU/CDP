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

export const RaceCard = ({
    id,
    name,
    date,
    year,
    office,
    electionType,
    candidates,
    onSelect
}) => (
    <Card title={<Link to={`/race/${id}/maps/ward`} onClick={onSelect}>{`${office} - ${year}`}</Link>}
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

const RaceMenu = ({races = [], onSearchResultClick}) => (
    <div>
	{races.map(
	     race => <RaceCard {...race}  key={race.id}
					  onSelect={onSearchResultClick}/>
	 )}
    </div>
)

export default withRouter(RaceMenu)
