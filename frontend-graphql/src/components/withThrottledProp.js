import React from 'react'

export default (propKey, duration) => Wrapped => class WithThrottledProp extends React.Component {

    timer
    lastExecutionTime

    constructor(props) {
	super(props)
	this.state = {throttled: props[propKey]}
    }

    componentWillReceiveProps(next) {

	if(this.props[propKey] !== next[propKey] ) {
	    this.setThrottledProp(next[propKey])
	}
    }

    componentWillUnmount() {
	clearTimeout(this.timer)
    }

    
    setThrottledProp(value) {

	const currentTime = Date.now()

	const hasThrottleTimeLeft = this.lastExecutionTime &&
				    this.lastExecutionTime + duration >= currentTime

	if(hasThrottleTimeLeft) {

	    clearTimeout(this.timer)
	    const timeLeft = (this.lastExecutionTime + duration) - currentTime
	    
	    this.timer = setTimeout(
		() => {
		    this.lastExecutionTime = currentTime
		    this.setState({throttled: value})
		},
		timeLeft
	    )
	}
	else {
	    this.lastExecutionTime = currentTime
	    this.setState({throttled: value})
	}
    }

    render() {
	const {throttled} = this.state
	return <Wrapped {...this.props} throttled={throttled}/>;
    }
}
