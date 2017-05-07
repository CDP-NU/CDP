import { compose, withState, flattenProp, withHandlers, branch } from 'recompose'
import withQuery from './Query'
import withSubscription from './Subscription'
import * as actions from '../actions'

export default compose(
    withState('selectedWardInfo', 'selectWard', null),
    branch(
	({selectedWardInfo}) => selectedWardInfo,
	compose(
	    flattenProp('selectedWardInfo'),
	    withQuery(
		actions.REQUEST_WARD,
		['race', 'ward', 'latlng']
	    ),
	    withSubscription(
		{ward: 'requestID'},
		({requestID, latlng, ward}) => ({
		    popup: {
			popupID: requestID,
			html: ward,
			latlng
		    }
		})
	    )
	)
    ),
    withHandlers({
	onClick: ({selectWard, race}) => (latlng, ward) => 
	    selectWard({race, ward, latlng})
    })
)
