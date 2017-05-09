import React from 'react'
import { Input, AutoComplete } from 'antd'
import { compose, withState, mapProps, branch } from 'recompose'
import withQuery from './Query'
import withSubscription from './Subscription'
import { REQUEST_AUTOCOMPLETIONS } from '../actions'

const AutocompleteForm = ({
    value,
    autocompletions,
    onChange,
    onSearch,
    onSelect
}) => (
    <div className="autocomplete-wrap">
	<AutoComplete size="large"
		      className="autocomplete"
		      placeholder="Search race or candidate"
		      value={value}
		      showArrow={false}
		      filterOption={false}
		      dataSource={autocompletions}
		      onChange={onChange}
		      onSelect={onSelect}>
	    <Input.Search/>
	</AutoComplete>
    </div>
)

class Container extends React.Component {
    
    willSearch = false

    state = {value: ''}
    
    handleChange = value => {

	if(this.willSearch) {

	    this.willSearch = false
	    this.setState({value}, () => this.props.onSearch(this.state.value))
	}
	else {
	    this.setState(
		{value},
		() => this.props.setAutocompleteKeyword(this.state.value)
	    )
	}
    }

    handleSelect = value => {
	this.willSearch = true
    }


    
    render() {
	return <AutocompleteForm {...this.props} value={this.state.value}
	onChange={this.handleChange}
	onSelect={this.handleSelect}
	onEnter={this.handleEnter}/>
    }
}

const empty = ['  ']
export default compose(
    withState('keyword', 'setAutocompleteKeyword', null),
    branch(
	({keyword}) => keyword,
	compose(
	    withQuery(REQUEST_AUTOCOMPLETIONS, ['keyword']),
	    withSubscription({autocompletions: 'keyword'})
	)
    ),
    mapProps(p => {
	if(p.autocompletions) {
	    return p
	}
	else {
	    return {...p, autocompletions: empty}
	}
    })
)(Container)
