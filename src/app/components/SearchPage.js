import React from 'react'
import {Button} from 'react-toolbox/lib/button';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import Link from 'react-router/lib/Link'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getSearchResults } from '../selectors.js'
import AdvancedSearch from './AdvancedSearch.js'
import resultTheme from './themes/searchResult.scss'
import style from './themes/searchPage.scss'

const SearchResult = ({race}) => (
    <Card theme={resultTheme}>
	<CardTitle> 
	    <Link className={style.link}
		  to={`/${race.election_url}/${race.race_url}/map`}>
		{race.name}
	    </Link>
	</CardTitle>
	<CardText>
	    <p>{race.year}<br/>
		{race.election_type}<br/>
		{race.office}
	    </p>
	</CardText> 
    </Card>
)

const makeResults = races => races.map(
    race => (
	<SearchResult key={race.id}
		      race={race}/>
    )
)


const SearchPage = ({races}) => (
    <div>
	<AdvancedSearch/>
	<div className={style.searchResultContainer}>
	    {makeResults(races)}
	</div>
    </div>
)

class Container extends React.Component {
    render() {
	return <SearchPage races={this.props.races}/>
    }
}

export default connect(
    state => ({
	races: getSearchResults(state)
    })
)(Container)
