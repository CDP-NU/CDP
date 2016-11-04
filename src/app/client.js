import 'react-toolbox/lib/commons.scss';
import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './storeConfig'
import AppRoute from './components/AppRoute.js'

ReactDOM.render(
    <Provider store={store}>
	<AppRoute/>
    </Provider>,
    document.getElementById('app')
)
