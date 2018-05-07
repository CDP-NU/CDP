import React from 'react'
import { Input, AutoComplete as AntdAutocomplete, Button, Icon} from 'antd'
import { compose, withStateHandlers, withHandlers } from 'recompose'
import { gql, graphql } from 'react-apollo'
import withDebouncedProps from './withDebouncedProps'

const autocompleteQuery = gql`
query Autocomplete($debouncedValue: String) {
    autocomplete(value: $debouncedValue)
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
    withStateHandlers(
	{
	    value: '',
	    autocompleteStatus: 'active'
	},
	{
	    onChange: ({autocompleteStatus: status}) => value => ({
		value,
		autocompleteStatus: nextAutocompleteStatus[status]
	    }),
	    setStatus: () => autocompleteStatus => ({autocompleteStatus})
	}
    ),
    withDebouncedProps(500, ({value}) => ({debouncedValue: value})),
    graphql(autocompleteQuery, {
	skip: ({autocompleteStatus, value}) =>
	    autocompleteStatus !== 'active' || !value.trim() || value.length <= 2,
	props: ({ownProps, data: {autocomplete}}) => ({
	    ...ownProps,
	    autocompletions: autocomplete
	})
    }),
    withHandlers({
	onSelect: ({setStatus, onSearch}) => value => {
	    setStatus('deactivatedForSearch')
	    onSearch(value)
	},
	onIconClick: ({onSearch, setStatus, value}) => () => {
	    setStatus('willActivateOnNextChange')
	    onSearch(value)
	}
    })
)(Autocomplete)
