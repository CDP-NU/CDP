import React from 'react'

export default config => Component => class extends React.Component {
    
    componentDidMount() {
	const {skipFirst = false} = config
	if(!config.skip(this.props, {}) && !skipFirst) {
	    config.run(this.props)
	}
    }

    componentDidUpdate(old) {
	if(!config.skip(this.props, old)) {
	    config.run(this.props)
	}
    }

    render() {
	return <Component {...this.props}/>
    }
}
