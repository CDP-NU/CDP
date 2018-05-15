import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Collapse, Breadcrumb, Button, Icon} from 'antd'
import { gql, graphql } from 'react-apollo'
import { compose, mapProps, withHandlers, branch, renderComponent } from 'recompose'
import Help from './Help.js'
import '../css/App.css'

const Path = () => (
    <div className="top-bar" style={{minHeight:'48px', width:'100%', display:'inline-block'}}>
        <Help style={{position:'absolute', width:'100%'}} />
    </div>
)


export default Path
