SELECT w.ward,
  w.votes,
  w.pct,
  people.label AS "name"
FROM candidates c
JOIN races r ON c.race = r.id
JOIN candidate_wards w ON c.id = w.candidate
JOIN people ON c.person = people.id
WHERE r.slug = $1 AND c.slug= $2
ORDER BY w.ward ASC 
