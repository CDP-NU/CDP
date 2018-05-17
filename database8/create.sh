#!/bin/bash

database=${1:-election}

psql --command="DROP DATABASE IF EXISTS $database"
psql --command="CREATE DATABASE $database"

psql --dbname "$database" -f extensions.sql
pg_restore --dbname "$database" precinct2015.bak
psql --dbname "$database" -f database.sql
