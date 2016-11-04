import React from 'react'
import Dropdown from 'react-toolbox/lib/dropdown'

export default class extends React.Component {

    constructor(props) {
	super(props)
	this.state = {value: props.value}
	this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {
	const onChange = this.props.onChange
	this.setState({value: value})
	if(onChange) {
	    onChange(value)
	}
    }

    render () {
	return (
	    <Dropdown {...this.props}
                      value={this.state.value}
                      onChange={this.handleChange}/>
	)
    }
}
