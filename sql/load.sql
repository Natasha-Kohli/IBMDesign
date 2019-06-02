
\copy ride (time, lat, lon, base) FROM '~/Documents/CS130/project/uber-tlc-foil-response/uber-trip-data/uber-raw-data-aug14.csv' WITH DELIMITER ',' QUOTE '"' CSV HEADER;
