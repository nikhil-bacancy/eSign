#!/bin/bash


# Migration Shell Script
# Migrate SQl files from ./migrations/ to Database.

echo '----------------------------------------------------------'
echo 'Migrate App Schema into your database, before that please provide access information of you database'
echo '----------------------------------------------------------'
echo 'enter username:'
read username
echo 'enter password:'
read -s password
echo 'enter database name:'
read dbname
echo 'enter host:'
read host
echo 'enter db port:'
read port

export export DATABASE_URL=postgres://"$username":"$password"@"$host":"$port"/"$dbname"

npm run-script migrate up

echo "migrated!"
