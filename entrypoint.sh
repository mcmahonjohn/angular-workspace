#!/bin/bash
set -e

# Start PostgreSQL
service postgresql start

# If IMPORT_OSM is set, import the OSM file
if [ "$IMPORT_OSM" = "1" ]; then
  if [ -f /data/map.osm.pbf ]; then
    echo "Importing OSM data..."
    sudo -u postgres createdb -O postgres gis || true
    sudo -u postgres psql -d gis -c 'CREATE EXTENSION IF NOT EXISTS postgis;' || true
    sudo -u postgres osm2pgsql -d gis --create --slim -C 2000 --hstore --number-processes 4 /data/map.osm.pbf
    echo "Import complete."
  else
    echo "/data/map.osm.pbf not found. Skipping import."
  fi
  exit 0
fi

# Start renderd and Apache for tile serving
service renderd start
service apache2 restart

echo "Tile server is running. Access it at http://localhost/tiles/{z}/{x}/{y}.png"
tail -f /var/log/apache2/*log
