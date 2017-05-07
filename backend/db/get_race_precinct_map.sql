SELECT
  json_build_object(
    'id', r.slug,
    'name', r.label,
    'date', to_char(r.race_date, 'FMMonth FMDDth, YYYY'),
    'electionType', r.election_type,
    'office', r.office
  ) AS race,
  cj.candidates,
  p.colors AS "racePrecinctMap"
FROM races r
JOIN race_precinct_maps p ON r.id = p.race
JOIN candidates_json cj ON r.id = cj.race
WHERE r.slug = $1
