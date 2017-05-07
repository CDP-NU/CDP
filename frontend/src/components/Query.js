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


const getError = (lastRequst, currentError, {error, associatedError}) => {

    
    if(error && (error.timestamp > lastRequst)) {
	return error
    }

    if(associatedError &&
       (associatedError.timestamp > lastRequst)) {
	return associatedError
    }


    return currentError && (currentError.timestamp > lastRequst) ?
	   currentError : null
}

    
const withContainer = (queryType, propNames, config = {}) => Component => class QueryContainer extends React.Component {
    
    state = {
	timeOfLastRequest: null,
	error: null
    }

    
    componentDidMount() {
	if(!config.skipFirst) {
	    this.submit()
	}
    }

    componentWillReceiveProps(next) {

	const {timeOfLastRequest: time} = this.state

	if(time) {
	    const error = getError(time, this.state.error, next)

	    if(error && error !== this.state.error) {
		this.setState({error})
	    }
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

export default (queryType, propNames, config = {}) => compose(
    connect(
	(state, props) => ({
	    ...props,
	    error: state.failedRequests[queryType],
	    associatedError: config.associatedQuery ?
		   state.failedRequests[config.associatedQuery] :
		   null
	}),
	{dispatchQuery: createQueryAction}
    ),
    withContainer(queryType, propNames, config)
)
	    
	    
	
