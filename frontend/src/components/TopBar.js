import React from 'react'
import { connect } from 'react-redux'
import { Breadcrumb, Radio } from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
import { getRacePath } from '../selectors'

const Path = ({items = [], history, path, display}) => (
    <div className="top-bar">
	<Breadcrumb style={{display: 'inline-block', marginRight: '20px'}}>
	    {items.map( item => <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item> )}
	</Breadcrumb>
	<RadioGroup style={{display: 'inline-block'}}
		    value={display}
		    onChange={e => {
			    const {value} = e.target
			    const url = value === 'map' ?
					`${path}/map/aggregate/ward` :
					`${path}/graph/votes/ward`
			    history.push(url)
			}}>
	    <RadioButton value="map">Map</RadioButton>
	    <RadioButton value="graph">Graph</RadioButton>
	</RadioGroup>
    </div>
)

export default connect(
    (state, props) => ({
	display: props.match.params.display,
	items: getRacePath(state, props),
	path: `/races/${props.match.params.raceUri}`
    })
)(Path)
