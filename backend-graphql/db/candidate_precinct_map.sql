SELECT w.legend AS stdcats,
    w.colors
FROM candidates c
JOIN candidate_precinct_maps w ON c.id = w.candidate 
WHERE c.slug = $1
