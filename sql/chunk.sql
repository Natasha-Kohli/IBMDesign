
CREATE OR REPLACE FUNCTION public.geodistance(alat double precision, alng double precision, blat double precision, blng double precision)
  RETURNS double precision AS
$BODY$
SELECT asin(
  sqrt(
    sin((radians($3)-radians($1))/2)^2 +
    sin((radians($4)-radians($2))/2)^2 *
    cos(radians($1)) *
    cos(radians($3))
  )
) * 6371.0088 * 2 AS distance;
$BODY$
  LANGUAGE sql IMMUTABLE
  COST 100;

\set minlat 39.6569
\set minlon -74.7737
\set maxlat 41.3182
\set maxlon -72.3359

-- \set maxxdist geodistance(:minlat, :minlon, :maxlat, :minlon)
-- \set maxydist geodistance(:minlat, :minlon, :minlat, :maxlon)

\set maxydist 208.6859689873085
\set maxxdist 184.7283867919681

\set xncells 1000
\set yncells 1000

-- \set xcellsize (:maxxdist / :xncells)
-- \set ycellsize (:maxydist / :yncells)

\set xcellsize 0.1847283867919681
\set ycellsize 0.2086859689873085

UPDATE ride SET
clusterx = (geodistance(:minlat, :minlon, lat, :minlon) / :xcellsize)::int,
clustery = (geodistance(:minlat, :minlon, :minlat, lon) / :ycellsize)::int;
