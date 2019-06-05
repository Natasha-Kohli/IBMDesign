
DROP TABLE IF EXISTS ride;

CREATE TABLE ride(
       id int,
       time timestamp,
       point text,
       base char(6),
       clusterx int,
       clustery int,
       week int,
       month int
);

\copy ride (id, time, point, base, clusterx, clustery, week, month) FROM '~/Downloads/grid_chunked.csv' WITH DELIMITER ',' QUOTE '"' CSV HEADER;

alter table ride add column geog geography(POINT, 4326);
update ride set geog = ST_geogFromText(point);

alter table ride
drop column id,
drop column point,
drop column base;

CREATE INDEX ride_idx
  ON ride
  USING GIST (geog);
