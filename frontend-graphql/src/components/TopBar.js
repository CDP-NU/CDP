import React from 'react'
import { Breadcrumb, Radio } from 'antd'
import { gql, graphql } from 'react-apollo'
import { compose, mapProps, withHandlers } from 'recompose'
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
    mapProps( ({match, history}) => ({
	raceID: match.params.raceID,
	display: match.params.display,
	history,
    })),
    graphql(raceQuery, {
	props: ({ownProps, data: {loading, error, race}}) => ({
	    ...ownProps,
	    items: !loading && !error ? getItems(race) : []
	})
    }),
    withHandlers({
	onDisplayChange: ({raceID, history}) => ({target}) =>
	    history.push(
		target.value === 'maps' ?
		`/race/${raceID}/maps/ward` :
		`/race/${raceID}/graphs/candidates`
	    )
    })
)(Path)
