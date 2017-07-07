SELECT people.label AS "name",
  p.votes,
  p.pct
FROM candidates c
JOIN races r ON c.race = r.id
JOIN candidate_precincts p ON c.id = p.candidate
JOIN people ON c.person = people.id
WHERE r.slug = $1 AND
  p.wpid = $2
ORDER BY p.votes DESC
