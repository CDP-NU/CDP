const {  makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')

const typeDefs = `

scalar JSON

enum LEVEL {
  WARD
  PRECINCT
}

type Candidate {
  id: ID!
  name: String
  pct: Int
  color: String
}

type Race {
  id: ID!
  name: String
  date: String
  year: Int
  electionType: String
  office: String
  candidates: [Candidate]!
}

type WardStats {
  ward: Int!
  registeredVoters: Int
  turnout: Float
}

type Stdcat {
  color: String
  stdmin: Int
  stdmax: Int
}

type DemographyStdcat {
  color: String
  stdmin: Float
  stdmax: Float
}

type CandidateMap {
  colors: JSON
  stdcats: [Stdcat]!
}

type DemographyMap {
  colors: JSON
  stdcats: [DemographyStdcat]!
}

type Geocode {
  lat: String
  lon: String
  ward: Int
  precinct: Int
}

type CandidateZoneData {
  name: String
  votes: Int
  pct: Int
}

type DemographyZoneData {
  measure: String
  pct: Float
}

type SearchResult {
  label: String
  description: JSON
}


type Query {
  autocomplete(value: String): [String]!
  search(keyword: String, start: String, end: String, elections: [String], offices: [String], demographies: [String]): [SearchResult]!
  geojson(year: Int, level: LEVEL): JSON!
  race(id: ID!): Race!
  raceMapColors(id: ID!, level: LEVEL!): JSON!
  candidateMap(race: ID!, candidate: Int!, level: LEVEL!): CandidateMap!
  raceWardStats(id: ID!): [WardStats]!
  geocode(street: String): Geocode
  zoneCandidateData(race: ID!, level: LEVEL, zone: Int): [CandidateZoneData]!
  zoneDemographyData(id: ID!, level: LEVEL, zone: Int): DemographyZoneData
  breakdown(id: ID!, level: LEVEL!): [JSON]
  demographyMap(id: ID!, level: LEVEL!): DemographyMap!
  compareCandidate(id: ID!, candidate: Int!):  JSON!
  demographyLevels(id: ID!, level: LEVEL!): JSON
}`

const schema = makeExecutableSchema({ typeDefs, resolvers })

module.exports = schema
