SELECT coalesce(array_agg(t.keyword), '{}') AS autocompletions
FROM (
  SELECT a.race_keyword AS keyword
  FROM autocompletions a,
  LATERAL (
    SELECT similarity(a.race_keyword, $1) AS dist
  ) d
  WHERE a.race_keyword <-> $1 < 0.85
  ORDER BY d.dist DESC
  LIMIT 10
) t
