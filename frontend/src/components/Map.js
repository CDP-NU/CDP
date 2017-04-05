import React from 'react'
import 'leaflet/dist/leaflet.css'
import createMap from '../map.js'

export default class extends React.Component {

    componentDidMount() {
	this.props.onMapLoad(createMap(this.node))
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
