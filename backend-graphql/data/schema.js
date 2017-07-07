import {
  makeExecutableSchema
} from 'graphql-tools';

import resolvers from './resolvers'

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
  registeredVoters: Int,
  turnout: Int
}

type LegendEntity {
  color: String,
  stdmin: Int,
  stdmax: Int
}

type CandidateMap {
  colors: JSON,
  legend: [LegendEntity]!
}

type Geocode {
  lat: String,
  lon: String,
  ward: Int,
  precinct: Int
}

type Query {
  autocomplete(value: String): [String]!
  search(keyword: String, start: String, end: String, elections: [String], offices: [String]): [Race]!
  geojson(year: Int, level: LEVEL): JSON
  race(id: ID!): Race
  raceMapColors(id: ID!, level: LEVEL!): JSON
  candidateMap(id: ID!, level: LEVEL!): CandidateMap
  raceWardStats(id: ID!): [WardStats]!
  geocode(street: String): Geocode
}


`;

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
