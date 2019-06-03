from haversine import haversine
import csv
import db_connection
import db_model
from sqlalchemy import func
import datetime
from time_chunk import week_chunk, month_chunk

def chunk_files():
    db_connection.connect("130_project")
    for i in ["apr", "aug","jul","jun", "may", "sep"]:
        chunk("uber-raw-data-{}14.csv".format(i))

def chunk(pickup_file):
    session = db_connection.SESSIONMAKER()
    with open(pickup_file, 'r') as pickup_file:
        pickups = csv.DictReader(pickup_file)
        count = 0
        ditched = 0
        start = datetime.datetime.now()
        for pickup in pickups:
            pickup_loc = 'SRID=4326;POINT({} {})'.format(pickup['Lon'], pickup['Lat'])
            pickup_geo = func.ST_GeogFromText(pickup_loc)
            nearest = session.query(db_model.Intersection.id, func.ST_Distance(pickup_geo, db_model.Intersection.location)).\
                filter(func.ST_DWithin(db_model.Intersection.location, pickup_geo, 200)).\
                order_by(func.ST_Distance(pickup_geo, db_model.Intersection.location).asc()).first()
            if nearest is None:
                ditched += 1
                continue
            nearest = nearest[0]
            pickup_time = datetime.datetime.strptime(pickup['Date/Time'], "%m/%d/%Y %H:%M:%S")
            session.add(db_model.Pickup(time = pickup_time, base = pickup['Base'], location = pickup_geo, intersection=nearest, week_chunk = week_chunk(pickup_time), month_chunk = month_chunk(pickup_time)))
            if count % 10000 == 0:
                stop = datetime.datetime.now()
                print((stop - start).total_seconds(), count, ditched)
                start = datetime.datetime.now()
            count += 1
    
    session.commit()
    session.close()