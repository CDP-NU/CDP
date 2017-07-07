WITH matches AS (
  SELECT DISTINCT ON (r.id)
    r.id,
    s.*
  FROM races r
  LEFT JOIN candidates c ON r.id = c.race 
  LEFT JOIN people p ON c.person = p.id
  JOIN LATERAL (
    SELECT least(r.label <-> $1, p.label <-> $1) AS keyword_similarity,
      r.election_type = ANY ($4::text[]) AS election_match,
      r.office = ANY ($5::text[]) AS office_match
  ) s ON TRUE
  WHERE (
      r.race_date BETWEEN
        to_date($2, 'YYYY-MM-DD') AND
        to_date($3, 'YYYY-MM-DD')
  ) AND (
    s.office_match OR
    s.election_match OR
    s.keyword_similarity < 0.85
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
JOIN matches m ON r.id = m.id
ORDER BY m.keyword_similarity < 0.85 DESC,
  m.office_match AND m.election_match DESC,
  m.office_match OR m.election_match DESC,
  m.keyword_similarity
LIMIT 50
