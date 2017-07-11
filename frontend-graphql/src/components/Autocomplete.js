import React from 'react'
import { Input, AutoComplete as AntdAutocomplete, Button, Icon} from 'antd'
import { compose, withState, flattenProp, withHandlers } from 'recompose'
import { gql, graphql } from 'react-apollo'
import withDebouncedProp from './withDebouncedProp'

const autocompleteQuery = gql`
query Autocomplete($debounced: String) {
    autocomplete(value: $debounced)
}`


const Autocomplete = ({
    value = '',
    autocompletions = [],
    onChange,
    onSelect,
    onIconClick
}) => (
    <div className="autocomplete-wrap">
	<AntdAutocomplete size="large"
			  className="autocomplete"
			  placeholder="Search race or candidate"
			  value={value}
			  showArrow={false}
			  dataSource={autocompletions}
			  onChange={onChange}
			  onSelect={onSelect}>
	    <Input suffix={(
		    <Button className="search-btn"
                            size="large"
                            type="primary"
		            onClick={onIconClick}>
			<Icon type="search" />
		    </Button>
		)}/>
	</AntdAutocomplete>
    </div>
)


const nextAutocompleteStatus = {
    'active': 'active',
    'willActivateOnNextChange': 'active',
    'deactivatedForSearch': 'willActivateOnNextChange'
}

export default compose(
    withState('state', 'setState', {
	value: '',
	autocompleteStatus: 'active'
    }),
    flattenProp('state'),
    withDebouncedProp('value', 500),
    graphql(autocompleteQuery, {
	skip: ({autocompleteStatus, value}) =>
	    autocompleteStatus !== 'active' || !value.trim() || value.length <= 2,
	props: ({ownProps, data: {autocomplete}}) => ({
	    ...ownProps,
	    autocompletions: autocomplete
	})
    }),
    withHandlers({
	onChange: ({setState}) => value => setState(
	    ({autocompleteStatus}) => ({
		value,
		autocompleteStatus: nextAutocompleteStatus[autocompleteStatus]
	    })
	),
	onSelect: ({setState, onSearch}) => value => setState(
	    state => ({
		...state,
		autocompleteStatus: 'deactivatedForSearch'
	    }), 
	    () => onSearch(value)
	),
	onIconClick: ({onSearch, setState, value}) => () => setState(
	    state => ({
		...state,
		autocompleteStatus: 'willActivateOnNextChange'
	    }),
	    () => onSearch(value)
	)
    })
)(Autocomplete)
