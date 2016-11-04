import React from 'react'
import AppBar from 'react-toolbox/lib/app_bar'
import { IconButton } from 'react-toolbox/lib/button'
import RaceAutocomplete from './RaceAutocomplete.js'
import navBarTheme from './themes/SiteNavBar.scss'
import style from './themes/navBarControls.scss'

const SiteNavBar = props => (
    <AppBar theme={navBarTheme}>
	<section className={style.controls}>
	    <IconButton icon="menu" inverse/>
	    <IconButton icon="search" inverse/>
	    <RaceAutocomplete/>
	</section>
    </AppBar>
)

export default class extends React.Component {
    render() {
	return <SiteNavBar/>
    }
}
