import React from 'react'
import PropTypes from 'prop-types'
import { eqByKeys } from '../utility'

export default class MapGeojson extends React.Component {

    static contextTypes = {
	map: PropTypes.object
    }

    componentDidMount() {
	this.load()
    }

    componentDidUpdate(prev) {

	const eq = eqByKeys(
	    ['geojson', 'colors', 'zoneKey', 'legend'],
	    this.props,
	    prev
	)
	
	if(!eq) {
	    this.remove()
	    this.load()
	} 
    }


    handleClick = (latlng, zone) => this.props.onClick(latlng, zone)

    load() {
	
	const {geojson, colors, zoneKey, legend} = this.props

	this.context.map.addGeojson({
	    geojson,
	    colors,
	    zoneKey,
	    onClick: this.handleClick
	})

	this.context.map.addLegend(legend)
    }

    remove() {
	this.context.map.removeGeojson()
	this.context.map.removeLegend()
    }

    render() {
	return this.props.children
    }

    componentWillUnmount() {
	this.remove()
    }
}
