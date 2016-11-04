WITH results AS (
    SELECT race_tbl.race_id,
        least(race_tbl.race_name <-> $1, candidate_name <-> $1) AS weight
    FROM race_tbl
    JOIN candidate_tbl ON
        race_tbl.race_id = candidate_tbl.race_id
    WHERE least(race_tbl.race_name <-> $1, candidate_tbl.candidate_name <-> $1) < 0.85
),
no_duplicates AS (
    SELECT results.race_id,
        max(results.weight) AS maxWeight
    FROM results
    GROUP BY results.race_id
)
SELECT DISTINCT ON (no_duplicates.maxWeight, no_duplicates.race_id) race_tbl.race_id AS id,
    race_tbl.race_name AS name,
    to_char(race_tbl.race_date, 'FMMonth FMDDth, YYYY') AS date,
    extract(year FROM race_tbl.race_date) AS year,
    race_tbl.election_type AS election_type,
    race_tbl.office,
    race_url.election_name AS election_url,
    race_url.race_name AS race_url, no_duplicates.maxWeight
FROM no_duplicates
JOIN race_tbl ON
    no_duplicates.race_id = race_tbl.race_id
JOIN candidate_tbl ON
    race_tbl.race_id = candidate_tbl.race_id
JOIN race_url ON
    candidate_tbl.race_id = race_url.race_id
ORDER BY no_duplicates.maxWeight, no_duplicates.race_id

