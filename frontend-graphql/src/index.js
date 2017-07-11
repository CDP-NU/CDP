import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './index.css'
import { ApolloClient, ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'

const client = new ApolloClient()

ReactDOM.render(
    <BrowserRouter basename="/database">
	<ApolloProvider client={client}>
	    <LocaleProvider locale={enUS}>
		<App/>
	    </LocaleProvider>
	</ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
)
