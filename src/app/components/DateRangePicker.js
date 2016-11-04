import React from 'react'
import DatePicker from 'react-toolbox/lib/date_picker'
import style from './themes/dateRangePicker.scss'

const minDate = new Date(2003, 1, 1)
const today = new Date()

export default class extends React.Component {
    state = {
	startDate: new Date(2003, 1, 1),
	endDate: today
    }

    constructor(props) {
	super(props)
	this.onStartChange = this.onStartChange.bind(this)
	this.onEndChange = this.onEndChange.bind(this)
    }

    onStartChange(startDate) {
	this.setState({startDate})
    }
    onEndChange(endDate) {
	this.setState({endDate})
    }
    render() {
	return (
	    <div className={style.dateRangePicker}>
		<DatePicker label="Start date"
	                    sundayFirstDayOfWeek
                            minDate={minDate}
                            maxDate={this.state.endDate}
	                    onChange={this.onStartChange}
	                    value={this.state.startDate}/>
		<DatePicker label="End date"
	                    sundayFirstDayOfWeek
                            minDate={this.state.startDate}
                            maxDate={today}
        	            onChange={this.onEndChange}
	                    value={this.state.endDate}/>
	    </div>
	)
    }
}
