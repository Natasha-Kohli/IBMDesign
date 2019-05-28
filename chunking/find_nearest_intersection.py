from haversine import haversine
import csv
import db_connection
import db_model
from sqlalchemy import func
import datetime

def find_nearest_intersection(pickup_file):
    db_connection.connect("130_project")
    session = db_connection.SESSIONMAKER()
    with open(pickup_file, 'r') as pickup_file:
        pickups = csv.DictReader(pickup_file)
        count = 0
        start = datetime.datetime.now()
        for pickup in pickups:
            pickup_loc = 'SRID=4326;POINT({} {})'.format(pickup['Lon'], pickup['Lat'])
            pickup_geo = func.ST_GeogFromText(pickup_loc)
            nearest = session.query(db_model.Intersection.id, func.ST_Distance(pickup_geo, db_model.Intersection.location)).\
                filter(func.ST_DWithin(db_model.Intersection.location, pickup_geo, 200)).\
                order_by(func.ST_Distance(pickup_geo, db_model.Intersection.location).asc()).first()
            # if nearest is None:
            #     nearest = session.query(db_model.Intersection.id, func.ST_Distance(pickup_geo, db_model.Intersection.location)).\
            #     filter(func.ST_DWithin(db_model.Intersection.location, pickup_geo, 2500)).\
            #     order_by(func.ST_Distance(pickup_geo, db_model.Intersection.location).asc()).first()
            if nearest is None:
                nearest = session.query(db_model.Intersection.id, func.ST_Distance(pickup_geo, db_model.Intersection.location)).\
                filter(func.ST_DWithin(db_model.Intersection.location, pickup_geo, 5000)).\
                order_by(func.ST_Distance(pickup_geo, db_model.Intersection.location).asc()).first()
            # if nearest is None:
            #     nearest = session.query(db_model.Intersection.id, func.ST_Distance(pickup_geo, db_model.Intersection.location)).\
            #     filter(func.ST_DWithin(db_model.Intersection.location, pickup_geo, 10000)).\
            #     order_by(func.ST_Distance(pickup_geo, db_model.Intersection.location).asc()).first()
            if nearest is None:
                nearest = session.query(db_model.Intersection.id, func.ST_Distance(pickup_geo, db_model.Intersection.location)).\
                order_by(func.ST_Distance(pickup_geo, db_model.Intersection.location).asc()).first()
            nearest = nearest[0]
            session.add(db_model.Pickup(time = datetime.datetime.strptime(pickup['Date/Time'], "%m/%d/%Y %H:%M:%S"), base = pickup['Base'], location = pickup_geo, intersection=nearest))
            if count % 10000 == 0:
                stop = datetime.datetime.now()
                print((stop - start).total_seconds(), count)
                start = datetime.datetime.now()
            count += 1
    
    session.commit()
    session.close()


    # ST_DWithin(geomcol::geography,ST_SetSRID(ST_MakePoint(6.9333,46.8167),4326)::geography,30 * 1609.34)
    # select location from intersection group by location order by ST_DWithin(geomcol::geography, STST_GeogFromText('SRID=4326;POINT(-73.9549 40.769)'), 100) asc limit 1;
