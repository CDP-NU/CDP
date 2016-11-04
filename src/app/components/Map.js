import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadLeafletMap } from '../creators.js'
import style from './themes/map.scss'

class Map extends React.Component {
    componentDidMount() {

	const {loadLeafletMap} = this.props
	const mapRef = this.refs.map
	loadLeafletMap(mapRef)
    }
    shouldComponentUpdate(nextProps) {
	return false;
    }
    render() {
	return (
	    <div className={style.map}
		 ref='map'/>
	)
    }
}

export default connect(null, dispatch => (
    bindActionCreators({
	loadLeafletMap
    }, dispatch)
))(Map)
