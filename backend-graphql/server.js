const express = require('express')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const bodyParser = require('body-parser')
const massive = require('massive')
const schema = require('./data/schema')

const connectionString = 'postgres://mac_user_name:mac_password@localhost/election'

massive({connectionString}).then( db => {

    const GRAPHQL_PORT = 8080;

    const graphQLServer = express()

    graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
	schema,
	context: {db}
    }))
    
    graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

    /*** IN PRODUCTION **/
    //graphQLServer.get('*', (req, res) => {
    //    res.sendFile(path.join(__dirname, './public/index.html'))
    //})
   
    
    graphQLServer.listen(GRAPHQL_PORT, () => console.log(
	`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
    ))
})


