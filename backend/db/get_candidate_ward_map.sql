SELECT
  json_build_object(
    'id', r.slug,
    'name', r.label,
    'date', to_char(r.race_date, 'FMMonth FMDDth, YYYY'),
    'electionType', r.election_type,
    'office', r.office
  ) AS race,
  cj.candidates,
  json_build_object(
    'legend', w.legend,
    'colors', w.colors
  ) AS "candidateWardMap"
FROM candidates c
JOIN candidate_ward_maps w ON c.id = w.candidate 
JOIN races r ON c.race = r.id
JOIN candidates_json cj ON r.id = cj.race
WHERE c.slug = $1
