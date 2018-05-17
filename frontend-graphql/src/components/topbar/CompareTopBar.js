import React from 'react'
import { Redirect } from 'react-router-dom'
import { Breadcrumb, Radio, Checkbox } from 'antd'
import { gql, graphql } from 'react-apollo'
import { compose, mapProps, withHandlers, branch, renderComponent, renderNothing} from 'recompose'
import Help from './Help.js'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const raceQuery1 = gql`
query Race($raceID: ID!) {
    race(id: $raceID) {
	id
	name
	date
	year
	electionType
	office
    }
}`
const raceQuery2 = gql`
query Race($raceID2: ID!) {
    race(id: $raceID2) {
	id
	name
	date
	year
	electionType
	office
    }
}`

const getItems = ({date, electionType, name}) => [date, electionType, name]

const createBreadcrumbItem = item => (
    <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
)

const ErrorRedirect = ({url}) => <Redirect to={`/?err=500&err_url=${url}`}/>

const Path = ({
    race1_items, race2_items, display, compare, onCompareChange, onDisplayChange
}) => (
    <div className="top-bar" style={{minHeight:'48px', margin:'auto'}}>
	    <div style={{minWidth:'130px', marginRight:'10px', display:'inline-block'}}>
		    <Help />
	    </div>
		<RadioGroup style={{display: 'inline-block', marginLeft: '20px'}}
			    onChange={onCompareChange}>
		    <RadioButton value="compare_candidates">Candidates</RadioButton>
		    <RadioButton value="compare_bargraph">Election</RadioButton>
		</RadioGroup>
	    <div style={{marginLeft: '20px', height:'40px', position:'absolute', width:'100%', display: 'inline-block'}}>
			<Breadcrumb style={{position: 'absolute'}}>
			    {race1_items.map(createBreadcrumbItem)}
			</Breadcrumb>
			<Breadcrumb style={{position:'absolute', marginTop:'18px'}}>
			    {race2_items.map(createBreadcrumbItem)}
			</Breadcrumb>
		</div>
    </div>
)


export default compose(
    mapProps( ({history, match, params}) => ({
	raceID: params.raceID,
	raceID2: params.raceID2,
	history,
    })),
    graphql(raceQuery1, {
	props: ({...ownProps, data}) => ({
            race1: data,
	    ...ownProps,
	    race1_items: !data.loading && !data.error ? getItems(data.race) : []
	})
    }),
    graphql(raceQuery2, {
	props: ({...ownProps, data}) => ({
            race2: data,
	    ...ownProps,
	    race2_items: !data.loading && !data.error ? getItems(data.race) : []
	})
    }),
    branch(
	({race1, race2}) => race1.loading || race1.error || race2.loading || race2.error,
	renderNothing
    ),
    withHandlers({
	onDisplayChange: ({raceID, history}) => ({target}) =>
	    history.push(
		target.value === 'maps' ?
		`/race/${raceID}/maps/ward` :
		`/race/${raceID}/candidates`
	    ),
	onCompareChange: ({raceID, raceID2, history}) => compare => {
            compare.target.value == 'compare_candidates' ?  history.push(`/race/${raceID}/compare/${raceID2}/${compare.target.value}/1/1`) : history.push(`/race/${raceID}/compare/${raceID2}/${compare.target.value}` )
        }
    })
)(Path)
