import React from 'react'
import * as d3 from 'd3'
import { renameProp, compose, branch, withProps, renderNothing, mapProps, withHandlers, flattenProp } from 'recompose' 
import { gql, graphql } from 'react-apollo'
import { Select } from 'antd'
import '../css/MainContent.css'
import _ from 'underscore'
import { Switch, Route, matchPath } from 'react-router-dom'
import { Legend, CompareCandidates } from './CompareCandidates'

const Option = Select.Option

const getMatch = (url, candidates) => {

    const candidateMapMatch = matchPath(url, {
	path:'/race/:raceID/maps/candidate/:candidateNum/:level'
    })

    const raceMapMatch = matchPath(url, {
	path: '/race/:raceID/maps/:level'
    })

    if(candidateMapMatch) {
	const {raceID, candidateNum, level} = candidateMapMatch.params
	return {
	    raceID,
	    selectedMapName: candidates[candidateNum - 1].name,
	    level,
	    pathPrefix: `/race/${raceID}/maps/candidate/${candidateNum}`
	}
    }

    if(raceMapMatch) {
	const {raceID, level} = raceMapMatch.params
	return  {
	    raceID,
	    selectedMapName: 'Aggregate',
	    level,
	    pathPrefix: `/race/${raceID}/maps`
	}
    }
    return null
}

const CandidatesSelect = ({
	race1,
	race2,
    list_race1,
    list_race2,
    selectedCandidate_race1,
    selectedCandidate_race2,
    onCandidate1Select,
    onCandidate2Select
}) => (
    <div>
	<Select showSearch
		style={{ margin: '10px 20px', width: 200 }}
		placeholder={list_race1[selectedCandidate_race1]}
		optionFilterProp="children"
		onChange={onCandidate1Select}
		>
	    {list_race1.map( name =>
		<Option key={name} value={name}>{name}</Option>
	     )}
	</Select>
	<Select showSearch
		style={{ margin: '10px 20px', width: 200 }}
		placeholder={list_race1[selectedCandidate_race2]}
		optionFilterProp="children"
		onChange={onCandidate2Select}
		>
	    {list_race2.map( name =>
		<Option key={name} value={name}>{name}</Option>
	     )}
	</Select>
    </div>
)
export default compose(
    withProps( ({url, ...props}) => {
        return {
        ...props,
	    list_race1: props.race1.race.candidates.map(c => c.name),
	    list_race2: props.race2.race.candidates.map(c => c.name)
	}
    }),
    withHandlers({
	onCandidate1Select: ({raceID, raceID2, selectedCandidate_race2, list_race1, history}) => name => {
            const idx = list_race1.indexOf(name) + 1
            history.push(`/race/${raceID}/compare/${raceID2}/compare_candidates/${idx}/${selectedCandidate_race2}`)
	},
	onCandidate2Select: ({raceID, raceID2, selectedCandidate_race1, list_race2, history}) => name => {
            const idx = list_race2.indexOf(name) + 1
            history.push(`/race/${raceID}/compare/${raceID2}/compare_candidates/${selectedCandidate_race1}/${idx}`)
	}
    })
)(CandidatesSelect)







