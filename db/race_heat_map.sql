WITH race_zone AS (
    SELECT race_heat_map_zone.*
    FROM race_heat_map_zone
    WHERE race_heat_map_zone.race_id = $1
        AND race_heat_map_zone.geo_level = $2
),
winner_priority AS (
    SELECT race_zone.winner_id,
       row_number() OVER (ORDER BY count(*) DESC) AS priority
    FROM race_zone
    GROUP BY race_zone.winner_id
    LIMIT 20
),
legend AS (
    SELECT winner_priority.winner_id,
        candidate_tbl.candidate_name AS value,
        winner_zone_color.color
    FROM winner_priority
    JOIN winner_zone_color ON
        winner_priority.priority = winner_zone_color.winner_priority
    JOIN candidate_tbl ON
        winner_priority.winner_id=candidate_tbl.candidate_id
    ORDER BY winner_priority.priority ASC
),
race_map AS (
    SELECT race_zone.zone_num,
        legend.color
    FROM race_zone
    JOIN legend ON
        race_zone.winner_id = legend.winner_id
)
SELECT *
FROM 
    (
        SELECT json_agg(legend.*) AS legend
            FROM legend
    ) AS t1,
    (
        SELECT json_agg(race_map.*) AS zone_colors
	    FROM race_map
    ) AS t2	 
