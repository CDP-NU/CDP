import React from 'react'
import {compose, withHandlers, branch, mapProps} from 'recompose'
import { matchPath } from 'react-router-dom'
import { Select, Radio } from 'antd'

const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group


const searchMaps = (input, option) =>
    option.props.value.toLowerCase()
	  .indexOf(input.toLowerCase()) >= 0

const MapSelect = ({
    list = [],
    selectedMapName,
    onMapSelect,
    level,
    onLevelChange
}) => (
    <div>
    <Select showSearch
	    style={{ margin: '10px 20px', width: 200 }}
	    value={selectedMapName}
	    placeholder="Select a map"
	    optionFilterProp="children"
	    onChange={onMapSelect}
    filterOption={searchMaps}>
    {list.map( name =>
	<Option key={name} value={name}>{name}</Option>
    )}
    </Select>
    <RadioGroup style={{display: 'inline-block'}}
		value={level}
		onChange={onLevelChange}>
	<RadioButton value="ward">Ward</RadioButton>
	<RadioButton value="precinct">Precinct</RadioButton>
    </RadioGroup>
    </div>
)


const getMatch = (url, candidates) => {

    const candidateMapMatch = matchPath(url, {
	path:'/race/:race/maps/candidate/:candidateNum/:level'
    })

    const raceMapMatch = matchPath(url, {
	path: '/race/:race/maps/:level'
    })

    if(candidateMapMatch) {
	const {race, candidateNum, level} = candidateMapMatch.params
	return {
	    race,
	    selectedMapName: candidates[candidateNum - 1].name,
	    level,
	    pathPrefix: `/race/${race}/maps/candidate/${candidateNum}`
	}
    }

    if(raceMapMatch) {
	const {race, level} = raceMapMatch.params
	return  {
	    race,
	    selectedMapName: 'Aggregate',
	    level,
	    pathPrefix: `/race/${race}/maps`
	}
    }
    return null
}


export default compose(
    branch(
	({loading}) => !loading,
	mapProps(({url, ...props}) => ({
	    ...props,
	    list: ['Aggregate', ...props.candidates.map(c => c.name)],
	    ...getMatch(url, props.candidates)
	}))
    ),
    withHandlers({
	onMapSelect: ({race, candidates, history, level}) => name => {
	    if(name === 'Aggregate') {
		history.push(`/race/${race}/maps/${level}`)
	    }
	    else {
		const idx = candidates.findIndex( c => c.name === name) + 1
		history.push(`/race/${race}/maps/candidate/${idx}/${level}`)
	    }
	},
	onLevelChange: ({pathPrefix, history}) => ({target}) => {
	    console.log('ayy', pathPrefix, target.value)
	    history.push(`${pathPrefix}/${target.value}`)
	}
    })
)(MapSelect)
