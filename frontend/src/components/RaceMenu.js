import React from 'react'
import { connect } from 'react-redux'
import R from 'ramda'
import { compose } from 'redux'
import { withRouter, Link } from 'react-router-dom'
import { Card, Menu, Icon} from 'antd'
const SubMenu = Menu.SubMenu
import { getSearchResults } from '../selectors'

const CandidateMenuTitle = () => (
    <span>
	<Icon type="user" />
	<span>Candidate Maps</span>
    </span>
)

const CandidateMenu = ({uri, candidates}) => (
    <Menu style={{width: '100%', display: 'block'}}
	  mode="inline" selectedKeys={[]}>
	<SubMenu key="sub1" title={<CandidateMenuTitle/>}>
	    {candidates.map(
		 ({id, name}) => (
		     <Menu.Item key={id}>
			 <Link to={`/races/${uri}/map/${id}/ward`}>{name}</Link>
		     </Menu.Item>
		 )
	     )}
	</SubMenu>
    </Menu>
)

export const RaceCard = ({
    id,
    uri,
    name,
    date,
    year,
    office,
    electionType,
    candidates
}) => (
    <Card title={<Link to={`/races/${uri}/map/aggregate/ward`}>{`${name} - ${year}`}</Link>}
	  bodyStyle={{ padding: 0 }}>
	<div style={{padding: '10px 16px'}}>
	    <p>{date}</p>
	    <p>{electionType}</p>
	    <p>{office}</p>
	</div>
	<CandidateMenu uri={uri}
		       candidates={candidates}/>
    </Card>
)

const RaceMenu = ({races}) => (
    <div>
	{races.map(
	     race => <RaceCard {...race}  key={race.id}/>
	 )}
    </div>
)

export default compose(
    withRouter,
    connect(
	(state, props) => ({
	    races: getSearchResults(state)
	})
    )
)(RaceMenu)
	

