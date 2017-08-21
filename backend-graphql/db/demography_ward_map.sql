SELECT w.legend AS stdcats,
    w.colors
FROM demography_ward_maps w
WHERE w.measure = $1
