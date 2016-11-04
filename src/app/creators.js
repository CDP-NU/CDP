import * as actions from './actions.js'

export const selectGeojson = (year, level) => ({
    type: actions.SELECT_GEOJSON,
    data: {year, level}
})

export const selectRace = (electionUrl, raceUrl) => ({
    type: actions.SELECT_RACE,
    data: {electionUrl, raceUrl}
})

export const mapRace = (race, year, level) => ({
    type: actions.MAP_RACE,
    data: {race, year, level}
})

export const mapCandidate = (candidate, year, level) => ({
    type: actions.MAP_CANDIDATE,
    data: {candidate, year, level}
})


export const geocodeStreet = street => ({
    type: actions.GEOCODE_STREET,
    data: {street}
})


export const loadLeafletMap = node => ({
    type: actions.LOAD_LEAFLET_MAP,
    data: {node}
})


export const searchDatabase  = keyword => ({
    type: actions.SEARCH_DATABASE,
    data: {keyword}
})

export const requestAutocompletions = () => ({
    type: actions.REQUEST_AUTOCOMPLETIONS,
    data: {}
})


export const fetchedRace = (race, candidates) => ({
    type: actions.FETCHED_RACE,
    data: {race, candidates}
})

export const fetchedAutocompletions = completions => ({
    type: actions.FETCHED_AUTOCOMPLETIONS,
    data: {completions}
})

export const fetchedSearchResults = races => ({
    type: actions.FETCHED_SEARCH_RESULTS,
    data: {races}
})


