from haversine import haversine
import json
import psycopg2
import queue
import os
from sklearn.ensemble import RandomForestClassifier
from joblib import load
import googlemaps


GEOCODING_API_KEY_FILE = 'GEOCODING_API_KEY.txt'
GEOCODING_API_KEY_DIR = '../../'
gmaps = None


CLF_NAME = 'randf_trained.joblib'
MODEL_DIR = '../../'
clf = load(os.path.join(MODEL_DIR, CLF_NAME))


#Chunking constants based on dataset - may change if dataset changes
MIN_LAT, MIN_LON, MAX_LAT, MAX_LON = 39.6569, -74.7737, 41.3182, -72.3359
X_NUM_CELLS, Y_NUM_CELLS = 1000, 1000

MAX_X_DIST = haversine((MIN_LAT, MIN_LON), (MAX_LAT, MIN_LON))
MAX_Y_DIST = haversine((MIN_LAT, MIN_LON), (MIN_LAT, MAX_LON))

X_CELL_SIZE = MAX_X_DIST / X_NUM_CELLS # in km
Y_CELL_SIZE = MAX_Y_DIST / Y_NUM_CELLS # in km


class LatLonCache():
    def __init__(self):
        self.kvstore = {}

    def __to_str(self, lat, lon):
        lat_str = f'{lat:.9f}'
        lon_str = f'{lon:.9}f'
        return lat_str + '|' + lon_str

    def put(self, lat, lon, value):
        self.kvstore[self.__to_str(lat, lon)] = value

    def get(self, lat, lon):
        rep = self.__to_str(lat, lon)
        if rep in self.kvstore:
            return self.kvstore[rep]
        else:
            return None

# Returns ClusterCoordinateX, ClusterCoordinateY
def loc_to_cluster(lat, lon):
    x_dist = haversine((MIN_LAT, MIN_LON), (lat, MIN_LON))# dist along lat
    y_dist = haversine((MIN_LAT, MIN_LON), (MIN_LAT, lon))# dist along lon
    return x_dist // X_CELL_SIZE, y_dist // Y_CELL_SIZE

def get_gmaps_client():
    global gmaps
    if gmaps is None:
        with open(os.path.join(GEOCODING_API_KEY_DIR, GEOCODING_API_KEY_FILE), 'r') as f:
            key = f.read()
            gmaps = googlemaps.Client(key=key)
    return gmaps


def get_adj_clusters(lat, lon, radius, startChunkIdx, endChunkIdx, cursor):

    #query = """
    #select
    #(min(lat) + max(lat)) / 2 as lat, 
    #(min(lon) + max(lon)) / 2 as lon, 
    #clusterx, clustery, chunk_idx from ride 
    #where chunk_idx between %(start_idx)s and %(end_idx)s
    #and ST_DWithin(geom, ST_MakePoint(%(lon)s, %(lat)s)::geography, %(radius)s) 
    #group by clusterx, clustery, chunk_idx;"""

    query = """
    select
    (array_agg(lat))[1] as lat,
    (array_agg(lon))[1] as lon,
    clusterx, clustery, chunk_idx from ride 
    where chunk_idx between %(start_idx)s and %(end_idx)s
    and ST_DWithin(geom, ST_MakePoint(%(lon)s, %(lat)s)::geography, %(radius)s) 
    group by clusterx, clustery, chunk_idx;"""
    
    cursor.execute(query, {'lat' : lat, 'lon' : lon, 'radius' : radius, 'start_idx' : startChunkIdx, 'end_idx' : endChunkIdx})
    rows = cursor.fetchall()
    
    return rows

def get_chunk_idx(hour, minute):
    return 4 * hour + minute // 15

def get_row_with_pred(row, clf, day_week, day_month, cache, cd_map):

    lat, lon = row[0], row[1]
    if (row[2], row[3]) not in cd_map:
        cd_map[(row[2], row[3])] = (lat, lon)
    else:
        r = cd_map[(row[2], row[3])]
        lat, lon = r[0], r[1]
        
    return {'lat' : lat,
            'lon' : lon,
            'nrides' : clf.predict([[row[2], row[3], day_week, day_month, row[4]]]).tolist()[0],
            'minute_offset' : row[4],
            'name' : None}


def get_place_name(lat, lon, cache):
    place_str = cache.get(lat, lon)
    
    if place_str is None:
        gmap = get_gmaps_client()
        res = gmap.reverse_geocode((lat, lon), result_type='street_address')
        place_str = "Unknown"
        
        for r in res:
            if 'formatted_address' in r:
                place_str = r['formatted_address']
                break
            else:
                print(r)

        if place_str == "Unknown":
            res = gmap.reverse_geocode((lat, lon))
            if len(res) > 0 and 'formatted_address' in res[0]:
                place_str = res[0]['formatted_address']

        cache.put(lat, lon, place_str)

    return place_str
    

def get_ranked_clusters(adj_clusters, startChunkIdx, start, day_week, day_month, limit, cursor, cache):
    global clf

    cd_map = {}
    
    clusters = [get_row_with_pred(row, clf, day_week, day_month, cache, cd_map) for row in adj_clusters]
    clusters.sort(key=(lambda row : row['nrides']))
    if limit > 0:
        clusters = clusters[:limit]

    for cluster in clusters:            
        cluster['name'] = get_place_name(cluster['lat'], cluster['lon'], cache)
        cluster['minute_offset'] = (cluster['minute_offset'] - startChunkIdx) * 15
        cluster['rating'] = cluster['nrides'] / start

    return clusters

    

def recommend(lat, lon, radius, nrows, day_week, day_month, hour_start, minute_start, hour_end, minute_end):
    global clf
    
    try:
        # REPLACE WITH YOUR OWN DETAILS
        connection = psycopg2.connect(user='amit',
                                      host='127.0.0.1',
                                      port='5432',
                                      database='uber')
        cursor = connection.cursor()
        
        cache = LatLonCache()
        
        startChunkIdx = get_chunk_idx(hour_start, minute_start)
        endChunkIdx = get_chunk_idx(hour_end, minute_end)

        startCluster = loc_to_cluster(lat, lon)

        start = clf.predict([[startCluster[0], startCluster[1], day_week, day_month, startChunkIdx]]).tolist()[0]
        adj_clusters = get_adj_clusters(lat, lon, radius, startChunkIdx, endChunkIdx, cursor)
        suggestions = get_ranked_clusters(adj_clusters, startChunkIdx, start, day_week, day_month, nrows, cursor, cache)
        return {'suggestions' : suggestions, 'start' : start}
        
    except (Exception, psycopg2.Error) as error:
        print('Error while connecting to DB')
        print(error)
    finally:
        if connection:
            cursor.close()
            connection.close()
        
