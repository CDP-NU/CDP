import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Breadcrumb, Radio, Checkbox } from 'antd'
import { gql, graphql } from 'react-apollo'
import { compose, mapProps, withHandlers, branch, renderComponent } from 'recompose'


const Path = ({}) => (
    <div className="top-bar" style={{height:'48px'}}>
    CHICAGO DEMOCRACY PROJECT
    </div>
)


export default Path
