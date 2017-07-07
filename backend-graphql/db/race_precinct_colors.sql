SELECT w.colors
FROM races r
JOIN race_precinct_maps w ON r.id = w.race
WHERE r.slug = $1
