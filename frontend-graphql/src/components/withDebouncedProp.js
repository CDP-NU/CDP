import React from 'react'

export default (propKey, duration) => Wrapped => class WithDebouncedProp extends React.Component {

    timer

    constructor(props) {
	super(props)
	this.state = {debounced: props[propKey]}
    }
    
    componentWillReceiveProps(next) {
	
	if(this.props[propKey] !== next[propKey] ) {
	    this.setDebouncedProp(next[propKey])
	}
    }
    
    componentWillUnmount() {
	clearTimeout(this.timer)
    }
    

    setDebouncedProp(value) {
	clearTimeout(this.timer)
	this.timer = setTimeout(
	    () => {
		this.timer = null
		this.setState({
		    debounced: value
		})
	    },
	    duration
	)
    }

    
    render() {
	const {debounced} = this.state
	return <Wrapped {...this.props} debounced={debounced}/>;
    }
}
