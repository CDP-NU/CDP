import React from 'react'
import PropTypes from 'prop-types'

export default class MapPopup extends React.Component {

    static contextTypes = {
	map: PropTypes.object
    }

    componentDidMount() {
	const {html, latlng} = this.props
	this.context.map.openPopup({html, latlng})
    }

    componentDidUpdate(prev) {
	if(this.props.popupKey !== prev.popupKey) {
	    const {html, latlng} = this.props
	    this.context.map.openPopup({html, latlng})
	}
    }

    componentWillUnmount() {
	this.context.map.closePopup()
    }

    render() { return null }
}


    
