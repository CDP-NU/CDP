import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import bodyParser from 'body-parser'
import massive from 'massive'
import schema from './data/schema'

const connectionString = CDP_CONNECTION_STRING


massive({connectionString}).then( db => {

    const GRAPHQL_PORT = 8080;

    const graphQLServer = express()

    graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
	schema,
	context: {db}
    }))
    
    graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

    graphQLServer.listen(GRAPHQL_PORT, () => console.log(
	`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
    ))
})


