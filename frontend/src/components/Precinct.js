import { compose, withState, flattenProp, withHandlers, branch } from 'recompose'
import withQuery from './Query'
import withSubscription from './Subscription'
import * as actions from '../actions'

export default compose(
    withState('selectedPrecinctInfo', 'selectPrecinct', null),
    branch(
	({selectedPrecinctInfo}) => selectedPrecinctInfo,
	compose(
	    flattenProp('selectedPrecinctInfo'),
	    withQuery(
		actions.REQUEST_PRECINCT,
		['race', 'wpid']
	    ),
	    withSubscription(
		{precinct: 'requestID'},
		({requestID, latlng, precinct}) => ({
		    popup: {
			popupID: requestID,
			html: precinct,
			latlng
		    }
		})
	    )
	)
    ),
    withHandlers({
	onClick: ({selectPrecinct, race}) => (latlng, wpid) =>
	    selectPrecinct({race, wpid, latlng})
    })
)
