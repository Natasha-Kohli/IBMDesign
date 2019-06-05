from haversine import haversine
import json
import psycopg2
import queue
import os
from sklearn.ensemble import RandomForestClassifier
from joblib import load


#Chunking constants based on dataset - may change if dataset changes
MIN_LAT, MIN_LON, MAX_LAT, MAX_LON = 39.6569, -74.7737, 41.3182, -72.3359
X_NUM_CELLS, Y_NUM_CELLS = 1000, 1000

MAX_X_DIST = haversine((MIN_LAT, MIN_LON), (MAX_LAT, MIN_LON))
MAX_Y_DIST = haversine((MIN_LAT, MIN_LON), (MIN_LAT, MAX_LON))

X_CELL_SIZE = MAX_X_DIST / X_NUM_CELLS # in km
Y_CELL_SIZE = MAX_Y_DIST / Y_NUM_CELLS # in km


CLF_NAME = 'randf_trained.joblib'
MODEL_DIR = '../../..'
clf = None


def get_clf():
    global clf
    if not clf:
        clf = load(os.path.join(MODEL_DIR, CLF_NAME))
    return clf

# Returns ClusterCoordinateX, ClusterCoordinateY
def loc_to_cluster(lat, lon):
    x_dist = haversine((MIN_LAT, MIN_LON), (lat, MIN_LON))# dist along lat
    y_dist = haversine((MIN_LAT, MIN_LON), (MIN_LAT, lon))# dist along lon
    return x_dist // X_CELL_SIZE, y_dist // Y_CELL_SIZE
    

def get_adj_clusters(lat, lon, radius, cursor):
    query= """select clusterx, clustery from ride 
    where ST_DWithin(geom, ST_MakePoint(%(lon)s, %(lat)s)::geography, %(radius)s)
    group by clusterx, clustery"""

    cursor.execute(query, {'lat' : lat, 'lon' : lon, 'radius' : radius})
    rows = cursor.fetchall()
    return rows

def get_random_point(clusterx, clustery, cursor):
    query="""select lat, lon from ride
    where clusterx=%(clusterx)s and clustery = %(clustery)s
    limit 1"""
    cursor.execute(query, {'clusterx' : clusterx, 'clustery' : clustery})
    rows = cursor.fetchall()
    return rows[0]

def get_chunk_idx(hour, minute):
    return 4 * hour + minute // 15

def get_row_with_pred(row, clf, day, month, chunkIdx, cursor):
    point = get_random_point(row[0], row[1], cursor)
    return {'lat' : point[0],
            'lon' : point[1],
            'nrides' : clf.predict([[row[0], row[1], day, month, chunkIdx]]).tolist()[0]}

def get_ranked_clusters(adj_clusters, day, month, chunkIdx, limit, cursor):
    clf = get_clf()
    clusters = [get_row_with_pred(row, clf, day, month, chunkIdx, cursor) for row in adj_clusters]
    clusters.sort(reverse=True, key=(lambda row : row['nrides']))
    if limit > 0:
        return clusters[:limit]
    else:
        return clusters

def recommend(lat, lon, radius, nrows, day, month, hour, minute):    
    try:
        # REPLACE WITH YOUR OWN DETAILS
        connection = psycopg2.connect(user='amit',
                                      host='127.0.0.1',
                                      port='5432',
                                      database='uber')
        cursor = connection.cursor()
        adj_clusters = get_adj_clusters(lat, lon, radius, cursor)
        chunkIdx = get_chunk_idx(hour, minute)
        return get_ranked_clusters(adj_clusters, day, month, chunkIdx, nrows, cursor)
        
    except (Exception, psycopg2.Error) as error:
        print('Error while connecting to DB')
        print(error)
    finally:
        if connection:
            cursor.close()
            connection.close()

