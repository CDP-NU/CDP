import React from 'react'
import Navigation from 'react-toolbox/lib/navigation'
import Button from 'react-toolbox/lib/button'
import btnTheme from './themes/mapActionBar.scss'

export default ({level, onMapActionClick}) => (
    <Navigation theme={btnTheme} type='horizontal'>
	<Button icon='layers'
		label={level === 'ward' ? 'precincts' : 'wards'}
		onClick={() => onMapActionClick('level')}
		accent  />
	<Button icon='near_me' label='Geocode' accent />
	<Button icon='color_lens' label='Legend' accent />
	<Button icon='file_download' label='Download' accent />
    </Navigation>

)
