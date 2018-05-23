SELECT measure, display as pct FROM demography_precincts
WHERE measure = $1 AND precinct = $2