SELECT p.legend AS stdcats,
    p.colors
FROM demography_precinct_maps p
WHERE p.measure = $1
