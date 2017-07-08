import React from 'react'
import { gql, graphql } from 'react-apollo'
import { compose, mapProps, withHandlers } from 'recompose'
import TopBar from './TopBar'

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


const DisplayPage = ({items}) => (
    <div>
	<TopBar items={items}/>
    </div>
)

export default compose(
    mapProps( ({match, history}) => ({
	raceID: match.params.race,
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
)(DisplayPage)
