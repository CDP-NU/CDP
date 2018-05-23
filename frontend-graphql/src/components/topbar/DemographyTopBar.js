import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Breadcrumb, Radio, Checkbox, Collapse, Icon, Tooltip} from 'antd'
import { gql, graphql } from 'react-apollo'
import Help from './Help.js'
import { compose, mapProps, withHandlers, branch, renderComponent } from 'recompose'

const raceQuery = gql`
query Race($raceID: ID!) {
    race(id: $raceID) {
	id
	name
	date
	year
	electionType
	office
        candidates {
            id
            name
        }
    }
}`

const DemographyTopBar = ({
    title
}) => (
    <div className="top-bar">
	<h3>{title}</h3>
    </div>
)

const createBreadcrumbItem = item => (
    <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
)

const style = {display: 'inline-block', marginRight: '20px'}
const capitalize = { "WARD" : "Ward", "PRECINCT" : "Precinct"}

const Path = ({
	title,
	level
}) => (
    <div className="top-bar" style={{minHeight:'48px'}}>
	<div style={{minWidth:'130px', marginRight:'10px', display:'inline-block'}}>
	    <Help />
    </div>
	<Breadcrumb style={style}>
		{["Demography", title, capitalize[level] ].map(createBreadcrumbItem)}
	</Breadcrumb>
    </div>
)


export default Path
