SELECT w.measure, w.display as "pct" 
FROM demography_wards w
WHERE w.measure = $1 AND w.ward = $2