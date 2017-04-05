import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import './index.css';
import App from './components/App'
import store from './storeConfiguration'

ReactDOM.render(
    <Provider store={store}>
	<LocaleProvider locale={enUS}>
	    <BrowserRouter basename="/database">
		<App/>
	    </BrowserRouter>
	</LocaleProvider>
    </Provider>,
  document.getElementById('root')
)
