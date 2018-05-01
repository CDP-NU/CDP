import React from 'react'
import * as d3 from 'd3'
import { renameProp, compose, branch, withProps, renderNothing, mapProps, withHandlers, flattenProp } from 'recompose' 
import { gql, graphql } from 'react-apollo'
import { Select } from 'antd'
import './css/CompareScatterPlot.css'
import _ from 'underscore'
import { Switch, Route } from 'react-router-dom'
import CandidatesSelect from './CandidatesSelect'
import CompareCandidates from './CompareCandidates'

const scatterPlotQuery = gql`
query ScatterPlot($raceID: ID!) {
    race(id: $raceID) {
        id
	candidates {
	    id
	    name
	    color
            pct
	}
    }
    raceMapColors(id: $raceID, level: WARD)
    raceWardStats(id: $raceID) {
	ward
	registeredVoters
	turnout
    }
}`
const scatterPlotQuery2 = gql`
query ScatterPlot($raceID2: ID!) {
    race(id: $raceID2) {
        id
	candidates {
	    id
	    name
	    color
            pct
	}
    }
    raceMapColors(id: $raceID2, level: WARD)
    raceWardStats(id: $raceID2) {
	ward
	registeredVoters
	turnout
    }
}`




const CompareCandidatesWrap = ({
    raceID, 
    raceID2, 
    race1, 
    selectedCandidate_race1, 
    selectedCandidate_race2, 
    race2, 
    url,
    history }) => (
    <div className="scatter-plot_wrap">
	<CompareCandidates race1={race1} race2={race2} 
                    selectedCandidate_race1={selectedCandidate_race1}
                    selectedCandidate_race2={selectedCandidate_race2}/>
                <CandidatesSelect url={url}
		    history={history}
		    race1={race1}
		    race2={race2}
                    raceID={raceID}
                    raceID2={raceID2}
                    selectedCandidate_race1={selectedCandidate_race1}
                    selectedCandidate_race2={selectedCandidate_race2}/>
    </div>
)




export default compose(
    mapProps(({match, raceID, raceID2, history, ...props}) => {
            const selectedCandidate_race1 = match.params.selectedCandidate_race1
            const selectedCandidate_race2 = match.params.selectedCandidate_race2
	return {
            ...props,
            raceID,
            raceID2,
            history,
            selectedCandidate_race1, 
            selectedCandidate_race2
	}
    }),
    graphql(scatterPlotQuery),
    renameProp('data', 'race1'),
    graphql(scatterPlotQuery2),
    renameProp('data', 'race2'),
    branch(
	({race1, race2}) => race1.loading || race1.error || race2.loading || race2.error,
	renderNothing
    ),
    withProps(
	({race1, race2}) => {
            return {
	    race1_candidates: race1.race.candidates, 
	    race2_candidates: race2.race.candidates, 
	    race1_zones: race1.raceWardStats.map(
		({ward, registeredVoters, turnout}) => [
		    registeredVoters,
		    turnout * 100,
		    race1.raceMapColors[ward] ? race1.raceMapColors[ward] : '#fff',
                    ward
		]
	    ),
	    race2_zones: race2.raceWardStats.map(
		({ward, registeredVoters, turnout}) => [
		    registeredVoters,
		    turnout * 100,
		    race2.raceMapColors[ward] ? race2.raceMapColors[ward] : '#fff', 
                    ward
		]
	    )
	}}
    )
)(CompareCandidatesWrap)
