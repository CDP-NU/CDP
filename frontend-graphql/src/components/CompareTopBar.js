import React from 'react'
import { Redirect } from 'react-router-dom'
import { Breadcrumb, Radio, Checkbox } from 'antd'
import { gql, graphql } from 'react-apollo'
import { compose, mapProps, withHandlers, branch, renderComponent, renderNothing} from 'recompose'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const raceQuery1 = gql`
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
const raceQuery2 = gql`
query Race($raceID2: ID!) {
    race(id: $raceID2) {
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

const ErrorRedirect = ({url}) => <Redirect to={`/?err=500&err_url=${url}`}/>

const Path = ({
    race1_items, race2_items, display, onDisplayChange
}) => (
    <div className="top-bar">
	<Breadcrumb style={{display: 'inline-block', marginRight: '20px'}}>
	    {race1_items.map(createBreadcrumbItem)}
	</Breadcrumb>
	<RadioGroup style={{display: 'inline-block'}}
		    value={display}
		    onChange={onDisplayChange}>
	    <RadioButton value="maps">Map</RadioButton>
	    <RadioButton value="graphs">Graph</RadioButton>
	</RadioGroup>
	<Breadcrumb style={{display: 'inline-block', marginLeft: '20px'}}>
	    {race2_items.map(createBreadcrumbItem)}
	</Breadcrumb>
    </div>
)


export default compose(
    mapProps( ({match, history}) => ({
	raceID: history.raceID,
	raceID2: history.raceID2,
	history,
    })),
    graphql(raceQuery1, {
	props: ({...ownProps, data}) => ({
            race1: data,
	    ...ownProps,
	    race1_items: !data.loading && !data.error ? getItems(data.race) : []
	})
    }),
    graphql(raceQuery2, {
	props: ({...ownProps, data}) => ({
            race2: data,
	    ...ownProps,
	    race2_items: !data.loading && !data.error ? getItems(data.race) : []
	})
    }),
    branch(
	({race1, race2}) => race1.loading || race1.error || race2.loading || race2.error,
	renderNothing
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
