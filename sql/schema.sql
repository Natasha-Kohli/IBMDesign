
DROP TABLE IF EXISTS ride;

CREATE TABLE ride(
       time timestamp,
       lat float(5),
       lon float(5),
       base char(6),
       clusterx int default 0,
       clustery int default 0
);
