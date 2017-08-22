WITH possible_races AS (
  SELECT 
    tag_counts.tag_count,
    'RACE'::text AS label,
    json_build_object(
      'id', r.slug,
      'date', r.race_date,
      'year', extract(year FROM r.race_date),
      'electionType', r.election_type,
      'office', r.office,
      'candidates', cj.candidates
    ) AS description
  FROM races r
  JOIN candidates_json cj ON r.id = cj.race,
  LATERAL (
    SELECT COUNT(*) AS tag_count
    FROM (
      SELECT 1 WHERE r.election_type = ANY($3::text[])
      UNION ALL
      SELECT 1 WHERE r.office = ANY($4::text[])
    ) t
  ) tag_counts
  WHERE r.race_date BETWEEN
      to_date($1, 'YYYY-MM-DD') AND
      to_date($2, 'YYYY-MM-DD')
), possible_demographies AS (
  SELECT
    (SELECT COUNT(*) WHERE d.category = ANY($5::text[])) AS tag_count,
    'DEMOGRAPHY'::text AS label,
    json_build_object(
      'measure', d.measure,
      'category', d.category
    ) AS description
  FROM demography_measures d
)
SELECT results.label,
  results.description
FROM (
  SELECT * FROM possible_races
  UNION ALL
  SELECT * FROM possible_demographies
) results
WHERE results.tag_count > 0
ORDER BY results.tag_count DESC
LIMIT 50
