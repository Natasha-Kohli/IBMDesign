from haversine import haversine
import queue


#Chunking constants based on dataset - may change if dataset changes
MIN_LAT, MIN_LON, MAX_LAT, MAX_LON = 39.6569, -74.7737, 41.3182, -72.3359
X_NUM_CELLS, Y_NUM_CELLS = 1000, 1000

MAX_X_DIST = haversine((MIN_LAT, MIN_LON), (MAX_LAT, MIN_LON))
MAX_Y_DIST = haversine((MIN_LAT, MIN_LON), (MIN_LAT, MAX_LON))

X_CELL_SIZE = MAX_X_DIST / X_NUM_CELLS # in km
Y_CELL_SIZE = MAX_Y_DIST / Y_NUM_CELLS # in km

# Returns ClusterCoordinateX, ClusterCoordinateY
def loc_to_cluster(lat, lon):
    x_dist = haversine((MIN_LAT, MIN_LON), (lat, MIN_LON))# dist along lat
    y_dist = haversine((MIN_LAT, MIN_LON), (MIN_LAT, lon))# dist along lon
    return x_dist // X_CELL_SIZE, y_dist // Y_CELL_SIZE
    

def get_adj_clusters(cluster_x, cluster_y, num):
    cluster_set = set()

    q = queue.Queue()

    while len(cluster_set) < num or not q.empty():
        


 
