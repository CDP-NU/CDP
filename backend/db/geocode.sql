SELECT
  $1::double precision AS lat,
  $2::double precision AS lon,
  w.ward,
  p.precinct
FROM precincts2015 t,
LATERAL (
  SELECT mod(t.wpid::int, 1000) AS precinct
) p,
LATERAL (
  SELECT (t.wpid::int - p.precinct) / 1000 AS ward
) w
WHERE
  ST_Contains(
    wkb_geometry, ST_GeomFromText(
      'POINT(' ||  $2 || ' ' || $1 || ')', 4326
    )
  )
