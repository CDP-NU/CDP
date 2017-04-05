import React from 'react'
import { Input, AutoComplete } from 'antd'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { autocomplete, clearAutocompletions } from '../creators'
import { getAutocompletions } from '../selectors'


const AutocompleteForm = ({
    autocompletions,
    onChange,
    onKeywordSubmit,
    onClear
}) => (
    <div className="autocomplete-wrap">
	<AutoComplete size="large"
		      className="autocomplete"
		      placeholder="Search race or candidate"
		      showArrow={false}
		      filterOption={false}
		      dataSource={autocompletions}
		      onChange={onChange}
		      onSelect={onKeywordSubmit}
		      onBlur={onClear}>
	    <Input.Search/>
	</AutoComplete>
    </div>
)
    

export default compose(
    connect(
	state => ({
	    autocompletions: getAutocompletions(state)
	}),
	{
	    onChange: autocomplete,
	    onClear: clearAutocompletions
	}
    )
)(AutocompleteForm)
