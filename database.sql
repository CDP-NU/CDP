-- connectionString = 'postgres://mac_user_name:mac_password@localhost/election'

CREATE EXTENSION postgis
CREATE EXTENSION pg_trgm

CREATE TABLE races (
  id int PRIMARY KEY,
  label text,
  race_date date,
  election_type text,
  office text,
  slug text UNIQUE
)

CREATE TABLE people (
  id int PRIMARY KEY,
  label text,
  UNIQUE(race_id, candidate_name)
)

-- slug = race.slug || '+' || race_position
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  race int REFERENCES races,
  person int REFERENCES people,
  party text,
  pct int,
  race_position int,
  slug text UNIQUE,
  UNIQUE(race, candidate)
)

CREATE TABLE candidate_wards (
  candidate SERIAL REFERENCES candidates,
  ward int,
  stdcat int REFERENCES stdcats,
  votes int,
  pct int,
  PRIMARY KEY(candidate, ward)
)

CREATE TABLE candidate_precincts (
  candidate SERIAL REFERENCES candidates,
  wpid int,
  stdcat int REFERENCES stdcats,
  votes int,
  pct int,
  PRIMARY KEY(candidate, wpid)
)

CREATE TABLE candidate_ward_stdcats (
  candidate SERIAL REFERENCES candidates,
  stdcat int REFERENCES stdcats,
  stdmin int,
  stdmax int,
  PRIMARY KEY(candidate, stdcat)
)

CREATE TABLE candidate_precinct_stdcats (
  candidate SERIAL REFERENCES candidates,
  stdcat int REFERENCES stdcats,
  stdmin int,
  stdmax int,
  PRIMARY KEY(candidate, stdcat)
)

CREATE TABLE race_wards (
  race int REFERENCES races,
  ward int,
  votes_placed int,
  registered_voters int,
  turnout double precision,
  winner SERIAL REFERENCES candidates,
  PRIMARY KEY(race, ward)
)

CREATE TABLE race_precincts (
  race int REFERENCES races,
  wpid int,
  registered_voters int,
  turnout double precision,
  winner SERIAL REFERENCES candidates,
  PRIMARY KEY(race, wpid)
)
  

CREATE TABLE stdcats (
  stdcat int PRIMARY KEY,
  color text
)

CREATE TABLE positions (
  num int PRIMARY KEY,
  color text
)

-- Views



CREATE MATERIALIZED VIEW autocompletions AS
  SELECT DISTINCT label AS race_keyword FROM races
  UNION
  SELECT DISTINCT label FROM people


CREATE MATERIALIZED VIEW candidates_json AS
  SELECT r.id AS race,
    json_agg(
      json_build_object(
        'id', c.slug,
	'name', p.label,
        'pct', c.pct,
	'color', colors.color
      )
      ORDER BY c.race_position
    ) AS candidates
  FROM races r
  JOIN candidates c ON
    r.id = c.race
  JOIN people p ON
    c.person = p.id
  JOIN positions colors ON
    c.race_position = colors.num
  GROUP BY r.id

CREATE MATERIALIZED VIEW candidate_ward_maps AS
  WITH legends AS (
    SELECT ws.candidate,
      json_agg(
        json_build_object(
	  'stdmin', ws.stdmin,
	  'stdmax', ws.stdmax,
          'color', s.color
        )
	ORDER BY ws.stdcat
      ) AS legend
    FROM candidate_ward_stdcats ws
    JOIN stdcats s ON
      ws.stdcat = s.stdcat
    GROUP BY ws.candidate
 ),
 ward_groups AS (
   SELECT w.candidate,
     json_object_agg(
       w.ward,
       s.color
     ) AS colors
   FROM candidate_wards w
   JOIN stdcats s ON
     w.stdcat = s.stdcat
   GROUP BY w.candidate
 )
 SELECT l.candidate,
   l.legend,
   w.colors
 FROM legends l
 JOIN ward_groups w ON
   l.candidate = w.candidate


CREATE MATERIALIZED VIEW candidate_precinct_maps AS
  WITH legends AS (
    SELECT ps.candidate,
      json_agg(
        json_build_object(
	  'stdmin', ps.stdmin,
	  'stdmax', ps.stdmax,
          'color', s.color
        )
	ORDER BY ps.stdcat
      ) AS legend
    FROM candidate_precinct_stdcats ps
    JOIN stdcats s ON
      ps.stdcat = s.stdcat
    GROUP BY ps.candidate
 ),
 precinct_groups AS (
   SELECT p.candidate,
     json_object_agg(
       p.wpid,
       s.color
     ) AS colors
   FROM candidate_precincts p 
   JOIN stdcats s ON
     p.stdcat = s.stdcat
   GROUP BY p.candidate
 )
 SELECT l.candidate,
   l.legend,
   p.colors
 FROM legends l
 JOIN precinct_groups p ON
   l.candidate = p.candidate

CREATE MATERIALIZED VIEW race_ward_maps AS
  SELECT w.race,
    json_object_agg(
      w.ward,
      positions.color
    ) AS colors,
    json_agg(
      json_build_object(
        'ward', w.ward,
	'registeredVoters', w.registered_voters,
	'turnout', w.turnout
      )
    ) AS stats
  FROM race_wards w
  LEFT JOIN candidates c ON
    w.winner = c.id
  LEFT JOIN positions ON
    c.race_position = positions.num
  GROUP BY w.race

CREATE MATERIALIZED VIEW race_precinct_maps AS
  SELECT p.race,
    json_object_agg(
      p.wpid,
      positions.color
    ) AS colors,
    json_agg(
      json_build_object(
        'wpid', p.wpid,
	'registeredVoters', p.registered_voters,
	'turnout', p.turnout
      )
    ) AS stats
  FROM race_precincts p
  LEFT JOIN candidates c ON
    p.winner = c.i
  LEFT JOIN positions ON
    c.race_position = positions.num
  GROUP BY p.race
  


-- INSERT

INSERT INTO stdcats
  VALUES 
    (6, '#800026'),
    (5, '#E31A1C'),
    (4, '#FC4E2A'),
    (3, '#FD8D3C'),
    (2, '#FEB24C'),
    (1, '#FED976'),
    (0, '#FFF');

INSERT INTO positions
  VALUES
    (1, '#FFB300'),
    (2, '#803E75'),
    (3, '#FF6800'),
    (4, '#A6BDD7'),
    (5, '#C10020'),
    (6, '#CEA262'),
    (7, '#817066'),
    (8, '#007D34'),
    (9, '#F6768E'),
    (10, '#00538A'),
    (11, '#FF7A5C'),
    (12, '#53377A'),
    (13, '#FF8E00'),
    (14, '#B32851'),
    (15, '#F4C800'),
    (16, '#7F180D'),
    (17, '#93AA00'),
    (18, '#593315'),
    (19, '#F13A13'),
    (20, '#232C16'),
    (21, '#20538A'),
    (22, '#AF7A5C'),
    (23, '#33377A'),
    (24, '#BF8E00'),
    (25, '#C32851'),
    (26, '#64C800'),
    (27, '#2F180D'),
    (28, '#53AA00'),
    (29, '#193315'),
    (30, '#D13A13'),
    (31, '#832C16')

