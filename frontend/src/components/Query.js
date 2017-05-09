import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { pick, eqByProps } from '../utility'

const createQueryAction = (type, propNames, props, timestamp = Date.now()) => ({
    type,
    request: {
	timestamp,
	...pick(propNames, props)
    }
})

    
const withContainer = (queryType, propNames) => Component => class QueryContainer extends React.Component {
    
    state = {
	timeOfLastRequest: null,
	error: null
    }

    
    componentDidMount() {
	this.submit()
    }

    componentWillReceiveProps(next) {

	const {timeOfLastRequest: time, error} = this.state

	if(time && next.error && next.error.timestamp > time) {
	    this.setState({error: next.error})
	}
	else if(time && error && error.timestamp < time) {
	    this.setState({error: null})
	}
    }

    
    componentDidUpdate(prev) {
	
	if(!eqByProps(propNames, this.props, prev)) {
	    this.submit()
	}
    }
    

    submit() {
	this.setState(
	    () => ({
		timeOfLastRequest: Date.now(),
		error: null
	    }),
	    () => this.props.dispatchQuery(
		queryType, propNames, this.props, this.state.timeOfLastRequest
	    )
	)
    }

    render() {
	return <Component {...this.props} error={this.state.error}
					  requestID={this.state.timeOfLastRequest}/>
    }
}

export default (queryType, propNames) => compose(
    connect(
	(state, props) => ({
	    ...props,
	    error: state.failedRequests[queryType]
	}),
	{dispatchQuery: createQueryAction}
    ),
    withContainer(queryType, propNames)
)
	    
	    
	
