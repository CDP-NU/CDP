WITH candidate AS (
    SELECT candidate_id AS id,
        candidate_name AS name,
        race_id
    FROM candidate_tbl
)
SELECT race_tbl.race_id AS id,
    race_tbl.race_name AS name,
    race_tbl.race_date AS date,
    extract(year FROM race_tbl.race_date) AS year,
    race_tbl.election_type,
    json_agg(candidate.*) AS candidates
FROM race_tbl
JOIN race_url ON
    race_tbl.race_id = race_url.race_id
JOIN candidate ON
    race_tbl.race_id = candidate.race_id
WHERE
    race_url.election_name = $1 AND
    race_url.race_name = $2
GROUP BY race_tbl.race_id
