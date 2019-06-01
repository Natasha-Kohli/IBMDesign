import matplotlib.pyplot as plt
from matplotlib import cm
import pandas as pd
import geopandas as gpd
from haversine import haversine
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from joblib import dump, load


DATA_FILE =  '~/Documents/CS130/project/uber-tlc-foil-response/uber-trip-data/uber-raw-data-aug14.csv'

def cluster_coordinate(lat, lon):
    x_dist = haversine((min_lat, min_lon), (lat, min_lon))# dist along lat
    y_dist = haversine((min_lat, min_lon), (min_lat, lon))# dist along lon
    
    return x_dist // x_cell_size, y_dist // y_cell_size


# split dataset into (train, test)
# For now, splitting on all data tuples, not separating based on cluster
def split(dataset, train_fraction):
    msk = np.random.rand(len(dataset)) < train_fraction
    return dataset[msk], dataset[~msk]



uber_data = pd.read_csv(DATA_FILE)

uber_data['Date/Time'] = pd.to_datetime(uber_data['Date/Time'], format="%m/%d/%Y %H:%M:%S")
uber_data['DayOfWeekNum'] = uber_data['Date/Time'].dt.dayofweek
uber_data['DayOfWeek'] = uber_data['Date/Time'].dt.weekday_name
uber_data['MonthDayNum'] = uber_data['Date/Time'].dt.day
uber_data['HourOfDay'] = uber_data['Date/Time'].dt.hour
uber_data['ChunkIndex'] = 4*uber_data['HourOfDay'] + uber_data['Date/Time'].dt.minute // 15 # which 15-minute block within the day is it in

# x is lat space, y is lon space
min_lat, min_lon = min(uber_data['Lat']), min(uber_data['Lon'])
max_lat, max_lon = max(uber_data['Lat']), max(uber_data['Lon'])

max_x_dist = haversine((min_lat, min_lon), (max_lat, min_lon))
max_y_dist = haversine((min_lat, min_lon), (min_lat, max_lon))

print(f'min_lat {min_lat}, min_lon {min_lon}, max_lat {max_lat}, max_lon {max_lon}')

x_nums, y_nums = 1000, 1000 # of cells in each axis
x_cell_size = max_x_dist / x_nums # in km
y_cell_size = max_y_dist / y_nums # in km

# add cluster coordinates to all entries in uber data
uber_data['ClusterCoordinateX'] = uber_data.apply(lambda row: int(cluster_coordinate(row['Lat'], row['Lon'])[0]), axis=1)
uber_data['ClusterCoordinateY'] = uber_data.apply(lambda row: int(cluster_coordinate(row['Lat'], row['Lon'])[1]), axis=1)

# count rides per 15-minute chunk for each (chunkindex, monthdaynum, dayofweeknum, coordX, coordY) as key
uber_rides_count = uber_data.pivot_table(index=[ 'ClusterCoordinateX', 'ClusterCoordinateY', 'DayOfWeekNum', 'MonthDayNum', 'ChunkIndex'],
                                  values='Base',
                                  aggfunc='count')

dataset = uber_rides_count

train, test = split(dataset, .8)
features = dataset.columns[:5] # coordX, coordY, dayofweeknum, monthdaynum, chunkindex


clf = RandomForestClassifier(n_estimators=20)
clf.fit(train[features], train['Base'])
dump(clf, 'trained_rfclassifier.joblib')

