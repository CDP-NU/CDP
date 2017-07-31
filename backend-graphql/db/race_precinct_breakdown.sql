SELECT p.wpid AS precinct,
  people.label AS candidate,
  p.votes as votes,
  p.pct as percent
FROM candidates c
JOIN races r ON c.race = r.id
JOIN candidate_precincts p ON c.id = p.candidate
JOIN people ON c.person = people.id
WHERE r.slug = $1 
ORDER BY p.wpid ASC
