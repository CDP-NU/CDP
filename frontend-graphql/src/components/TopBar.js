import React from 'react'
import { Redirect } from 'react-router-dom'
import { Breadcrumb, Radio, Checkbox } from 'antd'
import { gql, graphql } from 'react-apollo'
import { compose, mapProps, withHandlers, branch, renderComponent } from 'recompose'
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
    }
}`

const getItems = ({date, electionType, name}) => [date, electionType, name]

const createBreadcrumbItem = item => (
    <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
)

const style = {display: 'inline-block', marginRight: '20px'}

const ErrorRedirect = ({url}) => <Redirect to={`/?err=500&err_url=${url}`}/>

const Path = ({
    items, display, onDisplayChange
}) => (
    <div className="top-bar">
	<Breadcrumb style={style}>
	    {items.map(createBreadcrumbItem)}
	</Breadcrumb>
	<RadioGroup style={{display: 'inline-block'}}
		    value={display}
		    onChange={onDisplayChange}>
	    <RadioButton value="maps">Map</RadioButton>
	    <RadioButton value="graphs">Graph</RadioButton>
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
	props: ({ownProps, data: {loading, error, race}}) => ({
	    ...ownProps,
	    error: error,
	    items: !loading && !error ? getItems(race) : []
	})
    }),
    branch(
	({error}) => error,
	renderComponent(ErrorRedirect)
    ),
    withHandlers({
	onDisplayChange: ({raceID, history}) => ({target}) =>
	    history.push(
		target.value === 'maps' ?
		`/race/${raceID}/maps/ward` :
		`/race/${raceID}/graphs/candidates`
	    )
    })
)(Path)
