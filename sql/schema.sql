
DROP TABLE IF EXISTS ride;

CREATE TABLE ride(
       id int,
       time timestamp,
       lat float(10),
       lon float(10),
       day_week int,
       day_month int,
       chunk_idx int,
       clusterx int,
       clustery int
);

\copy ride FROM '~/Downloads/db_all_aug14box.csv' WITH DELIMITER ',' QUOTE '"' CSV HEADER;

SELECT AddGeometryColumn('ride', 'geom', 4326, 'POINT', 2);
UPDATE ride SET geom = ST_SetSRID(ST_MakePoint(lon, lat), 4326);

alter table ride
drop column id;

CREATE INDEX ride_idx
  ON ride
  USING GIST (geom);
