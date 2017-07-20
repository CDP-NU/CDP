import { gql, graphql } from 'react-apollo'
import { compose, mapProps, withStateHandlers } from 'recompose'
import MapPage from './MapPage'

const raceCandidatesQuery = gql`
query RaceCandidates($raceID: ID!) {
    race(id: $raceID) {
        id
	candidates {
	    id
	    name
	    color
	}
    }
}`

const geocodeQuery = gql`
query Geocode($street: String!) {
    geocode(street: $street) {
	ward
	precinct
	lat
	lon
    }
}`


function createGeocodePopup(request, geocode) {

    const {street, timestamp} = request
    const {ward, precinct, lat, lon} = geocode

    const html = `<h3>${street}</h3>` +
		 `<p>Ward: ${ward}<br/>` +
		 `Precinct: ${precinct}<br/>` +
		 '<small>Based on current (2015-) boundaries</small>' +
		 '</p>'

    return {
	popupKey: timestamp,
	html,
	latlng: [lat, lon]
    }
}


const MapPageContainer = compose(
    mapProps(({match, location, history, ...props}) => {

	const {raceID} = match.params

	const raceYear = raceID.substr(0, 4)
	const raceGeoYear = raceYear >= 2015 ? 2015 : 2003

	return {
	    ...props,
	    raceID,
	    raceGeoYear,
	    url: location.pathname,
	    history
	}
    }),
    graphql(raceCandidatesQuery, {
	props: ({ownProps, data: {loading, error, race = {}}}) => ({
	    ...ownProps,
	    candidates: race.candidates,
	    isRaceLoading: loading || error,
	})
    }),
    withStateHandlers({}, {
	onGeocode: () => street => ({
	    geocodeRequest: {
		street,
		timestamp: Date.now()
	    }
	})
    }),
    graphql(geocodeQuery, {
	skip: ({geocodeRequest}) => !geocodeRequest,
	options: ({geocodeRequest = {}}) => ({
	    variables: {street: geocodeRequest.street}
	}),
	props: ({ownProps, data}) => {

	    const {geocodeRequest, ...props} = ownProps
	    const {loading, error, geocode} = data
	    
	    return {
		...props,
		isGeocodeLoading: loading,
		geocodeError: error,
		geocodePopup: !loading && !error  && geocode ?
			      createGeocodePopup(geocodeRequest, geocode) :
			      null
	    }
	}
    })
)(MapPage)

export default MapPageContainer
