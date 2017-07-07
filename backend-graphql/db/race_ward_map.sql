SELECT w.colors AS "raceWardMap"
FROM races r
JOIN race_ward_maps w ON r.id = w.race
WHERE r.slug = $1
