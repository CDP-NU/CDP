import React from 'react'
import * as d3 from 'd3'
import { compose, branch, renderNothing, mapProps, withHandlers, flattenProp } from 'recompose' 
import { gql, graphql } from 'react-apollo'
import { Select } from 'antd'
import '../css/MainContent.css'
import { Switch, Route, matchPath } from 'react-router-dom'
import CompareBarGraph from './CompareBarGraph'
import CompareCandidatesWrap from './CompareCandidatesWrap'
import {selectMin, selectMax }from '../sidebar/DatabaseSearch'

const compareQuery=gql`
query compare($raceID: ID!) {
    race(id: $raceID) {
        id
        candidates {
            id
            name
            color
        }
    }
}`

const Option = Select.Option

const ComparePage = ({raceID, raceID2, compare, handleChange, history}) => (
    <div className="compare_page" style={{float:'left', marginLeft:'10px'}}>
        <Switch>
            <Route path="/race/:raceID/compare/:raceID2/compare_bargraph"
               render={() => <CompareBarGraph raceID={raceID} raceID2={raceID2} />}/> 
            <Route path="/race/:raceID/compare/:raceID2/compare_candidates/:selectedCandidate_race1/:selectedCandidate_race2"
               render={({match}) => <CompareCandidatesWrap raceID={raceID} raceID2={raceID2} history={history} match={match}/>}/> 
        </Switch>
    </div>
)



export default compose(
    mapProps(({match, location, history, ...props}) => {
        const raceID = match.params.raceID
        const raceID2 = match.params.raceID2
        const raceYear = raceID.substr(0, 4)
        const raceYear2 = raceID2.substr(0, 4)
	const raceGeoYear = raceYear >= 2015 ? 2015 : 2003
        const raceGeoYear2 = raceYear2 >= 2015 ? 2015 : 2003

	return {
            ...props,
            raceID,
            raceID2,
	    raceGeoYear,
            raceGeoYear2,
	    url: location.pathname,
	    history
	}
    }),
    graphql(compareQuery, {
        name: 'race1',
        options: (props) => ({
            variables: {
                raceID: props.raceID,
            },
        }),
    }),
    graphql(compareQuery, {
        name: 'race2',
        options: (props) => ({
            variables: {
                raceID: props.raceID2,
            },
        }),
    }),
    branch (
        ({loading, error}) => loading || error,
        renderNothing
    ),
    withHandlers({
	handleChange: ({raceID, raceID2, history}) => compare => {
        compare == 'compare_scatterplot' ?  history.push(`/race/${raceID}/compare/${raceID2}/${compare}/1/1`) : history.push(`/race/${raceID}/compare/${raceID2}/${compare}` )
        }
    })
)(ComparePage)

