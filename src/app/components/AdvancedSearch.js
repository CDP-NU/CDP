import React from 'react'
import Dropdown from 'react-toolbox/lib/dropdown'
import DateRangePicker from './DateRangePicker.js'
import ReusableDropdown from './ReusableDropdown.js'
import style from './themes/advancedSearch.scss'

const countries = [
    { value: 'EN-gb', label: 'England' },
    { value: 'ES-es', label: 'Spain'},
    { value: 'TH-th', label: 'Thailand' },
    { value: 'EN-en', label: 'USA'}
]

const electionTypes = [
    'Any',
    'Democratic Primary',
    'Republican Primary',
    'General',
    'Municipal General',
    'Municipal Runoffs',
    'Special',
    'Special Primary',
    'Other Primary'
].map(
    e => ({value: e, label: e})
)

const offices = [
    'Any',
    'President',
    'U.S. Senate',
    'U.S. House of Representatives',
    'Governor',
    'State Senate',
    'State General Assembly',
    'Judicial',
    'Mayor',
    'Aldermanic',
    'Ward Committee',
    'Registered Voters',
    'Ballot Measure',
    'Total Ballots Cast',
    'Other'
].map(
    o => ({value: o, label: o})
)


export default ({}) => (
    <section className={style.advancedSearch}>
	<DateRangePicker/>
	<ReusableDropdown label="Choose Election type"
			  source={electionTypes}
                          value="Any"
                          auto/>
        <ReusableDropdown label="Choose Office"
		          source={offices}
                          value="Any"
                          auto/>
    </section>
)
