WITH zone_color AS (
    SELECT zone_num,
        color
    FROM candidate_heat_map_zone
    WHERE candidate_id = $1
        AND geo_level = $2
),
legend AS (
    SELECT candidate_zone_color.color,
        min_pct || '-' ||
	max_pct || '%' AS value
    FROM candidate_map_legend
    JOIN candidate_zone_color ON
        candidate_map_legend.color = candidate_zone_color.color
    WHERE candidate_id = $1
        AND geo_level = $2
    ORDER BY candidate_zone_color.stdcat
)
SELECT *
FROM
    (
        SELECT json_agg(legend.*) AS legend
	FROM legend
    ) AS t1,
    (
        SELECT json_agg(zone_color.*) AS zone_colors
	FROM zone_color
    ) AS t2




    



