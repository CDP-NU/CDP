WITH matches AS (
  SELECT DISTINCT ON (r.id)
    r.id,
    s.*
  FROM races r,
    LATERAL (
      SELECT  r.election_type = ANY ($3::text[]) AS election_match,
        r.office = ANY ($4::text[]) AS office_match
    ) s 
  WHERE (
    r.race_date BETWEEN
      to_date($1, 'YYYY-MM-DD') AND
      to_date($2, 'YYYY-MM-DD')
  ) AND (
    s.office_match OR
    s.election_match
  )
)
SELECT r.slug AS id,
  r.label AS "name",	
  to_char(r.race_date, 'FMMonth FMDDth, YYYY') AS "date",
  extract(year FROM r.race_date) AS "year",
  r.election_type AS "electionType",
  r.office,
  cj.candidates
FROM races r
JOIN candidates_json cj ON r.id = cj.race
JOIN matches m ON
  r.id=m.id
ORDER BY m.office_match AND m.election_match DESC,
  m.office_match OR m.election_match DESC
LIMIT 50
