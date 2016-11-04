import React from 'react'
import SiteNavBar from './SiteNavBar.js'
import style from './themes/siteLayout.scss'



export default class extends React.Component {
    render() {
	
	const isOnSearchPage = this.props.location.pathname ===
	    '/search'
	    
	return (
	    <div className={isOnSearchPage ? '' : style.layout}>
		<SiteNavBar/>
		{this.props.children}
	    </div>
	)
    }
}
