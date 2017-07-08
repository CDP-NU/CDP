import React from 'react'
import PropTypes from 'prop-types'
import createMap from '../map.js'

class LeafletWrapper extends React.Component {

    componentDidMount() {
	const map = createMap()
	map.loadMap(this.node)
	this.props.onMapLoad(map)
    }

    shouldComponentUpdate() {
	return false
    }

    render() {
	return (
	    <div className="app-map"
		 ref={node => { this.node = node }}/>
	)
    }
}

export default class MapProvider extends React.Component {

    state = {
	map: null
    }


    static childContextTypes = {
	map: PropTypes.object
    }

    getChildContext() {
	return {map: this.state.map}
    }


    handleMapLoad = map => this.setState({map})

    render() {
	return (
	    <div className="map-container">
		<LeafletWrapper onMapLoad={this.handleMapLoad}/>
		{this.state.map ? this.props.children : null}
	    </div>
	)
    }
}
