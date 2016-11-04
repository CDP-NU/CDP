import axios from 'axios'

export const fetchGeojson = (year, level) =>
    axios.get(
	`/boundary/${year}/${level}`
    )

export const fetchRaceInfo = (election, race, level) =>
    axios.get(
	`/election/raceinfo/${election}/${race}/${level}`
    )

export const fetchRaceHeatMap = (race, level) =>
    axios.get(
	`/election/raceheatmap/${race}/${level}`
    )

export const fetchCandidateHeatMap = (candidate, level) =>
    axios.get(
	`/election/candidateheatmap/${candidate}/${level}`
    )

export const fetchGeocode = street =>
    axios.get(
	`/election/geocode/${street}`
    )

export const fetchAutocompletions = () =>
    axios.get(
	'/election/keywords'
    )

export const fetchSearchResults = keyword =>
    axios.get (
	`/election/searchraces/${keyword}`
    )
