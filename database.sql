-- connectionString = 'postgres://mac_user_name:mac_password@localhost/election'

--psql commands must be executed from root if on the linux server (sudo -i)
--pg_dump -Fc election5 -U 'cdp' -p 5432 --no-privileges --no-owner > election.bak
--pg_restore -d 'election' election.bak



-- Extensions
CREATE EXTENSION postgis
CREATE EXTENSION pg_trgm



-- Import CSV 

CREATE TABLE IF NOT EXISTS temp_ward_tbl (
       election int,
       race int,
       race_name text,
       candidate int,
       drop_candidate_name text,
       ward int,
       race_date date,
       drop_dateN text,
       party text,
       drop_comboname text,
       candidate_name text,	
       office text,
       election_type text,
       race_id int,
       candidate_id int,
       ballots int,
       registered int,
       votes int,
       all_candidate_votes_in_ward int,
       drop_pct double precision,
       pct double precision,
       turnout double precision,
       rolloff double precision,
       winner int,
       stdcat int,
       stdmax double precision,
       stdmin double precision,
       race_candidate_count int,
       racemean double precision,
       racesd double precision,
       std double precision,
       pct_race int
);

CREATE TABLE IF NOT EXISTS temp_precinct_tbl (
       election int,
       race int,
       drop_race_name text,
       candidate int,
       drop_candidate_name text,
       votes int,
       race_date date,
       drop_race_date text,
       party text,
       drop_office text,	
       drop_comboname text,
       candidate_name text,	
       race_name text,
       wpid int,
       office text,
       election_type text,
       race_id int,
       candidate_id int,
       ballots int,
       registered int,
       turnout double precision,
       rolloff double precision,
       drop_pct double precision,
       pct double precision,
       winner int,
       stdcat int,
       stdmax double precision,
       stdmin double precision,
       race_candidate_count int,
       racemean double precision,
       racesd double precision,
       std double precision,
       pct_race int
);

CREATE TABLE temp_demography (
  ward int,
  display double precision,
  category text,
  label text,
  drop_demographic_category int,
  drop_demogsubcat int,
  measure_type text,
  mean double precision,
  demogsd double precision,
  std double precision,
  stdcat int,
  stdmax double precision,
  stdmin double precision,
  drop_idcat int
);

COPY temp_ward_tbl FROM
     '/Users/username/path/to/wards.csv'
     DELIMITER ',' CSV HEADER;

COPY temp_precinct_tbl FROM
     '/Users/username/path/to/precincts.csv'
     DELIMITER ',' CSV HEADER;

COPY temp_demography FROM
     '/Users/username/path/to/demography.csv'
     DELIMITER ',' CSV HEADER;



-- Production Tables

CREATE TABLE races (
  id int PRIMARY KEY,
  label text,
  race_date date,
  election_type text,
  office text,
  slug text UNIQUE
);

CREATE TABLE people (
  id int PRIMARY KEY,
  label text
);

CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  race int REFERENCES races,
  person int REFERENCES people,
  party text,
  pct int,
  race_position int,
  slug text UNIQUE
);

CREATE TABLE candidate_wards (
  candidate SERIAL REFERENCES candidates,
  ward int,
  stdcat int REFERENCES stdcats,
  votes int,
  pct int,
  PRIMARY KEY(candidate, ward)
);

CREATE TABLE candidate_precincts (
  candidate SERIAL REFERENCES candidates,
  wpid int,
  stdcat int REFERENCES stdcats,
  votes int,
  pct int,
  PRIMARY KEY(candidate, wpid)
);

CREATE TABLE candidate_ward_stdcats (
  candidate SERIAL REFERENCES candidates,
  stdcat int REFERENCES stdcats,
  stdmin int,
  stdmax int,
  PRIMARY KEY(candidate, stdcat)
);

CREATE TABLE candidate_precinct_stdcats (
  candidate SERIAL REFERENCES candidates,
  stdcat int REFERENCES stdcats,
  stdmin int,
  stdmax int,
  PRIMARY KEY(candidate, stdcat)
);

CREATE TABLE race_wards (
  race int REFERENCES races,
  ward int,
  votes_placed int,
  registered_voters int,
  turnout double precision,
  winner SERIAL REFERENCES candidates,
  PRIMARY KEY(race, ward)
);

CREATE TABLE race_precincts (
  race int REFERENCES races,
  wpid int,
  registered_voters int,
  turnout double precision,
  winner SERIAL REFERENCES candidates,
  PRIMARY KEY(race, wpid)
);
  

CREATE TABLE stdcats (
  stdcat int PRIMARY KEY,
  color text
);

CREATE TABLE positions (
  num int PRIMARY KEY,
  color text
);


CREATE TABLE demography_measures (
  measure text PRIMARY KEY,
  measure_type text,
  category text,
  mean double precision,
  sd double precision
);

