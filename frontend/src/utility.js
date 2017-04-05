import R from 'ramda'

export const eqByProp = name => (x, y) => x[name] === y[name]
export const merge = x => y => ({
    ...y,
    ...x
})

export const onUpdate = f => (...dependencies) =>
    R.any(R.isNil, dependencies) ? undefined : f(...dependencies)

export const generateMapId = ({
    raceUri, level = 'ward', name = 'aggregate'
}) => `${raceUri}${level}${name}`

export const generateGeojsonID = (year, level) => `${year}${level}`

const extractGeoYear = raceUri => {   
    const raceYear = parseInt(R.take(4, raceUri), 10)
    return raceYear >= 2015 ? 2015 : 2003
}

export const geojsonIdFromMap = ({raceUri, level}) => generateGeojsonID(
    extractGeoYear(raceUri), level
)
