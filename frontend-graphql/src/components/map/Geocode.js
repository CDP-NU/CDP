import React from 'react'
import { compose, withState, withHandlers } from 'recompose'
import { Input, Button } from 'antd'
const InputGroup = Input.Group

const Geocode = ({value, onChange, onSearch}) => (
    <InputGroup compact>
	<Input style={{width: 150}}
	       placeholder="Ex: 233 S Wacker Dr"
	       value={value}
	       onChange={onChange}
	       onPressEnter={onSearch}/>
	<Button className="geocode_btn" 
		onClick={onSearch}>Chicago, IL</Button>
    </InputGroup>
)

export default compose(
    withState('value', 'setValue', ''),
    withHandlers({
	onChange: ({setValue}) => ({target}) =>
	    setValue(target.value),
	onSearch: ({value, onGeocode}) => () => onGeocode(value)
    })
)(Geocode)
