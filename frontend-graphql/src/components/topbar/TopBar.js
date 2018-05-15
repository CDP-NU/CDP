import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Breadcrumb, Radio, Checkbox, Tooltip } from 'antd'
import { gql, graphql } from 'react-apollo'
import { compose, mapProps, withHandlers, branch, renderComponent } from 'recompose'
import Help from './Help.js'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

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

const raceCandidatesQuery = gql`
query RaceCandidates($raceID: ID!) {
    race(id: $raceID) {
        id
	candidates {
	    id
	    name
	    color
	}
    }
}`
const getItems = ({date, electionType, name}) => [date, electionType, name]

const createBreadcrumbItem = item => (
    <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
)

const style = {display: 'inline-block', marginRight: '20px'}

const ErrorRedirect = ({url}) => <Redirect to={`/?err=500&err_url=${url}`}/>

const Path = ({
    items, 
    display, 
    onDisplayChange, 
    url,
    history,
    race,
    candidates,
    isRaceLoading
}) => (
    <div className="top-bar" style={{minHeight:'48px'}}>
	<div style={{minWidth:'130px', marginRight:'10px', display:'inline-block'}}>
	    <Help />
    </div>
	<Breadcrumb style={style}>
	    {items.map(createBreadcrumbItem)}
	</Breadcrumb>
	<RadioGroup style={{display: 'inline-block'}}
		    value={display}
		    onChange={onDisplayChange}>
	    <RadioButton value="maps">Map</RadioButton>
	    <RadioButton value="candidates">Candidate Totals</RadioButton>
	    <RadioButton value="breakdown">Breakdown by Ward</RadioButton>
	    <RadioButton value="turnout">Turnout by Ward</RadioButton>
	</RadioGroup>
    </div>
)


export default compose(
    mapProps( ({match, location, history}) => ({
	raceID: match.params.raceID,
	display: match.params.display,
	url: location.pathname,
	history,
    })),
    graphql(raceQuery, {
        props: ({ownProps, data: {error, loading, race}}) => (
            {
	    ...ownProps,
	    error: error,
	    items: !loading && !error ? getItems(race) : []
	})
    }),
    branch(
	({error}) => error,
	renderComponent(ErrorRedirect)
    ),
    graphql(raceCandidatesQuery, {
	props: ({ownProps, data: {loading, error, race = {}}}) => ({
	    ...ownProps,
	    candidates: race.candidates,
	    isRaceLoading: loading || error,
	})
    }),
    withHandlers({
	onDisplayChange: ({raceID, history}) => ({target}) =>
	    history.push(
		target.value === 'maps' ?
		`/race/${raceID}/maps/ward` :
	        `/race/${raceID}/${target.value}`
            ),
    })
)(Path)
