import React from 'react'
import { Breadcrumb, Radio } from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
import { compose, mapProps, withPropsOnChange, flattenProp, withHandlers } from 'recompose'
import withSubscription from './Subscription'

const Path = ({items = [], display, onDisplayChange}) => (
    <div className="top-bar">
	<Breadcrumb style={{display: 'inline-block', marginRight: '20px'}}>
	    {items.map( item => <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item> )}
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
    mapProps( ({match: {params}, ...props}) => ({
	...props,
	...params,
	path: `/races/${params.race}`
    })),
    withSubscription({
	race: 'race'
    }),
    flattenProp('race'),
    withPropsOnChange(
	['id', 'loading'],
	({loading, date, electionType, name}) => {
	    return !loading ? {items: [date, electionType, name]} : null
	}
    ),
    withHandlers({
	onDisplayChange: ({id: race, history}) => ({target}) => 
	    history.push(
		target.value === 'maps' ?
		`/race/${race}/maps/ward` :
		`/race/${race}/graphs/candidates`
	    )
    })
)(Path)
