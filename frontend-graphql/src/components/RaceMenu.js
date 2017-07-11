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

const CandidateMenu = ({raceID, candidates}) => (
    <Menu style={{width: '100%', display: 'block'}}
	  mode="inline" selectedKeys={[]}>
	<SubMenu key="sub1" title={<CandidateMenuTitle/>}>
	    {candidates.map(
		 ({name}, idx) => (
		     <Menu.Item key={idx}>
			 <Link to={`/race/${raceID}/maps/candidate/${idx + 1}/ward`}>{name}</Link>
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
    candidates
}) => (
    <Card title={<Link to={`/race/${id}/maps/ward`}>{`${name} - ${year}`}</Link>}
	  bodyStyle={{ padding: 0 }}>
	<div style={{padding: '10px 16px'}}>
	    <p>{date}</p>
	    <p>{electionType}</p>
	    <p>{office}</p>
	</div>
	<CandidateMenu raceID={id}
		       candidates={candidates}/>
    </Card>
)

const RaceMenu = ({races = []}) => (
    <div>
	{races.map(
	     race => <RaceCard {...race}  key={race.id}/>
	 )}
    </div>
)

export default withRouter(RaceMenu)
