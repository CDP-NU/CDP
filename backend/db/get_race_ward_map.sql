SELECT
  json_build_object(
    'id', r.slug,
    'name', r.label,
    'date', to_char(r.race_date, 'FMMonth FMDDth, YYYY'),
    'electionType', r.election_type,
    'office', r.office
  ) AS race,
  cj.candidates,
  w.colors AS "raceWardMap"
FROM races r
JOIN race_ward_maps w ON r.id = w.race
JOIN candidates_json cj ON r.id = cj.race
WHERE r.slug = $1
