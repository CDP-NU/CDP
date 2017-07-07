SELECT r.id,
  r.label AS "name",
  to_char(r.race_date, 'FMMonth FMDDth, YYYY') AS "date",
  r.election_type AS "electionType",
  r.office,
  cj.candidates
FROM races r
JOIN candidates_json cj ON r.id = cj.race
WHERE r.slug = $1
