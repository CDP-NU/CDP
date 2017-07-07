SELECT people.label AS "name",
  w.votes,
  w.pct
FROM candidates c
JOIN races r ON c.race = r.id
JOIN candidate_wards w ON c.id = w.candidate
JOIN people ON c.person = people.id
WHERE r.slug = $1 AND
  w.ward = $2
ORDER BY w.votes DESC
