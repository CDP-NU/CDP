import React from 'react'
import R from 'ramda'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Select, Radio, Icon } from 'antd'
import { flattenProp, withState, withHandlers } from 'recompose'
const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
import { selectMap, selectZone, geocode } from '../creators'
import { getHeatMap, getMapList, getMapName, getPopup } from '../selectors'
import withMutation from './Mutation'
import Map from './Map'
import Geocode from './Geocode'

const searchMaps = (input, option) =>
    option.props.value.toLowerCase()
	  .indexOf(input.toLowerCase()) >= 0

const MapPage = ({
    mapList,
    selectedMap,
    level,
    onMapSelect,
    onLevelChange,
    onMapLoad,
    onGeocode
}) => (
    <div className="map-page">
	<Select showSearch
		style={{ margin: '10px 20px', width: 200 }}
		value={selectedMap}
		placeholder="Select a map"
		optionFilterProp="children"
		onChange={onMapSelect}
		filterOption={searchMaps}>
	    {mapList.map( ({id, name}) =>
		<Option key={id} value={name}>{name}</Option>
	     )}
	</Select>
	<RadioGroup style={{display: 'inline-block'}}
		    value={level}
		    onChange={onLevelChange}>
	    <RadioButton value="ward">Ward</RadioButton>
	    <RadioButton value="precinct">Precinct</RadioButton>
	</RadioGroup>
	<div className="map-container">
	    <div className="geocode_container" style={{}}>
		<p><Icon type="environment"/> Go to address</p>
		<Geocode onGeocode={onGeocode}/>
	    </div>
	    <Map onMapLoad={onMapLoad}/>
	</div>
    </div>
)

export default compose(
    connect(
	(state, props) => ({
	    ...props.match.params,
	    heatMap: getHeatMap(state, props),
	    popup: getPopup(state),
	    mapList: getMapList(state, props),
	    selectedMap: getMapName(state, props),
	    path: `/races/${props.match.params.raceUri}/map`
	}),
	{
	    query: selectMap,
	    onZoneClick: selectZone,
	    onGeocode: geocode
	}
    ),
    withMutation({
	skip: R.eqBy(R.pick(['raceUri', 'level', 'name'])),
	run: props => props.query(props)
    }),
    withState('map', 'onMapLoad', null),
    withMutation({
	skip: ({map, heatMap}, prev = {}) =>
	    !map || !heatMap || (heatMap === prev.heatMap && prev.map),
	run: ({map, heatMap, onZoneClick}) => {
	    map.addGeojson(heatMap, onZoneClick)
	    map.addLegend(heatMap)
	}
    }),
    withMutation({
	skip: ({map, popup}, prev = {}) =>
	    !map || !popup.html || (popup === prev.popup)
	,
	run: ({map, popup}) => map.popup(popup)
    }),
    withHandlers({
	onMapSelect: ({history, mapList, path, level}) => name => {
	    const {id} = R.find(R.whereEq({name}), mapList)
	    history.push(`${path}/${id}/${level}`)
	},
	onLevelChange: ({history, path, name}) => ({target}) =>
	    history.push(`${path}/${name}/${target.value}`)
    })
)(MapPage)
