import React from 'react'
import { shallowEqual } from '../utility'

export default (duration, propsMapper) => Wrapped => class WithDebouncedProp extends React.Component {

    timer

    constructor(props) {
	super(props)
	this.state = {debounced: propsMapper(props)}
    }
    
    componentWillReceiveProps(next) {
	
	const nextDebounced = propsMapper(next)
	
	if(!shallowEqual(this.state.debounced, nextDebounced)) {
	    this.setDebouncedProps(nextDebounced)
	}
    }
    
    componentWillUnmount() {
	clearTimeout(this.timer)
    }
    

    setDebouncedProps(nextDebounced) {
	clearTimeout(this.timer)
	this.timer = setTimeout(
	    () => {
		this.timer = null
		this.setState({
		    debounced: nextDebounced
		})
	    },
	    duration
	)
    }

    
    render() {
	const {debounced} = this.state
	return <Wrapped {...this.props} {...debounced}/>
    }
}
