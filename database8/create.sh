#!/bin/bash

database=${1:-election}

psql -—command="DROP DATABASE IF EXISTS $database"
psql --command="CREATE DATABASE $database"

psql --dbname "$database" -f extensions.sql
# ER: I'm not entirely sure why we're restoring the 2015 precinct database in addition to creating a new one.  
# Possible that some records are not in the csv and only in the backup?  We should change that to preserve parallel structure
#pg_restore --dbname "$database" precinct2015.bak
psql --dbname "$database" -f database.sql
