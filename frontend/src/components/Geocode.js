import React from 'react'
import { compose } from 'redux'
import { withState, withHandlers } from 'recompose'
import { Input, Button } from 'antd'
const InputGroup = Input.Group

const Geocode = ({value, onChange, onSearch}) => (
    <InputGroup compact>
	<Input style={{width: '70%'}}
	       placeholder="Ex: 233 S Wacker Dr"
	       value={value}
	       onChange={onChange}
	       onPressEnter={onSearch}/>
	<button className="geocode_btn"
		onClick={onSearch}>Chicago, IL</button>
    </InputGroup>
)

export default compose(
    withState('value', 'submit', ''),
    withHandlers({
	onChange: ({submit}) => ({target}) =>
	    submit(target.value),
	onSearch: ({value, onGeocode}) => () => onGeocode(value)
    })
)(Geocode)
