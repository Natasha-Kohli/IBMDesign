import db_connection
import datetime
import db_model_2
import csv
from time_chunk import week_chunk, month_chunk
from sqlalchemy import func, cast
from geoalchemy2 import Geometry
from haversine import haversine



def load_pickups(filename):
    session = db_connection.SESSIONMAKER()
    with open(filename,'r') as in_file:
        count = 0
        in_csv = csv.DictReader(in_file)
        for pickup in in_csv:
            pickup_loc = 'SRID=4326;POINT({} {})'.format(pickup['Lon'], pickup['Lat'])
            pickup_geo = func.ST_GeogFromText(pickup_loc)
            pickup_time = datetime.datetime.strptime(pickup['Date/Time'], "%m/%d/%Y %H:%M:%S")
            session.add(db_model_2.Pickup(time=pickup_time, base=pickup['Base'], location = pickup_geo, week_chunk = week_chunk(pickup_time), month_chunk = month_chunk(pickup_time)))
            if count % 10000 == 0:
                print(count)
            count += 1
    session.commit()

def location_chunk(bbox):
    # x is lat space, y is lon space
    max_x_dist = haversine((bbox["min_lat"], bbox["min_lon"]), (bbox["max_lat"], bbox["min_lon"]))
    max_y_dist = haversine((bbox["min_lat"], bbox["min_lon"]), (bbox["min_lat"], bbox["max_lon"]))

    x_nums, y_nums = 1000, 1000 # of cells in each axis
    x_cell_size = max_x_dist / x_nums # in km
    y_cell_size = max_y_dist / y_nums # in km

    session = db_connection.SESSIONMAKER()
    pickups = session.query(db_model_2.Pickup.id, func.ST_X(cast(db_model_2.Pickup.location, Geometry)), func.ST_Y(cast(db_model_2.Pickup.location, Geometry)))    

    print(pickups.count())
    count = 0
    for pickup in pickups:
        x_dist = haversine((bbox["min_lat"], bbox["min_lon"]), (pickup[2], bbox["min_lon"]))# dist along lat
        y_dist = haversine((bbox["min_lat"], bbox["min_lon"]), (bbox["min_lat"], pickup[1]))# dist along lon

        session.query(db_model_2.Pickup).\
            filter(db_model_2.Pickup.id == pickup[0]).\
            update({
                    "x_coordinate" : x_dist // x_cell_size,
                    "y_coordinate" : y_dist // y_cell_size
                    })
        if count % 10000 == 0:
            print(count)
        count += 1
    session.commit()