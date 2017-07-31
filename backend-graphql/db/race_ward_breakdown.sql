SELECT w.ward AS ward,
  people.label AS candidate,
  w.votes AS votes,
  w.pct AS percent
FROM candidates c
JOIN races r ON c.race = r.id
JOIN candidate_wards w ON c.id = w.candidate
JOIN people ON c.person = people.id
WHERE r.slug = $1 
ORDER BY w.ward ASC