CREATE TABLE demography_stdcats (
  measure text REFERENCES demography_measures ON DELETE CASCADE,
  stdcat int,
  stdmin double precision,
  stdmax double precision,
  PRIMARY KEY(measure, stdcat)
);

CREATE TABLE demography_wards (
  measure text REFERENCES demography_measures ON DELETE CASCADE,
  ward int,
  display double precision,
  stdcat int,
  std double precision,
  PRIMARY KEY(measure, ward)
);



-- Inserts

INSERT INTO races
  SELECT DISTINCT ON (race_id)
    race_id,
    race_name,
    race_date,
    election_type,
    office,
    race_date || '+' || race_id
  FROM temp_ward_tbl;

INSERT INTO people
  SELECT DISTINCT ON (candidate_id)
    candidate_id,
    candidate_name
  FROM temp_ward_tbl;

INSERT INTO candidates(race, person, party, pct, race_position, slug)
  WITH c AS (
    SELECT DISTINCT ON (race_id, candidate_id) *
    FROM temp_ward_tbl
  )
  SELECT race_id,
    candidate_id,
    party,
    pct_race,
    row_number() OVER w,
    race_date || '+' || race_id || '+' || row_number() OVER w 
  FROM c 
  WINDOW w AS (PARTITION BY race_id ORDER BY pct_race DESC);

INSERT INTO candidate_wards
  SELECT c.id,
    t.ward,
    t.stdcat,
    t.votes,
    t.pct
  FROM temp_ward_tbl t
  JOIN candidates c ON c.person=t.candidate_id;
  
INSERT INTO candidate_precincts
  SELECT c.id,
    t.wpid,
    t.stdcat,
    t.votes,
    t.pct
  FROM temp_precinct_tbl t
  JOIN candidates c ON c.person=t.candidate_id;

INSERT INTO candidate_ward_stdcats
  SELECT DISTINCT ON (c.id, t.stdcat) c.id,
    t.stdcat,
    t.stdmin,
    t.stdmax
  FROM temp_ward_tbl t
  JOIN candidates c ON t.candidate_id=c.person;

INSERT INTO candidate_precinct_stdcats
  SELECT DISTINCT ON (c.id, t.stdcat) c.id,
    t.stdcat,
    t.stdmin,
    t.stdmax
  FROM temp_precinct_tbl t
  JOIN candidates c ON t.candidate_id=c.person;

INSERT INTO race_wards
  SELECT DISTINCT ON (t.race_id, t.ward) t.race_id,
    t.ward,
    t.all_candidate_votes_in_ward,
    t.registered,
    t.turnout,
    c.id
  FROM temp_ward_tbl t
  JOIN candidates c ON t.winner=c.person;

INSERT INTO race_precincts
  SELECT DISTINCT ON (t.race_id, t.wpid) t.race_id,
    t.wpid,
    t.registered,
    t.turnout,
    c.id
  FROM temp_precinct_tbl t
  JOIN candidates c ON t.winner=c.person;


INSERT INTO demography_measures
  SELECT DISTINCT ON (label) label,
    measure_type,
    category,
    mean,
    demogsd
  FROM temp_demography;

INSERT INTO demography_stdcats
  SELECT DISTINCT ON (label, stdcat) label,
    stdcat,
    stdmin,
    stdmax
  FROM temp_demography;

INSERT INTO demography_wards
  SELECT label,
    ward,
    display,
    stdcat,
    std
  FROM temp_demography;


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



-- Views

CREATE MATERIALIZED VIEW autocompletions AS
  SELECT DISTINCT label AS race_keyword FROM races
  UNION
  SELECT DISTINCT label FROM people
  UNION
  SELECT DISTINCT measure FROM demography_measures;


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
  GROUP BY r.id;

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
   l.candidate = w.candidate;


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
   l.candidate = p.candidate;


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
  GROUP BY w.race;

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
    p.winner = c.id
  LEFT JOIN positions ON
    c.race_position = positions.num
  GROUP BY p.race;


CREATE MATERIALIZED VIEW demography_ward_maps AS
  WITH legends AS (
    SELECT ws.measure,
      json_agg(
        json_build_object(
	  'stdmin', ws.stdmin,
	  'stdmax', ws.stdmax,
          'color', s.color
        )
	ORDER BY ws.stdcat
      ) AS legend
    FROM demography_stdcats ws
    JOIN stdcats s ON
      ws.stdcat = s.stdcat
    GROUP BY ws.measure
  ),
  ward_groups AS (
    SELECT w.measure,
      json_object_agg(
        w.ward,
        s.color
      ) AS colors
    FROM demography_wards w
    JOIN stdcats s ON
      w.stdcat = s.stdcat
    GROUP BY w.measure
  )
  SELECT l.measure,
    l.legend,
    w.colors
  FROM legends l
  JOIN ward_groups w ON
    l.measure = w.measure;
