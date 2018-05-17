const express = require('express')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const bodyParser = require('body-parser')
const massive = require('massive')
const schema = require('./data/schema')

const connectionString = 'postgres://eroubenoff:144230@localhost:5432/election8'
//election5 is the working database
//election7 is the new one 
//Now on election8
massive({connectionString}).then( db => {

    const GRAPHQL_PORT = 8080;

    const graphQLServer = express()

    graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
	schema,
	context: {db}
    }))
    
    graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

    /*** IN PRODUCTION **/
    graphQLServer.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
    })
   
    
    graphQLServer.listen(GRAPHQL_PORT, () => console.log(
	`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
    ))
})


