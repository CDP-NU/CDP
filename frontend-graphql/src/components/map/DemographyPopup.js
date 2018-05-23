import { gql, graphql } from 'react-apollo'
import React from 'react'
import { compose, flattenProp, branch, renderNothing,  mapProps } from 'recompose'
import PropTypes from 'prop-types'

const popupQuery = gql`
query Popup($id: ID!, $level: LEVEL!, $zone: Int!) {
    zoneDemographyData(id: $id, level: $level, zone: $zone) {
		measure
		pct
    }
}`

const appendCandidateToPopup = (
    html, {name, votes, pct}
) => `${html}<br/> ${name}: ${votes} votes, ${pct}%`

const popups = {
    WARD: (ward, zoneDemographyData) => (
		`<h3>Ward: ${ward}</h3> <br />
		${zoneDemographyData.measure}: ${zoneDemographyData.pct}%
		`
    ),
    PRECINCT:  (wpid, zoneDemographyData) => {
		const precinct = wpid % 1000
		const ward = (wpid - precinct) / 1000

		return (
		`<h3>Ward: ${ward}, Precinct: ${precinct}</h3>
		${zoneDemographyData.measure}: ${zoneDemographyData.pct}%`)
    }
}

class MapPopup extends React.Component {

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


    
const DemopgraphyPopup= compose(
    graphql(popupQuery),
    flattenProp('data'),
    branch(
		({loading, error}) => loading || error,
		renderNothing
    ),
    mapProps( ({zoneDemographyData, level, zone, popupKey, latlng}) => ({
		popupKey,
		html: popups[level](zone, zoneDemographyData),
		latlng
    })),
)(MapPopup)

export default DemopgraphyPopup 
