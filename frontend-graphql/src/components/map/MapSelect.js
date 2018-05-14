import React from 'react'
import { compose, withProps, withHandlers } from 'recompose'
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
    <div style={{ }}>
	<Select showSearch
		style={{ marginTop:10, width: 200 }}
		value={selectedMapName}
		placeholder="Select a map"
		optionFilterProp="children"
		onChange={onMapSelect}
		filterOption={searchMaps}>
	    {list.map( name =>
		<Option key={name} value={name}>{name}</Option>
	     )}
	</Select>
	<RadioGroup style={{marginTop:10}}
		    value={level}
		    onChange={onLevelChange}>
	    <RadioButton value="ward">Ward</RadioButton>
	    <RadioButton value="precinct">Precinct</RadioButton>
	</RadioGroup>
    </div>
)


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


export default compose(
    withProps( ({loading, url, ...props}) =>
	!loading ? {
	    list: ['Aggregate', ...props.candidates.map(c => c.name)],
	    ...getMatch(url, props.candidates)
	} : null
    ),
    withHandlers({
	onMapSelect: ({raceID, candidates, history, level}) => name => {
	    if(name === 'Aggregate') {
		history.push(`/race/${raceID}/maps/${level}`)
	    }
	    else {
		const idx = candidates.findIndex( c => c.name === name) + 1
		history.push(`/race/${raceID}/maps/candidate/${idx}/${level}`)
	    }
	},
	onLevelChange: ({pathPrefix, history}) => ({target}) => 
	    history.push(`${pathPrefix}/${target.value}`)
    })
)(MapSelect)
