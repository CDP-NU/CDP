import React from 'react'
import { shallowEqual } from '../utility'

export default (duration, propsMapper) => Wrapped => class withRateLimitedProps extends React.Component {

    constructor(props) {
	super(props)
	this.state = {throttled: propsMapper(props)}
    }

    componentWillReceiveProps(next) {

	const nextThrottled = propsMapper(next)
	
	if(!shallowEqual(this.state.throttled, nextThrottled)) {
	    this.setThrottledProps(nextThrottled)
	}
    }

    componentWillUnmount() {
	clearTimeout(this.timer)
    }

    
    setThrottledProps(nextThrottled) {

	const currentTime = Date.now()

	const hasThrottleTimeLeft = this.lastExecutionTime &&
				    this.lastExecutionTime + duration >= currentTime

	if(hasThrottleTimeLeft) {

	    clearTimeout(this.timer)
	    const timeLeft = (this.lastExecutionTime + duration) - currentTime
	    
	    this.timer = setTimeout(
		() => {
		    this.lastExecutionTime = currentTime
		    this.setState({throttled: nextThrottled})
		},
		timeLeft
	    )
	}
	else {
	    this.lastExecutionTime = currentTime
	    this.setState({throttled: nextThrottled})
	}
    }
	    

    render() {
	const {throttled} = this.state
	return <Wrapped {...this.props} {...throttled}/>
    }
}
